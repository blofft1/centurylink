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

  // Re-query rows after bg extraction
  const contentRows = [...block.querySelectorAll(':scope > div')];

  // Row 2: Heading content (title + subtitle)
  const headingRow = contentRows[0];
  if (headingRow) {
    headingRow.classList.add('hero-speed-heading');
  }

  // Row 3: Offer images (separate image-only row for DA authoring)
  // Row 4: Offer text content (title + features + price + fine print)
  const imagesRow = contentRows[1];
  const textRow = contentRows[2];

  if (textRow) {
    // Merge: prepend each image from Row 3 into matching Row 4 cell
    const imageCells = [...(imagesRow?.children || [])];
    const textCells = [...textRow.children];

    textCells.forEach((card, i) => {
      card.classList.add('hero-speed-card');

      // Prepend the corresponding image from the images row
      const imgCell = imageCells[i];
      if (imgCell) {
        const pic = imgCell.querySelector('picture');
        if (pic) card.prepend(pic);
      }

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

    // Remove the now-empty images row
    if (imagesRow) imagesRow.remove();

    // Restyle the text row as the offers container
    textRow.classList.add('hero-speed-offers');
  } else if (imagesRow) {
    // Fallback: only 3 rows (old format with mixed image+text cells)
    imagesRow.classList.add('hero-speed-offers');
    const cards = [...imagesRow.children];
    cards.forEach((card) => {
      card.classList.add('hero-speed-card');

      const paragraphs = [...card.querySelectorAll('p')];
      paragraphs.forEach((p) => {
        if (p.querySelector('sup') || /^\$\d/.test(p.textContent.trim())) {
          p.classList.add('hero-speed-price');
        }
      });

      const lastP = paragraphs[paragraphs.length - 1];
      if (lastP && !lastP.classList.contains('hero-speed-price')) {
        lastP.classList.add('hero-speed-fine-print');
      }
    });
  }
}
