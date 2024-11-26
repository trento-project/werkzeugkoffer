package http

import (
	"net/http"
	"time"

	"github.com/go-chi/httplog/v2"
	"github.com/go-chi/render"
	"github.com/trento-project/werkzeugoffer/egeria/internal/environment"
)

type ListEnvsRevisionResponse struct {
	PR     string `json:"pr"`
	PRLink string `json:"pr_link"`
	Commit string `json:"commit"`
	Author string `json:"author"`
}

type ListEnvsResponse struct {
	ID         string                   `json:"id"`
	Name       string                   `json:"name"`
	Image      string                   `json:"image"`
	Status     string                   `json:"status"`
	SyncStatus string                   `json:"sync_status"`
	Dangling   bool                     `json:"dangling"`
	CreatedAt  time.Time                `json:"created_at"`
	Revision   ListEnvsRevisionResponse `json:"revision"`
}

func NewV1ListEnvsHandler(registry *environment.Registry) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		environments, err := registry.ListEnvs(r.Context())
		logger := httplog.LogEntry(r.Context())
		if err != nil {
			logger.Error("error during environment fetching", "error", err)
			render.Render(w, r, &ErrorResponse{
				Temporary:  false,
				Err:        err,
				StatusCode: 500,
			})
		}

		var listEnvsResponse []ListEnvsResponse

		for _, environment := range environments {
			listEnvsResponse = append(listEnvsResponse, ListEnvsResponse{
				ID:         environment.ID,
				Name:       environment.Name,
				Image:      environment.Image,
				Status:     environment.Status,
				SyncStatus: string(environment.SyncStatus),
				Dangling:   environment.Dangling,
				CreatedAt:  environment.CreatedAt,
				Revision: ListEnvsRevisionResponse{
					PR:     environment.Revision.PR,
					PRLink: environment.Revision.PRLink,
					Commit: environment.Revision.Commit,
					Author: environment.Revision.Author,
				},
			})
		}

		render.Render(w, r, &ResponseEnvelope{
			Data: listEnvsResponse,
		})
	}
}
