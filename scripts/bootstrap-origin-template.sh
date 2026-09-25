#!/usr/bin/env bash
set -euo pipefail

TEMPLATE_REPO="santiagotellier/real-estate-template"
TARGET_DIR="${1:-/workspace/.template/real-estate-template}"

if [[ -d "$TARGET_DIR/.git" ]]; then
  echo "Template already present at $TARGET_DIR"
  exit 0
fi

if [[ -z "${CURSOR_AUTH_TOKEN:-}" && -z "${CURSOR_API_KEY:-}" ]]; then
  echo "WARN: CURSOR_AUTH_TOKEN / CURSOR_API_KEY not set; skipping Origin clone of $TEMPLATE_REPO"
  exit 0
fi

mkdir -p "$(dirname "$TARGET_DIR")"
origin repo clone "$TEMPLATE_REPO" "$TARGET_DIR"
echo "Cloned $TEMPLATE_REPO to $TARGET_DIR"
