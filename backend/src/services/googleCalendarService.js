import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { google } from "googleapis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_DIR = path.resolve(__dirname, "../..");

const CREDENTIALS_PATH = path.join(
  BACKEND_DIR,
  "credentials.json"
);

const TOKEN_PATH = path.join(
  BACKEND_DIR,
  "token.json"
);

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events"
];

export async function getGoogleCalendarClient() {
  const credentialsFile = await fs.readFile(
    CREDENTIALS_PATH,
    "utf8"
  );

  const credentials = JSON.parse(credentialsFile);

  const config = credentials.installed || credentials.web;

  if (!config) {
    throw new Error(
      "Invalid Google OAuth credentials.json file."
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    config.redirect_uris?.[0]
  );

  try {
    const tokenFile = await fs.readFile(
      TOKEN_PATH,
      "utf8"
    );

    oauth2Client.setCredentials(
      JSON.parse(tokenFile)
    );

    return oauth2Client;
  } catch {
    throw new Error(
      "Google authorization is required. Please run the Google authorization setup first."
    );
  }
}

export async function createGoogleMeetEvent({
  bookingId,
  courseName,
  parent,
  mentor,
  startTimeUtc,
  endTimeUtc
}) {
  const auth = await getGoogleCalendarClient();

  const calendar = google.calendar({
    version: "v3",
    auth
  });

  const response = await calendar.events.insert({
    calendarId: "primary",

    conferenceDataVersion: 1,

    sendUpdates: "all",

    requestBody: {
      summary: `CodeYoung Trial Class - ${courseName}`,

      description: [
        `CodeYoung Trial Class`,
        ``,
        `Booking ID: #${bookingId}`,
        `Course: ${courseName}`,
        `Parent: ${parent.name}`,
        `Mentor: ${mentor.name}`
      ].join("\n"),

      start: {
        dateTime: startTimeUtc,
        timeZone: "UTC"
      },

      end: {
        dateTime: endTimeUtc,
        timeZone: "UTC"
      },

      attendees: [
        {
          email: parent.email
        },
        {
          email: mentor.email
        }
      ],

      conferenceData: {
        createRequest: {
          requestId: `codeyoung-${bookingId}-${Date.now()}`,

          conferenceSolutionKey: {
            type: "hangoutsMeet"
          }
        }
      }
    }
  });

  const event = response.data;

  const meetingLink =
    event.hangoutLink ||
    event.conferenceData?.entryPoints?.find(
      (entryPoint) =>
        entryPoint.entryPointType === "video"
    )?.uri;

  if (!meetingLink) {
    throw new Error(
      "Google Calendar created the event but did not return a Google Meet link."
    );
  }

  return {
    eventId: event.id,
    meetingLink
  };
}