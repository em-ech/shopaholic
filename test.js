/* ==========================================================================
   Tests for every list in this repo.

     node test.js

   Needs jsdom, which is the one thing here that is not vanilla:

     npm install

   Nothing the visitor loads depends on it. jsdom is only ever used to open
   index.html in this file, so the published site stays free of dependencies.

   The lists change constantly. Nothing below asserts a product count or a
   specific price, because a test that has to be edited every time a shirt is
   added stops being run. Each check is an invariant instead, and the expected
   figures are worked out from the data the page is holding at the time.

   Adding a case: put it in the section it belongs to, name it as the thing
   that must stay true rather than the thing being clicked.
   ========================================================================== */

"use strict";

const fs = require("fs");
const path = require("path");

let JSDOM;
try {
  ({ JSDOM } = require("jsdom"));
} catch {
  console.error(
    "jsdom is not installed. Run:\n\n  npm install\n\nIt is a test only\n" +
      "dependency and nothing on the published site loads it.",
  );
  process.exit(2);
}

/* ----------------------------------------------------------------- rig --- */

const ROOT = __dirname;
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");

// hashchange is dispatched on a later task in both jsdom and a real browser, so
// anything asserted straight after an interaction reads the previous render.
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

let checks = 0;
let failures = 0;
const notes = [];

function check(label, actual, expected) {
  checks += 1;
  const ok = String(actual) === String(expected);
  if (!ok) failures += 1;
  console.log(
    `  ${ok ? "pass" : "FAIL"}  ${label}` + (ok ? "" : `\n        got ${actual}\n        want ${expected}`),
  );
}

function section(title) {
  console.log(`\n${title}`);
}

// Something true but not worth failing over, such as a colourway that has no
// family yet. Printed at the end so it is seen without breaking the run.
function note(message) {
  notes.push(message);
}

/* --------------------------------------------------------------- lists --- */

// Every list in the repo, so a second person's list is covered by the same
// suite rather than being trusted because Em's passes.
function lists() {
  const found = [{ id: "root", products: "products.js" }];
  fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .filter((entry) => fs.existsSync(path.join(ROOT, entry.name, "products.js")))
    .forEach((entry) => {
      found.push({ id: entry.name, products: `${entry.name}/products.js` });
    });
  return found;
}

// "seed" runs against a live window before app.js does, which is the only way
// to test what the app makes of localStorage it did not write itself.
function open(list, seed) {
  const dom = new JSDOM(read("index.html"), {
    url: "http://localhost:8899/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const { window } = dom;
  if (seed) seed(window);
  // products.js sets window.COLLECTION and window.PRODUCTS, the same two
  // globals app.js reads in a browser.
  window.eval(read(list.products));
  window.eval(read("app.js"));
  return window;
}

/* -------------------------------------------------------------- shared --- */

const TYPES = ["Long sleeve", "Short sleeve", "Shorts", "Pants", "Outerwear", "Shoes", "Accessories"];
const HEX = /^#[0-9A-Fa-f]{6}$/;
// A range is allowed and is deliberate: some retailers price a style by size,
// and app.js sorts such a piece on the lower figure.
const PRICE = /^\d+(\.\d{2})?( to \d+(\.\d{2})?)? [A-Z]{3}$/;

// What actually names one piece at a retailer that puts several colourways
// behind one page: the product code, plus whichever parameter selects the
// colour. Returns null for retailers that give each colourway its own url,
// where the plain url comparison already covers it.
function colourwayKey(url) {
  let m;
  if ((m = url.match(/-p(\d{6,})\.html/))) {
    // Zara. v1 is the colourway, v2 is a tracking segment and is ignored here.
    return `zara:${m[1]}:${(url.match(/[?&]v1=(\d+)/) || [])[1] || "none"}`;
  }
  if ((m = url.match(/\/(\d{7})\.html/))) {
    // Springfield, where dwvar_<code>_color picks the colourway.
    return `springfield:${m[1]}:${(url.match(/_color=(\d+)/) || [])[1] || "none"}`;
  }
  if ((m = url.match(/\/products\/([A-Z]\d{6})-(\d{3})/))) {
    // UNIQLO, where colorDisplayCode picks the colourway.
    return `uniqlo:${m[1]}:${(url.match(/colorDisplayCode=(\d+)/) || [])[1] || m[2]}`;
  }
  return null;
}

function ratesFromApp() {
  const src = read("app.js");
  const block = src.slice(src.indexOf("var RATES_TO_BASE"), src.indexOf("var collection"));
  const rates = {};
  for (const m of block.matchAll(/([A-Z]{3}):\s*([\d.]+)/g)) rates[m[1]] = Number(m[2]);
  return rates;
}

function coloursFromApp() {
  const src = read("app.js");
  const block = src.slice(src.indexOf("var COLOURS = {"), src.indexOf("var COLOUR_UNSET"));
  const map = {};
  // Commas belong in the class: a colourway like "ivory, sky, jade and red" is
  // a real key and was being read as unmapped by this parser alone.
  for (const m of block.matchAll(/^\s*"?([a-z][a-z .,'/-]*)"?:\s*\{[^}]*family:\s*"([A-Za-z]+)"/gm)) {
    map[m[1].trim()] = m[2];
  }
  return map;
}

const RATES = ratesFromApp();
const COLOURS = coloursFromApp();

const currencyOf = (price) => (String(price).match(/\b([A-Z]{3})\b/) || [])[1] || "";
const figureOf = (price) => {
  const m = String(price).replace(/(\d),(\d)/g, "$1.$2").match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : Infinity;
};
const usdOf = (price) => figureOf(price) * (RATES[currencyOf(price)] || 1);

/* ----------------------------------------------------------- the data --- */

function testData(list, window) {
  const products = window.PRODUCTS;
  section(`${list.products}: the data`);

  check("the list is not empty", products.length > 0, "true");
  check("every piece has a name", products.every((p) => p.name && p.name.trim()), "true");
  check("every piece has a price", products.every((p) => p.price), "true");
  check("every piece has an image", products.every((p) => p.image), "true");
  check("every piece has a url", products.every((p) => p.url), "true");
  check("every piece has an id", products.every((p) => p.id && p.id.trim()), "true");

  const ids = products.map((p) => p.id);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  // Saved hearts are keyed on id. Two pieces sharing one means hearting either
  // hearts both, and it is silent.
  check("no two pieces share an id", duplicates.join(", ") || "none", "none");

  check("every id is kebab case", products.every((p) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id)), "true");

  // Two entries pointing at one product page is the duplicate that actually
  // happens, because the same link gets pasted twice on different days. It is
  // invisible on the page: two identical cards just look like two pieces.
  const byUrl = {};
  products.forEach((p) => { (byUrl[p.url] = byUrl[p.url] || []).push(p.id); });
  const sameUrl = Object.entries(byUrl).filter(([, ids]) => ids.length > 1);
  check("no two pieces link to the same page", sameUrl.map(([, ids]) => ids.join(" and ")).join("; ") || "none", "none");

  // Comparing whole urls is not enough. The Zara linen trousers were on the
  // list twice on 2026-08-17 under urls that differed only by a trailing "v2",
  // which is a tracking segment and not part of what the link opens. What
  // identifies a piece is the retailer's product code plus the colourway id,
  // so that is what gets compared. A style in two colourways is two pieces and
  // must still pass.
  const byColourway = {};
  products.forEach((p) => {
    const key = colourwayKey(p.url);
    if (key) (byColourway[key] = byColourway[key] || []).push(p.id);
  });
  const sameColourway = Object.entries(byColourway).filter(([, ids]) => ids.length > 1);
  check("no two pieces are the same product in the same colourway", sameColourway.map(([key, ids]) => `${key}: ${ids.join(" and ")}`).join("; ") || "none", "none");

  // Same brand, same name and same colourway is a duplicate in all but the url.
  // Colour has to be part of it: one style in two colourways is two pieces, and
  // the older entries do not carry the colourway in the name.
  const byLabel = {};
  products.forEach((p) => {
    const key = `${p.brand}|${p.name}|${p.color || ""}`.toLowerCase();
    (byLabel[key] = byLabel[key] || []).push(p.id);
  });
  const sameLabel = Object.entries(byLabel).filter(([, ids]) => ids.length > 1);
  check("no two pieces share a brand, a name and a colourway", sameLabel.map(([, ids]) => ids.join(" and ")).join("; ") || "none", "none");

  // Not a failure, but two cards that read identically are hard to tell apart
  // at a glance. Newer entries put the colourway in the name; older ones do not.
  const byName = {};
  products.forEach((p) => {
    const key = `${p.brand}|${p.name}`.toLowerCase();
    (byName[key] = byName[key] || []).push(p.id);
  });
  const sameName = Object.entries(byName).filter(([, ids]) => ids.length > 1);
  if (sameName.length) {
    note(`${list.products}: ${sameName.length} names are shared by pieces that differ only by colourway, so those cards read alike: ${sameName.map(([, ids]) => ids.join(" / ")).join("; ")}`);
  }
  check("every image is https", products.every((p) => p.image.startsWith("https://")), "true");
  check("every url is https", products.every((p) => p.url.startsWith("https://")), "true");

  const badPrice = products.filter((p) => !PRICE.test(p.price));
  check("every price reads as a figure and a currency code", badPrice.map((p) => `${p.id} ${p.price}`).join(", ") || "yes", "yes");

  const noRate = products.filter((p) => !RATES[currencyOf(p.price)]);
  check("every currency has a rate to convert with", noRate.map((p) => p.id + " " + currencyOf(p.price)).join(", ") || "yes", "yes");

  const badType = products.filter((p) => p.type && !TYPES.includes(p.type));
  check("every type is one of the known ones", badType.map((p) => `${p.id} ${p.type}`).join(", ") || "yes", "yes");

  const badHex = products.flatMap((p) =>
    (p.colors || []).filter((c) => c && !HEX.test(String(c.hex))).map((c) => `${p.id} ${c.name}`),
  );
  // A swatch with no hex is dropped at render, so the colour range silently
  // shrinks rather than erroring.
  check("every swatch carries a hex", badHex.join(", ") || "yes", "yes");

  // Only meaningful where the range is named. Some retailers, lululemon among
  // them, name only the colourway being viewed, so those swatches carry a hex
  // and nothing else and there is no name to match against.
  const named = products.filter((p) => p.color && (p.colors || []).length && p.colors.every((c) => c && c.name));
  const shownColourMissing = named.filter((p) => !p.colors.some((c) => c.name === p.color));
  check("the colourway shown is in the range listed", shownColourMissing.map((p) => p.id).join(", ") || "yes", "yes");

  const unnamedSwatches = products.filter((p) => (p.colors || []).some((c) => c && !c.name));
  if (unnamedSwatches.length) {
    note(`${list.products}: ${unnamedSwatches.length} pieces have swatches with a hex but no name, because the retailer only names the colourway being viewed: ${unnamedSwatches.map((p) => p.id).join(", ")}`);
  }

  // Not a failure. An unmapped colourway still shows, it just becomes its own
  // entry in the filter instead of joining a family.
  const unmapped = new Set();
  products.forEach((p) => {
    [p.color, ...(p.colors || []).map((c) => c && c.name)].forEach((name) => {
      if (name && !COLOURS[String(name).toLowerCase()]) unmapped.add(name);
    });
  });
  if (unmapped.size) {
    note(`${list.products}: ${unmapped.size} colourways have no family, so each is its own filter entry: ${[...unmapped].sort().join(", ")}`);
  }
}

/* ------------------------------------------------------- what renders --- */

function testRender(list, window) {
  const doc = window.document;
  const products = window.PRODUCTS;
  section(`${list.products}: what renders`);

  check("the title comes from the collection", doc.getElementById("collection-title").textContent, window.COLLECTION.title);
  check("the document title matches", doc.title, window.COLLECTION.title);
  check("every piece is on screen", doc.querySelectorAll("#grid .product").length, products.length);
  check("every card has an image src", [...doc.querySelectorAll("#grid .product__image")].every((i) => i.getAttribute("src")), "true");
  check("every card links somewhere", [...doc.querySelectorAll("#grid a[href]")].every((a) => a.getAttribute("href").startsWith("https://")), "true");
  // The whole list renders at once, so the offscreen images must not all be
  // fetched on first paint.
  check("every card image is lazy", [...doc.querySelectorAll("#grid .product__image")].every((i) => i.getAttribute("loading") === "lazy"), "true");

  const expected = products.length === 1 ? "1 piece" : `${products.length} pieces`;
  check("the count under the list reads the total", doc.getElementById("result-count").textContent, expected);
}

/* --------------------------------------------------------- per row --- */

async function testPerRow(list, window) {
  const doc = window.document;
  const $ = (sel) => doc.querySelector(sel);
  const buttons = [...doc.querySelectorAll(".density__button")];
  const click = async (el) => {
    el.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await tick();
  };
  section(`${list.products}: the per row control`);

  check("three choices", buttons.length, 3);
  check("the group says what it is", $("#density").getAttribute("aria-label"), "Pieces per row");
  check("a visible label sits beside it", $(".density__label").textContent, "Per row");
  check("that label is hidden from screen readers, the group already says it", $(".density__label").getAttribute("aria-hidden"), "true");

  // Numbers here read as page numbers, which is why these are glyphs. Each
  // glyph has to keep drawing the layout it actually produces.
  check("each choice is a glyph, not a number", buttons.every((b) => b.querySelector(".density__icon") && !b.textContent.trim()), "true");
  check("each glyph draws as many bars as it sets columns", buttons.every((b) => b.querySelectorAll("rect").length === Number(b.dataset.cols)), "true");
  check("the glyphs are hidden from screen readers", buttons.every((b) => b.querySelector(".density__icon").getAttribute("aria-hidden") === "true"), "true");
  check("each choice is announced in words", buttons.map((b) => b.getAttribute("aria-label")).join(" / "), "Two per row / Three per row / Four per row");

  check("four across to begin with", $("#grid").getAttribute("data-cols"), "4");
  check("and it is the one marked pressed", buttons[2].getAttribute("aria-pressed"), "true");

  await click($(".density__label"));
  check("the label itself does nothing", $("#grid").getAttribute("data-cols"), "4");

  // A click lands on a bar inside the svg unless the icon is out of the way.
  await click(buttons[1].querySelector("rect"));
  check("clicking a bar inside a glyph still counts", $("#grid").getAttribute("data-cols"), "3");

  await click(buttons[0]);
  check("two across", $("#grid").getAttribute("data-cols"), "2");
  check("two is pressed", buttons[0].getAttribute("aria-pressed"), "true");
  check("three is released", buttons[1].getAttribute("aria-pressed"), "false");
  check("the choice is in the hash, so a link carries it", window.location.hash.includes("cols=2"), "true");

  await click(buttons[2]);
  check("back to the default", $("#grid").getAttribute("data-cols"), "4");
  check("the default is left out of the hash", window.location.hash.includes("cols="), "false");
}

/* -------------------------------------------------- filters and sort --- */

async function testFilterAndSort(list, window) {
  const doc = window.document;
  const products = window.PRODUCTS;
  const go = async (hash) => {
    window.location.hash = hash;
    await tick();
  };
  const shown = () => doc.querySelectorAll("#grid .product").length;
  section(`${list.products}: filtering and sorting`);

  const brands = {};
  products.forEach((p) => {
    if (p.brand) brands[p.brand] = (brands[p.brand] || 0) + 1;
  });
  const brand = Object.keys(brands).sort((a, b) => brands[a] - brands[b])[0];
  if (brand) {
    await go(`#brand=${encodeURIComponent(brand)}`);
    check(`filtering to ${brand} shows its pieces`, shown(), brands[brand]);
  }

  await go("#brand=NoSuchBrandExists");
  check("a filter matching nothing shows nothing", shown(), 0);
  check("and says so rather than sitting empty", doc.getElementById("empty-message").hidden, false);
  check("and prints no count", doc.getElementById("result-count").textContent, "");

  await go("#sort=price-asc");
  const asc = [...doc.querySelectorAll("#grid .product")].map((el) => usdOf(el.querySelector(".product__price").textContent));
  check("cheapest first, on the converted figure", asc.every((v, i) => i === 0 || asc[i - 1] <= v), "true");

  await go("#sort=price-desc");
  const desc = [...doc.querySelectorAll("#grid .product")].map((el) => usdOf(el.querySelector(".product__price").textContent));
  check("dearest first, on the converted figure", desc.every((v, i) => i === 0 || desc[i - 1] >= v), "true");

  // The whole point of converting: a cheap piece in a strong currency must not
  // sort as though its printed figure were dollars.
  const mixed = new Set(products.map((p) => currencyOf(p.price)));
  if (mixed.size > 1) {
    await go("#sort=price-asc");
    const first = doc.querySelector("#grid .product").textContent;
    const cheapest = products.slice().sort((a, b) => usdOf(a.price) - usdOf(b.price))[0];
    check(`with ${mixed.size} currencies in play, the cheapest converted piece leads`, first.includes(cheapest.name), "true");
  }

  await go("#all");
}

/* --------------------------------------------------- the default order --- */

// products.js is written a shop at a time, so it arrives grouped by retailer
// and would read as one long block per store. The default order spreads the
// brands across the page instead. These assert the shape of that order and
// never a particular sequence, so adding a shop cannot break them.
async function testDefaultOrder(list, window) {
  const doc = window.document;
  const products = window.PRODUCTS;
  const byUrl = new Map(products.map((p) => [p.url, p]));
  const go = async (hash) => {
    window.location.hash = hash;
    await tick();
  };
  const order = () => [...doc.querySelectorAll("#grid .product__link")].map((a) => byUrl.get(a.href));
  section(`${list.products}: the default order`);

  await go("#all");
  const shown = order();
  check("every piece is in it, exactly once", new Set(shown.map((p) => p.id)).size, products.length);

  // Two neighbours may share a brand only where there was nothing else left to
  // put between them, which is what a view holding one brand runs into.
  const brands = shown.map((p) => p.brand);
  const avoidable = brands.filter((b, i) => i > 0 && b === brands[i - 1] && brands.slice(i + 1).some((rest) => rest !== b));
  check("no two neighbours share a brand while another brand is still to place", avoidable.length, 0);

  // Mixing is only worth doing if it actually breaks up the blocks the file is
  // written in, so the file order itself must not survive.
  if (new Set(products.map((p) => p.brand)).size > 1) {
    check("the page is not just the file order", shown.map((p) => p.id).join() === products.map((p) => p.id).join(), false);
  }

  // Within a brand the pieces keep the order they were added, so a shop's own
  // run still reads the way it was pasted in. Mixing decides where a brand's
  // pieces land on the page, never how they are ordered among themselves.
  const resequenced = [...new Set(products.map((p) => p.brand))].filter((brand) => {
    const on = (from) => from.filter((p) => p.brand === brand).map((p) => p.id).join();
    return on(shown) !== on(products);
  });
  check("every brand keeps the order it was added in", resequenced.join(", ") || "none", "none");

  // No clock and no randomness in it, so a link opens on what the sender saw.
  const first = shown.map((p) => p.id).join();
  await go("#sort=price-desc");
  await go("#all");
  check("the order survives a round trip through another sort", order().map((p) => p.id).join(), first);
}

/* ------------------------------------------------------ the whole list --- */

// The list used to be cut into pages of twenty. It is not any more, and these
// guard the two ways that could come back: a cap on what renders, and a stray
// page key left in the hash by an old link.
async function testWholeList(list, window) {
  const doc = window.document;
  const products = window.PRODUCTS;
  const go = async (hash) => {
    window.location.hash = hash;
    await tick();
  };
  section(`${list.products}: the whole list`);

  await go("#all");
  check("nothing is held back", doc.querySelectorAll("#grid .product").length, products.length);
  check("there is no pager", doc.getElementById("pager"), null);
  check("the count is a plain total", doc.getElementById("result-count").textContent, `${products.length} pieces`);

  // Links sent out while the pager existed carry #page=N. It is not a key the
  // state knows any more, so it must be ignored rather than narrow the view.
  await go("#view=all&page=7");
  check("an old paged link still shows everything", doc.querySelectorAll("#grid .product").length, products.length);

  await go("#all");
  check("and the page key is not written back into the hash", window.location.hash.includes("page="), false);
}

/* ----------------------------------------------------------- saved --- */

async function testSaved(list, window) {
  const doc = window.document;
  const go = async (hash) => {
    window.location.hash = hash;
    await tick();
  };
  section(`${list.products}: saving`);

  const heart = doc.querySelector("#grid .product__save");
  check("nothing is saved to begin with", doc.getElementById("saved-count").hidden, true);

  heart.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
  await tick();
  check("hearting marks it pressed", heart.getAttribute("aria-pressed"), "true");
  check("and the Saved link shows one", doc.getElementById("saved-count").textContent, "1");

  // Keyed by list id, because localStorage is shared across every list on the
  // one GitHub Pages domain.
  const key = `shopaholic:saved:v1:${window.COLLECTION.id}`;
  check("it is stored under this list's own key", JSON.parse(window.localStorage.getItem(key)).length, 1);

  await go("#view=saved");
  check("the Saved view holds it", doc.querySelectorAll("#grid .product").length, 1);
  check("and the count reads as one piece", doc.getElementById("result-count").textContent, "1 piece");

  doc.querySelector("#grid .product__save").dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
  await tick();
  check("unhearting empties the view", doc.querySelectorAll("#grid .product").length, 0);
  check("and says why", doc.getElementById("empty-message").textContent, "No saved pieces yet.");

  window.localStorage.clear();
  await go("#all");
}

/* --------------------------------------------------- absorbed hearts --- */

// A merged list takes the other list's hearts with it. Jared had saved pieces
// under his own key before the two lists became one, and localStorage is keyed
// by origin, so those entries are still sitting in his browser. This is the one
// visit that folds them in, and it has to survive being run twice.
async function testAbsorbedSaves(list, window) {
  const sources = window.COLLECTION.absorbsSavesFrom;
  if (!sources || !sources.length) return;

  const key = (id) => `shopaholic:saved:v1:${id}`;
  const mine = key(window.COLLECTION.id);
  const theirs = key(sources[0]);
  const [a, b, c] = window.PRODUCTS.slice(0, 3).map((p) => p.id);

  section(`${list.products}: hearts absorbed from ${sources[0]}`);

  const seeded = open(list, (w) => {
    w.localStorage.setItem(mine, JSON.stringify([a]));
    w.localStorage.setItem(theirs, JSON.stringify([b, c, a]));
  });
  await tick();

  const union = JSON.parse(seeded.localStorage.getItem(mine));
  check("both sets of hearts survive", union.length, 3);
  check("and the piece hearted on both is not doubled", union.filter((id) => id === a).length, 1);
  check("the Saved link counts all three", seeded.document.getElementById("saved-count").textContent, "3");
  check("the old key is cleared, so this happens once", seeded.localStorage.getItem(theirs), null);

  // Reopening must not resurrect anything: the source key is gone, and a heart
  // unsaved after the merge has to stay unsaved.
  const carried = JSON.stringify(union);
  const again = open(list, (w) => w.localStorage.setItem(mine, carried));
  await tick();
  check("a second visit changes nothing", again.localStorage.getItem(mine), carried);
  again.close();
  seeded.close();

  // Nothing to absorb is the ordinary case, and it must not touch the hearts
  // this list already holds under the key it inherited from the old site.
  const legacyOnly = open(list, (w) => w.localStorage.setItem("shopping-list:saved:v1", JSON.stringify([a])));
  await tick();
  check("with no source key the legacy hearts are still read", legacyOnly.document.getElementById("saved-count").textContent, "1");
  check("and are not rewritten under this list's key", legacyOnly.localStorage.getItem(mine), null);
  legacyOnly.close();
}

/* ------------------------------------------------------------- shells --- */

function testBookmarklet() {
  section("the add to list bookmarklet");
  const source = read("tools/add-to-list.js");
  const page = read("tools/index.html");

  // The install page builds the bookmarklet from the source file at runtime.
  // If it ever inlines its own copy instead, the two drift and the button
  // silently installs an old tool.
  check("the install page builds from the source file", page.includes('fetch("add-to-list.js")'), true);
  check("and holds no second copy of the tool", page.includes("attachShadow"), false);

  // Types offered by the tool have to be the types the list accepts, or it
  // hands you an entry that fails the data checks above.
  const offered = (source.match(/var TYPES = \[([\s\S]*?)\]/) || [])[1] || "";
  const names = [...offered.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  check("it offers every type the list knows", names.slice().sort().join(", "), TYPES.slice().sort().join(", "));

  // It writes entries, so it has to write them the way products.js reads them.
  check("it writes a colors array with a hex", source.includes("colors: [{ name: "), true);
  check("it strips dashes out of names, per the no hyphens rule", source.includes('replace(/[-–—]/g, " ")'), true);
  check("it formats price as figure and currency", source.includes('n.toFixed(2) + " " + currency'), true);
}

// Jared's list was merged into the root list, and the link to his old page was
// already sent out, so that folder has to keep forwarding. It holds no
// products.js, which is what keeps sync-lists.sh from overwriting it, so
// nothing else in the suite would notice if it were lost.
function testRetiredLists() {
  section("the retired lists");
  const RETIRED = ["jared"];

  RETIRED.forEach((id) => {
    const dir = path.join(ROOT, id);
    check(`${id}/ still exists`, fs.existsSync(dir), true);
    check(`${id}/ holds no products.js, so sync-lists.sh leaves it alone`, fs.existsSync(path.join(dir, "products.js")), false);

    const page = read(`${id}/index.html`);
    check(`${id}/index.html redirects without javascript`, /http-equiv="refresh"[^>]*url=\.\.\//.test(page), true);
    check(`${id}/index.html redirects with javascript`, page.includes('window.location.replace("../")'), true);
    check(`${id}/index.html offers a link as well`, page.includes('href="../"'), true);
    check(`${id}/index.html is not indexed`, page.includes('name="robots" content="noindex"'), true);
  });
}

function testShells() {
  section("the generated shells");
  const shell = read("index.html");
  lists()
    .filter((list) => list.id !== "root")
    .forEach((list) => {
      const generated = read(`${list.id}/index.html`);
      // sync-lists.sh regenerates these from the root. A hand edit here is
      // overwritten on the next deploy, so it must not have drifted.
      check(`${list.id}/index.html carries the per row glyphs`, (generated.match(/density__button/g) || []).length, (shell.match(/density__button/g) || []).length);
      check(`${list.id}/index.html carries the count under the list`, generated.includes('id="result-count"'), true);
      check(`${list.id}/index.html points at its own products.js`, generated.includes("products.js"), true);
    });
}

/* --------------------------------------------------------------- run --- */

(async () => {
  for (const list of lists()) {
    const window = open(list);
    testData(list, window);
    testRender(list, window);
    await testPerRow(list, window);
    await testFilterAndSort(list, window);
    await testDefaultOrder(list, window);
    await testWholeList(list, window);
    await testSaved(list, window);
    await testAbsorbedSaves(list, window);
    window.close();
  }
  testBookmarklet();
  testRetiredLists();
  testShells();

  if (notes.length) {
    section("worth knowing, not failures");
    notes.forEach((message) => console.log(`  ${message}`));
  }

  console.log(
    failures === 0
      ? `\n${checks} checks passed.`
      : `\n${failures} of ${checks} checks failed.`,
  );
  process.exit(failures === 0 ? 0 : 1);
})();
