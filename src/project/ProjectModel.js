class ProjectModel {
    constructor({name, apiKey}) {
        this.name = name.trim();
        this.apiKey = apiKey.trim();
    }
}

module.exports = ProjectModel
