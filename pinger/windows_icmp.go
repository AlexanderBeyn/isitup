package pinger

import (
	"sync"
	"time"

	"github.com/go-ping/ping"
)

var _ Pinger = &WindowsIcmpPinger{}

type WindowsIcmpPinger struct {
	mu                sync.Mutex
	destination       string
	events            chan PingEvent
	pinger            *ping.Pinger
	options           PingOptions
	badPingTimer      *time.Timer
	lastGoodSequence  int
	lastGoodTimestamp time.Time
	lastBadTimestamp  time.Time
	destroyed         bool
}

func (w *WindowsIcmpPinger) Init(destination string, events chan PingEvent, options PingOptions) {
	w.mu.Lock()
	defer w.mu.Unlock()

	w.destination = destination
	w.events = events
	w.options = options

	var err error
	w.pinger, err = ping.NewPinger(destination)
	if err != nil {
		w.events <- PingEvent{
			Timestamp:   time.Now(),
			Destination: w.destination,
			Error:       &PingEventError{Message: err.Error()},
		}
		return
	}

	w.pinger.Size = 576
	w.pinger.SetPrivileged(true)
	w.pinger.OnRecv = w.onRecv
	w.pinger.OnSend = w.onSend
}

func (w *WindowsIcmpPinger) Start() {
	go func() {
		err := w.pinger.Run()
		if err != nil {
			w.events <- PingEvent{
				Timestamp:   time.Now(),
				Destination: w.destination,
				Error:       &PingEventError{Message: err.Error()},
			}
		}
	}()
}

func (w *WindowsIcmpPinger) Destroy() {
	w.mu.Lock()
	defer w.mu.Unlock()

	w.destroyed = true

	if w.badPingTimer != nil {
		w.badPingTimer.Stop()
	}

	if w.pinger != nil {
		w.pinger.Stop()
	}

	w.events <- PingEvent{
		Timestamp:   time.Now(),
		Destination: w.destination,
		Destroy:     &PingEventDestroy{},
	}
}

func (w *WindowsIcmpPinger) onSend(p *ping.Packet) {
	w.mu.Lock()
	defer w.mu.Unlock()

	w.badPingTimer = time.AfterFunc(w.options.Timeout, func() {
		w.mu.Lock()
		defer w.mu.Unlock()

		if p.Seq < w.lastGoodSequence || w.destroyed {
			return
		}

		w.lastBadTimestamp = time.Now()

		w.events <- PingEvent{
			Timestamp:   time.Now(),
			Destination: w.destination,
			Bad: &PingEventBad{
				LastGood: w.lastGoodTimestamp,
			},
		}
	})
}

func (w *WindowsIcmpPinger) onRecv(p *ping.Packet) {
	w.mu.Lock()
	defer w.mu.Unlock()

	w.lastGoodTimestamp = time.Now()
	w.lastGoodSequence = p.Seq

	w.events <- PingEvent{
		Timestamp:   time.Now(),
		Destination: w.destination,
		Good: &PingEventGood{
			RTT:     p.Rtt,
			LastBad: w.lastBadTimestamp,
		},
	}
}
