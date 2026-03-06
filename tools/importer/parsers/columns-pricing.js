/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-pricing variant.
 * Base block: columns
 * Source: https://www.centurylink.com/home.html
 * Target: Columns block table — 1 row with 2 columns (one per pricing card)
 * Source selectors from captured DOM: #container-0520f0944c .aem-Grid > .container
 * The pricing section has two side-by-side card containers inside #container-5f28a85bd4
 */
export default function parse(element, { document }) {
  // The element matched is the pair of containers inside the hero area.
  // Each pricing card is a child container with plan info.
  // Find the pricing card wrapper: #container-5f28a85bd4
  const cardContainer = element.querySelector('#container-5f28a85bd4') || element;

  // Find the two column containers inside the pricing area
  // Each column has: speed badge images, plan name (bold text), features (ul), price (teaser), fine print
  const columns = cardContainer.querySelectorAll(':scope .aem-Grid > .container');

  // Build cells - one row with content from each column
  const row = [];

  if (columns.length >= 2) {
    // Two distinct pricing columns
    columns.forEach((col) => {
      const colContent = [];
      const imgs = col.querySelectorAll('img');
      const headings = col.querySelectorAll('.cmp-text b, .cmp-text h3, .cmp-text h2');
      const lists = col.querySelectorAll('.cmp-text ul');
      const prices = col.querySelectorAll('.cmp-teaser__pretitle');
      const fineprint = col.querySelectorAll('.cmp-text p');
      const buttons = col.querySelectorAll('a.cmp-button');

      imgs.forEach((img) => colContent.push(img));
      headings.forEach((h) => colContent.push(h));
      lists.forEach((ul) => colContent.push(ul));
      prices.forEach((p) => colContent.push(p));
      fineprint.forEach((fp) => {
        if (!fp.querySelector('b') && !fp.closest('ul')) colContent.push(fp);
      });
      buttons.forEach((btn) => colContent.push(btn));

      row.push(colContent);
    });
  } else {
    // Fallback: treat entire element as a single column
    row.push(element);
  }

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-pricing', cells });
  element.replaceWith(block);
}
