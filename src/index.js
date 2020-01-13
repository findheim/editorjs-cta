/**
 * Build styles
 */
require("./index.css").toString();

/**
 * @class Quote
 * @classdesc Quote Tool for Editor.js
 * @property {QuoteData} data - Tool`s input and output data
 * @propert {object} api - Editor.js API instance
 *
 * @typedef {object} QuoteData
 * @description Quote Tool`s input and output data
 * @property {string} text - quote`s text
 * @property {string} caption - quote`s caption
 * @property {'center'|'left'} alignment - quote`s alignment
 *
 * @typedef {object} QuoteConfig
 * @description Quote Tool`s initial configuration
 * @property {string} quotePlaceholder - placeholder to show in quote`s text input
 * @property {string} captionPlaceholder - placeholder to show in quote`s caption input
 * @property {'center'|'left'} defaultAlignment - alignment to use as default
 */
class CTA {
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon:
        '<svg height="15" viewBox="0 0 15 14" width="14" xmlns="http://www.w3.org/2000/svg"><path d="m452 512h-392c-33.085938 0-60-26.914062-60-60v-392c0-33.085938 26.914062-60 60-60h392c33.085938 0 60 26.914062 60 60v392c0 33.085938-26.914062 60-60 60zm-392-472c-11.027344 0-20 8.972656-20 20v392c0 11.027344 8.972656 20 20 20h392c11.027344 0 20-8.972656 20-20v-392c0-11.027344-8.972656-20-20-20zm372 392h-352v-120h352zm-312-40h272v-40h-272zm0 0"/></svg>',
      title: "CTA"
    };
  }

  /**
   * Empty Quote is not empty Block
   * @public
   * @returns {boolean}
   */
  static get contentless() {
    return true;
  }

  /**
   * Allow to press Enter inside the Quote
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  static get DEFAULT_TITLE_PLACEHOLDER() {
    return "Enter a title";
  }

  /**
   * Default placeholder for quote text
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_TEXT_PLACEHOLDER() {
    return "Enter a text";
  }

  /**
   * Default placeholder for quote caption
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_BUTTON_PLACEHOLDER() {
    return "Enter a button text";
  }

  /**
   * Tool`s styles
   *
   * @returns {{baseClass: string, wrapper: string, quote: string, input: string, caption: string, settingsButton: string, settingsButtonActive: string}}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: "cdx-cta",
      text: "cdx-cta__text",
      input: this.api.styles.input,
      title: "cdx-cta__title",
      button: "cdx-cta__button",
      settingsWrapper: "cdx-cta-settings",
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: QuoteData, config: QuoteConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   */
  constructor({ data, config, api }) {
    this.api = api;

    this.titlePlaceholder =
      config.titlePlaceholder || CTA.DEFAULT_TITLE_PLACEHOLDER;
    this.textPlaceholder =
      config.textPlaceholder || CTA.DEFAULT_TEXT_PLACEHOLDER;
    this.buttonPlaceholder =
      config.buttonPlaceholder || CTA.DEFAULT_BUTTON_PLACEHOLDER;

    this.data = {
      title: data.title || "",
      text: data.text || "",
      button: data.button || ""
    };
  }

  /**
   * Create Quote Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make("blockquote", [
      this.CSS.baseClass,
      this.CSS.wrapper
    ]);
    const title = this._make("div", [this.CSS.input, this.CSS.caption], {
      contentEditable: true,
      innerHTML: this.data.title
    });
    const text = this._make("div", [this.CSS.input, this.CSS.text], {
      contentEditable: true,
      innerHTML: this.data.text
    });
    const button = this._make("div", [this.CSS.input, this.CSS.caption], {
      contentEditable: true,
      innerHTML: this.data.button
    });

    title.dataset.placeholder = this.titlePlaceholder;
    text.dataset.placeholder = this.textPlaceholder;
    button.dataset.placeholder = this.buttonPlaceholder;

    container.appendChild(title);
    container.appendChild(text);
    container.appendChild(button);

    return container;
  }

  /**
   * Extract Quote data from Quote Tool element
   *
   * @param {HTMLDivElement} quoteElement - element to save
   * @returns {QuoteData}
   */
  save(quoteElement) {
    const text = quoteElement.querySelector(`.${this.CSS.text}`);
    const title = quoteElement.querySelector(`.${this.CSS.title}`);
    const button = quoteElement.querySelector(`.${this.CSS.button}`);

    return Object.assign(this.data, {
      text: text.innerHTML,
      title: title.innerHTML,
      button: button.innerHTML
    });
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true
      },
      title: {
        br: true
      },
      button: {
        br: true
      }
    };
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    let el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }
}

module.exports = CTA;
