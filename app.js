/* --------------------------------------------------------------------------
   A curated shopping list. No framework, no backend.
   Product data lives in products.js. This file only renders it.
   -------------------------------------------------------------------------- */
(function () {
  "use strict";

  var LEGACY_STORAGE_KEY = "shopping-list:saved:v1";
  var SAVED_KEY_PREFIX = "shopaholic:saved:v1:";
  var VIEW_ALL = "all";
  var VIEW_SAVED = "saved";

  var SORT_CURATED = "curated";
  var SORT_PRICE_ASC = "price-asc";
  var SORT_PRICE_DESC = "price-desc";
  var SORTS = [SORT_CURATED, SORT_PRICE_ASC, SORT_PRICE_DESC];

  // How many products sit across a row, once the screen is wide enough to have
  // a say. Narrower than that and the layout decides for itself.
  var COLUMN_CHOICES = ["2", "3", "4"];
  var COLUMNS_DEFAULT = "4";

  // The three facets are all multi select and all behave identically, so they
  // are described once and everything else loops over this.
  var FACETS = [
    { key: "brand", field: "brand", title: "Brand" },
    { key: "type", field: "type", title: "Type" },
    { key: "color", field: "colorFamily", title: "Colour" },
  ];

  // Retailers write colourways in their own language and vocabulary. One table
  // does both jobs: "label" is what the card shows, in English, and "family" is
  // the bucket the filter groups it into. Where the two are the same, only the
  // family is given. A colourway missing from this table keeps the retailer's
  // own wording and becomes its own family, so nothing is ever silently
  // swallowed, it just shows up untranslated and gets added here.
  var COLOURS = {
    black: { family: "Black" },
    "black and grey": { family: "Black" },
    "polo black": { family: "Black" },
    "black and beige": { family: "Black" },
    negro: { label: "Black", family: "Black" },

    white: { family: "White" },
    blanco: { label: "White", family: "White" },
    "oyster-white": { label: "Oyster white", family: "White" },
    ivory: { family: "White" },
    "light ivory": { family: "White" },
    "ceramic white": { family: "White" },
    "white and navy": { family: "White" },
    "white and refined navy": { family: "White" },
    "white with red": { family: "White" },
    "oyster white": { family: "White" },

    beige: { family: "Beige" },
    "light beige": { family: "Beige" },
    "off sand": { family: "Beige" },
    camel: { family: "Beige" },
    natural: { family: "Beige" },
    nude: { family: "Beige" },
    tostado: { label: "Tan", family: "Beige" },
    khaki: { family: "Beige" },
    kaki: { label: "Khaki", family: "Beige" },
    "dark khaki": { family: "Beige" },
    sycamore: { family: "Beige" },
    "ecru and black": { family: "Beige" },
    "cream stripe": { family: "Beige" },
    "oak": { family: "Beige" },
    "beige marl": { family: "Beige" },
    "ecru": { family: "Beige" },
    "ecru and khaki": { family: "Beige" },
    "ecru and navy": { family: "Beige" },
    "ecru marl": { family: "Beige" },
    "light khaki": { family: "Beige" },
    "light tan": { family: "Beige" },
    "sand": { family: "Beige" },
    "sand marl": { family: "Beige" },
    stone: { family: "Beige" },

    blue: { family: "Blue" },
    azul: { label: "Blue", family: "Blue" },
    navy: { family: "Blue" },
    "navy blue": { family: "Blue" },
    "navy checked": { family: "Blue" },
    "light blue": { family: "Blue" },
    "faded denim blue": { family: "Blue" },
    "classic chairman navy": { family: "Blue" },
    "hunter navy": { family: "Blue" },
    "new iris blue and white": { family: "Blue" },
    "newport navy": { family: "Blue" },
    "office blue": { family: "Blue" },
    "refined navy": { family: "Blue" },
    "dark indigo": { family: "Blue" },
    "indigo print": { family: "Blue" },
    "maritime blue": { family: "Blue" },
    "navy stripe": { family: "Blue" },
    "sky captain blue": { family: "Blue" },
    "blue and white": { family: "Blue" },
    "dark navy": { family: "Blue" },
    "faded blue": { family: "Blue" },
    "indigo": { family: "Blue" },
    "ink blue": { family: "Blue" },
    "navy and white": { family: "Blue" },
    "navy marl": { family: "Blue" },
    "sky blue": { family: "Blue" },

    grey: { family: "Grey" },
    gray: { label: "Grey", family: "Grey" },
    gris: { label: "Grey", family: "Grey" },
    charcoal: { family: "Grey" },
    shadow: { family: "Grey" },
    "grey melange": { family: "Grey" },
    "shiny gunmetal": { family: "Grey" },
    "chalk heather and nevis": { family: "Grey" },
    "ash heather": { family: "Grey" },
    "anthracite grey": { family: "Grey" },
    "light grey": { family: "Grey" },
    "pearl grey": { family: "Grey" },
    "taupe grey": { family: "Grey" },

    green: { family: "Green" },
    verde: { label: "Green", family: "Green" },
    "dark green": { family: "Green" },
    "light green": { family: "Green" },
    oregano: { family: "Green" },
    "pine green": { family: "Green" },
    "company olive": { family: "Green" },
    "fern green heather": { family: "Green" },
    "olive": { family: "Green" },
    "forest": { family: "Green" },
    "grey green": { family: "Green" },
    "sea green": { family: "Green" },
    "washed green": { family: "Green" },

    brown: { family: "Brown" },
    "light brown": { family: "Brown" },
    "dark brown": { family: "Brown" },
    "dark havana": { family: "Brown" },
    "clay": { family: "Brown" },
    "brown and ecru": { family: "Brown" },
    "brown and taupe": { family: "Brown" },
    "brown stripe": { family: "Brown" },
    "chocolate": { family: "Brown" },
    "light mink": { family: "Brown" },
    "mink": { family: "Brown" },
    "mink brown": { family: "Brown" },
    "sandy brown": { family: "Brown" },
    "taupe brown": { family: "Brown" },
    naranja: { label: "Orange", family: "Orange" },
    "lava orange": { family: "Orange" },
    burdeos: { label: "Burgundy", family: "Red" },
    "burgundy": { family: "Red" },
    "dark red": { family: "Red" },
    "red": { family: "Red" },
    "dark purple": { family: "Purple" },

    "potpourri pink": { family: "Pink" },
    "pink / lilac": { family: "Pink" },
    estampado: { label: "Print", family: "Multi" },
    "yellow and white stripe": { family: "Multi" },
    "patchwork": { family: "Multi" },
    "multi colour": { family: "Multi" },

    // Added with the fifteen shops of 18 August 2026. Without these each one
    // becomes its own entry in the Colour filter, which is how a filter with
    // thirty single-piece options happens.
    "all black": { family: "Black" },
    "washed black": { family: "Black" },
    obsidian: { family: "Black" },
    "off white": { family: "White" },
    cloud: { family: "White" },
    vanilla: { family: "White" },
    almond: { family: "Beige" },
    cream: { family: "Beige" },
    "dull cream": { family: "Beige" },
    anthracite: { family: "Grey" },
    "grey and black": { family: "Grey" },
    "indigo blue": { family: "Blue" },
    orange: { family: "Orange" },
    kobicha: { family: "Brown" },
    "gold kakao": { family: "Brown" },
    "tutzetae brown": { family: "Brown" },
    "black and white": { family: "Multi" },
    "brown patchwork": { family: "Multi" },
    "ivory patchwork": { family: "Multi" },
    "ivory and heura": { family: "Multi" },
    "ivory, black and niagara": { family: "Multi" },
    "ivory, sky, jade and red": { family: "Multi" },
    "red and navy": { family: "Multi" },
    "vintage white": { family: "White" },
    "acid grey": { family: "Grey" },
  };

  var COLOUR_UNSET = "Unspecified";

  /* ------------------------------------------------------------ currency --- */

  // A list can hold pieces priced in different currencies, which makes them
  // impossible to compare and impossible to sort honestly. Every price is
  // converted to one currency for sorting, and the card shows the converted
  // figure with the retailer's own underneath.
  //
  // These rates are a snapshot, not a live feed. Taken from
  // exchangerate-api.com on 18 August 2026. They drift, which is why a
  // converted price is marked approximate. To refresh them:
  //   curl -s https://open.er-api.com/v6/latest/USD
  // and use 1 / rates[CODE] for each currency.
  var BASE_CURRENCY = "USD";
  var RATES_TO_BASE = {
    USD: 1,
    EUR: 1.158577,
    GBP: 1.355203,
    // The Indian labels added on 18 August 2026 quote one price worldwide and
    // offer no other currency, so without this every one of them would fail to
    // convert and sort as though its rupee figure were dollars.
    INR: 0.01045,
  };

  var collection = window.COLLECTION || {};

  // Every list on this site shares one origin, and localStorage is keyed by
  // origin rather than by path. Without the list id in the key, Em's hearts and
  // Jared's hearts would overwrite each other.
  var STORAGE_KEY = SAVED_KEY_PREFIX + (collection.id || "default");

  var dom = {
    title: document.getElementById("collection-title"),
    mark: document.getElementById("collection-mark"),
    grid: document.getElementById("grid"),
    emptyMessage: document.getElementById("empty-message"),
    navAll: document.getElementById("nav-all"),
    navSaved: document.getElementById("nav-saved"),
    savedCount: document.getElementById("saved-count"),
    status: document.getElementById("status"),
    template: document.getElementById("product-template"),
    resultCount: document.getElementById("result-count"),
    filtersToggle: document.getElementById("filters-toggle"),
    filtersCount: document.getElementById("filters-count"),
    drawer: document.getElementById("filters"),
    drawerScrim: document.getElementById("drawer-scrim"),
    drawerClose: document.getElementById("drawer-close"),
    filtersClear: document.getElementById("filters-clear"),
    sortBy: document.getElementById("sort-by"),
    density: document.getElementById("density"),
  };

  FACETS.forEach(function (facet) {
    facet.node = document.getElementById("facet-" + facet.key);
  });

  var densityButtons = Array.prototype.slice.call(
    dom.density.querySelectorAll(".density__button"),
  );

  /* ---------------------------------------------------------------- data --- */

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  // The retailer mark. An explicit "logo" always wins. Otherwise the icon the
  // retailer publishes for its own domain is used, which keeps the logo slot
  // filled without anyone having to hunt down an image. Set
  // COLLECTION.autoLogos to false to show the brand name on its own instead.
  function resolveLogo(raw) {
    if (raw.logo) return String(raw.logo);
    if (collection.autoLogos === false) return "";

    try {
      var host = new URL(raw.url).hostname;
      if (!host) return "";
      return (
        "https://www.google.com/s2/favicons?sz=64&domain=" +
        encodeURIComponent(host)
      );
    } catch (error) {
      return "";
    }
  }

  function colorEntry(color) {
    return COLOURS[String(color).trim().toLowerCase()] || null;
  }

  function colorFamily(color) {
    if (!String(color).trim()) return COLOUR_UNSET;
    var entry = colorEntry(color);
    return (entry && entry.family) || String(color).trim();
  }

  // What the card shows. English where the table knows the translation, and the
  // retailer's own wording where it does not.
  function colorLabel(color) {
    var entry = colorEntry(color);
    return (entry && entry.label) || String(color).trim();
  }

  // Reads the first figure in the price, so a range like "59.00 to 69.00 USD"
  // is treated as its lower bound.
  function priceValue(price) {
    var match = String(price)
      .replace(/(\d),(\d)/g, "$1.$2")
      .match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : Infinity;
  }

  function priceCurrency(price) {
    var match = String(price).match(/\b([A-Z]{3})\b/);
    return match ? match[1] : "";
  }

  // The number every price sorts on. A currency with no rate keeps its own
  // figure rather than being dropped or guessed at, and says so in the console.
  function baseValue(price) {
    var value = priceValue(price);
    var currency = priceCurrency(price);
    var rate = RATES_TO_BASE[currency];
    if (rate) return value * rate;
    console.warn(
      "No " +
        BASE_CURRENCY +
        " rate for " +
        (currency || "an unlabelled currency") +
        ", so this price sorts on its own figure: " +
        price,
    );
    return value;
  }

  function isConvertible(price) {
    var currency = priceCurrency(price);
    return Boolean(
      currency && currency !== BASE_CURRENCY && RATES_TO_BASE[currency],
    );
  }

  // The converted figure on its own. The tilde marking it approximate is a
  // separate character in the markup, not part of this string, so it can be
  // styled and hidden from screen readers on its own.
  function convertedLabel(price) {
    if (!isConvertible(price)) return "";
    return baseValue(price).toFixed(2) + " " + BASE_CURRENCY;
  }

  // Available colourways. Each entry is { name, hex }, or a bare hex string.
  function normalizeColors(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
      .map(function (entry) {
        if (typeof entry === "string") return { name: entry, hex: entry };
        if (!entry || !entry.hex) return null;
        return {
          name: entry.name ? String(entry.name) : "",
          hex: String(entry.hex),
        };
      })
      .filter(Boolean);
  }

  // Keeps only products that can actually be rendered, and gives every one of
  // them a stable id so Saved state has something to hold on to.
  function normalize(rawProducts) {
    var seen = Object.create(null);

    return (Array.isArray(rawProducts) ? rawProducts : [])
      .map(function (raw, index) {
        if (!raw || !raw.name || !raw.price || !raw.image || !raw.url) {
          console.warn(
            "Skipped a product: name, price, image and url are all required.",
            raw,
          );
          return null;
        }

        var id = raw.id ? String(raw.id) : slugify(raw.name);
        if (!id) id = "product_" + index;
        while (seen[id]) id = id + "_" + index;
        seen[id] = true;

        var color = raw.color ? String(raw.color) : "";
        var converted = convertedLabel(raw.price);

        return {
          id: id,
          name: String(raw.name),
          price: String(raw.price),
          image: String(raw.image),
          url: String(raw.url),
          brand: raw.brand ? String(raw.brand) : "",
          type: raw.type ? String(raw.type) : "",
          color: colorLabel(color),
          note: raw.note ? String(raw.note) : "",
          logo: resolveLogo(raw),
          colors: normalizeColors(raw.colors),
          // A retailer writing in its own language gets translated for the
          // card, and its own wording is kept and shown underneath.
          nameOriginal: raw.nameOriginal ? String(raw.nameOriginal) : "",
          colorFamily: colorFamily(color),
          // Sorting compares this number, never the figure printed on a card.
          baseValue: baseValue(raw.price),
          // The converted figure leads, the retailer's own follows, so the whole
          // page can be scanned against one currency.
          priceLead: converted || String(raw.price),
          priceIsApproximate: Boolean(converted),
          priceOriginal: converted ? String(raw.price) : "",
        };
      })
      .filter(Boolean);
  }

  var products = normalize(window.PRODUCTS);

  /* ------------------------------------------------------------- storage --- */

  // Only ids are stored. Ids that no longer match a product are kept in storage
  // but ignored everywhere else, so removing a product never breaks the Saved
  // view and re-adding it restores the heart.
  function readKey(key) {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(key) || "[]");
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (error) {
      console.warn("Could not read saved products.", error);
      return [];
    }
  }

  // The list that used to be the whole site keeps the hearts it already had.
  // Only one list may claim them, and only until it saves under its own key.
  function readSavedIds() {
    var ids = readKey(STORAGE_KEY);
    if (ids.length || !collection.inheritsLegacySaves) return ids;
    return readKey(LEGACY_STORAGE_KEY);
  }

  function writeSavedIds(ids) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      console.warn("Could not persist saved products.", error);
    }
  }

  // When two lists are merged the survivor takes the other one's hearts with
  // it, otherwise they sit in localStorage under a key nothing reads any more.
  // The union is written back under this list's key and the source is cleared,
  // so a browser does this once and never again. Listed in COLLECTION as
  // absorbsSavesFrom: ["jared"].
  function absorbSaves() {
    var sources = collection.absorbsSavesFrom || [];
    if (!sources.length) return;

    // Seeding from readSavedIds rather than the raw key keeps the legacy hearts
    // in play: on a browser that has never saved under this list's own key, the
    // union must start from the ones it inherited, not from nothing.
    var merged = readSavedIds();
    var seen = {};
    merged.forEach(function (id) {
      seen[id] = true;
    });

    var moved = 0;
    sources.forEach(function (source) {
      var key = SAVED_KEY_PREFIX + source;
      readKey(key).forEach(function (id) {
        if (seen[id]) return;
        seen[id] = true;
        merged.push(id);
        moved += 1;
      });
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn("Could not clear " + key + ".", error);
      }
    });

    if (moved) writeSavedIds(merged);
  }

  absorbSaves();

  var savedIds = readSavedIds();

  function isSaved(id) {
    return savedIds.indexOf(id) !== -1;
  }

  function toggleSaved(id) {
    var index = savedIds.indexOf(id);
    if (index === -1) savedIds.push(id);
    else savedIds.splice(index, 1);
    writeSavedIds(savedIds);
    return index === -1;
  }

  function savedProducts() {
    return products.filter(function (product) {
      return isSaved(product.id);
    });
  }

  /* --------------------------------------------------------------- state --- */

  // Everything the visitor picks lives in the hash, so a filtered page can be
  // sent to someone and the back button steps through it. The three facets are
  // multi select, carried as comma separated lists.
  function readState() {
    var raw = window.location.hash.replace(/^#/, "");
    // Links made before the filters existed were just "#saved" or "#all".
    if (raw === VIEW_SAVED || raw === VIEW_ALL) raw = "view=" + raw;

    var state = {
      view: VIEW_ALL,
      sort: SORT_CURATED,
      brand: [],
      type: [],
      color: [],
      cols: COLUMNS_DEFAULT,
    };

    raw.split("&").forEach(function (pair) {
      var split = pair.indexOf("=");
      if (split === -1) return;
      var key = decodeURIComponent(pair.slice(0, split));
      var value = decodeURIComponent(pair.slice(split + 1));
      if (!Object.prototype.hasOwnProperty.call(state, key)) return;

      if (Array.isArray(state[key])) {
        state[key] = value
          .split(",")
          .map(function (item) {
            return item.trim();
          })
          .filter(Boolean);
      } else {
        state[key] = value;
      }
    });

    if (state.view !== VIEW_SAVED) state.view = VIEW_ALL;
    if (SORTS.indexOf(state.sort) === -1) state.sort = SORT_CURATED;
    if (COLUMN_CHOICES.indexOf(state.cols) === -1) state.cols = COLUMNS_DEFAULT;
    return state;
  }

  function stateToHash(state) {
    // "view" is always written so the hash is never empty, which keeps
    // hashchange firing predictably when the last filter is cleared.
    var parts = ["view=" + state.view];
    if (state.sort !== SORT_CURATED) {
      parts.push("sort=" + encodeURIComponent(state.sort));
    }
    FACETS.forEach(function (facet) {
      var picked = state[facet.key];
      if (picked && picked.length) {
        parts.push(facet.key + "=" + encodeURIComponent(picked.join(",")));
      }
    });
    if (state.cols !== COLUMNS_DEFAULT) parts.push("cols=" + state.cols);
    return "#" + parts.join("&");
  }

  function updateState(changes) {
    var state = readState();
    Object.keys(changes).forEach(function (key) {
      state[key] = changes[key];
    });

    var next = stateToHash(state);
    if (next === window.location.hash) render();
    else window.location.hash = next;
  }

  // Switching view keeps the filters, the sort and the density.
  function viewLink(state, view) {
    return {
      view: view,
      sort: state.sort,
      brand: state.brand,
      type: state.type,
      color: state.color,
      cols: state.cols,
    };
  }

  function activeFilterCount(state) {
    return FACETS.reduce(function (total, facet) {
      return total + state[facet.key].length;
    }, 0);
  }

  /* ----------------------------------------------------------- selecting --- */

  // An empty facet means "no opinion". Within one facet the picks are an OR, and
  // across facets they are an AND, which is what a shopper expects.
  function matchesFilters(product, state) {
    return FACETS.every(function (facet) {
      var picked = state[facet.key];
      if (!picked.length) return true;
      return picked.indexOf(product[facet.field]) !== -1;
    });
  }

  // The default order. Pieces are added a shop at a time, so products.js arrives
  // grouped by retailer and reads as one long Zara block, then one long COS
  // block. This spreads each brand evenly across whatever is on screen instead:
  // a brand holding n of the pieces gets a slot roughly every length / n. The
  // file itself is left grouped by store, which is how the pieces get pasted in,
  // so adding a shop tomorrow does not re-clump the page.
  //
  // Pure function of the list it is given, with no clock and no randomness, so
  // the order is the same on every load and a link opens on what the sender saw.
  // It runs after filtering, so narrowing to two brands interleaves those two.
  function mixBrands(list) {
    var totals = {};
    var ranked = list.map(function (product, index) {
      var brand = product.brand || "";
      totals[brand] = (totals[brand] || 0) + 1;
      return {
        product: product,
        brand: brand,
        // Where this piece sits within its own brand, in the order it was added.
        rank: totals[brand] - 1,
        index: index,
      };
    });

    ranked.forEach(function (entry) {
      // Halfway into the piece's share of its brand's run, so a brand with one
      // piece lands in the middle of the page rather than at either end.
      entry.score = (entry.rank + 0.5) / totals[entry.brand];
    });

    ranked.sort(function (a, b) {
      if (a.score !== b.score) return a.score - b.score;
      // Brands of the same size score identically. Ordering those by name keeps
      // the result the same on every load, and they are different brands, which
      // is the whole point of the mix.
      if (a.brand !== b.brand) return a.brand < b.brand ? -1 : 1;
      return a.index - b.index;
    });

    return separateNeighbours(
      ranked.map(function (entry) {
        return entry.product;
      }),
    );
  }

  // Spreading each brand over its own share still leaves the odd pair of
  // neighbours from one brand when that brand holds a big slice of the view,
  // Zara being a quarter of the list here. This walks the order once, left to
  // right, and where two neighbours match it pulls the nearest later piece of
  // some other brand into the gap. Everything to the left of the cursor is
  // settled, so one pass is enough and nothing already placed moves again.
  //
  // Where there is nothing left to pull in, because every remaining piece is
  // that same brand, the pair is left alone. That is the honest answer rather
  // than shuffling forever, and it is what a view filtered to one brand does.
  function separateNeighbours(list) {
    for (var i = 1; i < list.length; i++) {
      if (list[i].brand !== list[i - 1].brand) continue;
      for (var j = i + 1; j < list.length; j++) {
        if (list[j].brand === list[i - 1].brand) continue;
        list.splice(i, 0, list.splice(j, 1)[0]);
        break;
      }
    }
    return list;
  }

  function sortProducts(list, sort) {
    if (sort === SORT_CURATED) return mixBrands(list);
    var sorted = list.slice();
    sorted.sort(function (a, b) {
      return sort === SORT_PRICE_ASC
        ? a.baseValue - b.baseValue
        : b.baseValue - a.baseValue;
    });
    return sorted;
  }

  function selectProducts(state) {
    var base = state.view === VIEW_SAVED ? savedProducts() : products;
    return sortProducts(
      base.filter(function (product) {
        return matchesFilters(product, state);
      }),
      state.sort,
    );
  }

  /* -------------------------------------------------------------- render --- */

  function saveLabel(product, saved) {
    return saved
      ? "Remove " + product.name + " from saved"
      : "Save " + product.name;
  }

  function altText(product) {
    var parts = [product.name];
    if (product.color) parts.push(product.color);
    if (product.brand) parts.push("by " + product.brand);
    return parts.join(", ");
  }

  function fillColors(node, product) {
    var row = node.querySelector(".product__colors");
    if (!product.colors.length) return;

    var names = product.colors
      .map(function (color) {
        return color.name;
      })
      .filter(Boolean);

    product.colors.forEach(function (color) {
      var swatch = document.createElement("span");
      swatch.className = "product__swatch";
      swatch.style.backgroundColor = color.hex;
      swatch.setAttribute("aria-hidden", "true");
      row.appendChild(swatch);
    });

    // One label for the whole row reads better than one per square.
    row.setAttribute(
      "aria-label",
      names.length
        ? "Also in " + names.join(", ")
        : product.colors.length + " colours available",
    );
    row.hidden = false;
  }

  function fillBrand(node, product) {
    var brandRow = node.querySelector(".product__brand");
    var logo = node.querySelector(".product__logo");
    var brandName = node.querySelector(".product__brandname");

    brandName.textContent = product.brand;

    if (!product.brand && !product.logo) {
      brandRow.classList.add("is-empty");
      return;
    }

    if (!product.logo) return;

    logo.src = product.logo;
    logo.alt = product.brand ? product.brand + " logo" : "";
    logo.hidden = false;
    // A retailer without a usable mark falls back to its name in text.
    logo.addEventListener("error", function () {
      logo.hidden = true;
      logo.alt = "";
      if (!product.brand) brandRow.classList.add("is-empty");
    });
  }

  // A converted price is marked with a tilde. The tilde is decorative, so it is
  // hidden from screen readers and the word "about" is read in its place.
  function fillPrice(node, product) {
    node.querySelector(".product__approx-word").textContent =
      product.priceIsApproximate ? "about " : "";
    node.querySelector(".product__approx").textContent =
      product.priceIsApproximate ? "~" : "";
    node.querySelector(".product__price-value").textContent = product.priceLead;
    node.querySelector(".product__price-original").textContent =
      product.priceOriginal;
  }

  function buildProduct(product) {
    var node = dom.template.content.firstElementChild.cloneNode(true);
    var image = node.querySelector(".product__image");
    var link = node.querySelector(".product__link");
    var save = node.querySelector(".product__save");
    var saved = isSaved(product.id);

    image.src = product.image;
    image.alt = altText(product);
    // A retailer that blocks hotlinking leaves the plain grey well behind
    // rather than a broken image icon.
    image.addEventListener("error", function () {
      image.hidden = true;
      image.alt = "";
    });

    link.href = product.url;
    link.textContent = product.name;

    fillBrand(node, product);
    fillColors(node, product);
    fillPrice(node, product);
    node.querySelector(".product__original").textContent = product.nameOriginal;
    node.querySelector(".product__meta").textContent = product.color;
    node.querySelector(".product__note").textContent = product.note;

    save.setAttribute("aria-pressed", String(saved));
    save.setAttribute("aria-label", saveLabel(product, saved));
    save.addEventListener("click", function (event) {
      // The heart sits inside the product, which is one big link. This keeps a
      // heart tap from opening the retailer.
      event.preventDefault();
      event.stopPropagation();

      var nowSaved = toggleSaved(product.id);
      save.setAttribute("aria-pressed", String(nowSaved));
      save.setAttribute("aria-label", saveLabel(product, nowSaved));
      dom.status.textContent = nowSaved
        ? product.name + " saved"
        : product.name + " removed from saved";

      save.classList.add("is-pulsing");
      window.setTimeout(function () {
        save.classList.remove("is-pulsing");
      }, 180);

      updateSavedCount();
      if (readState().view === VIEW_SAVED) render();
    });

    return node;
  }

  function updateSavedCount() {
    var count = savedProducts().length;
    dom.savedCount.textContent = count ? String(count) : "";
    dom.savedCount.hidden = count === 0;
  }

  /* --------------------------------------------------------------- facets --- */

  // Options come from the products themselves, so a new brand, type or
  // colourway needs no change here.
  function tally(list, field) {
    var counts = Object.create(null);
    list.forEach(function (product) {
      var value = product[field];
      if (!value) return;
      counts[value] = (counts[value] || 0) + 1;
    });
    return Object.keys(counts)
      .sort()
      .map(function (value) {
        return { value: value, count: counts[value] };
      });
  }

  function renderFacet(facet, base, picked) {
    var options = tally(base, facet.field);

    // A pick with nothing behind it in this view is kept on the list, so the
    // control never silently drops what the visitor chose.
    picked.forEach(function (value) {
      var known = options.some(function (option) {
        return option.value === value;
      });
      if (!known) options.push({ value: value, count: 0 });
    });

    facet.node.textContent = "";

    options.forEach(function (option) {
      var id = "facet-" + facet.key + "-" + slugify(option.value);

      var row = document.createElement("label");
      row.className = "facet__option";
      row.setAttribute("for", id);

      var box = document.createElement("input");
      box.type = "checkbox";
      box.className = "facet__checkbox";
      box.id = id;
      box.value = option.value;
      box.checked = picked.indexOf(option.value) !== -1;
      box.addEventListener("change", function () {
        var next = readState()[facet.key].slice();
        var at = next.indexOf(option.value);
        if (box.checked && at === -1) next.push(option.value);
        if (!box.checked && at !== -1) next.splice(at, 1);
        var changes = {};
        changes[facet.key] = next;
        updateState(changes);
      });

      var name = document.createElement("span");
      name.className = "facet__name";
      name.textContent = option.value;

      var count = document.createElement("span");
      count.className = "facet__count";
      count.textContent = String(option.count);

      row.appendChild(box);
      row.appendChild(name);
      row.appendChild(count);
      facet.node.appendChild(row);
    });
  }

  function renderControls(state) {
    // Counts describe the view being browsed, not the whole catalogue, so the
    // numbers still make sense inside Saved.
    var base = state.view === VIEW_SAVED ? savedProducts() : products;
    FACETS.forEach(function (facet) {
      renderFacet(facet, base, state[facet.key]);
    });
    dom.sortBy.value = state.sort;
    densityButtons.forEach(function (button) {
      button.setAttribute(
        "aria-pressed",
        String(button.getAttribute("data-cols") === state.cols),
      );
    });

    var active = activeFilterCount(state);
    dom.filtersCount.textContent = active ? String(active) : "";
    dom.filtersCount.hidden = active === 0;
    dom.filtersClear.disabled = active === 0 && state.sort === SORT_CURATED;
  }

  /* --------------------------------------------------------------- drawer --- */

  function isDrawerOpen() {
    return dom.filtersToggle.getAttribute("aria-expanded") === "true";
  }

  function setDrawer(open) {
    dom.filtersToggle.setAttribute("aria-expanded", String(open));
    dom.drawer.hidden = !open;
    dom.drawerScrim.hidden = !open;
    document.body.classList.toggle("has-drawer", open);
    if (open) dom.drawerClose.focus();
    else dom.filtersToggle.focus();
  }

  /* ---------------------------------------------------------------- count --- */

  // Says how long the list is. The whole of it is always on screen, so this is
  // a plain total rather than a shown of total.
  function resultCountLabel(total) {
    if (total === 0) return "";
    if (total === 1) return "1 piece";
    return total + " pieces";
  }

  function render() {
    var state = readState();
    var list = selectProducts(state);

    var fragment = document.createDocumentFragment();
    list.forEach(function (product) {
      fragment.appendChild(buildProduct(product));
    });

    dom.grid.textContent = "";
    dom.grid.appendChild(fragment);
    dom.grid.setAttribute("data-cols", state.cols);

    if (list.length === 0) {
      dom.emptyMessage.textContent = activeFilterCount(state)
        ? "Nothing here matches those filters."
        : "No saved pieces yet.";
      dom.emptyMessage.hidden = false;
    } else {
      dom.emptyMessage.hidden = true;
    }

    dom.navAll.setAttribute(
      "aria-current",
      state.view === VIEW_ALL ? "page" : "false",
    );
    dom.navSaved.setAttribute(
      "aria-current",
      state.view === VIEW_SAVED ? "page" : "false",
    );
    dom.navAll.href = stateToHash(viewLink(state, VIEW_ALL));
    dom.navSaved.href = stateToHash(viewLink(state, VIEW_SAVED));

    renderControls(state);
    dom.resultCount.textContent = resultCountLabel(list.length);
    updateSavedCount();
  }

  /* ---------------------------------------------------------------- init --- */

  var title = collection.title || "Shopping List";
  dom.title.textContent = title;
  document.title = title;

  // The wordmark in the shell is Em's. A list only shows it by asking for it,
  // so another person's list is not headed by someone else's mark. The
  // attribute is set directly rather than through the "hidden" property: that
  // property belongs to HTMLElement, and this is an SVGElement, so assigning to
  // it silently does nothing.
  if (collection.wordmark === true) dom.mark.removeAttribute("hidden");
  else dom.mark.setAttribute("hidden", "");

  dom.filtersToggle.addEventListener("click", function () {
    setDrawer(!isDrawerOpen());
  });
  dom.drawerClose.addEventListener("click", function () {
    setDrawer(false);
  });
  dom.drawerScrim.addEventListener("click", function () {
    setDrawer(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isDrawerOpen()) setDrawer(false);
  });

  dom.filtersClear.addEventListener("click", function () {
    updateState({ brand: [], type: [], color: [], sort: SORT_CURATED });
  });

  dom.sortBy.addEventListener("change", function () {
    updateState({ sort: dom.sortBy.value });
  });
  dom.density.addEventListener("click", function (event) {
    var button = event.target.closest(".density__button");
    if (!button) return;
    updateState({ cols: button.getAttribute("data-cols") });
  });

  window.addEventListener("hashchange", render);
  // Saved state stays in step when the site is open in more than one tab.
  window.addEventListener("storage", function (event) {
    if (event.key !== STORAGE_KEY) return;
    savedIds = readSavedIds();
    render();
  });

  render();
})();
