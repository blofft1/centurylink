/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: CenturyLink cleanup.
 * Removes non-authorable content from CenturyLink pages.
 * Selectors from captured DOM of https://www.centurylink.com/home.html
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Cookie consent banner (OneTrust SDK)
    // Found: <div id="onetrust-consent-sdk">
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.onetrust-pc-dark-filter',
    ]);

    // IE browser popup
    // Found: <div class="ie-popup">
    WebImporter.DOMUtils.remove(element, ['.ie-popup']);

    // Info modals (overlays that block content parsing)
    // Found: <div class="infomodal-modal" id="info-1">
    WebImporter.DOMUtils.remove(element, ['.infomodal-modal']);

    // Cookie creation component
    // Found: <div class="createcookie ...">
    WebImporter.DOMUtils.remove(element, ['.createcookie']);

    // Empty embeds
    // Found: <div class="cmp-embed"></div>
    WebImporter.DOMUtils.remove(element, ['.cmp-embed:empty']);

    // Spacers and placeholders
    // Found: <div class="cmp-spacer">, <div class="cq-placeholder">
    WebImporter.DOMUtils.remove(element, ['.cmp-spacer', '.cq-placeholder']);
  }

  if (hookName === H.after) {
    // Header/navigation experience fragment
    // Found: <div id="experiencefragment-6cbc2985ac" class="cmp-experiencefragment cmp-experiencefragment--home-help-navigation">
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--home-help-navigation',
      '.vaporheader',
    ]);

    // Footer experience fragments
    // Found: <div class="cmp-experiencefragment cmp-experiencefragment--res-footer">
    WebImporter.DOMUtils.remove(element, ['.cmp-experiencefragment--res-footer']);

    // Mobile-only duplicate content (hidden on desktop)
    // Found: containers with aem-GridColumn--default--hide class
    const mobileOnly = element.querySelectorAll('[class*="aem-GridColumn--default--hide"]');
    mobileOnly.forEach((el) => {
      if (el.querySelector('h1') || el.querySelector('.cmp-button')) {
        el.remove();
      }
    });

    // Clean up link elements, noscript, iframes
    WebImporter.DOMUtils.remove(element, ['link', 'noscript', 'iframe']);

    // Remove empty env-run-mode div
    // Found: <div id="env-run-mode-setting">
    WebImporter.DOMUtils.remove(element, ['#env-run-mode-setting']);

    // Remove thumbsup icons inside buttons
    // Found: <div class="thumbsup-icon">
    WebImporter.DOMUtils.remove(element, ['.thumbsup-icon']);

    // Remove video overlay play icons
    // Found: <div class="play-icon">
    WebImporter.DOMUtils.remove(element, ['.play-icon', '.video-duration', '.video-overlay']);

    // Remove slideup teaser content (duplicate of main teaser content)
    // Found: <div class="cmp-teaser__content-slideup">
    WebImporter.DOMUtils.remove(element, ['.cmp-teaser__content-slideup']);
  }
}
