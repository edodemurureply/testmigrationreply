<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-15T12:04:50.100Z · input stardust/current/_dynamics.json (8 pages, 58 findings) · target probe https://main--a355dc1b--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 8/8 | static-snapshot | — | needs-human-capture | delivered-by-capture | inspect | inspect the XHR, add a vendor row | output already carries "www.google.com" |
| 2 | a-unknown-third-party-host-px-ads-linkedin-com | A | unknown third-party host px.ads.linkedin.com | 8/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-cta-eu1-hubspot-com | A | unknown third-party host cta-eu1.hubspot.com | 8/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 8/8 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 5 | a-unknown-third-party-host-js-zi-scripts-com | A | unknown third-party host js.zi-scripts.com | 5/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 6 | a-unknown-third-party-host-ws-zoominfo-com | A | unknown third-party host ws.zoominfo.com | 5/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 7 | a-unknown-third-party-host-aorta-clickagy-com | A | unknown third-party host aorta.clickagy.com | 5/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 8 | a-unknown-third-party-host-hemsync-clickagy-com | A | unknown third-party host hemsync.clickagy.com | 5/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 9 | a-first-party-api-get-api-content-list-default | A | first-party API GET /api/content-list/default | 4/8 (reach 20/100) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 10 | a-unknown-third-party-host-ibc-flow-techtarget-com | A | unknown third-party host ibc-flow.techtarget.com | 2/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 11 | a-unknown-third-party-host-t-co | A | unknown third-party host t.co | 1/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 12 | a-first-party-api-get-product-detail-sw10234-sw10238-sw10237 | A | first-party API GET /product-detail/SW10234,SW10238,SW10237 | 1/8 (reach 1/100) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 13 | a-unknown-third-party-host-www-facebook-com | A | unknown third-party host www.facebook.com | 1/8 | static-snapshot | — | needs-human-capture | delivered-by-capture | inspect | inspect the XHR, add a vendor row | output already carries "www.facebook.com" |
| 14 | a-first-party-api-get-api-content-meta-options-article | A | first-party API GET /api/content-meta-options/article | 1/8 (reach 1/100) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 15 | cr-client-rendered-slot-card-carousel-runtime-d-flex | CR | client-rendered slot card-carousel-runtime d-flex | 2/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 16 | cr-client-rendered-slot-mnrycjmtjs-mnrycjmtjs-md-mnrycjmtjs- | CR | client-rendered slot mnrycjmtjs mnrycjmtjs-md mnrycjmtjs-lg | 1/8 | static-snapshot | content | self | delivered-by-capture | settled-dom-snapshot | inspect the consumer | output already carries "Getting prepared for 2021" |
| 17 | d-first-party-data-file-get-media-delivery-model-uuid-json | D | first-party data file GET /media-delivery/model/{uuid}.json | 1/8 (reach 22/100) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 18 | f-form-backend-hubspot-forms | F | form backend: HubSpot forms | 8/8 | rebuild-native | block | needs-backend | pending | forms | production backend (vendor form id + field mapping) |  |
| 19 | f-form-less-control-group-in-section-jcjdesgllh-3-controls | F | form-less control group in section.jcjdesgllh (3 controls) | 1/8 | client-only | widget | self | pending | client-compute | none |  |
| 20 | f-form-less-control-group-in-section-fvkykaiztp-4-controls | F | form-less control group in section.fvkykaiztp (4 controls) | 1/8 | client-only | widget | self | pending | client-compute | none |  |
| 21 | f-form-ref-node-third-party-www-facebook-com-47-fields | F | form "ref: <Node>" → third-party www.facebook.com (47 fields) | 1/8 | rebuild-native | block | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 22 | f-form-less-control-group-in-section-etkytuxfdy-7-controls | F | form-less control group in section.etkytuxfdy (7 controls) | 1/8 | client-only | widget | self | pending | client-compute | none |  |
| 23 | i18n-locale-variants-de-en-fr-it-pt | I18N | locale variants de,en,fr,it,pt | 4/8 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 24 | i18n-locale-variants-de-en | I18N | locale variants de,en | 3/8 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 25 | i18n-locale-variants-de-en-it-pt | I18N | locale variants de,en,it,pt | 1/8 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 26 | l-listing-candidate-carousel-items-7-cards | L | listing candidate carousel-items (7 cards) | 2/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 27 | l-listing-candidate-carousel-items-33-cards | L | listing candidate carousel-items (33 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 28 | l-listing-candidate-carousel-items-carousel-items-runtime-15 | L | listing candidate carousel-items carousel-items--runtime (15 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 29 | l-listing-candidate-contents-13-cards | L | listing candidate contents (13 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 30 | l-listing-candidate-carousel-items-8-cards | L | listing candidate carousel-items (8 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 31 | l-listing-candidate-carousel-items-17-cards | L | listing candidate carousel-items (17 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 32 | l-listing-candidate-carousel-items-5-cards | L | listing candidate carousel-items (5 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 33 | l-listing-candidate-carousel-items-6-cards | L | listing candidate carousel-items (6 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 34 | l-listing-candidate-contents-4-cards | L | listing candidate contents (4 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 35 | l-listing-candidate-carousel-items-14-cards | L | listing candidate carousel-items (14 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 36 | l-listing-candidate-carousel-items-carousel-items-runtime-16 | L | listing candidate carousel-items carousel-items--runtime (16 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 37 | m-modal-trigger-aria-haspopup-chrome-only-div-content-menu-c | M | modal trigger aria-haspopup (chrome only) → div:content/menu:content/search:form/menubar:content/button:content | 7/8 (reach 1046/100) | rebuild-native | runtime | self | delivered-by-capture | chrome-interaction | none (the header contract is the spec) | output already carries "Services" |
| 38 | m-modal-trigger-aria-haspopup-div-content-menu-content-searc | M | modal trigger aria-haspopup → div:content/menu:content/search:form/menubar:content/button:content | 1/8 (reach 1046/100) | rebuild-native | runtime | self | delivered-by-capture | modal-loader | none | output already carries "Services" |
| 39 | s-site-search-form-en-search | S | site search form → /en/search | 5/8 (reach 0/100) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 40 | s-site-search-form-js-submitted | S | site search form → (JS-submitted) | 3/8 (reach 0/100) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 41 | t-consent-onetrust | T | consent: OneTrust | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 42 | t-unknown-third-party-host-replydam-discoveryreplymedia-com | T | unknown third-party host replydam.discoveryreplymedia.com | 8/8 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "replydam.discoveryreplymedia.com" |
| 43 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 44 | t-unknown-third-party-host-sleeknotecustomerscripts-sleeknot | T | unknown third-party host sleeknotecustomerscripts.sleeknote.com | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 45 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 46 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 47 | t-unknown-third-party-host-www-linkedin-com | T | unknown third-party host www.linkedin.com | 8/8 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.linkedin.com" |
| 48 | t-unknown-third-party-host-px4-ads-linkedin-com | T | unknown third-party host px4.ads.linkedin.com | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 49 | t-marketing-hubspot-tracking | T | marketing: HubSpot tracking | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 50 | t-unknown-third-party-host-track-eu1-hubspot-com | T | unknown third-party host track-eu1.hubspot.com | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 51 | t-unknown-third-party-host-www-facebook-com | T | unknown third-party host www.facebook.com | 7/8 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.facebook.com" |
| 52 | t-unknown-third-party-host-static-ads-twitter-com | T | unknown third-party host static.ads-twitter.com | 5/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 53 | t-unknown-third-party-host-tags-clickagy-com | T | unknown third-party host tags.clickagy.com | 5/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 54 | t-unknown-third-party-host-us-u-openx-net | T | unknown third-party host us-u.openx.net | 5/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 55 | t-unknown-third-party-host-analytics-twitter-com | T | unknown third-party host analytics.twitter.com | 4/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 56 | t-unknown-third-party-host-trk-techtarget-com | T | unknown third-party host trk.techtarget.com | 2/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 57 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 8/8 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 58 | v-maps-embedded-map-service | V | maps: embedded map service | 1/8 | embed-passthrough | content | self | delivered-by-capture | media-as-url | none (player ids are public) | output already carries "maps.googleapis.com" |

## Triage

- **Ships autonomously (reproducibility `self`):** 8 row(s) — read-settings, settled-dom-snapshot, sheet-sync, client-compute, search-index-backed.
- **One owner decision batch:** 41 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · production backend (vendor form id + field mapping) · production endpoint; interim capture ships now · scope of the locale trees · index-driven or editorially curated?.
- **Already delivered by the capture pipeline:** 9 row(s) — no work.
- **Host-bound on the target:** 4 of 4 probed API paths — the off-origin data work.

## Phases

- **tags** — 16
- **detect** — 11
- **listings** — 11
- **off-origin data** — 3
- **client tools** — 3
- **locale wave** — 3
- **capture** — 2
- **forms** — 2
- **interactive** — 2
- **search** — 2
- **data** — 1
- **embeds** — 1
- **media** — 1
