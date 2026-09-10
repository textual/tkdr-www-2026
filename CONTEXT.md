# Trakdayr

A directory and personal-logbook app for track-day motorsports: finding facilities/tracks/events, and (planned) tracking your own vehicles, maintenance, and track sessions against them.

## Language

**Account**:
A business entity — a facility, organizer, sponsor, or similar — never a person. Every Account exposes a fixed set of `AccountOfferingKey`s (`tracks`, `events`, `services`, `products`, `sponsorships`, `sponsoring`), each `present` or not depending on whether matching rows exist.
_Avoid_: Business, org, entity (for this specific concept)

**User**:
A logged-in person. Distinct from Account — a User doesn't own facilities or events, they log their own Vehicles, ServiceRecords, and Sessions, and can Comment or (planned) Review.
_Avoid_: Person, Profile, Member — "Profile" is fine as the *page name* for viewing a User's data, but is not a separate domain entity.

**Vehicle**:
A motorcycle (or other track vehicle) a User owns and brings to track days. A User may have several.

**ServiceRecord**:
Maintenance/repair work a User logs against one of their Vehicles (e.g. an oil change). Distinct from an Account's `services` offering, which is a business's service catalog, not a personal maintenance log.
_Avoid_: Service (collides with `AccountOfferingKey.services`)

**Session**:
A User's logged track-day outing: one Vehicle, one Event, mileage, a manually-entered best lap time, and (planned) photos/videos. All fields are user-entered — no telemetry or automatic timing.

**Check-in**:
The act of confirming a User is present at an Event before they can log a Session against it. Gated by GPS: the User's location is sent to the API (same mechanism as nearby-event search), which returns eligibility; a roster/vehicle-selection step follows, in the style of the old check-in flow.

**Comment**:
A polymorphic reply attached to any commentable object (ServiceRecord today; others later), addressed by a `parent_type`/`parent_id` pair rather than a per-type table or endpoint.

**Review**:
A polymorphic rating/write-up on any reviewable object (Account, Track, Product, etc.), addressed the same `parent_type`/`parent_id` way as Comment — built fresh on that pattern, not on the old per-type Review code it replaces.

**Attachment**:
A polymorphic photo or video attached to any object (ServiceRecord, Session, Comment, etc.) via `parent_type`/`parent_id`/`media_type`, rather than a one-off image field per entity.
