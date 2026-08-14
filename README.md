# Em's Intervention

A static, image first shopping list. Three files do the work:

| File | What it is |
| --- | --- |
| `products.js` | **The only file you edit.** Collection title and the product list. |
| `index.html` | Page shell and the product template. |
| `styles.css` | Layout and type. |
| `app.js` | Rendering, Saved state, localStorage. |

No build step, no dependencies, no backend. Open `index.html` and it runs.

## Adding a product

Paste a new object into the `PRODUCTS` array in `products.js`:

```js
{
  id: "toteme-scarf-jacket",
  name: "Signature Scarf Jacket",
  price: "790.00 USD",
  image: "https://cdn.retailer.com/images/scarf-jacket.jpg",
  url: "https://www.retailer.com/products/signature-scarf-jacket",
  brand: "Toteme",
  color: "Camel",
  note: ""
},
```

Required: `name`, `price`, `image`, `url`.
Optional: `id`, `brand`, `color`, `note`, `logo`.

Set `id` yourself so Saved hearts survive a later rewording of the name. Leave
`logo` out and the retailer's own icon is fetched from its domain.

## Publishing an update

```sh
cd ~/shopping-list
./deploy.sh "add toteme scarf jacket"
```

That commits and pushes. GitHub Pages rebuilds in under a minute.

## Local preview

```sh
cd ~/shopping-list
python3 -m http.server 8899
```

Then open http://localhost:8899

## Saved state

Saved products live in the visitor's own browser under the localStorage key
`shopping-list:saved:v1`, as a list of product ids only. No accounts, no
tracking, nothing leaves the device. Removing a product from `products.js`
never breaks anyone's saved list.

## Credits

Example photography from [Unsplash](https://unsplash.com). Retailer icons are
served by Google's public favicon endpoint.
