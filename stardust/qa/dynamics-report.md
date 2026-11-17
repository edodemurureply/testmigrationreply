# Dynamics parity check — https://main--a355dc1b--aemcoder.aem.live — 2026-11-16T20:25:28.767Z

Replayed 66 checks over 59 features · pass 61 · fail 5. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| unknown third-party host www.google.com | A | done | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host px.ads.linkedin.com | A | done | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host cta-eu1.hubspot.com | A | done | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| CMS / app settings object dataLayer | A | scaffolded-awaiting-owner | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host js.zi-scripts.com | A | done | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host ws.zoominfo.com | A | done | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host aorta.clickagy.com | A | done | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host hemsync.clickagy.com | A | done | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| first-party API GET /api/content-list/default | A | interim | dom-count | PASS | 15 × .card-carousel.ink li (min 15) | dam-media.reply.com:200×19 :200×3 |
| first-party API GET /api/content-list/default | A | interim | dom-count | PASS | 48 × .card-carousel.flush li (min 48) |  |
| unknown third-party host ibc-flow.techtarget.com | A | done | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host t.co | A | done | consent-gate | PASS | no request to 1 gated host pattern(s) before consent |  |
| first-party API GET /product-detail/SW10234,SW10238,SW10237 | A | interim | dom-count | PASS | 3 × .rose-cta a[href*="onlineservices.reply.com"] (min 3) |  |
| unknown third-party host www.facebook.com | A | done | consent-gate | PASS | no request to 1 gated host pattern(s) before consent |  |
| first-party API GET /api/content-meta-options/article | A | interim | dom-count | PASS | 35 × .explore li (min 35) |  |
| client-rendered slot card-carousel-runtime d-flex | CR | done | dom-count | PASS | 15 × .card-carousel.ink li (min 15) | dam-media.reply.com:200×19 :200×3 |
| client-rendered slot card-carousel-runtime d-flex | CR | done | dom-count | PASS | 48 × .card-carousel.flush li (min 48) |  |
| client-rendered slot mnrycjmtjs mnrycjmtjs-md mnrycjmtjs-lg | CR | done | dom-count | PASS | 5 × .prepare img (min 5) |  |
| first-party data file GET /media-delivery/model/{uuid}.json | D | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 19 (ok) | dam-media.reply.com:200×19 :200×3 |
| form backend: HubSpot forms | F | scaffolded-awaiting-owner | consent-gate | PASS | no request to 3 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| form-less control group in section.jcjdesgllh (3 controls) | F | done | dom-count | PASS | 3 × .labs li (min 3) |  |
| form-less control group in section.fvkykaiztp (4 controls) | F | done | dom-count | PASS | 4 × .b4-split li (min 4) |  |
| form "ref: <Node>" → third-party www.facebook.com (47 fields) | F | scaffolded-awaiting-owner | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |
| form-less control group in section.etkytuxfdy (7 controls) | F | done | dom-count | PASS | 7 × .labs.ice li (min 7) |  |
| locale variants de,en,fr,it,pt | I18N | pending locale wave | dom-count | FAIL | 0 × header .lang-selector-dropdown a[href^="https://www.reply.com/"] (min 4) | dam-media.reply.com:200×19 :200×3 |
| locale variants de,en | I18N | pending locale wave | dom-count | PASS | 1 × header .lang-selector-dropdown a[href$="/4brands-reply/de"] (min 1) |  |
| locale variants de,en | I18N | pending locale wave | dom-count | FAIL | 0 × header .lang-selector-dropdown a[href^="https://www.reply.com/"] (min 1) |  |
| locale variants de,en,it,pt | I18N | pending locale wave | dom-count | FAIL | 0 × header .lang-selector-dropdown a[href^="https://www.reply.com/"] (min 3) |  |
| listing candidate carousel-items (7 cards) | L | interim | dom-count | PASS | 7 × .discover-also li (min 7) |  |
| listing candidate carousel-items (7 cards) | L | interim | dom-count | PASS | 7 × .card-carousel.latest li (min 7) |  |
| listing candidate carousel-items (33 cards) | L | interim | dom-count | PASS | 33 × .card-carousel.highlights li (min 33) | dam-media.reply.com:200×19 :200×3 |
| listing candidate carousel-items carousel-items--runtime (15 cards) | L | interim | dom-count | PASS | 15 × .card-carousel.ink li (min 15) | dam-media.reply.com:200×19 :200×3 |
| listing candidate contents (13 cards) | L | interim | dom-count | PASS | 13 × .cards-wall .cards-wall-item (min 13) |  |
| listing candidate carousel-items (8 cards) | L | interim | dom-count | PASS | 13 × .card-carousel.horizontal.ice li (min 13) |  |
| listing candidate carousel-items (17 cards) | L | interim | dom-count | PASS | 17 × .card-carousel.scale.split li (min 17) |  |
| listing candidate carousel-items (5 cards) | L | interim | dom-count | PASS | 13 × .card-carousel.horizontal.ice li (min 13) |  |
| listing candidate carousel-items (6 cards) | L | interim | dom-count | PASS | 6 × .b4-news li (min 6) |  |
| listing candidate contents (4 cards) | L | interim | dom-count | PASS | 4 × .cards-wall.dark .cards-wall-item (min 4) |  |
| listing candidate carousel-items (14 cards) | L | interim | dom-count | PASS | 14 × .card-carousel.ls-17 li (min 14) |  |
| listing candidate carousel-items carousel-items--runtime (16 cards) | L | interim | dom-count | PASS | 48 × .card-carousel.flush li (min 48) |  |
| modal trigger aria-haspopup (chrome only) → div:content/menu:content/search:form/menubar:content/button:content | M | done | dom-count | PASS | 9 × header button[aria-haspopup][aria-controls] (min 9) | dam-media.reply.com:200×19 :200×3 |
| modal trigger aria-haspopup (chrome only) → div:content/menu:content/search:form/menubar:content/button:content | M | done | dom-count | PASS | 76 × header .mega-menu a (min 76) | dam-media.reply.com:200×19 :200×3 |
| modal trigger aria-haspopup (chrome only) → div:content/menu:content/search:form/menubar:content/button:content | M | done | no-page-errors | PASS | none on 8 page(s) |  |
| modal trigger aria-haspopup → div:content/menu:content/search:form/menubar:content/button:content | M | done | dom-count | PASS | 11 × header .mega-menu.mega-menu-mini a (min 4) |  |
| modal trigger aria-haspopup → div:content/menu:content/search:form/menubar:content/button:content | M | done | dom-count | PASS | 11 × header .mega-menu a (min 11) |  |
| site search form → /en/search | S | pending search | dom-count | FAIL | 0 × header form[action^="https://www.reply.com/"] (min 1) | dam-media.reply.com:200×19 :200×3 |
| site search form → (JS-submitted) | S | pending search | dom-count | FAIL | 0 × header form[action^="https://www.reply.com/"] (min 1) |  |
| consent: OneTrust | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 2 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host replydam.discoveryreplymedia.com | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| tag manager: Google Tag Manager | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host sleeknotecustomerscripts.sleeknote.com | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| analytics: Google Analytics / Ads | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 2 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| marketing: ad / retargeting pixel | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 10 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host www.linkedin.com | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host px4.ads.linkedin.com | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| marketing: HubSpot tracking | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 4 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host track-eu1.hubspot.com | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host www.facebook.com | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host static.ads-twitter.com | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host tags.clickagy.com | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host us-u.openx.net | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host analytics.twitter.com | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| unknown third-party host trk.techtarget.com | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 1 gated host pattern(s) before consent | dam-media.reply.com:200×19 :200×3 |
| iframe without src (runtime-injected embed) | V | done | dom-count | PASS | 1 × .b4-offices iframe[src*="maps.google"] (min 1) |  |
| maps: embedded map service | V | done | dom-count | PASS | 1 × .b4-offices iframe[src*="maps.google"] (min 1) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (2 gated · 0 cross-site host(s) blocked) |  |

## Features without checks
