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
   - `name` (the product title as the retailer writes it)
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

Known: lululemon returns 403 to both `WebFetch` and `curl`. It needs the
browser tools or Em reading the price off the page.

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

## Rules

- A `products.js` is the only file that changes when adding a product.
- No hyphens or dashes in any copy that a visitor reads.
- Do not add frameworks, build steps, dependencies, or a backend.
- Do not add a "NEW" label, cards, borders, shadows, or promotional copy.
- Keep the layout as it is: image first, three columns on desktop, one on
  phones, product information directly beneath the photo.
- Never edit a `<name>/index.html`. They are generated from the root
  `index.html` by `sync-lists.sh` and any edit is overwritten on the next
  deploy.

## Verifying a deploy

Count the products in a published list and compare with the local file:

```sh
curl -s <live url>/products.js | grep -c "id:"
```
