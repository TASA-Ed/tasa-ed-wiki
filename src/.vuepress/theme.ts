import { hopeTheme } from "vuepress-theme-hope";

import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://wiki.tasaed.top",

  logo: "/assets/logo/t832.png",

  repo: "TASA-Ed/tasa-ed-wiki",

  favicon: "/favicon.ico",

  docsDir: "src",

  author: {
    name: "TASA-Ed工作室",
    url: "https://www.tasaed.top",
    email: "studio@tasaed.top"
  },

  // 页面信息
  pageInfo: ["Author", "PageView", "ReadingTime", "Word"],
  contributors: "meta",
  changelog: false,
  editLink: false,

  // 导航栏
  fullscreen: true,
  navbarLayout: {
    start: ["Brand"],
    center: ["Search"],
    end: ["qqGroupLink", "Repo", "Outlook", "Language"],
  },

  // 侧边栏
  sidebar,

  // 页脚
  footer: 'TASA-Ed 百科 | Copyright © 2020 - 2026 <a href=\"https://www.tasaed.top\">TASA-Ed工作室</a> licensed <a href=\"https://creativecommons.org/licenses/by-sa/4.0\" target=\"_blank\">CC BY-SA 4.0</a> | 友情链接：<a href=\"https://github.com/leamus/MakerFrame\" target=\"_blank\">鹰歌游戏引擎</a> , <a href=\"https://falldrift.github.io/jxzs/\" target=\"_blank\">剑心之誓</a><br/><a href="https://beian.miit.gov.cn/" target="_blank">蒙ICP备2026001527号-1</a><br/>Powered by <a href=\"https://vuejs.press\" target=\"_blank\">VuePress</a> | Theme by <a href=\"https://theme-hope.vuejs.press\" target=\"_blank\">Hope</a>',
  copyright: false,
  displayFooter: true,

  markdown: {
    component: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    mark: true,
    footnote: true,
    include: true,
    vPre: true,
  },

  plugins: {
    comment: {
      provider: "Waline",
      serverURL: "https://api.tasaed.top/talk",
      emoji: ["https://cdn.tasaed.top/i/2026/qq", "https://cdn.tasaed.top/i/2026/bmoji", "https://cdn.tasaed.top/i/2026/emoji/gifs", "https://cdn.tasaed.top/i/2026/emoji/jpgs"],
      dark: "auto",
      requiredMeta: ['nick', 'mail'],
      login: "enable",
      wordLimit: [2, 300],
      recaptchaV3Key: "6LdVtPgrAAAAAJtpGCnbua8kHO7G5T-xrStf6fnY",
      reaction: ["https://cdn.tasaed.top/i/2026/bmoji/bmoji_thumb_up.png","https://cdn.tasaed.top/i/2026/emoji/reaction/181.png","https://cdn.tasaed.top/i/2026/emoji/reaction/297.png","https://cdn.tasaed.top/i/2026/bmoji/bmoji_doge.png","https://cdn.tasaed.top/i/2026/bmoji/bmoji_angry.png","https://cdn.tasaed.top/i/2026/bmoji/bmoji_um.png","https://cdn.tasaed.top/i/2026/emoji/reaction/38.png"],
    },

    pwa: {
      update: "disable",
      favicon: "/favicon.ico",
    },

    meilisearch: {
      host: "https://api.tasaed.top/search",
      apiKey: "5c27ff5c25b3c6201c40dc9967a7280ae342589da217b8236a81a624d5a8ae43",
      indexUid: "vuepress_wiki",
    },

    // 在移动设备上显示复制按钮
    copyCode: {
      showInMobile: true,
      duration: 1500,
    },

    icon: {
      assets: [
        "/assets/fontawesome/css/brands.min.css",
        "/assets/fontawesome/css/solid.min.css",
        "/assets/fontawesome/css/regular.min.css",
        "/assets/fontawesome/css/fontawesome.min.css"
      ]
    },

    components: {
      components: ["Badge", "VPCard"],
    },

    feed: {
      rss: true,
      image: "/assets/logo/t832.png",
      icon: "/assets/favicon.ico",
      channel: {
        copyright: "Copyright © 2020 - 2026 TASA-Ed工作室",
        ttl: 4320,
        image: "/assets/logo/t832.png",
        icon: "/assets/favicon.ico"
      }
    },
  }
});
