import { v, create } from '@dojo/framework/core/vdom';
import * as css from './styles/Prueba.m.css';

import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

var mapDiv = v('div', {id: 'map'}, ['Opelayers']);
var m = new Map({
	target: mapDiv.properties.id,
	layers: [
	new TileLayer({
		source: new OSM()
	})
	],
	view: new View({
		center: [0, 0],
		zoom: 0
	})
});

m.setTarget(mapDiv.properties.id);
m.render();

setTimeout(()=>{
m.setTarget(mapDiv.properties.id);
m.render();	
}, 10000);

const factory = create();

console.log(m, mapDiv);

export default factory(function Profile() {
	return v('h1', { classes: [css.root] }, [
		'Prueba', 
		mapDiv
		]);
});
