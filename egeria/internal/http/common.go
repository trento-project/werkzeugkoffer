package http

import (
	"net/http"

	"github.com/go-chi/render"
)

type ErrorResponse struct {
	Temporary  bool  `json:"temporary"`
	Err        error `json:"error"`
	StatusCode int   `json:"-"`
}

func (e *ErrorResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.StatusCode)
	return nil
}

type ResponseEnvelope struct {
	Data any `json:"data"`
}

func (e *ResponseEnvelope) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, 200)
	return nil
}
