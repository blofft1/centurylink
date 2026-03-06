/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-speed variant.
 * Base block: hero
 * Source: https://www.centurylink.com/home.html
 * Target: Hero block table — row 1: background image, row 2: heading + subheading content
 * Source selectors from captured DOM: .cmp-container--bg-994124446
 */
export default function parse(element, { document }) {
  // Extract background image (direct child img of the hero container)
  // Found: <img src="./images/f399563a692ce99175dba3745f8ee0e8.png"> as first child
  const bgImage = element.querySelector(':scope > img');

  // Extract heading — Found: <h1> inside #text-ba388c3cd1
  const heading = element.querySelector('h1, h2');

  // Extract subheading paragraph — Found: <p> inside #text-b6fad195f3
  const subheading = element.querySelector('#container-0520f0944c p');

  const cells = [];

  // Row 1: Background image (optional)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading + subheading)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-speed', cells });
  element.replaceWith(block);
}
