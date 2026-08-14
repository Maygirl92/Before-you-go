PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    qid TEXT,
    destination TEXT NOT NULL,
    title_raw TEXT NOT NULL,
    title_normalized TEXT,
    medium_guess TEXT CHECK (medium_guess IS NULL OR medium_guess IN ('影像', '书籍', '音乐')),
    status TEXT NOT NULL CHECK (status IN ('candidate', 'verifying', 'verified', 'published', 'rejected')),
    channel TEXT CHECK (channel IS NULL OR channel IN ('standard', 'supplementary')),
    gap_filled TEXT CHECK (gap_filled IS NULL OR json_valid(gap_filled)),
    rejected_reason TEXT,
    approved_by TEXT,
    approved_at TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mentions (
    id TEXT PRIMARY KEY,
    candidate_id TEXT NOT NULL REFERENCES candidates(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    source_type TEXT NOT NULL CHECK (source_type IN ('institution', 'academic', 'award', 'press', 'local', 'platform')),
    source_name TEXT NOT NULL,
    source_url TEXT,
    observed_at TEXT NOT NULL,
    stated_reason TEXT,
    engagement_band TEXT,
    keyword TEXT
);

CREATE INDEX IF NOT EXISTS idx_mentions_candidate_id ON mentions(candidate_id);

CREATE TABLE IF NOT EXISTS works (
    id TEXT PRIMARY KEY,
    candidate_id TEXT NOT NULL UNIQUE REFERENCES candidates(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    qid TEXT,
    destination TEXT NOT NULL,
    sort_order INTEGER NOT NULL CHECK (sort_order > 0),
    medium TEXT NOT NULL CHECK (medium IN ('影像', '书籍', '音乐')),
    medium_sub TEXT NOT NULL CHECK (medium_sub IN ('电影', '纪录片', '剧集', '小说', '非虚构', '散文', '专辑', '单曲')),
    title_zh TEXT NOT NULL,
    title_original TEXT,
    creator TEXT NOT NULL,
    creator_original TEXT,
    work_country TEXT,
    creator_country TEXT NOT NULL,
    setting_country TEXT NOT NULL CHECK (json_valid(setting_country)),
    year INTEGER NOT NULL,
    extent TEXT CHECK (extent IS NULL OR json_valid(extent)),
    extent_note TEXT,
    recommended_cn_edition TEXT,
    time_cost TEXT CHECK (time_cost IS NULL OR time_cost IN ('一个晚上', '数个晚上', '长线投入')),
    time_cost_reason TEXT,
    lens TEXT NOT NULL CHECK (lens IN ('本地视角', '外来视角', '移民与跨文化视角')),
    regions TEXT NOT NULL CHECK (json_valid(regions)),
    periods TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(periods)),
    theme_main TEXT NOT NULL CHECK (json_valid(theme_main)),
    theme_tags TEXT NOT NULL CHECK (json_valid(theme_tags)),
    awards TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(awards)),
    summary_zh TEXT NOT NULL,
    relation_zh TEXT NOT NULL,
    reason_zh TEXT NOT NULL,
    cn_edition TEXT NOT NULL CHECK (json_valid(cn_edition)),
    content_notes TEXT CHECK (content_notes IS NULL OR json_valid(content_notes)),
    cover TEXT CHECK (cover IS NULL OR json_valid(cover)),
    access TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(access)),
    signal_sitelinks INTEGER CHECK (signal_sitelinks IS NULL OR signal_sitelinks >= 0),
    signal_tmdb_votes INTEGER CHECK (signal_tmdb_votes IS NULL OR signal_tmdb_votes >= 0),
    signals_updated_at TEXT,
    verified_by TEXT NOT NULL,
    verified_at TEXT NOT NULL,
    UNIQUE (destination, sort_order)
);

CREATE INDEX IF NOT EXISTS idx_works_destination ON works(destination);

