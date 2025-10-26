import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
    base: "/",

    lang: "zh-CN",
    title: "TASA-Ed Wiki",
    description: "TASA-Ed Wiki | 百科",

    theme,
});
