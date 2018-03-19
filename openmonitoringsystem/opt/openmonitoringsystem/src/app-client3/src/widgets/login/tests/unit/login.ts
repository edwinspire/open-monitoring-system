const { describe, it, beforeEach, afterEach } = intern.getInterface('bdd');

import harness, { Harness } from '@dojo/test-extras/harness';

import login from './../../login';

let widget: Harness<login>;

describe('login', () => {
	beforeEach(() => {
		widget = harness(login);
	});

	afterEach(() => {
		widget.destroy();
	});

	it('should construct login', () => {
		widget.expectRender(null);
	});
});
