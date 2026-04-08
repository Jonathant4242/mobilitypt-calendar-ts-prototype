export type CalendarEvent = {
  id: string;
  summary: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
};

export type TimeRange = [string, string];