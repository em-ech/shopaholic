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
COS, Carhartt WIP, Ami Paris, Springfield, Barbour, lululemon, Arte Antwerp,
Staple, Daily Paper, Stüssy, Percival, Kardo, Comme des Garçons and anywhere
else at the same time, sitting side by side and read the same way. No account
anywhere, no basket to reconcile, no jumping between sites to compare.

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

Vanilla HTML, CSS and JavaScript. No framework, no build step, no backend, and
nothing the visitor loads comes from a package. Open `index.html` and it runs.
The one dependency in the repo is jsdom, which only `test.js` uses.

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
| `test.js`            | The whole suite, run against every list.            |

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
./new-list.sh sam "Sam's Picks"
```

Creates `sam/`, seeds `sam/products.js`, generates `sam/index.html`. The slug
becomes the URL and the storage key, so pick it once and keep it. The title
above it can be changed whenever you like; the slug cannot.

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

Filters live in a drawer that slides over the page: brand, type and colour as
multiselect checkboxes with counts, plus the sort. Density sits in the toolbar
instead, on the right, as three glyphs drawing two, three and four columns.
They are glyphs rather than the numbers 2, 3 and 4 because bare numbers above a
pager read as page numbers. Below 900px the grid picks its own columns, so the
control is hidden there rather than offered and ignored.

How much of the list is on screen is printed under the pager, as `20 of 178
pieces`, and drops the "of" once everything fits on one page.

Colourways arrive in whatever language and vocabulary the retailer uses, so
`COLOURS` in `app.js` groups them into families for the filter while each card
still shows the colourway as written. A colourway missing from that table is
never swallowed: it keeps the retailer's wording and becomes its own family,
and `test.js` lists the ones in that state at the end of a run.

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

### Tests

```sh
npm install   # once, pulls jsdom
npm test
```

`test.js` opens the real `index.html` in jsdom, evaluates the real `app.js` and
a real `products.js`, and drives the page the way a visitor would. It runs the
whole suite once per list, so a second person's list is covered rather than
assumed fine because Em's passes.

It checks the data first, that ids are unique and kebab case, that no two
pieces link to the same product page or repeat a brand, name and colourway,
that prices carry a currency there is a rate for, that every swatch has a hex,
that types are known ones. Then the page: what renders, the per row glyphs and their labelling,
filters, both sort directions asserted on the converted figure rather than the
printed one, paging including a page past the end, and hearting a piece through
to the Saved view and back out. Last it checks that each generated
`<name>/index.html` has not drifted from the root shell.

Nothing in it asserts a product count or a price. A test that has to be edited
every time a shirt is added stops being run, so the expected figures are worked
out from whatever the list holds at the time. Two things print at the end as
notes rather than failures, because both are deliberate: colourways with no
family, and swatches that carry a hex but no name because the retailer only
names the colourway being viewed.

## Credits

Product photography, names and prices belong to the retailers linked from each
product: [Ami Paris](https://www.amiparis.com),
[Arte Antwerp](https://arte-antwerp.com),
[Barbour](https://www.barbour.com), [Carhartt WIP](https://us.carhartt-wip.com),
[COS](https://www.cos.com), [Daily Paper](https://dailypaperclothing.com),
[Dover Street Market](https://shop-us.doverstreetmarket.com), for Comme des
Garçons, [eme studios](https://emestudios.com), [Kardo](https://kardo.co),
[lululemon](https://shop.lululemon.com),
[Nude Project](https://nude-project.com), [Percival](https://www.percivalclo.com),
[Springfield](https://myspringfield.com), [Staple](https://www.staplepigeon.com),
[Stüssy](https://www.stussy.com),
[UNIQLO](https://www.uniqlo.com) and
[Zara](https://www.zara.com). Retailer icons are served by Google's public
favicon endpoint. Exchange rates come from
[the Exchange Rate API](https://open.er-api.com). Tests run on
[jsdom](https://github.com/jsdom/jsdom).
