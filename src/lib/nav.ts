import { faq, gallery, reviews } from "../content/site";

/*
 * Main navigation, in order. Pages without real content yet (no
 * photos, no approved reviews, too few confirmed FAQ answers) stay out
 * of the menu so visitors never land on an empty page. They appear
 * automatically once the content file has enough to show.
 */
const answeredFaqs = faq.filter((item) => item.answer !== null).length;

export const navLinks = [
    { href: "/barbers/", label: "Barbers", show: true },
    { href: "/services/", label: "Services", show: true },
    { href: "/gallery/", label: "Gallery", show: gallery.length >= 3 },
    { href: "/reviews/", label: "Reviews", show: reviews.length > 0 },
    { href: "/location/", label: "Location", show: true },
    { href: "/faq/", label: "FAQ", show: answeredFaqs >= 3 },
].filter((link) => link.show);
