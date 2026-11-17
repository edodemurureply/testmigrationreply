# Martech hand-off

Everything below is scaffolded **off**. To ship it, set `enabled: true` on `consent.cmp` and on each route in `stardust/martech-contract.json`, then re-run `deploy/scripts/martech-scaffold.mjs` and `dynamics/scripts/dynamics-check.mjs` to confirm the enabled tags load. Enabled tags load on `www.reply.com` only; preview with `?martech=on` (add `&consent=accept` to grant every category).

## Consent

- **CMP:** OneTrust · `data-domain-script` = `93b766e1-abbc-4ac6-8595-a8b1084d9583`
- **Model `owner-decision`:** no evidence of consent gating inside the tag manager. Keep the source behaviour (route `category` null), or set a route `category` to a consent group id to load that tag manager only once the group is granted.
- **Google Consent Mode:** consent-mode calls in `tags/www.googletagmanager.com-gtm-GTM-5J8JCZQ.js`. Check it with the owner before gating a route on a category.
- **Categories** (default rule set of 2 geo rule sets — the CMP applies them, nothing to port): `C0001` Technical and strictly necessary Cookies (always active) · `C0003` Technical-Functional Cookies (inactive) · `C0002` Profiling Analytics Cookies (inactive) · `C0004` Profiling Cookies (inactive) · `C0005` Social Media Cookies (inactive)

## Routes

| id | vendor | src | CMP groups listing its host | enabled |
|---|---|---|---|---|
| google-tag-manager | Google Tag Manager | `https://www.googletagmanager.com/gtm.js?id=GTM-5J8JCZQ` | — | false |

Also seen, not routed (loaded by the tag manager or inline on the source — confirm each still fires): analytics: Google Analytics / Ads · marketing: HubSpot tracking · marketing: ad / retargeting pixel.

## Rewrite before go-live

Nothing found (or no tag-manager library read).

## Data layer

The source pages expose `dataLayer`; keep the same global names.
Rules in Google Tag Manager were not parsed. Read each library listed in `martech/tags.json` and record its rules and data elements in the contract's `tagNotes`, keyed by tag manager, each citing where it was read (`from`); until then their triggers and events come from the tagging plan.
Ask the owner for the tagging plan (solution design reference): each event, its payload and the interaction that pushes it. With it, add each push in the block that owns the interaction.
