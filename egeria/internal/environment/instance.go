package environment

import "time"

type SyncStatus string

const (
	SYNCED     SyncStatus = "synced"
	PAUSED     SyncStatus = "paused"
	NOT_SYNCED SyncStatus = "not_synced"
)

type Revision struct {
	PR     string
	PRLink string
	Commit string
	Author string
}

type Instance struct {
	ID         string
	Name       string
	Image      string
	Status     string
	SyncStatus SyncStatus
	Dangling   bool
	CreatedAt  time.Time
	Revision   Revision
}
