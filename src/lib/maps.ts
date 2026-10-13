import { business } from "../content/site";

const { address } = business;
const query =
    `${business.name}, ${address.street}, ${address.city}, ` +
    `${address.region} ${address.postalCode}`;

/** Opens the shop in Google Maps (app on phones). */
export const mapsSearchUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(query);

/** Turn-by-turn directions to the shop. */
export const mapsDirectionsUrl =
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(query);

/** Keyless Google Maps embed. Loaded only when the visitor asks. */
export const mapsEmbedUrl =
    "https://www.google.com/maps?output=embed&q=" + encodeURIComponent(query);

/** Where "Read reviews" goes until the owner gives a review link. */
export const reviewsUrl = business.googleReviewUrl ?? mapsSearchUrl;
