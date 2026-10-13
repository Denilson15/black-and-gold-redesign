/*
 * schema.org structured data (JSON-LD) for Google.
 *
 * Only confirmed facts go in. Unconfirmed hours, coordinates and price
 * range are left out entirely rather than guessed: wrong structured
 * data is worse than missing structured data.
 */
import {
    booking,
    business,
    hours,
    services,
    type OpeningHours,
} from "../content/site";

type JsonLd = Record<string, unknown>;

function openingHoursSpecification(week: OpeningHours[]): JsonLd[] {
    return week
        .filter((row) => row.opens && row.closes)
        .map((row) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: `https://schema.org/${row.day}`,
            opens: row.opens,
            closes: row.closes,
        }));
}

/** The shop itself. Rendered on every page. */
export function hairSalonSchema(siteUrl: string): JsonLd {
    const { address } = business;
    const mapsUrl =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(
            `${business.name}, ${address.street}, ${address.city}, ` +
                `${address.region} ${address.postalCode}`,
        );

    const schema: JsonLd = {
        "@context": "https://schema.org",
        "@type": "HairSalon",
        "@id": `${siteUrl}#business`,
        name: business.name,
        url: siteUrl,
        telephone: business.phoneE164,
        image: `${siteUrl}og-image.png`,
        address: {
            "@type": "PostalAddress",
            streetAddress: address.street,
            addressLocality: address.city,
            addressRegion: address.region,
            postalCode: address.postalCode,
            addressCountry: address.country,
        },
        hasMap: mapsUrl,
        sameAs: [`https://www.instagram.com/${business.instagram.handle}/`],
        potentialAction: {
            "@type": "ReserveAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: booking.url,
                actionPlatform: [
                    "https://schema.org/DesktopWebPlatform",
                    "https://schema.org/MobileWebPlatform",
                ],
            },
            result: { "@type": "Reservation", name: "Barber appointment" },
        },
        makesOffer: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
                "@type": "Service",
                name: service.name,
                url: `${siteUrl}services/${service.slug}/`,
            },
            ...(service.priceUsd !== null && {
                price: service.priceUsd,
                priceCurrency: "USD",
            }),
        })),
    };

    if (business.geo) {
        schema.geo = {
            "@type": "GeoCoordinates",
            latitude: business.geo.latitude,
            longitude: business.geo.longitude,
        };
    }
    if (business.priceRange) {
        schema.priceRange = business.priceRange;
    }
    if (hours.confirmed && hours.week.length > 0) {
        schema.openingHoursSpecification = openingHoursSpecification(
            hours.week,
        );
    }

    return schema;
}

/** Breadcrumbs for inner pages, e.g. Home > Services > Haircuts. */
export function breadcrumbSchema(
    siteUrl: string,
    trail: { name: string; path: string }[],
): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            item: new URL(crumb.path, siteUrl).href,
        })),
    };
}
