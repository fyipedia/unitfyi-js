/**
 * Unit conversion engine -- pure TypeScript, <1ms, zero dependencies.
 */

import type {
  ConversionResult,
  UnitInfo,
  CategoryDef,
  UnitDef,
} from "./types.js";
import { UNITS, CATEGORIES, FORMULAS } from "./data.js";

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class IncompatibleUnitsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IncompatibleUnitsError";
  }
}

export class UnknownUnitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnknownUnitError";
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Convert a value between two units.
 *
 * Supports both linear conversions (via numeric factors) and non-linear
 * conversions (temperature via function-based formulas).
 *
 * @param value - The numeric value to convert.
 * @param fromSlug - Source unit slug (e.g., "celsius", "kilometer").
 * @param toSlug - Target unit slug (e.g., "fahrenheit", "meter").
 * @returns ConversionResult with the converted value and metadata.
 * @throws {UnknownUnitError} If either unit slug is not found.
 * @throws {IncompatibleUnitsError} If units belong to different categories.
 */
export function convert(
  value: number,
  fromSlug: string,
  toSlug: string,
): ConversionResult {
  const fromUnit = UNITS[fromSlug];
  const toUnit = UNITS[toSlug];

  if (fromUnit === undefined) {
    throw new UnknownUnitError(`Unknown unit: ${fromSlug}`);
  }
  if (toUnit === undefined) {
    throw new UnknownUnitError(`Unknown unit: ${toSlug}`);
  }
  if (fromUnit.category !== toUnit.category) {
    throw new IncompatibleUnitsError(
      `Cannot convert ${fromSlug} (${fromUnit.category}) to ${toSlug} (${toUnit.category})`,
    );
  }

  const category = fromUnit.category;
  let result: number;

  if (category in FORMULAS) {
    // Non-linear conversion (temperature, etc.)
    const formulas = FORMULAS[category]!;
    const toBase = formulas[fromSlug]!.toBase;
    const fromBase = formulas[toSlug]!.fromBase;
    const baseValue = toBase(value);
    result = fromBase(baseValue);
  } else {
    // Linear conversion: result = value * (from_to_base / to_to_base)
    const baseValue = value * fromUnit.toBase;
    result = baseValue / toUnit.toBase;
  }

  result = smartRound(result);

  const formulaText = formatFormula(
    fromSlug,
    toSlug,
    fromUnit,
    toUnit,
    category,
  );

  const catDef = CATEGORIES[category];
  const categoryName = catDef ? catDef.name : category;

  return {
    value,
    fromUnit: fromSlug,
    fromSymbol: fromUnit.symbol,
    fromName: fromUnit.name,
    toUnit: toSlug,
    toSymbol: toUnit.symbol,
    toName: toUnit.name,
    result,
    formulaText,
    category,
    categoryName,
  };
}

/**
 * Generate a conversion table for a unit pair.
 *
 * @param fromSlug - Source unit slug.
 * @param toSlug - Target unit slug.
 * @param values - List of values to convert. Defaults to common values.
 * @returns Array of [inputValue, convertedValue] tuples.
 */
export function conversionTable(
  fromSlug: string,
  toSlug: string,
  values?: number[],
): [number, number][] {
  const vals = values ?? [1, 5, 10, 25, 50, 100, 250, 500, 1000];
  return vals.map((val) => {
    const r = convert(val, fromSlug, toSlug);
    return [val, r.result];
  });
}

/**
 * Get all units in a category.
 *
 * @param categorySlug - Category slug (e.g., "length", "temperature").
 * @returns Array of UnitInfo objects for all units in the category.
 */
export function getCategoryUnits(categorySlug: string): UnitInfo[] {
  const results: UnitInfo[] = [];
  for (const [slug, u] of Object.entries(UNITS)) {
    if (u.category === categorySlug) {
      results.push({
        slug,
        name: u.name,
        symbol: u.symbol,
        category: u.category,
        description: u.description,
        aliases: u.aliases,
      });
    }
  }
  return results;
}

/**
 * Get a single unit by slug.
 *
 * @param slug - Unit slug (e.g., "meter", "celsius").
 * @returns UnitInfo if found, null otherwise.
 */
export function getUnit(slug: string): UnitInfo | null {
  const u = UNITS[slug];
  if (u === undefined) {
    return null;
  }
  return {
    slug,
    name: u.name,
    symbol: u.symbol,
    category: u.category,
    description: u.description,
    aliases: u.aliases,
  };
}

/**
 * Get all categories sorted by display order.
 *
 * @returns Array of CategoryDef objects sorted by order field.
 */
export function getOrderedCategories(): CategoryDef[] {
  return Object.values(CATEGORIES).sort((a, b) => a.order - b.order);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Apply appropriate precision based on magnitude.
 */
function smartRound(value: number): number {
  const abs = Math.abs(value);
  if (abs === 0) return 0;
  if (abs >= 1000) return Math.round(value * 100) / 100;
  if (abs >= 1) return Math.round(value * 10000) / 10000;
  if (abs >= 0.01) return Math.round(value * 1000000) / 1000000;
  return Math.round(value * 10000000000) / 10000000000;
}

/**
 * Generate human-readable formula text.
 */
function formatFormula(
  fromSlug: string,
  toSlug: string,
  fromUnit: UnitDef,
  toUnit: UnitDef,
  category: string,
): string {
  if (category in FORMULAS) {
    if (category === "temperature") {
      return temperatureFormula(fromSlug, toSlug, fromUnit, toUnit);
    }
    return `1 ${fromUnit.symbol} \u2192 ${toUnit.symbol}`;
  }

  const factor = smartRound(fromUnit.toBase / toUnit.toBase);
  return `1 ${fromUnit.symbol} = ${factor} ${toUnit.symbol}`;
}

/**
 * Generate temperature conversion formula text.
 */
function temperatureFormula(
  fromSlug: string,
  toSlug: string,
  fromUnit: UnitDef,
  toUnit: UnitDef,
): string {
  const formulas: Record<string, string> = {
    "celsius:fahrenheit": "\u00b0F = (\u00b0C \u00d7 9/5) + 32",
    "fahrenheit:celsius": "\u00b0C = (\u00b0F \u2212 32) \u00d7 5/9",
    "celsius:kelvin": "K = \u00b0C + 273.15",
    "kelvin:celsius": "\u00b0C = K \u2212 273.15",
    "fahrenheit:kelvin": "K = (\u00b0F \u2212 32) \u00d7 5/9 + 273.15",
    "kelvin:fahrenheit": "\u00b0F = (K \u2212 273.15) \u00d7 9/5 + 32",
    "celsius:rankine": "\u00b0R = (\u00b0C + 273.15) \u00d7 9/5",
    "rankine:celsius": "\u00b0C = (\u00b0R \u00d7 5/9) \u2212 273.15",
    "fahrenheit:rankine": "\u00b0R = \u00b0F + 459.67",
    "rankine:fahrenheit": "\u00b0F = \u00b0R \u2212 459.67",
    "kelvin:rankine": "\u00b0R = K \u00d7 9/5",
    "rankine:kelvin": "K = \u00b0R \u00d7 5/9",
  };
  const key = `${fromSlug}:${toSlug}`;
  return formulas[key] ?? `1 ${fromUnit.symbol} \u2192 ${toUnit.symbol}`;
}
