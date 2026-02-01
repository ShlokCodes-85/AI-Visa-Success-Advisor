// Currency data with flags and symbols
export const currencyData = {
  USD: { flag: "🇺🇸", symbol: "$", name: "US Dollar" },
  EUR: { flag: "🇪🇺", symbol: "€", name: "Euro" },
  GBP: { flag: "🇬🇧", symbol: "£", name: "British Pound" },
  CAD: { flag: "🇨🇦", symbol: "C$", name: "Canadian Dollar" },
  AUD: { flag: "🇦🇺", symbol: "A$", name: "Australian Dollar" },
  NZD: { flag: "🇳🇿", symbol: "NZ$", name: "New Zealand Dollar" },
  SGD: { flag: "🇸🇬", symbol: "S$", name: "Singapore Dollar" },
  JPY: { flag: "🇯🇵", symbol: "¥", name: "Japanese Yen" },
  KRW: { flag: "🇰🇷", symbol: "₩", name: "South Korean Won" },
  SEK: { flag: "🇸🇪", symbol: "kr", name: "Swedish Krona" },
  DKK: { flag: "🇩🇰", symbol: "kr", name: "Danish Krone" },
  NOK: { flag: "🇳🇴", symbol: "kr", name: "Norwegian Krone" },
  CHF: { flag: "🇨🇭", symbol: "CHF", name: "Swiss Franc" },
  INR: { flag: "🇮🇳", symbol: "₹", name: "Indian Rupee" },
  AED: { flag: "🇦🇪", symbol: "د.إ", name: "UAE Dirham" },
  SGP: { flag: "🇵🇭", symbol: "₱", name: "Philippine Peso" },
};

// Get all currencies
export const getAllCurrencies = () => {
  return Object.keys(currencyData).sort();
};

// Get currency details
export const getCurrencyDetails = (currencyCode) => {
  return currencyData[currencyCode] || null;
};

// Get currency symbol with flag
export const getCurrencyDisplay = (currencyCode) => {
  const details = currencyData[currencyCode];
  return details ? `${details.flag} ${currencyCode}` : currencyCode;
};

// Format amount with currency symbol
export const formatAmountWithCurrency = (amount, currencyCode) => {
  if (!amount || !currencyCode) return "";
  const details = currencyData[currencyCode];
  if (!details) return `${amount} ${currencyCode}`;
  return `${details.symbol}${amount}`;
};

// Format amount with currency code and symbol for LLM
export const formatAmountWithFullCurrency = (amount, currencyCode) => {
  if (!amount || !currencyCode) return "";
  const details = currencyData[currencyCode];
  if (!details) return `${amount} ${currencyCode}`;
  return `${details.symbol}${amount} ${currencyCode}`;
};
