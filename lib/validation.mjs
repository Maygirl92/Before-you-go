const MEDIUM_SUBS = new Set([
  "film",
  "documentary",
  "series",
  "novel",
  "nonfiction",
  "essay",
  "poetry",
  "album",
  "single"
]);

function values(items, key = "id") {
  return new Set(items.map((item) => item[key]));
}

function presentString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function asPercent(value) {
  return `${Math.round(value * 100)}%`;
}

export function displayTitle(work) {
  return presentString(work.title_zh) ? work.title_zh : work.title_original;
}

export function validateCountryData(config, works) {
  const errors = [];
  const destination = config.destination?.id;
  const regionValues = values(config.facets?.region || [], "label");
  const themeValues = values(config.facets?.theme_main || [], "label");
  const tagValues = values(config.theme_tags || [], "label");
  const periodValues = new Set(config.periods || []);
  const mediumValues = values(config.facets?.medium || []);
  const lensValues = values(config.facets?.lens || []);
  const timeValues = values(config.facets?.time_cost || []);
  const tierValues = values(config.tiers || []);
  const editionStatuses = new Map(
    (config.cn_edition_status || []).map((status) => [status.id, new Set(status.valid_for)])
  );
  const ids = new Set();
  const sortOrders = new Set();

  if (!destination) errors.push("config: destination.id 缺失");
  if (!Array.isArray(works)) return ["works: 必须是数组"];

  works.forEach((work, index) => {
    const reference = work.id || `第 ${index + 1} 条`;
    const fail = (message) => errors.push(`${reference}: ${message}`);

    if (!presentString(work.id)) fail("id 缺失");
    else if (ids.has(work.id)) fail("id 重复");
    else ids.add(work.id);

    if (work.destination !== destination) fail(`destination 必须为 ${destination}`);
    if (!presentString(work.title_original)) fail("title_original 必填");
    if (!(work.title_zh == null || presentString(work.title_zh))) fail("title_zh 只能为非空字符串或 null");

    if (!Array.isArray(work.regions) || work.regions.length < 1 || work.regions.length > 3) {
      fail("regions 必须有 1–3 个值");
    } else {
      if (work.regions.some((region) => !regionValues.has(region))) fail("regions 含配置外取值");
      if (!work.regions.includes(work.region_primary)) fail("region_primary 必须属于 regions");
    }

    if (!Array.isArray(work.theme_main) || work.theme_main.length < 1 || work.theme_main.length > 2) {
      fail("theme_main 必须有 1–2 个值");
    } else if (work.theme_main.some((theme) => !themeValues.has(theme))) {
      fail("theme_main 含配置外取值");
    }

    if (!Array.isArray(work.theme_tags) || work.theme_tags.length < 1 || work.theme_tags.length > 4) {
      fail("theme_tags 必须有 1–4 个值");
    } else if (work.theme_tags.some((tag) => !tagValues.has(tag))) {
      fail("theme_tags 含配置外取值");
    }

    if (!Array.isArray(work.periods) || work.periods.length < 1 || work.periods.some((period) => !periodValues.has(period))) {
      fail("periods 必须非空且全部来自配置");
    }
    if (!mediumValues.has(work.medium)) fail("medium 非法");
    if (!MEDIUM_SUBS.has(work.medium_sub)) fail("medium_sub 非法");
    if (!lensValues.has(work.lens)) fail("lens 非法");
    if (!tierValues.has(work.tier)) fail("tier 非法");

    const isMusic = work.medium === "music";
    if (isMusic !== (work.time_cost == null)) fail("time_cost 必须且仅能在音乐中为 null");
    if (work.time_cost != null && !timeValues.has(work.time_cost)) fail("time_cost 非法");
    if ((work.medium === "screen" || isMusic) && !presentString(work.extent)) fail("影像与音乐必须有 extent");
    if (!isMusic && work.music_style != null) fail("只有音乐可有 music_style");

    const status = work.cn_edition?.status;
    if (!editionStatuses.get(status)?.has(work.medium)) fail("cn_edition.status 不适用于该媒介");
    if (status === "published_translation" && work.medium === "book") {
      if (!presentString(work.cn_edition.publisher)) fail("有中译本的书籍必须有 publisher");
      if (!presentString(work.cn_edition.translator)) fail("有中译本的书籍必须有 translator");
    }

    const hasTierReason = presentString(work.tier_reason);
    if ((work.tier === "after-you-return") !== hasTierReason) {
      fail("归来之后必须有 tier_reason，其他梯队必须为 null");
    }
    if (!Number.isInteger(work.sort_order)) fail("sort_order 必须为整数");
    else if (sortOrders.has(work.sort_order)) fail("sort_order 在本国内必须唯一");
    else sortOrders.add(work.sort_order);
  });

  return errors;
}

export function buildQuotaReport(config, works) {
  const quotas = config.quotas || {};
  const rows = [];
  const addMinimum = (label, actual, target) => {
    if (target == null) return;
    rows.push({ label, actual, target, pass: actual >= target, display: `${actual} / ${target}` });
  };
  const addMaximumShare = (label, actual, target) => {
    if (target == null) return;
    rows.push({
      label,
      actual,
      target,
      pass: actual <= target,
      display: `${asPercent(actual)} / ≤${asPercent(target)}`
    });
  };

  addMinimum("总数", works.length, quotas.total_min);
  addMinimum("外来视角", works.filter((work) => work.lens === "outsider").length, quotas.outsider_min);
  addMinimum("移民与跨文化视角", works.filter((work) => work.lens === "diaspora").length, quotas.diaspora_min);
  addMinimum(
    "移民与跨文化视角（影像）",
    works.filter((work) => work.lens === "diaspora" && work.medium === "screen").length,
    quotas.diaspora_screen_min
  );

  if (quotas.capital_region && quotas.capital_max_share != null) {
    const count = works.filter((work) => work.regions.includes(quotas.capital_region)).length;
    addMaximumShare(quotas.capital_region, count / works.length, quotas.capital_max_share);
  }
  if (quotas.nationwide_region && quotas.nationwide_max_share != null) {
    const count = works.filter((work) => work.regions.includes(quotas.nationwide_region)).length;
    addMaximumShare(quotas.nationwide_region, count / works.length, quotas.nationwide_max_share);
  }

  for (const theme of config.facets.theme_main) {
    addMinimum(
      theme.label,
      works.filter((work) => work.theme_main.includes(theme.label)).length,
      quotas.theme_main_min_each
    );
  }

  if (quotas.region_primary_min) {
    for (const [region, target] of Object.entries(quotas.region_primary_min)) {
      addMinimum(region, works.filter((work) => work.region_primary === region).length, target);
    }
  } else if (quotas.region_primary_min_each_other != null) {
    for (const region of config.facets.region) {
      if ([quotas.capital_region, quotas.nationwide_region].includes(region.label)) continue;
      const actual = works.filter((work) => work.region_primary === region.label).length;
      if (actual > 0) addMinimum(region.label, actual, quotas.region_primary_min_each_other);
    }
  }

  if (quotas.contemporary_year_from != null) {
    addMinimum(
      `${quotas.contemporary_year_from} 年及以后`,
      works.filter((work) => work.year >= quotas.contemporary_year_from).length,
      quotas.contemporary_min
    );
  }
  addMinimum("一个晚上", works.filter((work) => work.time_cost === "one-evening").length, quotas.one_evening_min);

  return {
    destination: config.destination.name_zh,
    total: works.length,
    enforced: quotas._enforced !== false,
    rows,
    gaps: rows.filter((row) => !row.pass),
    unmeasurable: quotas.supplementary_max_share == null ? [] : ["补充通道占比（works 未携带准入通道字段）"]
  };
}

export function formatQuotaReport(report) {
  const lines = [`配额差距 — ${report.destination} (${report.total} 部已上线)`];
  if (!report.rows.length) lines.push("  未配置可执行配额");
  for (const row of report.rows) {
    lines.push(`  ${row.label.padEnd(18, " ")} ${row.display.padEnd(14, " ")} ${row.pass ? "✓" : "✗"}`);
  }
  for (const label of report.unmeasurable) lines.push(`  ${label}: 无法计算`);
  if (!report.enforced && report.gaps.length) lines.push("  当前发布例外：缺口保留，但不阻塞构建");
  return lines.join("\n");
}

export function assertCountryData(config, works, mode = "production") {
  const schemaErrors = validateCountryData(config, works);
  const quotaReport = buildQuotaReport(config, works);
  if (schemaErrors.length) {
    throw new Error(`数据结构错误 — ${config.destination?.name_zh || "未知目的地"}\n  ${schemaErrors.join("\n  ")}`);
  }
  if (mode === "production" && quotaReport.enforced && quotaReport.gaps.length) {
    throw new Error(`${formatQuotaReport(quotaReport)}\n生产构建因配额缺口停止。`);
  }
  return quotaReport;
}
