#!/bin/bash

# rm -f ./kinde-mgmt-api-specs.yaml
# curl https://kinde.com/api/kinde-mgmt-api-specs.yaml -o kinde-mgmt-api-specs.yaml


docker run --rm -v $(PWD):/local   \
    openapitools/openapi-generator-cli generate \
    -i /local/kinde-mgmt-api-specs.yaml -c /local/config.yaml -g typescript-fetch \
    -o /local/generated-sdk