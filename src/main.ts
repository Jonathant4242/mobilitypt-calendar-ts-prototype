import "./styles.css";
import {
  fetchUpcomingEvents,
  initializeGoogleApi,
  isGoogleReady,
  signIn,
  signOut,
} from "./calendar";
import { renderApp, renderEvents, updateStatus } from "./ui";

function main(): void {
  renderApp();

  const initializeButton = document.querySelector<HTMLButtonElement>("#initialize-btn");
  const signInButton = document.querySelector<HTMLButtonElement>("#sign-in-btn");
  const loadEventsButton = document.querySelector<HTMLButtonElement>("#load-events-btn");
  const signOutButton = document.querySelector<HTMLButtonElement>("#sign-out-btn");

  if (!initializeButton || !signInButton || !loadEventsButton || !signOutButton) {
    throw new Error("Required buttons were not found.");
  }

  initializeButton.addEventListener("click", async () => {
    try {
      updateStatus("Initializing Google APIs...");
      await initializeGoogleApi();
      updateStatus("Google APIs initialized.");
    } catch (error) {
      console.error(error);
      updateStatus("Failed to initialize Google APIs.");
    }
  });

  signInButton.addEventListener("click", async () => {
    try {
      if (!isGoogleReady()) {
        updateStatus("Initialize Google first.");
        return;
      }

      updateStatus("Signing in...");
      await signIn();
      updateStatus("Signed in successfully.");
    } catch (error) {
      console.error(error);
      updateStatus("Sign-in failed.");
    }
  });

  loadEventsButton.addEventListener("click", async () => {
    try {
      if (!isGoogleReady()) {
        updateStatus("Initialize Google first.");
        return;
      }

      updateStatus("Loading events...");
      const events = await fetchUpcomingEvents();
      renderEvents(events);
      updateStatus(`Loaded ${events.length} open event(s).`);
    } catch (error) {
      console.error(error);
      updateStatus("Failed to load events.");
    }
  });

  signOutButton.addEventListener("click", async () => {
    try {
      await signOut();
      updateStatus("Signed out.");
      renderEvents([]);
    } catch (error) {
      console.error(error);
      updateStatus("Sign-out failed.");
    }
  });
}

main();