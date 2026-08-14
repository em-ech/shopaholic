# Em's Intervention: instructions for Claude

A static curated shopping list published to GitHub Pages at
https://em-ech.github.io/shopping-list/

## The standing request

When Em says **"Add this: <url>"** (or pastes a product URL with no other
instruction), do all of this without asking for more detail:

1. Open the product page and pull:
   - `name` (the product title as the retailer writes it)
   - `price` (current price, including currency, e.g. `790.00 USD`)
   - `brand` (retailer or label)
   - `image` (main product photo, full resolution remote URL)
   - `color` (the colourway shown)
   - `url` (the product page, cleaned of tracking parameters)
2. Append one object to the `PRODUCTS` array in `products.js`. Never reorder,
   rewrite, or drop anything already in that array.
3. Give it an explicit `id`: kebab case, brand plus short product name, e.g.
   `toteme-scarf-jacket`. Ids are what Saved hearts are keyed on, so an id must
   never be reused or changed once published.
4. Run `./deploy.sh "add <product>"`.
5. Confirm the live site has updated, then tell Em it is live.

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

## Rules

- `products.js` is the only file that changes when adding a product.
- No hyphens or dashes in any copy that a visitor reads.
- Do not add frameworks, build steps, dependencies, or a backend.
- Do not add a "NEW" label, cards, borders, shadows, or promotional copy.
- Keep the layout as it is: image first, three columns on desktop, one on
  phones, product information directly beneath the photo.

## Verifying a deploy

```sh
curl -s https://em-ech.github.io/shopping-list/products.js | grep -c "id:"
```

The count should match the number of products in the local file.
