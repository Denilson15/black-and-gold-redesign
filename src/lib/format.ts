import type { OpeningHours } from "../content/site";

/** "14:30" -> "2:30 PM" */
export function formatTime(time24: string): string {
    const [h, m] = time24.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return m === 0
        ? `${hour12} ${period}`
        : `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatHoursRow(row: OpeningHours): string {
    if (!row.opens || !row.closes) {
        return "Closed";
    }
    return `${formatTime(row.opens)} – ${formatTime(row.closes)}`;
}

export function formatPrice(priceUsd: number | null): string {
    return priceUsd === null ? "Price TBD" : `$${priceUsd}`;
}

export function formatDuration(minutes: number | null): string {
    return minutes === null ? "Time TBD" : `${minutes} min`;
}

/** "Mark DeGuzman" -> "M" for the photo placeholder monogram. */
export function initial(name: string): string {
    return name.trim().charAt(0).toUpperCase();
}

/** First word of a name, for button labels: "Book with Mark". */
export function firstName(name: string): string {
    return name.split(" ")[0];
}
