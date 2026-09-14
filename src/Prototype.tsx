import { createContext, useContext, useId, useMemo, useState } from "react";
import { BalloonIcon, CameraIcon as ServiceCameraIcon, MicrophoneStageIcon, PersonSimpleRunIcon, FlowerTulipIcon, SparkleIcon } from "@phosphor-icons/react";
import {
  CalendarIcon, CheckCircledIcon, ChevronLeftIcon, ChevronRightIcon,
  GridIcon, HomeIcon, PersonIcon, SewingPinIcon,
} from "@radix-ui/react-icons";
import {
  Carousel, FlowStack, KeyboardInput, KeyboardTextarea, MobileScroll,
  type FlowControls, type FlowScreen,
} from "./mobile";

type SourceKind = "real" | "inspiration" | "ai";
type ServiceName = "派对布置" | "摄影妆造" | "主持服务" | "表演服务" | "鲜花预订";
type PrivacyMask = { left: number; top: number; width: number; height: number; rotate?: number };
type GalleryImage = { src: string; masks?: PrivacyMask[] };

type PackageItem = {
  id: string;
  title: string;
  category: ServiceName;
  scene: string;
  stem: string;
  source: SourceKind;
  price: string;
  note: string;
  featured?: boolean;
  gallery?: GalleryImage[];
  catalogMasks?: PrivacyMask[];
};

const sourceFileLabels: Record<SourceKind, string> = {
  real: "真实案例",
  inspiration: "灵感参考",
  ai: "AI生成-灵感参考",
};

function imageUrl(item: PackageItem, use: "首页横幅" | "套餐封面" | "详情竖图") {
  return `/assets/catalog/${item.stem}-${use}-${sourceFileLabels[item.source]}.jpg`;
}

function partyGallery(name: string, count: number, masks?: PrivacyMask[]): GalleryImage[] {
  return Array.from({ length: count }, (_, index) => ({
    src: `/assets/party-originals/${name}${index === 0 ? "" : `-${index + 1}`}.jpg`,
    masks: index === 0 ? masks : undefined,
  }));
}

function inspirationGallery(folder: string, count: number, masks: Record<number, PrivacyMask[]> = {}, offset = 0): GalleryImage[] {
  return Array.from({ length: count }, (_, index) => ({
    src: `/assets/new-inspiration/${folder}/${String(index + 1 + offset).padStart(2, "0")}.jpg`,
    masks: masks[index + 1 + offset],
  }));
}

function selectedInspirationGallery(folder: string, indices: number[], masks: Record<number, PrivacyMask[]> = {}): GalleryImage[] {
  return indices.map((index) => ({
    src: `/assets/new-inspiration/${folder}/${String(index).padStart(2, "0")}.jpg`,
    masks: masks[index],
  }));
}

const blueBirthdayMasks: PrivacyMask[] = [
  { left: 11, top: 39, width: 23, height: 9, rotate: -2 },
  { left: 71, top: 36.5, width: 12, height: 5, rotate: 2 },
];
const pinkBirthdayMasks: PrivacyMask[] = [
  { left: 9, top: 31, width: 29, height: 10, rotate: -2 },
  { left: 19, top: 52, width: 20, height: 8, rotate: -2 },
  { left: 71, top: 43, width: 18, height: 8, rotate: 2 },
  { left: 76, top: 52, width: 13, height: 7, rotate: 2 },
];
const purplePartyMasks: PrivacyMask[] = [
  { left: 19, top: 47, width: 18, height: 7, rotate: -2 },
  { left: 72, top: 45, width: 19, height: 8, rotate: 1 },
  { left: 77, top: 58, width: 15, height: 6, rotate: 1 },
];
const catalogSourceLabelMask: PrivacyMask[] = [{ left: 0, top: 91, width: 30, height: 9 }];
const whiteBirthdayMasks: PrivacyMask[] = [{ left: 60, top: 30.5, width: 19, height: 9, rotate: -4 }];
const engagementMasks: PrivacyMask[] = [{ left: 35, top: 27, width: 17, height: 22, rotate: -2 }];
const businessBlackgoldMasks: PrivacyMask[] = [
  { left: 29, top: 23, width: 43, height: 9, rotate: -1 },
  { left: 44, top: 38, width: 18, height: 14, rotate: 1 },
  { left: 43, top: 65, width: 23, height: 8, rotate: -1 },
];
const businessRainbowMasks: Record<number, PrivacyMask[]> = {
  1: [{ left: 60, top: 24, width: 27, height: 18, rotate: -2 }],
  2: [{ left: 78, top: 20, width: 21, height: 18, rotate: -2 }],
};
const whiteSilverMasks: Record<number, PrivacyMask[]> = {
  1: [{ left: 39, top: 29, width: 28, height: 11, rotate: -2 }],
  2: [{ left: 38, top: 18, width: 28, height: 11, rotate: -2 }],
  3: [{ left: 37, top: 29, width: 28, height: 11, rotate: -2 }],
  4: [{ left: 42, top: 32, width: 25, height: 13, rotate: -2 }],
  5: [{ left: 55, top: 31, width: 25, height: 13, rotate: -2 }],
};
const blueCartoonMasks: Record<number, PrivacyMask[]> = {
  1: [{ left: 20, top: 26, width: 31, height: 10, rotate: -2 }],
  2: [{ left: 31, top: 24, width: 30, height: 10, rotate: -2 }],
  4: [{ left: 9, top: 29, width: 35, height: 11, rotate: -2 }],
};
const pinkEngagementMasks: Record<number, PrivacyMask[]> = {
  1: [{ left: 25, top: 30, width: 38, height: 11, rotate: -2 }],
  2: [{ left: 24, top: 29, width: 37, height: 11, rotate: -2 }],
  3: [{ left: 24, top: 29, width: 38, height: 11, rotate: -2 }],
  4: [{ left: 25, top: 29, width: 37, height: 11, rotate: -2 }],
  5: [{ left: 25, top: 30, width: 36, height: 11, rotate: -2 }],
};
const purpleEngagementMasks: Record<number, PrivacyMask[]> = {
  1: [{ left: 25, top: 24, width: 35, height: 10, rotate: -2 }],
  2: [{ left: 25, top: 24, width: 35, height: 10, rotate: -2 }],
  4: [{ left: 61, top: 31, width: 18, height: 9, rotate: 2 }],
  6: [{ left: 61, top: 31, width: 18, height: 14, rotate: -2 }],
  7: [{ left: 21, top: 30, width: 25, height: 8, rotate: -2 }],
  8: [{ left: 48, top: 31, width: 27, height: 11, rotate: 2 }],
  9: [{ left: 28, top: 32, width: 35, height: 10, rotate: -2 }],
  10: [{ left: 56, top: 32, width: 17, height: 14, rotate: -2 }],
};
const purpleGardenMasks: Record<number, PrivacyMask[]> = {
  4: [{ left: 78, top: 42, width: 18, height: 12, rotate: 1 }],
};
const anniversaryMasks: Record<number, PrivacyMask[]> = {
  6: [{ left: 55, top: 35, width: 27, height: 18, rotate: -1 }],
};

const packages: PackageItem[] = [
  { id: "birthday-garden", title: "清新花园生日派对", category: "派对布置", scene: "生日", stem: "生日-清新花园", source: "real", price: "¥1688 起", note: "清新绿意与轻盈花艺，适合酒店包厢", featured: true, gallery: [{ src: "/assets/portfolio/blue-birthday.jpg", masks: blueBirthdayMasks }] },
  { id: "birthday-butterfly", title: "粉色蝴蝶花园生日派对", category: "派对布置", scene: "生日", stem: "生日-粉色蝴蝶花园", source: "real", price: "价格面议", note: "柔粉花艺与蝴蝶元素，浪漫又轻盈", featured: true, gallery: [
    { src: "/assets/party-originals/birthday-butterfly-2.jpg" },
    { src: "/assets/party-originals/birthday-butterfly-3.jpg" },
    { src: "/assets/party-originals/birthday-butterfly.jpg" },
  ] },
  { id: "birthday-forest", title: "森系餐桌生日派对", category: "派对布置", scene: "生日", stem: "生日-森系餐桌", source: "real", price: "价格面议", note: "自然绿意餐桌，适合温暖小型聚会", gallery: partyGallery("birthday-forest", 2) },
  { id: "birthday-rainbow", title: "彩虹气球餐桌生日派对", category: "派对布置", scene: "生日", stem: "生日-彩虹气球餐桌", source: "real", price: "价格面议", note: "明快彩虹配色，童趣但不失质感", gallery: partyGallery("birthday-rainbow", 3) },
  { id: "birthday-25", title: "粉白浪漫二十五岁生日派对", category: "派对布置", scene: "生日", stem: "生日-粉白浪漫二十五岁", source: "real", price: "价格面议", note: "粉白花艺与数字主题，轻柔有仪式感", gallery: partyGallery("birthday-25", 3) },
  { id: "birthday-white-silver", title: "白银气球生日派对", category: "派对布置", scene: "生日", stem: "生日-白银气球", source: "real", price: "价格面议", note: "白色羽毛、银色气球与简洁背景，清爽耐看", gallery: inspirationGallery("party-white-silver", 5, whiteSilverMasks) },
  { id: "birthday-blue-cartoon", title: "蓝色卡通生日派对", category: "派对布置", scene: "生日", stem: "生日-蓝色卡通", source: "real", price: "价格面议", note: "蓝色气球、卡通甜品台与餐桌细节的完整组合", gallery: inspirationGallery("party-blue-cartoon", 6, blueCartoonMasks) },
  { id: "birthday-orange-butterfly", title: "暖橙蝴蝶生日派对", category: "派对布置", scene: "生日", stem: "生日-暖橙蝴蝶", source: "real", price: "价格面议", note: "暖橙花艺与发光蝴蝶主景，适合温暖明亮的生日现场", gallery: inspirationGallery("party-orange-butterfly", 3) },
  { id: "adult-white", title: "纯白蝴蝶成人礼", category: "派对布置", scene: "成人礼", stem: "成人礼-纯白蝴蝶", source: "real", price: "¥988 起", note: "纯白层次与蝴蝶细节，简洁耐看", featured: true, gallery: [{ src: "/assets/portfolio/white-closeup.jpg", masks: whiteBirthdayMasks }] },
  { id: "adult-purple", title: "紫黑花艺十八岁成人礼", category: "派对布置", scene: "成人礼", stem: "成人礼-紫黑花艺十八岁", source: "real", price: "价格面议", note: "浓郁紫黑花艺，适合个性成人礼", gallery: partyGallery("adult-purple", 3) },
  { id: "baby-color", title: "彩色童趣百日宴", category: "派对布置", scene: "宝宝宴", stem: "宝宝宴-彩色童趣百日宴", source: "real", price: "价格面议", note: "活泼色彩与童趣造型，温暖不杂乱", gallery: partyGallery("baby-color", 1) },
  { id: "baby-pastel", title: "粉彩儿童餐桌宝宝宴", category: "派对布置", scene: "宝宝宴", stem: "宝宝宴-粉彩儿童餐桌", source: "real", price: "价格面议", note: "粉彩餐桌与细节布置，适合家庭宴会", gallery: partyGallery("baby-pastel", 3) },
  { id: "anniversary-table", title: "紫粉花艺纪念日晚餐", category: "派对布置", scene: "纪念日", stem: "纪念日-紫粉花艺餐桌", source: "inspiration", price: "价格面议", note: "10 张花艺、餐桌与席位细节，适合浪漫纪念日晚餐", gallery: inspirationGallery("party-anniversary-table", 10, anniversaryMasks, 1) },
  { id: "proposal-violet", title: "紫罗兰花园求婚", category: "派对布置", scene: "求婚", stem: "求婚-紫罗兰花园", source: "real", price: "价格面议", note: "5 张紫色花园、花艺拱门与现场细节", featured: true, gallery: inspirationGallery("party-purple-garden", 5, purpleGardenMasks) },
  { id: "engagement-red", title: "中式红金花艺订婚宴", category: "派对布置", scene: "订婚", stem: "订婚-中式红金花艺", source: "real", price: "价格面议", note: "红金花艺与中式细节，喜庆而克制", gallery: partyGallery("engagement-red", 2, engagementMasks) },
  { id: "engagement-lilac-inspiration", title: "奶油香芋紫订婚布置", category: "派对布置", scene: "订婚", stem: "订婚-香芋紫灵感", source: "inspiration", price: "价格面议", note: "香芋紫花艺与柔和帷幔的整套布置参考", gallery: inspirationGallery("purple-engagement", 10, purpleEngagementMasks) },
  { id: "engagement-rose-inspiration", title: "红粉花艺订婚布置", category: "派对布置", scene: "订婚", stem: "订婚-红粉花艺灵感", source: "inspiration", price: "价格面议", note: "红粉花艺与立体背景板的整套布置参考", gallery: inspirationGallery("pink-engagement", 4, pinkEngagementMasks, 1) },
  { id: "wedding-blackgold", title: "黑金烛光婚礼仪式", category: "派对布置", scene: "婚礼", stem: "婚礼-黑金烛光仪式", source: "inspiration", price: "价格面议", note: "黑金与烛光交织的仪式空间", catalogMasks: catalogSourceLabelMask },
  { id: "wedding-bluegold", title: "蓝金户外花园婚礼", category: "派对布置", scene: "婚礼", stem: "婚礼-蓝金户外花园", source: "inspiration", price: "价格面议", note: "蓝金花艺与户外绿意，营造轻盈仪式氛围", catalogMasks: catalogSourceLabelMask },
  { id: "opening-redgold", title: "红金气球花篮开业布置", category: "派对布置", scene: "开业", stem: "开业-红金气球花篮", source: "ai", price: "价格面议", note: "红金门头、气球与花篮组合，热烈醒目", catalogMasks: catalogSourceLabelMask },
  { id: "longevity-redgold", title: "红金中式寿宴", category: "派对布置", scene: "寿宴", stem: "寿宴-红金中式", source: "inspiration", price: "价格面议", note: "11 张红金寿宴主景、气球与中式细节", gallery: inspirationGallery("party-longevity-red", 11, {}, 2) },
  { id: "business-blackgold", title: "黑金年会活动布置", category: "派对布置", scene: "商业活动", stem: "商业活动-黑金年会", source: "real", price: "价格面议", note: "黑金舞台与企业年会氛围布置", gallery: [{ src: "/assets/party-originals/business-blackgold.jpg", masks: businessBlackgoldMasks }] },
  { id: "business-rainbow", title: "彩虹周年店庆", category: "派对布置", scene: "商业活动", stem: "商业活动-彩虹周年店庆", source: "real", price: "价格面议", note: "明快彩虹装置，适合周年庆与店庆", gallery: [
    { src: "/assets/party-originals/business-rainbow.jpg", masks: businessRainbowMasks[1] },
    { src: "/assets/party-originals/business-rainbow-2.jpg", masks: businessRainbowMasks[2] },
  ] },
  { id: "business-newyear", title: "新春启动会", category: "派对布置", scene: "商业活动", stem: "商业活动-新春启动会", source: "real", price: "价格面议", note: "新春主题与企业启动仪式布置", gallery: partyGallery("business-newyear", 3) },
  { id: "makeup-bride", title: "新娘跟妆与妆造", category: "摄影妆造", scene: "摄影妆造", stem: "摄影妆造-新娘跟妆背影", source: "ai", price: "价格面议", note: "妆面、发型与当日跟妆服务，可按需求沟通", catalogMasks: catalogSourceLabelMask },
  { id: "makeup-white-inspiration", title: "白纱新娘鲜花盘发", category: "摄影妆造", scene: "摄影妆造", stem: "摄影妆造-白纱盘发灵感", source: "inspiration", price: "价格面议", note: "21 款背面盘发与花饰造型，可按礼服风格挑选", gallery: selectedInspirationGallery("makeup-white", [2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 18, 19, 20, 21, 22, 23, 24, 26, 27]) },
  { id: "makeup-red-inspiration", title: "中式新娘红妆盘发", category: "摄影妆造", scene: "摄影妆造", stem: "摄影妆造-中式盘发灵感", source: "inspiration", price: "价格面议", note: "30 款中式盘发与红金花饰造型，均以背面展示为主", gallery: selectedInspirationGallery("makeup-red", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 29, 30, 31, 34]) },
  { id: "bridal-veil-styles", title: "新娘头纱与礼服搭配", category: "摄影妆造", scene: "摄影妆造", stem: "摄影妆造-头纱礼服搭配", source: "inspiration", price: "价格面议", note: "18 款头纱长度、花饰与礼服背面搭配参考", gallery: selectedInspirationGallery("bridal-veils", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20]) },
  { id: "host-ballroom", title: "宴会主持服务", category: "主持服务", scene: "主持服务", stem: "主持服务-宴会厅舞台", source: "ai", price: "价格面议", note: "根据场地、流程与宾客规模匹配主持", catalogMasks: catalogSourceLabelMask },
  { id: "show-ballroom", title: "宴会现场表演", category: "表演服务", scene: "表演服务", stem: "表演服务-宴会厅舞台演出", source: "ai", price: "价格面议", note: "舞蹈、小丑、舞狮等节目按需组合", catalogMasks: catalogSourceLabelMask },
  { id: "flower-oil", title: "复古油画色花盒", category: "鲜花预订", scene: "鲜花预订", stem: "鲜花-复古油画色花盒", source: "real", price: "价格面议", note: "浓郁复古色系，适合生日与纪念日", featured: true },
  { id: "flower-peony", title: "粉彩花篮与桌花", category: "鲜花预订", scene: "鲜花预订", stem: "鲜花-粉色芍药花篮", source: "real", price: "价格面议", note: "11 款柔粉、浅紫与粉彩花篮，可按色系挑选", gallery: selectedInspirationGallery("flowers-pastel-baskets", [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12]) },
  { id: "flower-orchid", title: "香芋紫花束", category: "鲜花预订", scene: "鲜花预订", stem: "鲜花-香芋紫蝴蝶兰花束", source: "real", price: "价格面议", note: "香芋紫花束搭配蝴蝶兰，轻盈柔和", gallery: inspirationGallery("flowers-purple", 1) },
  { id: "flower-grape", title: "阳光青提花果篮", category: "鲜花预订", scene: "鲜花预订", stem: "鲜花-阳光青提花果篮", source: "real", price: "价格面议", note: "鲜花与水果搭配，适合探望与祝福" },
  { id: "flower-modern-table", title: "现代桌花与伴手花", category: "鲜花预订", scene: "鲜花预订", stem: "鲜花-现代桌花伴手花", source: "real", price: "价格面议", note: "10 款桌花、小花礼与清新配色，可按场景组合", gallery: selectedInspirationGallery("flowers-modern-table", [1, 2, 3, 5, 6, 8, 9, 11, 12, 13]) },
  { id: "flower-christmas", title: "圣诞红花束与花盒", category: "鲜花预订", scene: "鲜花预订", stem: "鲜花-圣诞红松果花束", source: "real", price: "价格面议", note: "8 款红色花束、花盒与节日搭配，氛围浓郁", gallery: inspirationGallery("flowers-christmas-red", 8, {}, 4) },
];

const services: Array<{ name: ServiceName; sub: string; icon: typeof BalloonIcon }> = [
  { name: "派对布置", sub: "生日·求婚·宝宝宴", icon: BalloonIcon },
  { name: "摄影妆造", sub: "定格美好瞬间", icon: ServiceCameraIcon },
  { name: "主持服务", sub: "专业控场氛围", icon: MicrophoneStageIcon },
  { name: "表演服务", sub: "增添派对亮点", icon: PersonSimpleRunIcon },
  { name: "鲜花预订", sub: "把浪漫带回家", icon: FlowerTulipIcon },
];

const partyScenes = ["全部", "生日", "成人礼", "宝宝宴", "纪念日", "求婚", "订婚", "婚礼", "开业", "寿宴", "商业活动"];
type TabName = "home" | "services" | "booking" | "mine";
type BookingRequest = { id: number; service: ServiceName; title?: string; date: string; location: string; name: string; phone: string; scale: string; budget: string; note: string };
const BookingContext = createContext<{ requests: BookingRequest[]; addRequest: (request: BookingRequest) => void }>({ requests: [], addRequest: () => {} });

function AppFooter({ active, flow }: { active: TabName; flow: FlowControls }) {
  const items: Array<{ id: TabName; label: string; icon: typeof HomeIcon }> = [
    { id: "home", label: "首页", icon: HomeIcon }, { id: "services", label: "服务", icon: GridIcon },
    { id: "booking", label: "预约", icon: CalendarIcon }, { id: "mine", label: "我的", icon: PersonIcon },
  ];
  const navigate = (id: TabName) => {
    if (id === active) return;
    if (id === "home") flow.replace(homeScreen());
    if (id === "services") flow.replace(servicesScreen());
    if (id === "booking") flow.replace(bookingScreen());
    if (id === "mine") flow.replace(mineScreen());
  };
  return <nav className="bottom-nav" aria-label="主要导航">{items.map(({ id, label, icon: Icon }) => <button key={id} className={active === id ? "nav-item is-active" : "nav-item"} onClick={() => navigate(id)}><Icon /><span>{label}</span></button>)}</nav>;
}

function AppHeader({ title, flow }: { title: string; flow: FlowControls }) {
  return <div className="app-header"><button className="icon-button" aria-label="返回" onClick={flow.pop}><ChevronLeftIcon /></button><strong>{title}</strong><span /></div>;
}

function Home({ flow }: { flow: FlowControls }) {
  const featured = ["adult-purple", "birthday-garden"]
    .map((id) => packages.find((item) => item.id === id))
    .filter((item): item is PackageItem => Boolean(item));
  return <MobileScroll className="app-screen ivory-screen"><main className="home-content page-with-tabs" data-testid="home-screen">
    <header className="brand-header"><div><div className="brand-line"><h1>魔法佳派对</h1><SparkleIcon weight="fill" /></div><p>PARTY FOR A BETTER LIFE</p></div><div className="brand-side"><img className="brand-note" src="/assets/reference/brand-note.png" alt="用心布置，每一个重要的时刻" /><button className="location-pill" onClick={() => flow.push(serviceAreaScreen())}>昆山及周边 · 苏州上海可约</button></div></header>
    <section className="hero"><div className="hero-photo"><img src="/assets/portfolio/pink-birthday.jpg" alt="粉色生日派对现场布置" /><PrivacyMasks masks={pinkBirthdayMasks} /></div><div className="hero-shade" /><div className="hero-copy"><h2>把美好的<br />仪式感<br />交给专业的人</h2><div className="hero-rule" /><p>生日 · 求婚 · 宝宝宴<br />派对布置 · 活动策划<br />让每个重要的日子<br />都值得被珍藏</p><button className="gold-button" onClick={() => flow.push(bookingScreen(true))}>预约咨询 <ChevronRightIcon /></button></div><div className="hero-signature"><span>MAGIC PARTY</span><p>魔法佳派对 · 让幸福更有仪式感</p></div><img className="hero-moments" src="/assets/reference/hero-moments.png" alt="Beautiful Moments" /><div className="hero-dots" aria-hidden="true"><i /><i /><i /></div></section>
    <section className="service-grid" aria-label="服务分类">{services.map(({ name, sub }, index) => <button key={name} className="service-item" onClick={() => flow.push(servicesScreen(true, name))}><img className="service-icon" src={`/assets/reference/service-${["party", "camera", "host", "show", "flower"][index]}.png`} alt="" /><strong>{name}</strong><small>{sub}</small></button>)}</section>
    <section className="section-block"><div className="section-heading"><div><h3>本周人气方案</h3><p>用心打造每一场心动现场</p></div><button onClick={() => flow.push(servicesScreen(true))}>查看更多 <ChevronRightIcon /></button></div><div aria-label="精选方案" className="package-grid home-packages">{featured.map((item, index) => <PackageCard key={item.id} item={item} imageSrc={index === 0 ? "/assets/portfolio/purple-party.jpg" : "/assets/portfolio/blue-birthday.jpg"} imageMasks={index === 0 ? purplePartyMasks : blueBirthdayMasks} badge={index === 0 ? "轻奢成人礼" : "清新生日派对"} onClick={() => flow.push(detailScreen(item))} />)}</div></section>
    <button className="service-area-card" onClick={() => flow.push(serviceAreaScreen())}><SewingPinIcon /><span><strong>昆山及周边 · 苏州上海可约</strong><small>上门布置 · 方案沟通 · 费用线下确认</small></span><img className="area-note" src="/assets/reference/area-note.png" alt="让平凡的日子也闪闪发光" /></button>
  </main></MobileScroll>;
}

function PrivacyMasks({ masks }: { masks?: PrivacyMask[] }) {
  return <>{masks?.map((mask, index) => <i key={index} className="privacy-mask" aria-hidden="true" style={{ left: `${mask.left}%`, top: `${mask.top}%`, width: `${mask.width}%`, height: `${mask.height}%`, transform: `rotate(${mask.rotate ?? 0}deg)` }} />)}</>;
}

function PackageCard({ item, imageSrc, imageMasks, badge, onClick }: { item: PackageItem; imageSrc?: string; imageMasks?: PrivacyMask[]; badge?: string; onClick: () => void }) {
  const primary = item.gallery?.[0];
  const masks = imageSrc ? imageMasks : primary?.masks ?? item.catalogMasks;
  return <button className="package-card" onClick={onClick}><div className="package-image"><img src={imageSrc ?? primary?.src ?? imageUrl(item, "套餐封面")} alt={item.title} /><PrivacyMasks masks={masks} />{badge && <span>{badge}</span>}</div><div className="package-body"><small>{item.category} · {item.scene}</small><strong>{item.title}</strong><p>{item.note}</p><div><b className={item.price === "价格面议" ? "is-negotiable" : ""}>{item.price}</b><ChevronRightIcon /></div></div></button>;
}

function Services({ flow, initialCategory = "派对布置" }: { flow: FlowControls; initialCategory?: ServiceName }) {
  const [active, setActive] = useState<ServiceName>(initialCategory); const [scene, setScene] = useState("全部");
  const visible = packages.filter((item) => item.category === active && (active !== "派对布置" || scene === "全部" || item.scene === scene));
  const changeCategory = (name: ServiceName) => { setActive(name); setScene("全部"); };
  return <MobileScroll className="app-screen ivory-screen"><main className="standard-page page-with-tabs" data-testid="services-screen">
    <header className="simple-title"><p>STYLE CATALOGUE</p><h1>按场景挑选方案</h1><span>价格与内容可先浏览，最终方案线下确认</span></header>
    <div className="carousel-hint-shell category-hint-shell"><Carousel ariaLabel="服务分类" className="category-carousel" contentClassName="category-track">{services.map(({ name }) => <button key={name} className={active === name ? "category-chip is-active" : "category-chip"} onClick={() => changeCategory(name)}>{name}</button>)}</Carousel><span className="carousel-swipe-hint" aria-hidden="true">›</span></div>
    {active === "派对布置" && <div className="carousel-hint-shell scene-hint-shell"><Carousel ariaLabel="派对场景" className="scene-carousel" contentClassName="scene-track">{partyScenes.map((item) => <button key={item} className={scene === item ? "scene-chip is-active" : "scene-chip"} onClick={() => setScene(item)}>{item}</button>)}</Carousel><span className="carousel-swipe-hint" aria-hidden="true">›</span></div>}
    <div className="catalog-heading"><div><h2>{scene === "全部" ? active : scene}</h2><span>{visible.length} 个可选方案</span></div><i>{String(visible.length).padStart(2, "0")}</i></div>
    <div className="package-list">{visible.map((item) => <PackageCard key={item.id} item={item} onClick={() => flow.push(detailScreen(item))} />)}</div>
  </main></MobileScroll>;
}

function Detail({ item }: { item: PackageItem }) {
  const includes = item.category === "派对布置" ? ["按场地与主题确认主视觉方案", "气球、花艺或主题道具组合", "姓名、年龄、色系与文字可沟通调整", "上门布置时间与撤场方式线下确认"] : item.category === "鲜花预订" ? ["根据预算与用途确认花材", "可沟通主色、包装与祝福卡", "节日与特殊花材价格可能调整", "自取或配送方式线下确认"] : ["根据活动日期与场地确认档期", "按照活动规模匹配服务内容", "流程、时长与人员安排可沟通", "最终报价由工作室联系后确认"];
  const gallery = item.gallery ?? [{ src: imageUrl(item, "首页横幅"), masks: item.catalogMasks }];
  const primary = item.gallery?.[0];
  const primaryMasks = primary?.masks ?? item.catalogMasks;
  const galleryTitle = item.category === "摄影妆造" ? "造型参考图" : "现场图集";
  const galleryNote = item.category === "摄影妆造" ? "已拆分为单张，方便逐款查看" : "同一套方案的现场照片";
  return <MobileScroll className="app-screen ivory-screen"><main className="detail-page" data-testid="detail-screen">
    <div className="detail-visual"><img className={primary ? "detail-hero detail-hero-original" : "detail-hero"} src={primary?.src ?? imageUrl(item, "详情竖图")} alt={`${item.title}完整方案图`} /><PrivacyMasks masks={primaryMasks} /></div>
    <section className="detail-body"><p className="eyebrow">{item.category} · {item.scene}</p><h1>{item.title}</h1><p className="detail-note">{item.note}</p><div className="detail-price"><b>{item.price}</b>{item.price !== "价格面议" && <span>参考起价</span>}</div>
      <div className="detail-panel"><h2>方案沟通内容</h2>{includes.map((text) => <p key={text}><CheckCircledIcon />{text}</p>)}</div>
      <div className="notice"><strong>{item.price === "价格面议" ? "先说需求，再确认报价" : "这个起价包含什么？"}</strong><p>具体包含项、布置尺寸、花材与道具数量需由工作室按场地确认。图片用于选款，不表示图中所有物品均包含在报价内。</p></div>
      <section className="detail-gallery" aria-label={`${item.title}${galleryTitle}`}><h2>{galleryTitle}</h2><p>{galleryNote}</p><div className="detail-gallery-list">{gallery.map((image, index) => <figure key={image.src}><div className="gallery-image-frame"><img src={image.src} alt={`${item.title}参考图 ${index + 1}`} /><PrivacyMasks masks={image.masks} /></div><figcaption>{index + 1} / {gallery.length}</figcaption></figure>)}</div></section>
      <div className="notice"><strong>价格与服务说明</strong><p>展示价格为参考起价或价格面议。场地大小、日期、路程、鲜花用量和临时增项可能影响最终费用；提交咨询不会产生付款，也不代表档期已确认。</p></div>
    </section>
  </main></MobileScroll>;
}

function BookingForm({ flow, item, standalone = false }: { flow: FlowControls; item?: PackageItem; standalone?: boolean }) {
  const { addRequest } = useContext(BookingContext);
  const formId = useId();
  const [selected, setSelected] = useState<ServiceName>(item?.category ?? "派对布置"); const [date, setDate] = useState(""); const [location, setLocation] = useState(""); const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [scale, setScale] = useState(""); const [budget, setBudget] = useState(""); const [note, setNote] = useState("");
  const [dateUnknown, setDateUnknown] = useState(false); const [showMore, setShowMore] = useState(false);
  const validPhone = /^1\d{10}$/.test(phone.trim());
  const canSubmit = Boolean(name.trim() && validPhone && (dateUnknown || date.trim()));
  const submit = () => { if (!canSubmit) return; addRequest({ id: Date.now(), service: selected, title: item?.category === selected ? item.title : undefined, date: dateUnknown ? "日期待定" : date.trim(), location: location.trim(), name: name.trim(), phone: phone.trim(), scale, budget, note }); flow.push(successScreen()); };
  return <MobileScroll className="app-screen ivory-screen"><main className={standalone ? "form-page booking-tab-page" : "form-page"} data-testid="booking-screen">
    <div className="form-intro"><p>预约咨询 · 不在线付款</p><h1>告诉我们活动需求</h1><span>提交后由工作室联系你，确认档期、方案和最终价格</span></div>
    {item && selected === item.category && <div className="selected-package"><div className="selected-package-image"><img src={item.gallery?.[0]?.src ?? imageUrl(item, "套餐封面")} alt={item.title} /><PrivacyMasks masks={item.gallery?.[0]?.masks ?? item.catalogMasks} /></div><span><small>已选择方案</small><strong>{item.title}</strong><em>{item.price}</em></span></div>}
    <label>想咨询的服务</label><div className="select-row">{services.map(({ name: service }) => <button key={service} className={selected === service ? "select-chip is-active" : "select-chip"} onClick={() => setSelected(service)}>{service}</button>)}</div>
    <div className="date-label"><label htmlFor={`${formId}-booking-date`}>活动日期与大致时间 *</label><button className={dateUnknown ? "date-toggle is-active" : "date-toggle"} aria-pressed={dateUnknown} onClick={() => setDateUnknown(!dateUnknown)}>{dateUnknown ? "已选：日期待定" : "日期还没确定"}</button></div><KeyboardInput id={`${formId}-booking-date`} disabled={dateUnknown} value={dateUnknown ? "日期待定，联系后确认" : date} onChange={(e) => setDate(e.target.value)} placeholder="例如：10月18日下午" />
    <label htmlFor={`${formId}-booking-location`}>活动城市与地点（选填）</label><KeyboardInput id={`${formId}-booking-location`} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="例如：昆山开发区，场地待定" />
    <div className="two-fields"><div><label htmlFor={`${formId}-booking-name`}>联系人 *</label><KeyboardInput id={`${formId}-booking-name`} value={name} onChange={(e) => setName(e.target.value)} placeholder="怎么称呼你" /></div><div><label htmlFor={`${formId}-booking-phone`}>联系电话 *</label><KeyboardInput id={`${formId}-booking-phone`} inputMode="tel" aria-invalid={Boolean(phone && !validPhone)} aria-describedby={`${formId}-phone-hint`} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="11位手机号" /></div></div>
    {phone && !validPhone && <p id={`${formId}-phone-hint`} className="field-error" role="status">请填写11位手机号码，方便工作室联系你。</p>}
    <button className="optional-toggle" aria-expanded={showMore} aria-controls={`${formId}-extra-needs`} onClick={() => setShowMore(!showMore)}><span>补充需求 <small>选填 · 人数、预算、喜欢的风格</small></span><ChevronRightIcon className={showMore ? "is-open" : ""} /></button>
    <div id={`${formId}-extra-needs`} hidden={!showMore}><div className="two-fields"><div><label htmlFor={`${formId}-booking-scale`}>人数或规模</label><KeyboardInput id={`${formId}-booking-scale`} value={scale} onChange={(e) => setScale(e.target.value)} placeholder="约 20 人" /></div><div><label htmlFor={`${formId}-booking-budget`}>预算范围</label><KeyboardInput id={`${formId}-booking-budget`} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="例如 2000 元" /></div></div>
    <label htmlFor={`${formId}-booking-note`}>喜欢的色系、风格或其他需求</label><KeyboardTextarea id={`${formId}-booking-note`} value={note} onChange={(e) => setNote(e.target.value)} placeholder="喜欢的颜色、主题，或需要避开的元素" /></div><p className="form-hint">提交仅表示咨询意向，不代表档期已确认。当前为原型体验，信息仅在本次页面中展示，刷新后清除，不会发送给工作室。</p><button className="gold-button full-button" disabled={!canSubmit} onClick={submit}>提交预约需求 <ChevronRightIcon /></button>
  </main></MobileScroll>;
}

function Success({ flow }: { flow: FlowControls }) { return <div className="success-screen" data-testid="success-screen"><span className="success-icon"><CheckCircledIcon /></span><p>体验提交成功</p><h1>预约流程已完成</h1><span>这是评审原型，本次填写仅保存在当前页面，未发送给工作室，也不会产生付款。</span><button className="gold-button" onClick={() => flow.replace(mineScreen())}>查看体验记录 <ChevronRightIcon /></button><button className="text-button" onClick={() => flow.replace(homeScreen())}>返回首页</button></div>; }
function Mine({ flow }: { flow: FlowControls }) {
  const { requests } = useContext(BookingContext);
  return <MobileScroll className="app-screen ivory-screen"><main className="standard-page page-with-tabs mine-page" data-testid="mine-screen"><div className="profile-mark">M</div><p>魔法佳派对</p><h1>我的预约</h1>
    {requests.length ? <section className="request-list"><p className="form-hint">本次体验记录 · 刷新后清除，未发送给工作室</p>{requests.map((request) => <article className="request-card" key={request.id}><div><span>待联系 · 演示</span><small>{request.service}</small></div><h2>{request.title || request.service}</h2><p>{request.date}</p><p>{request.location || "场地待沟通"}</p><p>{request.name} · {request.phone.slice(0,3)}****{request.phone.slice(-4)}</p><small>正式预约后，由工作室与你确认方案与档期。</small></article>)}</section> : <section className="empty-booking"><CalendarIcon /><strong>还没有预约记录</strong><span>选好喜欢的方案后，留下需求，和我们一起准备重要的日子。</span><button className="gold-button" onClick={() => flow.push(bookingScreen(true))}>去预约咨询</button></section>}
    <button className="owner-entry" onClick={() => flow.push(ownerScreen())}>老板管理入口 <ChevronRightIcon /></button></main></MobileScroll>;
}
function Owner({ flow }: { flow: FlowControls }) { return <MobileScroll className="app-screen ivory-screen"><main className="standard-page owner-page" data-testid="owner-screen"><p className="eyebrow">仅老板可见 · 原型演示</p><h1>今日工作台</h1><div className="owner-stats"><div><b>3</b><span>待联系</span></div><div><b>5</b><span>已确认</span></div><div><b>12</b><span>本月预约</span></div></div><h2>最新预约</h2>{["周女士 · 生日派对 · 10月18日", "陈先生 · 求婚布置 · 10月22日", "刘女士 · 鲜花预订 · 10月12日"].map((row, i) => <article className="booking-row" key={row}><span>{row}<small>{i === 0 ? "昆山开发区" : i === 1 ? "苏州工业园区" : "昆山玉山镇"}</small></span><em>{i === 0 ? "待联系" : "已联系"}</em></article>)}<button className="text-button back-home" onClick={flow.pop}>返回我的</button></main></MobileScroll>; }
function ServiceArea({ flow }: { flow: FlowControls }) { return <MobileScroll className="app-screen ivory-screen"><main className="standard-page area-page"><SewingPinIcon /><p className="eyebrow">上门服务范围</p><h1>昆山及乡镇优先</h1><p>苏州、上海及合理距离内的周边地区也可以预约。距离较远时，会结合交通、运输和工作人员安排确认附加费用。</p><div><strong>场地可由客户选择</strong><span>也可以咨询工作室已有合作餐厅</span></div><button className="gold-button" onClick={() => flow.push(bookingScreen(true))}>预约咨询</button><button className="text-button" onClick={flow.pop}>返回</button></main></MobileScroll>; }

function homeScreen(): FlowScreen { return { id: "home", footerHeight: 58, footer: (flow) => <AppFooter active="home" flow={flow} />, render: (flow) => <Home flow={flow} /> }; }
function servicesScreen(withBack = false, category: ServiceName = "派对布置"): FlowScreen { return { id: `services-${category}`, header: withBack ? (flow) => <AppHeader title="服务方案" flow={flow} /> : undefined, headerHeight: withBack ? 48 : undefined, footerHeight: withBack ? undefined : 58, footer: withBack ? undefined : (flow) => <AppFooter active="services" flow={flow} />, render: (flow) => <Services flow={flow} initialCategory={category} /> }; }
function detailScreen(item: PackageItem): FlowScreen { return { id: `detail-${item.id}`, header: (flow) => <AppHeader title="方案详情" flow={flow} />, headerHeight: 48, footerHeight: 76, footer: (flow) => <div className="detail-footer"><div><small>{item.price === "价格面议" ? "联系后报价" : "参考起价"}</small><b>{item.price}</b></div><button className="gold-button" onClick={() => flow.push(bookingScreen(true, item))}>预约咨询</button></div>, render: () => <Detail item={item} /> }; }
function bookingScreen(withBack = false, item?: PackageItem): FlowScreen { return { id: item ? `booking-${item.id}` : "booking", header: withBack ? (flow) => <AppHeader title="预约咨询" flow={flow} /> : undefined, headerHeight: withBack ? 48 : undefined, footerHeight: withBack ? undefined : 58, footer: withBack ? undefined : (flow) => <AppFooter active="booking" flow={flow} />, render: (flow) => <BookingForm flow={flow} item={item} standalone={!withBack} /> }; }
function successScreen(): FlowScreen { return { id: "success", render: (flow) => <Success flow={flow} /> }; }
function mineScreen(): FlowScreen { return { id: "mine", footerHeight: 58, footer: (flow) => <AppFooter active="mine" flow={flow} />, render: (flow) => <Mine flow={flow} /> }; }
function ownerScreen(): FlowScreen { return { id: "owner", header: (flow) => <AppHeader title="老板端" flow={flow} />, headerHeight: 48, render: (flow) => <Owner flow={flow} /> }; }
function serviceAreaScreen(): FlowScreen { return { id: "service-area", header: (flow) => <AppHeader title="服务范围" flow={flow} />, headerHeight: 48, render: (flow) => <ServiceArea flow={flow} /> }; }

export default function Prototype() {
  const initial = useMemo(() => homeScreen(), []);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const value = useMemo(() => ({ requests, addRequest: (request: BookingRequest) => setRequests((previous) => [request, ...previous]) }), [requests]);
  return <BookingContext.Provider value={value}><FlowStack initial={initial} /></BookingContext.Provider>;
}

