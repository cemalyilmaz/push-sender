const db = require('../database/Database').singleton();
const chalk = require('chalk');
const PROJECT_DB_FILE = "projects.json";
const ProjectModel = require('./ProjectModel');

class ProjectRepository {
    constructor(props) {
        this.db = props.db;
    }

    load() {
        let projectJson = db.getJSON(this.fileName());
        this.projects = projectJson.map(pj => {
            return new ProjectModel({name: pj.name, apiKey: pj.apiKey});
        })
    }

    addProject(project) {
        this.load();
        let found = false;
        this.projects.map(p => {
            if (p.name === project.name) {
                console.info('you already have a project named:' + p.name);
                console.info('can not add it.');
                found = true;
            }
        })
        if (found) {
            return;
        }

        this.projects.push(project);
        this.saveProjectsToFile(this.projects);
    }

    updateProject(oldName, newName, apiKey) {
        this.removeProjectNamed(oldName);
        let projectModel = new ProjectModel({name: newName, apiKey});
        this.addProject(projectModel);
    }

    getProjects() {
        this.load();
        return this.projects || [];
    }

    removeProjectNamed(name) {
        this.projects = this.projects.filter(function (p) {
            return p.name !== name;
        });
        this.saveProjectsToFile(this.projects);
    }

    saveProjectsToFile(projects) {
        this.db.saveObject(projects, this.fileName());
        console.info(chalk.italic.grey('Projects DB updated.'));
    }

    clear() {
        db.clear(this.fileName());
    }

    fileName() {
        return PROJECT_DB_FILE;
    }
}

module.exports = ProjectRepository;