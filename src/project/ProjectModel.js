class ProjectModel {
    constructor({name, apiKey}) {
        if (name === undefined || apiKey === undefined) {
            throw new Error('Project model should have name and apiKey.');
        }

        this.name = name.trim();
        this.apiKey = apiKey.trim();
    }
}

module.exports = ProjectModel
