#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

for platform in $(cat scripts/platforms.txt)
do
  mkdir -p packages/ngrok-bin-$platform/bin
  cd packages/ngrok-bin-$platform
  ngrok_platform=$platform
  ngrok_platform=${ngrok_platform/ia32/386}
  ngrok_platform=${ngrok_platform/x64/amd64}
  ngrok_platform=${ngrok_platform/sunos/solaris}
  ngrok_platform=${ngrok_platform/win32/windows}
  filename="ngrok-stable-$ngrok_platform.zip"
  curl -O https://bin.equinox.io/c/4VmDzA7iaHb/$filename
  unzip -o $filename
  rm $filename
  cd -
done

mkdir -p packages/ngrok-bin
./scripts/update-versions.js

cd -
