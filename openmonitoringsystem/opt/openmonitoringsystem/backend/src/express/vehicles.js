const {Router} = require('express')
const router = Router()
const postgreSQL = require('./../postgresql/PostgreSQL.js');
const pG = new postgreSQL();

/*
router.post('/toselect/vehicles', (req, res) => {
	var data = req.body;
	let query = {
		name: 'toselect-vehicles',
		text: `SELECT v.idvehicle as value, 
(v.license_plate||' '||ma.label||' '||v.year||' '||v.vin||' ['||c.lastname||' '||c.firstname||'] ') as label
FROM public.vehicles v,
	public.contacts c,
	public.marks ma
	WHERE v.idcontact = c.idcontact
	AND ma.idmark = v.idmark
	ORDER BY license_plate;
	`,
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
router.post('/vehicles', (req, res) => {
	var data = req.body;
	let query = {
		name: 'get-vehicles',
		text: `SELECT v.*, v.idvehicle, v.idcontact, v.license_plate, v.idmark, v.idmodel, v.year, v.idcolor, v.idfueltype, v.fuel_tank_capacity, v.idunit_measure_fuel_tank, v.vin, v.note, v.ts, v.rowkey,
(c.lastname||' '||c.firstname) as lfname, c.identification, ma.label as mark_label
	FROM public.vehicles v,
	public.contacts c,
	public.marks ma
	WHERE v.idcontact = c.idcontact
	AND ma.idmark = v.idmark
	ORDER BY license_plate
	`,
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
router.get('/vehicle', (req, res) => {
	var data = req.query; 
	//console.log('Muestra request', req);
	let query = {
		name: 'get-vehicle',
		text: `SELECT * FROM public.vehicles WHERE idvehicle = $1::BIGINT;`,
		values: [data.idvehicle]
	}

	pG.Query(query).then((r)=>{
		res.status(200).json(r.rows);
	}, (e)=>{
		res.status(500).json(e);
	});
})
*/

/*
router.post('/vehicle', (req, res) => {
	var data = req.body; 
	
	var query = {
		name: 'save-vehicle',
		text: `INSERT INTO public.vehicles(idcontact, license_plate, idmark, idmodel, year, idcolor, idfueltype, fuel_tank_capacity, idunit_measure_fuel_tank, vin, note)
		VALUES 
		($1::BIGINT, $2, $3::BIGINT, $4::BIGINT, $5::INTEGER, $6::BIGINT, $7::BIGINT, $8, $9::BIGINT, $10, $11) RETURNING *;`,
		values: [data.idcontact, data.license_plate, data.idmark, data.idmodel, data.year, data.idcolor, data.idfueltype, data.fuel_tank_capacity, data.idunit_measure_fuel_tank, data.vin, data.note]
	}

	if(Number(data.rowkey) > 0 && Number(data.idvehicle) > 0){
		query.text = `UPDATE public.vehicles SET idcontact=$1::BIGINT, license_plate=$2, idmark=$3::BIGINT, idmodel=$4::BIGINT, year=$5, idcolor=$6::BIGINT, idfueltype=$7::BIGINT, fuel_tank_capacity=$8::INTEGER, idunit_measure_fuel_tank=$9::BIGINT, vin=$10, note=$11
		WHERE idvehicle=$12::BIGINT AND rowkey=$13::SMALLINT RETURNING *;`;
		query.values = [data.idcontact, data.license_plate, data.idmark, data.idmodel, data.year, data.idcolor, data.idfueltype, data.fuel_tank_capacity, data.idunit_measure_fuel_tank, data.vin, data.note, data.idvehicle, data.rowkey]
	}


	console.log('Guarda-Actualiza', data, 'rowkey: '+Number(data.rowkey), 'idvehicle: '+Number(data.idvehicle), query);


	pG.Query(query).then((r)=>{
		res.status(200).json({save: true, data: r});
	}, (e)=>{
		res.status(500).json({save: false, error: e});
	});
})
*/

/*
router.get('/pg', (exreq, exres) => {

	exres.send(JSON.stringify('Esta funcionando'))

})
*/

module.exports = router;