const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
var assert = chai.assert; 
chai.use(chaiHttp)


describe('Array Check', () => {
    describe('Index of Function check', () => {
        it('expect to return value -1 when element is not present', () => {
            assert.equal([6,7,9].indexOf(1), -1);
        });
    });
});


describe('Check for Username and Password', () => {
    describe('Check for Password', () => {
       
        it('should have strong password', () => {
            let password = "Test@12345"
            let valid=true;
            if (!/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(password)) {
                valid=false;
            }
            assert.isTrue(valid);
        });
    });
});