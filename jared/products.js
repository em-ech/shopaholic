/* ==========================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT FOR THIS LIST.

   Required on every product:  name, price, image, url
   Optional:                   id, brand, color, colors, note, logo

   See the root products.js for the full notes on each field.
   ========================================================================== */

window.COLLECTION = {
  // Saved hearts are stored against this id. Never change it once published.
  id: "jared",
  title: "Jared's Intervention",
  // Set to false to show brand names as plain text instead of retailer icons.
  autoLogos: true,
};

/* lululemon blocks fetching, so these three were read off the product pages by
   hand. Prices and colourway names are taken from the pages as written. The
   "colors" entries carry no names because the pages only show the name of the
   colourway being viewed: the count and the swatches are real, the hex values
   are matched by eye and are safe to correct. */

window.PRODUCTS = [
  {
    id: "lululemon-abc-classic-fit-short-7-warpstreme",
    name: 'ABC Classic Fit Short 7" Warpstreme',
    brand: "lululemon",
    price: "98.00 USD",
    color: "Wacky Khaki",
    colors: [
      { hex: "#3E4A57" },
      { hex: "#6E7186" },
      { hex: "#1F2A3C" },
      { hex: "#DDD8CE" },
      { hex: "#1A1A1A" },
      { hex: "#7FA0C0" },
      { hex: "#C6B58C" },
    ],
    image:
      "https://images.lululemon.com/is/image/lululemon/LM7BMHS_019222_1?wid=1600&fmt=webp&qlt=80,1&fit=constrain",
    url: "https://shop.lululemon.com/p/men-shorts/ABC-Short-Classic-7/_/prod11680716?color=19222",
  },
  {
    id: "lululemon-abc-classic-fit-trouser-30l-warpstreme",
    name: "ABC Classic Fit Trouser 30L Warpstreme",
    brand: "lululemon",
    price: "138.00 USD",
    color: "Sassy Sage",
    colors: [
      { hex: "#6E7C5A" },
      { hex: "#47546B" },
      { hex: "#3A443A" },
      { hex: "#C3C4C2" },
      { hex: "#8A6F4E" },
      { hex: "#D6C9B0" },
      { hex: "#8A93B5" },
      { hex: "#4E7385" },
      { hex: "#4A4433" },
      { hex: "#C4A87C" },
      { hex: "#CDBFA2" },
      { hex: "#23324B" },
      { hex: "#1A1A1A" },
      { hex: "#33393B" },
    ],
    image:
      "https://images.lululemon.com/is/image/lululemon/LM5AR2S_077066_1?wid=1600&fmt=webp&qlt=80,1&fit=constrain",
    url: "https://shop.lululemon.com/p/mens-trousers/ABC-Classic-Fit-Trouser-30-Warpstreme/_/prod11500067?color=77066",
  },
  {
    id: "lululemon-abc-wovenair-pull-on-short-7",
    name: 'ABC WovenAir Pull On Short 7"',
    brand: "lululemon",
    // The page prices this one as a range across sizes, reduced from 88.00 USD.
    price: "59.00 to 69.00 USD",
    color: "Polo Pastel",
    colors: [{ hex: "#E2E4E3" }, { hex: "#C9AAB0" }],
    image:
      "https://images.lululemon.com/is/image/lululemon/LM7BNQS_074044_1?wid=1600&fmt=webp&qlt=80,1&fit=constrain",
    url: "https://shop.lululemon.com/p/men-shorts/ABC-WovenAir-Pull-On-Short-7-MD/_/prod11870570?color=74044",
  },
];
