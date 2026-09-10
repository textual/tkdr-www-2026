# Cross-cutting relations use a generic parent_type/parent_id pattern, not per-entity tables

Comment, Review, and Attachment (photos/videos) all need to hang off many different kinds of objects — a ServiceRecord, a Session, an Account, a Track, a Product. The prior mobile app (`trakdayr/app/01-tkdr`) proved this pattern already for its `messages`/`like` features (`parent_type`/`parent_id` on a single table/endpoint) and it worked well; its separate `Review` implementation instead duplicated a dedicated endpoint per reviewable type (`getAccountReviews`, `getTrackConfigReviews`, ...), which is exactly the duplication we're avoiding going forward.

Decision: model Comment, Review, and Attachment as generic, polymorphic (`parent_type` + `parent_id`, and `media_type` for Attachment) rather than adding a dedicated table/endpoint/field per entity that needs them. New entities that need comments, reviews, or media get this for free instead of a bespoke implementation.

Trade-off accepted: polymorphic foreign keys give up database-level referential integrity on the `parent_id` column in exchange for one reusable system instead of N duplicated ones. Chosen deliberately, based on this project's own prior experience with both approaches.
