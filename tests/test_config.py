from before_you_go.config import load_config


def test_config_loads_and_has_expected_total() -> None:
    config = load_config()

    assert config.destination.id == "de"
    assert len(config.theme_tags) == 16
    assert {tag.label for tag in config.theme_tags} == {
        "记忆与罪责",
        "分裂与柏林墙",
        "监视与国家",
        "战后重建",
        "民主的崩解",
        "工业与劳动",
        "家庭与继承",
        "冷战日常",
        "统一之后的东西差异",
        "极右与社会对峙",
        "小城与大都会",
        "浪漫主义与风景",
        "移民与归属",
        "信仰与宗教改革",
        "设计与包豪斯",
        "夜生活与亚文化",
    }


def test_every_theme_tag_home_theme_exists() -> None:
    config = load_config()

    assert all(
        tag.home_theme in {theme.label for theme in config.facets.theme_main}
        for tag in config.theme_tags
    )
