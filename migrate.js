const os = require('os');
const { promises: fs } = require('fs');
const path = require('path');
const replace = require('replace-in-file');
const migrateTab = require('./apps/tab');
const migrateTabSso = require('./apps/tab-sso');
const { AppTypes } = require('./constant');

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
        default:
            break;
    }
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

module.exports = { migrate }