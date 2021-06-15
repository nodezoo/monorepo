#!/usr/bin/env bash
set -e
DIRNAME=`dirname "$0"`


# Derived values
LAYERZIP="$DIRNAME/layer.zip"


rm -f "$LAYERZIP"
rm -rf nodejs
rm -rf node_modules

npm install --only=production
mkdir nodejs
mv node_modules nodejs

zip -q -r "$LAYERZIP" nodejs/node_modules

echo "LAYER ZIP: " `ls -lsh "$LAYERZIP"`

rm -rf nodejs
npm i





