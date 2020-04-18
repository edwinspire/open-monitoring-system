export default class PushNotifications  {

	public	urlBase64ToUint8Array(base64String: any) {
		const padding = '='.repeat((4 - base64String.length % 4) % 4);
		const base64 = (base64String + padding)
		.replace(/-/g, '+')
		.replace(/_/g, '/');

		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	}

	private subscribeUser() {

		const VAPIDKEY_PUBLIC = 'BMLXlxyQF6kUvfMdwVTzPCTewRedU1QGUFC5FtpodDoMjCreNue0ymh_anNJkS_vS5w-wp3dMyuSdiPeT-I6m_A';

		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.ready.then((reg)=> {

				reg.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: this.urlBase64ToUint8Array(VAPIDKEY_PUBLIC)
				}).then((subs)=> {
					console.log('Endpoint URL: ', subs.endpoint);

				const subscrincion = async()=>{
					await fetch('/pushsubscription', {
						method: 'POST',
						body: JSON.stringify(subs),
						headers: {
							"Content-Type": "application/json"
						}

					})
					console.log('Suscrito')
				}
				subscrincion();


				}).catch((e)=> {
					if (Notification.permission === 'denied') {
						console.warn('Permission for notifications was denied');
					} else {
						console.error('Unable to subscribe to push', e);
					}
				});
			})
		}
	}

/*
	public registerServiceWorker(): void {

		const VAPIDKEY_PUBLIC = 'BMLXlxyQF6kUvfMdwVTzPCTewRedU1QGUFC5FtpodDoMjCreNue0ymh_anNJkS_vS5w-wp3dMyuSdiPeT-I6m_A';

		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('service-worker.js')
			.then(async (registration) =>
			{
				const subs = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: this.urlBase64ToUint8Array(VAPIDKEY_PUBLIC)});

				console.log(`Service Worker registration complete, scope: '${registration.scope}'`)

				const subscrincion = async()=>{
					await fetch('/subscription', {
						method: 'POST',
						body: JSON.stringify(subs),
						headers: {
							"Content-Type": "application/json"
						}

					})
					console.log('Suscrito')
				}
				subscrincion();

			}
			).catch((error) =>
			console.log(`Service Worker registration failed with error: '${error}'`));
		}
	}
	*/

	constructor(){
		//this.registerServiceWorker();
		this.subscribeUser();
	}

}