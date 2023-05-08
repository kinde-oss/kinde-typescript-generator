# Kinde Typescript SDK Generator

Generates an SDK in typescript that can be used to authenticate to Kinde (PKCE auth) and/or access the Kinde mananagement API (client credentials auth).

## Requirements
You will need the following tools to be able to generate the SDK

- curl
- Docker engine

## Generating the SDK
Simply run the `./generate.sh` script. The script first downloads the latest Kinde API specifications, then runs the OpenAPI generator with the `typescript-fetch` option. The generator then appends the files listed in the `additional` directory to the final generated SDK. The generated SDK is placed in a directory called `generated-sdk`

## Using the generated SDK
To use the generated SDK, you can build and package it, then import it in your typescript or javascript project. In the `generated-sdk` directory, run:

```
npm i
npm run build
npm pack
```
Those 3 commands will produce a tar file with a similar filename to: `kinde-oss-kinde-typescript-sdk-1.0.0.tgz`

In your typescript or javascript project, add the following line to your dependencies in your package.json file, referencing the path where the tar file is located on your filesystem.
```
  "dependencies": {
    "@kinde-oss/kinde-typescript-sdk": "file:/path/to/kinde-oss-kinde-typescript-sdk-1.0.0.tgz"
  }
```