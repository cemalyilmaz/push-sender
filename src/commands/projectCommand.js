const db = require('../database/Database').singleton();
const ProjectRepository = require('../project/ProjectRepository');
const repository = new ProjectRepository({db});
const ProjectModel = require('../project/ProjectModel');

const chalk = require('chalk');

function addProjectCommand(pushSender) {
    let prompt = [{
        type: 'input',
        name: 'name',
        message: 'project name :'
    }, {
        type: 'input',
        name: 'apiKey',
        message: 'apiKey :'
    }];

    pushSender.vorpal.command('add project')
        .action(function (args, cb) {
            this.prompt(prompt, ({name, apiKey}) => {
                const projectModel = new ProjectModel({name, apiKey});
                repository.addProject(projectModel)
                cb(undefined, projectModel);
            });
        });
}

function editProjectCommand(pushSender) {
    pushSender.vorpal.command('edit project')
        .action(function (args, cb) {
            selectProject(this, projectModel => {
                let prompt = [{
                    type: 'input',
                    name: 'name',
                    default: projectModel.name,
                    message: 'project name :'
                }, {
                    type: 'input',
                    name: 'apiKey',
                    default: projectModel.apiKey,
                    message: 'apiKey :'
                }];

                this.prompt(prompt, ({name, apiKey}) => {
                    repository.updateProject(projectModel.name, name, apiKey);
                    cb(undefined, projectModel);
                })
            });
        });
}

function listProjectsCommand(pushSender) {
    pushSender.vorpal
        .command('list projects')
        .alias('projects')
        .action(function (args, cb) {
            let projects = repository.getProjects()
            this.log(projects);
            cb(undefined, projects);
        })
}

function selectProjectCommand(pushSender) {
    pushSender.vorpal
        .command('select project')
        .alias('use project')
        .alias('up')
        .action(function (args, cb) {
            selectProject(this, projectModel => {
                if (projectModel !== undefined) {
                    pushSender.updateProject(projectModel);
                }
                cb(undefined, projectModel)
            })
        });
}

function removeProjectCommand(pushSender) {
    pushSender.vorpal
        .command('remove project [project]')
        .autocomplete({
            data: function () {
                return repository.getProjects().map(p => "'" + p.name + "'");
            }
        })
        .action(function (args, cb) {
            if (args.project !== undefined) {
                let name = args.project.trim();
                repository.removeProjectNamed(name);
                cb(undefined, name);
                return;
            }

            selectProject(this, projectModel => {
                if (projectModel !== undefined) {
                    repository.removeProjectNamed(projectModel.name);
                }
                cb(undefined, projectModel)
            })
        })
}

function selectProject(command, callback) {
    let prompt = {
        type: 'list',
        name: 'project',
        message: 'Select project.',
    };

    let projects = repository.getProjects();
    if (projects.length === 0) {
        command.log("No project defined. Please type " + chalk.blue.bold('add project') + " to create one.");
        callback(undefined);
        return;
    }
    prompt.choices = projects.map(project => {
        return {'name': project.name, 'value': project}
    })

    command.prompt(prompt, ({project}) => {
        callback(project);
    })
}

module.exports = {
    addProjectCommand: addProjectCommand,
    editProjectCommand: editProjectCommand,
    listProjectsCommand: listProjectsCommand,
    selectProjectCommand: selectProjectCommand,
    removeProjectCommand: removeProjectCommand,
}
