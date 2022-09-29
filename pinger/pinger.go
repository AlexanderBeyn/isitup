package pinger

import "time"

type PingEvent struct {
	Timestamp   time.Time         `json:"timestamp"`
	Destination string            `json:"destination"`
	ExtraInfo   string            `json:"extra_info,omitempty"`
	Error       *PingEventError   `json:"error,omitempty"`
	Good        *PingEventGood    `json:"good,omitempty"`
	Bad         *PingEventBad     `json:"bad,omitempty"`
	Destroy     *PingEventDestroy `json:"destroy,omitempty"`
}

type PingEventError struct {
	Message string `json:"message"`
}

type PingEventGood struct {
	LastBad time.Time     `json:"last_bad,omitempty"`
	RTT     time.Duration `json:"rtt"`
}

type PingEventBad struct {
	LastGood time.Time `json:"last_good,omitempty"`
}

type PingEventDestroy struct{}

type PingOptions struct {
	StopOnGood   bool
	StopOnBad    bool
	StopOnChange bool
	Timeout      time.Duration
}

var DefaultPingOptions = PingOptions{
	StopOnGood:   false,
	StopOnBad:    false,
	StopOnChange: false,
	Timeout:      2 * time.Second,
}

type Pinger interface {
	Init(destination string, events chan PingEvent, options PingOptions)
	Start()
	Destroy()
}
