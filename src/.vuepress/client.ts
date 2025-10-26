import { defineClientConfig } from "vuepress/client";
import qqGroupLink from "./components/qqGroupLink.js";
import LinkCard from "./components/link-card.vue";

export default defineClientConfig({
    enhance: ({ app }) => {
        app.component("LinkCard", LinkCard);
        app.component("qqGroupLink", qqGroupLink);
    },
});
