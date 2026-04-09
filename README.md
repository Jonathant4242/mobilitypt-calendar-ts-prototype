# Mobility PT Calendar TS Prototype

This project is a TypeScript prototype for a personal Google Calendar UI that reads upcoming events and displays open appointment slots in a custom interface. The app connects to Google Calendar with OAuth, loads events from a selected calendar, filters for open slots only, and parses provider and visit category labels such as Evaluation, Follow Up, and Mixed. This project is a first step toward a larger clinic scheduling website that will later support matching patients to openings and managing workflow more efficiently.

## Instructions for Build and Use

[Software Demo] (https://www.loom.com/share/445b2cb7dfb641b2b73b7bed3dcbdb6c)

Steps to build and/or run the software:

1. Install Node.js.
2. Clone this repository and open it in VS Code.
3. Run `npm install` in the project folder.
4. Create a `.env.local` file in the project root and add your Google API key and Google OAuth client ID.
5. Run `npm run dev`.
6. Open the local Vite URL shown in the terminal.

Instructions for using the software:

1. Click **Initialize Google**.
2. Click **Sign In** and authorize with your Google account.
3. Leave the calendar field as `primary` or enter another calendar ID.
4. Click **Load Events** to display open slots from the selected calendar.
5. Review the provider, category, time, location, and calendar name shown in the UI.
6. Click **Sign Out** when finished.

## Development Environment

To recreate the development environment, you need the following software and/or libraries with the specified versions:

- Node.js
- TypeScript 5.9.3
- Vite 8.0.3
- `@types/gapi` 0.0.47
- Google Calendar API
- Google OAuth client ID and API key configured in Google Cloud

## Useful Websites to Learn More

I found these websites useful in developing this software:

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Google Calendar API JavaScript Quickstart](https://developers.google.com/workspace/calendar/api/quickstart/js)
- [Google Calendar API Reference](https://developers.google.com/workspace/calendar/api/v3/reference)
- [Google Identity Services Web Guide](https://developers.google.com/identity/gsi/web)
- [Vite Guide](https://vite.dev/guide/)

## Future Work

The following items I plan to fix, improve, and/or add to this project in the future:

- [ ] Group open slots by day in the UI.
- [ ] Add dropdown support for selecting from multiple calendars instead of typing a calendar ID.
- [ ] Add filtering by category such as Evaluation, Follow Up, and Mixed.
- [ ] Merge this calendar prototype with the mobilitypt-template-server project so open slots can connect to the existing appointment request and outreach workflow.
- [ ] Build waitlist matching logic on top of the open slot calendar data.
- [ ] Improve the UI styling and empty-state messages.
