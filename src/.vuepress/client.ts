import { defineClientConfig } from "vuepress/client";
import { defineWalineConfig } from '@vuepress/plugin-comment/client';
import qqGroupLink from "./components/qqGroupLink.js";
import LinkCard from "./components/link-card.vue";

defineWalineConfig({
    serverURL: "https://api.tasaed.top/talk",
    emoji: ["https://cdn.tasaed.top/i/2026/qq", "https://cdn.tasaed.top/i/2026/bmoji", "https://cdn.tasaed.top/i/2026/emoji/gifs", "https://cdn.tasaed.top/i/2026/emoji/jpgs"],
    dark: "auto",
    requiredMeta: ['nick', 'mail'],
    login: "enable",
    wordLimit: [2, 600],
    recaptchaV3Key: "6LdVtPgrAAAAAJtpGCnbua8kHO7G5T-xrStf6fnY",
    reaction: ["https://cdn.tasaed.top/i/2026/bmoji/bmoji_thumb_up.png","https://cdn.tasaed.top/i/2026/emoji/reaction/181.png","https://cdn.tasaed.top/i/2026/emoji/reaction/297.png","https://cdn.tasaed.top/i/2026/bmoji/bmoji_doge.png","https://cdn.tasaed.top/i/2026/bmoji/bmoji_angry.png","https://cdn.tasaed.top/i/2026/bmoji/bmoji_um.png","https://cdn.tasaed.top/i/2026/emoji/reaction/38.png"],
    search: false,
    imageUploader: async (image: File) => {
        let formData = new FormData();
        let headers = new Headers();

        formData.append("file", image);
        headers.append("Accept", "application/json");

        const resp = await fetch("https://api.tasaed.top/image/upload/", {
            method: "POST",
            headers: headers,
            body: formData,
        });
        const resp_1 = await resp.json();
        if (resp_1.success === false) {
            throw new Error(resp_1.message);
        }
        return resp_1.data.links.url;
    },
});

export default defineClientConfig({
    enhance: ({ app }) => {
        app.component("LinkCard", LinkCard);
        app.component("qqGroupLink", qqGroupLink);
    },
});
