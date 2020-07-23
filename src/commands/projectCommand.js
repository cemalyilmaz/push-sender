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
    let prompt = {
        type: 'list',
        name: 'project',
        message: 'Select project to send push notification message.',
    };

    pushSender.vorpal
        .command('select project')
        .alias('use project')
        .alias('up')
        .action(function (args, cb) {
                let projects = repository.getProjects();
                if (projects.length === 0) {
                    this.log("No project defined. Please type " + chalk.blue.bold('add project') + " to create one.");
                    cb(undefined);
                    return;
                }
                prompt.choices = projects.map(project => {
                    return {'name': project.name, 'value': project}
                })

                this.prompt(prompt, ({project}) => {
                    pushSender.updateProject(project);
                    cb(undefined, project)
                })
            }
        )
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
            let prompt = {
                type: 'list',
                name: 'project',
                message: 'Select project to send push notification message.',
            };

            let projects = repository.getProjects();
            if (projects.length === 0) {
                this.log('No projects defined.');
                cb(undefined);
                return;
            }
            prompt.choices = projects.map(project => {
                return {'name': project.name, 'value': project}
            })

            this.prompt(prompt, ({project}) => {
                repository.removeProjectNamed(project.name);
                cb(undefined, project)
            })
        })
}

module.exports = {
    addProjectCommand: addProjectCommand,
    listProjectsCommand: listProjectsCommand,
    selectProjectCommand: selectProjectCommand,
    removeProjectCommand: removeProjectCommand,
}
