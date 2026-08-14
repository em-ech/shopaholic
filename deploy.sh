#!/usr/bin/env bash
# Publishes the current state of the shopping list to GitHub Pages.
# Usage: ./deploy.sh "add toteme scarf jacket"
set -euo pipefail

cd "$(dirname "$0")"

MESSAGE="${1:-update shopping list}"

if [ -z "$(git status --porcelain)" ]; then
  echo "Nothing to publish. No files changed."
  exit 0
fi

git add -A
git commit -m "$MESSAGE"
git push origin main

echo
echo "Pushed. GitHub Pages usually goes live within a minute:"
echo "https://em-ech.github.io/shopping-list/"
