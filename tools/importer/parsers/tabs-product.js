/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-product variant.
 * Base block: tabs
 * Source: https://www.centurylink.com/home.html
 * Target: Tabs block table — N rows, 2 columns each: [tab-label | tab-content]
 * Source selectors from captured DOM: .cmp-tabs__tablist, .cmp-tabs
 */
export default function parse(element, { document }) {
  // The element is the .cmp-tabs__tablist (ol with tab labels)
  // Navigate up to the .cmp-tabs container to access both tabs and panels
  const tabsRoot = element.closest('.cmp-tabs') || element.parentElement;

  // Get tab labels from the <ol> list
  // Found: <li class="cmp-tabs__tab">Internet</li>, <li class="cmp-tabs__tab">TV</li>, etc.
  const tabItems = tabsRoot.querySelectorAll('.cmp-tabs__tab');

  // Get tab panels
  // Found: <div class="cmp-tabs__tabpanel"> for each tab
  const tabPanels = tabsRoot.querySelectorAll('.cmp-tabs__tabpanel');

  const cells = [];

  tabItems.forEach((tab, index) => {
    const label = tab.textContent.trim();
    const panel = tabPanels[index];

    if (panel) {
      // Extract content from the panel: headings, text, buttons, images, teasers
      const contentElements = [];
      const headings = panel.querySelectorAll('h1, h2, h3');
      const paragraphs = panel.querySelectorAll('.cmp-text p');
      const buttons = panel.querySelectorAll('a.cmp-button');
      const images = panel.querySelectorAll('.cmp-teaser__image img, .image img, .lazy-background img');
      const teaserDesc = panel.querySelectorAll('.cmp-teaser__content .cmp-teaser__description');

      headings.forEach((h) => contentElements.push(h));
      paragraphs.forEach((p) => contentElements.push(p));
      buttons.forEach((btn) => contentElements.push(btn));
      images.forEach((img) => contentElements.push(img));
      teaserDesc.forEach((desc) => contentElements.push(desc));

      // Row: [tab label | tab content]
      cells.push([label, contentElements.length > 0 ? contentElements : panel]);
    } else {
      cells.push([label, '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-product', cells });
  element.replaceWith(block);
}
