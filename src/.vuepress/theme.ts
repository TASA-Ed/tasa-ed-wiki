import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
    hostname: "https://wiki.tasaed.top",

    logo: "/assets/t832.png",

    favicon: "favicon.ico",

    repoDisplay: false,

    docsDir: "src",

    author: {
        name: "TASA-Ed工作室",
        url: "https://www.tasaed.top",
        email: "studio@tasaed.top"
    },

    // 页面信息
    pageInfo: ["Author", "Date", "PageView", "ReadingTime", "Word"],
    contributors: false,
    changelog: false,
    editLink: false,

    // 导航栏
    fullscreen: true,
    navbarLayout: {
        start: ["Brand"],
        center: ["Links"],
        end: ["qqGroupLink", "Outlook", "Language", "Search"],
    },
    navbar,

    // 侧边栏
    sidebar,

    // 页脚
    footer: 'TASA-Ed 百科 | Copyright © 2020-2025 <a href=\"https://www.tasaed.top\">TASA-Ed工作室</a> licensed <a href=\"https://creativecommons.org/licenses/by-sa/4.0\" target=\"_blank\">CC BY-SA 4.0</a> | 友情链接：<a href=\"https://github.com/leamus/MakerFrame\" target=\"_blank\">鹰歌游戏引擎</a> , <a href=\"https://falldrift.github.io/jxzs/\" target=\"_blank\">剑心之誓</a><br/>Powered by <a href=\"https://vuejs.press\" target=\"_blank\">VuePress</a> | Theme by <a href=\"https://theme-hope.vuejs.press\" target=\"_blank\">Hope</a>',
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
        icon: {
            assets: [
                "/assets/fontawesome/css/brands.min.css",
                "/assets/fontawesome/css/solid.min.css",
                "/assets/fontawesome/css/regular.min.css",
                "/assets/fontawesome/css/fontawesome.min.css"
            ]
        },
    },
});
