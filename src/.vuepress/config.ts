import { defineUserConfig } from "vuepress";
import { removePwaPlugin } from '@vuepress/plugin-remove-pwa'

import theme from "./theme.js";
import { llmsPlugin } from '@vuepress/plugin-llms'
import { openapiGeneratorPlugin } from './plugins/openapi-generator.js'

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
        removePwaPlugin({
            swLocation: 'service-worker.js',
        }),
        openapiGeneratorPlugin({
            openapiPath: 'openapi.json',
            outputDir: 'api',
            baseRoute: '/api'
        }),
    ]
});
