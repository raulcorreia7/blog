#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-./public}"

if [[ ! -d "${TARGET_DIR}" ]]; then
  echo "Target directory not found: ${TARGET_DIR}" >&2
  exit 1
fi

echo "Optimizing images in ${TARGET_DIR}..."

IMAGES_BEFORE=$(find "${TARGET_DIR}" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" \) | wc -l)
SIZE_BEFORE=$(du -sh "${TARGET_DIR}" | cut -f1)
echo "Images before: ${IMAGES_BEFORE}"
echo "Size before: ${SIZE_BEFORE}"

# Optimize JPEG images
find "${TARGET_DIR}" -type f \( -name "*.jpg" -o -name "*.jpeg" \) -exec mogrify \
  -strip \
  -quality 90 \
  -interlace Plane \
  {} +

# Optimize PNG images
find "${TARGET_DIR}" -type f -name "*.png" -exec mogrify \
  -strip \
  {} +

# Optimize WebP images
find "${TARGET_DIR}" -type f -name "*.webp" -exec mogrify \
  -strip \
  -quality 90 \
  {} +

IMAGES_AFTER=$(find "${TARGET_DIR}" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" \) | wc -l)
SIZE_AFTER=$(du -sh "${TARGET_DIR}" | cut -f1)
echo "Images after: ${IMAGES_AFTER}"
echo "Size after: ${SIZE_AFTER}"
echo "Image optimization complete."
