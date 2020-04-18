import { v, w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import TPane from '@dojo/widgets/title-pane';
import Button from '@dojo/widgets/button';




export default class MyWidget extends WidgetBase  {
	private valpass = 'Valor';
	private GeoLocalizacion = {coords: {latitude: 0, longitude: 0, speed: 0 as any} };
	private kmh = 0;
	private Altitud = 0;
	private ws = window.GlobalSocketIO;
	private open = false;

	protected render(){

		this.ws.on('hora', (data: any)=> {
			//console.log('Hora: ', data);
			//socket.emit('my other event', { my: 'data' });
			this.valpass = new Date(data.hora).toLocaleString();
			this.invalidate();
		});

		this.ws.on('/dashboard/geolocation', (data: any)=> {
			console.log('Path: ', data);
		});

		if (navigator.geolocation) {

			navigator.geolocation.watchPosition((pos)=>{

				//console.log(pos);
				this.GeoLocalizacion = pos;
				this.kmh = ((pos.coords.speed || 0) * 3.6) || 0;
				this.Altitud = pos.coords.altitude||0;
				//const Request = {ClientRequest:{path: '/dashboard/geolocation'}, Data: {gps: pos.coords.latitude, altitud: this.Altitud, valor: this.valpass}};
				let GPSData = {latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy,  altitude: pos.coords.altitude, altitudeAccuracy: pos.coords.altitudeAccuracy, heading: pos.coords.heading, speed: pos.coords.speed, timestamp: pos.timestamp};

				fetch('/gps', {
					method: 'POST',
					body: JSON.stringify(GPSData),
					headers: {
						'Content-Type': 'application/json'
					}
				});

				this.invalidate();

			}, (error)=>{
				console.log(error);
			});
		} else {
			this.GeoLocalizacion.coords.latitude = 0;
			this.GeoLocalizacion.coords.longitude = 0;
			this.invalidate();
		}

		return v('div', { classes: [] }, [
			w(TPane, {title: 'Prueba',
				open: this.open,
				onRequestOpen: () => {
					this.open = true;
					console.log('onRequestOpen', this.open);
					this.invalidate();
				},
				onRequestClose: (e) => {
					this.open = false;
					console.log('onRequestClose', this.open, e);
					this.invalidate();
				},
			},  ['holal']),
			w(TPane, {title: 'Car Log Dashboard', key: 'GPS-title-pane'}, [
				v('h1', {}, [`Velocidad: ${this.kmh.toFixed(1)} Km/h`]),				
				v('h2', {}, [`Altitud: ${this.Altitud.toFixed(1)} m`]),								
				v('h3', {}, [`Latitud: ${this.GeoLocalizacion.coords.latitude}`]),
				v('h3', {}, [`Longitud: ${this.GeoLocalizacion.coords.longitude}`]),
				v('h3', {}, [`Servidor: ${this.valpass}`]),
				w(
					Button,
					{
						key: 'b2',
						disabled: false,
						onClick: ()=>{                 

							var  options = {title: 'Hola desde Car Log', options: {body: 'Esta es una pequeña prueba'}};

							fetch('local_notification.sw', {
								method: 'POST',
								body: JSON.stringify(options),
								headers: {
									'Content-Type': 'application/json'
								}
							})

							if(this.valpass == '1234'){
								//				console.log('Has ingresado '+this.valpass);
								window.location.href = "/#profile";
							}else{
								//alert('La clave '+this.valpass+' no es correcta.');
							}

							this.invalidate();

						}
					},
					['Submit']
					)

				])
			]);

	}


}