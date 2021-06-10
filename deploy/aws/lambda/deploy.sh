echo "DEPLOY $1"

SRV="$1"

rm -f lambda.zip

zip -q -r lambda.zip node_modules srv/$SRV
zip -q -u -j lambda.zip model/model.json deploy/aws/lambda/index.js

aws lambda update-function-code --function-name "nodezoo_$SRV" --zip-file fileb://lambda.zip

rm -f lambda.zip
