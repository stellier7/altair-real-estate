# Adding your own images

The template ships with **Unsplash URLs** in `src/content/properties/properties.ts`. Replace them with your own files when you are ready.

## Recommended folder structure

```text
public/
  images/
    properties/
      ocean-villa-marbella/
        hero.jpg
        gallery-01.jpg
        gallery-02.jpg
      metropolitan-residence/
        hero.jpg
    site/
      home-hero.jpg
```

Use **lowercase slugs** that match each property’s `slug` field.

## Wire images in data

Point `src` at a path under `public/` (no `public` in the URL):

```ts
heroImage: {
  src: "/images/properties/ocean-villa-marbella/hero.jpg",
  alt: "Describe the scene for accessibility",
  width: 1800,
  height: 1200,
},
```

## Quality guidelines

- **Hero:** landscape, 2000px wide or larger, exported as JPG (85% quality) or WebP.
- **Gallery:** consistent aspect ratio per property when possible.
- **Alt text:** what a sighted user needs to understand—not “property image”.
- **File size:** aim under 400KB per hero after compression; galleries under 250KB when possible.

`next/image` handles responsive sizes automatically. Local files do not need `images.remotePatterns` in `next.config.ts`.

## Homepage hero

Edit `src/app/page.tsx` and replace the Unsplash `Image` `src` with `/images/site/home-hero.jpg` after you add the file.
