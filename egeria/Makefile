VERSION ?= $(shell ./hack/get_version_from_git.sh)
INSTALLATIONSOURCE ?= "Community"
LDFLAGS = -X main.Version="$(VERSION)"
ARCHS ?= amd64 arm64
DEBUG ?= 0

ifeq ($(DEBUG), 0)
	LDFLAGS += -s -w
	GO_BUILD = CGO_ENABLED=0 go build -ldflags "$(LDFLAGS)" -trimpath 
else
	GO_BUILD = CGO_ENABLED=0 go build -ldflags "$(LDFLAGS)" 
endif

.PHONY: default
default: clean build-frontend mod-tidy fmt vet-check test build

.PHONY: build
build: clean build-frontend egeria
egeria:
	$(GO_BUILD) -o egeria ./cmd/egeria

.PHONY: cross-compiled $(ARCHS)
cross-compiled: clean build-frontend $(ARCHS)
$(ARCHS):
	@mkdir -p build/$@
	GOOS=linux GOARCH=$@ $(GO_BUILD) -o build/$@/egeria ./cmd/egeria

.PHONY: clean
clean: clean-binary clean-frontend

.PHONY: clean-binary
clean-binary:
	go clean
	rm -rf build

.PHONY: clean-frontend
clean-frontend:
	rm -rf egeria-fe/dist

.PHONY: fmt
fmt:
	go fmt ./...

.PHONY: fmt-check
fmt-check:
	gofmt -l .
	[ "`gofmt -l .`" = "" ]

.PHONY: lint
lint:
	golangci-lint -v run

.PHONY: generate
generate:
ifeq (, $(shell command -v mockery 2> /dev/null))
	$(error "'mockery' command not found. You can install it locally with 'go install github.com/vektra/mockery/v2'.")
endif
ifeq (, $(shell command -v swag 2> /dev/null))
	$(error "'swag' command not found. You can install it locally with 'go install github.com/swaggo/swag/cmd/swag'.")
endif
	go generate ./...

.PHONY: mod-tidy
mod-tidy:
	go mod tidy

.PHONY: vet-check
vet-check:
	go vet ./...

.PHONY: test
test:
	go test -v -p 1 -race ./...

.PHONY: test-short
test-short:
	go test -short -v -p 1 -race ./...

.PHONY: test-coverage
test-coverage: 
	go test -v -p 1 -race -covermode atomic -coverprofile=covprofile ./...

.PHONY: build-frontend
build-frontend:
	rm -rf internal/http/dist && cd egeria-fe && npm i && npm run build && mv dist ../internal/http