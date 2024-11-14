package http

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"path"
	"strings"
	"time"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/httplog/v2"
)

//go:embed dist/*
var frontendFS embed.FS

func SPAHandler() http.HandlerFunc {
	spaFS, err := fs.Sub(frontendFS, "dist")
	if err != nil {
		panic(fmt.Errorf("failed getting the sub tree for the site files: %w", err))
	}
	return func(w http.ResponseWriter, r *http.Request) {
		f, err := spaFS.Open(strings.TrimPrefix(path.Clean(r.URL.Path), "/"))
		if err == nil {
			defer f.Close()
		}
		if os.IsNotExist(err) {
			r.URL.Path = "/"
		}
		http.FileServer(http.FS(spaFS)).ServeHTTP(w, r)
	}
}

func InitRouter(v1ListEnvsHandler http.HandlerFunc, logger *httplog.Logger) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)

	r.Use(httplog.RequestLogger(logger))

	// Set a timeout value on the request context (ctx), that will signal
	// through ctx.Done() that the request has timed out and further
	// processing should be stopped.
	r.Use(middleware.Timeout(60 * time.Second))

	r.Handle("/*", SPAHandler())

	r.Route("/api", func(r chi.Router) {
		r.Route("/v1", func(r chi.Router) {
			r.Get("/environments", v1ListEnvsHandler)
		})
	})

	logger.Info("http router built")

	return r
}
