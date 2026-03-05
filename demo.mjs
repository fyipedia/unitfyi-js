import { convert, getCategoryUnits } from './dist/index.js'

const C = { r: '\x1b[0m', b: '\x1b[1m', d: '\x1b[2m', y: '\x1b[33m', g: '\x1b[32m', c: '\x1b[36m' }

// 1. Distance
const km = convert(100, 'kilometer', 'mile')
console.log(`${C.b}${C.y}100 Kilometers → Miles${C.r}`)
console.log(`  ${C.c}Result ${C.r} ${C.b}${C.g}${km.result} ${km.toSymbol}${C.r}`)
console.log(`  ${C.c}Formula${C.r} ${C.d}${km.formulaText}${C.r}`)

console.log()

// 2. Temperature
const temp = convert(72, 'fahrenheit', 'celsius')
console.log(`${C.b}${C.y}72°F → Celsius${C.r}`)
console.log(`  ${C.c}Result ${C.r} ${C.b}${C.g}${temp.result}${temp.toSymbol}${C.r}`)
console.log(`  ${C.c}Formula${C.r} ${C.d}${temp.formulaText}${C.r}`)

console.log()

// 3. Category units
const lengthUnits = getCategoryUnits('length')
console.log(`${C.b}${C.y}Length Units ${C.d}(${lengthUnits.length} total)${C.r}`)
for (const u of lengthUnits.slice(0, 8)) {
  console.log(`  ${C.c}${u.symbol.padEnd(5)}${C.r} ${C.g}${u.name.padEnd(14)}${C.r} ${C.d}${u.description}${C.r}`)
}
console.log(`  ${C.d}...${C.r}`)
