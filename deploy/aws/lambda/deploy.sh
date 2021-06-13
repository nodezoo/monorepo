#!/usr/bin/env bash
set -e
DIRNAME=`dirname "$0"`


# Arguments
SRV="$1"
LAMBDA_ARN_ID="$2"


# Configuration
LAMBDA_ARN_REGION="us-east-1"


# Derived values
LAMBDA_ARN_REGID="$LAMBDA_ARN_REGION:$LAMBDA_ARN_ID"
LAMBDAZIP="$DIRNAME/lambda-$SRV.zip"


echo "DEPLOY:     $LAMBDA_ARN_REGION $SRV"

rm -f "$LAMBDAZIP"

zip -q -r "$LAMBDAZIP" node_modules srv/$SRV lib
zip -q -u -j "$LAMBDAZIP" model/model.json deploy/aws/lambda/index.js

echo "LAMBDA ZIP: " `ls -lsh "$LAMBDAZIP"`


if [ -f "$DIRNAME/log/$SRV-success.json" ]; then
    echo "UPDATE: $SRV"

    aws lambda update-function-code \
        --function-name "nodezoo_$SRV" \
        --zip-file fileb://$LAMBDAZIP \
        > "$DIRNAME/log/$SRV-update.json"

    AWS_API_EXIT_VAL=$?
    
    cat "$DIRNAME/log/$SRV-update.json"

    if [ $AWS_API_EXIT_VAL -ne 0 ]; then
        echo "!!! FAILED !!!"
    fi
    
else
    echo "CREATE: $SRV"
    aws lambda create-function \
        --function-name "nodezoo_$SRV" \
        --zip-file fileb://$LAMBDAZIP \
        --environment "Variables={NODEZOO_SRV=$SRV,NODEZOO_TOPIC_PREFIX=arn:aws:sns:${LAMBDA_ARN_REGID}:nodezoo_}" \
        --handler index.handler \
        --runtime nodejs14.x \
        --role "arn:aws:iam::${LAMBDA_ARN_ID}:role/nodezoo_lambda_srv" \
        --timeout 33 \
        > "$DIRNAME/log/$SRV-create.json"

    AWS_API_EXIT_VAL=$?
    
    cat "$DIRNAME/log/$SRV-create.json"
    
    if [ $AWS_API_EXIT_VAL -eq 0 ]; then
        cp "$DIRNAME/log/$SRV-create.json" "$DIRNAME/log/$SRV-success.json" 
    else
        echo "!!! FAILED !!!"
    fi
fi

rm -f "$LAMBDAZIP"


echo "TOPICS..."

TOPICS=`jq -r '.main.srv.github.msg | to_entries | map(select(.value.async==true))[] | .key | split(",") | sort | join("_") | gsub(":";"_")' model/model.json`

echo "$TOPICS" | while read TOPIC ; do
    if [ -f "$DIRNAME/log/$SRV-subscribe-$TOPIC.json" ]; then
        echo "EXISTS:    $TOPIC"

    else
        echo "SUBSCRIBE: $TOPIC"

        aws sns subscribe \
            --topic-arn "arn:aws:sns:${LAMBDA_ARN_REGID}:nodezoo_$TOPIC" \
            --protocol lambda \
            --notification-endpoint "arn:aws:lambda:${LAMBDA_ARN_REGID}:function:nodezoo_$SRV" \
            > "$DIRNAME/log/$SRV-subscribe-$TOPIC.json"
        
        cat "$DIRNAME/log/$SRV-subscribe-$TOPIC.json"
        
        aws lambda add-permission \
            --function-name "nodezoo_$SRV" \
            --statement-id "${LAMBDA_ARN_ID}_nodezoo_$TOPIC" \
            --action "lambda:InvokeFunction" \
            --principal sns.amazonaws.com \
            --source-arn "arn:aws:sns:${LAMBDA_ARN_REGID}:nodezoo_$TOPIC" \
            > "$DIRNAME/log/$SRV-perm-$TOPIC.json"
        
        cat "$DIRNAME/log/$SRV-perm-$TOPIC.json"
    fi
done





