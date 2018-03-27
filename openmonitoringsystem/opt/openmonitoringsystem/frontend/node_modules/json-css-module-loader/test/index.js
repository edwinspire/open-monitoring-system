const fs = require('fs');
const assert = require('assert');
const sinon = require('sinon');
const index = require('../index');

describe('json-css-module-loader', () => {
	let loader;

	describe('loading json file', () => {
		const modulePath = './test/support/module1.json';
		const module = fs.readFileSync(modulePath, 'utf8');
		const expectedOutput = fs.readFileSync('./test/support/module1Output.js', 'utf8');

		beforeEach(() => {
			loader = index.bind({ resourcePath: modulePath });
		});

		it('it should add a require for the relevant css file at top of file', () => {
			assert.equal(loader(module), expectedOutput.trim());
		});

		it('it should add module.exports to the response', () => {
			function containsModuleExports(module) {
				return module.indexOf('module.exports') > -1;
			}

			assert.equal(containsModuleExports(module), false, 'Input should not contain moduleExports');
			assert.equal(containsModuleExports(loader(module)), true, 'Output should contain moduleExports');
		});
	});

	describe('loading .css.json', () => {
		const modulePath = './test/support/module1.json';
		const module = fs.readFileSync(modulePath, 'utf8');
		const expectedOutput = fs.readFileSync('./test/support/module1Output.js', 'utf8');

		beforeEach(() => {
			loader = index.bind({ resourcePath: './test/support/module1.css.json' });
		});

		it('it should add a require for the relevant css file at top of file', function() {
			assert.equal(loader(module), expectedOutput.trim());
		});
	});

	describe('loading js file', () => {
		const modulePath = './test/support/module2.js';
		const module = fs.readFileSync(modulePath, 'utf8');
		const expectedOutput = fs.readFileSync('./test/support/module2Output.js', 'utf8');

		beforeEach(() => {
			loader = index.bind({ resourcePath: modulePath });
		});

		it('it should add a require for the relevant css file at top of file', function() {
			assert.equal(loader(module), expectedOutput.trim());
		});
	});

	describe('caching', () => {
		const modulePath = './test/support/module1.json';
		const module = fs.readFileSync(modulePath, 'utf8');
		let cacheableStub;

		beforeEach(() => {
			cacheableStub = sinon.stub();
			loader = index.bind({ resourcePath: modulePath, cacheable: cacheableStub });
		});

		it('it should call the cacheable function if it exists', function() {
			loader(module);
			assert.equal(cacheableStub.calledOnce, true);
		});
	});
});
