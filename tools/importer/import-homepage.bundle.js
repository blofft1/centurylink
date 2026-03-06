var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-speed.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(":scope > img");
    const heading = element.querySelector("h1, h2");
    const subheading = element.querySelector("#container-0520f0944c p");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-speed", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-pricing.js
  function parse2(element, { document }) {
    const cardContainer = element.querySelector("#container-5f28a85bd4") || element;
    const columns = cardContainer.querySelectorAll(":scope .aem-Grid > .container");
    const row = [];
    if (columns.length >= 2) {
      columns.forEach((col) => {
        const colContent = [];
        const imgs = col.querySelectorAll("img");
        const headings = col.querySelectorAll(".cmp-text b, .cmp-text h3, .cmp-text h2");
        const lists = col.querySelectorAll(".cmp-text ul");
        const prices = col.querySelectorAll(".cmp-teaser__pretitle");
        const fineprint = col.querySelectorAll(".cmp-text p");
        const buttons = col.querySelectorAll("a.cmp-button");
        imgs.forEach((img) => colContent.push(img));
        headings.forEach((h) => colContent.push(h));
        lists.forEach((ul) => colContent.push(ul));
        prices.forEach((p) => colContent.push(p));
        fineprint.forEach((fp) => {
          if (!fp.querySelector("b") && !fp.closest("ul")) colContent.push(fp);
        });
        buttons.forEach((btn) => colContent.push(btn));
        row.push(colContent);
      });
    } else {
      row.push(element);
    }
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-pricing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-product.js
  function parse3(element, { document }) {
    const tabsRoot = element.closest(".cmp-tabs") || element.parentElement;
    const tabItems = tabsRoot.querySelectorAll(".cmp-tabs__tab");
    const tabPanels = tabsRoot.querySelectorAll(".cmp-tabs__tabpanel");
    const cells = [];
    tabItems.forEach((tab, index) => {
      const label = tab.textContent.trim();
      const panel = tabPanels[index];
      if (panel) {
        const contentElements = [];
        const headings = panel.querySelectorAll("h1, h2, h3");
        const paragraphs = panel.querySelectorAll(".cmp-text p");
        const buttons = panel.querySelectorAll("a.cmp-button");
        const images = panel.querySelectorAll(".cmp-teaser__image img, .image img, .lazy-background img");
        const teaserDesc = panel.querySelectorAll(".cmp-teaser__content .cmp-teaser__description");
        headings.forEach((h) => contentElements.push(h));
        paragraphs.forEach((p) => contentElements.push(p));
        buttons.forEach((btn) => contentElements.push(btn));
        images.forEach((img) => contentElements.push(img));
        teaserDesc.forEach((desc) => contentElements.push(desc));
        cells.push([label, contentElements.length > 0 ? contentElements : panel]);
      } else {
        cells.push([label, ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse4(element, { document }) {
    const cardContainers = element.querySelectorAll(":scope .aem-Grid > .container > .cmp-container");
    const containers = cardContainers.length > 0 ? cardContainers : element.querySelectorAll(".cmp-container");
    const cells = [];
    containers.forEach((card) => {
      const images = card.querySelectorAll("img");
      const icon = images.length > 0 ? images[0] : null;
      const textEls = card.querySelectorAll(".cmp-text");
      const labels = [];
      textEls.forEach((t) => {
        const text = t.textContent.trim();
        if (text) labels.push(t);
      });
      if (icon || labels.length > 0) {
        const imageCell = icon ? [icon] : [];
        const textCell = labels.length > 0 ? labels : [""];
        cells.push([imageCell, textCell]);
      }
    });
    if (cells.length === 0) {
      const allImages = element.querySelectorAll("img");
      const allText = element.querySelectorAll(".cmp-text");
      if (allImages.length > 0 || allText.length > 0) {
        cells.push([[...allImages], [...allText]]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-compare.js
  function parse5(element, { document }) {
    const carouselItems = element.querySelectorAll(".cmp-carousel__item");
    const row = [];
    if (carouselItems.length > 0) {
      carouselItems.forEach((item) => {
        const colContent = [];
        const images = item.querySelectorAll(".image img, .cmp-teaser__image img");
        images.forEach((img) => colContent.push(img));
        const pretitle = item.querySelector(".cmp-teaser__content .cmp-teaser__pretitle");
        if (pretitle) colContent.push(pretitle);
        const textEls = item.querySelectorAll(".cmp-text p");
        textEls.forEach((p) => colContent.push(p));
        const buttons = item.querySelectorAll("a.cmp-button");
        buttons.forEach((btn) => colContent.push(btn));
        if (colContent.length > 0) {
          row.push(colContent);
        }
      });
    } else {
      const containers = element.querySelectorAll(":scope .aem-Grid > .container");
      containers.forEach((col) => {
        const colContent = [];
        const imgs = col.querySelectorAll("img");
        const texts = col.querySelectorAll(".cmp-text");
        imgs.forEach((img) => colContent.push(img));
        texts.forEach((t) => colContent.push(t));
        if (colContent.length > 0) row.push(colContent);
      });
    }
    const cells = row.length > 0 ? [row] : [];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-compare", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse6(element, { document }) {
    const imageEl = element.querySelector(".image img, picture img");
    const textContainer = element.querySelector(".container .cmp-container") || element;
    const headings = textContainer.querySelectorAll("h1, h2, h3");
    const paragraphs = textContainer.querySelectorAll(".cmp-text p");
    const buttons = textContainer.querySelectorAll("a.cmp-button");
    const teasers = textContainer.querySelectorAll(".cmp-teaser__description");
    const textContent = [];
    headings.forEach((h) => textContent.push(h));
    paragraphs.forEach((p) => textContent.push(p));
    teasers.forEach((t) => textContent.push(t));
    buttons.forEach((btn) => textContent.push(btn));
    const imageContent = imageEl ? [imageEl] : [];
    const firstImage = element.querySelector(".image");
    const firstText = element.querySelector(".container .cmp-text, .container h2");
    let row;
    if (firstImage && firstText && firstImage.compareDocumentPosition(firstText) & Node.DOCUMENT_POSITION_FOLLOWING) {
      row = [imageContent, textContent];
    } else {
      row = [textContent, imageContent];
    }
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/centurylink-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".onetrust-pc-dark-filter"
      ]);
      WebImporter.DOMUtils.remove(element, [".ie-popup"]);
      WebImporter.DOMUtils.remove(element, [".infomodal-modal"]);
      WebImporter.DOMUtils.remove(element, [".createcookie"]);
      WebImporter.DOMUtils.remove(element, [".cmp-embed:empty"]);
      WebImporter.DOMUtils.remove(element, [".cmp-spacer", ".cq-placeholder"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--home-help-navigation",
        ".vaporheader"
      ]);
      WebImporter.DOMUtils.remove(element, [".cmp-experiencefragment--res-footer"]);
      const mobileOnly = element.querySelectorAll('[class*="aem-GridColumn--default--hide"]');
      mobileOnly.forEach((el) => {
        if (el.querySelector("h1") || el.querySelector(".cmp-button")) {
          el.remove();
        }
      });
      WebImporter.DOMUtils.remove(element, ["link", "noscript", "iframe"]);
      WebImporter.DOMUtils.remove(element, ["#env-run-mode-setting"]);
      WebImporter.DOMUtils.remove(element, [".thumbsup-icon"]);
      WebImporter.DOMUtils.remove(element, [".play-icon", ".video-duration", ".video-overlay"]);
      WebImporter.DOMUtils.remove(element, [".cmp-teaser__content-slideup"]);
    }
  }

  // tools/importer/transformers/centurylink-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-speed": parse,
    "columns-pricing": parse2,
    "tabs-product": parse3,
    "cards-feature": parse4,
    "columns-compare": parse5,
    "columns-promo": parse6
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "CenturyLink main homepage with hero, service offerings, promotions, and support links",
    urls: [
      "https://www.centurylink.com/home.html"
    ],
    blocks: [
      {
        name: "hero-speed",
        instances: [".cmp-container--bg-994124446"]
      },
      {
        name: "columns-pricing",
        instances: ["#container-0520f0944c .aem-Grid > .container:first-child, #container-0520f0944c .aem-Grid > .container:nth-child(2)"]
      },
      {
        name: "tabs-product",
        instances: [".cmp-tabs__tablist"]
      },
      {
        name: "cards-feature",
        instances: ["#experiencefragment-ecaa09639e", ".cmp-experiencefragment--home---fiber-icons .cmp-container", "#experiencefragment-premium-wifi .cmp-container"]
      },
      {
        name: "columns-compare",
        instances: ["#container-c49e1f9729"]
      },
      {
        name: "columns-promo",
        instances: ["#container-06730e7ef7", "#container-2e3e345215"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: ".cmp-container--bg-994124446",
        style: null,
        blocks: ["hero-speed", "columns-pricing"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "CTA Bar",
        selector: "#container-43140bf83a",
        style: null,
        blocks: [],
        defaultContent: ["#container-43140bf83a .cmp-text"]
      },
      {
        id: "section-3",
        name: "Reliable Internet",
        selector: "#container-ed7e245a26",
        style: null,
        blocks: ["tabs-product", "cards-feature"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Fiber Benefits",
        selector: "#container-c0bbedf147",
        style: null,
        blocks: ["cards-feature"],
        defaultContent: ["#container-c0bbedf147 h2", "#container-c0bbedf147 .cmp-text"]
      },
      {
        id: "section-5",
        name: "Self-Service",
        selector: "#container-e3fcad6744",
        style: "grey",
        blocks: [],
        defaultContent: ["#container-e3fcad6744 .cmp-text"]
      },
      {
        id: "section-6",
        name: "Speed Comparison",
        selector: "#container-c49e1f9729",
        style: null,
        blocks: ["columns-compare"],
        defaultContent: ["#container-c49e1f9729 h2", "#container-c49e1f9729 .cmp-text"]
      },
      {
        id: "section-7",
        name: "Premium WiFi",
        selector: "#container-b15a154183",
        style: "green",
        blocks: ["cards-feature"],
        defaultContent: ["#container-b15a154183 h2", "#container-b15a154183 .cmp-text"]
      },
      {
        id: "section-8",
        name: "Referral Program",
        selector: "#container-06730e7ef7",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Moving",
        selector: "#container-2e3e345215",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
