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

	apiLogger.Info("started on port :4040")

	stdHttp.ListenAndServe("localhost:4040", router)
}
