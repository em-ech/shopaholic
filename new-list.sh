#!/usr/bin/env bash
# Creates a new list for another person.
#
# Usage: ./new-list.sh jared "Jared's Intervention"
#
# Makes a folder, seeds its products.js, and generates its page shell. After
# this, add products to <slug>/products.js and run ./deploy.sh.
set -euo pipefail

cd "$(dirname "$0")"

SLUG="${1:-}"
TITLE="${2:-}"

if [ -z "$SLUG" ] || [ -z "$TITLE" ]; then
  echo "Usage: ./new-list.sh <slug> \"<Title>\"" >&2
  echo "Example: ./new-list.sh jared \"Jared's Intervention\"" >&2
  exit 1
fi

# The slug becomes both the folder name and the saved hearts storage key, so
# it is kept to something that is safe in a URL and stable forever.
if ! printf '%s' "$SLUG" | grep -Eq '^[a-z0-9]+(-[a-z0-9]+)*$'; then
  echo "Slug must be lowercase letters and numbers, separated by single dashes." >&2
  echo "Got: $SLUG" >&2
  exit 1
fi

if [ -e "$SLUG" ]; then
  echo "$SLUG already exists. Edit $SLUG/products.js instead." >&2
  exit 1
fi

mkdir "$SLUG"

cat >"$SLUG/products.js" <<EOF
/* ==========================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT FOR THIS LIST.

   Required on every product:  name, price, image, url
   Optional:                   id, brand, color, colors, note, logo

   See the root products.js for the full notes on each field.
   ========================================================================== */

window.COLLECTION = {
  // Saved hearts are stored against this id. Never change it once published.
  id: "$SLUG",
  title: "$TITLE",
  // Set to false to show brand names as plain text instead of retailer icons.
  autoLogos: true,
};

window.PRODUCTS = [];
EOF

./sync-lists.sh

echo
echo "Created $SLUG. Add products to $SLUG/products.js, then run ./deploy.sh."
