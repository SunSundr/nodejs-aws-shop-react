import { AvailableProduct } from '~/models/Product';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatAsPrice = (price: number) => priceFormatter.format(price);

export function sortProductsById(products: AvailableProduct[]): AvailableProduct[] {
  return products.sort((a, b) => {
    if (a.id === undefined) return 1;
    if (b.id === undefined) return -1;
    return a.id.localeCompare(b.id);
  });
}

export function formatLastSpace(text: string): string {
  const lastSpaceIndex = text.lastIndexOf(' ');

  if (lastSpaceIndex !== -1) {
    const lastWord = text.slice(lastSpaceIndex + 1);

    if (lastWord.length <= 5) {
      return text.slice(0, lastSpaceIndex) + '\u00A0' + text.slice(lastSpaceIndex + 1);
    }
  }

  return text;
}

export function truncateDescription(text: string, maxLength = 140): string {
  const sentenceEndRegex = /[.!?]\s+/;
  const sentenceEndMatch = text.match(sentenceEndRegex);

  let truncatedText = text;
  let ellipsis = false;

  if (sentenceEndMatch) {
    const firstSentenceEndIndex = sentenceEndMatch.index! + sentenceEndMatch[0].length;
    truncatedText = text.slice(0, firstSentenceEndIndex).trim();
  }

  if (truncatedText.length > maxLength) {
    truncatedText = truncatedText.slice(0, maxLength).trim();

    const lastSentenceEndIndex = truncatedText.search(/[.!?]/);

    if (lastSentenceEndIndex !== -1) {
      truncatedText = truncatedText.slice(0, lastSentenceEndIndex + 1);
    } else {
      ellipsis = true;
    }
  }

  const formattedText = formatLastSpace(truncatedText);
  return formattedText + (ellipsis ? '...' : '');
}
