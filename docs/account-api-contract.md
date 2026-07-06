# Account API Contract — v1

Target for the rebuilt API server. Frontend (`useAccount.js`, `useAccountPanels.js`, `panelRegistry.tsx`) is already written against this shape.

## Conventions

- **Single resource:** `{ "success": true, "data": { ...fields } }`
- **List resource:** `{ "success": true, "data": [...], "meta": { "total": N } }` — `data` always means "the payload," never nested inside itself. Anything about the response that isn't the resource (counts, pagination, search context) goes in `meta`.
- **Errors:** non-2xx status, body `{ "error": "message" }` — matches `apiClient.js`'s existing `handleResponse`.
- **Empty is not an error.** An account with no services returns `200` with `"services": { "present": false }` and (if the panel is opened anyway) an empty list — never a 404 for "this offering doesn't exist."
- Field naming stays lowercase/`snake__c`-style, consistent with what `/tracks` already returns — no raw Salesforce PascalCase reaching the frontend.
- **Required, singular relations get a summary ref; optional, collection relations get lazy-loaded.** These are different shapes of relationship and get different treatment:
  - An event always has exactly one facility, one organizer, one track — never absent. Embed a small **ref** object (`{ id, slug, name, logo_url }`, ~4 fields) inline. Full detail is one call away at that entity's own canonical endpoint (`GET /accounts/:id`, `GET /tracks/:id`) if a consumer needs more than the ref gives them.
  - An account's tracks/events/services/products/sponsorships are 0-to-many and often absent. These stay behind the `offerings` map + per-resource endpoints, fetched only when their panel opens (see below) — that's the right call *specifically because* they're optional and collection-shaped, not because "related data" in general should be fetch-on-demand.

### Migrating existing list endpoints

`/tracks` and `/tracks/nearby` predate this convention and currently disagree with each other:

| Endpoint | Current shape | New shape |
|---|---|---|
| `GET /tracks` | `data: { data: [...], total: N }` | `data: [...]`, `meta: { total: N }` |
| `GET /tracks/nearby` | `data: { searchLocation, radiusMeters, totalResults, tracks: [...] }` | `data: [...]`, `meta: { total: N, searchLocation, radiusMeters }` |
| `GET /events/nearby` | (same double-nested pattern, raw Salesforce event fields) | `data: [...]`, `meta: { total: N }` — and each event should be the same `Event` shape defined under `GET /accounts/:id/events` below |

Bring these three in line with the rest of the API at the same time as the new accounts endpoints, rather than shipping a third variant. Frontend follow-up for these is listed below.

## Endpoints

| Method | Path | Returns |
|---|---|---|
| GET | `/accounts/:idOrSlug` | Account summary + `offerings` presence/count map |
| GET | `/accounts/:id/tracks` | List of tracks/circuits at this facility |
| GET | `/accounts/:id/events` | List of events this account organizes/hosts |
| GET | `/accounts/:id/services` | List of services this account offers |
| GET | `/accounts/:id/products` | List of products this account makes/sells |
| GET | `/accounts/:id/sponsorships` | Sponsorships this account **receives** |
| GET | `/accounts/:id/sponsoring` | Sponsorships this account **gives** |

`tracks`/`events`/`services`/`products`/`sponsorships`/`sponsoring` are the six `AccountOfferingKey` values — every account gets all six keys in its `offerings` map, `present` decided purely by whether a matching row exists, never by `recordtypename`.

---

## `GET /accounts/:idOrSlug`

```json
{
  "success": true,
  "data": {
    "id": 210,
    "sfid": "0015e000019qWvlAAE",
    "name": "Eagles Canyon Raceway",
    "common_name__c": "Eagles Canyon",
    "slug__c": "eagles-canyon",
    "recordtypeid": "0125e000001tHLwAAM",
    "recordtypename": "Facility",
    "billingcity": "Decatur",
    "billingstate": "TX",
    "billingcountry": "USA",
    "billingstreet": "7629 FM 51",
    "billingpostalcode": null,
    "billinglatitude": 33.365259,
    "billinglongitude": -97.426521,
    "description": "...",
    "website": null,
    "phone": null,
    "logo_url__c": "",
    "logo_background_color__c": null,
    "logo_authorized__c": true,
    "offerings": {
      "tracks":        { "present": true,  "count": 3 },
      "events":        { "present": true,  "count": 2 },
      "services":      { "present": true,  "count": 4 },
      "products":      { "present": false },
      "sponsorships":  { "present": true,  "count": 1 },
      "sponsoring":    { "present": false }
    }
  }
}
```

No `account` wrapper, no nested `tracks`/`services`/`sponsors` arrays — that's the whole point of the redesign. Removing that wrapper also removes the workaround currently in `fetchAccount`.

### Computing `offerings`

One roundtrip, six cheap scalar counts against indexed FK columns — don't join/fetch full rows just to discard them:

```sql
SELECT
  (SELECT COUNT(*) FROM tracks       WHERE facility_id = :id)                    AS tracks_count,
  (SELECT COUNT(*) FROM events       WHERE account_id  = :id)                    AS events_count,
  (SELECT COUNT(*) FROM services     WHERE account_id  = :id)                    AS services_count,
  (SELECT COUNT(*) FROM products     WHERE account_id  = :id)                    AS products_count,
  (SELECT COUNT(*) FROM sponsorships WHERE sponsored_account_id = :id)           AS sponsorships_count,
  (SELECT COUNT(*) FROM sponsorships WHERE sponsor_account_id   = :id)           AS sponsoring_count;
```

Real-time counts are fine at your scale (a few thousand accounts, single-digit rows per relation) — no denormalized counter columns needed unless this endpoint gets demonstrably hot later.

---

## `GET /accounts/:id/tracks`

Same fields `/tracks` already returns per track (`id`, `name`, `track_type`, etc.), wrapped in the `data`/`meta` shape above instead of the old double-nested one — scoped to one facility. **Verified live** against `/accounts/210/tracks` — matches.

### Track visual identity: three optional image fields, not one

A track/config gets its own visual identity, mirroring the Account pattern (`logo_url__c` + `image_url__c`) plus a third field unique to tracks:

```json
{
  "id": 177,
  "sfid": "177",
  "name": "Default",
  "track_type": "Road Course",
  "surface_type": null,
  "length_meters": "4.20",
  "logo_url": null,
  "image_url": null,
  "layout_image_url": null
}
```

- `logo_url` — a track-specific emblem, distinct from the parent facility's brand. Expect this null on most rows; only tracks famous/branded enough to have their own mark (a named historic layout, say) will populate it. Falls back to the facility's own logo in the UI when absent.
- `image_url` — a photo specific to this config (its own clubhouse, paddock, front straight) — distinct from the facility's own `image_url__c`, since a facility with three configs may want three different photos.
- `layout_image_url` — the schematic track map. Unique to tracks; a facility doesn't have "a shape," only its individual configs do. This is the one that matters for recognizing a track at a glance.

**The track ref embedded in events stays lean — `layout_image_url` only, not all three.** Someone scanning a list of events benefits from the map (recognize the track by shape), but a track's own logo/photo isn't relevant until they click through to the track itself. Full detail (all three images + `surface_type`/`length_meters`) lives on `/accounts/:id/tracks` and the track's own canonical endpoint below — same ref-vs-full-resource split already used for facility/organizer.

### `GET /tracks/:id` — a track's own canonical endpoint (new)

Doesn't exist yet. Needed to support an individual track detail page (`/tracks/:id` in the frontend) the same way `GET /accounts/:idOrSlug` backs the account page:

```json
{
  "success": true,
  "data": {
    "id": 177,
    "name": "Default",
    "track_type": "Road Course",
    "surface_type": null,
    "length_meters": "4.20",
    "logo_url": null,
    "image_url": null,
    "layout_image_url": null,
    "facility": { "id": 230, "slug": "high-plains", "name": "High Plains Raceway", "logo_url": "" }
  }
}
```

`facility` embedded as the same lean `AccountRef` used elsewhere — a track always has exactly one facility (required, singular → ref, not a separate call).

**Verified live against `/tracks/177` — two mismatches, not yet matching this contract:**
1. Facility fields come back flattened with a `facility__` prefix (`facility__id`, `facility__slug`, `facility__name`, `facility__sfid`, `facility__city`, `facility__state`, `facility__latitude`, `facility__longitude`, `facility__image_url`, `facility__logo_url`) instead of nested as `facility: { id, slug, name, logo_url }`. This is the same flattened pattern the old `/accounts/:id/events` had before it was cleaned up to nested refs — needs the same treatment. Drop `sfid`/`city`/`state`/`latitude`/`longitude`/`image_url` from the ref entirely; those belong to the facility's own `GET /accounts/:id`, not a lean ref.
2. Only `image_url` is present on the track itself — `logo_url` and `layout_image_url` are both missing from the live response.

## `GET /accounts/:id/services` / `GET /accounts/:id/products`

```json
// services — verified live against /accounts/210/services, with description added
{
  "success": true,
  "data": [
    { "id": 10, "name": "Track", "category": "Rental", "premium__c": false, "description": null }
  ],
  "meta": { "total": 1 }
}
```

`premium__c` is a boolean flag marking a service as a standout/excellence offering (not numeric, not free text) — worth rendering as a small badge/star on the row rather than lumped in with `category`. There's no `description` column yet; add one (nullable text) to both `services` and `products` — a name + category alone doesn't say much for something like "Trackside Support," and adding it now avoids a migration later once the panel already assumes name+category is the whole story. `category` is doing real filtering/badge work (renders as the muted tag next to each row) — worth making it a controlled picklist server-side (`Rental`, `Camping`, `Trackside Support`, `Fuel`, `Parts`, ...) rather than free text, same way `track_type` already is for tracks. `products` also keeps the existing `sku` field, which is more relevant to Manufacturer parts than facility services.

---

## `GET /accounts/:id/events` — and the shared `Event` shape

This isn't accounts-only — the same `Event` object should be returned by `/events/nearby`, and later a `/users/:id/events` (planned/attended) endpoint. One shape, reused everywhere, rather than a per-context variant.

Live `/accounts/230/events` today is the old "everything at once" pattern: raw `snake_case__c` Salesforce fields, and the *entire* facility/organizer/track/config record duplicated inline on every single row (12 events × the full parent objects). That needs the same lean-up tracks/services already got — but unlike those, don't strip the relations down to bare IDs either. An event always has exactly one facility, one organizer, one track (see the ref-vs-lazy-load rule above) — so keep small ref objects inline, just not the full records:

```json
{
  "success": true,
  "data": [
    {
      "id": 3582,
      "sfid": "3582",
      "event_code": "TDE-00123",
      "status": "Active",
      "type": "Motorcycle",
      "start_date": "2024-01-07T08:00:00.000Z",
      "end_date": null,
      "event_format": "3 Group Fixed",
      "event_url": "https://highplainsraceway.motorsportreg.com/events/...",
      "facility":  { "id": 230, "slug": "high-plains", "name": "High Plains Raceway", "logo_url": "" },
      "organizer": { "id": 230, "slug": "high-plains", "name": "High Plains Raceway", "logo_url": "" },
      "track":     { "id": 182, "name": "Default", "track_type": "Road Course", "layout_image_url": null }
    }
  ],
  "meta": { "total": 12 }
}
```

Notes:
- `track.layout_image_url` (nullable) — the track's physical layout/config diagram, distinct from `facility.logo_url`/`organizer.logo_url` (brand marks). This existed as `config__image` on the old raw dump (already `null` for most rows there) and got dropped when the event endpoints were cleaned up to the lean ref shape — add it back to the `track` ref specifically, since it's genuinely useful for recognizing a track by shape and belongs with the track, not the event.
- `event_code` replaces the current `name`/`Name` field (`TDE-00123`) — it's Salesforce's auto-generated unique record code, not a display title (live data confirms `Name` is `null` on every event). Sync it into Postgres as its own column and keep exposing it — it reads well as a small reference-number badge in the UI — but don't treat it as the title.
- There's no dedicated "title" in the data model. Rather than inventing one server-side, compose the display line client-side from fields that already carry real meaning: `event_format` + `facility.name`/`organizer.name` + `start_date` (e.g. "3 Group Fixed — High Plains Raceway — Jan 7, 2024"). Revisit this only if you later add a real editable event title in Salesforce.
- `facility` and `organizer` happen to be the same account in this example (a facility running its own event) — keep them as two separate fields regardless; they're independent FKs that often, but don't always, point at the same account.
- On `/accounts/:id/events` specifically, the embedded `facility` ref will usually be redundant with the account page you're already on — that's fine, leave it in. A 4-field ref costs little, and one consistent `Event` shape across every caller is worth more than trimming it per call site.

### `/accounts/:id/events` needs the same upcoming-only filter `/events/nearby` already has

**Verified live, not yet fixed.** `GET /events/nearby` correctly filters — its `meta` includes `start_date`/`end_date` bounded to today forward, and every event returned is genuinely upcoming. `GET /accounts/230/events`, by contrast, returns all 12 events unfiltered — sorted ascending, but starting from `2024-01-07`, all in the past relative to today. The account panel is labeled "Upcoming Events" (`panelRegistry.tsx`), so this endpoint should apply the same `start_date >= now()` filter (and `ORDER BY start_date ASC`) that `/events/nearby` already gets right — bring the two in line rather than only fixing one.

---

## `GET /accounts/:id/sponsorships` (received) and `GET /accounts/:id/sponsoring` (given)

Same underlying `sponsorships` table, opposite FK direction — but **the "sponsoring" side needs a target-type discriminator**, since you described it as "a company may sponsor an event or an organization." That's a polymorphic target, not always account-to-account:

```json
// GET /accounts/88/sponsoring   (WeatherTech's outbound sponsorships)
{
  "success": true,
  "data": [
    {
      "id": 501,
      "target_type": "Account",
      "target_id": 210,
      "target_name": "Eagles Canyon Raceway",
      "tier": "Title Sponsor",
      "season": "2026"
    },
    {
      "id": 502,
      "target_type": "Event",
      "target_id": 3301,
      "target_name": "WeatherTech Raceway Laguna Seca Grand Prix",
      "tier": "Presenting Sponsor",
      "season": "2026"
    }
  ],
  "meta": { "total": 2 }
}
```

```json
// GET /accounts/210/sponsorships   (Laguna Seca's inbound sponsorships)
{
  "success": true,
  "data": [
    {
      "id": 501,
      "sponsor_account_id": 88,
      "sponsor_name": "WeatherTech",
      "sponsor_logo_url": "...",
      "tier": "Title Sponsor",
      "season": "2026"
    }
  ],
  "meta": { "total": 1 }
}
```

Underlying table shape this implies: `sponsorships(id, sponsor_account_id, target_type, target_id, tier, season, ...)` with `target_type` discriminating `Account` vs `Event`. `/sponsorships` (received) only ever makes sense where `target_type = 'Account'`, filtered on `target_id = :accountId` — an event's sponsors would logically hang off an event-detail endpoint later, not an account's `sponsorships` list.

---

## Frontend changes once this lands

Accounts scaffold:
- `types/account.ts`: add `sponsoring` to `AccountOfferingKey`/`AccountOfferings`; split `AccountSponsorship` into received-shape (`sponsor_name`, ...) vs given-shape (`target_type`, `target_name`, ...) rather than one shared interface — the "other party" fields genuinely differ. Add a shared `AccountRef` type (`{ id, slug, name, logo_url }`) for the embedded facility/organizer/track refs. Redefine `AccountEvent` to match the verified shape: drop `name`, add `event_code`, `event_format`, `event_url`, `facility`, `organizer`, `track` (the last three typed as `AccountRef`). Update `AccountService`/`AccountProduct`: add `premium__c: boolean`, keep `description: string | null` once the server adds that column (currently missing there).
- `lib/queries/useAccountPanels.js`: add `useAccountSponsoring` alongside `useAccountSponsorships`; update `fetchAccountResource` to read `res.data.data` (array) + `res.data.meta.total` instead of the old shape.
- `components/account/panels/`: add a `SponsoringPanel` (mirrors `SponsorshipsPanel`, renders `target_type` as a badge since a row can be either an event or an account). Update `EventsPanel` to compose its display line from `event_format` + `facility.name`/`organizer.name` + `start_date` instead of a `name` field, and render `event_code` as a small secondary badge, not the title.
- `panelRegistry.tsx`: register `sponsoring`; fix `PRIMARY_OFFERING_BY_RECORD_TYPE.Sponsor` — currently `"sponsorships"`, should be `"sponsoring"` (a Sponsor account's main thrust is giving sponsorships, not receiving them).
- `lib/queries/useAccount.js`: drop the `.account` unwrap — **verified live**, the server no longer nests under that key.

Existing endpoints migrating to the same list convention:
- `lib/queries/useTracks.js`: `fetchTracks` and `fetchTracksNearby` currently `return res.data.data` as the `{ data, total }` / `{ tracks, totalResults }` object — change to return `res.data.data` (the array itself) and `res.data.meta` separately, or return `{ items: res.data.data, total: res.data.meta.total }` so callers don't have to know the envelope shape.
- `app/(newdesign)/tracks/TracksPage.tsx:91`: destructure changes from `const { tracks, totalResults } = data` to match whatever `useTracksNearby` ends up returning.
- `lib/queries/useEvents.js`: same `res.data.data` unwrap update for `/events/nearby`.
