/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature variant.
 * Base block: cards
 * Source: https://www.centurylink.com/home.html
 * Target: Cards block table — N rows, 2 columns each: [icon image | label text]
 * Source selectors from captured DOM:
 *   - #experiencefragment-ecaa09639e (.cmp-experiencefragment--home---features)
 *   - .cmp-experiencefragment--home---fiber-icons .cmp-container
 *   - #experiencefragment-premium-wifi .cmp-container
 * Each feature card has: icon image(s) + bold text label inside a .cmp-container child
 */
export default function parse(element, { document }) {
  // Find card containers — each card is a direct .cmp-container child within grid columns
  // Pattern: element > .aem-Grid > .container > .cmp-container (each is a card)
  // The cards are organized in grid columns, each containing images and text
  const cardContainers = element.querySelectorAll(':scope .aem-Grid > .container > .cmp-container');

  // Fallback: try finding containers with images directly
  const containers = cardContainers.length > 0
    ? cardContainers
    : element.querySelectorAll('.cmp-container');

  const cells = [];

  containers.forEach((card) => {
    // Get the first icon image (skip hover/dark versions)
    // Found: <img src="./images/50f926d005330277c021a3304f0849d0.png" alt="Fast Connectivity">
    const images = card.querySelectorAll('img');
    const icon = images.length > 0 ? images[0] : null;

    // Get the label text (bold text inside .cmp-text)
    // Found: <b><span class="font-18-22__16-20__14-18__12-16">Fast connectivity</span></b>
    const textEls = card.querySelectorAll('.cmp-text');
    const labels = [];
    textEls.forEach((t) => {
      const text = t.textContent.trim();
      if (text) labels.push(t);
    });

    if (icon || labels.length > 0) {
      // Row: [icon image | label text(s)]
      const imageCell = icon ? [icon] : [];
      const textCell = labels.length > 0 ? labels : [''];
      cells.push([imageCell, textCell]);
    }
  });

  if (cells.length === 0) {
    // Fallback: treat all images and text as a single row
    const allImages = element.querySelectorAll('img');
    const allText = element.querySelectorAll('.cmp-text');
    if (allImages.length > 0 || allText.length > 0) {
      cells.push([[...allImages], [...allText]]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
