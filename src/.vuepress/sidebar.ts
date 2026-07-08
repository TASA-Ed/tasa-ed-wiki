import { sidebar } from "vuepress-theme-hope";

export default sidebar({
    "/": [
        "",
        {
            text: "百科",
            icon: "book",
            prefix: "wiki/",
            collapsible: true,
            children: "structure",
            expanded: true
        },
        {
            text: "RUST-API",
            icon: "plug",
            prefix: "api/",
            link: "api/README.md"
        }
    ],
});
