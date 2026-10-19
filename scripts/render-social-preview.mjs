import { readFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const asset = path => new URL(`../static/${path}`, import.meta.url)
const font = async filename => (await readFile(new URL(`../src/assets/fonts/${filename}`, import.meta.url))).toString('base64')
const [regular, medium, mono] = await Promise.all([
  font('space-grotesk-regular.ttf'), font('space-grotesk-medium.ttf'), font('ibm-plex-mono.ttf'),
])

const stars = Array.from({ length: 46 }, (_, i) => {
  const x = 30 + ((i * 0.61803398875) % 1) * 460
  const y = 20 + ((i * 0.41421356237) % 1) * 460
  return `<circle cx="${x}" cy="${y}" r="${i % 8 === 0 ? 1.25 : 0.65}" fill="#b9c8d2" opacity=".4"/>`
}).join('')
const ticks = Array.from({ length: 56 }, (_, i) => {
  const a = i / 56 * Math.PI * 2
  const inside = i % 7 === 0 ? 227 : 233
  return `<line x1="${250 + Math.cos(a) * inside}" y1="${250 + Math.sin(a) * inside * .62}" x2="${250 + Math.cos(a) * 239}" y2="${250 + Math.sin(a) * 239 * .62}"/>`
}).join('')

const html = `<!doctype html><html><head><meta charset="UTF-8"><style>
@font-face{font-family:Space;src:url(data:font/ttf;base64,${regular})} 
@font-face{font-family:Space;src:url(data:font/ttf;base64,${medium});font-weight:500}
@font-face{font-family:Mono;src:url(data:font/ttf;base64,${mono})}
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#0b0d11;color:#ecebe6;font-family:Space,sans-serif;overflow:hidden}
.frame{position:relative;width:100%;height:100%;padding:48px 62px;background:radial-gradient(ellipse at 80% 43%,#ff815209,transparent 50%)}
.top{display:flex;align-items:center;justify-content:space-between}.brand{display:flex;gap:12px;align-items:center;font-size:20px;font-weight:500;letter-spacing:-.8px}.brand svg{color:#ff8152}.brand em{font-style:normal;color:#ff8152}.micro{font-family:Mono,monospace;font-size:10px;letter-spacing:1.5px;color:#a0a5ae}.top .micro{display:flex;align-items:center;gap:9px}.dot{height:5px;width:5px;background:#ff8152;border-radius:50%}
h1{font-weight:500;font-size:88px;line-height:1.035;letter-spacing:-5px;margin:91px 0 0;position:relative;z-index:2}.accent{color:#ff8152}.arrow{display:inline-block;font-size:60px;margin-left:16px;vertical-align:top;margin-top:7px}.person{margin-top:35px;font-size:23px;letter-spacing:-.7px}.role{margin-top:10px;color:#a5a9b2;font-size:15px;letter-spacing:-.1px}.diagram{position:absolute;left:648px;top:70px;width:500px;height:500px}.footer{position:absolute;left:62px;right:62px;bottom:39px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid #ffffff1a;padding-top:23px}.footer .micro{font-size:10px}.footer strong{color:#c5c8cf;font-weight:400}.corner{position:absolute;right:58px;top:115px;color:#ff8152;font-size:24px;font-weight:400}
</style></head><body><div class="frame">
<div class="top"><div class="brand"><svg width="28" height="32" viewBox="0 0 40 44" fill="none"><path d="M3 36 20 7l17 29H25l-5-9-5 9Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M11 36h18" stroke="currentColor" stroke-width="2.2"/></svg><span>alvin<em>.</em>estrada</span></div><span class="micro"><i class="dot"></i> BASED IN GUATEMALA</span></div>
<h1>Cloud. Code.<br><span class="accent">Curiosity.<span class="arrow">↗</span></span></h1>
<div class="person">Alvin Estrada <span class="micro" style="margin-left:12px;color:#727985">/ @adawolfs</span></div>
<div class="role">Cloud architect · CNCF Ambassador · Developer · Maker</div>
<span class="corner">+</span>
<svg class="diagram" viewBox="0 0 500 500" fill="none" aria-hidden="true">
<defs><radialGradient id="glow"><stop stop-color="#ff8152" stop-opacity=".09"/><stop offset="1" stop-color="#ff8152" stop-opacity="0"/></radialGradient></defs>
<circle cx="250" cy="250" r="235" fill="url(#glow)"/>${stars}
<g stroke="#b6c4ce" stroke-width=".7" opacity=".17"><ellipse cx="250" cy="250" rx="239" ry="148"/>${ticks}</g>
<g stroke="#77858d" stroke-width=".6" opacity=".17"><path d="M45 382H465M30 400H475M20 421H480M12 446H487M5 474H491M250 332 48 488M250 332 125 488M250 332 205 488M250 332 286 488M250 332 365 488M250 332 446 488"/></g>
<ellipse cx="250" cy="250" rx="222" ry="96" transform="rotate(-26 250 250)" stroke="#ff8152" opacity=".65" stroke-width="1"/>
<ellipse cx="250" cy="250" rx="208" ry="91" transform="rotate(67 250 250)" stroke="#d7e1e6" opacity=".25" stroke-width=".8"/>
<ellipse cx="250" cy="250" rx="212" ry="150" transform="rotate(18 250 250)" stroke="#d7e1e6" opacity=".2" stroke-width=".8"/>
<g stroke="#d7e1e6" stroke-width=".8" opacity=".42"><path d="M254 118 354 174 379 285 300 365 185 354 128 264 163 160Z M254 118 185 354 354 174 128 264 300 365 163 160 379 285 254 118 M163 160 354 174 300 365 185 354 163 160 M128 264 379 285"/></g>
<g stroke="#ff8152" opacity=".42" stroke-width=".9"><path d="M180 174 312 167 330 318 196 338Z M180 174 292 217 312 167 M292 217 303 363 330 318 M303 363 172 367 196 338 M172 367 160 222 180 174 M160 222 292 217"/></g>
<g stroke="#d7e1e6" opacity=".14"><path d="M250 246 254 118M250 246 185 354M250 246 354 174M250 246 128 264M250 246 300 365M250 246 163 160M250 246 379 285M250 246 428 310M250 246 154 414"/></g>
<path d="m250 187 57 63-57 60-51-61Z" fill="#ff8152"/><path d="m250 187 57 63-56 10Z" fill="#ffd6ab"/><path d="m250 187 1 73-52-11Z" fill="#ff9a63"/><path d="m251 260 56-10-57 60Z" fill="#a64b30"/><path d="m199 249 52 11-1 50Z" fill="#e37046"/>
<g fill="#d7e1e6" opacity=".85"><circle cx="254" cy="118" r="2"/><circle cx="354" cy="174" r="2"/><circle cx="379" cy="285" r="2"/><circle cx="300" cy="365" r="2"/><circle cx="185" cy="354" r="2"/><circle cx="128" cy="264" r="2"/><circle cx="163" cy="160" r="2"/></g>
<circle cx="154" cy="414" r="12" fill="#ff8152" opacity=".08"/><path d="m154 406 8 8-8 8-8-8Z" fill="#ff9b70"/><circle cx="428" cy="310" r="8" fill="#d7e1e6" opacity=".08"/><path d="m428 306 4 4-4 4-4-4Z" fill="#d7e1e6"/>
</svg>
<div class="footer"><span class="micro"><strong>adawolfs.github.io</strong></span><span class="micro">SYSTEMS THINKER. CONSTANT TINKERER.</span></div>
</div></body></html>`

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_EXECUTABLE || undefined,
  headless: true,
  args: ['--no-sandbox'],
})
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.setContent(html)
  await page.evaluate(() => document.fonts.ready)
  const output = fileURLToPath(asset('images/social-preview.png'))
  await mkdir(fileURLToPath(asset('images/')), { recursive: true })
  await page.screenshot({ path: output })
  console.log(`Created ${output} (1200 × 630)`)
} finally {
  await browser.close()
}
