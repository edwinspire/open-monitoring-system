const {Router} = require('express')
const router = Router()
const postgreSQL = require('./../postgresql/PostgreSQL.js');
const pG = new postgreSQL();

/*
router.get('/contact', (req, res) => {
	var data = req.query; 
	//console.log('Muestra request', req);
	let query = {
		name: 'get-contact',
		text: `SELECT idcontact, rowkey, firstname, lastname, identification, ididentificationtype, birthday::TEXT, idcontacttype, note, idgender FROM public.contacts WHERE idcontact = $1::BIGINT;`,
		values: [data.idcontact]
	}

	pG.Query(query).then((r)=>{
		res.status(200).json(r.rows);
	}, (e)=>{
		res.status(500).json(e);
	});

})
*/


/*
router.post('/toselect/contacts', (req, res) => {
	var data = req.body;
	let query = {
		name: 'toselect-contacts',
		text: "SELECT idcontact as value, (lastname||' '||firstname) as label FROM public.contacts ORDER BY lastname, firstname;",
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
router.post('/contact', (req, res) => {
	var data = req.body; 
	
	var query = {
		name: 'save-contact',
		text: `INSERT INTO public.contacts(firstname,     lastname,      identification,      ididentificationtype,         birthday,      idcontacttype,     idgender,      note) 
		VALUES ($1,            $2,            $3,                  $4::BIGINT,                   $5::DATE,            $6::BIGINT,        $7::BIGINT,            $8) RETURNING *;`,
		values:                           [data.firstname, data.lastname, data.identification, data.ididentificationtype, data.birthday, data.idcontacttype, data.idgender, data.note]
	}

	if(Number(data.rowkey) > 0 && Number(data.idcontact) > 0){
		query.text = `UPDATE public.contacts SET firstname = $1, lastname = $2, identification = $3, ididentificationtype = $4::BIGINT, birthday = $5::DATE, idcontacttype = $6::BIGINT, idgender = $7::BIGINT, note = $8 WHERE idcontact = $9::BIGINT AND rowkey = $10::SMALLINT RETURNING *;`;
		query.values = [data.firstname, data.lastname, data.identification, data.ididentificationtype, data.birthday, data.idcontacttype, data.idgender, data.note, data.idcontact, data.rowkey]
	}


	console.log('Guarda-Actualiza', data, 'rowkey: '+Number(data.rowkey), 'idcontact: '+Number(data.idcontact), query);


	pG.Query(query).then((r)=>{
		res.status(200).json({save: true, data: r});
	}, (e)=>{
		res.status(500).json({save: false, error: e});
	});
})
*/

/*
router.post('/contacts', (req, res) => {
	var data = req.body;
	let query = {
		name: 'get-contacts',
		text: `SELECT c.*, (c.lastname||' '||c.firstname) as lfname, it.label as identificationtype_label, g.label as gender_label, ct.label as contactype_label FROM 
public.contacts c, public.identificationtypes it, public.genders g, public.contacttype ct
WHERE c.ididentificationtype = it.ididentificationtype AND c.idgender = g.idgender AND c.idcontacttype = ct.idcontacttype
ORDER BY lastname, firstname;`,
		values: []
	}
	pG.Query(query).then((r)=>{
		res.status(200).json(r.rows);
	}, (e)=>{
		res.status(500).json(e);
	});
})
*/


module.exports = router;