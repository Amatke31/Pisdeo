/**
 * @typedef {object} ExtensionInfo
 * Extension info, defined in `info.json`.
 * @property {string} id - ID.
 * @property {string} version - Version.
 * @property {string | string[]} author - Author(s).
 * @property {string} icon - Icon.
 * @property {string} inset_icon - Inset icon.
 */

/**
 * Extension base class.
 */
class Extension {
    /**
     * On Init
     */
    onInit() { }

    /**
     * If use this Extension template
     */
    useTemplate() { }

}

module.exports = Extension;
