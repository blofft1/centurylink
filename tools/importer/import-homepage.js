/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroSpeedParser from './parsers/hero-speed.js';
import columnsPricingParser from './parsers/columns-pricing.js';
import tabsProductParser from './parsers/tabs-product.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsCompareParser from './parsers/columns-compare.js';
import columnsPromoParser from './parsers/columns-promo.js';

// TRANSFORMER IMPORTS
import centurylinkCleanupTransformer from './transformers/centurylink-cleanup.js';
import centurylinkSectionsTransformer from './transformers/centurylink-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-speed': heroSpeedParser,
  'columns-pricing': columnsPricingParser,
  'tabs-product': tabsProductParser,
  'cards-feature': cardsFeatureParser,
  'columns-compare': columnsCompareParser,
  'columns-promo': columnsPromoParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'CenturyLink main homepage with hero, service offerings, promotions, and support links',
  urls: [
    'https://www.centurylink.com/home.html',
  ],
  blocks: [
    {
      name: 'hero-speed',
      instances: ['.cmp-container--bg-994124446'],
    },
    {
      name: 'columns-pricing',
      instances: ['#container-0520f0944c .aem-Grid > .container:first-child, #container-0520f0944c .aem-Grid > .container:nth-child(2)'],
    },
    {
      name: 'tabs-product',
      instances: ['.cmp-tabs__tablist'],
    },
    {
      name: 'cards-feature',
      instances: ['#experiencefragment-ecaa09639e', '.cmp-experiencefragment--home---fiber-icons .cmp-container', '#experiencefragment-premium-wifi .cmp-container'],
    },
    {
      name: 'columns-compare',
      instances: ['#container-c49e1f9729'],
    },
    {
      name: 'columns-promo',
      instances: ['#container-06730e7ef7', '#container-2e3e345215'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.cmp-container--bg-994124446',
      style: null,
      blocks: ['hero-speed', 'columns-pricing'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'CTA Bar',
      selector: '#container-43140bf83a',
      style: null,
      blocks: [],
      defaultContent: ['#container-43140bf83a .cmp-text'],
    },
    {
      id: 'section-3',
      name: 'Reliable Internet',
      selector: '#container-ed7e245a26',
      style: null,
      blocks: ['tabs-product', 'cards-feature'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Fiber Benefits',
      selector: '#container-c0bbedf147',
      style: null,
      blocks: ['cards-feature'],
      defaultContent: ['#container-c0bbedf147 h2', '#container-c0bbedf147 .cmp-text'],
    },
    {
      id: 'section-5',
      name: 'Self-Service',
      selector: '#container-e3fcad6744',
      style: 'grey',
      blocks: [],
      defaultContent: ['#container-e3fcad6744 .cmp-text'],
    },
    {
      id: 'section-6',
      name: 'Speed Comparison',
      selector: '#container-c49e1f9729',
      style: null,
      blocks: ['columns-compare'],
      defaultContent: ['#container-c49e1f9729 h2', '#container-c49e1f9729 .cmp-text'],
    },
    {
      id: 'section-7',
      name: 'Premium WiFi',
      selector: '#container-b15a154183',
      style: 'green',
      blocks: ['cards-feature'],
      defaultContent: ['#container-b15a154183 h2', '#container-b15a154183 .cmp-text'],
    },
    {
      id: 'section-8',
      name: 'Referral Program',
      selector: '#container-06730e7ef7',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-9',
      name: 'Moving',
      selector: '#container-2e3e345215',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  centurylinkCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [centurylinkSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
