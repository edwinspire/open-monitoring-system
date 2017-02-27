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
   
console.log(oficina, ip);
//msSQLConnectionPV.close();

        //console.dir(recordset);
        array.forEach(recordset, function(item){

console.log(item);
MovInvMatriz.filter({oficina: oficina, TipoTrx: item.TipoTrx}).forEach(function(reg){
//console.log("== ", reg);
var nItem = reg;
nItem["CanTotalPV"] = item.CanTotal;
console.log("==> ", nItem);
MovInvMatriz.put(nItem);
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
DECLARE @Fecha AS varchar(10)
SET @Fecha = '2017/02/24'

SELECT c.oficina, count(*) AS CanTotal, 'Registros' AS TipoTrx
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
   

//msSQLConnection.close();

  //      console.dir(recordset);


 MovInvMatriz = new Memory({data:recordset});

//console.log(MovInvMatriz);

			PostgreSQL.query("SELECT accounts.idcontact, accounts.enabled AS enabled_account, (accounts.last_name ||' '|| accounts.first_name) as account_name, accounts.identification,   accounts.idaccountstate,   accounts.account,   accounts.iddivision,   network_devices.idequipment,   network_devices.equipment,   network_devices.ip,   network_devices.mac,   network_devices.username,   network_devices.pwd,   network_devices.port,   network_devices.monitored,   network_devices.report_validator FROM   public.accounts,   public.network_devices WHERE   network_devices.idaccount = accounts.idcontact AND iddivision = 6;", []).then(function(response){
			//	console.log(response);

 //var MovInvPV = new Memory({data:response.rows, idProperty: 'account'});
 //console.log(MovInvPV);
array.forEach(response.rows, function(oficina){

ConnPV(oficina.ip, oficina.account);

});




setTimeout(function(){

var Resultado = "";

//console.log(MovInvMatriz);
MovInvMatriz.forEach(function(mov){
Resultado = Resultado+mov.oficina+"|\t"+mov.CanTotal+"|\t"+mov.CanTotalPV+"|\t"+mov.TipoTrx+"¡</br>\n\r";

});


	mailOptions = {
    from: '"Edwin De La Cruz 👥" <edwindelacruz@farmaenlace.com>', // sender address 
    to: 'edwinspire@gmail.com, edwindelacruz@farmaenlace.com', // list of receivers 
    subject: 'Open Monitoring System Start ✔ '+Date.now(), // Subject line 
    text: "Revision Movimientos Inventarios ETA", // plaintext body 
    html: Resultado// html body 
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







