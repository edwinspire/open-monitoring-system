const {Router} = require('express')
const router = Router()
const postgreSQL = require('./../postgresql/PostgreSQL.js');
const pG = new postgreSQL();

/*
router.get('/fuelinglog', (req, res) => {
	var data = req.query; 
	let query = {
		name: 'get-fuelinglog',
		text: `SELECT * FROM public.fueling WHERE idvehicle = $1::BIGINT ORDER BY date_reg DESC;`,
		values: [data.idvehicle]
	}

	pG.Query(query).then((r)=>{
		res.status(200).json(r.rows);
	}, (e)=>{
		res.status(500).json(e);
	});

*/
/*
router.post('/fueling', (req, res) => {
	var data = req.body; 
	
	var query = {
		name: 'save-fueling',
		text: `INSERT INTO public.fueling(
		date_reg, idvehicle, iduser, odometer, quantity, idfueltype, price_by_unit, total, full_tank, geox, geoy, address, last_lost, note
		)VALUES (
		$1::timestamp with time zone, $2::BIGINT, $3::BIGINT, $4::INTEGER, $5::REAL, $6::BIGINT, $7::REAL, $8::REAL, $9::BOOLEAN, $10::REAL, $11::REAL, $12::TEXT, $13::BOOLEAN, $14::TEXT) RETURNING *;`,
		values: [data.date_reg, data.idvehicle, data.iduser, data.odometer, data.quantity, data.idfueltype, data.price_by_unit, data.total, data.full_tank, data.geox, data.geoy, data.address, data.last_lost, data.note]
	}

	if(Number(data.rowkey) > 0 && Number(data.idfueling) > 0){
		query.text = `UPDATE public.fueling
		SET  date_reg=$1::timestamp with time zone, idvehicle=$2::BIGINT, iduser=$3::BIGINT, odometer=$4::REAL, quantity=$5::REAL, idfueltype=$6::BIGINT, price_by_unit=$7::REAL, total=$8::REAL, full_tank=$9::BOOLEAN, geox=$10::REAL, geoy=$11::REAL, address=$12::TEXT, last_lost=$13::BOOLEAN, note=$14::TEXT
		WHERE idfueling=$15::BIGINT AND rowkey=$16::SMALLINT RETURNING *;`;
		query.values = [data.date_reg, data.idvehicle, data.iduser, data.odometer, data.quantity, data.idfueltype, data.price_by_unit, data.total, data.full_tank, data.geox, data.geoy, data.address, data.last_lost, data.note, data.idfueling, data.rowkey]
	}

	console.log('Guarda-Actualiza', data, 'rowkey: '+Number(data.rowkey), 'idfueling: '+Number(data.idfueling), query);

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