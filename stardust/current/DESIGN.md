---
_provenance:
  writtenBy: stardust:extract
  writtenAt: 2026-11-15T09:45:00Z
  mode: descriptive (current state of https://www.reply.com/)
  readArtifacts: [stardust/current/_computed-styles.json, stardust/current/assets/css/, stardust/current/_brand-extraction.json]
colors:
  background: "#ffffff"
  ink: "#151f27"
  ink-secondary: "#28333e"
  muted: "#586674"
  muted-2: "#8d99a5"
  border: "#d6e0ea"
  accent-red: "#eb0037"
  accent-teal: "#00e0ce"
  accent-yellow: "#ffd138"
  accent-orange: "#ff8c00"
  brand-green: "#00ea51"
typography:
  heading: "Alaska (Beta Contrast cuts, weights 100/300/500/700), sans-serif"
  label: "Alaska Expanded (400/500)"
  ramp: "64 / 42 / 36 / 28 / 24 / 20 / 18 / 16 / 14 / 12 / 10 px"
rounded:
  default: 6px
  pill: 50%
spacing: "Tailwind 4px scale; container px-10 (40px) gutters on mobile"
components:
  card: "reply-card — image (16:9 / 1:1), category dot + label, h6 title; shadow rgba(0,0,0,.2) 0 16px 32px"
  button: "label typography, rounded-md, dark ink or white on dark"
---

# Design — Reply (current state, descriptive)

## Overview
Corporate, editorial, technology register. A white canvas with deep navy-black ink (`#151f27`) carries large, light-weight Alaska headlines; full-bleed photography or DAM video heroes; and dark navy sections (`#151f27`, `#28333e`) for carousels and feature rows. A red accent (`#eb0037`) marks highlights and category dots; teal, yellow and orange appear as category colors on cards. The 4brands Reply sub-brand reuses the system with its own logo and green brand color (`#00ea51`, page-level `--brand-color`).

## Colors
White `#ffffff` background (dominant by area), ink `#151f27` for headings and dark sections, `#28333e` secondary surface, muted greys `#586674` / `#8d99a5`, hairline `#d6e0ea`. Accents: red `#eb0037`, teal `#00e0ce`, yellow `#ffd138`, orange `#ff8c00`. Source: `_computed-styles.json#aggregate.colors`.

## Typography
One family, Alaska (newglyph, commercial), in contrast cuts for headings/body and expanded cuts for labels and buttons. Named ramp classes in the theme stylesheet: `h1--light` 2.25rem/300/1.1 up to 64px display sizes on large screens, `h3` 1.75rem, `h4` 1.5rem, `h5` 1.25rem, `h6` 1.125rem, `h7` 1rem, `paragraph-01` 1rem/300/1.7, `paragraph-02` .875rem/300/1.7, `label-*` .625–.875rem expanded, `footer-text` .75rem/300.

## Elevation
Cards lift with `rgba(0,0,0,.2) 0 16px 32px` (hover) and `rgba(0,0,0,.1) 0 16px 32px`. Radius 6px on cards/buttons, 50% on dots and round controls.

## Components
Sticky header with language selector, logo and mega menu; card carousels; case-study masonry wall with "load more"; featured banner cards (card-hero); abstract banner CTA; stats counters; accordions; tabs; HubSpot forms; footer with link columns and legal row.

## Do's and Don'ts
Descriptive snapshot — the target for a replica run is this state verbatim.
