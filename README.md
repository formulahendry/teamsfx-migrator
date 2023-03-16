## tfx-migration-helper

CLI to migrate samples to TeamsFX V3

### Usage

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