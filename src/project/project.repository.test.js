const {describe} = require('mocha');
const {expect} = require('chai');

let DB = require('../database/Database');
DB.initialize('./test/');
const db = DB.singleton();

const ProjectModel = require('./ProjectModel');
const ProjectRepository = require('./ProjectRepository');
const repository = new ProjectRepository({db});

describe('Project repository tests', function () {
    it('should construct have class defined. ', function () {
        let repository1 = new ProjectRepository({db});
        expect(repository1 instanceof ProjectRepository).to.be.true
    })

    it('should add project ', function () {
        repository.clear();
        repository.addProject(new ProjectModel({name: "name", apiKey: "apiKey"}));
        expect(1).to.equal(repository.getProjects().length);

        let model = repository.getProjects()[0];
        expect(model.name).to.equal("name");
        expect(model.apiKey).to.equal("apiKey");
    });

    it('should load projects as ProjectModel instances', function () {
        repository.clear();
        repository.addProject(new ProjectModel({name: 'name1', apiKey: "apiKey1"}));
        repository.saveProjectsToFile(repository.projects, repository.fileName())
        repository.projects = [];
        let model = repository.getProjects()[0];
        expect(model instanceof ProjectModel).to.be.true;
    })

    it('should not add a project with same name', function () {
        repository.clear();
        repository.addProject(new ProjectModel({name: "name", apiKey: "token"}));
        repository.addProject(new ProjectModel({name: "name", apiKey: "token"}));
        expect(repository.getProjects().length).to.equal(1);
    });

    it('should remove project with a name', function () {
        repository.clear();
        repository.addProject(new ProjectModel({name: 'name1', apiKey: 'apiKey1'}));
        repository.addProject(new ProjectModel({name: 'name2', apiKey: 'apiKey2'}));
        repository.removeProjectNamed('name1');

        expect(1).to.equal(repository.getProjects().length);
        let model = repository.getProjects()[0];
        expect(model.name).is.equal('name2');
        expect(model.apiKey).is.equal('apiKey2');
    })

    it('should clear objects ', function () {
        repository.clear();
        repository.addProject(new ProjectModel({name: 'name1', apiKey: 'token1'}));
        repository.clear();
        expect(repository.getProjects().length).is.equal(0);
    });

})

