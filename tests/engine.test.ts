import { describe, it, expect } from "vitest";
import {
  convert,
  conversionTable,
  getCategoryUnits,
  getUnit,
  getOrderedCategories,
  IncompatibleUnitsError,
  UnknownUnitError,
  UNITS,
  CATEGORIES,
} from "../src/index.js";

// ---------------------------------------------------------------------------
// Data integrity
// ---------------------------------------------------------------------------

describe("data integrity", () => {
  it("has 200 units", () => {
    expect(Object.keys(UNITS).length).toBe(200);
  });

  it("has 20 categories", () => {
    expect(Object.keys(CATEGORIES).length).toBe(20);
  });

  it("every unit references a valid category", () => {
    for (const [slug, unit] of Object.entries(UNITS)) {
      expect(
        CATEGORIES[unit.category],
        `Unit ${slug} references unknown category ${unit.category}`,
      ).toBeDefined();
    }
  });

  it("every category base unit exists in UNITS", () => {
    for (const [slug, cat] of Object.entries(CATEGORIES)) {
      expect(
        UNITS[cat.baseUnit],
        `Category ${slug} references unknown base unit ${cat.baseUnit}`,
      ).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// Linear conversions
// ---------------------------------------------------------------------------

describe("convert - linear", () => {
  it("meter to kilometer", () => {
    const r = convert(1000, "meter", "kilometer");
    expect(r.result).toBe(1);
    expect(r.fromUnit).toBe("meter");
    expect(r.toUnit).toBe("kilometer");
    expect(r.category).toBe("length");
  });

  it("kilometer to meter", () => {
    const r = convert(1, "kilometer", "meter");
    expect(r.result).toBe(1000);
  });

  it("mile to kilometer", () => {
    const r = convert(1, "mile", "kilometer");
    expect(r.result).toBeCloseTo(1.609344, 4);
  });

  it("pound to kilogram", () => {
    const r = convert(1, "pound", "kilogram");
    expect(r.result).toBeCloseTo(0.4536, 3);
  });

  it("kilogram to pound", () => {
    const r = convert(1, "kilogram", "pound");
    expect(r.result).toBeCloseTo(2.2046, 3);
  });

  it("inch to centimeter", () => {
    const r = convert(1, "inch", "centimeter");
    expect(r.result).toBeCloseTo(2.54, 4);
  });

  it("liter to gallon-us", () => {
    const r = convert(1, "liter", "gallon-us");
    expect(r.result).toBeCloseTo(0.2642, 3);
  });

  it("hour to minute", () => {
    const r = convert(1, "hour", "minute");
    expect(r.result).toBe(60);
  });

  it("day to hour", () => {
    const r = convert(1, "day", "hour");
    expect(r.result).toBe(24);
  });

  it("gigabyte to megabyte", () => {
    const r = convert(1, "gigabyte", "megabyte");
    expect(r.result).toBe(1000);
  });

  it("atmosphere to psi", () => {
    const r = convert(1, "atmosphere", "psi");
    expect(r.result).toBeCloseTo(14.696, 2);
  });

  it("kilocalorie to joule", () => {
    const r = convert(1, "kilocalorie", "joule");
    expect(r.result).toBe(4184);
  });

  it("horsepower to watt", () => {
    const r = convert(1, "horsepower", "watt");
    expect(r.result).toBeCloseTo(745.7, 0);
  });

  it("degree to radian", () => {
    const r = convert(180, "degree", "radian");
    expect(r.result).toBeCloseTo(Math.PI, 4);
  });

  it("megabit-per-second to megabyte-per-second", () => {
    const r = convert(100, "megabit-per-second", "megabyte-per-second");
    expect(r.result).toBeCloseTo(12.5, 4);
  });

  it("same unit returns same value", () => {
    const r = convert(42, "meter", "meter");
    expect(r.result).toBe(42);
  });

  it("formula text for linear units", () => {
    const r = convert(1, "kilometer", "meter");
    expect(r.formulaText).toBe("1 km = 1000 m");
  });

  it("cooking teaspoon to tablespoon", () => {
    const r = convert(3, "cooking-teaspoon", "cooking-tablespoon");
    expect(r.result).toBeCloseTo(1, 1);
  });

  it("pixel to point", () => {
    const r = convert(16, "pixel", "point");
    expect(r.result).toBeCloseTo(12, 1);
  });

  it("newton-meter to foot-pound-force", () => {
    const r = convert(1, "newton-meter", "foot-pound-force");
    expect(r.result).toBeCloseTo(0.7376, 3);
  });
});

// ---------------------------------------------------------------------------
// Temperature conversions
// ---------------------------------------------------------------------------

describe("convert - temperature", () => {
  it("celsius to fahrenheit (0)", () => {
    const r = convert(0, "celsius", "fahrenheit");
    expect(r.result).toBe(32);
  });

  it("celsius to fahrenheit (100)", () => {
    const r = convert(100, "celsius", "fahrenheit");
    expect(r.result).toBe(212);
  });

  it("fahrenheit to celsius (32)", () => {
    const r = convert(32, "fahrenheit", "celsius");
    expect(r.result).toBe(0);
  });

  it("fahrenheit to celsius (212)", () => {
    const r = convert(212, "fahrenheit", "celsius");
    expect(r.result).toBe(100);
  });

  it("celsius to kelvin", () => {
    const r = convert(0, "celsius", "kelvin");
    expect(r.result).toBe(273.15);
  });

  it("kelvin to celsius", () => {
    const r = convert(273.15, "kelvin", "celsius");
    expect(r.result).toBe(0);
  });

  it("fahrenheit to kelvin", () => {
    const r = convert(32, "fahrenheit", "kelvin");
    expect(r.result).toBeCloseTo(273.15, 2);
  });

  it("celsius to rankine", () => {
    const r = convert(0, "celsius", "rankine");
    expect(r.result).toBeCloseTo(491.67, 1);
  });

  it("rankine to fahrenheit", () => {
    const r = convert(491.67, "rankine", "fahrenheit");
    expect(r.result).toBe(32);
  });

  it("formula text for temperature", () => {
    const r = convert(0, "celsius", "fahrenheit");
    expect(r.formulaText).toBe("\u00b0F = (\u00b0C \u00d7 9/5) + 32");
  });

  it("same temperature unit returns same value", () => {
    const r = convert(100, "celsius", "celsius");
    expect(r.result).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

describe("convert - errors", () => {
  it("throws UnknownUnitError for unknown from unit", () => {
    expect(() => convert(1, "nonexistent", "meter")).toThrow(UnknownUnitError);
  });

  it("throws UnknownUnitError for unknown to unit", () => {
    expect(() => convert(1, "meter", "nonexistent")).toThrow(UnknownUnitError);
  });

  it("throws IncompatibleUnitsError for different categories", () => {
    expect(() => convert(1, "meter", "kilogram")).toThrow(
      IncompatibleUnitsError,
    );
  });

  it("error message includes unit slugs", () => {
    try {
      convert(1, "meter", "kilogram");
    } catch (e) {
      expect((e as Error).message).toContain("meter");
      expect((e as Error).message).toContain("kilogram");
    }
  });
});

// ---------------------------------------------------------------------------
// conversionTable
// ---------------------------------------------------------------------------

describe("conversionTable", () => {
  it("returns default 9 rows", () => {
    const table = conversionTable("meter", "foot");
    expect(table.length).toBe(9);
    expect(table[0]![0]).toBe(1);
    expect(table[0]![1]).toBeCloseTo(3.2808, 3);
  });

  it("accepts custom values", () => {
    const table = conversionTable("celsius", "fahrenheit", [0, 100]);
    expect(table.length).toBe(2);
    expect(table[0]).toEqual([0, 32]);
    expect(table[1]).toEqual([100, 212]);
  });
});

// ---------------------------------------------------------------------------
// getCategoryUnits
// ---------------------------------------------------------------------------

describe("getCategoryUnits", () => {
  it("returns 20 length units", () => {
    const units = getCategoryUnits("length");
    expect(units.length).toBe(20);
    const slugs = units.map((u) => u.slug);
    expect(slugs).toContain("meter");
    expect(slugs).toContain("mile");
    expect(slugs).toContain("inch");
  });

  it("returns 4 temperature units", () => {
    const units = getCategoryUnits("temperature");
    expect(units.length).toBe(4);
  });

  it("returns empty array for unknown category", () => {
    const units = getCategoryUnits("nonexistent");
    expect(units.length).toBe(0);
  });

  it("unit info has correct fields", () => {
    const units = getCategoryUnits("length");
    const meter = units.find((u) => u.slug === "meter")!;
    expect(meter.name).toBe("Meter");
    expect(meter.symbol).toBe("m");
    expect(meter.category).toBe("length");
    expect(meter.description).toBeTruthy();
    expect(Array.isArray(meter.aliases)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// getUnit
// ---------------------------------------------------------------------------

describe("getUnit", () => {
  it("returns unit info for valid slug", () => {
    const unit = getUnit("celsius");
    expect(unit).not.toBeNull();
    expect(unit!.name).toBe("Celsius");
    expect(unit!.symbol).toBe("\u00b0C");
    expect(unit!.category).toBe("temperature");
  });

  it("returns null for unknown slug", () => {
    expect(getUnit("nonexistent")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getOrderedCategories
// ---------------------------------------------------------------------------

describe("getOrderedCategories", () => {
  it("returns 20 categories", () => {
    const cats = getOrderedCategories();
    expect(cats.length).toBe(20);
  });

  it("first category is length (order=1)", () => {
    const cats = getOrderedCategories();
    expect(cats[0]!.slug).toBe("length");
    expect(cats[0]!.order).toBe(1);
  });

  it("last category is typography (order=20)", () => {
    const cats = getOrderedCategories();
    expect(cats[19]!.slug).toBe("typography");
    expect(cats[19]!.order).toBe(20);
  });

  it("categories are sorted by order", () => {
    const cats = getOrderedCategories();
    for (let i = 1; i < cats.length; i++) {
      expect(cats[i]!.order).toBeGreaterThan(cats[i - 1]!.order);
    }
  });

  it("each category has required fields", () => {
    const cats = getOrderedCategories();
    for (const cat of cats) {
      expect(cat.slug).toBeTruthy();
      expect(cat.name).toBeTruthy();
      expect(cat.icon).toBeTruthy();
      expect(cat.description).toBeTruthy();
      expect(cat.baseUnit).toBeTruthy();
      expect(typeof cat.order).toBe("number");
    }
  });
});

// ---------------------------------------------------------------------------
// Smart rounding
// ---------------------------------------------------------------------------

describe("smart rounding", () => {
  it("large values round to 2 decimals", () => {
    const r = convert(1, "mile", "meter");
    // 1609.344 -- should keep 2 decimals
    expect(r.result).toBe(1609.34);
  });

  it("medium values round to 4 decimals", () => {
    const r = convert(1, "foot", "meter");
    // 0.3048 -- should keep 4 decimals
    expect(r.result).toBe(0.3048);
  });

  it("small values keep more precision", () => {
    const r = convert(1, "inch", "kilometer");
    // 0.0000254 -- should keep high precision
    expect(r.result).toBe(0.0000254);
  });
});
