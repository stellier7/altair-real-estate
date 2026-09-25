---
name: property-page-system
description: Designs and implements a single reusable property-page architecture driven by structured property data, dynamic routes, conditional sections, directory integration, SEO, and CMS-ready separation. Use when adding properties, building property detail pages, schemas, slugs, related listings, or scaling listing-to-detail flows without per-property page duplication.
---

# Property Page System

This skill is responsible for designing and implementing the reusable property/asset architecture for the real-estate website.

## PRIMARY PURPOSE

The website must use ONE reusable property-page system.

Every property should be represented by structured data and rendered through the same reusable page architecture.

Never create a completely custom page by duplicating components for each property.

A new property should be able to receive its own URL and automatically render the appropriate page using the existing system.

Example:

/properties/ocean-villa

/properties/costa-del-sol

/properties/central-commercial-building

Each URL should render the same underlying property-page system while adapting its content and sections to the property’s available data.

⸻

## PROPERTY DATA MODEL

Design a flexible property/asset schema.

It should support fields such as:

* id
* slug
* name
* title
* shortDescription
* description
* propertyType
* status
* featured
* price
* currency
* location
* country
* region
* city
* address
* coordinates
* totalArea
* lotSize
* constructionArea
* bedrooms
* bathrooms
* parking
* yearBuilt
* heroImage
* gallery
* video
* virtualTour
* features
* amenities
* floorPlans
* documents
* investmentInformation
* contactInformation
* seoTitle
* seoDescription
* publishedAt

Fields should be optional when appropriate.

Do not force irrelevant information onto properties.

For example:

A land parcel should not display bedrooms or bathrooms.

A commercial property may need different specifications.

A luxury residence may need bedrooms, bathrooms, parking, views, etc.

The system should adapt based on property type and available data.

⸻

## PROPERTY PAGE ARCHITECTURE

Create reusable components for property pages.

Possible components include:

* PropertyHero
* PropertyGallery
* PropertyOverview
* PropertyStats
* PropertyDescription
* PropertyFeatures
* PropertyAmenities
* PropertyLocation
* PropertyMap
* PropertyFloorPlans
* PropertyDocuments
* PropertyVideo
* PropertyVirtualTour
* PropertyInvestment
* PropertyContact
* RelatedProperties

Do not assume every property needs every component.

Sections should render conditionally based on available information.

Avoid empty sections.

⸻

## PROPERTY PAGE FLOW

A typical property page should follow a visual hierarchy such as:

1. Hero
2. Key property information
3. Gallery
4. Description/story
5. Specifications
6. Features/amenities
7. Additional media
8. Location
9. Investment information if applicable
10. Documents/floor plans if applicable
11. Related properties
12. Contact CTA

This order can change when the specific property requires a different narrative.

The page should remain editorial rather than looking like a database entry.

⸻

## PROPERTY TYPES

The architecture should support multiple asset types.

Examples:

* residential
* apartment
* villa
* house
* condominium
* commercial
* office
* retail
* hotel
* development
* land
* lot
* industrial
* investment asset

Do not create completely separate page systems for each type unless genuinely necessary.

Instead, create a shared foundation with conditional sections.

⸻

## PROPERTY STATUS

Support statuses such as:

* available
* sold
* reserved
* under development
* coming soon
* off market

The UI should communicate status clearly but tastefully.

Do not rely exclusively on color to communicate status.

⸻

## URLS

Use clean, SEO-friendly URLs:

/properties/[slug]

Slugs must be stable and readable.

Avoid exposing internal database IDs in public URLs unless technically necessary.

⸻

## RELATED PROPERTIES

Implement a reusable related-property system.

Related properties should be determined using relevant attributes such as:

* property type
* location
* price range
* tags
* category
* development
* manually selected relationships

Do not simply display random properties.

⸻

## SEO

Every property page must support unique:

* title
* meta description
* canonical URL
* Open Graph metadata
* social preview image

Where appropriate, implement structured data suitable for real-estate/property content.

Do not use identical SEO metadata for every property.

⸻

## IMAGES

The architecture must support:

* hero image
* multiple gallery images
* responsive image sizes
* optimized loading
* lazy loading
* appropriate alt text

Do not load every high-resolution image immediately if it negatively affects performance.

⸻

## PROPERTY DIRECTORY INTEGRATION

The property system must work with the main property directory.

The flow should be:

Property data
↓
Property directory
↓
Property card
↓
Property URL
↓
Reusable property page
↓
Related properties

The same property data should power both the listing and the detail page.

Avoid duplicating property information in multiple places.

⸻

## CONTENT/DATA SEPARATION

Keep property data separate from presentation components.

Components should receive property data and render it.

Do not hard-code individual property information inside reusable components.

The system should eventually be compatible with a CMS or database.

For the initial implementation, mock/local data is acceptable.

⸻

## FUTURE CMS COMPATIBILITY

Design the architecture so that local/mock property data can later be replaced with a CMS or database without rewriting the entire frontend.

Do not over-engineer the first version.

The goal is a clean separation between:

DATA

and

PRESENTATION.

⸻

## RESPONSIVE BEHAVIOR

Property pages must work intentionally across:

* desktop
* laptop
* tablet
* mobile

The gallery, hero, specifications, maps, documents, and CTAs must all have mobile-specific considerations.

⸻

## PERFORMANCE

Property pages may contain many images.

Prioritize:

* responsive images
* lazy loading
* optimized formats
* appropriate image dimensions
* minimal unnecessary JavaScript

Do not sacrifice page performance simply to create visual effects.

⸻

## DEVELOPER RULE

When asked to add a new property:

DO NOT create a new page component.

Instead:

1. Add the property data.
2. Generate its slug.
3. Confirm the property-page system supports its property type.
4. Render it through the existing property-page architecture.
5. Add it to the property directory.
6. Verify SEO metadata.
7. Verify images and responsive behavior.

The system should scale horizontally as more properties are added.

⸻

## QUALITY STANDARD

The property-page system should make it possible to manage:

5 properties

50 properties

500 properties

without multiplying frontend code unnecessarily.

The goal is a scalable real-estate content system disguised as a beautiful editorial website.
