<!-- stardust:provenance
writtenBy: stardust:extract
writtenAt: 2026-11-15T09:20:00Z
againstInput: https://www.reply.com/
readArtifacts: stardust/current/pages/*.json, stardust/current/_crawl-log.json, stardust/.work/vision.jsonl
mode: descriptive (current state, not a target)
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web — corporate marketing site of Reply (www.reply.com), multi-locale (EN, DE, FR, IT, PT at `/en`, `/de` …) with sub-brand microsites under the same origin (in scope: 4brands Reply at `/4brands-reply/de` and `/4brands-reply/en`).

## Users

_provenance: inferred — from the captured navigation (Services, Industries, Platforms, Insights, Investors, About) and page copy._

- Enterprise decision makers (CIO/CTO/CMO, line-of-business leaders) evaluating a digital services and consulting partner.
- Industry buyers looking for sector solutions (automotive, financial services, energy, healthcare, logistics, consumer goods via 4brands Reply).
- Investors and press (Investors, ESG, Governance, Company Profile pages).
- Talent and partners (Labs, events, partner pages for AWS, Google Cloud, Adobe, Microsoft).

## Product Purpose

"Reply is a company specialized in designing and implementing innovative solutions in the Digital Services, Technology and Consulting fields." (home meta description, verbatim). The site presents Reply's service lines, industry offerings, partner ecosystems, case studies ("Explore our stories"), insights and corporate/investor information. 4brands Reply: "the industry expert for the consumer goods sector and supports companies with process consulting and system integration of innovative IT solutions" (verbatim).

## Positioning

Network of specialised companies ("We are a decentralized network of specialised c[ompanies]…", company profile) positioned on innovation — AI, cloud, data, digital experience — with a strong case-study and editorial (insights, reports, events) layer.

## Capabilities and Constraints

- Content-heavy: hub pages carry card carousels and masonry case-study grids with "load more"; insights listing is filterable.
- Mega-menu header with language selector; sticky header.
- Media hosted on `dam-media.reply.com`; video players (DAM video) on podcast/event pages; HubSpot embeds on some pages.
- Brand typeface Alaska (newglyph, commercial) self-hosted on the source origin; Remix Icon icon font.

## Brand Commitments

- Register: `brand` (marketing/corporate site).
- Personality (observed): confident, technological, editorial; black/white base with a red accent, large expanded display type, full-bleed photography and dark sections.
- Anti-references (observed): no playful illustration, no rounded "app" UI — restrained corporate grid.

## Evidence on Hand

- `stardust/current/pages/<slug>.json` + `.html` — 100 live-rendered pages (Playwright, provenance on each).
- `stardust/current/assets/screenshots/` — full-page captures; `*-thumb.png` thumbnails.
- `stardust/current/assets/css/` — the source stylesheets (theme, styles, /en styles).
- `stardust/current/assets/fonts/` — Alaska font files (reference only; not rehosted) and Remix Icon.
- `stardust/current/assets/logo.svg`, `logo-4brands.svg`, `favicon.ico`.
- `stardust/current/_computed-styles.json` — computed-style census at 1440 and 360.
- `stardust/current/_crawl-log.json` — crawl audit, capture gaps, dynamic-surface roll-up.

## Product Principles

_provenance: inferred — from page composition._

1. Show the work: case studies and stories surface on nearly every page.
2. One clear message per section, big type, generous whitespace.
3. Industry and service entry points are always one click away (mega menu).

## Accessibility & Inclusion

Accessibility statement page exists (`/en/accessibility`). Observed: skip-to-main-content landmark (`#main-content`), ARIA roles on the menu. Not audited in this run.
