/*
 * SITE CONTENT — the one file to edit.
 *
 * Every business fact on the website comes from this file: hours,
 * prices, barbers, Instagram handles, address, phone. Change it here
 * and every page updates on the next build.
 *
 * Rules:
 * - Anything not yet confirmed by the owner is `null` or has
 *   `confirmed: false`. The site shows a clear "TBD" / hidden state for
 *   those instead of guessing. Never fill in a value you haven't
 *   confirmed with the owner.
 * - Placeholders are listed in PITCH.md under "Open questions".
 */

import type { ImageMetadata } from "astro";

/*
 * Photos come from the shop's current website, used in this private
 * concept preview only. The owner must confirm permission (and each
 * barber their portrait) before launch. See PITCH.md.
 */
import jamiePhoto from "../assets/barbers/jamie-anabeza.webp";
import francisPhoto from "../assets/barbers/francis-g.webp";
import melPhoto from "../assets/barbers/mel.jpg";
import joePhoto from "../assets/barbers/joe-the-barber.webp";
import markPhoto from "../assets/barbers/mark-deguzman.webp";
import toolsPhoto from "../assets/shop/tools.webp";

// ---------------------------------------------------------------------
// Concept / pitch mode
// ---------------------------------------------------------------------

/*
 * While true, the site:
 * - tells search engines not to index it (meta robots + robots.txt),
 * - shows the small "Concept preview" banner.
 * Set to false ONLY at handoff, after the owner says yes (see
 * HANDOFF.md). Also remove the X-Robots-Tag block in netlify.toml.
 */
export const CONCEPT_MODE = true;

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

export type Day =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

export interface OpeningHours {
    day: Day;
    /** 24h "HH:MM", or null when closed that day. */
    opens: string | null;
    closes: string | null;
}

export interface InstagramHandle {
    /** Handle without the @. */
    handle: string;
    /**
     * Only confirmed handles get a "Message on Instagram" button.
     * An unconfirmed handle could point at a stranger's account.
     */
    confirmed: boolean;
}

export interface Barber {
    /** URL-safe id, also used for photo filenames. */
    id: string;
    name: string;
    /** Blismo employeeId used in the per-barber booking link. */
    blismoEmployeeId: number;
    instagram: InstagramHandle | null;
    /** Portrait (imported from src/assets/barbers), or null. */
    photo: ImageMetadata | null;
    /** In the barber's own words. null shows a placeholder. */
    bio: string | null;
    specialty: string | null;
}

export interface Service {
    /** Matches the page URL: /services/<slug>/ */
    slug: string;
    name: string;
    /** Short line for cards. */
    summary: string;
    /** Longer copy for the service page. */
    description: string[];
    includes: string[];
    /** Whole dollars, or null for "TBD". */
    priceUsd: number | null;
    durationMinutes: number | null;
    /** SEO title and description for the service page. */
    seoTitle: string;
    seoDescription: string;
    h1: string;
}

export interface FaqItem {
    question: string;
    /** null = not yet confirmed; shows a placeholder answer. */
    answer: string | null;
}

export interface Review {
    /** Exact quote, copied from the source. Real reviews only. */
    quote: string;
    /** As shown on the source, e.g. first name + last initial. */
    author: string;
    source: "Google" | "Yelp";
    rating: 1 | 2 | 3 | 4 | 5;
    /** Owner approved using this review on the site. */
    approvedByOwner: boolean;
}

// ---------------------------------------------------------------------
// Business
// ---------------------------------------------------------------------

export const business = {
    /*
     * Name, address and phone (NAP) must match the Google Business
     * Profile character for character. Confirm before launch.
     */
    name: "Black & Gold East Bay",
    address: {
        street: "846 B St",
        city: "Hayward",
        region: "CA",
        postalCode: "94541",
        country: "US",
    },
    /** Shown to people. */
    phoneDisplay: "(510) 397-6642",
    /** Used in tel: links and structured data. */
    phoneE164: "+15103976642",
    /*
     * Map coordinates for structured data. null until copied from the
     * Google Business Profile — do not estimate.
     */
    geo: null as { latitude: number; longitude: number } | null,
    /** e.g. "$" or "$$". null until prices are confirmed. */
    priceRange: null as string | null,
    /*
     * From the current site. Owner to confirm it's still accurate
     * before launch.
     */
    experienceLine:
        "Our barbers bring over three decades of combined experience " +
        "to every cut.",
    instagram: {
        handle: "blackandgoldeastbay",
        confirmed: true,
    } satisfies InstagramHandle,
    /*
     * Google review link from the Business Profile ("Ask for reviews"
     * button). null falls back to a Google Maps search for the shop.
     */
    googleReviewUrl: null as string | null,
    /** Parking and directions notes. null shows a placeholder. */
    parkingNotes: null as string | null,
    directionsNotes: null as string | null,
};

// ---------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------

export const hero = {
    /** Shown behind the headline (and as the video's poster frame). */
    image: toolsPhoto,
    imageAlt:
        "Combs, brushes and shears laid out at a barber station at " +
        "Black & Gold East Bay",
    /*
     * The shop's hero video ("BGEB Hero Video.mp4" on the current
     * site). Put the file in /public and set e.g. "/hero.mp4". null
     * shows the photo only. The video never plays for visitors who
     * turn on reduced motion.
     */
    videoSrc: null as string | null,
};

// ---------------------------------------------------------------------
// Booking (Blismo is the single source of truth for appointments)
// ---------------------------------------------------------------------

export const booking = {
    url: "https://blismo.com/s/black-and-gold-eastbay/appointments",
};

/** Per-barber booking link. */
export function barberBookingUrl(barber: Barber): string {
    return `${booking.url}?employeeId=${barber.blismoEmployeeId}`;
}

// ---------------------------------------------------------------------
// Hours
// ---------------------------------------------------------------------

/*
 * PLACEHOLDER — the current site lists "SUN-MON 10AM-3PM" and
 * "TUE-SAT 10AM-3PM", which can't be right, and a third-party listing
 * shows different hours. Keep `confirmed: false` until the owner gives
 * the real hours; the site then shows "Hours being confirmed" and
 * leaves hours out of the structured data.
 *
 * When confirmed, fill in all seven days, e.g.
 *   { day: "Tuesday", opens: "10:00", closes: "18:00" },
 *   { day: "Monday", opens: null, closes: null }, // closed
 */
export const hours = {
    confirmed: false,
    week: [] as OpeningHours[],
};

// ---------------------------------------------------------------------
// Barbers
// ---------------------------------------------------------------------

/*
 * Names and Blismo IDs come from the live site (2026-10-13).
 * Instagram handles are PLACEHOLDERS from the brief, unconfirmed, so no
 * DM button shows for them yet. Portraits are from the current site.
 */
export const barbers: Barber[] = [
    {
        id: "jamie-anabeza",
        name: "Jamie Anabeza",
        blismoEmployeeId: 1275,
        instagram: { handle: "placeholder_jamie", confirmed: false },
        photo: jamiePhoto,
        bio: null,
        specialty: null,
    },
    {
        id: "francis-g",
        name: "Francis G",
        blismoEmployeeId: 1276,
        instagram: { handle: "placeholder_francis", confirmed: false },
        photo: francisPhoto,
        bio: null,
        specialty: null,
    },
    {
        id: "mel",
        name: "Mel",
        blismoEmployeeId: 1327,
        instagram: { handle: "placeholder_mel", confirmed: false },
        photo: melPhoto,
        bio: null,
        specialty: null,
    },
    {
        id: "joe-the-barber",
        name: "Joe the Barber",
        blismoEmployeeId: 1321,
        instagram: { handle: "placeholder_joe", confirmed: false },
        photo: joePhoto,
        bio: null,
        specialty: null,
    },
    {
        id: "mark-deguzman",
        name: "Mark DeGuzman",
        blismoEmployeeId: 1320,
        instagram: { handle: "placeholder_mark", confirmed: false },
        photo: markPhoto,
        bio: null,
        specialty: null,
    },
];

// ---------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------

/*
 * Descriptions build on the copy from the current site. Prices and
 * durations are PLACEHOLDERS (null shows "TBD").
 */
export const services: Service[] = [
    {
        slug: "haircuts",
        name: "Haircuts & fades",
        summary:
            "Classic tapers, modern fades and crops, cut to suit your " +
            "style.",
        description: [
            "Whether you want a classic taper, a skin fade or a fresh " +
                "crop, every cut starts with a conversation about how " +
                "you wear your hair and how much upkeep you want.",
            "Your barber cuts to your head shape and growth pattern, " +
                "then finishes and styles it so you leave looking sharp " +
                "and know how to keep it that way.",
        ],
        includes: ["Consultation", "Cut", "Finish and style"],
        priceUsd: null,
        durationMinutes: null,
        seoTitle: "Haircuts & Fades in Hayward, CA | Black & Gold East Bay",
        seoDescription:
            "Fades, tapers and classic cuts at Black & Gold East Bay, " +
            "846 B St in Downtown Hayward. Book online with your barber.",
        h1: "Haircuts and fades in Hayward",
    },
    {
        slug: "beard-grooming",
        name: "Beard grooming & shaping",
        summary:
            "From a full sculpt to a clean line-up, shaped with " +
            "precision.",
        description: [
            "From a full beard sculpt to a clean line-up, your barber " +
                "shapes the beard to your face and keeps the lines " +
                "crisp.",
            "Every beard service includes a hot towel treatment, with " +
                "an optional beard oil finish.",
        ],
        includes: [
            "Beard shaping and line-up",
            "Hot towel treatment",
            "Optional beard oil finish",
        ],
        priceUsd: null,
        durationMinutes: null,
        seoTitle:
            "Beard Trim & Shaping in Hayward, CA | Black & Gold East Bay",
        seoDescription:
            "Beard trims, line-ups and full beard sculpting with a hot " +
            "towel at Black & Gold East Bay in Hayward. Book online.",
        h1: "Beard trims and shaping in Hayward",
    },
    {
        slug: "hot-towel-shave",
        name: "Hot towel shave",
        summary:
            "A traditional straight razor shave with hot towels and " +
            "rich lather.",
        description: [
            "A traditional straight razor shave: hot towels to soften " +
                "the beard, a rich lather, a close shave and " +
                "skin-soothing aftercare.",
            "It's the old-school barbershop experience. Sit back and " +
                "take the time.",
        ],
        includes: [
            "Hot towel prep",
            "Lather and straight razor shave",
            "Soothing aftercare",
        ],
        priceUsd: null,
        durationMinutes: null,
        seoTitle:
            "Hot Towel Straight Razor Shave in Hayward | Black & Gold",
        seoDescription:
            "Traditional hot towel straight razor shaves at Black & " +
            "Gold East Bay, 846 B St, Hayward, CA. Book online.",
        h1: "Hot towel shaves in Hayward",
    },
];

// ---------------------------------------------------------------------
// FAQ (answers are PLACEHOLDERS until the owner confirms)
// ---------------------------------------------------------------------

export const faq: FaqItem[] = [
    { question: "Do you take walk-ins?", answer: null },
    { question: "Do you cut kids' hair?", answer: null },
    { question: "What payment methods do you accept?", answer: null },
    { question: "What's your cancellation policy?", answer: null },
    { question: "Where do I park?", answer: null },
    {
        question: "How do I book with a specific barber?",
        answer:
            "Go to the Barbers page and tap “Book with” next to the " +
            "barber you want. It opens their calendar on Blismo, where " +
            "you pick a time.",
    },
];

// ---------------------------------------------------------------------
// Reviews — REAL reviews only, with the owner's OK. Never write one.
// ---------------------------------------------------------------------

export const reviews: Review[] = [];

// ---------------------------------------------------------------------
// Gallery — real photos only, with the owner's permission.
// ---------------------------------------------------------------------

export interface GalleryPhoto {
    /** Imported from src/assets (Astro optimizes and resizes it). */
    src: ImageMetadata;
    /** Describe the cut, e.g. "Skin fade with a hard part". */
    alt: string;
}

export const gallery: GalleryPhoto[] = [];
