/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-promo variant.
 * Base block: columns
 * Source: https://www.centurylink.com/home.html
 * Target: Columns block table — 1 row with 2 columns: [text+CTA | image] or [image | text+CTA]
 * Source selectors from captured DOM:
 *   - #container-06730e7ef7 (Moving section: image left, text right)
 *   - #container-2e3e345215 (referenced as text column for moving)
 * The promo sections have two side-by-side areas: one with text/heading/CTA, one with image
 * Section 8 (Referral): text left + image right
 * Section 9 (Moving): image left + text right (inside #container-06730e7ef7)
 */
export default function parse(element, { document }) {
  // Find the image and text content areas
  // Pattern: element contains .image (with picture/img) and .container (with text/buttons)
  const imageEl = element.querySelector('.image img, picture img');
  const textContainer = element.querySelector('.container .cmp-container') || element;

  // Extract text content
  const headings = textContainer.querySelectorAll('h1, h2, h3');
  const paragraphs = textContainer.querySelectorAll('.cmp-text p');
  const buttons = textContainer.querySelectorAll('a.cmp-button');
  const teasers = textContainer.querySelectorAll('.cmp-teaser__description');

  // Build text column content
  const textContent = [];
  headings.forEach((h) => textContent.push(h));
  paragraphs.forEach((p) => textContent.push(p));
  teasers.forEach((t) => textContent.push(t));
  buttons.forEach((btn) => textContent.push(btn));

  // Build image column content
  const imageContent = imageEl ? [imageEl] : [];

  // Determine column order based on DOM order
  // Check if image appears before text content in the DOM
  const firstImage = element.querySelector('.image');
  const firstText = element.querySelector('.container .cmp-text, .container h2');

  let row;
  if (firstImage && firstText && firstImage.compareDocumentPosition(firstText) & Node.DOCUMENT_POSITION_FOLLOWING) {
    // Image comes first in DOM (e.g., Moving section)
    row = [imageContent, textContent];
  } else {
    // Text comes first in DOM (e.g., Referral section)
    row = [textContent, imageContent];
  }

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
