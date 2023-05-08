# Kinde Typescript SDK

## Usage
The SDK exposes two authentication classes, as well as several classes that wraps around the Kinde Management API.

### Login
For e.g. to use the login functionality in an express.js route

1. Create a KindeAuthClient instance ensuring that you use the correct kinde domain value, the client id of a front-end application defined in the Kinde admin, and having that front-end application setup with the correct callback url.
2. Call the `login()` function, which will return a URL that can be used to authenticate to Kinde
3. Redirect your user to the URL you obtained in the last call
```
    var express = require('express');
    var router = express.Router();
    const { KindeAuthClient } = require('@kinde-oss/kinde-typescript-sdk');

    const kindeAuthClient = new KindeAuthClient(
        kindeDomain=process.env.KINDE_DOMAIN,
        clientId=process.env.KINDE_FE_CLIENT_ID,
        redirectUri=process.env.KINDE_REDIRECT_URI,
    );

    router.get('/', async function(req, res, next) {
        const login_url = await kindeAuthClient.login();
        res.redirect(login_url)
    });

    module.exports = router;
```

Once, the user has logged in, they will be redirected to the URL that you have defined in the `redirectUri` property of your KindeAuthClient instance. You need to then handle the callback using the `handleLoginCallback` function. The `handleLoginCallback` requires the full URL including query string parameters. You can then call the `getAccessToken` function to retrieve the access token with  which you can call the `user_profile` profile endpoint to get more information about the logged in user.

```
    router.get('/', async function(req, res, next) {
        const protocol = req.protocol;
        const host = req.get('host');
        const originalUrl = req.originalUrl;
        const fullPath = `${protocol}://${host}${originalUrl}`;

        await kindeAuthClient.handleLoginCallback(fullPath)
        const accessToken = await kindeAuthClient.getAccessToken()

            const response = await axios.get(`https://${process.env.KINDE_DOMAIN}/oauth2/v2/user_profile`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            });

        res.send(response.data.name);
    }
```

### Using the management API
To use the management API, you need to obtain a different access token that has access to call the management API.

1. Create an instance of the `KindeMgmtApiClient` class. Note that you need to create a machine to machine application in Kinde following the instructions [here](https://kinde.com/docs/build/add-a-m2m-application-for-api-access/)

```
    const kindeMgmtApiClient = new KindeMgmtApiClient(
        kindeDomain=process.env.KINDE_DOMAIN,
        clientId=process.env.KINDE_BE_CLIENT_ID,
        clientSecret=process.env.KINDE_BE_CLIENT_SECRET,
        audience=process.env.KINDE_MGMT_API_AUD,
    )
```

2. Use the `kindeMgmtApiClient` instance to `login` then get an access token to call an API. For e.g. to call the /users API:
```
    await kindeMgmtApiClient.login()
    const apiAccessToken = await kindeMgmtApiClient.getAccessToken()

    const configuration = new Configuration({
      basePath: process.env.KINDE_DOMAIN,
      accessToken: apiAccessToken,
      headers: {
        Accept: 'application/json'
      }
    });

    const usersApi = new UsersApi(configuration)
    const users = (await usersApi.getUsers()).users
```