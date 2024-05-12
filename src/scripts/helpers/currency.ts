export default function currency(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: getCurrency(locale),
  }).format(value);
}

const getCurrency = (currency: string): string => {
  switch (currency) {
    case 'en':
      return 'USD';
    case 'de':
      return 'EUR';
    case 'tr':
      return 'TRY';
    default:
      return 'TRY';
  }
};
