---
name: frontend-quality
description: Engineering standards for the real-estate website frontend—components, TypeScript, Next.js/React, styling, responsive layout, accessibility, performance, SEO, and error states. Use when implementing or reviewing UI, pages, property listings, forms, images, metadata, or any frontend change in this repository.
---

# Frontend quality

Engineering standards for the real-estate website.

## Core Principle

Build production-quality frontend code that is:

* clean
* maintainable
* reusable
* accessible
* performant
* responsive
* easy to extend

Prefer simple, understandable solutions over unnecessary abstraction.

## Architecture

Use reusable components and keep responsibilities separated.

Avoid:

* duplicated components
* duplicated property data
* giant components
* deeply nested component logic
* unnecessary abstractions
* hard-coded content inside reusable components

Keep:

* content/data separate from presentation
* reusable UI components separate from page-specific composition
* business logic separate from visual components where practical

## TypeScript

Use TypeScript properly.

Prefer:

* explicit interfaces/types for important data structures
* strongly typed component props
* safe handling of optional data
* discriminated types when different property types require different fields

Avoid:

* unnecessary any
* ignoring TypeScript errors
* type assertions used only to silence errors

## React / Next.js

Follow the conventions of the project’s existing framework.

Prefer:

* server rendering where appropriate
* server components when they provide a benefit
* client components only when interactivity requires them
* reusable components
* semantic HTML

Do not turn the entire application into client-side JavaScript unnecessarily.

## Styling

Use the project’s established styling system consistently.

Avoid:

* random one-off styles
* duplicated CSS
* inconsistent spacing
* arbitrary colors
* arbitrary typography

Create reusable design tokens or utilities when appropriate.

## Responsive Design

Every feature must work across:

* desktop
* laptop
* tablet
* mobile

Do not consider a component finished until its responsive behavior has been considered.

## Accessibility

Use:

* semantic HTML
* accessible buttons and links
* keyboard navigation
* visible focus states
* proper heading hierarchy
* meaningful image alt text
* accessible forms
* sufficient contrast

Use ARIA only when necessary.

## Performance

Prioritize:

* optimized images
* lazy loading when appropriate
* minimal JavaScript
* efficient rendering
* avoiding unnecessary dependencies
* avoiding unnecessary client components

Real-estate pages may contain many large images, so image performance is especially important.

## Error Handling

Handle realistic failure states.

Consider:

* missing property data
* missing images
* unavailable documents
* invalid routes
* empty property collections
* failed external services

Do not allow one missing optional field to break an entire page.

## SEO

Important pages should have:

* unique metadata
* correct heading structure
* canonical URLs where appropriate
* Open Graph metadata
* appropriate structured data where applicable

Property pages must be individually indexable.

## Code Review

Before considering an implementation complete, check:

1. Is anything duplicated?
2. Can this component be reused?
3. Is any data unnecessarily hard-coded?
4. Are TypeScript types correct?
5. Does it work on mobile?
6. Is it accessible?
7. Is unnecessary client-side JavaScript being used?
8. Are images optimized?
9. Are there console errors?
10. Does the production build succeed?

## Important Rule

Do not refactor code simply for the sake of refactoring.

Make improvements when they materially improve:

* maintainability
* performance
* accessibility
* reliability
* scalability

Favor pragmatic engineering over over-engineering.
