const allCSS = [
    "animation",
    "animation-name",
    "animation-duration",
    "animation-timing-function",
    "animation-delay",
    "animation-iteration-count",
    "animation-direction",
    "animation-play-state",
    "animation-fill-mode",
    "background",
    "background-attachment",
    "background-color",
    "background-image",
    "background-position",
    "background-repeat",
    "background-clip",
    "background-origin",
    "background-size",
    "border",
    "border-bottom",
    "border-bottom-color",
    "border-bottom-style",
    "border-bottom-width",
    "border-color",
    "border-left",
    "border-left-color",
    "border-left-style",
    "border-left-width",
    "border-right",
    "border-right-color",
    "border-right-style",
    "border-right-width",
    "border-top",
    "border-top-color",
    "border-top-style",
    "border-top-width",
    "border-width",
    "outline",
    "outline-color",
    "outline-style",
    "outline-width",
];

let cssList: any = [];

function translCss(transl: any) {
    cssList.value = allCSS.map((item) => {
        return { value: item, transl: transl(`css.${item}`) };
    });
}

export { allCSS, cssList, translCss };
