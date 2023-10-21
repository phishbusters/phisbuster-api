import { Color, PDFFont, PDFPage } from 'pdf-lib';

export function drawTextWithLineBreaks(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  lineHeight: number,
  font: PDFFont,
  fontSize: number,
  color: Color,
) {
  page.drawText(text, {
    x,
    y,
    font: font,
    size: fontSize,
    maxWidth: 500,
    color: color,
    lineHeight: lineHeight,
  });
}
