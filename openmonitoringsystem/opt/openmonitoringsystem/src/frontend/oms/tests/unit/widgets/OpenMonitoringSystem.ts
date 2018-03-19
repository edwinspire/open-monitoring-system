const { describe, it } = intern.getInterface('bdd');
import harness from '@dojo/test-extras/harness';

import { v } from '@dojo/widget-core/d';

import OpenMonitoringSystem from '../../../src/widgets/OpenMonitoringSystem';
import * as css from '../../../src/widgets/styles/OpenMonitoringSystem.m.css';

describe('OpenMonitoringSystem', () => {
	it('should render widget', () => {
		const testHelloWorld = harness(OpenMonitoringSystem);
		testHelloWorld.expectRender(v('div', { classes: css.root }, [
			v('img', { src: './img/logo.svg', classes: css.logo }),
			v('div', { classes: css.label }, [ 'Hello, Dojo 2 World!' ])
		]));
	});
});
