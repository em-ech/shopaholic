# Shopaholic

**One page. Many stores. Somebody else already did the looking.**

https://em-ech.github.io/shopping-list/

## What this is

Shopping well takes time that most people do not have. Not the buying, the
looking: opening eleven tabs, learning which store sizes small, remembering
that the good linen shirt was on the Spanish site and the trousers were on the
Japanese one, then losing all of it when the browser restarts.

Shopaholic is the end of that. A person who enjoys the looking does it once,
and everyone else gets a single page of things already chosen for them.

## Who it is for

The person too busy to shop. Someone who needs to look put together, does not
want to spend a Saturday on it, and would rather be handed twenty good options
than face two thousand mediocre ones.

They open one link. Every piece is already picked. Tapping one goes straight to
the store that sells it.

## What it does

**Pulls many stores into one page.** A list can hold pieces from Zara, UNIQLO,
Carhartt WIP, Ami Paris, Springfield, Barbour, lululemon and anywhere else at
the same time, sitting side by side and read the same way. No account anywhere,
no basket to reconcile, no jumping between sites to compare.

**Shows only what matters.** A photo, the brand, the price, the colourway, and
the colours it also comes in. Nothing else. No reviews to wade through, no
recommendations, no upsell, nothing asking for an email address.

**Reads in one language and one currency.** A shirt from a Spanish store is
titled in English, with the shop's own wording underneath so it can still be
found on the site. A price in euros or pounds leads with roughly what it costs
in dollars, with the real figure underneath. Everything on the page can be
compared at a glance, and sorting by price actually means something.

**Lets them narrow it down fast.** Filter by brand or by colour, sort by price,
twenty at a time. Someone who only wants to see what is under fifty, in blue,
gets there in two taps.

**Remembers what they liked.** A heart on any piece saves it to a Saved view
that survives closing the tab. It lives in their own browser, so there is no
sign up and nothing about them leaves their device.

**Gives everyone their own list.** One person's picks are not another's. Each
person gets their own page and their own saved pieces, from the same codebase.

**Costs nothing to run.** It is a static page. There is no server, no database
and no bill.

## Keeping a list

Adding a piece means pasting a product link. The details, photo, price,
colourway and the full colour range, are read off the retailer's own page and
appended to that person's list, then published. The curator never types a price
or hunts for an image.

---

## For developers

Vanilla HTML, CSS and JavaScript. No framework, no build step, no dependencies,
no backend. Open `index.html` and it runs.

### Layout

| Path                 | What it is                                          |
| -------------------- | --------------------------------------------------- |
| `products.js`        | Em's list. Collection settings and the products.    |
| `<name>/products.js` | That person's list. Same shape, their own settings. |
| `index.html`         | The shared page shell and product template.         |
| `styles.css`         | Layout and type, shared by every list.              |
| `app.js`             | Rendering, filtering, sorting, paging, Saved state. |
| `new-list.sh`        | Creates a list for another person.                  |
| `sync-lists.sh`      | Copies the shell into every list folder.            |
| `deploy.sh`          | Syncs, commits, pushes to both remotes.             |

Every list is published from `main`. Em's sits at the site root, everyone else
in a folder named after them.

### Adding a product

Append to the `PRODUCTS` array of the list you are editing:

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

### Adding a person

```sh
./new-list.sh jared "Jared's Intervention"
```

Creates `jared/`, seeds `jared/products.js`, generates `jared/index.html`. The
slug becomes the URL and the storage key, so pick it once and keep it.

### Editing the page shell

`index.html` at the root is the only shell. Every `<name>/index.html` is
generated from it and says so in a banner. Edit the root and run
`./sync-lists.sh`, or just deploy and it happens for you.

### Filtering, sorting, paging

State lives in the URL hash, so a filtered page can be sent to someone and the
back button steps through it:

```
#view=saved&brand=UNIQLO&color=Blue&sort=price-asc&page=2
```

Colourways arrive in whatever language and vocabulary the retailer uses, so
`COLOUR_FAMILIES` in `app.js` groups them for the filter while each card still
shows the colourway as written.

Prices are converted to USD through `RATES_TO_BASE` in `app.js`, and sorting
compares those converted figures rather than the numbers printed. The rates are
a dated snapshot, not a live feed, which is why the card says "about"; refresh
them with `curl -s https://open.er-api.com/v6/latest/USD` and take
`1 / rates[CODE]`. A price in a currency with no rate is shown as written and
sorts on its own figure, with a console warning rather than a silent guess.

### Saved state

Product ids only, in the visitor's own browser, under
`shopaholic:saved:v1:<list id>`. localStorage is shared across every page on a
GitHub Pages domain, so the list id in the key is what keeps one person's
hearts out of another's. Removing a product never breaks a saved list.

### Publishing

```sh
./deploy.sh "add lululemon abc trouser"
```

Syncs the shells, commits, and pushes to both `origin` (`em-ech/shopping-list`,
which is what GitHub Pages serves) and `mirror` (`em-ech/shopaholic`). It
refuses to run outside `main`.

### Local preview

```sh
python3 -m http.server 8899
```

Em's list at http://localhost:8899 and Jared's at http://localhost:8899/jared/

## Credits

Product photography, names and prices belong to the retailers linked from each
product: [Ami Paris](https://www.amiparis.com),
[Barbour](https://www.barbour.com), [Carhartt WIP](https://us.carhartt-wip.com),
[eme studios](https://emestudios.com), [lululemon](https://shop.lululemon.com),
[Nude Project](https://nude-project.com),
[Springfield](https://myspringfield.com), [UNIQLO](https://www.uniqlo.com) and
[Zara](https://www.zara.com). Retailer icons are served by Google's public
favicon endpoint.
