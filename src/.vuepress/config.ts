import { defineUserConfig } from "vuepress";

import theme from "./theme.js";
import { llmsPlugin } from '@vuepress/plugin-llms'

export default defineUserConfig({
    base: "/",

    lang: "zh-CN",
    title: "TASA-Ed Wiki",
    description: "TASA-Ed Wiki | 百科",
    pagePatterns: ["**/*.md", "!**/*.snippet.md", "!.vuepress", "!node_modules"],

    theme,

    shouldPrefetch: false,

    plugins: [
        llmsPlugin({
            domain: "https://wiki.tasaed.top"
        }),
    ]
});
