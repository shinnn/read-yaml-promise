'use strict';

var readYaml = require('..');
var test = require('tape');
var yaml = require('js-yaml');

test('readYamlPromise()', function(t) {
  t.plan(11);

  t.equal(readYaml.name, 'readYamlPromise', 'should have a function name.');

  readYaml('test/fixture.yaml').then(function(data) {
    t.deepEqual(data, [true], 'should read and parse a YAML file.');
  });

  readYaml('test/fixture-ucs2.yaml', 'ucs2').then(function(data) {
    t.deepEqual(data, [true], 'should accept an encoding string as its second argument.');
  });

  readYaml('test/fixture.yaml', {schema: yaml.FAILSAFE_SCHEMA}).then(function(data) {
    t.deepEqual(data, ['true'], 'should support js-yaml\'s option.');
  });

  readYaml('LICENSE', null).catch(function(err) {
    t.equal(err.name, 'YAMLException', 'should fail when it cannot parse the file.');
    t.ok(/LICENSE/.test(err.message), 'should reflect the filename to the error message.');
  });

  readYaml('node_modules', {}).catch(function(err) {
    t.equal(err.code, 'EISDIR', 'should fail when it cannot read the file.');
  });

  t.throws(
    readYaml.bind(null, 'test/fixture.yaml', 1),
    /TypeError/,
    'should throw a type error when the second argument is not a string or an object.'
  );

  t.throws(
    readYaml.bind(null, 'test/fixture.yaml', 'utf7'),
    /Error.*encoding/,
    'should throw an error when the encoding is unknown.'
  );

  t.throws(
    readYaml.bind(null, true, ['foo']),
    /TypeError.*path/,
    'should throw a type error when the first argument is not a string.'
  );

  t.throws(
    readYaml.bind(null),
    /TypeError.*path/,
    'should throw a type error when it takes no arguments.'
  );
});
