/**
 * TypeScript interfaces for unitfyi unit conversion engine.
 */

/** Definition of a single unit with its conversion factor. */
export interface UnitDef {
  name: string;
  symbol: string;
  category: string;
  toBase: number;
  description: string;
  aliases: string[];
}

/** Definition of a measurement category. */
export interface CategoryDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  baseUnit: string;
  order: number;
}

/** Result of a unit conversion. */
export interface ConversionResult {
  value: number;
  fromUnit: string;
  fromSymbol: string;
  fromName: string;
  toUnit: string;
  toSymbol: string;
  toName: string;
  result: number;
  formulaText: string;
  category: string;
  categoryName: string;
}

/** Information about a single unit. */
export interface UnitInfo {
  slug: string;
  name: string;
  symbol: string;
  category: string;
  description: string;
  aliases: string[];
}

/** Temperature conversion formula pair (to/from base unit Kelvin). */
export interface TemperatureFormula {
  toBase: (v: number) => number;
  fromBase: (k: number) => number;
}
