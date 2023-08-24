# Kinde Typescript SDK Generator
Generates an SDK in Typescript that can be used to authenticate to Kinde (PKCE auth) 
and/or access the Kinde mananagement API (client credentials auth).

## Requirements and Setup
You will need the following tools to be able to generate the SDK.  

**Docker engine**  
The `openapi-generator-cli` dependency of this generator is made use of as a docker
image. You can find the instructions for installing docker engine [**here**](https://docs.docker.com/engine/install).
Once installed the required image can be installed with the following command.
```
docker pull openapitools/openapi-generator-cli
```

**cURL**  
This command-line program is required since the generating script `generate.sh` 
(see below), performs a `GET` request to fetch the `kinde-mgmt-api-specs.yaml` 
open-api spec file for Kinde. This program is most likely available via your 
operating systems package manager (some examples are provided below). If not
then see [**this**](https://curl.se/download.html) link.

On linux distributions like Ubuntu and Debian.
```bash
apt install curl
```

On MacOS you can install `curl` using Homebrew.
```bash
brew install curl
```

## Generating the SDK
Simply run the `./generate.sh` script. The script first downloads the latest Kinde
API specifications, then runs the OpenAPI generator with the `typescript-fetch` 
option. The generator then appends the files listed in the `supporting-files` 
directory to the final generated SDK. The generated SDK is placed in a directory 
called `generated-sdk`.

The script also takes an optional argument which replaces the {businessName} variable 
in the `kinde-mgmt-api-specs.yaml` specification file, if provided.

```bash
./generate.sh my-business-name
```

Please also note that above script runs the `openapi-generator-cli` docker image as 
the currently logged in user, therefore it is essential that this user be added to
the `docker` group on your system.

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
