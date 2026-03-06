export default function decorate(block) {
  const rows = [...block.children];

  // Row 1: Background image
  const bgRow = rows[0];
  const bgPicture = bgRow?.querySelector('picture');
  if (bgPicture) {
    bgPicture.classList.add('hero-speed-bg');
    block.prepend(bgPicture);
    bgRow.remove();
  } else {
    block.classList.add('no-image');
  }

  // Row 2: Heading content (title + subtitle)
  const headingRow = block.querySelector(':scope > div');
  if (headingRow) {
    headingRow.classList.add('hero-speed-heading');
  }

  // Row 3: Offer cards (2-column)
  const offersRow = block.querySelector(':scope > div:nth-child(3)');
  if (offersRow) {
    offersRow.classList.add('hero-speed-offers');
    const cards = [...offersRow.children];
    cards.forEach((card) => {
      card.classList.add('hero-speed-card');

      // Find price: paragraph containing a <sup> or $ symbol
      const paragraphs = [...card.querySelectorAll('p')];
      paragraphs.forEach((p) => {
        if (p.querySelector('sup') || /^\$\d/.test(p.textContent.trim())) {
          p.classList.add('hero-speed-price');
        }
      });

      // Last paragraph (after price) is fine print
      const lastP = paragraphs[paragraphs.length - 1];
      if (lastP && !lastP.classList.contains('hero-speed-price')) {
        lastP.classList.add('hero-speed-fine-print');
      }
    });
  }
}
