package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"strconv"
	"time"

	stdHttp "net/http"

	"github.com/docker/docker/client"
	"github.com/go-chi/httplog/v2"
	"github.com/google/go-github/v66/github"
	"github.com/jferrl/go-githubauth"
	"github.com/trento-project/werkzeugoffer/egeria/internal/environment"
	"github.com/trento-project/werkzeugoffer/egeria/internal/http"
	"golang.org/x/oauth2"
)

// We exclude that variables from linting
// because we explicitly use that
// in the ldflags at build time
var Version string //nolint

func mustHaveEnv(name string) string {
	value := os.Getenv(name)
	if value == "" {
		panic(fmt.Sprintf("env %s not provided, aborting init", value))
	}
	return value
}

func main() {
	appCtx := context.Background()

	privateKey := []byte(mustHaveEnv("GITHUB_APP_PRIVATE_KEY"))
	appID, err := strconv.ParseInt(mustHaveEnv("GITHUB_APP_ID"), 10, 64)
	if err != nil {
		panic(err)
	}
	installationID, err := strconv.ParseInt(mustHaveEnv("GITHUB_INSTALLATION_ID"), 10, 64)
	if err != nil {
		panic(err)
	}

	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		panic(err)
	}
	defer cli.Close()

	apiLogger := httplog.NewLogger("egeria", httplog.Options{
		// JSON:             true,
		LogLevel:         slog.LevelDebug,
		Concise:          true,
		RequestHeaders:   true,
		MessageFieldName: "message",
		TimeFieldFormat:  time.RFC850,
		Tags: map[string]string{
			"env": "dev",
		},
		QuietDownPeriod: 10 * time.Second,
	})

	appTokenSource, err := githubauth.NewApplicationTokenSource(appID, []byte(privateKey))
	if err != nil {
		fmt.Println("Error creating application token source:", err)
		return
	}

	installationTokenSource := githubauth.NewInstallationTokenSource(installationID, appTokenSource)
	githubHttpClient := oauth2.NewClient(appCtx, installationTokenSource)
	githubClient := github.NewClient(githubHttpClient)

	apiLogger.Info("starting", "version", Version)

	registry := environment.NewRegistry(cli, githubClient)

	v1ListEnvsHandler := http.NewV1ListEnvsHandler(registry)
	router := http.InitRouter(v1ListEnvsHandler, apiLogger)

	apiLogger.Info("started on port :4040")

	stdHttp.ListenAndServe("localhost:4040", router)
}
