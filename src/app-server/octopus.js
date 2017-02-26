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



function ConnPV(ip){

mssql.connect({
    user: 'sa',
    password: 'sqlsa',
    server: ip, // You can use 'localhost\\instance' to connect to named instance 
    database: 'msdb',
    options: {
        encrypt: true // Use this if you're on Windows Azure 
    }
}).then(function() {
    // Query 
var msSQLConnectionPV = this;    

var srtquery = `
DECLARE @Fecha AS varchar(10)
SET @Fecha = '2017/02/24'

SELECT count(*) AS CanTotal, 'Registros' AS TipoTrx
FROM [ITE_Pos].[fact].[tbl_MovimientoInventario_cab] c(nolock) 
INNER JOIN [ITE_Pos].[fact].[tbl_MovimientoInventario_det] d(nolock) on c.num_mov = d.num_mov AND c.tipo_mov = d.tipo_mov and c.serie_factura = d.serie_factura
WHERE convert(varchar,c.FechaRegistro,111) = @Fecha AND c.tipo_mov IN ('TRASPASOS','STRASPASOS','AJUSMAS','AJUSMEN','I') and c.num_mov <> 1
UNION ALL
SELECT sum(d.cantidad), 'Entradas'
FROM [ITE_Pos].[fact].[tbl_MovimientoInventario_cab] c(nolock) 
INNER JOIN [ITE_Pos].[fact].[tbl_MovimientoInventario_det] d(nolock) ON c.num_mov = d.num_mov AND c.tipo_mov = d.tipo_mov and c.serie_factura = d.serie_factura
WHERE convert(varchar,c.FechaRegistro,111) = @Fecha AND c.tipo_mov IN ('TRASPASOS','AJUSMAS','I') and c.num_mov <> 1
UNION ALL
SELECT sum(d.cantidad),'Salidas' FROM [ITE_Pos].[fact].[tbl_MovimientoInventario_cab] c(nolock) 
INNER JOIN [ITE_Pos].[fact].[tbl_MovimientoInventario_det] d(nolock) ON c.num_mov = d.num_mov AND c.tipo_mov = d.tipo_mov and c.serie_factura = d.serie_factura
WHERE convert(varchar,c.FechaRegistro,111) = @Fecha AND c.tipo_mov IN ('STRASPASOS','AJUSMEN') and c.num_mov <> 1
`;

    new mssql.Request()
 //   .input('input_parameter', sql.Int, value);
    .query(srtquery).then(function(recordset) {
   

msSQLConnectionPV.close();

        console.dir(recordset);


    }).catch(function(err) {
        // ... error checks 
        console.log(err);
    });
 

}).catch(function(err) {
    // ... error checks 
    console.log(err);
});

}



		var PostgreSQL = new pgOMS(ConfigParameter.pgConnectionParameters);


		// setInterval(function(){
		// 	console.log('Tareas periodicas');
		// 	PostgreSQL.query("SELECT accounts.idcontact, accounts.enabled AS enabled_account, (accounts.last_name ||' '|| accounts.first_name) as account_name, accounts.identification,   accounts.idaccountstate,   accounts.account,   accounts.iddivision,   network_devices.idequipment,   network_devices.equipment,   network_devices.ip,   network_devices.mac,   network_devices.username,   network_devices.pwd,   network_devices.port,   network_devices.monitored,   network_devices.report_validator FROM   public.accounts,   public.network_devices WHERE   network_devices.idaccount = accounts.idcontact;", []).then(function(response){
		// 		console.log(response);
		// 	});
		// }, 60*1000);



		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
// create reusable transporter object using the default SMTP transport 
var transporter = nodeMailer.createTransport(ConfigParameter.smtpConfig);

/*
// send mail with defined transport object 
transporter.sendMail(ConfigParameter.mailOptions, function(error, info){
	if(error){
		return console.log(error);
	}
	console.log('Message email sent: ' + info.response);
});
*/


mssql.connect({
    user: 'sa',
    password: 'sqlsa',
    server: '192.168.238.10', // You can use 'localhost\\instance' to connect to named instance 
    database: 'msdb',
    options: {
        encrypt: true // Use this if you're on Windows Azure 
    }
}).then(function() {
    // Query 
var msSQLConnection = this;    

var srtquery = `
DECLARE @Fecha AS varchar(10)
SET @Fecha = '2017/02/24'

SELECT c.oficina, count(*) AS CanTotal, '#Registros' AS TipoTrx
FROM tbl_maestromovinvent c(nolock) 
INNER JOIN tbl_movinvent d(nolock) ON c.num_mov = d.num_mov AND c.tipo_mov = d.tipo_mov and c.oficina = d.oficina and c.serie_factura = d.serie_factura
WHERE convert(varchar,c.FechaRegistro,111) = @Fecha AND c.tipo_mov in ('TRASPASOS','STRASPASOS','AJUSMAS','AJUSMEN','I') and c.num_mov <> 1
GROUP BY c.oficina
UNION ALL
SELECT c.oficina, sum(d.cantidad), 'Entradas'
FROM tbl_maestromovinvent c(nolock) 
INNER JOIN tbl_movinvent d(nolock) ON c.num_mov = d.num_mov AND c.tipo_mov = d.tipo_mov and c.oficina = d.oficina and c.serie_factura = d.serie_factura
WHERE convert(varchar,c.FechaRegistro,111) = @Fecha AND c.tipo_mov in ('TRASPASOS','AJUSMAS','I') and c.num_mov <> 1
GROUP BY c.oficina
UNION ALL
SELECT c.oficina, sum(d.cantidad),'Salidas'
FROM tbl_maestromovinvent c(nolock) 
INNER JOIN tbl_movinvent d(nolock) ON c.num_mov = d.num_mov AND c.tipo_mov = d.tipo_mov and c.oficina = d.oficina and c.serie_factura = d.serie_factura
WHERE convert(varchar,c.FechaRegistro,111) = @Fecha AND c.tipo_mov IN ('STRASPASOS','AJUSMEN') and c.num_mov <> 1
GROUP BY c.oficina ORDER BY c.oficina, TipoTrx 
`;

    new mssql.Request()
 //   .input('input_parameter', sql.Int, value);
    .query(srtquery).then(function(recordset) {
   

msSQLConnection.close();

        console.dir(recordset);


 var MovInvMatriz = new Memory({data:recordset, idProperty: 'oficina'});

console.log(MovInvMatriz);

			PostgreSQL.query("SELECT accounts.idcontact, accounts.enabled AS enabled_account, (accounts.last_name ||' '|| accounts.first_name) as account_name, accounts.identification,   accounts.idaccountstate,   accounts.account,   accounts.iddivision,   network_devices.idequipment,   network_devices.equipment,   network_devices.ip,   network_devices.mac,   network_devices.username,   network_devices.pwd,   network_devices.port,   network_devices.monitored,   network_devices.report_validator FROM   public.accounts,   public.network_devices WHERE   network_devices.idaccount = accounts.idcontact;", []).then(function(response){
				console.log(response);

 //var MovInvPV = new Memory({data:response.rows, idProperty: 'account'});
 //console.log(MovInvPV);
array.forEach(response.rows, function(oficina){

ConnPV(oficina.ip);

});



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







