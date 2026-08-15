/* --------------------------------------------------------------------------
   A curated shopping list. No framework, no backend.
   Product data lives in products.js. This file only renders it.
   -------------------------------------------------------------------------- */
(function () {
  "use strict";

  var LEGACY_STORAGE_KEY = "shopping-list:saved:v1";
  var VIEW_ALL = "all";
  var VIEW_SAVED = "saved";

  var SORT_CURATED = "curated";
  var SORT_PRICE_ASC = "price-asc";
  var SORT_PRICE_DESC = "price-desc";

  var PAGE_SIZE = 20;
  var ANY = "";

  // Retailers write colourways in their own language and vocabulary, so the
  // filter groups them into families. A card still shows the colourway exactly
  // as its retailer wrote it. Anything not listed here becomes its own family,
  // so a new colourway is never silently swallowed.
  var COLOUR_FAMILIES = {
    black: "Black",
    negro: "Black",

    white: "White",
    blanco: "White",
    "oyster-white": "White",
    ivory: "White",

    beige: "Beige",
    "light beige": "Beige",
    "off sand": "Beige",
    camel: "Beige",
    natural: "Beige",
    nude: "Beige",
    tostado: "Beige",
    khaki: "Beige",
    kaki: "Beige",
    "dark khaki": "Beige",
    sycamore: "Beige",

    blue: "Blue",
    azul: "Blue",
    navy: "Blue",
    "navy blue": "Blue",
    "light blue": "Blue",

    grey: "Grey",
    gray: "Grey",
    gris: "Grey",
    charcoal: "Grey",
    shadow: "Grey",

    green: "Green",
    verde: "Green",

    brown: "Brown",
    naranja: "Orange",
    burdeos: "Red",
    "dark purple": "Purple",
    estampado: "Multi",
  };

  var COLOUR_UNSET = "Unspecified";

  /* ------------------------------------------------------------ currency --- */

  // A list can hold pieces priced in different currencies, which makes the
  // prices impossible to compare and impossible to sort honestly. Every price
  // is converted to one currency for sorting, and the card shows both the
  // retailer's own figure and the converted one.
  //
  // These rates are a snapshot, not a live feed. Taken from
  // exchangerate-api.com on 15 August 2026. They drift, which is why the card
  // says "about". To refresh them, replace the numbers and the date below:
  //   curl -s https://open.er-api.com/v6/latest/USD
  // and use 1 / rates[CODE] for each currency.
  var BASE_CURRENCY = "USD";
  var RATES_AS_OF = "15 August 2026";
  var RATES_TO_BASE = {
    USD: 1,
    EUR: 1.1566,
    GBP: 1.3535,
  };

  var collection = window.COLLECTION || {};

  // Every list on this site shares one origin, and localStorage is keyed by
  // origin rather than by path. Without the list id in the key, Em's hearts
  // and Jared's hearts would overwrite each other.
  var STORAGE_KEY = "shopaholic:saved:v1:" + (collection.id || "default");

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
    filterBrand: document.getElementById("filter-brand"),
    filterColor: document.getElementById("filter-color"),
    sortBy: document.getElementById("sort-by"),
    resultCount: document.getElementById("result-count"),
    pager: document.getElementById("pager"),
    pagerPrev: document.getElementById("pager-prev"),
    pagerNext: document.getElementById("pager-next"),
    pagerStatus: document.getElementById("pager-status"),
  };

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

  function colorFamily(color) {
    var key = String(color).trim().toLowerCase();
    if (!key) return COLOUR_UNSET;
    return COLOUR_FAMILIES[key] || String(color).trim();
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

  // A price in a currency with no rate keeps its own figure rather than being
  // dropped or guessed at, and says so in the console so it gets noticed.
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

  // Shown under the retailer's own price. Nothing is shown when the price is
  // already in the base currency, or when there is no rate to convert it with.
  function convertedLabel(price) {
    var currency = priceCurrency(price);
    if (!currency || currency === BASE_CURRENCY) return "";
    if (!RATES_TO_BASE[currency]) return "";
    return "about " + baseValue(price).toFixed(2) + " " + BASE_CURRENCY;
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
          color: color,
          note: raw.note ? String(raw.note) : "",
          logo: resolveLogo(raw),
          colors: normalizeColors(raw.colors),
          // A retailer writing in its own language gets translated for the
          // card, and its own wording is kept and shown underneath.
          nameOriginal: raw.nameOriginal ? String(raw.nameOriginal) : "",
          colorFamily: colorFamily(color),
          // Sorting compares one currency, so it compares this, not the
          // figure printed on the card.
          baseValue: baseValue(raw.price),
          // The converted figure leads and the retailer's own follows it, so
          // everything on the page can be scanned against one currency.
          priceLead: converted || String(raw.price),
          priceOriginal: converted ? String(raw.price) : "",
        };
      })
      .filter(Boolean);
  }

  var products = normalize(window.PRODUCTS);

  /* ------------------------------------------------------------- storage --- */

  // Only ids are stored. Ids that no longer match a product are kept in
  // storage but ignored everywhere else, so removing a product never breaks
  // the Saved view and re-adding it restores the heart.
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

  function metaText(product) {
    return product.color;
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
    node.querySelector(".product__original").textContent = product.nameOriginal;
    node.querySelector(".product__price").textContent = product.priceLead;
    node.querySelector(".product__price-original").textContent =
      product.priceOriginal;
    node.querySelector(".product__meta").textContent = metaText(product);
    node.querySelector(".product__note").textContent = product.note;

    save.setAttribute("aria-pressed", String(saved));
    save.setAttribute("aria-label", saveLabel(product, saved));
    save.addEventListener("click", function (event) {
      // The heart sits inside the product, which is one big link. This keeps
      // a heart tap from opening the retailer.
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

  /* --------------------------------------------------------------- state --- */

  // Everything the visitor picks lives in the hash, so a filtered page can be
  // sent to someone and the back button steps through it.
  function readState() {
    var raw = window.location.hash.replace(/^#/, "");
    // Links made before the filters existed were just "#saved" or "#all".
    if (raw === VIEW_SAVED || raw === VIEW_ALL) raw = "view=" + raw;

    var state = {
      view: VIEW_ALL,
      sort: SORT_CURATED,
      brand: ANY,
      color: ANY,
      page: 1,
    };

    raw.split("&").forEach(function (pair) {
      if (!pair) return;
      var split = pair.indexOf("=");
      if (split === -1) return;
      var key = decodeURIComponent(pair.slice(0, split));
      var value = decodeURIComponent(pair.slice(split + 1));
      if (!Object.prototype.hasOwnProperty.call(state, key)) return;
      state[key] =
        key === "page" ? Math.max(1, parseInt(value, 10) || 1) : value;
    });

    if (state.view !== VIEW_SAVED) state.view = VIEW_ALL;
    if (state.sort !== SORT_PRICE_ASC && state.sort !== SORT_PRICE_DESC) {
      state.sort = SORT_CURATED;
    }
    return state;
  }

  function stateToHash(state) {
    // "view" is always written so the hash is never empty, which keeps
    // hashchange firing predictably when the last filter is cleared.
    var parts = ["view=" + state.view];
    if (state.sort !== SORT_CURATED)
      parts.push("sort=" + encodeURIComponent(state.sort));
    if (state.brand) parts.push("brand=" + encodeURIComponent(state.brand));
    if (state.color) parts.push("color=" + encodeURIComponent(state.color));
    if (state.page > 1) parts.push("page=" + state.page);
    return "#" + parts.join("&");
  }

  // Any change other than paging sends the visitor back to page one, since the
  // page they were on may no longer exist once the list is filtered.
  function updateState(changes) {
    var state = readState();
    Object.keys(changes).forEach(function (key) {
      state[key] = changes[key];
    });
    if (!Object.prototype.hasOwnProperty.call(changes, "page")) state.page = 1;

    var next = stateToHash(state);
    if (next === window.location.hash) render();
    else window.location.hash = next;
  }

  /* ------------------------------------------------------------ selecting --- */

  function matchesFilters(product, state) {
    if (state.brand && product.brand !== state.brand) return false;
    if (state.color && product.colorFamily !== state.color) return false;
    return true;
  }

  function sortProducts(list, sort) {
    if (sort === SORT_CURATED) return list;
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

  function updateSavedCount() {
    var count = savedProducts().length;
    dom.savedCount.textContent = count ? String(count) : "";
    dom.savedCount.hidden = count === 0;
  }

  // Options are built from the products themselves, so adding a product with a
  // new brand or colourway needs no change here.
  function fillSelect(select, anyLabel, values, selected) {
    select.textContent = "";

    var any = document.createElement("option");
    any.value = ANY;
    any.textContent = anyLabel;
    select.appendChild(any);

    values.forEach(function (entry) {
      var option = document.createElement("option");
      option.value = entry.value;
      option.textContent = entry.value + " (" + entry.count + ")";
      select.appendChild(option);
    });

    // A filter the visitor picked is kept selectable even when the current
    // view has none of it, otherwise the control would silently reset.
    if (
      selected &&
      !values.some(function (e) {
        return e.value === selected;
      })
    ) {
      var orphan = document.createElement("option");
      orphan.value = selected;
      orphan.textContent = selected + " (0)";
      select.appendChild(orphan);
    }
    select.value = selected;
  }

  function tally(list, key) {
    var counts = Object.create(null);
    list.forEach(function (product) {
      var value = product[key];
      if (!value) return;
      counts[value] = (counts[value] || 0) + 1;
    });
    return Object.keys(counts)
      .sort()
      .map(function (value) {
        return { value: value, count: counts[value] };
      });
  }

  function renderControls(state) {
    // Counts describe the view being browsed, not the whole catalogue, so the
    // numbers still make sense inside Saved.
    var base = state.view === VIEW_SAVED ? savedProducts() : products;
    fillSelect(
      dom.filterBrand,
      "All brands",
      tally(base, "brand"),
      state.brand,
    );
    fillSelect(
      dom.filterColor,
      "All colours",
      tally(base, "colorFamily"),
      state.color,
    );
    dom.sortBy.value = state.sort;
  }

  function renderPager(state, total, pages) {
    dom.pager.hidden = pages <= 1;
    dom.pagerPrev.disabled = state.page <= 1;
    dom.pagerNext.disabled = state.page >= pages;
    dom.pagerStatus.textContent =
      pages > 1 ? "Page " + state.page + " of " + pages : "";
    dom.resultCount.textContent = total === 1 ? "1 piece" : total + " pieces";
  }

  function render() {
    var state = readState();
    var list = selectProducts(state);
    var pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    // Deleting a filter, or unsaving the last piece on a page, can leave the
    // visitor past the end of the list.
    var page = Math.min(state.page, pages);
    var slice = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    var fragment = document.createDocumentFragment();
    slice.forEach(function (product) {
      fragment.appendChild(buildProduct(product));
    });

    dom.grid.textContent = "";
    dom.grid.appendChild(fragment);

    if (list.length === 0) {
      dom.emptyMessage.textContent =
        state.brand || state.color
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
    dom.navAll.href = stateToHash({
      view: VIEW_ALL,
      sort: state.sort,
      brand: state.brand,
      color: state.color,
      page: 1,
    });
    dom.navSaved.href = stateToHash({
      view: VIEW_SAVED,
      sort: state.sort,
      brand: state.brand,
      color: state.color,
      page: 1,
    });

    renderControls(state);
    renderPager({ view: state.view, page: page }, list.length, pages);
    updateSavedCount();
  }

  /* ---------------------------------------------------------------- init --- */

  var title = collection.title || "Shopping List";
  dom.title.textContent = title;
  document.title = title;

  // The wordmark in the shell is Em's. A list only shows it by asking for it,
  // so another person's list is not headed by someone else's mark.
  // The attribute is set directly rather than through the "hidden" property:
  // that property belongs to HTMLElement, and this is an SVGElement, so
  // assigning to it silently does nothing at all.
  if (collection.wordmark === true) dom.mark.removeAttribute("hidden");
  else dom.mark.setAttribute("hidden", "");

  dom.filterBrand.addEventListener("change", function () {
    updateState({ brand: dom.filterBrand.value });
  });
  dom.filterColor.addEventListener("change", function () {
    updateState({ color: dom.filterColor.value });
  });
  dom.sortBy.addEventListener("change", function () {
    updateState({ sort: dom.sortBy.value });
  });

  dom.pagerPrev.addEventListener("click", function () {
    updateState({ page: Math.max(1, readState().page - 1) });
    window.scrollTo(0, 0);
  });
  dom.pagerNext.addEventListener("click", function () {
    updateState({ page: readState().page + 1 });
    window.scrollTo(0, 0);
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
