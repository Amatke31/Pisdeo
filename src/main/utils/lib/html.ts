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
    a: [
        { name: "download", type: "text", id: "a.download" },
        { name: "href", type: "text", id: "a.href" },
        {
            name: "target",
            type: "select",
            id: "a.target",
            default: "_self",
            select: [
                { name: "_self", id: "a.target.self" },
                { name: "_blank", id: "a.target.blank" },
                { name: "_parent", id: "a.target.parent" },
                { name: "_top", id: "a.target.top" },
            ],
        },
        { name: "rel", type: "select", id: "a.rel", select: build(linktype, "linktype") },
    ],
    button: [
        { name: "autofocus", type: "checkbox", id: "button.autofocus" },
        { name: "disabled", type: "checkbox", id: "button.disabled" },
    ],
    input: [
        {
            name: "autocomplete",
            type: "select",
            id: "input.autocomplete",
            default: "on",
            select: [
                { name: "on", id: "input.autocomplete.on" },
                { name: "off", id: "input.autocomplete.off" },
            ],
        },
    ],
    audio: [
        { name: "autoplay", type: "checkbox", id: "audio.autoplay" },
        { name: "controls", type: "checkbox", id: "audio.controls" },
        {
            name: "crossorigin",
            type: "select",
            id: "audio.crossorigin",
            select: [
                { name: "anonymous", id: "audio.crossorigin.anonymous" },
                { name: "use-credentials", id: "audio.crossorigin.use-credentials" },
            ],
        },
        { name: "currentTime", type: "text", id: "audio.currentTime" },
        {
            name: "disableRemotePlayback",
            type: "select",
            default: "false",
            id: "audio.disableRemotePlayback",
            select: [
                { name: "true", id: "audio.disableremoteplayback.true" },
                { name: "false", id: "audio.disableremoteplayback.false" },
            ],
        },
        { name: "loop", type: "checkbox", id: "audio.loop" },
        {
            name: "muted",
            type: "select",
            id: "audio.muted",
            default: "false",
            select: [
                { name: "true", id: "audio.muted.true" },
                { name: "false", id: "audio.muted.false" },
            ],
        },
        {
            name: "preload",
            type: "select",
            id: "audio.preload",
            default: "metadata",
            select: [
                { name: "none", id: "audio.preload.metadata" },
                { name: "metadata", id: "audio.preload.metadata" },
                { name: "auto", id: "audio.preload.auto" },
            ],
        },
        { name: "src", type: "text", id: "audio.src" },
    ],
};

function build(obj: Array<string>, className: string): Array<any> {
    return obj.map((item: string) => {
        return { value: item, id: `${className}.${item}` };
    });
}

export { allElement, cantAdd, canAddList, allRoutine };
