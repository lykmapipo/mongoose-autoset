'use strict';

//dependencies
const path = require('path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const faker = require('faker');
const expect = require('chai').expect;

//apply mongoose-autoset plugin
mongoose.plugin(require(path.join(__dirname, '..')));

//prepare schema
const PersonSchema = new Schema({
  name: {
    type: String
  },
  parent: {
    type: ObjectId,
    ref: 'Person',
    exists: true
  }
});
const Person = mongoose.model('Person', PersonSchema);

describe('mongoose-autoset', function () {

  let parent = {
    name: faker.company.companyName()
  };

  before(function (done) {
    Person.create(parent, function (error, created) {
      parent = created;
      done(error, created);
    });
  });

  it('should be able to autoset a ref', function (done) {

    const person = {
      parent: parent,
      name: faker.company.companyName()
    };

    Person.create(person, function (error, created) {

      expect(error).to.not.exist;
      expect(created).to.exist;

      expect(created._id).to.exist;

      expect(created.name).to.be.equal(person.name);
      expect(created.parent).to.exist;

      done(error, created);

    });

  });

  after(function (done) {
    Person.remove(done);
  });

});
