# B · Curation & Data Handbook
## Before You Go — Germany v1

**Version** 2.0
**Owner** Isla (curator)
**Date** 7 August 2026
**Companion** *A · Build PRD v2.0* — owns screens, schema and validation mechanism

### Changelog 1.3 → 2.0

| # | Change |
|---|---|
| 1 | **Curation is complete.** 58 records shipped. This document shifts from "how to build the pipeline" to "the house style, and how to add work later" |
| 2 | **New §3 — tier assignment.** How 必读之选 / 余力之选 / 归来之后 are decided |
| 3 | **New §4 — prose style rules**, derived from the review pass. These are the binding house style |
| 4 | Prose fields respecified: 简介 / 值得之处 / 对应之处 / 为什么放在这个梯队 |
| 5 | `difficulty` removed. Its warning function lives in `worth` |
| 6 | Pipeline, sourcing and scraping sections trimmed — they described building a machine that Germany v1 did not need |

---

## 0. What this document owns

Everything that changes when a work is added or the house style shifts.

**This document owns `config.json` contents.** Adding a sub-tag, renaming a region, adjusting a quota happens here and in that file — no code change, no Build PRD revision.

---

## 1. The dataset as shipped

| | |
|---|---|
| Total | **58** |
| 影像 | 26（电影 22 · 纪录片 2 · 剧集 2） |
| 书籍 | 20（小说 13 · 非虚构 6 · 散文 1） |
| 音乐 | 12（专辑 9 · 单曲 3） |
| 梯队 | 必读之选 19 · 余力之选 25 · 归来之后 14 |
| 创作视角 | 本地 50 · 外来 6 · 移民与跨文化 2 |
| `region_primary` | 柏林 28 · 全国 14 · 鲁尔区与莱茵兰 4 · 巴伐利亚 3 · 图林根与魏玛 3 · 乡村与小城 3 · 法兰克福与黑森 2 · 萨克森 1 |
| 子标签 | 16 个全部有覆盖 |
| 有 `on_the_ground` | 44 / 58 |
| `cn_edition` | 有中译本 20 · 有字幕 26 · 无语言门槛 12 |

### Two known skews — not bugs

**柏林 48%.** Non-Berlin region filters return 1–4 records each. This is the natural gravity of curating Germany; the cap exists precisely because every individual decision to add another Berlin work looks reasonable.

**移民与跨文化视角 only 2**（《无条件投降博物馆》· Advanced Chemistry《Fremd im eigenen Land》）. The filter value is nearly empty. Show it anyway — letting the user see the real shape of the dataset is more honest than hiding a thin facet.

Both are the top of the shopping list if the set is ever extended.

---

## 2. Vocabularies

### 2.1 Parent themes 理解主题 — the filter facet

Five values, shared by all future countries, permanently frozen.

| 主题 | 定义 | fill | ink |
|---|---|---|---|
| 历史与记忆 | 历史事件、集体记忆、清算与遗忘 | `#DCE7F3` | `#2C4763` |
| 社会与日常 | 社会结构与日常生活 | `#DDEBD6` | `#3A5531` |
| 地方与空间 | 空间本身：城市形态、建筑、风景、地理 | `#F7E7C4` | `#6B4712` |
| 身份与传统 | 归属、族群、信仰、代际、传承 | `#F7DBDD` | `#7A3841` |
| 艺术与文化 | 以艺术创作本身为对象 | `#E4DDEF` | `#493869` |

Each work carries 1–2. Two definitions must stay tight:

- **地方与空间 vs `regions`.** `regions` is *where a work is set* — structural metadata. 地方与空间 is *a work that discusses space itself*. Blur this and the theme becomes a second region filter.
- **艺术与文化.** Every record is an artwork, so this can only mean **works whose subject is artistic creation**. Without a tight definition it becomes a junk drawer.

### 2.2 Sub-tags 子标签 — display only, 16 values

| Home theme | 子标签 |
|---|---|
| 历史与记忆 | 记忆与罪责 · 分裂与柏林墙 · 监视与国家 · 战后重建 · 民主的崩解 |
| 社会与日常 | 工业与劳动 · 家庭与继承 · 冷战日常 · 统一之后的东西差异 · 极右与社会对峙 |
| 地方与空间 | 小城与大都会 · 浪漫主义与风景 |
| 身份与传统 | 移民与归属 · 信仰与宗教改革 |
| 艺术与文化 | 设计与包豪斯 · 夜生活与亚文化 |

2–4 per work. Colour comes from the sub-tag's own home theme. **A record's sub-tags need not be covered by its `theme_main`** — see Build PRD §8.5.

Reuse across future countries is encouraged: 移民与归属 means the same thing in Germany, France and the UK.

### 2.3 Lens 创作视角

`本地视角` — creator belongs to the culture · `外来视角` — looking in from outside · `移民与跨文化视角` — both inside and outside.

Tells the user **who is doing the telling**, not which telling is truer.

### 2.4 Regions 地区 — 9 values

全国 · 柏林 · 巴伐利亚 · 汉堡与北部 · 鲁尔区与莱茵兰 · 萨克森 · 图林根与魏玛 · 法兰克福与黑森 · 乡村与小城

1–3 per work, **one of them designated `region_primary`.** Regional minimum quotas count primaries only; the Berlin cap counts any appearance.

`东德` is deliberately absent — it is a political-historical concept, not a geographic one, and it overlapped `periods`. GDR material is reachable via the 历史与记忆 theme and geographically via 萨克森 and 图林根与魏玛.

### 2.5 Periods 时期 — data only, not filterable

统一之前 · 德意志帝国 · 魏玛 · 纳粹时期 · 零点与占领期 · 分裂时期 · 转折与统一 · 柏林共和国

### 2.6 Time cost 时间成本 — editorial judgement

`一个晚上` · `数个晚上` · `长线投入`

Assigned by the curator, not calculated. A characters-per-minute formula was tried and removed: three significant figures feeding a three-bucket output, with error bars wider than the boundaries.

**Music is exempt** — `time_cost: null`. You don't budget time for music; it is consumed while doing something else.

---

## 3. Tier assignment

`tier` encodes **行前效用** — usefulness *before departure*, not quality. Three inputs:

1. **落地对应** — can you physically stand somewhere because of this work?
2. **解释力** — does it explain something you will actually encounter?
3. **成本** — runtime, length, difficulty of entry

| Tier | Rule of thumb |
|---|---|
| **必读之选** | Strong on 落地对应 **and** 解释力, cost acceptable |
| **余力之选** | Strong on one of the two, or the cost is high |
| **归来之后** | No 落地对应 / too large / needs context you won't have yet |

**Third-tier records require `tier_reason`** — one sentence naming which of the three reasons applies.

Some of the best works sit in the third tier. That is the point of ordering by usefulness rather than by quality, and the tier note says so.

**Conditional tiers exist in the prose, not the data.** 《芭芭拉》is second tier but its `worth` says it should be promoted if the trip includes Leipzig, Dresden or an eastern town. Do not build tier logic that reacts to itinerary; say it in the sentence.

**Music note.** Music does not compete for evenings, so its tier is judged almost entirely on 落地对应 and 解释力. Seven of twelve music records sit in 必读之选 for this reason.

---

## 4. Prose style — the house rules

These were derived from a full review pass and are binding. They apply to `summary`, `worth`, `on_the_ground` and `tier_reason`.

### 4.1 Numerals

**Years and dates: Arabic.** 1979年 · 1933年5月10日 · 1918年11月11日
**Ages, durations, counts, ordinals: Chinese.** 二十一岁 · 三个小时 · 四年 · 第三十九首

### 4.2 简介 `summary`

~150 字. A narrative synopsis, not a one-line gist. It should carry era, situation, the mechanism at stake, and real names where they matter.

> 二十世纪六十年代初，冷战进入白热化阶段。在分裂的柏林，军备竞赛以一种怪诞的形式上演着，赛场是动物园。在动物园界，大象是威望的象征——西柏林动物园园长科略斯为此要求市长维利·勃兰特增加大象数量……

**Do not** write to scene level — no quoted dialogue, no "那个下午在博物馆对面的咖啡馆". Situation and mechanism, not staging.

### 4.3 值得之处 `worth`

150–250 字. **The subject is the reader, not the work.** What will this give you, what will you understand afterwards, what will you now recognise on the street.

**Never rank within the list.** No 「行前性价比最高的一部」, no 「全单解释力最强」, no 「和上一部同一个地方」. Users arrive through filters and never see the curator's order — a card must stand alone.

**Avoid「拍的是…」「写的是…」as a repeated opening.** It was a tic across dozens of records; vary the construction.

**No subjective viewing-experience asides** — 「字幕损耗较大」「前二十分钟像爱情片」 read as chatty and were cut.

If a work is heavy going, `worth` must say so. Nothing else carries that signal now that `difficulty` is gone.

> 《柏林亚历山大广场》·「……但它不是一本能在飞机上读完的书。」

### 4.4 对应之处 `on_the_ground`

Places you can physically stand, separated by ` · `.

**Facts and place names only.** No imperative advice（「同一天去这两个地方」was cut）, no hedged rumour（「排队候补名单据说要等十年」was cut）, no verification markers in the body（all `⚠ 待现场核实` were removed — opening hours and whether a venue still trades are checked separately, not annotated in user-facing copy）.

Factual comparison **is** allowed: 「柏林墙纪念馆（贝尔瑙尔大街，保留了完整的边境结构，比查理检查站真实得多）」stays.

May be null. 14 of 58 are.

### 4.5 No markdown

No `**bold**` in any prose field. Emphasis comes from sentence structure.

---

## 5. Inclusion — two channels

**Standard.** ≥2 mentions from distinct `source_type`, ≥1 from `institution` / `academic` / `award`.

**Supplementary-perspective.** ≥3 independent mentions, ≥1 from `local` or `press`, plus `gap_filled` naming a dimension **and** a specific value, plus recorded human approval.

`platform` mentions alone are never sufficient. Supplementary is capped at 30% of published records.

> A single institutional gate would make this a database of works institutions have already blessed — which systematically excludes recent work and minority perspectives, exactly the records the quotas most need.

### Chinese availability, per medium

| Medium | Requirement |
|---|---|
| 书籍 | A published Chinese translation |
| 影像 | Chinese subtitles exist; no domestic release needed |
| 音乐 | None |

**The consequence to keep planning for:** Chinese publishing covers the German canon well and contemporary diaspora writing barely at all. This constraint lands hardest on the 移民与跨文化视角 quota — which is why that quota is carried by film, and why it still only reaches 2.

### Two additional tests

- **Taggability.** A work that cannot honestly take a region and a parent theme is out, however good.
- **Guidebook test.** `worth` must say something a guidebook could not.

---

## 6. Exclusion

Shot in Germany but the story has no substantive relation · creator is German but the work has no clear relation to German culture · recommended mainly for popularity · place relationship unverifiable · unreliable source or factual errors · highly duplicative without a new perspective.

> **A German-language work is not automatically a work about Germany.**《悉达多》was removed for exactly this reason: set entirely in ancient India, connected to Germany only through Hesse himself. It would have surfaced under every region filter as a dead record.

---

## 7. Sources

| `source_type` | Germany |
|---|---|
| `institution` | Goethe-Institut 在线影库 · bpb Filmhefte · filmportal.de · Deutsche Kinemathek · DFF Frankfurt |
| `academic` | German studies syllabi · cultural studies texts |
| `award` | Deutscher Filmpreis · Deutscher Buchpreis · Berlinale · 莱比锡书展奖 |
| `press` | FAZ · Süddeutsche Zeitung · Die Zeit |
| `local` | Local creators and residents |
| `platform` | 豆瓣 · Letterboxd · Goodreads |

**For books the pool is Chinese publishers**, not English-language lists: 译林 · 上海译文 · 人民文学 · 商务印书馆 · 社会科学文献「甲骨文」· 重庆大学出版社 · 广西师范大学出版社. DW's 100 German Must-Reads is German→English and no longer defines the candidate pool.

**No ratings.** 豆瓣 closed its public API; IMDb requires a commercial licence; TMDB's score means nothing to Chinese users. And reproducing a rating would make this a worse version of what the user already has. `awards` replaced them.

---

## 8. Quotas

Values live in `config.quotas`. Regional minimums count `region_primary` only.

| Quota | Value |
|---|---|
| 外来视角 | ≥ 4 |
| 移民与跨文化视角 | ≥ 4，其中影像 ≥ 3 |
| 柏林（任意 regions 命中） | ≤ 40% |
| 全国 | ≤ 20% |
| 每个母类主题 | ≥ 4 |
| 柏林与全国以外每个地区（按 primary） | ≥ 2 |
| 设定在 2000 年后 | ≥ 8 |
| 一个晚上 | ≥ 8 |
| 补充通道占比 | ≤ 30% |

**Currently unmet:** 移民与跨文化视角 (2/4) and 萨克森 primary (1/2). Both warn in development and would fail a production build — a deliberate, visible reminder rather than a silently relaxed number.

Quotas are executable rules, not intentions. The numbers are adjustable; **the existence of a number is not.**

---

## 9. What v1 does not need

Most pipeline machinery described in earlier versions is **not** a prerequisite. Curation is done by hand and it is finished.

| Capability | Germany v1 | Scale-up |
|---|---|---|
| Three-table data shape | Required | Required |
| A database to hold it | **Not required** — spreadsheet → JSON | Required |
| Manual `mentions` entry | Required | Required |
| QID on every record | Optional | Required |
| Automated ingest | **Not required** | Optional |
| AI entity linking | **Not required** | Optional |
| Platform collection | **Not required** | Optional |
| Null-rate / volume monitoring | Only if ingest is automated | Required once automated |
| `access` link collection | **Not required** — links aren't displayed | Required at v1.2 |

Guards around a machine that has not been built are not requirements.
