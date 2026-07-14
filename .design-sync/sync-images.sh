#!/bin/sh
# Sample images shipped with the design-system bundle so figure components
# preview with the site's real assets. The converter regenerates ds-bundle/
# from scratch, so run this after every package-build/resync run.
set -e
cd "$(dirname "$0")/.."
mkdir -p ds-bundle/images
for f in delegate-yoda.webp delegate-yoda.jpg uat-storyboard.webp \
         cancel-receipt-poster.webp cancel-receipt-walkthrough.mp4; do
  cp "static/images/$f" ds-bundle/images/
done
echo "ds-bundle/images/: $(ls ds-bundle/images | wc -l | tr -d ' ') files"
