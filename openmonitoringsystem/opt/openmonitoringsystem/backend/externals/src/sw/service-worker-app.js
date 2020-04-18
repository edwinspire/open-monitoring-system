self.addEventListener('fetch', (event)=>{

	if(event.request.url.includes('local_notification.sw')){
		let init = { "status" : 200 , "statusText" : "SuperSmashingGreat!", headers: {
			'Content-Type': 'application/json'
		} };

		event.respondWith(new Response('Notificación local recibida', init));

		event.request.json().then((data)=>{
			//console.log('Cuerpo', data);

			self.registration.showNotification(data.title, data.options).then(()=>{
				console.log('Notificación local mostrada');
			}, (e)=>{
				console.log('Error al mostrar una notificación local', e);
			});

		});

	}else{
		//event.respondWith(fetch(event.request));
	}

}); 


self.addEventListener('push', (e)=> {

	console.log(e, e.data, e.data.json(), e.data.text());

	var options = {
		body: 'test_message',
		tag: "Push Demo",
		image: 'https://pushassist.com/assets/images/How to Use Push Notifications the Right Way-.png',
		icon: 'https://pushassist.com/assets/images/pushassist_default.png' + '?notificationURL=' + encodeURIComponent('test_urllinkp'),
		url: 'https://limitless-cove-50606.herokuapp.com/#fuel',
		renotify: true,
		actions: [{
			action: 'action1',
			title: "Pricing",
			url: "https://pushassist.com/pricing-plans/"
		}, {
			action: 'action2',
			title: "Register",
			url: "https://pushassist.com/register/"
		}],
		data: {
			options: [{
				action: 'action1',
				title: "Pricing",
				url: "https://pushassist.com/pricing-plans/"
			}, {
				action: 'action2',
				title: "Register",
				url: "https://pushassist.com/register/"
			}]
		}
	};
	e.waitUntil(
		self.registration.showNotification('Hello world!', options)
		);
//	self.registration.showNotification('test_uuutitle', options)
});