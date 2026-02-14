#!/bin/bash

# Sync Font Awesome files from node_modules to static folder
# This script copies the necessary CSS and font files for self-hosting

set -e

FONTAWESOME_VERSION="7.0.1"
SOURCE_DIR="node_modules/@fortawesome/fontawesome-free"
TARGET_CSS="static/css/fontawesome"
# CSS uses ../webfonts/ relative path, so fonts must be in css/webfonts/
TARGET_FONTS="static/css/webfonts"

echo "Syncing Font Awesome v${FONTAWESOME_VERSION}..."

# Create target directories
mkdir -p "${TARGET_CSS}"
mkdir -p "${TARGET_FONTS}"

# Copy CSS files
cp "${SOURCE_DIR}/css/all.min.css" "${TARGET_CSS}/"
cp "${SOURCE_DIR}/css/all.css" "${TARGET_CSS}/"

# Copy font files
cp "${SOURCE_DIR}/webfonts/"* "${TARGET_FONTS}/"

echo "Font Awesome synced successfully!"
echo "CSS files: ${TARGET_CSS}/"
echo "Font files: ${TARGET_FONTS}/"
