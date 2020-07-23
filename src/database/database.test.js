const {describe} = require('mocha');
const {expect} = require('chai');
const DB = require('./Database');

describe('Database', function () {
    beforeEach(function () {
        DB.close();
    });

    it('should have methods', function () {
        expect(DB.initialize instanceof Function).to.be.true;
        expect(DB.singleton instanceof Function).to.be.true;
        expect(DB.close instanceof Function).to.be.true;
    });

    it('should init with given folder', function () {
        DB.initialize('./foo/')
        expect(DB.singleton().directory).is.equal('./foo/');
    });

    it('should throw error when try to use without initialize', function () {
        expect(function () {
            DB.singleton()
        }).to.throw('DB should be initialized before usage.');
    });

})