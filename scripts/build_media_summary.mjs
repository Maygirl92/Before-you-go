import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "/Users/isla/Documents/vibe coding/outputs/019fae6f-9a85-75f0-bc5c-91b902d3f168";
const outputPath = `${outputDir}/录屏书影音汇总.xlsx`;

const mentions = [];
const add = (title, medium, position, summary, sourceId) => {
  if (!sourceId) throw new Error(`Missing sourceId for ${title} (${medium})`);
  mentions.push({ title, medium, position, summary, sourceId });
};

// 帖子：德国旅行前的书+影
add("别人的动物园", "书籍", "帖主正文", "列入已读书单。", "p1");
add("德国文化遗产之旅", "书籍", "帖主正文", "列入已读书单。", "p1");
add("破碎的生活：普通德国人经历的20世纪", "书籍", "帖主正文", "列入已读书单，书影中给出较高评价。", "p1");
add("西线无战事", "书籍", "帖主正文", "列入已读书单。", "p1");
add("法比安", "书籍", "帖主正文", "列入已读书单，并给出很高评价。", "p1");
add("客乡", "书籍", "帖主正文", "帖主称它让自己发现燕妮·埃彭贝克，认为作品非常好。", "p1");
add("狼性时代：第三帝国余波中的德国与德国人，1945—1955", "书籍", "帖主正文", "列入已读书单。", "p1");
add("柏林谍影", "书籍", "帖主正文", "列入已读书单，并给出很高评价。", "p1");
add("德累斯顿：一座城市的毁灭与重生", "书籍", "帖主正文", "列入已读书单。", "p1");
add("慕尼黑：老绘画陈列馆", "书籍", "帖主正文", "列入已读书单。", "p1");
add("凯罗斯", "书籍", "帖主正文", "帖主称它是让自己发现燕妮·埃彭贝克的好作品。", "p1");
add("无主之作", "电影", "帖主正文", "列入已看电影清单。", "p1");
add("柏林苍穹下", "电影", "帖主正文", "列入已看电影清单，但帖主表示没有完全看懂。", "p1");
add("芭芭拉", "电影", "帖主正文", "列入已看电影清单。", "p1");
add("再见列宁", "电影", "帖主正文", "列入已看电影清单，但帖主表示没有完全看懂。", "p1");
add("西线无战事", "电影", "帖主正文", "列入已看电影清单。", "p1");
add("帝国的毁灭", "电影", "帖主正文", "列入已看电影清单。", "p1");
add("窃听风暴", "电影", "帖主正文", "列入已看电影清单，并给出很高评价。", "p1");
add("另一个国度", "书籍", "帖主正文", "列入待读书单。", "p1");
add("白日将近", "书籍", "帖主正文", "列入待读书单；帖主因喜欢燕妮·埃彭贝克其他作品而计划阅读。", "p1");
add("时世逝", "书籍", "帖主正文", "列入待读书单；帖主因喜欢燕妮·埃彭贝克其他作品而计划阅读。", "p1");
add("德国小史", "书籍", "帖主正文", "列入待读书单。", "p1");
add("查理大帝", "书籍", "帖主正文", "列入待读书单。", "p1");
add("掠夺欧罗巴", "书籍", "帖主正文", "列入待读书单。", "p1");

// 帖子：去德国前要看的书和电影
add("魏玛德国：希望与悲剧", "书籍", "帖主正文", "帖主在德国期间随身携带；认为它从多方面呈现开放、包容、自由甚至迷幻的魏玛时期，今天仍能找到其影子。", "p2");
add("德累斯顿：一座城市的毁灭与重生", "书籍", "帖主正文", "帖主将它与《五号屠场》搭配，分别从非虚构与虚构角度理解德累斯顿大轰炸。", "p2");
add("五号屠场", "书籍", "帖主正文", "帖主将它与德累斯顿非虚构作品搭配阅读，理解城市大轰炸。", "p2");
add("柏林：一座城市的肖像", "书籍", "帖主正文", "帖主说它讲述柏林故事，翻译问题不少，但个人很喜欢。", "p2");
add("柏林画廊", "书籍", "帖主正文", "帖主建议作为参观柏林美术馆前的参考书。", "p2");
add("奥斯维辛：一部历史", "书籍", "帖主正文", "帖主认为虽主要讲奥斯维辛，但参观达豪或其他集中营前强烈值得一读。", "p2");
add("破碎的生活：普通德国人经历的20世纪", "书籍", "帖主正文", "帖主概括为讲述战后德国普通人生活的非虚构。", "p2");
add("德国极简史", "书籍", "帖主正文", "帖主认为适合快速了解德国历史脉络，但夹带一些个人立场。", "p2");
add("客乡", "书籍", "帖主正文", "帖主非常喜欢，称正因读到它才想到整理德国书影单。", "p2");
add("奥斯特利茨", "书籍", "帖主正文", "帖主称其为塞巴尔德的代表作。", "p2");
add("布莱希特戏剧集", "书籍", "帖主正文", "帖主认为在柏林不能错过布莱希特；提前读剧本也有助于解决现场看戏字幕困难。", "p2");
add("西线无战事", "书籍", "帖主正文", "帖主认为原版小说与新旧电影版本都非常值得。", "p2");
add("西线无战事", "电影", "帖主正文", "帖主认为新旧电影版本与原版小说都非常值得。", "p2");
add("玉女风流", "电影", "帖主正文", "帖主称其虽是美国电影，但对德国的描写很有趣。", "p2");
add("法比安", "电影", "帖主正文", "帖主介绍为关于魏玛德国时期普通人的自传体电影，并强烈推荐。", "p2");
add("伟大的自由", "电影", "帖主正文", "帖主因演员弗兰兹·罗戈夫斯基强烈推荐，认为看完可能会喜欢上他。", "p2");
add("红色天空", "电影", "帖主正文", "帖主称它与《温蒂妮》是佩措尔德“元素精灵三部曲”的近作，也是了解“柏林学派”的重要作品。", "p2");
add("温蒂妮", "电影", "帖主正文", "帖主称它与《红色天空》是佩措尔德“元素精灵三部曲”的近作，也是了解“柏林学派”的重要作品。", "p2");
add("罗拉快跑", "电影", "帖主正文", "帖主称其为德国电影经典，原声很适合在柏林跑步时听。", "p2");
add("柏林苍穹下", "电影", "帖主正文", "帖主称其为维姆·文德斯经典作品，并建议在柏林电影院观看，那里经常放映。", "p2");
add("大都会", "电影", "帖主正文", "帖主建议若巴比伦电影院放映交响乐团配乐版，一定提前抢票。", "p2");
add("安东尼·波登：未知之旅", "纪录片／综艺", "帖主正文", "帖主尤其推荐科隆篇（第七季第六集），认为跟着波登在科隆会吃得很好。", "p2");

// 帖子：柏林相关书影音求推荐（正文与评论）
add("巴比伦柏林", "剧集", "帖主正文", "帖主已看作品，因其对柏林二战史、冷战史感兴趣，寻求类似推荐。", "p3");
add("无条件投降博物馆", "书籍", "帖主正文", "帖主已读作品，并希望寻找更多柏林墙、冷战相关作品。", "p3");
add("窃听风暴", "电影", "帖主正文", "帖主已看作品，并希望寻找更多柏林墙、冷战相关作品。", "p3");
add("再见列宁", "电影", "帖主正文", "帖主已看作品，并希望寻找更多柏林墙、冷战相关作品。", "p3");
add("罗拉快跑", "电影", "帖主正文", "帖主已看作品，并希望寻找更多柏林相关作品。", "p3");
add("柏林苍穹下", "电影", "帖主正文", "帖主已看作品，并希望寻找更多柏林相关作品。", "p3");
add("柏林的100种生活", "书籍", "评论区", "评论称它不是历史书，更像城市旅游指南和角落探索；配图好，适合随手翻阅。", "p3c1");
add("柏林，亚历山大广场", "书籍", "评论区", "评论同时推荐原著与电影。", "p3c2");
add("柏林，亚历山大广场", "电影", "评论区", "评论同时推荐原著与电影。", "p3c2");
add("德国83年", "剧集", "评论区", "与《德国86年》《德国89年》《我们的父辈》《阿德龙大酒店》一起被推荐。", "p3c3");
add("德国86年", "剧集", "评论区", "与《德国83年》《德国89年》《我们的父辈》《阿德龙大酒店》一起被推荐。", "p3c3");
add("德国89年", "剧集", "评论区", "与《德国83年》《德国86年》《我们的父辈》《阿德龙大酒店》一起被推荐。", "p3c3");
add("我们的父辈", "剧集", "评论区", "与德国83／86／89系列和《阿德龙大酒店》一起被推荐。", "p3c3");
add("阿德龙大酒店", "剧集", "评论区", "与德国83／86／89系列和《我们的父辈》一起被推荐；评论纠正了中文译名。", "p3c3");
add("魏玛德国：希望与悲剧", "书籍", "评论区", "评论称不少人因《巴比伦柏林》读它，其中一章细致描绘了魏玛时期的柏林。", "p3c4");
add("无主之作", "电影", "评论区", "与《法比安》一起被推荐。", "p3c5");
add("法比安", "电影", "评论区", "与《无主之作》一起被推荐。", "p3c5");
add("万湖会议", "电影", "评论区", "作为柏林相关影片被推荐。", "p3c6");
add("别人的动物园", "书籍", "评论区", "评论称它从另一角度反映战后、尤其柏林墙建立后东西德之间的竞争。", "p3c7");
add("凯罗斯", "书籍", "评论区", "作为燕妮·埃彭贝克的柏林相关作品被推荐。", "p3c8");
add("柏林苍穹下", "电影", "评论区", "评论惊讶原帖未列入该片，并予以推荐。", "p3c9");
add("柏林故事集", "书籍", "评论区", "推荐克里斯托弗·伊舍伍德的 Berlin Stories 系列及其衍生电影《歌厅》。", "p3c10");
add("歌厅（Cabaret）", "电影", "评论区", "作为 Berlin Stories 的衍生电影被推荐。", "p3c10");
add("克里斯托弗和他的同类", "书籍", "评论区", "评论认为这本书也值得看。", "p3c11");
add("温蒂妮", "电影", "评论区", "与《玉女风流》一起被推荐。", "p3c12");
add("玉女风流", "电影", "评论区", "与《温蒂妮》一起被推荐。", "p3c12");
add("歌厅（Cabaret）", "电影", "评论区", "评论特别推荐 Bob Fosse 执导的歌舞片，指出背景是1930年代柏林。", "p3c13");
add("法比安", "电影", "评论区", "评论称其为个人最喜欢的电影之一：以柏林为背景，讲个人命运沉沦。", "p3c14");
add("法比安", "书籍", "评论区", "评论在推荐电影时补充，原著也值得看。", "p3c14");
add("柏林谍影", "电影", "评论区", "与《伯恩霍姆大街》、德国83年系列一起被推荐。", "p3c15");
add("伯恩霍姆大街", "电影", "评论区", "与《柏林谍影》、德国83年系列一起被推荐。", "p3c15");
add("德国83年", "剧集", "评论区", "再次作为柏林、冷战相关剧集被推荐。", "p3c15");
add("帝国的毁灭", "电影", "评论区", "与《我们的父辈》一起被推荐。", "p3c16");
add("我们的父辈", "剧集", "评论区", "与《帝国的毁灭》一起被推荐。", "p3c16");
add("堕落街", "电影", "评论区", "作为柏林相关影片被推荐。", "p3c17");
add("别了，柏林", "书籍", "评论区", "作为柏林相关作品被推荐。", "p3c18");
add("夏里特医院", "剧集", "评论区", "与《选帝侯大街56号》一起被推荐。", "p3c19");
add("选帝侯大街56号", "剧集", "评论区", "与《夏里特医院》一起被推荐。", "p3c19");
add("柏林谍影", "书籍", "评论区", "评论推荐约翰·勒卡雷的小说及同名电影。", "p3c20");
add("柏林谍影", "电影", "评论区", "评论推荐约翰·勒卡雷小说的同名电影。", "p3c20");
add("巴比伦怪物", "书籍", "评论区", "作为柏林相关作品被推荐。", "p3c21");
add("再见列宁", "电影", "评论区", "评论补充推荐该片。", "p3c22");
add("柏林：城市交响曲", "纪录片", "评论区", "评论以影片页面截图推荐这部1927年的柏林城市纪录片。", "p3c23");
add("建筑师", "电影", "评论区", "评论以影片页面截图推荐；简介称其拍于东德末期，描绘理想和生活受压抑的东柏林青年建筑师。", "p3c24");
add("Oh Boy", "电影", "评论区", "评论称它也很好看。", "p3c25");

// 帖子：春节去柏林前计划先看几本书
add("柏林：一座城市的肖像", "书籍", "帖主正文", "帖主新购，计划当周开始阅读，以便旅行前了解柏林。", "p4");
add("时世逝", "书籍", "帖主正文", "帖主新购，计划当周开始阅读，以便旅行前了解柏林。", "p4");
add("别人的动物园", "书籍", "评论区", "评论称从动物园视角看东西德历史非常有意思，并计划实地走访柏林两座动物园。", "p4c1");
add("凯罗斯", "书籍", "评论区", "评论称这本书也不错；回复指出当时尚无大陆版本。", "p4c2");
add("气球", "电影", "评论区", "与《法比安》一起被推荐为二战期间柏林相关电影。", "p4c3");
add("法比安", "电影", "评论区", "与《气球》一起被推荐为二战期间柏林相关电影。", "p4c3");
add("柏林谍影", "书籍", "评论区", "回复称看过改编剧但尚未读原著，准备加入清单。", "p4c4");
add("无条件投降博物馆", "书籍", "评论区", "评论推荐后，帖主已购买并加入柏林行前阅读清单。", "p4c5");
add("众灵日", "书籍", "评论区", "评论以“柏林负雪，众灵环绕”概括，认为冬天带去柏林边走边读很合适。", "p4c6");

// 帖子：去德国旅行，推荐几本书
add("神圣罗马帝国", "书籍", "帖主正文", "帖主说它聚焦德国史上的第一个帝国，资料翔实，适合按历史阶段理解。", "p5");
add("长刀之夜", "书籍", "帖主正文", "帖主说它讲希特勒主导的独裁政府如何从民主的魏玛共和国中经选举产生；注释与参考资料很丰富。", "p5");
add("德国·德累斯顿", "书籍", "帖主正文", "帖主称其为战争重创城市系列之一，并因阅读该系列而选择旅行到德累斯顿。", "p5");
add("华沙（同系列，书名未完整显示）", "书籍", "帖主正文", "帖主提到同系列另一本写华沙，并因此把华沙纳入旅行。", "p5");

// 帖子：去柏林前我的阅读书单
add("柏林：一座城市的肖像", "书籍", "帖主正文", "列入七本柏林行前阅读清单。", "p6");
add("时世逝", "书籍", "帖主正文", "列入行前书单；帖主在旅途中已读过半，预计当周读完。", "p6");
add("别人的动物园", "书籍", "帖主正文", "采纳评论区推荐，列入七本柏林行前阅读清单。", "p6");
add("无条件投降博物馆", "书籍", "帖主正文", "采纳评论区推荐，列入七本柏林行前阅读清单。", "p6");
add("众灵日", "书籍", "帖主正文", "采纳评论区推荐，列入七本柏林行前阅读清单。", "p6");
add("柏林谍影", "书籍", "帖主正文", "列入七本柏林行前阅读清单。", "p6");
add("破碎的生活：普通德国人经历的20世纪", "书籍", "帖主正文", "列入七本柏林行前阅读清单。", "p6");
add("盗墓笔记", "书籍", "帖主正文", "正文提到培田古村被朋友称为《盗墓笔记》“雨村”的原型；帖主并非书迷，只是随行体验。", "p6");

// 帖子：德国电影Top10片单
add("柏林苍穹下", "电影", "帖主正文", "帖主将其与《永恒和一日》并提：诗性、天使下凡、片段抽象，氛围强；需要耐心但看完值得。", "p7");
add("永恒和一日", "电影", "帖主正文", "帖主将其与《柏林苍穹下》并提：诗性、片段抽象，氛围强；需要耐心但看完值得。", "p7");
add("罗拉快跑", "电影", "帖主正文", "电子乐配快速蒙太奇；故事略抽象，但剪辑、音乐和动画精彩，帖主看了两遍。", "p7");
add("浪潮", "电影", "帖主正文", "帖主形容为一场社会实验，联想到童年课堂，引发许多思考。", "p7");
add("西线无战事", "电影", "帖主正文", "帖主将其归入德国无法回避的战争主题，分别对应一战，并用于建立那段历史的大概认识。", "p7");
add("我们的父辈", "剧集", "帖主正文", "帖主将其归入战争主题，讲二战东线，并提醒警钟长鸣。", "p7");
add("帝国的毁灭", "电影", "帖主正文", "帖主将其归入战争主题，讲二战柏林，并提醒警钟长鸣。", "p7");
add("海蒂和爷爷", "电影", "帖主正文", "帖主称其为全程无坏人的治愈童话，搭配阿尔卑斯山美景。", "p7");
add("再见列宁", "电影", "评论区", "评论称其“严重推荐”。", "p7c1");

// 帖子：书中自有西柏林
add("The Undercurrents", "书籍", "帖主正文", "回忆录、城市史与文化批评交织；以作者在柏林二十年的私人体验理解城市，适合作为柏林入门文学。", "p8");
add("Berlin Blues", "书籍", "帖主正文", "摇滚乐手写出的摇滚气质小说，以东西德合并前夕的西柏林承载青年危机与生活荒诞。", "p8");
add("Berlin Blues（2003年改编版）", "电影", "帖主正文", "改编抓住原著气质，把故事压缩进109分钟，突出生活琐事的荒诞，结尾混乱刺激且配乐合适。", "p8");
add("The Short End of the Sonnenallee", "书籍", "帖主正文", "轻松、幽默而温柔地重现东柏林青少年及其家人朋友的普通生活；滚石乐队是彩蛋。", "p8");
add("再见列宁", "电影", "帖主正文", "被用作阅读《The Short End of the Sonnenallee》的相近参照。", "p8");
add("Stasiland", "书籍", "帖主正文", "通过采访前东德居民和参观史塔西博物馆呈现史塔西影响；虽接近研究文献，叙事性和可读性仍强。", "p8");
add("Madonna in a Fur Coat", "书籍", "帖主正文", "写土耳其青年在柏林冬天的相遇，更像与渴望、忧愁和过去难以和解的漫长过程。", "p8");
add("了不起的盖茨比", "书籍", "帖主正文", "作为评论《Madonna in a Fur Coat》气质的对照作品出现。", "p8");
add("再见，柏林", "书籍", "帖主正文", "帖主想象它像《太阳照常升起》的柏林续集：旧世界华丽褪色后滑向动荡，普通人追逐短暂幸福后精疲力尽。", "p8");
add("太阳照常升起", "书籍", "帖主正文", "作为理解《再见，柏林》气质的比较对象出现。", "p8");
add("柏林童年", "书籍", "帖主正文", "列入待读书单。", "p8");
add("柏林，亚历山大广场", "书籍", "帖主正文", "列入待读书单。", "p8");

// 帖子：发现一个提升旅行体验的方法
add("侏儒警语", "书籍", "帖主正文", "帖主称去京都前阅读，以提前与目的地建立联系。", "p9");
add("金阁寺", "书籍", "帖主正文", "帖主称去京都前阅读，以提前与目的地建立联系。", "p9");
add("情书", "电影", "帖主正文", "帖主去北海道前观看，虽不太喜欢情节，仍将其作为目的地关联作品。", "p9");
add("La La Land", "电影", "帖主正文", "帖主认为去洛杉矶前当然要看。", "p9");
add("Welcome to New York", "音乐", "帖主正文", "帖主认为飞往纽约的飞机上当然要听。", "p9");
add("Eat, Pray, Love", "电影", "帖主正文", "帖主去巴厘岛前重温。", "p9");
add("还有明天", "电影", "帖主正文", "帖主去意大利前观看。", "p9");
add("费兰特作品（未指明具体书名）", "书籍", "帖主正文", "帖主去意大利前阅读费兰特的书，但录屏未给出具体书名。", "p9");
add("金阁寺", "书籍", "评论区", "评论在“京都”条目下再次推荐三岛由纪夫的《金阁寺》。", "p9c1");

// Aggregate by title + medium. Each row above is one distinct post body or
// comment/reply-chain occurrence; sourceId prevents video-frame duplication.
const groups = new Map();
for (const item of mentions) {
  const key = `${item.title}\u0000${item.medium}`;
  if (!groups.has(key)) groups.set(key, { title: item.title, medium: item.medium, occurrences: [] });
  const group = groups.get(key);
  if (!group.occurrences.some((x) => x.sourceId === item.sourceId)) group.occurrences.push(item);
}

const summaryRows = [...groups.values()]
  .map((group) => ({
    ...group,
    count: group.occurrences.length,
    positions: [...new Set(group.occurrences.map((x) => x.position))].join("、"),
    summary: [...new Set(group.occurrences.map((x) => x.summary))].join("；"),
  }))
  .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, "zh-CN"));

const detailRows = mentions
  .filter((item, index, all) => all.findIndex((x) => x.title === item.title && x.medium === item.medium && x.sourceId === item.sourceId) === index)
  .map((item) => [item.title, item.medium, item.position, item.summary]);

const workbook = Workbook.create();
const summary = workbook.worksheets.add("作品汇总");
const detail = workbook.worksheets.add("提及明细");
summary.showGridLines = false;
detail.showGridLines = false;

summary.getRange("A1:E1").merge();
summary.getRange("A1").values = [["录屏中的书影音作品汇总"]];
summary.getRange("A1:E1").format = {
  fill: "#243447",
  font: { bold: true, color: "#FFFFFF", size: 18 },
  verticalAlignment: "center",
};
summary.getRange("A1:E1").format.rowHeightPx = 44;

summary.getRange("A2:E2").merge();
summary.getRange("A2").values = [["统计口径：同一篇帖子正文或同一条评论／回复链算 1 次；视频停留、滚动和同一图片反复展示不重复计数。"]];
summary.getRange("A2:E2").format = {
  fill: "#EAF0F5",
  font: { color: "#40566B", italic: true, size: 10 },
  wrapText: true,
  verticalAlignment: "center",
};
summary.getRange("A2:E2").format.rowHeightPx = 36;

summary.getRange("A4:E4").values = [["作品名称", "媒介", "出现次数", "出现位置", "正文及评论介绍总结"]];
summary.getRange("A4:E4").format = {
  fill: "#4F6F8F",
  font: { bold: true, color: "#FFFFFF" },
  verticalAlignment: "center",
};
summary.getRange("A4:E4").format.rowHeightPx = 30;

const summaryStart = 5;
const summaryEnd = summaryStart + summaryRows.length - 1;
summary.getRange(`A${summaryStart}:B${summaryEnd}`).values = summaryRows.map((row) => [row.title, row.medium]);
summary.getRange(`D${summaryStart}:E${summaryEnd}`).values = summaryRows.map((row) => [row.positions, row.summary]);
summary.getRange(`C${summaryStart}`).formulas = [[`=COUNTIFS('提及明细'!$A$2:$A$${detailRows.length + 1},A${summaryStart},'提及明细'!$B$2:$B$${detailRows.length + 1},B${summaryStart})`]];
summary.getRange(`C${summaryStart}:C${summaryEnd}`).fillDown();
summary.getRange(`A${summaryStart}:E${summaryEnd}`).format = {
  font: { color: "#263442", size: 10 },
  verticalAlignment: "top",
};
summary.getRange(`A${summaryStart}:E${summaryEnd}`).format.borders = {
  insideHorizontal: { style: "thin", color: "#DCE4EA" },
  bottom: { style: "thin", color: "#DCE4EA" },
};
summary.getRange(`E${summaryStart}:E${summaryEnd}`).format.wrapText = true;
summary.getRange(`A${summaryStart}:A${summaryEnd}`).format.wrapText = true;
summary.getRange(`C${summaryStart}:C${summaryEnd}`).format.horizontalAlignment = "center";
summary.getRange(`C${summaryStart}:C${summaryEnd}`).setNumberFormat("0");
summary.getRange(`A${summaryStart}:E${summaryEnd}`).format.rowHeightPx = 68;
summary.getRange(`A${summaryStart}:A${summaryEnd}`).format.columnWidthPx = 290;
summary.getRange(`B${summaryStart}:B${summaryEnd}`).format.columnWidthPx = 105;
summary.getRange(`C${summaryStart}:C${summaryEnd}`).format.columnWidthPx = 85;
summary.getRange(`D${summaryStart}:D${summaryEnd}`).format.columnWidthPx = 145;
summary.getRange(`E${summaryStart}:E${summaryEnd}`).format.columnWidthPx = 720;
summary.freezePanes.freezeRows(4);
summary.tables.add(`A4:E${summaryEnd}`, true, "WorksSummaryTable");

detail.getRange("A1:D1").values = [["作品名称", "媒介", "出现位置", "该次出现的介绍总结"]];
detail.getRange("A1:D1").format = {
  fill: "#4F6F8F",
  font: { bold: true, color: "#FFFFFF" },
};
detail.getRange(`A2:D${detailRows.length + 1}`).values = detailRows;
detail.getRange(`A2:D${detailRows.length + 1}`).format = {
  font: { color: "#263442", size: 10 },
  verticalAlignment: "top",
};
detail.getRange(`A2:D${detailRows.length + 1}`).format.borders = {
  insideHorizontal: { style: "thin", color: "#DCE4EA" },
};
detail.getRange(`D2:D${detailRows.length + 1}`).format.wrapText = true;
detail.getRange(`A2:A${detailRows.length + 1}`).format.wrapText = true;
detail.getRange(`A2:D${detailRows.length + 1}`).format.rowHeightPx = 64;
detail.getRange(`A2:A${detailRows.length + 1}`).format.columnWidthPx = 330;
detail.getRange(`B2:B${detailRows.length + 1}`).format.columnWidthPx = 110;
detail.getRange(`C2:C${detailRows.length + 1}`).format.columnWidthPx = 120;
detail.getRange(`D2:D${detailRows.length + 1}`).format.columnWidthPx = 760;
detail.freezePanes.freezeRows(1);
detail.tables.add(`A1:D${detailRows.length + 1}`, true, "MentionDetailTable");

await fs.mkdir(outputDir, { recursive: true });
const file = await SpreadsheetFile.exportXlsx(workbook);
await file.save(outputPath);

const summaryPreview = await workbook.render({ sheetName: "作品汇总", range: "A1:E16", scale: 1.2, format: "png" });
await fs.writeFile(`${outputDir}/summary_preview.png`, new Uint8Array(await summaryPreview.arrayBuffer()));
const detailPreview = await workbook.render({ sheetName: "提及明细", range: "A1:D12", scale: 1.2, format: "png" });
await fs.writeFile(`${outputDir}/detail_preview.png`, new Uint8Array(await detailPreview.arrayBuffer()));

const inspection = await workbook.inspect({
  kind: "table",
  range: `作品汇总!A1:E${Math.min(summaryEnd, 15)}`,
  include: "values,formulas",
  tableMaxRows: 15,
  tableMaxCols: 5,
});
console.log(inspection.ndjson);
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 50 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);
console.log(JSON.stringify({ outputPath, uniqueWorks: summaryRows.length, mentionRows: detailRows.length }));
