const allElement = [
    "div",
    "html",
    "head",
    "body",
    "text",
    "span",
    "p",
    "a",
    "style",
    "table",
    "form",
    "select",
    "button",
    "input",
    "textarea",
    "iframe",
    "script",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ol",
    "ul",
    "li",
    "dl",
    "dt",
    "pre",
    "b",
    "del",
    "u",
    "small",
    "strike",
    "strong",
    "i",
    "em",
    "abbr",
    "sub",
    "sup",
    "br",
    "hr",
    "center",
    "code",
    "audio",
    "video",
    "img",
    "source",
];

const cantAdd = ["html", "head", "body", "text"];

const canAddList = allElement.filter((e) => {
    return !cantAdd.includes(e);
});

const linktype = [
    "alternate",
    "archives",
    "author",
    "bookmark",
    "canonical",
    "dns-prefetch",
    "external",
    "first",
    "help",
    "icon",
    "import",
    "last",
    "license",
    "manifest",
    "modulepreload",
    "next",
    "nofollow",
    "noopener",
    "noreferrer",
    "opener",
    "pingback",
    "preconnect",
    "prefetch",
    "preload",
    "prerender",
    "prev",
    "search",
    "shortlink",
    "stylesheet",
    "tag",
];

const allRoutine = {
    a: build(
        [
            { name: "download", type: "text" },
            { name: "href", type: "text" },
            {
                name: "target",
                type: "select",
                default: "_self",
                select: build(["_self", "_blank", "_parent", "_top"], "a.target"),
            },
            { name: "rel", type: "multiple", id: "a.rel", select: build(linktype, "linktype") },
        ],
        "a"
    ),
    button: build(
        [
            { name: "autofocus", type: "checkbox" },
            { name: "disabled", type: "checkbox" },
            { name: "name", type: "text" },
            {
                name: "type",
                type: "select",
                select: build(["submit", "reset", "button", "menu"], "button.type"),
            },
            { name: "value", type: "text" },
        ],
        "button"
    ),
    input: build(
        [
            {
                name: "type",
                type: "select",
                default: "text",
                select: build(
                    [
                        "button",
                        "checkbox",
                        "color",
                        "date",
                        "datetime-local",
                        "email",
                        "file",
                        "hidden",
                        "image",
                        "month",
                        "number",
                        "password",
                        "radio",
                        "range",
                        "reset",
                        "search",
                        "submit",
                        "tel",
                        "text",
                        "time",
                        "url",
                        "week",
                    ],
                    "input.type"
                ),
            },
            {
                name: "autocomplete",
                type: "select",
                default: "on",
                select: build(["on", "off"], "input.autocomplate"),
            },
        ],
        "input"
    ),
    audio: build(
        [
            { name: "autoplay", type: "checkbox" },
            { name: "controls", type: "checkbox" },
            {
                name: "crossorigin",
                type: "select",
                select: build(["anonymous", "use-credentials"], "audio.crossorigin"),
            },
            { name: "currentTime", type: "text", id: "audio.currentTime" },
            {
                name: "disableRemotePlayback",
                type: "select",
                default: "false",
                select: build(["true", "false"], "audio.disableRemotePlayback"),
            },
            { name: "loop", type: "checkbox", id: "audio.loop" },
            {
                name: "muted",
                type: "select",
                default: "false",
                select: build(["true", "false"], "audio.muted"),
            },
            {
                name: "preload",
                type: "select",
                default: "metadata",
                select: build(["none", "metadata", "auto"], "audio.preload"),
            },
            { name: "src", type: "text" },
        ],
        "audio"
    ),
};

function build(obj: Array<string | any>, className: string): Array<any> {
    return obj.map((item: string | any) => {
        if (typeof item === "string") {
            return { name: item, id: `${className}.${item}` };
        } else {
            return { ...item, id: `${className}.${item.name}` };
        }
    });
}

export { allElement, cantAdd, canAddList, allRoutine };
