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

### Tab

Use https://github.com/formulahendry/Microsoft-Teams-Samples/tree/junhan/v3/samples/tab-ui-templates/ts as example, the steps are:

* Run `tfxm migrate -t tab -n tab-ui-templates`
* Update .gitignore: copy or append content from .gitignore.example
* Update placeholder in manifest.json
* Update teamsapp.local.yml
    * Change value of manifestPath to `./src/manifest/manifest.json`
* Update package.json
    * Install dev dependency: `npm install --save-dev env-cmd`
    * Add 'dev:teamsfx' in 'scripts' section, and update "start" section:
        ```
        "dev:teamsfx": "env-cmd --silent -f .localConfigs npm run start",
        "start": "react-scripts start",
        ```

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

### Bot

Use https://github.com/formulahendry/Microsoft-Teams-Samples/tree/junhan/v3/samples/bot-conversation/nodejs as example, the steps are:

* Run `tfxm migrate -t bot -n bot-conversation`
* Update .gitignore: copy or append content from .gitignore.example
* Update placeholder in manifest.json
* Update color.png and outline.png to make them pass validation rules
* Update package.json, add 'dev:teamsfx' and 'dev' in 'scripts' section:
    ```
    "dev:teamsfx": "npm run dev",
    "dev": "nodemon --inspect=9239 --signal SIGINT ./index.js",
    ```
* For single-tenant support:
    * Change environment variables: https://github.com/formulahendry/Microsoft-Teams-Samples/blob/70e6840a53be1cd76adb8478fc118ce6d055c089/samples/bot-conversation/nodejs/teamsapp.local.yml#L33C1-L34
    * Change signInAudience to AzureADMyOrg: https://github.com/formulahendry/Microsoft-Teams-Samples/blob/70e6840a53be1cd76adb8478fc118ce6d055c089/samples/bot-conversation/nodejs/teamsapp.local.yml#L11

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

### Message extensions

Use https://github.com/OfficeDev/Microsoft-Teams-Samples/tree/main/samples/msgext-action-quickstart/js as example, the steps are:

* Run `tfxm migrate -t bot -n msgext-action-quickstart`
* Update .gitignore: copy or append content from .gitignore.example
* Update placeholder in manifest.json
* Update package.json, add 'dev:teamsfx' and 'dev' in 'scripts' section:
    ```
    "dev:teamsfx": "npm run dev",
    "dev": "nodemon --inspect=9239 --signal SIGINT ./index.js",
    ```
* Update teamsapp.local.yml, change file/createOrUpdateEnvironmentFile action:
    ```yml
    - uses: file/createOrUpdateEnvironmentFile
      with:
        target: ./.env
        envs:
          BotId: ${{AAD_APP_CLIENT_ID}}
          BotPassword: ${{SECRET_AAD_APP_CLIENT_SECRET}}
    ```

### Message extensions SSO

Use https://github.com/formulahendry/Microsoft-Teams-Samples/tree/junhan/v3/samples/msgext-search-sso-config/nodejs as example, the steps are:

* Run `tfxm migrate -t bot-sso -n msgext-search-sso-config`
* Update .gitignore: copy or append content from .gitignore.example
* Update placeholder in manifest.json
* Update package.json, add 'dev:teamsfx' and 'dev' in 'scripts' section:
    ```
    "dev:teamsfx": "npm run dev",
    "dev": "nodemon --inspect=9239 --signal SIGINT ./index.js",
    ```
* Update teamsapp.local.yml, change file/createOrUpdateEnvironmentFile action:
    ```yml
    - uses: file/createOrUpdateEnvironmentFile
      with:
        target: ./.env
        envs:
          MicrosoftAppId: ${{AAD_APP_CLIENT_ID}}
          MicrosoftAppPassword: ${{SECRET_AAD_APP_CLIENT_SECRET}}
          connectionName: ${{CONNECTION_NAME}}
          SiteUrl: ${{BOT_ENDPOINT}}
    ```
### Tab + Bot

Use https://github.com/OfficeDev/Microsoft-Teams-Samples/tree/main/samples/app-hello-world/nodejs as example, the steps are:

* Run `tfxm migrate -t bot -n app-hello-world`
* Update .gitignore: copy or append content from .gitignore.example
* Update placeholder in manifest.json
* Update package.json, add 'dev:teamsfx' and 'dev' in 'scripts' section:
    ```
    "dev:teamsfx": "npm run dev",
    "dev": "nodemon --exec babel-node --inspect=9239 --signal SIGINT src/app.js",
    ```
* Update teamsapp.local.yml, change file/createOrUpdateEnvironmentFile action:
    ```yml
    # Generate runtime environment variables
    - uses: file/createOrUpdateEnvironmentFile
      with:
        target: ./.env
        envs:
          PORT: 3978
    - uses: file/createOrUpdateJsonFile
      with:
        target: ./config/default.json # Required. The relative path of settings file
        appsettings: # Required. The appsettings to be generated
          bot:
            appId: ${{AAD_APP_CLIENT_ID}}
            appPassword: ${{SECRET_AAD_APP_CLIENT_SECRET}}
    ```
* Fix code in src\app.js:
    ```javascript
    const ENV_FILE = path.join(__dirname, '..', '.env');
    ```

---

### Tab (yo teams)

Use https://github.com/formulahendry/yo-teams-migration/tree/main/tab as example, the steps are:

* Run `tfxm migrate -t tab -n tab`
* Update .gitignore: copy or append content from .gitignore.example
* Update placeholder in manifest.json
* Update package.json, add 'dev:teamsfx' in 'scripts' section:
        "dev:teamsfx": "gulp serve",
* Update tasks.json
    * Add "Start local tunnel" task
    * Change "Start frontend": `"endsPattern": "Server running on"`
* Update teamsapp.local.yml
    * Remove "Set TAB_DOMAIN and TAB_ENDPOINT for local launch"
    * Update manifestPath
    * Replace whole 'deploy' lifecycle:
        ```yml
        # Run npm command
        - uses: cli/runNpmCommand
          with:
            args: install --no-audit
    
        # Generate runtime environment variables
        - uses: file/createOrUpdateEnvironmentFile
          with:
            target: ./.env
            envs:
              PORT: 53000
        ```