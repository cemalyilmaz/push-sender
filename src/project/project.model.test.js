const {describe} = require('mocha');
const {expect} = require('chai');

const ProjectModel = require('./ProjectModel');

describe('Project models', function () {
    it('should create project model', function () {
        let model = new ProjectModel({name: 'name', apiKey: 'apiKey'});

        expect(model instanceof ProjectModel).to.be.true

        expect(model.name).to.be.a('string');
        expect(model.apiKey).to.be.a('string');
    })

    it('should use constructor parameters', function () {
        let model = new ProjectModel({name: 'name', apiKey: 'apiKey'});

        expect(model.name).is.equal('name');
        expect(model.apiKey).is.equal('apiKey');
    })

    it('should handle white spaces', function () {
        let model = new ProjectModel({name: '  name  ', apiKey: '  apiKey   '});
        expect(model.name).is.equal('name');
        expect(model.apiKey).is.equal('apiKey');
    });
})