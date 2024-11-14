package environment

import (
	"context"
	"fmt"
	"slices"
	"strconv"
	"strings"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
	dockerclient "github.com/docker/docker/client"
	"github.com/google/go-github/v66/github"
)

type environmentContainerLabels struct {
	version  string
	revision string
}

type Registry struct {
	dockerClient *dockerclient.Client
	githubClient *github.Client
}

func NewRegistry(dockerClient *dockerclient.Client, githubClient *github.Client) *Registry {
	return &Registry{
		dockerClient: dockerClient,
		githubClient: githubClient,
	}
}

func (r *Registry) ListEnvs(ctx context.Context) ([]Instance, error) {
	containers, err := r.dockerClient.ContainerList(ctx, container.ListOptions{
		Filters: filters.NewArgs(
			filters.Arg("name", "web"),
		),
	})

	if err != nil {
		return nil, fmt.Errorf("could not list the container environments %w", err)
	}

	var instances []Instance

	for _, c := range containers {
		name := strings.Join(c.Names, "-")
		labels, err := r.extractEnvironentLabels(ctx, c)
		if err != nil {
			return nil, err
		}
		revision, err := r.environmentRevisionData(ctx, labels.revision, labels.version)
		if err != nil {
			return nil, err
		}

		syncStatus, dangling, err := r.environmentSync(ctx, labels.version)
		if err != nil {
			return nil, err
		}

		instances = append(instances, Instance{
			Name:       name,
			ID:         c.ID,
			Image:      c.Image,
			CreatedAt:  time.Unix(c.Created, 0),
			Status:     c.Status,
			Revision:   *revision,
			SyncStatus: syncStatus,
			Dangling:   dangling,
		})
	}

	return instances, nil
}

func (r *Registry) environmentRevisionData(ctx context.Context, revision string, version string) (*Revision, error) {
	versionParts := strings.Split(version, "-")
	prNumber := versionParts[1]
	rc, gr, err := r.githubClient.Repositories.GetCommit(ctx, "trento-project", "web", revision, &github.ListOptions{})
	if err != nil {
		return nil, fmt.Errorf("could not fetch commit with revision: %s - error: %w", revision, err)
	}
	if gr.StatusCode != 200 {
		return nil, fmt.Errorf("could not fetch commit with revision: %s - github status code: %d", revision, gr.StatusCode)
	}

	return &Revision{
		PR:     version,
		PRLink: "https://github.com/trento-project/web/pull/" + prNumber,
		Commit: *rc.Commit.Message,
		Author: *rc.Author.Login,
	}, nil
}

func (r *Registry) environmentSync(ctx context.Context, version string) (SyncStatus, bool, error) {
	versionParts := strings.Split(version, "-")
	prNumber, err := strconv.ParseInt(versionParts[1], 10, 32)
	if err != nil {
		return NOT_SYNCED, true, nil
	}
	pr, gr, err := r.githubClient.PullRequests.Get(ctx, "trento-project", "web", int(prNumber))
	if err != nil {
		return NOT_SYNCED, false, fmt.Errorf("could not fetch pr with number: %d - error: %w", prNumber, err)
	}
	if gr.StatusCode != 200 {
		return NOT_SYNCED, false, fmt.Errorf("could not fetch pr with number: %d - github status code: %d", prNumber, gr.StatusCode)
	}

	// pr is merged, env is dangling
	if pr.GetMerged() {
		return NOT_SYNCED, true, nil
	}

	prHasEnvLabel := slices.ContainsFunc(pr.Labels, func(l *github.Label) bool {
		return *l.Name == "env"
	})

	if prHasEnvLabel {
		return SYNCED, false, nil
	}

	return PAUSED, false, nil
}

func (r *Registry) extractEnvironentLabels(ctx context.Context, container types.Container) (*environmentContainerLabels, error) {
	inspectOutput, err := r.dockerClient.ContainerInspect(ctx, container.ID)
	if err != nil {
		return nil, fmt.Errorf("could not inspect container with id: %s - error %w", container.ID, err)
	}

	revision, found := inspectOutput.Config.Labels["org.opencontainers.image.revision"]
	if !found {
		return nil, fmt.Errorf("could not extract revision for container: %s", container.ID)
	}

	version, found := inspectOutput.Config.Labels["org.opencontainers.image.version"]
	if !found {
		return nil, fmt.Errorf("could not extract version for container: %s", container.ID)
	}

	return &environmentContainerLabels{
		version:  version,
		revision: revision,
	}, nil
}
