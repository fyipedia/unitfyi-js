# unitfyi

[![npm](https://img.shields.io/npm/v/unitfyi)](https://www.npmjs.com/package/unitfyi)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/unitfyi)

Pure TypeScript unit conversion engine for developers. [Convert between 200 units](https://unitfyi.com/) across 20 measurement categories including length, weight, temperature, volume, area, speed, time, data storage, pressure, energy, frequency, force, power, angle, fuel economy, data transfer, density, torque, cooking, and typography -- all with zero dependencies.

> **Try the interactive tools at [unitfyi.com](https://unitfyi.com/)** -- unit converter, conversion tables, and category explorer.

<p align="center">
  <img src="demo.gif" alt="unitfyi demo — unit conversion with precision" width="800">
</p>

## Table of Contents

- [Install](#install)
- [Quick Start](#quick-start)
- [What You Can Do](#what-you-can-do)
  - [Precision in Unit Conversion](#precision-in-unit-conversion)
  - [Temperature Conversion](#temperature-conversion)
  - [Conversion Tables](#conversion-tables)
  - [Unit Lookup](#unit-lookup)
- [API Reference](#api-reference)
- [TypeScript Types](#typescript-types)
- [Features](#features)
- [Learn More About Units](#learn-more-about-units)
- [Also Available for Python](#also-available-for-python)
- [FYIPedia Developer Tools](#fyipedia-developer-tools)
- [License](#license)

## Install

```bash
npm install unitfyi
```

Works in Node.js, Deno, Bun, and browsers (ESM).

## Quick Start

```typescript
import { convert, conversionTable, getCategoryUnits, getOrderedCategories } from "unitfyi";

// Convert between any compatible units
const temp = convert(100, "celsius", "fahrenheit");
console.log(temp.result);        // 212
console.log(temp.formulaText);   // "°F = (°C × 9/5) + 32"

const length = convert(1, "mile", "kilometer");
console.log(length.result);      // 1.6093
console.log(length.fromSymbol);  // "mi"
console.log(length.toSymbol);    // "km"

// Generate a conversion table
const table = conversionTable("kilogram", "pound");
// [[1, 2.2046], [5, 11.0231], [10, 22.0462], ...]

// Browse categories and units
const categories = getOrderedCategories();
console.log(categories.length);  // 20

const lengthUnits = getCategoryUnits("length");
console.log(lengthUnits.length); // 20 (meter, km, cm, mm, ...)
```

## What You Can Do

### Precision in Unit Conversion

JavaScript uses IEEE 754 double-precision floats. For most unit conversions this is sufficient, but temperature and very large/small values use smart rounding to avoid floating-point artifacts like `99.99999999996`.

The engine applies magnitude-aware rounding:

| Magnitude | Precision | Example |
|-----------|-----------|---------|
| >= 1,000 | 2 decimal places | 5,280.00 |
| >= 1 | 4 decimal places | 1.6093 |
| >= 0.01 | 6 decimal places | 0.453592 |
| < 0.01 | 10 decimal places | 0.0000000001 |

Temperature conversions use function-based formulas (not linear factors) to maintain exact results: `°F = (°C * 9/5) + 32`, `K = °C + 273.15`, etc.

The engine covers **20 measurement categories** with a total of **200 units**:

| Category | Units | Examples |
|----------|-------|---------|
| **Length** | 20 | meter, kilometer, mile, foot, inch, yard, nautical mile, ... |
| **Weight** | 15 | kilogram, pound, ounce, gram, stone, metric ton, ... |
| **Temperature** | 4 | Celsius, Fahrenheit, Kelvin, Rankine |
| **Volume** | 15 | liter, gallon (US/UK), cup, tablespoon, fluid ounce, ... |
| **Area** | 10 | square meter, acre, hectare, square foot, ... |
| **Speed** | 8 | km/h, mph, m/s, knot, Mach, speed of light, ... |
| **Data Storage** | 16 | byte, KB, MB, GB, TB, PB, KiB, MiB, GiB, ... |
| **Pressure** | 8 | pascal, bar, atm, psi, mmHg, torr, ... |
| **Energy** | 10 | joule, calorie, kWh, BTU, eV, ... |
| **Cooking** | 8 | cup, tablespoon, teaspoon, fluid ounce, ... |

Learn more: [Unit Converter](https://unitfyi.com/) · [SI Base Units](https://en.wikipedia.org/wiki/International_System_of_Units) · [Category Explorer](https://unitfyi.com/category/)

### Temperature Conversion

```typescript
import { convert } from "unitfyi";

// All temperature conversions use exact formulas (not linear approximation)
const c2f = convert(0, "celsius", "fahrenheit");
console.log(c2f.result);        // 32
console.log(c2f.formulaText);   // "°F = (°C × 9/5) + 32"

const f2c = convert(72, "fahrenheit", "celsius");
console.log(f2c.result);        // 22.2222

const c2k = convert(-40, "celsius", "kelvin");
console.log(c2k.result);        // 233.15

// Rankine scale also supported
const f2r = convert(100, "fahrenheit", "rankine");
console.log(f2r.result);        // 559.67
```

Learn more: [Temperature Converter](https://unitfyi.com/category/temperature/) · [Absolute Zero](https://en.wikipedia.org/wiki/Absolute_zero)

### Conversion Tables

```typescript
import { conversionTable } from "unitfyi";

// Default values: [1, 5, 10, 25, 50, 100, 250, 500, 1000]
const table = conversionTable("meter", "foot");
for (const [meters, feet] of table) {
  console.log(`${meters} m = ${feet} ft`);
}

// Custom values
const custom = conversionTable("celsius", "fahrenheit", [0, 20, 37, 100]);
// [[0, 32], [20, 68], [37, 98.6], [100, 212]]
```

Learn more: [Conversion Tables](https://unitfyi.com/tools/table/) · [REST API Docs](https://unitfyi.com/developers/)

### Unit Lookup

```typescript
import { getUnit, getCategoryUnits, getOrderedCategories } from "unitfyi";

// Look up a single unit
const meter = getUnit("meter");
console.log(meter?.name);         // "Meter"
console.log(meter?.symbol);       // "m"
console.log(meter?.category);     // "length"
console.log(meter?.aliases);      // ["metre", "meters", "metres"]

// List all units in a category
const tempUnits = getCategoryUnits("temperature");
// [{ slug: "celsius", name: "Celsius", symbol: "°C", ... }, ...]

// Get all 20 categories sorted by display order
const cats = getOrderedCategories();
for (const cat of cats) {
  console.log(`${cat.icon} ${cat.name}: ${cat.description}`);
}
```

Learn more: [All Units](https://unitfyi.com/unit/) · [OpenAPI Spec](https://unitfyi.com/api/openapi.json)

## API Reference

### Conversion

| Function | Description |
|----------|-------------|
| `convert(value, fromSlug, toSlug) -> ConversionResult` | Convert a value between two compatible units |
| `conversionTable(fromSlug, toSlug, values?) -> [number, number][]` | Generate a conversion table for a unit pair |

### Unit Lookup

| Function | Description |
|----------|-------------|
| `getUnit(slug) -> UnitInfo \| null` | Look up a unit by slug |
| `getCategoryUnits(categorySlug) -> UnitInfo[]` | Get all units in a category |
| `getOrderedCategories() -> CategoryDef[]` | Get all 20 categories sorted by display order |

### Error Classes

| Class | Description |
|-------|-------------|
| `UnknownUnitError` | Thrown when a unit slug is not found |
| `IncompatibleUnitsError` | Thrown when converting between different categories |

### Data Exports

| Export | Description |
|--------|-------------|
| `UNITS` | Record of all 200 unit definitions |
| `CATEGORIES` | Record of all 20 category definitions |
| `FORMULAS` | Non-linear conversion formulas (temperature) |

## TypeScript Types

```typescript
import type {
  UnitDef,
  CategoryDef,
  ConversionResult,
  UnitInfo,
  TemperatureFormula,
} from "unitfyi";
```

## Features

- **200 units**: Across 20 measurement categories
- **20 categories**: Length, weight, temperature, volume, area, speed, time, data storage, pressure, energy, frequency, force, power, angle, fuel economy, data transfer, density, torque, cooking, typography
- **Temperature formulas**: Exact function-based conversion (Celsius, Fahrenheit, Kelvin, Rankine)
- **Smart rounding**: Magnitude-aware precision to avoid floating-point artifacts
- **Conversion tables**: Generate value tables for any unit pair
- **Human-readable formulas**: Each conversion includes a formula string (e.g., "1 mi = 1.6093 km")
- **Unit aliases**: Search-friendly aliases (e.g., "metre", "meters", "metres" all find Meter)
- **Zero dependencies**: Pure TypeScript, no runtime deps
- **Type-safe**: Full TypeScript with strict mode
- **Tree-shakeable**: ESM with named exports
- **Fast**: All computations under 1ms

## Learn More About Units

- **Tools**: [Unit Converter](https://unitfyi.com/) · [Conversion Tables](https://unitfyi.com/tools/table/)
- **Browse**: [Categories](https://unitfyi.com/category/) · [All Units](https://unitfyi.com/unit/)
- **API**: [REST API Docs](https://unitfyi.com/developers/) · [OpenAPI Spec](https://unitfyi.com/api/openapi.json)
- **Python**: [PyPI Package](https://pypi.org/project/unitfyi/)

## Also Available for Python

```bash
pip install unitfyi
```

See the [Python package on PyPI](https://pypi.org/project/unitfyi/).

## FYIPedia Developer Tools

Part of the [FYIPedia](https://fyipedia.com) open-source developer tools ecosystem.

| Package | PyPI | npm | Description |
|---------|------|-----|-------------|
| colorfyi | [PyPI](https://pypi.org/project/colorfyi/) | [npm](https://www.npmjs.com/package/@fyipedia/colorfyi) | Color conversion, WCAG contrast, harmonies -- [colorfyi.com](https://colorfyi.com/) |
| emojifyi | [PyPI](https://pypi.org/project/emojifyi/) | [npm](https://www.npmjs.com/package/emojifyi) | Emoji encoding & metadata for 3,953 emojis -- [emojifyi.com](https://emojifyi.com/) |
| symbolfyi | [PyPI](https://pypi.org/project/symbolfyi/) | [npm](https://www.npmjs.com/package/symbolfyi) | Symbol encoding in 11 formats -- [symbolfyi.com](https://symbolfyi.com/) |
| unicodefyi | [PyPI](https://pypi.org/project/unicodefyi/) | [npm](https://www.npmjs.com/package/unicodefyi) | Unicode lookup with 17 encodings -- [unicodefyi.com](https://unicodefyi.com/) |
| fontfyi | [PyPI](https://pypi.org/project/fontfyi/) | [npm](https://www.npmjs.com/package/fontfyi) | Google Fonts metadata & CSS -- [fontfyi.com](https://fontfyi.com/) |
| distancefyi | [PyPI](https://pypi.org/project/distancefyi/) | [npm](https://www.npmjs.com/package/distancefyi) | Haversine distance & travel times -- [distancefyi.com](https://distancefyi.com/) |
| timefyi | [PyPI](https://pypi.org/project/timefyi/) | [npm](https://www.npmjs.com/package/timefyi) | Timezone ops & business hours -- [timefyi.com](https://timefyi.com/) |
| namefyi | [PyPI](https://pypi.org/project/namefyi/) | [npm](https://www.npmjs.com/package/namefyi) | Korean romanization & Five Elements -- [namefyi.com](https://namefyi.com/) |
| **unitfyi** | [PyPI](https://pypi.org/project/unitfyi/) | [npm](https://www.npmjs.com/package/unitfyi) | Unit conversion, 220 units -- [unitfyi.com](https://unitfyi.com/) |
| holidayfyi | [PyPI](https://pypi.org/project/holidayfyi/) | [npm](https://www.npmjs.com/package/holidayfyi) | Holiday dates & Easter calculation -- [holidayfyi.com](https://holidayfyi.com/) |
| cocktailfyi | [PyPI](https://pypi.org/project/cocktailfyi/) | -- | Cocktail ABV, calories, flavor -- [cocktailfyi.com](https://cocktailfyi.com/) |
| fyipedia | [PyPI](https://pypi.org/project/fyipedia/) | -- | Unified CLI: `fyi color info FF6B35` -- [fyipedia.com](https://fyipedia.com/) |
| fyipedia-mcp | [PyPI](https://pypi.org/project/fyipedia-mcp/) | -- | Unified MCP hub for AI assistants -- [fyipedia.com](https://fyipedia.com/) |

## License

MIT
