function homeFolder() {
    return process.env.HOME
}

function rootFolder() {
    return homeFolder() + "/pushsender/";
}

function templatesFolder() {
    return rootFolder() + "/templates/";
}


module.exports = {
    homeFolder: homeFolder,
    rootFolder: rootFolder,
    templatesFolder: templatesFolder,
}