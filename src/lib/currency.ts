/**
 * Dynamic price formatter for multi-currency display.
 * Supports SAR (Gulf) and EGP (Egypt) with Arabic locale formatting.
 */

export type SupportedCurrency = "SAR" | "EGP" | "AED";

/**
 * Formats a numeric price into a localised Arabic currency string.
 *
 * @example
 * formatPrice(150, 'SAR')  →  "١٥٠ ر.س."
 * formatPrice(1500, 'EGP') →  "١٬٥٠٠ ج.م."
 */
export const formatPrice = (
  price: number,
  currency: SupportedCurrency
): string => {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Returns the correct price for a course based on the user's country code.
 * Extend this as more regions are added.
 *
 * @param priceSAR  - Gulf price in Saudi Riyals
 * @param priceEGP  - Egypt price in Egyptian Pounds
 * @param country   - User's country code stored on the User model (e.g. "KSA", "UAE", "EGY")
 */
export const getPriceForCountry = (
  priceSAR: number,
  priceEGP: number,
  country: string
): { amount: number; currency: SupportedCurrency } => {
  switch (country.toUpperCase()) {
    case "EGY":
      return { amount: priceEGP, currency: "EGP" };
    case "UAE":
      return { amount: priceSAR, currency: "AED" }; // parity with SAR for now
    case "KSA":
    default:
      return { amount: priceSAR, currency: "SAR" };
  }
};

/**
 * Convenience: returns a ready-to-display price string for a given country.
 *
 * @example
 * displayPrice(150, 1500, 'EGY') → "١٬٥٠٠ ج.م."
 */
export const displayPrice = (
  priceSAR: number,
  priceEGP: number,
  country: string
): string => {
  const { amount, currency } = getPriceForCountry(priceSAR, priceEGP, country);
  return formatPrice(amount, currency);
};
