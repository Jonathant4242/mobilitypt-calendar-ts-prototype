import type { CalendarEvent } from "./types";

export function renderApp(): void {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    throw new Error("App container not found.");
  }

  app.innerHTML = `
    <div class="page">
      <header class="card">
        <h1>Mobility PT Calendar Prototype</h1>
        <p>TypeScript UI for viewing upcoming Google Calendar events.</p>
      </header>

      <section class="card controls">
        <button id="initialize-btn">Initialize Google</button>
        <button id="sign-in-btn">Sign In</button>
        <label class="calendar-field" for="calendar-id-input">
          <span>Calendar ID</span>
          <input id="calendar-id-input" type="text" value="primary" placeholder="primary or calendar ID" />
        </label>
        <button id="load-events-btn">Load Events</button>
        <button id="sign-out-btn">Sign Out</button>
      </section>

      <section class="card">
        <h2>Status</h2>
        <p id="status-message">Ready.</p>
      </section>

      <section class="card">
        <h2>Open Slots</h2>
        <div id="event-list"></div>
      </section>
    </div>
  `;
}

export function updateStatus(message: string): void {
  const status = document.querySelector<HTMLParagraphElement>("#status-message");
  if (status) {
    status.textContent = message;
  }
}

export function getSelectedCalendarId(): string {
  const input = document.querySelector<HTMLInputElement>("#calendar-id-input");
  return input?.value.trim() || "primary";
}

export function renderEvents(events: CalendarEvent[]): void {
  const eventList = document.querySelector<HTMLDivElement>("#event-list");

  if (!eventList) {
    throw new Error("Event list container not found.");
  }

  if (events.length === 0) {
    eventList.innerHTML = `<p>No events found.</p>`;
    return;
  }

  eventList.innerHTML = events
    .map(
      (event) => `
        <article class="event-card">
          <h3>${getProviderName(event.summary)}</h3>
          <p class="event-category"><strong>Category:</strong> ${getCategoryName(event.summary)}</p>
          <p><strong>Time:</strong> ${event.start} - ${event.end}</p>
          <p><strong>Location:</strong> ${event.location || "N/A"}</p>
          <p><strong>Calendar:</strong> ${getCalendarName(event)}</p>
        </article>
      `
    )
    .join("");
}

function getProviderName(summary: string): string {
  const parts = summary.split(" — ");
  return parts[0]?.trim() || "Unknown Provider";
}

function getCategoryName(summary: string): string {
  const parts = summary.split(" — ");
  return parts[1]?.trim() || "Open Slot";
}

function getCalendarName(event: CalendarEvent): string {
  const maybeEvent = event as CalendarEvent & { calendarName?: string };
  return maybeEvent.calendarName || "Unknown Calendar";
}