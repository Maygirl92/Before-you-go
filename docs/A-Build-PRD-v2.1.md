# A · Build PRD
## Before You Go — Europe v1

**Version** 2.1
**Status** Ready for build
**Owner** Isla
**Date** 10 September 2026
**Companion** *B · Curation & Data Handbook v2.1* — owns vocabularies, style rules and country `config.json` contents

### Changelog 2.0 → 2.1

| # | Change | Why |
|---|---|---|
| 1 | The UK becomes the second active destination at `/uk/`; Germany remains at `/de/` | Expand without changing the published GitHub Pages address |
| 2 | `title_zh` becomes optional and nullable; the UI falls back to `title_original` | Some works have no verified, commonly used Chinese title |
| 3 | `theme_tags` changes from 2–4 to **1–4** | Requiring a second tag creates false metadata; sub-tags are display-only |
| 4 | `poetry` is added to book `medium_sub`; `original_only` is added to `cn_edition.status` | Correct classification and honest language availability |
| 5 | Destination vocabularies and data are isolated by country while the page component remains shared | Prevent UK regions, periods and sub-tags from leaking into Germany |

### Map visual decision · 11 September 2026

- Replace the nine abstract block tiles with a geographically recognisable Europe map generated from Natural Earth boundaries.
- Germany and the United Kingdom remain the only active destinations. Other European countries provide geographic context only and do not respond to hover or tap.
- Fill every country from one six-step teal population scale using World Bank 2024 population data. Lower-population countries are lighter; no red is used.
- Germany and the United Kingdom share the same darkest teal population tier. The default map is completely flat; an active country rises only while hovered, keyboard-focused or touch-selected.
- Every active country's revealed side uses the page's light grey `#F1F2F2`.
- Labels use the Chinese editorial serif in muted dark red with a fine pale-red halo. At the default zoom only the six countries above 50 million people are labelled; nine zoom-in steps progressively reveal all mapped country names without collisions at maximum zoom.
- Circular zoom controls sit at the lower left, ordered minus then plus. The map can be dragged with a held mouse pointer or one finger at every zoom level. The population legend remains, but no separate open/closed key is shown; availability is communicated only by interaction and the `02 / 09 已开放` count.
- The four destination-introduction paragraphs remain in country data but are temporarily hidden on the home page until several more countries exist.

### Changelog 1.3 → 2.0

| # | Change | Why |
|---|---|---|
| 1 | **Brand fixed.** English wordmark `Before You Go`, no Chinese product name, slogan 「在这里，背起精神行囊」 (§3) | Name owns the *moment*, slogan owns the *action* — they no longer restate each other |
| 2 | **New `tier` field and default grouping** (§6, §8.3). Replaces `sort_order` as the primary ordering. **`tier` is not a facet.** | 行前效用 is ordinal, not categorical. Six filter chips would overload the bar |
| 3 | **Prose fields renamed and respecified** (§7.4) — `summary` / `worth` / `on_the_ground` / `tier_reason` | The old「与德国的关系」asked what the *work* was; the new「值得之处」asks what the *reader* gets |
| 4 | **New `on_the_ground`** — places you can physically stand. 44 of 58 records have one | The most distinctive thing the product has |
| 5 | **Visual system replaced** (§9): high-key palette, flat blocks, no outlines, map lift interaction | Previous palette was too dark and too uniform in hue |
| 6 | Double-click removed from the map (§5.2) | Not discoverable, no touch equivalent, single-click reads as broken |
| 7 | Record count is **58**, not 30. `series` is a valid `medium_sub` | Curation is complete; two series records exist |
| 8 | `difficulty` removed | Did no mechanical work once the character-count formula went |

---

## 0. How the two documents divide

| | This document | Handbook |
|---|---|---|
| Changes when | The product changes | A work is added or the house style shifts |
| Owns | Screens, interaction, schema, validation, visual system, metrics | Vocabularies, quota numbers, prose style rules, inclusion rules, records |
| Audience | Engineering, design | Curator |

**Interface:** `config.json`. This document specifies that the build reads it; the Handbook owns its contents. Adding a sub-tag or changing a quota touches only the Handbook.

**Language.** Structure and rationale in English. **Every Chinese string in this document and in the data is final user-facing copy — do not translate, rewrite, shorten or polish it.**

---

## 1. Summary

A place-first curation tool for European cultural works. Before a trip, the user browses and filters a vetted set of films, books, documentaries and music tied specifically to the destination, and decides where to start.

No sightseeing guides. No attempt to summarise a country in one paragraph.

---

## 2. Positioning: tool, not magazine

| | Tool (what we build) | Editorial (what we don't) |
|---|---|---|
| Value from | Coverage, tagging consistency, filter precision | Taste, prose, authority |
| User arrives | With a constraint | With curiosity |
| Success | Narrowing 58 works to 3 | Reading a page top to bottom |

**Consequences:** every work is a record with mandatory fields · result count always visible · every filter state is a URL · no long-form country essays.

---

## 3. Brand and header

| Element | Value |
|---|---|
| Wordmark | `Before You Go` — Latin type, no Chinese product name |
| Slogan | **在这里，背起精神行囊** |
| Destination heading | 德国 · Deutschland |

The wordmark names the *moment*; the slogan names the *action and the thing*. They do not restate each other, and there is no Chinese product name by decision — the Chinese line on the page is the slogan.

**Home header layout:** wordmark, then slogan below it at roughly half the wordmark's size, then the map. The slogan sits outside and above the map field.

---

## 4. Scope

**Germany and the United Kingdom.** The European map remains the expansion frame; Germany and the United Kingdom are active. Other country tiles stay inactive until their own reviewed data packages exist.

### Non-goals

Accounts · login · favourites · watched status · progress · watch or purchase links · IMDb or 豆瓣 ratings · booking · itineraries · user-generated content · unreviewed country sections · native apps · automated scraping · AI entity linking.

---

## 5. Screens

### 5.1 Home

Page background is light grey. Header per §3. Below it, a white map field contains geographically recognisable European country shapes with natural coastlines and softly separated boundaries.

Every mapped country has a Chinese label. Ten zoom levels progressively disclose labels using population thresholds of `50m`, `30m`, `15m`, `8m`, `5m`, `3m`, `2m`, `1m`, `0.5m` and `0`. Labels use the Chinese editorial serif in muted dark red with a pale-red halo and never change colour with the underlying population fill. At maximum zoom all country labels must remain spatially separate. Germany and the United Kingdom are active; every other country remains non-interactive.

Country colour encodes World Bank 2024 total population in six teal steps: `<2m`, `2–5m`, `5–10m`, `10–30m`, `30–60m`, `≥60m`. Population is a map visualisation only, never a content ranking or filter. A compact legend and source year must remain visible. The only availability copy on the map is the top-right `02 / 09 已开放` count; there is no open/closed legend.

### 5.2 Map interaction

**Desktop.** The initial map is flat. Hovering an active country translates only its top face up by 7px over 260ms (`cubic-bezier(.2,.7,.3,1)`), revealing an identical country shape behind it in the shared page grey `#F1F2F2`. Labels have no selection ground or colour change. The brief panel updates below the map.

Clicking anywhere on an active tile or on the panel's button enters that destination page.

Holding and dragging anywhere inside the map pans it. Panning is available at every zoom level, is bounded so the map cannot be lost, and suppresses the country click that would otherwise follow pointer release. Ten configured zoom scales run from `1×` to `9.2×`.

**There is no double-click interaction.** It is undiscoverable, has no touch equivalent, and a single click that does nothing reads as broken.

**Touch.** The map is flat at rest. One-finger drag pans at every zoom level. A tap without a drag selects an active country and updates the brief; the brief's button enters. No hover state exists.

**Brief panel contents:** destination name, the five theme chips, and a button using the pattern `进入{国家} · {数量}部作品`. The four destination-introduction fields stay in config but are not rendered at this stage.

### 5.3 Destination page

```
德国  Deutschland
────────────────────────────────
[媒介类型] [理解主题] [创作视角] [地区] [时间成本]
                     显示 58 部作品中的 7 部
────────────────────────────────
必读之选 · 19 部
  ┌────┬──────────────────────┐
  │封面│ 作品                  │
  └────┴──────────────────────┘
余力之选 · 25 部
归来之后 · 14 部
```

Works are a **vertical card stream**, grouped by tier. Not a grid.

### 5.4 Card — collapsed

Cover thumbnail · **`title_zh` when present, otherwise `title_original`** · `title_original` beneath in smaller italic Latin only when it differs from the displayed title · creator · year · `creator_country` · medium badge · time cost (omitted for music) · lens badge · 1–4 coloured sub-tags.

`theme_main` is **not** displayed. See §8.5.

### 5.5 Card — expanded

Accordion, in place. Filter state and scroll position preserved.

| Block | Field | Note |
|---|---|---|
| Cover | `cover` | Large, left column |
| Title | `title_zh` / `title_original` | — |
| Metadata | varies by medium | See below |
| Sub-tags | `theme_tags` | Coloured |
| 简介 | `summary` | ~150 字, what the work is |
| 值得之处 | `worth` | 150–250 字, subject is the reader |
| 对应之处 | `on_the_ground` | Places you can stand. Omit block if null |
| 为什么放在这个梯队 | `tier_reason` | Third tier only. Omit block if null |
`cn_edition` remains in the data and validation model but is not rendered in the expanded card.

**Metadata line by medium:** 电影·纪录片 `国家 · 年份 · 导演 · 时长` · 剧集 `国家 · 年份 · 创作者 · 集数与总时长` · 书籍 `国家 · 首版年 · 作者` · 专辑·单曲 `国家 · 发行年 · 音乐人 · 时长`

---

## 6. Tier — the ordering spine

`tier` ∈ `before-you-go` | `if-you-have-time` | `after-you-return`

It encodes **行前效用**: whether you can physically stand somewhere, whether it explains something you will encounter, and what it costs to watch or read. It is ordinal.

**`tier` is not a facet.** It does not appear as a filter chip. Five facets is the ceiling for the filter bar.

**`tier` is the default grouping.** The result list renders three sections in fixed order, each with a header showing the tier label and a live count. Tier notes remain in configuration but are not rendered. `sort_order` orders records *within* a section.

When filters are applied, sections persist and their counts change. A section with zero matches is hidden entirely.

---

## 7. Data model

Three tables. `candidates` and `mentions` are backstage; only `works` reaches the front end. **The shape is required; a database is not** — a spreadsheet exported to JSON is sufficient for v1.

### 7.1 `works` — shipped as `works.json`

```json
{
  "id": "de-screen-das-leben-der-anderen",
  "destination": "de",
  "tier": "before-you-go",
  "tier_label": "必读之选",
  "medium": "screen",
  "medium_label": "影像",
  "medium_sub": "film",
  "medium_sub_label": "电影",
  "title_zh": "窃听风暴",
  "title_original": "Das Leben der Anderen",
  "title_alt": [],
  "creator": "弗洛里安·亨克尔·冯·多纳斯马尔克",
  "creator_country": "德国",
  "year": 2006,
  "extent": "137分钟",
  "music_style": null,
  "regions": ["柏林"],
  "region_primary": "柏林",
  "periods": ["分裂时期"],
  "theme_main": ["历史与记忆"],
  "theme_tags": ["监视与国家", "分裂与柏林墙", "记忆与罪责"],
  "lens": "local",
  "lens_label": "本地视角",
  "time_cost": "one-evening",
  "time_cost_label": "一个晚上",
  "summary": "…",
  "worth": "…",
  "on_the_ground": "…",
  "tier_reason": null,
  "cn_edition": { "status": "subtitles_available", "publisher": null, "translator": null },
  "cover": null,
  "sort_order": 5
}
```

**Required:** `id, destination, tier, medium, medium_sub, title_original, creator, creator_country, year, regions, region_primary, theme_main, theme_tags, lens, summary, worth, sort_order, cn_edition`

**Field notes:**

- `region_primary` is required, must be a member of `regions`, and **alone counts toward regional minimum quotas.** Secondary regions remain filterable and displayable.
- `time_cost` is null **if and only if** `medium == "music"`.
- `extent` required for `screen` and `music`; optional for `book`, and when present must be tied to a named Chinese edition.
- `tier_reason` is non-null only for `after-you-return`.
- `on_the_ground` may be null — 14 of 58 are. Omit the block rather than rendering an empty heading.
- `music_style` non-null only for `medium == "music"`.
- `title_zh` is optional and may be null for any medium. The page must then use `title_original` as the main title and must not repeat it as a subtitle.

### 7.2 `cn_edition.status`

| Value | Label | Valid for |
|---|---|---|
| `published_translation` | 有中译本 | `book` (**required**), `screen` |
| `subtitles_available` | 有中文字幕 | `screen` (minimum) |
| `not_applicable` | 无语言门槛 | `music`, or a book originally written in Chinese |
| `original_only` | 仅原文 | `book`, `screen`, `music` |

`publisher` and `translator` are required when `status == published_translation` **and** the record is a book.

### 7.3 `medium` and `medium_sub`

| `medium` | `medium_sub` |
|---|---|
| `screen` | `film` · `documentary` · `series` |
| `book` | `novel` · `nonfiction` · `essay` · `poetry` |
| `music` | `album` · `single` |

`series` **is** in scope. `poetry` is a valid book subtype. Any earlier instruction excluding either is superseded.

---

## 8. Filtering

### 8.1 Five facets

媒介类型 · 理解主题 · 创作视角 · 地区 · 时间成本

Backed by `medium`, `theme_main`, `lens`, `regions`, `time_cost`. Region filtering matches **any** member of `regions`, not only `region_primary`.

### 8.2 Logic

- Within a facet **OR**; across facets **AND**
- Live count in the header: 「显示 58 部作品中的 7 部」
- Active conditions render as removable chips
- All state serialises to the URL: `/de?region=berlin,saxony&medium=screen&time=one-evening`
- Filter state and scroll position survive card expansion

### 8.3 Option counts and disabled state

1. **Every option always shows its count**: 「柏林 (28)」
2. A facet's own option counts are computed **excluding that facet's own selections** — standard faceted behaviour, and the part most often implemented wrong
3. Options with count 0 are greyed and non-interactive but **remain in place**; never hidden, never reordered
4. A currently selected option is **never** disabled
5. **No hover dependency.** Counts are visible at rest; behaviour identical on touch

### 8.4 Music and the time-cost facet

Music has `time_cost: null`. When a time filter is active, music is excluded and a line appears beneath the results:

> 另有 12 项音乐不参与时间筛选 · 展开查看

### 8.5 Sub-tags — three rules that are counter-intuitive

**Do not "fix" these. They are deliberate.**

1. **Sub-tags are not filterable.** They display only. Filtering uses `theme_main`.
2. **A record's `theme_tags` need not be covered by its `theme_main`.**《柏林亚历山大广场》carries 「夜生活与亚文化」(home theme 艺术与文化) while its `theme_main` does not include 艺术与文化. This is legal. **Do not write a validation rule against it.**
3. **`theme_main` is not shown on the card.** Because of rule 2, showing it would look like a mismatch.

A sub-tag's colour comes from its own `home_theme` in `config.theme_tags`, independent of the record's `theme_main`.

### 8.6 Sorting

Within each tier section: `sort_order` (default) · 时间成本从短到长 · 按年份 · 最近新增.

### 8.7 Empty and edge states

- **0 results overall:** name the most restrictive condition and offer one-click removal — 「没有设定在巴伐利亚、一个晚上能看完的电影。移除『巴伐利亚』→ 6 条结果。」
- **A tier section empty:** hide the whole section including its header
- **Cover unavailable:** typographic block — large title on the record's first sub-tag fill colour. Never an empty slot

---

## 9. Visual system

### 9.1 Surfaces and text

| Role | Hex |
|---|---|
| 页面底 | `#F1F2F2` |
| 卡片 | `#FFFFFF` |
| 分割线 | `#F0EEE8` |
| 主文字 | `#241F18` |
| 次文字 | `#6E6A60` |
| 弱文字 | `#8A8578` |

### 9.2 Theme colours

Pale fill with same-hue deep ink. Hues are deliberately spread across blue / green / yellow / pink / purple — they are **not** meant to look like a harmonious set.

| 主题 | fill | ink | contrast |
|---|---|---|---|
| 历史与记忆 | `#DCE7F3` | `#2C4763` | 7.7 |
| 社会与日常 | `#DDEBD6` | `#3A5531` | 6.7 |
| 地方与空间 | `#F7E7C4` | `#6B4712` | 6.8 |
| 身份与传统 | `#F7DBDD` | `#7A3841` | 6.5 |
| 艺术与文化 | `#E4DDEF` | `#493869` | 7.7 |

All pass WCAG AA comfortably. **Re-verify on any change** — and note that lightening the fill *raises* contrast here, because the ink is dark. Do not darken fills to "improve" legibility.

### 9.3 Map

| Role | Hex |
|---|---|
| 地图场 | `#FFFFFF` |
| 人口 `<2m` | `#DCEBE5` |
| 人口 `2–5m` | `#C8E0D7` |
| 人口 `5–10m` | `#A9CEC2` |
| 人口 `10–30m` | `#7FB3A5` |
| 人口 `30–60m` | `#5C9588` |
| 人口 `≥60m` | `#3E756C` |
| 浮起侧面 | `#F1F2F2` |
| 国家字 | `#74333A`，`#F2D8D5` 细描边 |

Use Natural Earth coastline and border geometry rather than model-authored country silhouettes. Boundaries use a thin map-field-colour separation with round joins, not a heavy outline. **No drop shadows, red population tier, availability colour key, label ground or scattered decorative dots.** The hover lift is communicated entirely by the 7px translate revealing the shared grey side shape.

### 9.4 Typography

Chinese body and UI: system sans. `title_original` in a Latin serif, italic, one step smaller than `title_zh`. The wordmark is Latin. Two weights only — regular and medium. No bold in body copy.

Map country labels are the exception: use the loaded Chinese editorial serif at medium weight, 11px desktop / 10px mobile, with `paint-order: stroke fill` so the pale-red halo stays behind the dark-red glyphs.

### 9.5 Covers

| Medium | Source | Terms |
|---|---|---|
| screen | TMDB API | Free, attribution required |
| book | Open Library Covers API | Free |
| music | Cover Art Archive | Free |

Never self-scrape, never upload third-party files, never use covers of unknown provenance. All 58 records currently have `cover: null`.

---

## 10. Validation

Two modes, set by environment variable. `production` is the default for any deploy build.

| | `development` | `production` |
|---|---|---|
| Schema checks | Fail | Fail |
| Quota checks | Warn | Fail |
| Gap report | Always printed | Always printed |

### Class A — schema (fails in both modes)

1. `regions` 1–3 values, all in `config.facets.region`
2. `region_primary` present and a member of `regions`
3. `theme_main` 1–2 values; `theme_tags` 1–4 values; all exist in config
4. `lens`, `time_cost`, `medium`, `medium_sub`, `tier`, `periods` values legal
5. `time_cost` null **iff** `medium == "music"`
6. `extent` present for `screen` and `music`
7. `cn_edition.status` valid for that record's medium (§7.2)
8. `publisher` and `translator` non-empty when a book has `published_translation`
9. `tier_reason` non-null only when `tier == "after-you-return"`
10. `sort_order` unique within destination
11. `music_style` non-null only for music
12. `title_original` non-empty; `title_zh` absent or null is legal and triggers the display fallback
13. `quotas.capital_max_share` may be explicitly null when the country config records a reason

**Rule 12 does not exist.** There is deliberately no check that `theme_tags` match `theme_main` — see §8.5.

### Class B — quotas (warn in dev, fail in production)

Values live in each country config. Regional minimums count `region_primary` only; capital and nationwide caps count any record carrying the configured value in `regions`. A null capital cap is skipped, not treated as missing configuration.

### Gap report

Printed on every build in both modes, readable text, not JSON:

```
配额差距 — 德国 (58/58 已上线)
  地区（按 region_primary）
    萨克森              1 / 2   ✗
    法兰克福与黑森       2 / 2   ✓
  视角
    移民与跨文化视角     2 / 4   ✗
  未使用的子标签: 无
```

### Not automated

`worth` must not restate plot · tier assignment · the opening-order rules. Human review gates.

---

## 11. Metrics

| Metric | Definition | Target |
|---|---|---|
| **有效收敛率** | Sessions applying ≥1 filter **and then expanding ≥1 card from the filtered result** | 40% |
| **空转率** | Sessions with ≥3 filter operations and 0 expansions | < 15% |
| 展开率 | Sessions expanding ≥1 card | 45% |
| 单会话展开数 | Mean cards expanded | ≥ 3 |
| 激活率 | Sessions applying ≥1 filter | 60% |

**Observational, no targets:** 筛选深度, 地区筛选使用率.

> 筛选深度 is not monotonic and cannot falsify anything alone. One filter plus three expansions is success; four filters plus zero expansions is failure. The same number describes both.

**What would falsify the positioning:** 有效收敛率 low **and** 空转率 high together — filtering happens but does not pay off. Even then, check whether zero-result queries concentrate in one facet first; that points at a content gap, not a positioning error.

**Always log** every zero-result query with full facet state.

---

## 12. Build order

1. `works.json` + `config.json` load, tier grouping, card collapsed and expanded
2. Five facets with live counts, URL state, empty states
3. Map: geographic shapes, population scale, hover lift, brief panel, enter
4. Header, slogan, typography
5. Covers via the three APIs
6. Validation script and gap report

Ship the shared data and page behaviour before extending the map. A country tile becomes active only after its destination page and reviewed data package work.

---

## 13. Open questions

1. Does anyone use the region facet? If traffic is 80% Berlin-bound, regional tagging is expensive precision.
2. Does music need its own presentation? It is exempt from time cost and sits oddly in a stream designed for films and books.
3. When do watch links return? Cut for scope, not principle.
4. Mobile filter presentation — five facets with live counts is a lot of vertical space. The counts requirement in §8.3 is non-negotiable; the layout is not.
