/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-compare variant.
 * Base block: columns
 * Source: https://www.centurylink.com/home.html
 * Target: Columns block table — 1 row with 2 columns (speed comparison items side-by-side)
 * Source selectors from captured DOM: #container-c49e1f9729
 * Contains a carousel with speed comparison items (100 Mbps vs 940 Mbps)
 * Each carousel item has: speed image + teaser with description
 */
export default function parse(element, { document }) {
  // The element is #container-c49e1f9729 which contains a carousel of speed comparison items
  // Found: .cmp-carousel with .cmp-carousel__item children
  const carouselItems = element.querySelectorAll('.cmp-carousel__item');

  const row = [];

  if (carouselItems.length > 0) {
    carouselItems.forEach((item) => {
      const colContent = [];

      // Get speed image (headphones, gaming controller, etc.)
      // Found: <img> inside .image containers
      const images = item.querySelectorAll('.image img, .cmp-teaser__image img');
      images.forEach((img) => colContent.push(img));

      // Get price/speed info from teaser pretitle
      // Found: <div class="cmp-teaser__pretitle"> with $55/mo text
      const pretitle = item.querySelector('.cmp-teaser__content .cmp-teaser__pretitle');
      if (pretitle) colContent.push(pretitle);

      // Get description text
      const textEls = item.querySelectorAll('.cmp-text p');
      textEls.forEach((p) => colContent.push(p));

      // Get buttons/CTAs
      const buttons = item.querySelectorAll('a.cmp-button');
      buttons.forEach((btn) => colContent.push(btn));

      if (colContent.length > 0) {
        row.push(colContent);
      }
    });
  } else {
    // Fallback: try to find side-by-side containers
    const containers = element.querySelectorAll(':scope .aem-Grid > .container');
    containers.forEach((col) => {
      const colContent = [];
      const imgs = col.querySelectorAll('img');
      const texts = col.querySelectorAll('.cmp-text');
      imgs.forEach((img) => colContent.push(img));
      texts.forEach((t) => colContent.push(t));
      if (colContent.length > 0) row.push(colContent);
    });
  }

  const cells = row.length > 0 ? [row] : [];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-compare', cells });
  element.replaceWith(block);
}
