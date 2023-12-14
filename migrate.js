const os = require('os');
const { promises: fs } = require('fs');
const path = require('path');
const replace = require('replace-in-file');
const { AppTypes } = require('./constant');
const migrateTab = require('./apps/tab');
const migrateTabSso = require('./apps/tab-sso');
const migrateBot = require('./apps/bot');
const migrateBotSso = require('./apps/bot-sso');

async function migrate(appName, appType) {
    const tmpFolder = await copyTemplateToTmpFolder(appType);
    await replacePlaceholderInTmpFolder(appName, tmpFolder);
    await copyTmpFolderToCurrentFolder(tmpFolder);
    await deleteTmpFolder(tmpFolder);

    switch (appType) {
        case AppTypes.Tab:
            await migrateTab();
            break;
        case AppTypes.TabSso:
            await migrateTabSso();
            break;
        case AppTypes.Bot:
            await migrateBot();
            break;
        case AppTypes.BotSso:
            await migrateBotSso();
            break;
        case AppTypes.TabBot:
            await updateManifestJson();
            await updatePackageJson();
            break;
        case AppTypes.TabCsharp:
        case AppTypes.TabSsoCsharp:
        case AppTypes.BotCsharp:
            await updateCsprojFile();
        default:
            break;
    }

    console.log("Migration is finished.");
}

async function copyTemplateToTmpFolder(appType) {
    const templateFolder = path.join(__dirname, "templates", appType)
    const tmpFolder = await fs.mkdtemp(path.join(os.tmpdir(), 'teamfx-'));
    await fs.cp(templateFolder, tmpFolder, { recursive: true });

    return tmpFolder;
}

async function replacePlaceholderInTmpFolder(appName, tmpFolder) {
    await replace({
        files: path.join(tmpFolder, '/**/*'),
        from: /{%appName%}/g,
        to: appName,
        glob: {
            dot: true, //E.g. to include file names starting with a dot
        },
    })
}

async function copyTmpFolderToCurrentFolder(tmpFolder) {
    await fs.cp(tmpFolder, process.cwd(), { recursive: true });
}

async function deleteTmpFolder(tmpFolder) {
    await fs.rm(tmpFolder, { recursive: true });
}

async function updateManifestJson() {
    const replacementMap = [
        {
            from: /{{APPLICATION_ID}}/g,
            to: "${{TEAMS_APP_ID}}",
        },
        {
            from: /{{VERSION}}/g,
            to: "1.0.0",
        },
        {
            from: /{{PACKAGE_NAME}}/g,
            to: "com.contoso.teams",
        },
        {
            from: /{{PUBLIC_HOSTNAME}}/g,
            to: "${{BOT_DOMAIN}}",
        },
        {
            from: /{{MICROSOFT_APP_ID}}/g,
            to: "${{AAD_APP_CLIENT_ID}}",
        },
    ]

    for (const replacement of replacementMap) {
        await replace({
            files: path.join(process.cwd(), 'src', 'manifest', 'manifest.json'),
            from: replacement.from,
            to: replacement.to,
        })
    }
}

async function updatePackageJson() {
    const packageJsonFilePath = path.join(process.cwd(), 'package.json');
    const packageJson = require(packageJsonFilePath);
    packageJson["scripts"]["dev:teamsfx"] = "gulp serve --debug --no-schema-validation";
    packageJson["dependencies"]["ajv"] = "^8.12.0";
    fs.writeFile(packageJsonFilePath, JSON.stringify(packageJson, null, 2));
}

async function updateCsprojFile() {
    const csprojFiles = (await fs.readdir(process.cwd())).filter(fn => fn.endsWith('.csproj'));

    if (csprojFiles.length === 0) {
        console.log('No .csproj files found in current directory');
        return;
    }

    const csprojFilePath = csprojFiles[0];
    console.log({ csprojFilePath });
    const content = await fs.readFile(csprojFilePath, 'utf8');

    const searchString = '</ItemGroup>';
    // Find the last <ItemGroup> tag in the file
    const lastItemGroupIndex = content.lastIndexOf(searchString);

    // Insert the new <ItemGroup> section after the last one
    const newItemGroup = `

  <ItemGroup>
    <ProjectCapability Include="TeamsFx" />
  </ItemGroup>`;
    const newContent = content.slice(0, lastItemGroupIndex + searchString.length) + newItemGroup + content.slice(lastItemGroupIndex + searchString.length);

    await fs.writeFile(csprojFilePath, newContent);
}

module.exports = { migrate }