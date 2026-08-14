# Before You Go — Project Instructions

## Sources of truth

- `docs/A-Build-PRD-v2.0.md` — product behaviour, screens, interaction, schema, validation, visual system, metrics.
- `docs/B-Curation-Handbook-v2.0.md` — vocabularies, quota values, prose style rules, inclusion rules, dataset shape.
- `data/works.json` — 58 finished records. **Content is final.**
- `data/config.json` — vocabularies, palette, brand strings, rules.

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

Germany only. Responsive web only. The European map stays as the expansion frame with one active country.

**Do not add:** accounts · login · favourites · watched status · progress · ratings · reviews · social features · user-generated content · watch or purchase links · booking · itineraries · native apps · other countries · automated scraping · automated ingestion · AI entity linking.

## Implementation boundaries

- Build in the order given in Build PRD §12. Ship the Germany page before the map.
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
- **`theme_main` is not displayed on the card.** Because of the rule above.
- `region_primary` is required, must be a member of `regions`, and alone counts toward regional minimum quotas. Region *filtering* matches any member of `regions`.
- `time_cost` is null if and only if `medium == "music"`. Music is excluded from the time-cost facet and its exclusion must be disclosed with a count.
- `medium_sub` includes `series`. Two records use it. Any earlier instruction excluding series is superseded.
- `on_the_ground` and `tier_reason` may be null — omit the block, never render an empty heading.

## Visual rules that are easy to get wrong

- **No outlines on map tiles. No drop shadows. No decorative dots.** The hover lift is a 10px translate revealing a second polygon in `#EAF0A4` behind the `#C6E3E8` face.
- Face and side colours differ by hue, not lightness (contrast 1.13). This is intentional.
- **No double-click anywhere.** Hover (desktop) or tap (touch) reveals the brief; an explicit button enters.
- Theme fills are pale with deep same-hue ink. **Lightening a fill raises contrast here.** Do not darken fills to improve legibility.
- Every facet option shows a live count at rest, with no hover dependency. Zero-count options grey out but stay in place and keep their position.

## Validation

- Implement both modes. Schema violations fail in both; quota violations warn in development and fail in production.
- Print the quota gap report in both modes, as readable text.
- Two quotas are currently unmet (移民与跨文化视角 2/4, 萨克森 primary 1/2). This is expected and visible by design — do not relax the numbers to make the build pass.
- Add tests for filtering logic, facet counts, URL serialisation, schema rules and representative quotas. Run them after every change. Do not weaken or skip tests to make them pass.

## Working method

- Before a milestone, read the relevant sections of both specifications in full.
- Keep changes limited to the requested milestone.
- After each milestone: list files added and changed, say how to run it, run the tests, report unresolved problems.
- Do not expand scope. If you believe something outside scope is necessary, say why and wait.
