#!/bin/bash

# fetching latest open-api specification
rm -rf ./generated-sdk && rm -f ./kinde-mgmt-api-specs.yaml
curl https://kinde.com/api/kinde-mgmt-api-specs.yaml \
  -o kinde-mgmt-api-specs.yaml

# generating sdk
docker run --rm -v $PWD:/local \
    openapitools/openapi-generator-cli generate \
    -i /local/kinde-mgmt-api-specs.yaml \
    -c /local/config.yaml -g typescript-fetch \
    -o /local/generated-sdk

# making sdk-version.sh script executable
chmod +x generated-sdk/sdk-version.sh

# moving apis, models, runtime.ts to lib directory
mkdir -p ./generated-sdk/lib 
mv ./generated-sdk/runtime.ts ./generated-sdk/lib
mv ./generated-sdk/models ./generated-sdk/lib
mv ./generated-sdk/apis ./generated-sdk/lib 

# clean up api files from sdk
rm -rf ./generated-sdk/.openapi-generator 
rm -rf ./generated-sdk/.openapi-generator-ignore
