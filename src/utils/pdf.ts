import { Color, PDFFont, PDFPage } from 'pdf-lib';

export function drawTextWithLineBreaks(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  font: PDFFont,
  fontSize: number,
  color: Color,
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (const word of words) {
    const testLine = line + word + ' ';
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth && line !== '') {
      page.drawText(line, { x, y: currentY, font, size: fontSize, color });
      line = word + ' ';
      currentY -= lineHeight;
    } else {
      line = testLine;
    }
  }

  page.drawText(line, { x, y: currentY, font, size: fontSize, color });
}
