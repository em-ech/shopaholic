/* ==========================================================================
   Add to list: a bookmarklet.

   Click it on any product page. It reads what the page publishes about itself,
   shows you the fields it found so you can correct them, and copies a finished
   products.js entry to the clipboard.

   Why this exists: some shops answer a script with a bot wall but answer you
   with the product, because you are a person using your own browser. This runs
   as you, so there is nothing to get around.

   It never guesses silently. A field it could not find is left empty and
   marked, so an entry is only as confident as what you can see in the panel.

   The panel lives in a shadow root, so the shop's own CSS cannot reach in and
   this cannot leak out onto their page.

   Install: open tools/index.html on the site and drag the button to your
   bookmarks bar. Editing this file changes the bookmarklet, but a bookmark
   already saved keeps the old copy, so drag it again after a change.
   ========================================================================== */

(function () {
  "use strict";

  var PANEL_ID = "shopaholic-add-to-list";
  if (document.getElementById(PANEL_ID)) {
    document.getElementById(PANEL_ID).remove();
  }

  var TYPES = [
    "Short sleeve",
    "Long sleeve",
    "Shorts",
    "Pants",
    "Outerwear",
    "Shoes",
    "Accessories",
  ];

  /* ------------------------------------------------------------ reading --- */

  function jsonLd() {
    var found = [];
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < scripts.length; i++) {
      try {
        collect(JSON.parse(scripts[i].textContent), found);
      } catch (e) {
        /* a shop with malformed json is not worth stopping for */
      }
    }
    return found;
  }

  // Product nodes turn up nested inside @graph, inside arrays, inside anything.
  function collect(node, out) {
    if (!node || typeof node !== "object") return;
    if (node["@type"] === "Product" || node["@type"] === "ProductGroup") out.push(node);
    var keys = Object.keys(node);
    for (var i = 0; i < keys.length; i++) collect(node[keys[i]], out);
  }

  function meta(name) {
    var el =
      document.querySelector('meta[property="' + name + '"]') ||
      document.querySelector('meta[name="' + name + '"]');
    return el ? el.content : "";
  }

  function firstOffer(node) {
    if (!node) return {};
    var offers = node.offers;
    if (Array.isArray(offers)) offers = offers[0];
    if (!offers) return {};
    // Dillard's and others wrap the real offer in an AggregateOffer.
    if (offers["@type"] === "AggregateOffer") {
      return {
        price: offers.lowPrice || offers.price,
        priceCurrency: offers.priceCurrency,
        availability: offers.availability,
      };
    }
    return offers;
  }

  function asUrl(value) {
    while (Array.isArray(value) && value.length) value = value[0];
    if (value && typeof value === "object") value = value.url || value.contentUrl;
    return String(value || "");
  }

  // The colourway the page is showing, taken from the line it prints next to
  // the swatches. Shops write it as "Color: Navy" or "Colour Navy".
  function shownColour() {
    var nodes = document.querySelectorAll("body *");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.children.length) continue;
      var text = (el.textContent || "").trim();
      if (!/^colou?r\s*:?\s*$/i.test(text) && !/^colou?r\s*:/i.test(text)) continue;
      var whole = (el.parentElement ? el.parentElement.textContent : text)
        .replace(/\s+/g, " ")
        .trim();
      var value = whole.replace(/^\s*colou?r\s*:?\s*/i, "").trim();
      if (value && value.length < 44) return value;
    }
    return "";
  }

  // Shops that give each colourway its own page print no "Color:" line at all,
  // because there is nothing to switch between. The colour is usually the tail
  // of the url instead: .../court-sweatshirt-light-ivory. This is a guess, so
  // it is labelled as one in the panel and sits in a field you can overwrite.
  var COLOUR_WORDS =
    "black white ivory cream ecru beige sand stone clay tan brown chocolate " +
    "navy blue indigo denim teal green olive khaki forest pine sage grey gray " +
    "charcoal silver red burgundy wine pink rose purple lilac yellow mustard " +
    "orange gold natural bone oat oak taupe mink havana gunmetal heather " +
    "melange faded washed light dark pale deep bright";

  function colourFromUrl() {
    var slug = location.pathname.replace(/\/$/, "").split("/").pop() || "";
    var words = slug.split("-").filter(Boolean);
    var known = COLOUR_WORDS.split(" ");
    var tail = [];
    // Walk back from the end for as long as the words are colour words.
    for (var i = words.length - 1; i >= 0; i--) {
      if (known.indexOf(words[i].toLowerCase()) === -1) break;
      tail.unshift(words[i]);
    }
    if (!tail.length) return "";
    var text = tail.join(" ");
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  // Biggest image actually rendered on the page, which is nearly always the
  // product shot. Falls back to whatever the page nominated for sharing.
  function biggestImage() {
    var best = null;
    var imgs = document.images;
    for (var i = 0; i < imgs.length; i++) {
      var w = imgs[i].naturalWidth || 0;
      if (w < 400) continue;
      if (!best || w > best.naturalWidth) best = imgs[i];
    }
    return best ? best.currentSrc || best.src : "";
  }

  function priceFromPage() {
    var text = document.body.innerText.replace(/\s+/g, " ");
    var m = text.match(/(?:[$£€])\s?(\d{1,5}(?:[.,]\d{2})?)/);
    return m ? m[1].replace(",", ".") : "";
  }

  function currencyFromPage() {
    var text = document.body.innerText;
    if (text.indexOf("£") !== -1) return "GBP";
    if (text.indexOf("€") !== -1) return "EUR";
    return "USD";
  }

  function gather() {
    var products = jsonLd();
    var group = null;
    var i;
    for (i = 0; i < products.length; i++) {
      if (products[i]["@type"] === "ProductGroup") { group = products[i]; break; }
    }
    var node = group || products[0] || null;
    var offer = firstOffer(node);
    // A ProductGroup often carries the price only on its variants.
    if (!offer.price && node && Array.isArray(node.hasVariant) && node.hasVariant.length) {
      offer = firstOffer(node.hasVariant[0]);
    }
    var brand = node && node.brand;
    if (brand && typeof brand === "object") brand = brand.name;

    return {
      name: (node && node.name) || meta("og:title") || document.title.split("|")[0].trim(),
      brand: brand || meta("og:site_name") || "",
      price: String(offer.price || priceFromPage() || ""),
      currency: offer.priceCurrency || currencyFromPage(),
      colour: shownColour() || colourFromUrl(),
      colourGuessed: !shownColour() && !!colourFromUrl(),
      image: asUrl(node && node.image) || biggestImage() || meta("og:image"),
      url: location.href,
      stock: String(offer.availability || "").split("/").pop(),
    };
  }

  /* ------------------------------------------------------------ writing --- */

  function kebab(value) {
    return String(value)
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function money(figure, currency) {
    var n = parseFloat(String(figure).replace(/[^0-9.]/g, ""));
    if (!isFinite(n)) return "";
    return n.toFixed(2) + " " + currency;
  }

  function quote(value) {
    return JSON.stringify(String(value));
  }

  function entry(state) {
    var shown = state.colour.trim();
    var name = state.name.trim().replace(/[-–—]/g, " ").replace(/\s+/g, " ");
    var lines = [
      "  {",
      "    id: " + quote(state.id) + ",",
      "    name: " + quote(shown ? name + ", " + shown : name) + ",",
      "    brand: " + quote(state.brand.trim()) + ",",
      "    type: " + quote(state.type) + ",",
      "    price: " + quote(money(state.price, state.currency)) + ",",
    ];
    if (shown) {
      lines.push("    color: " + quote(shown) + ",");
      lines.push(
        "    colors: [{ name: " + quote(shown) + ', hex: "' + state.hex.toUpperCase() + '" }],',
      );
    }
    lines.push("    image:");
    lines.push("      " + quote(state.image) + ",");
    lines.push("    url: " + quote(state.url) + ",");
    lines.push("  },");
    return lines.join("\n");
  }

  /* ------------------------------------------------------------- panel --- */

  var found = gather();
  var host = document.createElement("div");
  host.id = PANEL_ID;
  host.style.cssText = "position:fixed;top:16px;right:16px;z-index:2147483647;";
  var root = host.attachShadow({ mode: "open" });
  document.body.appendChild(host);

  root.innerHTML = [
    "<style>",
    ":host,*{box-sizing:border-box;font-family:ui-sans-serif,-apple-system,Segoe UI,Roboto,sans-serif}",
    ".card{width:340px;background:#fff;color:#12161d;border:1px solid #d8d8d5;",
    "box-shadow:0 12px 40px rgba(0,0,0,.18);padding:14px 14px 12px}",
    ".top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}",
    ".ttl{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#0d1f3c}",
    ".x{border:0;background:none;font-size:18px;line-height:1;cursor:pointer;color:#6b6b6b}",
    "label{display:block;font-size:10px;letter-spacing:.1em;text-transform:uppercase;",
    "color:#6b6b6b;margin:8px 0 3px}",
    "input,select{width:100%;padding:6px 7px;border:1px solid #d8d8d5;font-size:13px;background:#fff}",
    "input.warn{border-color:#c0392b;background:#fdf3f2}",
    ".row{display:flex;gap:8px}.row>*{flex:1}",
    ".row2{display:flex;gap:8px;align-items:flex-end}",
    "input[type=color]{padding:2px;height:31px;cursor:pointer}",
    "button.act{padding:7px 10px;border:1px solid #0d1f3c;background:#0d1f3c;color:#fff;",
    "font-size:11px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;white-space:nowrap}",
    "button.ghost{background:#fff;color:#0d1f3c}",
    ".foot{display:flex;gap:8px;margin-top:12px}",
    ".note{font-size:11px;color:#6b6b6b;margin-top:8px;line-height:1.4}",
    ".ok{color:#1d6f42}",
    "</style>",
    '<div class="card">',
    '<div class="top"><span class="ttl">Add to list</span>',
    '<button class="x" id="close" title="Close">&times;</button></div>',
    '<label for="name">Name</label><input id="name">',
    '<div class="row"><div><label for="brand">Brand</label><input id="brand"></div>',
    '<div><label for="type">Type</label><select id="type"></select></div></div>',
    '<div class="row"><div><label for="price">Price</label><input id="price"></div>',
    '<div><label for="currency">Currency</label><select id="currency">',
    "<option>USD</option><option>GBP</option><option>EUR</option></select></div></div>",
    '<div class="row2"><div><label for="colour">Colourway</label><input id="colour"></div>',
    '<div style="flex:0 0 46px"><label for="hex">Hex</label><input type="color" id="hex" value="#808080"></div>',
    '<button class="act ghost" id="pick" title="Pick the colour off the photo">Eyedrop</button></div>',
    '<label for="image">Image</label><input id="image">',
    '<label for="url">Link</label><input id="url">',
    '<div class="foot"><button class="act" id="copy">Copy entry</button>',
    '<button class="act ghost" id="reimage">Pick image</button></div>',
    '<p class="note" id="note"></p>',
    "</div>",
  ].join("");

  var el = function (id) { return root.getElementById(id); };
  var note = el("note");

  TYPES.forEach(function (t) {
    var opt = document.createElement("option");
    opt.textContent = t;
    el("type").appendChild(opt);
  });

  el("name").value = found.name;
  el("brand").value = found.brand;
  el("price").value = found.price;
  el("currency").value = ["USD", "GBP", "EUR"].indexOf(found.currency) === -1 ? "USD" : found.currency;
  el("colour").value = found.colour;
  el("image").value = found.image;
  el("url").value = found.url;

  // Anything the page did not tell us is flagged rather than filled in.
  ["name", "brand", "price", "image"].forEach(function (id) {
    if (!el(id).value) el(id).classList.add("warn");
  });
  var missing = ["name", "brand", "price", "colour", "image"].filter(function (id) {
    return !el(id).value;
  });
  var lines = [];
  if (missing.length) lines.push("Could not read: " + missing.join(", ") + ".");
  if (found.colourGuessed) lines.push("Colourway is a guess from the link, check it.");
  if (found.stock && found.stock !== "InStock") lines.push("The page says this is " + found.stock + ".");
  note.textContent = lines.length ? lines.join(" ") : "Read everything off the page.";

  function currentId() {
    return kebab(
      [el("brand").value, el("name").value, el("colour").value].join(" "),
    ).slice(0, 70);
  }

  // The eyedropper reads the real colour off the photo, which beats guessing a
  // hex from a colour name. Chrome only; elsewhere the swatch box still works.
  el("pick").addEventListener("click", function () {
    if (!window.EyeDropper) {
      note.textContent = "This browser has no eyedropper. Use the colour box instead.";
      return;
    }
    new window.EyeDropper()
      .open()
      .then(function (result) {
        el("hex").value = result.sRGBHex;
        note.textContent = "Colour taken from the photo: " + result.sRGBHex;
      })
      .catch(function () {});
  });

  // Click the photo you want. Useful when the biggest image is a lifestyle
  // shot and you would rather have the packshot.
  el("reimage").addEventListener("click", function () {
    note.textContent = "Click the photo you want on the page.";
    host.style.opacity = "0.25";
    var grab = function (event) {
      var img = event.target.closest && event.target.closest("img");
      document.removeEventListener("click", grab, true);
      host.style.opacity = "1";
      if (!img) { note.textContent = "That was not an image. Nothing changed."; return; }
      event.preventDefault();
      event.stopPropagation();
      el("image").value = img.currentSrc || img.src;
      el("image").classList.remove("warn");
      note.textContent = "Image set from the one you clicked.";
    };
    document.addEventListener("click", grab, true);
  });

  el("copy").addEventListener("click", function () {
    var text = entry({
      id: currentId(),
      name: el("name").value,
      brand: el("brand").value,
      type: el("type").value,
      price: el("price").value,
      currency: el("currency").value,
      colour: el("colour").value,
      hex: el("hex").value,
      image: el("image").value,
      url: el("url").value,
    });
    navigator.clipboard.writeText(text).then(
      function () {
        note.innerHTML = '<span class="ok">Copied. Paste it to Claude, or into products.js.</span>';
      },
      function () {
        // Clipboard permission can be refused; showing the text still gets the
        // job done with a manual copy.
        note.textContent = "Could not reach the clipboard. Select the text below.";
        var box = document.createElement("textarea");
        box.value = text;
        box.style.cssText = "width:100%;height:150px;margin-top:8px;font:11px/1.4 ui-monospace,monospace";
        root.querySelector(".card").appendChild(box);
        box.select();
      },
    );
  });

  el("close").addEventListener("click", function () { host.remove(); });
})();
