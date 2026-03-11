import { defineClientConfig } from "vuepress/client";
import { defineWalineConfig } from '@vuepress/plugin-comment/client'
import qqGroupLink from "./components/qqGroupLink.js";
import LinkCard from "./components/link-card.vue";

export default defineClientConfig({
    enhance: ({ app }) => {
        app.component("LinkCard", LinkCard);
        app.component("qqGroupLink", qqGroupLink);
    },
});

defineWalineConfig({
    serverURL: "https://api.tasaed.top/talk",
    search: false
})
