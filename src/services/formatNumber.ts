export default function formatNumber(number: number) {
  return new Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 3 }).format(
    number,
  );
}
