const ALLOWED_ROOTS = ['volumes', 'dexs', 'options', 'derivatives', 'incentives', 'fees', 'options', 'protocols', 'aggregators','aggregator-derivatives','bridge-aggregators', 'open-interest']
const MODIFIED = parse(process.env.MODIFIED)
const ADDED = parse(process.env.ADDED)
const fileSet = new Set();

[...MODIFIED, ...ADDED].forEach(file => {
  // Skip markdown documentation files (e.g., GUIDELINES.md)
  if (file.endsWith('.md')) return;
  
  const [root, adapter] = file.split('/')
  if (ALLOWED_ROOTS.includes(root) && adapter !== undefined)
    fileSet.add(`${root}@${adapter}`)
})

console.log(JSON.stringify([...fileSet]))

function parse(data) {
  if (!data) return []
  // The file-changes action emits a JSON array. Parse it properly so quote
  // characters never leak into the paths (the previous string surgery kept
  // the quotes inside each entry). The lenient fallback below tolerates a
  // bare comma- or space-separated list.
  try {
    const parsed = JSON.parse(data)
    if (Array.isArray(parsed)) return parsed.map((f) => String(f).trim()).filter(Boolean)
  } catch (e) {
    // not strict JSON: fall through to lenient parsing
  }
  return data
    .replace(/[\[\]"]/g, '')
    .split(/[,\s]+/)
    .map((f) => f.trim())
    .filter(Boolean)
}
