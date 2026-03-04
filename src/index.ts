/**
 * unitfyi -- Pure TypeScript unit conversion engine.
 *
 * Convert between 200 units across 20 measurement categories including
 * length, weight, temperature, volume, area, speed, time, data storage,
 * pressure, energy, frequency, force, power, angle, fuel economy,
 * data transfer, density, torque, cooking, and typography.
 *
 * Zero dependencies. Works in Node.js, Deno, Bun, and browsers.
 *
 * @example
 * ```ts
 * import { convert, getCategoryUnits, getOrderedCategories } from "unitfyi";
 *
 * const result = convert(100, "celsius", "fahrenheit");
 * console.log(result.result); // 212
 *
 * const lengthUnits = getCategoryUnits("length");
 * console.log(lengthUnits.length); // 20
 *
 * const categories = getOrderedCategories();
 * console.log(categories.length); // 20
 * ```
 *
 * @packageDocumentation
 */

// Types
export type {
  UnitDef,
  CategoryDef,
  ConversionResult,
  UnitInfo,
  TemperatureFormula,
} from "./types.js";

// Data
export { UNITS, CATEGORIES, FORMULAS } from "./data.js";

// Engine
export {
  convert,
  conversionTable,
  getCategoryUnits,
  getUnit,
  getOrderedCategories,
  IncompatibleUnitsError,
  UnknownUnitError,
} from "./engine.js";
