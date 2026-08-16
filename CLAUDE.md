# Shopaholic: instructions for Claude

Static curated shopping lists published to GitHub Pages. One codebase, one list
per person, all published from `main`.

| List  | Edit                | Live at       |
| ----- | ------------------- | ------------- |
| Em    | `products.js`       | the site root |
| Jared | `jared/products.js` | `/jared/`     |

`./deploy.sh` prints the live URLs. Read them from there rather than assuming.

## The standing request

When Em says **"Add this: <url>"** (or pastes a product URL with no other
instruction), do all of this without asking for more detail:

1. Work out which list it belongs to. Em's is the default. If she names a
   person, or the message is clearly about someone else's list, use theirs. If
   the person has no list yet, ask before creating one.
2. Open the product page and pull:
   - `name` (the product title **in English**)
   - `nameOriginal` (the title as the retailer writes it, only when that is not
     already English. It shows under the name so the source is never lost.)
   - `price` (current price, including currency, e.g. `790.00 USD`)
   - `brand` (retailer or label)
   - `image` (main product photo, full resolution remote URL)
   - `color` (the colourway shown)
   - `colors` (every colourway the style comes in, as `{ name, hex }`)
   - `url` (the product page, cleaned of tracking parameters)
3. Append one object to the `PRODUCTS` array in that list's `products.js`.
   Never reorder, rewrite, or drop anything already in that array.
4. Give it an explicit `id`: kebab case, brand plus short product name, e.g.
   `toteme-scarf-jacket`. Ids are what Saved hearts are keyed on, so an id must
   never be reused or changed once published.
5. Run `./deploy.sh "add <product>"`.
6. Confirm the live site has updated, then tell Em it is live.

If a field cannot be retrieved, add the product with everything else filled in
and say precisely which field is missing. Only `name`, `price`, `image` and
`url` are required. Never invent a price.

## How to pull the data

Try in this order:

1. `WebFetch` on the product URL. Most retailers ship a JSON-LD `Product` block
   or Open Graph tags (`og:title`, `og:image`, `product:price:amount`) that
   carry everything needed.
2. If the page is JavaScript rendered or blocks fetching, use the Chrome
   browser tools to open it and read the page.
3. If both fail, tell Em and ask for the image URL and price only.

Prefer the largest clean product image. Strip resize parameters that shrink it
below roughly 1000px wide. Strip tracking query strings from both the image and
the product URL.

### Retailers that need a specific approach

**lululemon** returns 403 to both `WebFetch` and `curl`. It needs the browser
tools or Em reading the price off the page.

**COS** also returns 403 to fetching, and no screenshot is needed. Open one
product page with the Chrome tools. It serves a "THANK YOU FOR YOUR PATIENCE"
throttle page, so wait about five seconds and click Refresh once. From then on,
run `fetch()` from inside that cos.com page for every other product: same
origin, so no CORS, and the JSON-LD `Product` block parses straight out of the
returned HTML with `DOMParser`. Any plausible category path redirects to the
canonical one, so a URL can be rebuilt from the slug alone as
`/en-us/men/menswear/t-shirts/product/<slug>`. The whole colour range is the
set of product links whose id shares the first seven digits of the sku.

**Dover Street Market**, which is where Comme des Garçons comes from, runs two
Shopify stores in different currencies. **Use the US one.**

| Store                              | Currency |
| ---------------------------------- | -------- |
| `shop-us.doverstreetmarket.com`    | USD      |
| `shop.doverstreetmarket.com`       | GBP      |

Both serve `/products.json?limit=250&page=N` and `/products/<handle>.js`, so
there is nothing to scrape. `products.json` returns a bare number with no
currency attached, so read `Shopify.currency` out of the homepage HTML before
trusting a price. Reading GBP figures as dollars is a mistake that has already
been made here once.

Plain Shopify, so `/products/<handle>.js` works with `curl`: **Arte Antwerp**,
**Staple**, **Daily Paper**, **Stüssy**, **Percival**, **Wax London**,
**Les Deux** (which answers 404 on `.js`, so read the JSON-LD off the page
instead; its `hasVariant` carries the offer).

**A Shopify shop can charge Em a different price than its own base currency
says.** `/products/<handle>.js` always answers in the shop's base currency, but
a shop using Shopify Markets sets its own US prices rather than converting.
Wax London lists a shirt at 125 GBP and charges a US visitor 195 USD, which is
not 125 converted. So:

```sh
curl -s "https://<shop>/products/<handle>?country=US" | grep -o 'application/ld+json'
```

Fetch the page with `?country=US` and read the price out of its JSON-LD offer.
That is what Em would actually pay, and it is the figure the card should carry.
Do not infer it by grepping the page for dollar amounts: the recommended
products at the bottom put their prices in the same HTML, and doing that got
one of the five Wax London prices wrong before the JSON-LD was read properly.

**UNIQLO** answers its own commerce API, but only with a client id header:

```sh
curl -H "x-fr-clientid: uq.es.web-spa" \
  "https://www.uniqlo.com/es/api/commerce/v5/en/products?productIds=E487328-000&withPrices=true&withStocks=true&httpFailure=true"
```

Without the header it returns "invalid or missing client id". Swap `es` for the
region in the url. One call gives the name, price, every colour with its
`displayCode` and name, and the image per colour. The `colorDisplayCode` in a
product url is what picks the colourway, so keep it and drop `sizeDisplayCode`.

**Ralph Lauren cannot be read, by fetching or by browser.** It answers `curl`
with a 307 loop and answers the browser with a "Press and Hold to confirm you
are a human" wall. Do not try to work around that. Ask Em for the price, the
colourway and the image url, or for a screenshot, the same as any other piece
that cannot be read.
**Kardo** is WooCommerce, also fetchable, with JSON-LD on the product page, but
it publishes no colourway and reuses one style name across several prints, so
the colour and a distinguishing word for the name have to be read off the
photograph, and the id should carry Kardo's own slug.

**Zara** blocks `curl` and `WebFetch` with a bot check, and blocks same origin
`fetch` too, so the COS trick does not work here: each product needs a real
navigation with the Chrome tools. Wait about seven seconds, then read the
JSON-LD, which is a `ProductGroup` rather than a `Product`. `hasVariant` holds
every size and colour combination, so the colour range is the distinct
`color` values and the price is on the first variant's `offers`. The colourway
being shown is in `document.title`, as `NAME - Colour | ZARA ...`.

Use the **US** store, `/us/en/`, which prices in USD. The `/uk/en/` store
prices in GBP and some older entries still point there.

Keep `v1` and `v2` on a Zara url. They look like tracking but `v1` selects the
colourway: two links to one product with different `v1` values are two
different colours.

Zara image urls carry a `ts` cache stamp that can be dropped. Append `?w=1024`
instead; the bare url serves a 2048px original that is heavier than the page
needs. Hitting the image CDN in a tight loop returns the odd 403, which is rate
limiting rather than a broken url, so retry once before believing it.

### Swatch hexes

Measure the hex when the shot allows it, otherwise read the colourway name.

Measuring works when the retailer lays the garment flat on white, as COS, Arte
Antwerp and Dover Street Market do. Download the photo, crop to the part of the
frame the garment fills, take the per channel median. A median ignores
highlights and shadows in a way a mean does not.

It does not work on Zara, which photographs on a model in a styled outfit: a
crop catches the backdrop, the model's legs and whatever else they are
wearing. Sampling a red sneaker that way returned a dark grey. For Zara the
colourway name is the more accurate source, because Zara names them plainly.

Whichever way, look at the swatch against the photo before trusting it. A bad
crop still returns a plausible colour.

## Prices in other currencies

Every price is converted to USD so the list can be compared and sorted as one.
The card leads with the converted figure and puts the retailer's own underneath.

Write `price` in the retailer's own currency, e.g. `12.99 EUR`. The conversion
is worked out at render time from `RATES_TO_BASE` in `app.js`.

Those rates are a snapshot, not a live feed, and they drift. To refresh them:

```sh
curl -s https://open.er-api.com/v6/latest/USD
```

Use `1 / rates[CODE]` for each currency, then update the numbers, `RATES_AS_OF`
and the date in the comment above them. A currency with no rate is never
guessed at: the card shows the price as written and the console says why.

## Colourways

Some retailers, eme studios among them, publish each colourway as its own
product page and link them from a colour selector. The `colors` array should
carry the whole range for the style, not just the one being linked to. Read the
colour selector, not the product title.

## Adding a person

```sh
./new-list.sh <slug> "<Title>"
```

The slug is the folder, the URL and the Saved hearts storage key. It can never
change once published.

## Tests

```sh
npm install   # once, pulls jsdom
npm test
```

Run it before deploying anything that touches `app.js`, `index.html` or
`styles.css`. `test.js` opens the real page in jsdom and drives it, once per
list, so Jared's list is covered too.

Add a case whenever you change behaviour. Assert the invariant, never a
snapshot: no product counts, no specific prices. The lists change constantly
and a test that has to be edited every time a shirt is added stops being run.
Follow an interaction with `await tick()` before asserting, because
`hashchange` fires on a later task.

Two things print at the end as notes rather than failures, and both are meant
to: colourways with no family in `COLOURS`, and swatches carrying a hex but no
name because the retailer only names the colourway being viewed.

## Rules

- A `products.js` is the only file that changes when adding a product.
- No hyphens or dashes in any copy that a visitor reads.
- Do not add frameworks, build steps, dependencies, or a backend. jsdom is the
  single exception and it exists only for `test.js`. Nothing the visitor loads
  may ever come from a package.
- Do not add a "NEW" label, cards, borders, shadows, or promotional copy.
- Keep the layout as it is: image first, product information directly beneath
  the photo. On desktop the visitor picks two, three or four across and the
  default is four; below 900px the grid decides for itself.
- The per row control is three glyphs drawing the columns they produce, with
  PER ROW beside them. It was bare numbers once and Em rejected that: sitting
  above a pager they read as page numbers. Do not go back to numbers.
- Never edit a `<name>/index.html`. They are generated from the root
  `index.html` by `sync-lists.sh` and any edit is overwritten on the next
  deploy.

## Verifying a deploy

Count the products in a published list and compare with the local file:

```sh
curl -s <live url>/products.js | grep -c "id:"
```
