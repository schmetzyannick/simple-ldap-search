/* global describe, it, before, beforeEach, after */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import settings from './settings.example.js';
import TestLDAPServer from './ldap-server';
import SimpleLDAP from '../src/';

const { expect } = chai;
chai.use(chaiAsPromised);

describe('LDAP', () => {
  let ldap; // the ldap client
  const server = new TestLDAPServer();

  // start the LDAP server for testing
  before((done) => {
    server
      .start()
      .then(done)
      .catch(done);
  });

  after((done) => {
    server
      .stop()
      .then(done)
      .catch(done);
  });

  // create a new connection to test LDAP server
  beforeEach((done) => {
    ldap = new SimpleLDAP(settings.ldap);
    done();
  });

  describe('ldap.get()', () =>{
    it('should bind to DN automatically upon first query', () => {
      return ldap
        .get()
        .then(() => {
          return expect(ldap._isBoundTo).to.equal('cn=root');
        });
    });

    // xit('initializes a connection for raw LDAP queries', () => {
    //   const expected = {
    //     dn: 'uid=artvandelay,dc=users,dc=localhost',
    //     idNumber: 1234567,
    //     uid: 'artvandelay',
    //     givenName: 'Art',
    //     sn: 'Vandelay',
    //     telephoneNumber: '555-123-4567',
    //   };

    //   const filter = `(id-number=1234567)`;
    //   const attributes = [
    //     'idNumber',
    //     'uid',
    //     'givenName',
    //     'sn',
    //     'telephoneNumber',
    //   ];

    //   const data = ldap.get(filter, attributes);
    //   return expect(data).to.eventually.eql([expected]);
    // });
  });
});
