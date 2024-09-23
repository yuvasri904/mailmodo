#!/bin/bash

# Check if a description URL is passed as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <description_url>"
  exit 1
fi

# Assign the first argument to a variable
description_url=$1
env=$2
region=$3
# Construct the message for SNS with a custom message
message=$(jq -n --arg desc_url "$description_url" --arg env "$env" --arg region "$region" '{
  version: "1.0",
  source: "custom",
  content: {
    description: "Test summary/report link for environment \($env) in region \($region) : \($desc_url)"
  }
}')

echo "Description URL: $description_url"
echo ">>> Publishing message to SNS topic: scrut-playwrite"

# Publish the message to SNS
aws sns publish \
  --topic-arn arn:aws:sns:us-east-1:378176467373:scrut-playwrite \
  --message "$message" \
  --region us-east-1

echo ">>> Message published successfully!"
