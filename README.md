# Kinde Typescript SDK Generator
Generates an SDK in Typescript that can be used to authenticate to Kinde (PKCE auth) 
and/or access the Kinde mananagement API (client credentials auth).

## Requirements and Setup
You will need the following tools to be able to generate the SDK
- Docker engine
- curl

You will then need to install the `openapitools/openapi-generator-cli` docker image
which can be managed easily with the following command.
```
docker pull openapitools/openapi-generator-cli
```

## Generating the SDK
Simply run the `./generate.sh` script. The script first downloads the latest Kinde
API specifications, then runs the OpenAPI generator with the `typescript-fetch` 
option. The generator then appends the files listed in the `supporting-files` 
directory to the final generated SDK. The generated SDK is placed in a directory 
called `generated-sdk`.

## Using the generated SDK
To use the generated SDK, you will require the `pnpm` package manager with which you 
can build and package it by running the following commands, in the `generated-sdk`
directory.

```
pnpm install
pnpm build
pnpm pack
```

Those 3 commands will produce a tar file similar to `kinde-oss-kinde-typescript-sdk-1.0.0.tgz`.
You can then import it in your Typescript or Javascript project, using the following 
command, similar commands are available for `npm` or `yarn`.
```
pnpm add --save ./path/to/kinde-oss-kinde-typescript-sdk-1.0.0.tgz
```

Once completed you should see an entry similar to the following in your project's 
`package.json` file.

```
"dependencies": {
  "@kinde-oss/kinde-typescript-sdk": "file:/path/to/kinde-oss-kinde-typescript-sdk-1.0.0.tgz"
}
```
