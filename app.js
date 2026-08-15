/* --------------------------------------------------------------------------
   A curated shopping list. No framework, no backend.
   Product data lives in products.js. This file only renders it.
   -------------------------------------------------------------------------- */
(function () {
  "use strict";

  var LEGACY_STORAGE_KEY = "shopping-list:saved:v1";
  var VIEW_ALL = "all";
  var VIEW_SAVED = "saved";

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

        return {
          id: id,
          name: String(raw.name),
          price: String(raw.price),
          image: String(raw.image),
          url: String(raw.url),
          brand: raw.brand ? String(raw.brand) : "",
          color: raw.color ? String(raw.color) : "",
          note: raw.note ? String(raw.note) : "",
          logo: resolveLogo(raw),
          colors: normalizeColors(raw.colors),
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
    node.querySelector(".product__price").textContent = product.price;
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
      if (currentView() === VIEW_SAVED) render();
    });

    return node;
  }

  function currentView() {
    return window.location.hash === "#saved" ? VIEW_SAVED : VIEW_ALL;
  }

  function updateSavedCount() {
    var count = savedProducts().length;
    dom.savedCount.textContent = count ? String(count) : "";
    dom.savedCount.hidden = count === 0;
  }

  function render() {
    var view = currentView();
    var list = view === VIEW_SAVED ? savedProducts() : products;
    var fragment = document.createDocumentFragment();

    list.forEach(function (product) {
      fragment.appendChild(buildProduct(product));
    });

    dom.grid.textContent = "";
    dom.grid.appendChild(fragment);

    dom.emptyMessage.hidden = !(view === VIEW_SAVED && list.length === 0);
    dom.navAll.setAttribute(
      "aria-current",
      view === VIEW_ALL ? "page" : "false",
    );
    dom.navSaved.setAttribute(
      "aria-current",
      view === VIEW_SAVED ? "page" : "false",
    );
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

  window.addEventListener("hashchange", render);
  // Saved state stays in step when the site is open in more than one tab.
  window.addEventListener("storage", function (event) {
    if (event.key !== STORAGE_KEY) return;
    savedIds = readSavedIds();
    render();
  });

  render();
})();
