/* ==========================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT.

   1. Change the collection title below.
   2. Add products to the PRODUCTS array.

   Required on every product:  name, price, image, url
   Optional:                   id, brand, color, colors, note, logo

   Notes
   - If you leave out "id" one is generated from the name. Products with an
     explicit id keep their Saved state even if you later reword the name, so
     an id is worth setting.
   - "colors" draws the little squares under the price. Each entry is
     { name: "Navy blue", hex: "#2A323D" }. Leave it out for no squares.
   - The retailer logo appears above the product name. Leave "logo" out and the
     retailer's own icon is pulled from its domain automatically. Set "logo" to
     an image URL to override it. If no logo can be loaded, the brand name
     shows as text instead.
   ========================================================================== */

window.COLLECTION = {
  // Saved hearts are stored against this id. Every list needs its own, and an
  // id must never change once published or the hearts under it are orphaned.
  id: "em",
  title: "Em's Intervention",
  // Draws the Em wordmark to the left of the title. It is Em's mark, so no
  // other list should set this.
  wordmark: true,
  // Set to false to show brand names as plain text instead of retailer icons.
  autoLogos: true,
  // This list was the whole site before it became one list among several, so
  // it adopts the hearts saved under the old key. Only this list may set it.
  inheritsLegacySaves: true,
};

window.PRODUCTS = [
  {
    id: "nude-ryuk-tee-brown",
    name: "Ryuk Tee Brown",
    brand: "Nude Project",
    price: "54.00 GBP",
    color: "Brown",
    colors: [{ name: "Brown", hex: "#6B4F3A" }],
    image:
      "https://cdn.shopify.com/s/files/1/0025/3725/9054/files/15front_9465acf1-7ff8-473e-9eb5-f5465a9ab36c.webp?v=1786391805",
    url: "https://nude-project.com/en-gb/collections/t-shirts/products/tekna-tee-brown",
  },
  {
    id: "nude-tennis-tee-white",
    name: "Tennis Tee White",
    brand: "Nude Project",
    price: "54.00 GBP",
    color: "White",
    colors: [{ name: "White", hex: "#F2F0EA" }],
    image:
      "https://cdn.shopify.com/s/files/1/0025/3725/9054/files/TENNISTEEWHITE_front.webp?v=1786017874",
    url: "https://nude-project.com/en-gb/collections/t-shirts/products/tennis-tee-white",
  },
  {
    id: "nude-court-tee-ivory",
    name: "Court Tee Ivory",
    brand: "Nude Project",
    price: "54.00 GBP",
    color: "Ivory",
    colors: [{ name: "Ivory", hex: "#EDE6D8" }],
    image:
      "https://cdn.shopify.com/s/files/1/0025/3725/9054/files/345front_a260a921-f9f2-469c-8389-29f2ffd9c7a7.webp?v=1786017710",
    url: "https://nude-project.com/en-gb/collections/t-shirts/products/nps-court-tee-marshmallow",
  },
  {
    id: "nude-origins-tee-black",
    name: "Origins Tee Black",
    brand: "Nude Project",
    price: "44.00 GBP",
    color: "Black",
    colors: [{ name: "Black", hex: "#17171A" }],
    image:
      "https://cdn.shopify.com/s/files/1/0025/3725/9054/files/ORIGINS_TEE_BLACK_front_6ea47f02-cd6f-4f79-8626-1f2bd0316be1.webp?v=1786018559",
    url: "https://nude-project.com/en-gb/collections/t-shirts/products/sella-ss25-tee-black-1",
  },
  {
    id: "nude-wavy-knit-sweater-navy",
    name: "Wavy Knit Sweater Navy",
    brand: "Nude Project",
    price: "139.00 GBP",
    color: "Navy",
    colors: [{ name: "Navy", hex: "#232C43" }],
    image:
      "https://cdn.shopify.com/s/files/1/0025/3725/9054/files/13front_e96ab72e-4843-4cda-9c82-65d47df64f1b.webp?v=1786009216",
    url: "https://nude-project.com/en-gb/collections/knitwear/products/wavy-knit-blue",
  },
  {
    id: "nude-origins-quarter-zip-khaki",
    name: "Origins Quarter-Zip Khaki",
    brand: "Nude Project",
    price: "99.00 GBP",
    color: "Khaki",
    colors: [{ name: "Khaki", hex: "#6E6A4C" }],
    image:
      "https://cdn.shopify.com/s/files/1/0025/3725/9054/files/1front_green_c759d6e7-2e03-4c4c-add1-be200bef444a.webp?v=1786348847",
    url: "https://nude-project.com/en-gb/collections/hoodies/products/origins-halfzip-fw26-forest-green",
  },
  {
    id: "eme-thrill-off-sand-oversized-tee",
    name: "Thrill Off Sand Oversized Tee",
    brand: "eme studios",
    price: "65.00 USD",
    color: "Off Sand",
    colors: [
      { name: "Off Sand", hex: "#D8CBB4" },
      { name: "Sugar", hex: "#EFE7DA" },
    ],
    image:
      "https://cdn.shopify.com/s/files/1/1804/1835/files/20206_07_31EMEURGENTE0322.webp?v=1785828399&width=1600",
    url: "https://emestudios.com/us/en/product/thrill-off-sand-oversized-tee",
  },
  {
    id: "eme-thrill-shadow-long-sleeve",
    name: "Thrill Shadow Long Sleeve",
    brand: "eme studios",
    price: "79.00 USD",
    color: "Shadow",
    colors: [
      { name: "Navy", hex: "#232C43" },
      { name: "Pearl", hex: "#E8E4DC" },
      { name: "Shadow", hex: "#6A6A6C" },
    ],
    image:
      "https://cdn.shopify.com/s/files/1/1804/1835/files/1_a15f0d8c-eacc-41b9-87bc-a884d080d4b8.webp?v=1776412055&width=1600",
    url: "https://emestudios.com/us/en/product/thrill-shadow-long-sleeve",
  },
  {
    id: "eme-core-shadow-oversized-tee",
    name: "Core Shadow Oversized Tee",
    brand: "eme studios",
    price: "65.00 USD",
    color: "Shadow",
    colors: [
      { name: "Pearl", hex: "#E8E4DC" },
      { name: "Shadow", hex: "#6A6A6C" },
    ],
    image:
      "https://cdn.shopify.com/s/files/1/1804/1835/files/8435674690356_1.webp?v=1767096554&width=1600",
    url: "https://emestudios.com/us/en/product/core-shadow-oversized-tee",
  },
  {
    id: "eme-basic-navy-long-sleeve",
    name: "Basic Navy Long Sleeve",
    brand: "eme studios",
    price: "48.30 USD",
    color: "Navy",
    colors: [
      { name: "Navy", hex: "#232C43" },
      { name: "Shadow", hex: "#6A6A6C" },
    ],
    image:
      "https://cdn.shopify.com/s/files/1/1804/1835/files/2025_02_07EME14351.webp?v=1756678107&width=1600",
    url: "https://emestudios.com/us/en/product/basic-navy-long-sleeve",
  },
  {
    id: "eme-bachatas-navy-polo-crewneck",
    name: "Bachatas Navy Polo Crewneck",
    brand: "eme studios",
    price: "76.30 USD",
    color: "Navy",
    colors: [
      { name: "Navy", hex: "#232C43" },
      { name: "Birch", hex: "#C9BBA4" },
    ],
    image:
      "https://cdn.shopify.com/s/files/1/1804/1835/files/2025_12_18EME2087.webp?v=1767093771&width=1600",
    url: "https://emestudios.com/us/en/product/bachatas-navy-polo-crewneck",
  },
  {
    id: "eme-academy-navy-oversized-crewneck",
    name: "Academy Navy Oversized Crewneck",
    brand: "eme studios",
    price: "49.50 USD",
    color: "Navy",
    colors: [
      { name: "Choco", hex: "#4A342A" },
      { name: "Navy", hex: "#232C43" },
    ],
    image:
      "https://cdn.shopify.com/s/files/1/1804/1835/files/2025_12_18EME2186.webp?v=1767095355&width=1600",
    url: "https://emestudios.com/us/en/product/academy-navy-oversized-crewneck",
  },
  {
    id: "eme-suty-sycamore-reverse-crewneck",
    name: "Suty Sycamore Reverse Crewneck",
    brand: "eme studios",
    price: "79.20 USD",
    color: "Sycamore",
    colors: [{ name: "Sycamore", hex: "#8F8672" }],
    image:
      "https://cdn.shopify.com/s/files/1/1804/1835/files/2025_04_24EME1182.webp?v=1756677653&width=1600",
    url: "https://emestudios.com/us/en/product/suty-sycamore-reverse-crewneck",
  },
  {
    id: "eme-thrill-navy-zipper-knit",
    name: "Thrill Navy Zipper Knit",
    brand: "eme studios",
    price: "139.00 USD",
    color: "Navy",
    colors: [
      { name: "Burgundy", hex: "#5C1F27" },
      { name: "Falcon", hex: "#7C6E60" },
      { name: "Grandpa Grey", hex: "#9A9A98" },
      { name: "Hunt", hex: "#3A4436" },
      { name: "Lollipop", hex: "#B3232C" },
      { name: "Mustard", hex: "#C4922B" },
      { name: "Navy", hex: "#232C43" },
      { name: "Sodalite R9", hex: "#2C3A63" },
    ],
    image:
      "https://cdn.shopify.com/s/files/1/1804/1835/files/KANT_NAVY_CARDIGAN_ZIP_1.webp?v=1746533270&width=1600",
    url: "https://emestudios.com/us/en/product/thrill-navy-zipper-knit",
  },
  {
    id: "zara-slim-fit-rib-contrast-t-shirt-oyster-white",
    name: "Slim Fit Rib Contrast T Shirt",
    brand: "Zara",
    price: "29.99 GBP",
    color: "Oyster-white",
    image:
      "https://static.zara.net/assets/public/ccb8/5acf/d90a406cb215/0ba63b98070d/04087034251-p/04087034251-p.jpg?ts=1779127843299&w=1024",
    url: "https://www.zara.com/uk/en/slim-fit-t-shirt-with-contrast-ribbed-trims-p04087034.html?v1=555071525&v2=2718839",
  },
  {
    id: "zara-ribbed-henley-t-shirt-khaki",
    name: "Ribbed Henley T Shirt",
    brand: "Zara",
    price: "29.99 GBP",
    color: "Khaki",
    image:
      "https://static.zara.net/assets/public/b6ab/cb27/105a4cd69aca/11c0b89dbefa/06462420505-p/06462420505-p.jpg?ts=1786373621900&w=1024",
    url: "https://www.zara.com/uk/en/ribbed-henley-t-shirt-p06462420.html?v1=554659836&v2=2432042",
  },
  {
    id: "zara-relaxed-fit-interlock-t-shirt-04-dark-khaki",
    name: "Relaxed Fit Interlock T Shirt /04",
    brand: "Zara",
    price: "22.99 GBP",
    color: "Dark khaki",
    colors: [
      { name: "Dark khaki", hex: "#4D4D3C" },
      { name: "Mid-grey", hex: "#A5A4A2" },
      { name: "White", hex: "#F4F6FA" },
      { name: "Pink / lilac", hex: "#D6BEC6" },
      { name: "Black", hex: "#242524" },
      { name: "Light blue", hex: "#A8C9E0" },
    ],
    image:
      "https://static.zara.net/assets/public/fc57/6ce1/0b854f978d8b/982e7eedfe80/05584431507-p/05584431507-p.jpg?ts=1785919742238&w=1024",
    url: "https://www.zara.com/uk/en/relaxed-fit-interlock-t-shirt--04-p05584471.html?v1=545425838&v2=2432042",
  },
  {
    id: "zara-relaxed-fit-knit-t-shirt-camel",
    name: "Relaxed Fit Knit T Shirt",
    brand: "Zara",
    price: "29.99 GBP",
    color: "Camel",
    colors: [
      { name: "Camel", hex: "#928374" },
      { name: "Blue / grey", hex: "#C0C5C8" },
      { name: "Turquoise", hex: "#41A2AE" },
      { name: "Oyster-white", hex: "#EFE4D2" },
    ],
    image:
      "https://static.zara.net/assets/public/388f/bb7d/12e04dcf876e/0cd91195f9ab/09598441707-p/09598441707-p.jpg?ts=1785853957777&w=1024",
    url: "https://www.zara.com/uk/en/relaxed-fit-knit-t-shirt-p09598441.html?v1=545479345&v2=2432042",
  },
  {
    id: "zara-textured-regular-fit-knit-polo-shirt-navy-blue",
    name: "Textured Regular Fit Knit Polo Shirt",
    brand: "Zara",
    price: "35.99 GBP",
    color: "Navy blue",
    colors: [
      { name: "Navy blue", hex: "#2A323D" },
      { name: "Green", hex: "#398464" },
      { name: "Chocolate", hex: "#38302A" },
      { name: "Oyster-white", hex: "#FCF5E8" },
    ],
    image:
      "https://static.zara.net/assets/public/fe34/aafb/1ac34c02b817/6c69a27c2ebc/03332410401-p/03332410401-p.jpg?ts=1785853958309&w=1024",
    url: "https://www.zara.com/uk/en/textured-regular-fit-knit-polo-shirt-p03332410.html?v1=545485573&v2=2727947",
  },
  {
    id: "zara-relaxed-fit-knit-t-shirt-oyster-white",
    name: "Relaxed Fit Knit T Shirt",
    brand: "Zara",
    price: "29.99 GBP",
    color: "Oyster-white",
    colors: [
      { name: "Oyster-white", hex: "#EFE4D2" },
      { name: "Blue / grey", hex: "#C0C5C8" },
      { name: "Turquoise", hex: "#41A2AE" },
      { name: "Camel", hex: "#928374" },
    ],
    image:
      "https://static.zara.net/assets/public/b59a/49c6/d00e43caa26f/684dc84a0959/09598441251-p/09598441251-p.jpg?ts=1768569417137&w=1024",
    url: "https://www.zara.com/uk/en/relaxed-fit-knit-t-shirt-p09598441.html?v1=545479344&v2=2727947",
  },
  {
    id: "zara-relaxed-fit-embroidered-text-polo-shirt-light-blue",
    name: "Relaxed Fit Embroidered Text Polo Shirt",
    brand: "Zara",
    price: "35.99 GBP",
    color: "Light blue",
    colors: [
      { name: "Light blue", hex: "#74A9DC" },
      { name: "Bottle green", hex: "#1D4541" },
      { name: "Oyster-white", hex: "#E6E6DF" },
    ],
    image:
      "https://static.zara.net/assets/public/2d9d/5cfe/88db450fb425/2b0e89897a65/04087350406-p/04087350406-p.jpg?ts=1785417606214&w=1024",
    url: "https://www.zara.com/uk/en/relaxed-fit-embroidered-text-polo-shirt-p04087350.html?v1=548909888&v2=2727947",
  },
  {
    id: "zara-contrast-regular-fit-polo-shirt-oyster-white",
    name: "Contrast Regular Fit Polo Shirt",
    brand: "Zara",
    price: "29.99 GBP",
    color: "Oyster-white",
    colors: [
      { name: "Oyster-white", hex: "#F9F6F0" },
      { name: "Navy blue", hex: "#202434" },
    ],
    image:
      "https://static.zara.net/assets/public/c3df/fcf3/0e26458cb28f/8d5423ef37ef/04092449251-p/04092449251-p.jpg?ts=1785825514180&w=1024",
    url: "https://www.zara.com/uk/en/contrast-regular-fit-polo-shirt-p04092449.html?v1=547044508&v2=2727947",
  },
  {
    id: "zara-100-linen-regular-fit-trousers-navy-blue",
    name: "100% Linen Regular Fit Trousers",
    brand: "Zara",
    price: "39.99 GBP",
    color: "Navy blue",
    colors: [
      { name: "Navy blue", hex: "#2A323D" },
      { name: "Brown", hex: "#38302A" },
      { name: "Black", hex: "#242524" },
      { name: "White", hex: "#F9F6F0" },
      { name: "Light beige", hex: "#CFC2B7" },
      { name: "Mink", hex: "#564A3C" },
    ],
    image:
      "https://static.zara.net/assets/public/ebfd/2e7d/0e6044a0824c/ef7ebb0d6078/04410012401-p/04410012401-p.jpg?ts=1772728967979&w=1024",
    url: "https://www.zara.com/uk/en/100-linen-regular-fit-trousers-p05070012.html?v1=545456679",
  },
  {
    id: "zara-textured-relaxed-fit-pleated-trousers-light-beige",
    name: "Textured Relaxed Fit Pleated Trousers",
    brand: "Zara",
    price: "39.99 GBP",
    color: "Light beige",
    colors: [
      { name: "Light beige", hex: "#ACA492" },
      { name: "White", hex: "#F9F6F0" },
      { name: "Grey green", hex: "#60594E" },
    ],
    image:
      "https://static.zara.net/assets/public/4487/f648/4b95405786b4/6bcb6a3d7db8/00706920052-p/00706920052-p.jpg?ts=1785768690828&w=1024",
    url: "https://www.zara.com/uk/en/relaxed-fit-textured-pleated-trousers-p00706920.html?v1=548761351",
  },
  {
    id: "zara-geometric-jacquard-relaxed-fit-shirt-black",
    name: "Geometric Jacquard Relaxed Fit Shirt",
    brand: "Zara",
    price: "35.99 GBP",
    color: "Black",
    colors: [
      { name: "Black", hex: "#0A0A0A" },
      { name: "Green", hex: "#2D332D" },
    ],
    image:
      "https://static.zara.net/assets/public/2d9b/f968/1d9846038819/7b7452f5bb98/01450300800-p/01450300800-p.jpg?ts=1782397319623&w=1024",
    url: "https://www.zara.com/uk/en/geometric-jacquard-relaxed-fit-shirt-p01450300.html?v1=545496261&v2=2431994",
  },
  {
    id: "zara-textured-regular-fit-shirt-charcoal",
    name: "Textured Regular Fit Shirt",
    brand: "Zara",
    price: "35.99 GBP",
    color: "Charcoal",
    image:
      "https://static.zara.net/assets/public/05db/663f/5b884f588f5a/7d48ba1cd029/04795417822-p/04795417822-p.jpg?ts=1782226377442&w=1024",
    url: "https://www.zara.com/uk/en/textured-regular-fit-shirt-p04795417.html?v1=545465839&v2=2431994",
  },
  {
    id: "zara-relaxed-fit-flowing-shirt-black",
    name: "Relaxed Fit Flowing Shirt",
    brand: "Zara",
    price: "45.99 GBP",
    color: "Black",
    colors: [
      { name: "Black", hex: "#0A0A0A" },
      { name: "Grey / tan", hex: "#CEC3B2" },
      { name: "Brown", hex: "#3D2E2D" },
      { name: "Mid-ecru", hex: "#EDE4D8" },
    ],
    image:
      "https://static.zara.net/assets/public/0ee9/40c0/15cf45d1972a/81e1dd0c7a9e/00706923800-p/00706923800-p.jpg?ts=1786091483445&w=1024",
    url: "https://www.zara.com/uk/en/relaxed-fit-flowing-shirt-p04364653.html?v1=545412607&v2=2431994",
  },
  {
    id: "springfield-polo-estructura-moulinee-kaki",
    name: "Moulinee Texture Polo Shirt",
    nameOriginal: "Polo estructura moulinee",
    brand: "Springfield",
    price: "12.99 EUR",
    color: "Kaki",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw7101f7cb/images/hi-res/P_142426193FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/polos/polo-estructura-moulinee/1424261.html?dwvar_1424261_color=93",
  },
  {
    id: "springfield-camisa-manga-corta-vuelta-verde",
    name: "Short Sleeve Turn Up Shirt",
    nameOriginal: "Camisa manga corta vuelta",
    brand: "Springfield",
    price: "12.99 EUR",
    color: "Verde",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw51f55a92/images/hi-res/P_034404323FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/camisas/camisa-manga-corta-vuelta/0344043.html?dwvar_0344043_color=23",
  },
  {
    id: "springfield-camiseta-color-block-naranja",
    name: "Colour Block T Shirt",
    nameOriginal: "Camiseta color block",
    brand: "Springfield",
    price: "9.99 EUR",
    color: "Naranja",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw92f684f8/images/hi-res/P_026421465FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/camisetas/camiseta-color-block/0264214.html?dwvar_0264214_color=65",
  },
  {
    id: "springfield-camiseta-waffle-doble-azul",
    name: "Double Waffle T Shirt",
    nameOriginal: "Camiseta waffle doble",
    brand: "Springfield",
    price: "9.99 EUR",
    color: "Azul",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw56f2c299/images/hi-res/P_328435511FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/camisetas/camiseta-waffle-doble/3284355.html?dwvar_3284355_color=11",
  },
  {
    id: "springfield-camiseta-waffle-doble-blanco",
    name: "Double Waffle T Shirt",
    nameOriginal: "Camiseta waffle doble",
    brand: "Springfield",
    price: "9.99 EUR",
    color: "Blanco",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw2b8494ba/images/hi-res/P_328435597FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/camisetas/camiseta-waffle-doble/3284355.html?dwvar_3284355_color=97",
  },
  {
    id: "springfield-bermuda-tecnica-wide-relaxed-fit-azul",
    name: "Technical Wide Relaxed Fit Shorts",
    nameOriginal: "Bermuda técnica wide & relaxed fit",
    brand: "Springfield",
    price: "12.99 EUR",
    color: "Azul",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dwd0be3dd2/images/hi-res/P_043425615FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/pantalones/bermudas/bermuda-tecnica-wide-relaxed-fit/0434256.html?dwvar_0434256_color=15",
  },
  {
    id: "springfield-camiseta-pique-manga-larga-bloques-azul",
    name: "Long Sleeve Pique Colour Block T Shirt",
    nameOriginal: "Camiseta piqué manga larga bloques",
    brand: "Springfield",
    price: "16.09 EUR",
    color: "Azul",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw082e5ca9/images/hi-res/P_883433411FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/camisetas/camiseta-pique-manga-larga-bloques/8834334.html?dwvar_8834334_color=11",
  },
  {
    id: "springfield-sudadera-bici-caja-burdeos",
    name: "Boxed Bike Sweatshirt",
    nameOriginal: "Sudadera bici caja",
    brand: "Springfield",
    price: "23.09 EUR",
    color: "Burdeos",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dwe18823b9/images/hi-res/P_009458168FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/sudaderas/sudadera-bici-caja/0094581.html?dwvar_0094581_color=68",
  },
  {
    id: "springfield-camisa-manga-corta-beige",
    name: "Short Sleeve Shirt",
    nameOriginal: "Camisa manga corta",
    brand: "Springfield",
    price: "14.99 EUR",
    color: "Beige",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dwc92f985f/images/hi-res/P_235011250FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/camisas/camisa-manga-corta/2350112.html?dwvar_2350112_color=50",
  },
  {
    id: "springfield-camisa-vaquera-regular-fit-gris",
    name: "Regular Fit Denim Shirt",
    nameOriginal: "Camisa vaquera regular fit",
    brand: "Springfield",
    price: "39.99 EUR",
    color: "Gris",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw11ef6c64/images/hi-res/P_285038747FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/camisas/camisa-vaquera-regular-fit/2850387.html?dwvar_2850387_color=47",
  },
  {
    id: "springfield-camisa-lisa-negro",
    name: "Plain Shirt",
    nameOriginal: "Camisa Lisa",
    brand: "Springfield",
    price: "26.99 EUR",
    color: "Negro",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw1bc90df1/images/hi-res/P_285030801FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/camisas/camisa-lisa/2850308.html?dwvar_2850308_color=01",
  },
  {
    id: "springfield-camisa-manga-corta-rayas-azul",
    name: "Striped Short Sleeve Shirt",
    nameOriginal: "Camisa manga corta rayas",
    brand: "Springfield",
    price: "20.99 EUR",
    color: "Azul",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw0c0da9ab/images/hi-res/P_235004914FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/camisas/camisa-manga-corta-rayas/2350049.html?dwvar_2350049_color=14",
  },
  {
    id: "springfield-camisa-manga-corta-bowling-lino-tostado",
    name: "Linen Bowling Short Sleeve Shirt",
    nameOriginal: "Camisa manga corta bowling lino",
    brand: "Springfield",
    price: "9.99 EUR",
    color: "Tostado",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw16f21c87/images/swatch/P_054302566C.jpg",
    url: "https://myspringfield.com/es/es/hombre/camisas/camisa-manga-corta-bowling-lino/0543025.html?dwvar_0543025_color=35",
  },
  {
    id: "springfield-pantalon-chino-slim-fit-beige",
    name: "Slim Fit Chinos",
    nameOriginal: "Pantalón chino slim fit",
    brand: "Springfield",
    price: "27.99 EUR",
    color: "Beige",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw9355042c/images/hi-res/P_155493651FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/pantalones/pantalon-chino-slim-fit/1554936.html?dwvar_1554936_color=51",
  },
  {
    id: "springfield-pantalon-chino-comfort-knit-beige",
    name: "Comfort Knit Chinos",
    nameOriginal: "Pantalón chino comfort knit",
    brand: "Springfield",
    price: "27.99 EUR",
    color: "Beige",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw948f4523/images/hi-res/P_155494951FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/pantalones/pantalon-chino-comfort-knit/1554949.html?dwvar_1554949_color=51",
  },
  {
    id: "springfield-bermuda-tecnica-wide-relaxed-fit-estampado",
    name: "Technical Wide Relaxed Fit Shorts",
    nameOriginal: "Bermuda técnica wide & relaxed fit",
    brand: "Springfield",
    price: "12.99 EUR",
    color: "Estampado",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dwa81b98b8/images/hi-res/P_043425629FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/pantalones/bermudas/bermuda-tecnica-wide-relaxed-fit/0434256.html?dwvar_0434256_color=29",
  },
  {
    id: "springfield-bermuda-comfort-fit-nude",
    name: "Comfort Fit Shorts",
    nameOriginal: "Bermuda comfort fit",
    brand: "Springfield",
    price: "12.99 EUR",
    color: "Nude",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dwfa380c59/images/hi-res/P_043425738FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/pantalones/bermudas/bermuda-comfort-fit/0434257.html?dwvar_0434257_color=38",
  },
  {
    id: "springfield-bermuda-comfort-fit-azul",
    name: "Comfort Fit Shorts",
    nameOriginal: "Bermuda comfort fit",
    brand: "Springfield",
    price: "12.99 EUR",
    color: "Azul",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw5aaf8007/images/hi-res/P_043425716FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/pantalones/bermudas/bermuda-comfort-fit/0434257.html?dwvar_0434257_color=16",
  },
  {
    id: "springfield-bermuda-5-bolsillos-lavada-straight-fit-azul",
    name: "Washed Five Pocket Straight Fit Shorts",
    nameOriginal: "Bermuda 5 bolsillos lavada straight fit",
    brand: "Springfield",
    price: "9.99 EUR",
    color: "Azul",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw89eb05f6/images/hi-res/P_713300612FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/pantalones/bermudas/bermuda-5-bolsillos-lavada-straight-fit/7133006.html?dwvar_7133006_color=12",
  },
  {
    id: "springfield-bermuda-ligera-popelin-regular-beige",
    name: "Lightweight Poplin Regular Shorts",
    nameOriginal: "Bermuda ligera popelín regular",
    brand: "Springfield",
    price: "19.90 EUR",
    color: "Beige",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-ooto-master-catalog/default/dw3886bcf7/images/hi-res/P_161400155FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/pantalones/bermudas/bermuda-ligera-popelin-regular/1614001.html?dwvar_1614001_color=55",
  },
  {
    id: "springfield-short-jogger-algodon-azul",
    name: "Cotton Jogger Shorts",
    nameOriginal: "Short jogger algodón",
    brand: "Springfield",
    price: "22.49 EUR",
    color: "Azul",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw191c0da0/images/hi-res/P_779315510FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/pantalones/bermudas/short-jogger-algodon/7793155.html?dwvar_7793155_color=10",
  },
  {
    id: "springfield-short-chandal-negro",
    name: "Track Shorts",
    nameOriginal: "Short chandal",
    brand: "Springfield",
    price: "9.99 EUR",
    color: "Negro",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dwe8ed2fc9/images/hi-res/P_407022401FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/pantalones/bermudas/short-chandal/4070224.html?dwvar_4070224_color=01",
  },
  {
    id: "springfield-bermuda-textura-negro",
    name: "Textured Shorts",
    nameOriginal: "Bermuda textura",
    brand: "Springfield",
    price: "10.99 EUR",
    color: "Negro",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dwc1fb88b1/images/hi-res/P_779325701FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/pantalones/bermudas/bermuda-textura/7793257.html?dwvar_7793257_color=01",
  },
  {
    id: "springfield-short-jogger-lino-azul",
    name: "Linen Jogger Shorts",
    nameOriginal: "Short jogger lino",
    brand: "Springfield",
    price: "19.99 EUR",
    color: "Azul",
    image:
      "https://myspringfield.com/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dw0846bfe7/images/hi-res/P_407023610FM.jpg",
    url: "https://myspringfield.com/es/es/hombre/pantalones/bermudas/short-jogger-lino/4070236.html?dwvar_4070236_color=10",
  },
  {
    id: "carhartt-ebbert-sweatshirt-black-white",
    name: "Ebbert Sweatshirt, Black / White",
    brand: "Carhartt WIP",
    price: "138.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/2193/5809/files/I037113_0D2_XX-ST-01.jpg?v=1784914359&width=1400",
    url: "https://us.carhartt-wip.com/en-us/products/ebbett-sweatshirt-black-white-162?Size=S",
  },
  {
    id: "carhartt-oakland-shirt-jacket-blue-dark-navy-worn-used-wash",
    name: "Oakland Shirt Jacket, Blue / Dark Navy (worn used wash)",
    brand: "Carhartt WIP",
    price: "248.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/2193/5809/files/I037532_453_4Q-ST-01.jpg?v=1784309484&width=1400",
    url: "https://us.carhartt-wip.com/en-us/products/oakland-shirt-jac-blue-dark-navy-worn-used-wash-43?Size=S",
  },
  {
    id: "carhartt-lambert-t-shirt-raven",
    name: "Lambert T Shirt, Raven",
    brand: "Carhartt WIP",
    price: "65.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/2193/5809/files/I037016_3T6_FQ-ST-01.jpg?v=1784741567&width=1400",
    url: "https://us.carhartt-wip.com/en-us/products/s-s-lambert-t-shirt-raven-moon-wash-674?Size=S",
  },
  {
    id: "carhartt-brandon-pant-black-marble-used-wash",
    name: "Brandon Pant, Black (marble used wash)",
    brand: "Carhartt WIP",
    price: "188.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/2193/5809/files/I035893_89_7X-ST-01_7517a856-259c-48b7-b832-5e1d7e9f06de.jpg?v=1782408833&width=1400",
    url: "https://us.carhartt-wip.com/en-us/products/brandon-pant-black-marble-used-wash-572?Size=XS",
  },
  {
    id: "carhartt-vista-t-shirt-dark-scarab",
    name: "Vista T Shirt, Dark Scarab",
    brand: "Carhartt WIP",
    price: "68.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/2193/5809/files/I030780_3U0_GD-ST-01.jpg?v=1784741564&width=1400",
    url: "https://us.carhartt-wip.com/en-us/products/s-s-vista-t-shirt-dark-scarab-garment-dyed-1379?Size=S",
  },
  {
    id: "carhartt-blackletter-t-shirt-black",
    name: "Blackletter T Shirt, Black",
    brand: "Carhartt WIP",
    price: "58.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/2193/5809/files/I037245_89_XX-ST-01.jpg?v=1784914355&width=1400",
    url: "https://us.carhartt-wip.com/en-us/products/s-s-blackletter-script-t-shirt-black-212?Size=S",
  },
  {
    id: "carhartt-long-sleeve-blackletter-waffle-t-shirt-black-white",
    name: "Long Sleeve Blackletter Waffle T Shirt, Black / White",
    brand: "Carhartt WIP",
    price: "95.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/2193/5809/files/I037270_0D2_XX-ST-01.jpg?v=1783099874&width=1400",
    url: "https://us.carhartt-wip.com/en-us/products/l-s-blackletter-waffle-t-shirt-black-white-136?Size=S",
  },
  {
    id: "carhartt-brandon-pant-black-tobacco-used-wash",
    name: "Brandon Pant, Black (tobacco used wash)",
    brand: "Carhartt WIP",
    price: "188.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/2193/5809/files/I035893_89_0R-OF-03.jpg?v=1783445482&width=1400",
    url: "https://us.carhartt-wip.com/en-us/products/brandon-pant-black-marble-dark-worn-573?Size=XS",
  },
  {
    id: "ami-white-cotton-t-shirt-with-ami-de-coeur-arrow",
    name: "White cotton t shirt with Ami de Coeur arrow",
    brand: "Ami Paris",
    price: "230.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/0774/7865/8352/files/HTS411.JE0270_160eb8f1-5bd3-4f72-a2e2-5acc009e646c.jpg?width=1400",
    url: "https://www.amiparis.com/en-us/products/white-cotton-t-shirt-with-ami-de-coeur-arrow-hts411je0270100",
  },
  {
    id: "ami-white-cotton-t-shirt-with-ami-de-coeur",
    name: "White cotton t shirt with Ami de Coeur",
    brand: "Ami Paris",
    price: "190.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/0774/7865/8352/files/BFUTS035.724_22f9e4e7-93bf-4923-9867-50b8e1b03d30.jpg?width=1400",
    url: "https://www.amiparis.com/en-us/products/white-cotton-red-ami-de-coeur-t-shirt-bfuts035724100",
  },
  {
    id: "ami-black-cotton-t-shirt-with-ami-de-coeur",
    name: "Black cotton t shirt with Ami de Coeur",
    brand: "Ami Paris",
    price: "190.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/0774/7865/8352/files/BFUTS035.724_fcc51069-a0b6-4f43-b1c8-34b4f5911721.jpg?width=1400",
    url: "https://www.amiparis.com/en-us/products/black-cotton-red-ami-de-coeur-t-shirt-bfuts035724001",
  },
  {
    id: "ami-black-contrasted-cotton-t-shirt-with-ami-de-coeur",
    name: "Black contrasted cotton t shirt with Ami de Coeur",
    brand: "Ami Paris",
    price: "240.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/0774/7865/8352/files/HTS412.JE0246.jpg?width=1400",
    url: "https://www.amiparis.com/en-us/products/black-contrasted-cotton-t-shirt-with-ami-de-coeur-hts412je0246044",
  },
  {
    id: "ami-blue-cotton-t-shirt-with-ami-de-coeur",
    name: "Blue cotton t shirt with Ami de Coeur",
    brand: "Ami Paris",
    price: "190.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/0774/7865/8352/files/BFUTS035.724_e55187fb-81c1-4fa9-b97d-c16b52a8a04d.jpg?width=1400",
    url: "https://www.amiparis.com/en-us/products/blue-cotton-red-ami-de-coeur-t-shirt-bfuts035724430",
  },
  {
    id: "ami-blue-cotton-boxy-embroidered-ami-de-coeur-shirt",
    name: "Blue Cotton Boxy Embroidered Ami De Coeur Shirt",
    brand: "Ami Paris",
    price: "440.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/0774/7865/8352/files/HSH822.CO0221_79017bbc-c0b5-440a-867a-289f1b2ef0a0.jpg?width=1400",
    url: "https://www.amiparis.com/en-us/products/blue-cotton-boxy-embroidered-ami-de-coeur-shirt-hsh822co0221484",
  },
  {
    id: "ami-black-cotton-sweatshirt-with-ami-de-coeur",
    name: "Black cotton sweatshirt with Ami de Coeur",
    brand: "Ami Paris",
    price: "360.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/0774/7865/8352/files/BFUSW035.730_953dfd9b-8cf6-437e-8e03-6f08840c7db7.jpg?width=1400",
    url: "https://www.amiparis.com/en-us/products/black-cotton-red-ami-de-coeur-sweatshirt-bfusw035730001",
  },
  {
    id: "ami-white-wool-ami-de-coeur-crewneck-sweater",
    name: "White Wool Ami De Coeur Crewneck Sweater",
    brand: "Ami Paris",
    price: "550.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/0774/7865/8352/files/UKS838.018_e4049d34-cb5c-495a-a0ce-baf3b0a1dca2.jpg?width=1400",
    url: "https://www.amiparis.com/en-us/products/white-wool-ami-de-coeur-crewneck-sweater-uks838018151",
  },
  {
    id: "ami-natural-crewneck-wool-sweater-with-ami-de-coeur",
    name: "Natural crewneck wool sweater with Ami de Coeur",
    brand: "Ami Paris",
    price: "550.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/0774/7865/8352/files/UKS838.018_53441b5e-19e2-4cdc-b5ca-4b0dce0263c9.jpg?width=1400",
    url: "https://www.amiparis.com/en-us/products/white-wool-ami-de-coeur-crewneck-sweater-uks838018154",
  },
  {
    id: "ami-blue-crewneck-wool-sweater-with-ami-de-coeur",
    name: "Blue crewneck wool sweater with Ami de Coeur",
    brand: "Ami Paris",
    price: "440.00 USD",
    image:
      "https://cdn.shopify.com/s/files/1/0774/7865/8352/files/HKS826.001_13407a27-dd88-491d-aadd-aef746700d10.jpg?width=1400",
    url: "https://www.amiparis.com/en-us/products/blue-wool-ami-de-coeur-crewneck-sweater-hks826001414",
  },
  {
    id: "uniqlo-super-non-iron-jersey-slim-shirt-regular-collar-white",
    name: "Super Non Iron Jersey Slim Shirt, Regular Collar",
    brand: "UNIQLO",
    price: "49.90 USD",
    color: "White",
    image:
      "https://image.uniqlo.com/UQ/ST3/WesternCommon/imagesgoods/473535/item/goods_00_473535_3x4.jpg",
    url: "https://www.uniqlo.com/us/en/products/E473535-000/00?colorDisplayCode=00&sizeDisplayCode=004",
  },
  {
    id: "uniqlo-washable-knitted-skipper-polo-sweater-dark-purple",
    name: "Washable Knitted Skipper Polo Sweater",
    brand: "UNIQLO",
    price: "39.90 USD",
    color: "Dark Purple",
    image:
      "https://image.uniqlo.com/UQ/ST3/us/imagesgoods/482328/item/usgoods_79_482328_3x4.jpg",
    url: "https://www.uniqlo.com/us/en/products/E482328-000/00?colorDisplayCode=79&sizeDisplayCode=003",
  },
  {
    id: "uniqlo-flannel-shirt-black",
    name: "Flannel Shirt",
    brand: "UNIQLO",
    price: "49.90 USD",
    color: "Black",
    image:
      "https://image.uniqlo.com/UQ/ST3/us/imagesgoods/470182/item/usgoods_09_470182_3x4.jpg",
    url: "https://www.uniqlo.com/us/en/products/E470182-000/00?colorDisplayCode=09&sizeDisplayCode=003",
  },
  {
    id: "uniqlo-washable-milano-ribbed-skipper-polo-sweater-gray",
    name: "Washable Milano Ribbed Skipper Polo Sweater",
    brand: "UNIQLO",
    price: "49.90 USD",
    color: "Gray",
    image:
      "https://image.uniqlo.com/UQ/ST3/us/imagesgoods/482325/item/usgoods_07_482325_3x4.jpg",
    url: "https://www.uniqlo.com/us/en/products/E482325-000/00?colorDisplayCode=07&sizeDisplayCode=003",
  },
  {
    id: "uniqlo-airism-cotton-pique-full-open-polo-shirt-white",
    name: "AIRism Cotton Pique Full Open Polo Shirt",
    brand: "UNIQLO",
    price: "19.90 USD",
    color: "White",
    image:
      "https://image.uniqlo.com/UQ/ST3/us/imagesgoods/482303/item/usgoods_00_482303_3x4.jpg",
    url: "https://www.uniqlo.com/us/en/products/E482303-000/00?colorDisplayCode=00&sizeDisplayCode=003",
  },
  {
    id: "uniqlo-boxy-cropped-t-shirt-white",
    name: "Boxy Cropped T Shirt",
    brand: "UNIQLO",
    price: "19.90 USD",
    color: "White",
    image:
      "https://image.uniqlo.com/UQ/ST3/us/imagesgoods/487962/item/usgoods_00_487962_3x4.jpg",
    url: "https://www.uniqlo.com/us/en/products/E487962-000/00?colorDisplayCode=00&sizeDisplayCode=003",
  },
  {
    id: "uniqlo-airism-cotton-oversized-t-shirt-half-sleeve-white",
    name: "AIRism Cotton Oversized T Shirt, Half Sleeve",
    brand: "UNIQLO",
    price: "24.90 USD",
    color: "White",
    image:
      "https://image.uniqlo.com/UQ/ST3/us/imagesgoods/465185/item/usgoods_00_465185_3x4.jpg",
    url: "https://www.uniqlo.com/us/en/products/E465185-000/00?colorDisplayCode=00&sizeDisplayCode=003",
  },
  {
    id: "uniqlo-airism-cotton-t-shirt-sleeveless-green",
    name: "AIRism Cotton T Shirt, Sleeveless",
    brand: "UNIQLO",
    price: "19.90 USD",
    color: "Green",
    image:
      "https://image.uniqlo.com/UQ/ST3/us/imagesgoods/457517/item/usgoods_53_457517_3x4.jpg",
    url: "https://www.uniqlo.com/us/en/products/E457517-000/00?colorDisplayCode=53&sizeDisplayCode=003",
  },
  {
    id: "uniqlo-dry-waffle-henley-t-shirt-natural",
    name: "DRY Waffle Henley T Shirt",
    brand: "UNIQLO",
    price: "19.90 USD",
    color: "Natural",
    image:
      "https://image.uniqlo.com/UQ/ST3/us/imagesgoods/483924/item/usgoods_30_483924_3x4.jpg",
    url: "https://www.uniqlo.com/us/en/products/E483924-000/00?colorDisplayCode=30&sizeDisplayCode=003",
  },
  {
    id: "barbour-cotton-quarter-zip-jumper",
    name: "Cotton Quarter Zip Jumper",
    brand: "Barbour",
    price: "140.00 USD",
    image:
      "https://www.barbour.com/dw/image/v2/blcl_prd/on/demandware.static/-/Sites-master-catalog/default/dwc8dff084/images/MKN1074OL91/MKN1074OL91_01front.jpg?sw=1500&q=70&strip=false",
    url: "https://www.barbour.com/us/cotton-quarter-zip-jumper-MKN1074OL91.html",
  },
  {
    id: "barbour-pima-cotton-crew-neck-jumper",
    name: "Pima Cotton Crew Neck Jumper",
    brand: "Barbour",
    price: "120.00 USD",
    image:
      "https://www.barbour.com/dw/image/v2/blcl_prd/on/demandware.static/-/Sites-master-catalog/default/dwec80fdd8/images/MKN0932GN34/MKN0932GN34_01front.jpg?sw=1500&q=70&strip=false",
    url: "https://www.barbour.com/us/pima-cotton-crew-neck-jumper-MKN0932GN34.html",
  },
];
