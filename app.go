package main

import (
	"context"
	"sync"

	"github.com/AlexanderBeyn/isitup/pinger"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	mu         sync.Mutex
	ctx        context.Context
	Pingers    map[string]pinger.Pinger
	pingEvents chan pinger.PingEvent
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.mu.Lock()
	defer a.mu.Unlock()

	a.ctx = ctx
	a.Pingers = make(map[string]pinger.Pinger)
	a.pingEvents = make(chan pinger.PingEvent, 1)
	go a.proxyEvents()
}

func (a *App) AddDestination(destination string) {
	a.mu.Lock()
	defer a.mu.Unlock()

	if destination == "" {
		return
	}

	_, ok := a.Pingers[destination]
	if ok {
		return
	}

	a.Pingers[destination] = &pinger.WindowsIcmpPinger{}
	a.Pingers[destination].Init(destination, a.pingEvents, pinger.DefaultPingOptions)
	a.Pingers[destination].Start()
}

func (a *App) RemoveDestination(destination string) {
	p, ok := a.Pingers[destination]
	if !ok {
		return
	}

	p.Destroy()
	delete(a.Pingers, destination)
}

func (a *App) proxyEvents() {
	for event := range a.pingEvents {
		runtime.EventsEmit(a.ctx, "ping", event)
	}
}

// TODO is there a better way to generate types for events?
func (a *App) IgnoreMe(pinger.PingEvent) {}
