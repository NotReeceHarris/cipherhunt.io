function startOfWeekMondayUTC(date: Date): Date {
    const day = date.getUTCDay(); // 0 = Sunday ... 6 = Saturday

    // convert Sunday (0) → 6, Monday → 0, etc.
    const diff = (day === 0 ? -6 : 1 - day);

    const monday = new Date(date);
    monday.setUTCDate(date.getUTCDate() + diff);

    return new Date(Date.UTC(
        monday.getUTCFullYear(),
        monday.getUTCMonth(),
        monday.getUTCDate()
    ));
}

export default function generateId(
    inputDate: Date,
    type: "daily" | "weekly" | "monthly"
): string {
    const anchor = new Date(Date.UTC(2026, 4, 20)); // 20 May 2026

    const date = new Date(inputDate);

    // normalise to UTC midnight first
    let normalised = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    if (type === "weekly") {
        normalised = startOfWeekMondayUTC(normalised);
    }

    if (type === "monthly") {
        normalised = new Date(Date.UTC(normalised.getUTCFullYear(), normalised.getUTCMonth(), 1));
    }

    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((normalised.getTime() - anchor.getTime()) / msPerDay);

    let index: number;

    if (type === "daily") {
        index = diffDays;
    } else if (type === "weekly") {
        index = Math.floor(diffDays / 7);
    } else if (type === "monthly") {
        index =
        (normalised.getUTCFullYear() - 2026) * 12 +
        (normalised.getUTCMonth() - 4);
    } else {
        throw new Error("Invalid type");
    }

    // ensure non-negative safe space
    const OFFSET = 10_000_000;

    const safeIndex = index + OFFSET;

    // type separation to avoid collisions
    const TYPE_BUCKET = type === "daily" ? 1 : type === "weekly" ? 2 : 3;

    const MULTIPLIER = 1_000_000_000;

    const id = TYPE_BUCKET * MULTIPLIER + safeIndex;

    return id.toString();
}

export function puzzleStartDate(
    inputDate: Date,
    type: "daily" | "weekly" | "monthly"
): Date {
    const date = new Date(inputDate);

    // normalise to UTC midnight first
    let normalised = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    if (type === "weekly") {
        return startOfWeekMondayUTC(normalised);
    }

    if (type === "monthly") {
        return new Date(Date.UTC(normalised.getUTCFullYear(), normalised.getUTCMonth(), 1));
    }

    // Daily
    return normalised;
}