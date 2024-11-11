package main

import (
	"log/slog"
	"time"

	stdHttp "net/http"

	"github.com/docker/docker/client"
	"github.com/go-chi/httplog/v2"
	"github.com/google/go-github/v66/github"
	"github.com/trento-project/werkzeugoffer/egeria/internal/environment"
	"github.com/trento-project/werkzeugoffer/egeria/internal/http"
)

func main() {
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

	githubClient := github.NewClient(nil)

	apiLogger.Info("starting")

	registry := environment.NewRegistry(cli, githubClient)

	v1ListEnvsHandler := http.NewV1ListEnvsHandler(registry)
	router := http.InitRouter(v1ListEnvsHandler, apiLogger)

	apiLogger.Info("started")

	stdHttp.ListenAndServe("localhost:4040", router)

	// envs, err := registry.ListEnvs(ctx)
	// if err != nil {
	// 	fmt.Printf("ERROR %v", err)
	// 	os.Exit(1)
	// }

	// for _, e := range envs {
	// 	fmt.Printf(
	// 		"ID:%s\nName: %s \nImage: %s\nStatus: %s\nCreated:%s\nCommit:%s\nAuthor:%s\nPr:%s\nSync Status:%s\nDangling?:%v\n---------\n\n",
	// 		e.ID,
	// 		e.Name,
	// 		e.Image,
	// 		e.Status,
	// 		e.CreatedAt.Format(time.RFC3339),
	// 		e.Revision.Commit,
	// 		e.Revision.Author,
	// 		e.Revision.PR,
	// 		e.SyncStatus,
	// 		e.Dangling,
	// 	)
	// }
}
