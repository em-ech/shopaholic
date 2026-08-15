# Shopaholic

Static, image first shopping lists. One codebase, one list per person.

| Path                 | What it is                                                   |
| -------------------- | ------------------------------------------------------------ |
| `products.js`        | **Em's list.** Collection settings and the products.         |
| `<name>/products.js` | **That person's list.** Same shape, their own settings.      |
| `index.html`         | The shared page shell and product template.                  |
| `styles.css`         | Layout and type, shared by every list.                       |
| `app.js`             | Rendering, Saved state, localStorage. Shared by every list.  |
| `new-list.sh`        | Creates a list for another person.                           |
| `sync-lists.sh`      | Copies the shell into every list folder. Run by `deploy.sh`. |
| `deploy.sh`          | Syncs, commits, pushes.                                      |

No build step, no dependencies, no backend.

Every list is published from `main`. Em's is at the site root, everyone else
sits in a folder named after them.

## Adding a product

Paste a new object into the `PRODUCTS` array of the list you are editing:

```js
{
  id: "toteme-scarf-jacket",
  name: "Signature Scarf Jacket",
  price: "790.00 USD",
  image: "https://cdn.retailer.com/images/scarf-jacket.jpg",
  url: "https://www.retailer.com/products/signature-scarf-jacket",
  brand: "Toteme",
  color: "Camel",
  colors: [{ name: "Camel", hex: "#C19A6B" }],
  note: ""
},
```

Required: `name`, `price`, `image`, `url`.
Optional: `id`, `brand`, `color`, `colors`, `note`, `logo`.

Set `id` yourself so Saved hearts survive a later rewording of the name. Leave
`logo` out and the retailer's own icon is fetched from its domain. `colors` is
the full range the style comes in and draws the small squares under the price.

## Adding a person

```sh
cd ~/shopaholic
./new-list.sh jared "Jared's Intervention"
```

That creates `jared/`, seeds `jared/products.js`, and generates `jared/index.html`.
Add products, then deploy. The slug becomes the URL and the storage key, so pick
it once and keep it.

## Editing the page shell

`index.html` at the root is the only shell. Every `<name>/index.html` is
generated from it and carries a banner saying so. Edit the root, then run
`./sync-lists.sh`, or just deploy and it happens for you.

## Publishing an update

```sh
cd ~/shopaholic
./deploy.sh "add lululemon abc trouser"
```

That syncs the shells, commits and pushes. Pages rebuilds in under a minute.
It refuses to run outside `main`, because `main` is what Pages publishes.

## Local preview

```sh
cd ~/shopaholic
python3 -m http.server 8899
```

Em's list is at http://localhost:8899 and Jared's at http://localhost:8899/jared/

## Saved state

Saved products live in the visitor's own browser as a list of product ids only.
No accounts, no tracking, nothing leaves the device. Each list stores against
its own key, `shopaholic:saved:v1:<id>`, because localStorage is shared across
every page on `em-ech.github.io`. Removing a product never breaks a saved list.

## Credits

Product photography and copy belong to the retailers linked from each product:
[Nude Project](https://nude-project.com), [eme studios](https://emestudios.com),
[Zara](https://www.zara.com) and [lululemon](https://shop.lululemon.com).
Retailer icons are served by Google's public favicon endpoint.
