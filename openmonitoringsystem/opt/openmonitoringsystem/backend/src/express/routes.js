const {Router} = require('express')
const webpush = require('./webpush')
const crypto = require('crypto')
const router = Router()
const postgreSQL = require('./../postgresql/PostgreSQL.js')

const pushClients = new Map();
const pG = new postgreSQL();

/*
router.post('/login', (req, res) => {
	pG.AccessPoint('/login', req, res).then((data)=>{
		if(data){
			let user = data;
			user.private = {};
			res.cookie('TOKEN_USER', user.token, { maxAge: 900000, httpOnly: true });
			res.status(200).json(user);
		}
	})
})
*/

/*
router.post('/register', (req, res) => {
	pG.AccessPoint('/register', req, res).then((data)=>{
		if(data){
			res.status(200).json(data);
		}
	})
})
*/

/*
router.post('/summary', (req, res) => {
	pG.AccessPoint('/summary', req, res).then((data)=>{
		if(data){
			res.status(200).json(data);
		}
	})
})
*/

/*
router.post('/toselect/contacttypes', (req, res) => {
	pG.AccessPoint('/toselect/contacttypes', req, res).then((data)=>{
		if(data){
			res.status(200).json(data);
		}
	});
})
*/

/*
router.post('/register', (req, res) => {
	var data = req.body;
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	let query = {
		name: 'register',
		text: `SELECT public.access_point($1::TEXT, $2::JSON, $3::inet, $4::JSON)`,
		values: ['/register', JSON.stringify(req.cookies), ip, data]
	}
	try{
		pG.Query(query).then((r)=>{
			if(r.rows.length > 0){
				res.status(200).json(r.rows[0].access_point);
			}else{
				res.status(200).json(r.rows);
			}
		})
	}catch(e){
		res.status(500).json(e);
	}
});
*/



/*
router.post('/register', (req, res) => {
	var data = req.body;
	let query = {
		name: 'login',
		text: `SELECT public.register(
		$1::text, 
		$2::text, 
		$3::text, 
		$4::text, 
		$5::text, 
		$6::text
		);
		`,
		values: [data.account, data.firstname, data.lastname, data.username, data.pwd, data.email]
	}
	pG.Query(query).then((r)=>{

		if(r.rows.length > 0){
			res.status(200).json(r.rows[0]);
		}else{
			res.status(200).json(r);	
		}

	}, (e)=>{
		res.status(500).json(e);
	});
})
*/

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


router.post('/gps', (req, res) => {
	let query = {
		name: 'save-gps',
		text: 'INSERT INTO public.gps(gps) VALUES ($1) RETURNING *',
		values: [JSON.stringify(req.body)]
	}
	pG.Query(query).then((r)=>{
		res.status(200).json({save: true});
	}, (e)=>{
		res.status(500).json({save: false});
	});
})


/*
router.post('/toselect/identificationtypes', (req, res) => {
	var data = req.body;
	let query = {
		name: 'toselect-identificationtypes',
		text: 'SELECT ididentificationtype as value, label, disabled FROM public.identificationtypes ORDER BY label;',
		values: []
	}
	pG.Query(query).then((r)=>{
		res.status(200).json(r.rows);
	}, (e)=>{
		res.status(500).json(e);
	});
})

router.post('/toselect/genders', (req, res) => {
	var data = req.body;
	let query = {
		name: 'toselect-idgender',
		text: 'SELECT idgender as value, label, disabled FROM public.genders ORDER BY label;',
		values: []
	}
	pG.Query(query).then((r)=>{
		res.status(200).json(r.rows);
	}, (e)=>{
		res.status(500).json(e);
	});
})
*/




/*
router.post('/toselect/marks', (req, res) => {
	var data = req.body;
	let query = {
		name: 'toselect-marks',
		text: 'SELECT idmark as value, label, disabled FROM public.marks ORDER BY label;',
		values: []
	}
	pG.Query(query).then((r)=>{
		res.status(200).json(r.rows);
	}, (e)=>{
		res.status(500).json(e);
	});
})
*/

/*
router.post('/toselect/models', (req, res) => {
	var data = req.body;
	let query = {
		name: 'toselect-models',
		text: 'SELECT idmodel as value, label, disabled FROM public.models ORDER BY label;',
		values: []
	}
	pG.Query(query).then((r)=>{
		res.status(200).json(r.rows);
	}, (e)=>{
		res.status(500).json(e);
	});
})
*/

/*
router.post('/toselect/colors', (req, res) => {
	var data = req.body;
	let query = {
		name: 'toselect-colors',
		text: 'SELECT idcolor as value, label, disabled FROM public.colors ORDER BY label;',
		values: []
	}
	pG.Query(query).then((r)=>{
		res.status(200).json(r.rows);
	}, (e)=>{
		res.status(500).json(e);
	});
})
*/

/*
router.post('/toselect/fueltypes', (req, res) => {
	var data = req.body;
	let query = {
		name: 'toselect-fueltypes',
		text: 'SELECT idfueltype as value, label, disabled FROM public.fueltypes ORDER BY label;',
		values: []
	}
	pG.Query(query).then((r)=>{
		res.status(200).json(r.rows);
	}, (e)=>{
		res.status(500).json(e);
	});
})
*/


/*
router.post('/toselect/unit_measure_fuel_tanks', (req, res) => {
	var data = req.body;
	let query = {
		name: 'toselect-unit_measure_fuel_tanks',
		text: 'SELECT idunit_measure_fuel_tank as value, label, disabled FROM public.unit_measure_fuel_tanks ORDER BY label;',
		values: []
	}
	pG.Query(query).then((r)=>{
		res.status(200).json(r.rows);
	}, (e)=>{
		res.status(500).json(e);
	});
})
*/




router.get('/pg', (exreq, exres) => {

	exres.send(JSON.stringify('Esta funcionando'))

})


module.exports = router;