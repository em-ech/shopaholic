#!/usr/bin/env bash
# Publishes every list to GitHub Pages.
# Usage: ./deploy.sh "add lululemon abc trouser"
set -euo pipefail

cd "$(dirname "$0")"

MESSAGE="${1:-update shopping list}"

# GitHub Pages serves one branch. Pushing main from anywhere else would publish
# whatever main happened to be pointing at, not the work in hand.
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$BRANCH" != "main" ]; then
  echo "You are on '$BRANCH'. Pages publishes main only." >&2
  echo "Merge first:  git checkout main && git merge $BRANCH" >&2
  exit 1
fi

# GitHub Pages serves assets with a ten minute cache, and browsers hold them
# longer still, so a visitor can sit on yesterday's app.js against today's
# products.js. Stamping the asset urls makes every deploy a new url, which no
# cache can serve stale. Only the shared assets are stamped: products.js is
# relative to each list's own folder.
STAMP="$(date -u +%Y%m%d%H%M%S)"
sed -i '' -E \
  -e "s|(href=\"styles\.css)(\?v=[0-9]+)?\"|\1?v=$STAMP\"|" \
  -e "s|(src=\"app\.js)(\?v=[0-9]+)?\"|\1?v=$STAMP\"|" \
  -e "s|(src=\"products\.js)(\?v=[0-9]+)?\"|\1?v=$STAMP\"|" \
  index.html
echo "Stamped assets v=$STAMP"

# The page shell is shared, so every list is brought back in step first.
./sync-lists.sh
echo

if [ -z "$(git status --porcelain)" ]; then
  echo "Nothing to publish. No files changed."
  exit 0
fi

git add -A
git commit -m "$MESSAGE"
git push origin main

# The mirror is a second remote rather than a second copy of the files, so the
# two repos are the same commits and cannot drift. A mirror that is missing or
# unreachable must never stop the published site from updating.
if git remote get-url mirror >/dev/null 2>&1; then
  if git push mirror main; then
    echo "Mirrored to $(git remote get-url mirror)"
  else
    echo "WARNING: push to mirror failed. origin is published and up to date." >&2
  fi
fi

# Read off the remote so these cannot go stale if the repo is ever renamed.
REMOTE="$(git remote get-url origin)"
OWNER="$(basename "$(dirname "$REMOTE")")"
REPO="$(basename "$REMOTE" .git)"
BASE="https://${OWNER}.github.io/${REPO}"

echo
echo "Pushed. GitHub Pages usually goes live within a minute:"
echo "  $BASE/"
for manifest in */products.js; do
  [ -e "$manifest" ] || continue
  echo "  $BASE/$(dirname "$manifest")/"
done
