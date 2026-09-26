/**
 * 出厂内容 —— 页面上现在写的这些东西。
 * 用户的改动存在 localStorage，点「恢复默认」回到这份。
 *
 * 注意：只要字段结构变了（改版式 / 加字段 / 删字段），就升 CONTENT_VERSION，
 * 浏览器里的旧数据会自动失效并回到默认，不会让页面报错白屏。
 */

export const CONTENT_VERSION = 10

export function defaultContent() {
  return {
    version: CONTENT_VERSION,

    nav: {
      logo: 'LJ',
      logoMark: 'ARCHIVE',
      menu: 'INDEX',
      links: [
        { label: 'SELECTED WORK', href: '#work' },
        { label: 'ABOUT', href: '#about' },
        { label: 'CONTACT', href: '#contact' },
      ],
    },

    hero: {
      watermarkTop: 'AIGC',
      watermarkBottom: 'DIRECTOR',
      topline: ['SHANGHAI / CN', '2025—2026 / VOL. 01', 'SCROLL TO EXPLORE ↓'],
      eyebrow: 'AIGC DIRECTOR / VISUAL STORYTELLER',
      title: { l1: 'MAKE', l2: 'THE', l3: 'UNREAL', l4: 'FEEL', l5: 'REAL.' },
      intro:
        'I build cinematic worlds at the intersection of artificial intelligence, fashion and human emotion.',
      cta: 'ENTER ARCHIVE',
      image: '/hero-editorial.png',
      transform: { x: 0, y: 0, scale: 1 },
      captionLeft: 'IMAGE 001 — EDITORIAL PORTRAIT',
      captionRight: '© LJ / 2026',
      footerLeft: 'SELECTED WORK / 2023—2026',
      footerRight: 'BASED IN SHANGHAI\nAVAILABLE WORLDWIDE',
    },

    about: {
      no: '01',
      label: '关于我',
      titleA: 'DIRECTING',
      titleB: 'IMAGINATIONS',
      coords: "31°13' N\n121°28' E",
      lead: '一名编导|新媒体运营，\n专注于把品牌想法转化为有画面、有节奏、能产生结果的内容。',
      body: '从律师 IP 账号的 0-1 搭建，到选题策划、文案撰写、拍摄统筹、直播切片与剪辑发布，\n我负责让内容从创意顺利走到成片。',
      bio: '我相信好的影像既要有审美，也要有清晰的传播目标。\n我的工作覆盖商业广告、人物影像、AIGC 内容与账号视觉体系，习惯用细节和稳定的执行力，把每一个想法做得真实、好看、有效。',
      link: 'MORE ABOUT ME',
      stats: [
        { value: '08', label: 'YEARS\nIN IMAGE MAKING' },
        { value: '42', label: 'WORLDS\nBROUGHT TO LIFE' },
        { value: '∞', label: 'WAYS TO\nREIMAGINE' },
      ],
    },

    work: {
      no: '02',
      label: 'SELECTED PROJECTS / 精选项目',
      extra: '2023—2026',
      titleA: 'SELECTED',
      titleB: 'WORK',
      desc: 'A living index of films, worlds\nand visual experiments.',
      archive: 'VIEW FULL ARCHIVE',
      projects: [
        { n: '01', title: '罗马剧场广告', tag: '商业短片 · AIGC 影像', meta: '29秒 · 商业短片 / 调色', video: '/videos/v01.mp4', poster: '', cls: 'wide', transform: { x: 0, y: 0, scale: 1 } },
        { n: '02', title: '调色广告片', tag: '商业广告 · 视觉表达', meta: '32秒 · 商业广告 / 视觉调色', video: '/videos/v02.mp4', poster: '', cls: 'tall', transform: { x: 0, y: 0, scale: 1 } },
        { n: '03', title: '香水广告', tag: '产品广告 · 氛围叙事', meta: '26秒 · 商业短片 / 氛围叙事', video: '/videos/v03.mp4', poster: '', cls: 'square', transform: { x: 0, y: 0, scale: 1 } },
        { n: '04', title: '剑桥大学探校VLOG', tag: '纪实 Vlog · 校园影像', meta: '1分38秒 · 纪实 Vlog / 叙事结构', video: '/videos/v04.mp4', poster: '', cls: 'tall', transform: { x: 0, y: 0, scale: 1 } },
        { n: '05', title: 'AI大理 VLOG', tag: '旅行影像 · 人文记录', meta: '42秒 · 旅行影像 / 独立成片', video: '/videos/v05.mp4', poster: '', cls: 'wide', transform: { x: 0, y: 0, scale: 1 } },
        { n: '06', title: '留学IP 口播', tag: '知识口播 · IP 孵化', meta: '1分26秒 · 知识口播 / IP 孵化', video: '/videos/v06.mp4', poster: '', cls: 'square', transform: { x: 0, y: 0, scale: 1 } },
        { n: '07', title: '拆迁口播', tag: '知识内容 · 节奏剪辑', meta: '52秒 · 知识内容 / 节奏剪辑', video: '/videos/v07.mp4', poster: '', cls: 'wide', transform: { x: 0, y: 0, scale: 1 } },
        { n: '08', title: 'AI数字人口播', tag: '知识口播 · 观点表达', meta: '46秒 · 知识口播 / 观点表达', video: '/videos/v08.mp4', poster: '', cls: 'tall', transform: { x: 0, y: 0, scale: 1 } },
        { n: '09', title: '无人机航拍空镜', tag: '航拍影像 · 空间叙事', meta: '43秒 · 航拍影像 / 运镜设计', video: '/videos/v09.mp4', poster: '', cls: 'square', transform: { x: 0, y: 0, scale: 1 } },
        { n: '10', title: '城市夜景AI', tag: '城市影像 · 氛围剪辑', meta: '38秒 · 城市影像 / 氛围剪辑', video: '/videos/v10.mp4', poster: '', cls: 'wide', transform: { x: 0, y: 0, scale: 1 } },
        { n: '11', title: '人像精修剪辑', tag: '人物影像 · 人物包装', meta: '14秒 · 人物影像 / 人物包装', video: '/videos/v11.mp4', poster: '', cls: 'tall', transform: { x: 0, y: 0, scale: 1 } },
        { n: '12', title: '人物调色', tag: '人物影像 · 色彩设计', meta: '31秒 · 人物影像 / 色彩设计', video: '/videos/v12.mp4', poster: '', cls: 'square', transform: { x: 0, y: 0, scale: 1 } },
        { n: '13', title: 'AI短片', tag: 'AIGC 人物 · 对话叙事', meta: '36秒 · AI 人物 / 正反打', video: '/videos/v13.mp4', poster: '', cls: 'wide', transform: { x: 0, y: 0, scale: 1 } },
      ],
    },

    caps: {
      no: '03',
      label: 'CAPABILITIES / 能力档案',
      titleA: 'THE',
      titleB: 'METHOD',
      intro: 'Where image direction meets intelligent tools. Every frame is considered.',
      items: [
        { no: '01', title: 'CONCEPT & ART DIRECTION', desc: '把模糊的想象，变成可执行的视觉系统。' },
        { no: '02', title: 'GENERATIVE FILMMAKING', desc: '从文本、分镜到动态影像的完整 AIGC 流程。' },
        { no: '03', title: 'WORKSHOP & TEACHING', desc: '让团队理解工具，更理解自己的表达。' },
        { no: '04', title: 'VISUAL WORLD-BUILDING', desc: '为品牌建立可持续生长的视觉资产。' },
      ],
    },

    contact: {
      no: '//',
      label: '联系',
      watermark: [],
      eyebrow: '从品牌广告到剧情短片，从文化史诗到电商内容 —— 把一个想法变成成片。',
      titleA: '来聊聊你的项目',
      titleB: '',
      mail: '625209860@qq.com',
      buttons: ['+86 180 0206 7803', '17612294812@163.com', '北京'],
      status: '开放合作中',
      bottom: [],
    },
  }
}
