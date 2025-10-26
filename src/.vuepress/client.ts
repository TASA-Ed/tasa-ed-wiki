import { defineClientConfig } from "vuepress/client";
import LinkCard from "./components/link-card.vue";

export default defineClientConfig({
    enhance: ({ app }) => {
        app.component("LinkCard", LinkCard);
    },
});
