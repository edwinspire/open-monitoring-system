const {Router} = require('express')
const webpush = require('./webpush')
const crypto = require('crypto')
const router = Router()
const postgreSQL = require('./../postgresql/PostgreSQL.js')

const pushClients = new Map();
const pG = new postgreSQL();

router.post('/pushsubscription',  (req, res)=>{
	
	var subscrip = req.body;
	var cookie = req.cookies.pushcookie;
	if (cookie === undefined)
	{ // no: set a new cookie

		let hash = crypto.createHash('md5').update(JSON.stringify(subscrip)).digest("hex");
		console.log(hash, subscrip);
		pushClients.set(hash, subscrip);
		res.cookie('pushcookie', hash, { maxAge: 900000});
		console.log('cookie created successfully');
		res.status(200).json({hashcookie: hash});
	} 
	else
	{ // yes, cookie was already present 
		console.log('cookie exists', cookie);
		res.status(200).json({cookie: 'NO'});
	} 

});


setInterval(()=>{

	let Notificaciones = [];
	const payload = {
		body: 'Car Log le da la bienvenida',
		tag: "Car Log",
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
	
	pushClients.forEach((valor, clave, miMapa) => {
		Notificaciones.push(webpush.sendNotification('Car Log', JSON.stringify(payload)));
	})

	Promise.all(Notificaciones).then(values => { 
		console.log(values); 
	});


}, 60000)


router.post('/new-message',  (req, res)=>{ // Este método está orientado para emitir mensajes 

	const cookie = req.cookies.pushcookie;

	const {message} = req.body;
	let Notificaciones = [];
	const payload = {
		title: 'Edwinspire',
		message: 'message2'
	};

	if(pushClients.has(cookie)){
		webpush.sendNotification(pushClients.get(cookie), JSON.stringify(payload)).then((data)=>{
			res.status(200).json({respuesta: 'Noticación emitida'});
		}, (e)=>{
			console.log(e)
			res.status(500).json({respuesta: 'Noticación error'});
		});

	}else{
		res.status(200).json({respuesta: 'Cookie no encontrado, no está suscrito'+pushClients.size});
	}
});


module.exports = router;