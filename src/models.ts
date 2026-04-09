import type { TimeRange } from "./types";

export class OpenSlot {
  provider: string;
  category: string;
  timeRange: TimeRange;

  constructor(provider: string, category: string, timeRange: TimeRange) {
    this.provider = provider;
    this.category = category;
    this.timeRange = timeRange;
  }

  getDisplayTitle(): string {
    return `${this.provider} — ${this.category}`;
  }

  getDisplayTime(): string {
    return `${this.timeRange[0]} - ${this.timeRange[1]}`;
  }
}