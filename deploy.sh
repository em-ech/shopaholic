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
