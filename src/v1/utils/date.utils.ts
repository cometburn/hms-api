import { TIMEZONE } from "@/constants";

export class DateUtils {
    /**
     * Get local date and time
     * @param timezone
     * @returns
     */
    getLocalDateAndTime = (timezone = TIMEZONE) => {
        const now = new Date();

        // Get date/time in specified timezone
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: TIMEZONE,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });

        const parts = formatter.formatToParts(now);
        const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "0";

        const year = parseInt(getPart("year"));
        const month = parseInt(getPart("month"));
        const day = parseInt(getPart("day"));
        const hours = parseInt(getPart("hour"));
        const minutes = parseInt(getPart("minute"));
        const seconds = parseInt(getPart("second"));

        const dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const timeString = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        // Create Date objects using NUMBERS, not strings (avoids UTC conversion)
        return {
            dateString,
            timeString,
            timezone,
            dateStart: new Date(year, month - 1, day, 0, 0, 0, 0),
            dateEnd: new Date(year, month - 1, day, 23, 59, 59, 999),
            timeOnly: new Date(1970, 0, 1, hours, minutes, seconds),
        };
    };

    /**
     * Format date
     * @param date
     * @param format
     * @returns
     */
    formatDate = (
        date: string | Date | undefined | null,
        format: string = "MM/DD/YYYY"
    ): string => {
        if (!date) return "";

        const d = new Date(date);

        // Check if date is valid
        if (isNaN(d.getTime())) return "";

        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const hours24 = d.getHours();
        const hours12 = hours24 % 12 || 12;
        const minutes = d.getMinutes();
        const seconds = d.getSeconds();
        const ampm = hours24 >= 12 ? "PM" : "AM";

        const tokens: Record<string, string> = {
            YYYY: String(year),
            YY: String(year).slice(-2),
            MM: String(month).padStart(2, "0"),
            M: String(month),
            DD: String(day).padStart(2, "0"),
            D: String(day),
            HH: String(hours24).padStart(2, "0"),
            H: String(hours24),
            hh: String(hours12).padStart(2, "0"),
            h: String(hours12),
            mm: String(minutes).padStart(2, "0"),
            m: String(minutes),
            ss: String(seconds).padStart(2, "0"),
            s: String(seconds),
            A: ampm,
            a: ampm.toLowerCase(),
        };

        // Replace tokens in format string
        const sortedTokens = Object.keys(tokens).sort((a, b) => b.length - a.length);

        let result = format;
        sortedTokens.forEach((token) => {
            result = result.replace(new RegExp(token, "g"), tokens[token]);
        });

        return result;
    };

    /**
     * Create Manila date
     * @param dateString
     * @returns
     */
    createManilaDate = (dateString: string) => {
        return this.formatDate(dateString, "MM/DD/YYYY HH:mm:ss");
    };
}
