import { hopeTheme } from "vuepress-theme-hope";

import sidebar from "./sidebar.js";

export default hopeTheme({
    hostname: "https://wiki.tasaed.top",

    logo: "/assets/logo/t832.png",

    favicon: "/favicon.ico",

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
        center: ["Search"],
        end: ["qqGroupLink", "Outlook", "Language"],
    },

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
        comment: {
            provider: "Artalk",
            server: "https://talk.tasaed.top",
            locale: "zh-CN",
            emoticons: "https://api.tasaed.top/artalk/default.json",
            placeholder: "输入你想说的话吧",
            noComment: "这里还没有评论，快来抢沙发！",
            sendBtn: "点击发送",
            uaBadge: true,
            gravatar: {
                mirror: "https://cn.cravatar.com/avatar/",
                params: "sha256=1&d=mp&s=240&d=retro",
            },
        },

        meilisearch: {
            host: "https://api.tasaed.top/search",
            apiKey: "010ca72507047d113e1bb4e853ad720cae2acd5be1a6ddf00957367b5c08572c",
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
                copyright: "Copyright © 2020-2025 TASA-Ed工作室",
                ttl: 4320,
                image: "/assets/logo/t832.png",
                icon: "/assets/favicon.ico"
            }
        },
    }
});
