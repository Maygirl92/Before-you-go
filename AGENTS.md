# Before You Go — Project Instructions

## Sources of truth

- `docs/A-Build-PRD-v2.1.md` — product behaviour, screens, interaction, schema, validation, visual system, metrics.
- `docs/B-Curation-Handbook-v2.1.md` — vocabularies, quota values, prose style rules, inclusion rules, dataset shape.
- `data/countries/de/works.json` — 58 finished German records. **Content is final.**
- `data/countries/uk/works.json` — 50 finished UK records; covers remain to be resolved. **Text content is final.**
- `data/countries/{destination}/config.json` — destination vocabularies, palette, brand strings, rules and quotas.

When the documents overlap, follow the ownership boundary in §0 of each. Do not silently override, reinterpret or weaken either specification. If implementation reveals a contradiction, report it before inventing behaviour.

## Language and content

- Preserve every Chinese string exactly. Do not translate, rewrite, shorten or polish it.
- English for code, comments, identifiers and slugs.
- Never use a mutable Chinese display label as a key.
- Do not invent records, sources, citations, awards, translations or provenance. The 58 records are final; if something looks wrong, report it.

## Brand

- Wordmark is `Before You Go`, Latin type. **There is no Chinese product name** — this is a decision, not an omission.
- Slogan: 在这里，背起精神行囊
- Strings live in `config.brand`.

## Scope

Germany and the United Kingdom. Responsive web only. The European map stays as the expansion frame with two active countries.

**Do not add:** accounts · login · favourites · watched status · progress · ratings · reviews · social features · user-generated content · watch or purchase links · booking · itineraries · native apps · other countries · automated scraping · automated ingestion · AI entity linking.

## Implementation boundaries

- Build in the order given in Build PRD §12. Keep destination pages on one shared component and activate a map tile only after its page works.
- Vocabularies, quotas, palette and brand strings are configuration-driven. No hardcoding.
- Preserve the three-table shape (`candidates`, `mentions`, `works`). Local JSON is sufficient; do not introduce a database, CMS or auth provider without first documenting why the scope requires it.
- Stable English slugs in URLs and internal state.
- Every filter state shareable through the URL.
- Within a facet OR; across facets AND.
- Preserve filter state and scroll position when cards expand.

## Data rules that are easy to get wrong

- **`tier` is not a facet.** It is the default grouping and it replaces `sort_order` as the primary ordering. `sort_order` orders within a tier section.
- **Sub-tags are not filterable.** They display only. Filtering uses `theme_main`.
- **`theme_tags` need not be covered by `theme_main`.** This is legal and deliberate — **do not write a validation rule against it.** See Build PRD §8.5.
- `theme_tags` contains 1–4 values. Do not invent a second tag merely to increase the count.
- **`theme_main` is not displayed on the card.** Because of the rule above.
- `region_primary` is required, must be a member of `regions`, and alone counts toward regional minimum quotas. Region *filtering* matches any member of `regions`.
- `time_cost` is null if and only if `medium == "music"`. Music is excluded from the time-cost facet and its exclusion must be disclosed with a count.
- `medium_sub` includes `series` and `poetry`. Any earlier instruction excluding either is superseded.
- `title_zh` may be null; render `title_original` as the main title and do not repeat it below.
- `cn_edition.status` includes `original_only`; render its configured label when present.
- `on_the_ground` and `tier_reason` may be null — omit the block, never render an empty heading.

## Visual rules that are easy to get wrong

- The map uses Natural Earth country geometry and a configuration-driven six-step teal scale based on World Bank 2024 population. Lower population is lighter; no red tier.
- Country boundaries are a thin map-field-colour separation with round joins. No heavy outlines, drop shadows or decorative dots.
- Germany and the United Kingdom share `#3E756C`. The map is flat by default; the hover/focus/touch lift is 7px and reveals the shared page grey `#F1F2F2`.
- Country labels use the Chinese editorial serif in `#74333A` with a thin `#F2D8D5` halo. Ten zoom levels progressively reveal all mapped country names without overlap at maximum zoom. Do not add original-language sublabels, selection grounds or an availability legend.
- Mouse-held drag and one-finger touch drag pan the bounded map at every zoom level; a drag must suppress the following country click.
- Unavailable countries never react. Keep only the top-right open-count copy and the population legend/source.
- Keep the four destination-introduction fields in country data, but do not render them on the home page until this decision is revisited.
- **No double-click anywhere.** Hover (desktop) or tap (touch) reveals the brief; an explicit button enters.
- Theme fills are pale with deep same-hue ink. **Lightening a fill raises contrast here.** Do not darken fills to improve legibility.
- Every facet option shows a live count at rest, with no hover dependency. Zero-count options grey out but stay in place and keep their position.

## Validation

- Implement both modes. Schema violations fail in both; quota violations warn in development and fail in production.
- Print the quota gap report in both modes, as readable text.
- Print every country quota gap. Schema violations always fail. Current release exceptions are explicit configuration, never relaxed quota values: Germany quotas are not enforced; the initial 50-record UK release also prints its known gaps without lowering targets.
- Add tests for filtering logic, facet counts, URL serialisation, schema rules and representative quotas. Run them after every change. Do not weaken or skip tests to make them pass.

## Working method

- Before a milestone, read the relevant sections of both specifications in full.
- Keep changes limited to the requested milestone.
- After each milestone: list files added and changed, say how to run it, run the tests, report unresolved problems.
- Do not expand scope. If you believe something outside scope is necessary, say why and wait.
