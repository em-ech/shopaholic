/* ==========================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT.

   1. Change the collection title below.
   2. Add products to the PRODUCTS array.

   Required on every product:  name, price, image, url
   Optional:                   id, brand, color, note, logo

   Notes
   - If you leave out "id" one is generated from the name. Products with an
     explicit id keep their Saved state even if you later reword the name, so
     an id is worth setting.
   - The retailer logo appears above the product name. Leave "logo" out and the
     retailer's own icon is pulled from its domain automatically. Set "logo" to
     an image URL to override it. If no logo can be loaded, the brand name
     shows as text instead.
   - Everything below the title is example data. Delete it once your own
     products are in.
   ========================================================================== */

window.COLLECTION = {
  title: "Em's Intervention",
  // Set to false to show brand names as plain text instead of retailer icons.
  autoLogos: true,
};

window.PRODUCTS = [
  {
    id: "demo-cotton-tee",
    name: "Basic Crew Neck T Shirt",
    brand: "COS",
    price: "25.00 GBP",
    color: "White",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80&auto=format",
    url: "https://www.cos.com/",
    note: "Example product",
  },
  {
    id: "demo-satin-joggers",
    name: "Satin Jogger Trousers",
    brand: "Mango",
    price: "39.99 GBP",
    color: "Blush",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&q=80&auto=format",
    url: "https://shop.mango.com/",
    note: "Example product",
  },
  {
    id: "demo-biker-jacket",
    name: "Faux Leather Biker Jacket",
    brand: "Zara",
    price: "89.99 GBP",
    color: "Black",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80&auto=format",
    url: "https://www.zara.com/",
    note: "Example product",
  },
  {
    id: "demo-belted-coat",
    name: "Belted Wool Blend Coat",
    brand: "Arket",
    price: "229.00 GBP",
    color: "Camel",
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&q=80&auto=format",
    url: "https://www.arket.com/",
    note: "Example product",
  },
  {
    id: "demo-canvas-backpack",
    name: "Structured Canvas Backpack",
    brand: "Everlane",
    price: "98.00 USD",
    color: "Navy",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=80&auto=format",
    url: "https://www.everlane.com/",
    note: "Example product",
  },
  {
    id: "demo-fringed-poncho",
    name: "Fringed Open Knit Poncho",
    brand: "Aritzia",
    price: "145.00 USD",
    color: "Cream",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=80&auto=format",
    url: "https://www.aritzia.com/",
    note: "Example product",
  },
];
