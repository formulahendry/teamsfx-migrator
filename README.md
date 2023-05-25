# tfx-migration-helper

CLI to reduce manual steps to migrate samples to TeamsFX V3.

## Usage

1. Install the CLI
    ```
    npm install tfx-migration-helper -g
    ```

1. `cd` to the root folder of the project to be migrated

1. Run migration command:
    ```
    tfxm migrate -t <app-type> -n <app-name>
    ```
    e.g.
    ```
    tfxm migrate -t tab -n personal-tab
    ```
## Migration steps

### Tab SSO

Use https://github.com/formulahendry/Microsoft-Teams-Samples/tree/junhan/v3/samples/tab-sso/nodejs as example, the steps are:

* Run `tfxm migrate -t tab-sso -n tab-sso`
* Update .gitignore: copy or append content from .gitignore.example
* Update placeholder in manifest.json
* Update package.json, add 'dev:teamsfx' in 'scripts' section:
    
    `"dev:teamsfx": "npm run start",`

* Add redirect url in replyUrlsWithType of aad.manifest.json
    ```json
    {
        "url": "${{TAB_ENDPOINT}}/auth-end",
        "type": "Spa"
    },
    {
        "url": "${{TAB_ENDPOINT}}/Home/BrowserRedirect",
        "type": "Spa"
    },
    ```

### Bot SSO

Use https://github.com/formulahendry/Microsoft-Teams-Samples/blob/junhan/v3/samples/bot-conversation-sso-quickstart/js/ as example, the steps are:

* Run `tfxm migrate -t bot-sso -n bot-conversation-sso-quickstart`
* Update .gitignore: copy or append content from .gitignore.example
* Update placeholder in manifest.json
* Update color.png and outline.png to make them pass validation rules
* Update package.json, add 'dev:teamsfx' and 'dev' in 'scripts' section:
    ```
    "dev:teamsfx": "npm run dev",
    "dev": "nodemon --inspect=9239 --signal SIGINT ./index.js",
    ```
* For single-tenant support:
    * Change environment variables: https://github.com/formulahendry/Microsoft-Teams-Samples/blob/f5e21ef37e9a141e3dfde07485e21f07256eb4e2/samples/bot-conversation-sso-quickstart/js/teamsapp.local.yml#L31-L34
    * Change signInAudience to AzureADMyOrg: https://github.com/formulahendry/Microsoft-Teams-Samples/blob/f5e21ef37e9a141e3dfde07485e21f07256eb4e2/samples/bot-conversation-sso-quickstart/js/teamsapp.local.yml#LL9C24-L9C36
