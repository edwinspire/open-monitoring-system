require(["dojo/request",
	"dojo/on", 
	"dojo/_base/array", 
	"dojo/node!crypto",
	"dojo/node!path", 
	"dojo/node!fs", 
	"dojo/node!path-to-regexp", 
	"dojo/node!pg", 
	"dojo/node!compression", 
	"dojo/node!mssql", 
	"dojo/node!nodemailer",
	"api/postgres/oms", 
	"dojox/encoding/digests/MD5", 
	"dstore/Memory",
	"api/config", 
	"api/postgres/udc_dgrid_structure", 
	"api/postgres/oms_query_builder", 
	"api/postgres/udc_table_accounts", 
	"api/postgres/udc_table_phones", 
	"api/postgres/udc_table_emails", 
	"api/postgres/udc_table_account_contacts", 
	"api/postgres/udc_table_account_users",
	"api/postgres/udc_table_account_equipments",
	"api/postgres/udc_farma_view_lista_precios",
	"api/postgres/udc_tables_views",
	"api/postgres/udc_tables_columns",
	"api/postgres/udc_table_groups",
	"api/postgres/udc_table_account_events_isopen",
	"api/postgres/udc_table_events_isopen",
	"api/postgres/udc_table_events_details",
	"api/postgres/udc_table_events",
	"api/postgres/udc_account_events_comments"  
	], function(request, on, array, crypto, path, fs, pathToRegexp, pG, compression, mssql, nodeMailer, pgOMS, MD5, Memory, Config){


var ConfigParameter = new Config();
var MovInvMatriz = new Memory();
var MovInvConsolidado = new Memory();



function ConnPV(ip, oficina){

mssql.connect({
    user: 'sa',
    password: 'sql',
    server: ip, // You can use 'localhost\\instance' to connect to named instance 
    database: 'msdb',
    options: {
        encrypt: true // Use this if you're on Windows Azure 
    }
}).then(function() {
    // Query 

MovInvMatriz.filter({oficina: oficina}).forEach(function(movimiento){
//console.log("== ", reg);

var srtquery = `USE ITE_Pos
SELECT serie_factura, (select TOP(1)codigo from ITE_Articulo.art.tbl_articulo(nolock) where codigo = @codigo) as exite_material FROM [ITE_Pos].[fact].[tbl_MovimientoInventario_cab] c(nolock) WHERE serie_factura = @serie_factura;
`;

    new mssql.Request()
    .input('serie_factura', sql.String, movimiento.serie_factura);
    .input('codigo', sql.String, movimiento.codigo_producto);
    .query(srtquery).then(function(recordset) {
   
var mov = movimiento;
mov['serie_factura_pv'] = recordset.serie_factura;
mov['existe_material'] = recordset.existe_material;
console.log(mov);
MovInvConsolidado.put(mov);

    }).catch(function(err) {
        // ... error checks 
        console.log(err);
    });



// var nItem = reg;
// nItem["CanTotalPV"] = item.CanTotal;
// console.log("==> ", nItem);
// MovInvConsolidado.put(nItem);
});

 

}).catch(function(err) {
    // ... error checks 
    console.log(err);
});

}



		var PostgreSQL = new pgOMS(ConfigParameter.pgConnectionParameters);


		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
// create reusable transporter object using the default SMTP transport 
var transporter = nodeMailer.createTransport(ConfigParameter.smtpConfig);






mssql.connect({
    user: 'sa',
    password: 'sql',
    server: '172.16.200.12', // You can use 'localhost\\instance' to connect to named instance 
    database: 'msdb',
    requestTimeout: 3000000,
    options: {
        encrypt: true // Use this if you're on Windows Azure 
    }
}).then(function() {
    // Query 
var msSQLConnection = this;    

var srtquery = `
USE EasyGestionEmpresarial
SELECT c.oficina, c.num_mov, c.tipo_mov, d.codigo_producto, d.cantidad, c.dui, c.FechaRegistro,d.FechaIngreso, c.Fecha_Vencimiento_Pago, c.numero_doc_inv, c.serie_factura, d.serie_factura, CAST( CASE WHEN c.serie_factura = d.serie_factura  THEN 'true'  ELSE 'false' END AS text) as coincide
FROM tbl_maestromovinvent c(nolock) 
INNER JOIN tbl_movinvent d(nolock) ON c.num_mov = d.num_mov AND c.tipo_mov = d.tipo_mov AND c.oficina = d.oficina 
WHERE convert(varchar,c.FechaRegistro,111) BETWEEN '2017/02/23' and '2017/02/23'
AND c.tipo_mov in ('TRASPASOS','STRASPASOS','AJUSMAS','AJUSMEN','I') and c.num_mov <> 1
`;

    new mssql.Request()
 //   .input('input_parameter', sql.Int, value);
    .query(srtquery).then(function(recordset) {


 MovInvMatriz = new Memory({data:recordset});

//console.log(MovInvMatriz);

			PostgreSQL.query("SELECT accounts.idcontact, accounts.enabled AS enabled_account, (accounts.last_name ||' '|| accounts.first_name) as account_name, accounts.identification,   accounts.idaccountstate,   accounts.account,   accounts.iddivision,   network_devices.idequipment,   network_devices.equipment,   network_devices.ip,   network_devices.mac,   network_devices.username,   network_devices.pwd,   network_devices.port,   network_devices.monitored,   network_devices.report_validator FROM   public.accounts,   public.network_devices WHERE   network_devices.idaccount = accounts.idcontact AND iddivision = 6;", []).then(function(response){

 //console.log(MovInvPV);
array.forEach(response.rows, function(oficina){

ConnPV(oficina.ip, oficina.account);

});




setTimeout(function(){

var Resultado = "";

//console.log(MovInvMatriz);
MovInvConsolidado.forEach(function(mov){
Resultado = Resultado+mov.oficina+"|\t"+mov.CanTotal+"|\t"+mov.CanTotalPV+"|\t"+mov.TipoTrx+"¡</br>\n\r";

});


	mailOptions = {
    from: '"Edwin De La Cruz 👥" <edwindelacruz@farmaenlace.com>', // sender address 
    to: 'edwinspire@gmail.com, edwindelacruz@farmaenlace.com', // list of receivers 
    subject: 'Open Monitoring System Start ✔ '+Date.now(), // Subject line 
    text: "Revision Movimientos Inventarios ETA", // plaintext body 
    html: "Revision movimientos ETA",// html body
    attachments: [
    {   // binary buffer as an attachment
        filename: 'movimientos.txt',
        content: new Buffer(Resultado,'utf-8')
    }]
};
// send mail with defined transport object 
transporter.sendMail(mailOptions, function(error, info){
	if(error){
		return console.log(error);
	}
	console.log('Message email sent: ' + info.response);
});

}, 20000);


			});



    }).catch(function(err) {
        // ... error checks 
        console.log(err);
    });
 

}).catch(function(err) {
    // ... error checks 
    console.log(err);
});



process.on('uncaughtException', function(error){
	console.log(error);
});


});







