import type { CalendarEvent } from "./types";

const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

if (!API_KEY || !CLIENT_ID) {
  throw new Error("Missing Google API credentials in environment variables.");
}

declare const gapi: any;
declare const google: any;

let tokenClient: any;
let gapiInited = false;
let gisInited = false;

function formatDateTime(value?: string): string {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function isOpenEvent(summary?: string): boolean {
  return (summary ?? "").toUpperCase().includes("OPEN");
}

function getOpenCategory(summary?: string): string {
  const normalized = (summary ?? "").toUpperCase().trim();
  const parts = normalized.split(" - OPEN - ");

  if (parts.length < 2) {
    return "Open Slot";
  }

  const category = parts[1].trim();

  if (category === "EVALUATION") {
    return "Evaluation";
  }

  if (category === "FOLLOW UP" || category === "FOLLOW-UP") {
    return "Follow Up";
  }

  if (category === "MIXED") {
    return "Mixed";
  }

  return "Open Slot";
}

function getOpenProvider(summary?: string): string {
  const rawSummary = (summary ?? "").trim();
  const parts = rawSummary.split(" - OPEN - ");

  if (parts.length < 2) {
    return "Unknown Provider";
  }

  return parts[0].trim();
}

export function getScopes(): string {
  return SCOPES;
}

export async function initializeGoogleApi(): Promise<void> {
  if (gapiInited && gisInited) {
    return;
  }

  await loadScript("https://apis.google.com/js/api.js");
  await loadScript("https://accounts.google.com/gsi/client");

  await new Promise<void>((resolve, reject) => {
    gapi.load("client", {
      callback: async () => {
        try {
          await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
          });
          gapiInited = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      onerror: () => reject(new Error("Failed to load Google API client.")),
    });
  });

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: () => {},
  });

  gisInited = true;
}

export function isGoogleReady(): boolean {
  return gapiInited && gisInited;
}

export async function signIn(): Promise<void> {
  if (!tokenClient) {
    throw new Error("Google token client is not initialized.");
  }

  await new Promise<void>((resolve, reject) => {
    tokenClient.callback = async (response: any) => {
      if (response.error) {
        reject(response);
        return;
      }
      resolve();
    };

    const token = gapi.client.getToken();
    if (token === null) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      tokenClient.requestAccessToken({ prompt: "" });
    }
  });
}

export async function signOut(): Promise<void> {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken(null);
  }
}

export async function fetchUpcomingEvents(): Promise<CalendarEvent[]> {
  if (!gapi.client.getToken()) {
    throw new Error("User is not signed in.");
  }

  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  const response = await gapi.client.calendar.events.list({
    calendarId: "primary",
    timeMin: now.toISOString(),
    timeMax: nextWeek.toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 50,
    orderBy: "startTime",
  });

  const items = response.result.items ?? [];

  return items
    .filter((item: any) => isOpenEvent(item.summary))
    .map((item: any) => {
      const provider = getOpenProvider(item.summary);
      const category = getOpenCategory(item.summary);

      return {
        id: item.id ?? crypto.randomUUID(),
        summary: `${provider} — ${category}`,
        start: formatDateTime(item.start?.dateTime || item.start?.date),
        end: formatDateTime(item.end?.dateTime || item.end?.date),
        location: item.location ?? "",
        description: item.description ?? item.summary ?? "",
      };
    });
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}