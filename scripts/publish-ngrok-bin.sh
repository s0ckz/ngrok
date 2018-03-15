#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

for platform in $(cat scripts/platforms.txt)
do
  echo "Publishing packages/ngrok-bin-$platform..."
  npm publish packages/ngrok-bin-$platform --access public
done
npm publish packages/ngrok-bin --access public

cd -
