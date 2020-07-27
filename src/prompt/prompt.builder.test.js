const {describe} = require('mocha');
const {expect} = require('chai');
const {preparePrompt, replaceObject} = require('./PromptBuilder');

describe('Prompt prepare', function () {
    it('should prepare prompt for $TEXT$ ', function () {

        let input = {
            "a": "$TEXT$",
        }
        let output = preparePrompt(null, input);
        let expected = [{
            type: 'input',
            name: 'a',
            message: 'a:'
        }];

        expect(output).to.deep.equal(expected);
    });

    it('should prepare prompt for $NUMBER$ ', function () {

        let input = {
            "a": "$NUMBER$",
        }
        let output = preparePrompt(null, input);
        let expected = [{
            type: 'number',
            name: 'a',
            message: 'a:'
        }];

        expect(output).to.deep.equal(expected);
    });

    it('should not prompt for other inputs ', function () {

        let input = {
            "a": "b",
        }
        let output = preparePrompt(null, input);
        let expected = [];
        expect(output).to.deep.equal(expected);
    });

    it('should replace objects', function () {
        let input = {
            "a": "b"
        }
        let replacement = {
            "a": "c"
        }
        let output = replaceObject(input, replacement)
        let expected = {
            "a": "c"
        }

        expect(output).to.deep.equal(expected);
    })


    it('should replace objects deep nodes', function () {
        let input = {
            "a": "b",
            "c": {
                "x": "y"
            }
        }
        let replacement = {
            "c.x": "F"
        }
        let output = replaceObject(input, replacement)
        let expected = {
            "a": "b",
            "c": {
                "x": "F"
            }
        }

        expect(output).to.deep.equal(expected);
    })
})