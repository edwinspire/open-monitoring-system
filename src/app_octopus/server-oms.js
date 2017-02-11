 var dojo = require('dojo-node'); 


 dojo.require(["dojo/request",
    "dojo/on", 
    "dojo/_base/array", 
    "dojo/node!crypto",
    "dojo/node!http", 
    "dojo/node!socket.io", 
    "dojo/node!path", 
    "dojo/node!fs", 
    "dojo/node!url", 
    "dojo/node!cookie-parser", 
    "dojo/node!path-to-regexp", 
    "dojo/node!express", 
    "dojo/node!pg", 
    "dojo/node!compression", 
    "dojo/node!mssql", 
    "dojo/node!body-parser", 
    "dojo/node!nodemailer",
    "dojo/node!node-xmpp-client",
    "dojo/node!telegraf",
    "dojo/store/Memory",
    "custom/postgres/oms", 
    "dojox/encoding/digests/MD5", 
    "custom/session_users/session_users", 
    "custom/postgres/udc_dgrid_structure", 
    "custom/postgres/oms_query_builder", 
    "custom/postgres/udc_table_accounts", 
    "custom/postgres/udc_table_phones", 
    "custom/postgres/udc_table_emails", 
    "custom/postgres/udc_table_account_contacts", 
    "custom/postgres/udc_table_account_users",
    "custom/postgres/udc_table_account_equipments",
    "custom/postgres/udc_farma_view_lista_precios",
    "custom/postgres/udc_tables_views",
    "custom/postgres/udc_tables_columns",
    "custom/postgres/udc_table_groups",
    "custom/postgres/udc_table_account_events_isopen",
    "custom/postgres/udc_table_events_isopen",
    "custom/postgres/udc_table_events_details",
    "custom/postgres/udc_table_events",
    "custom/postgres/udc_account_events_comments"  
    ], function(request, on, array, crypto, http, sio, path, fs, url, cookieParser, pathToRegexp, express, pG, compression, mssql, bodyParser, nodeMailer, XmppClient, Telegraf, Memory, pgOMS, MD5, sessionusers){

     var pgParam = {user: 'postgres', pwd: 'pg4321', host: '192.168.251.174', db: 'oms'};
     var sessionUsers = new sessionusers();
     var PostgreSQL = new pgOMS(pgParam);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////// MOVIMIENTO DE INVENTARIOS

var fecha = '2017/02/10';
var fileMovInvProdPruebas = "MovInvProdPruebas_"+(new Date().getTime())+".txt";
var fileMovInvProdPruebasCabeceraDetalle = "MovInvProdPruebasCabeceraDetalle"+(new Date().getTime())+".txt";

console.log(fileMovInvProdPruebas);

var storeInvPruebas = new Memory({});
var storeInvProduccion = new Memory({});


mssql.connect("mssql://sa:sqlfarma@192.168.238.99/GESTIONMASTER").then(function() {


    new mssql.Request().query("SELECT c.oficina, c.num_mov, c.tipo_mov, d.codigo_producto, d.cantidad, c.dui, c.FechaRegistro,d.FechaIngreso, c.Fecha_Vencimiento_Pago, c.numero_doc_inv, c.serie_factura, d.serie_factura, CAST( CASE WHEN c.serie_factura = d.serie_factura  THEN 'true'  ELSE 'false' END AS text) as coincide FROM  [GESTIONMASTER].[dbo].[tbl_maestromovinvent] c(nolock)  INNER JOIN  [GESTIONMASTER].[dbo].[tbl_movinvent]  d(nolock) ON c.num_mov = d.num_mov AND c.tipo_mov = d.tipo_mov AND c.oficina = d.oficina AND convert(varchar,c.FechaRegistro,111) BETWEEN '"+fecha+"' and '"+fecha+"' AND c.tipo_mov in ('TRASPASOS','STRASPASOS','AJUSMAS','AJUSMEN','I') and c.num_mov <> 1;").then(function(recordset) {


        storeInvPruebas.setData(recordset);

        mssql.connect("mssql://sa:sqlPCMASTER@172.16.200.12/GESTIONMASTER").then(function() {

            new mssql.Request().query("SELECT c.oficina, c.num_mov, c.tipo_mov, d.codigo_producto, d.cantidad, c.dui, c.FechaRegistro,d.FechaIngreso, c.Fecha_Vencimiento_Pago, c.numero_doc_inv, c.serie_factura, d.serie_factura, CAST( CASE WHEN c.serie_factura = d.serie_factura  THEN 'true'  ELSE 'false' END AS text) as coincide FROM  [GESTIONMASTER].[dbo].[tbl_maestromovinvent] c(nolock)  INNER JOIN  [GESTIONMASTER].[dbo].[tbl_movinvent]  d(nolock) ON c.num_mov = d.num_mov AND c.tipo_mov = d.tipo_mov AND c.oficina = d.oficina AND convert(varchar,c.FechaRegistro,111) BETWEEN '"+fecha+"' and '"+fecha+"' AND c.tipo_mov in ('TRASPASOS','STRASPASOS','AJUSMAS','AJUSMEN','I') and c.num_mov <> 1;").then(function(recordsetw) {

                var CadenaRetornoMovInv = "FECHA: "+fecha+"\n\nPRODUCCION: "+recordsetw.length+"\n"+"PRUEBAS: "+storeInvPruebas.data.length+"\n\n";
                var CadenaRetornoCabeceraDetalle = "FECHA: "+fecha+"\n\nPRODUCCION: "+recordsetw.length+"\n"+"PRUEBAS: "+storeInvPruebas.data.length+"\n\n";

                storeInvProduccion.setData(recordset);

                if(recordsetw.length != storeInvPruebas.data.length){
                 array.forEach(recordsetw, function(movimiento){
                    var c = storeInvPruebas.query({oficina: movimiento.oficina, tipo_mov: movimiento.tipo_mov, codigo_producto: movimiento.codigo_producto, numero_doc_inv: movimiento.numero_doc_inv}).length;
                    if(c < 1){
                      //  console.log(JSON.stringify(movimiento));
                      CadenaRetornoMovInv = CadenaRetornoMovInv+"\n"+JSON.stringify(movimiento)+"\n";
                  }
              }); 
             }



             storeInvPruebas.query({coincide: false}).forEach(function(item){
              //  console.log(JSON.stringify(item));
              CadenaRetornoCabeceraDetalle = CadenaRetornoCabeceraDetalle+"\n"+JSON.stringify(item)+"\n";
          });



             fs.writeFile(fileMovInvProdPruebasCabeceraDetalle, CadenaRetornoCabeceraDetalle, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });


             fs.writeFile(fileMovInvProdPruebas, CadenaRetornoMovInv, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });


         }).catch(function(err) {
            console.log('Algo falla ', error);
        });

     });


    }).catch(function(err) {
        console.log('Algo falla ', error);
    });

});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var ObtieneMovInvMatriz = "DECLARE @Fecha AS varchar(10) SET @Fecha = '2017/02/08' SELECT c.oficina, count(*) AS CanTotal, '#Registros' AS TipoTrx FROM tbl_maestromovinvent c(nolock)  INNER JOIN tbl_movinvent d(nolock) ON c.num_mov = d.num_mov AND c.tipo_mov = d.tipo_mov and c.oficina = d.oficina and c.serie_factura = d.serie_factura WHERE convert(varchar,c.FechaRegistro,111) = @Fecha AND c.tipo_mov in ('TRASPASOS','STRASPASOS','AJUSMAS','AJUSMEN','I') and c.num_mov <> 1 GROUP BY c.oficina UNION ALL SELECT c.oficina, sum(d.cantidad), 'Entradas' FROM tbl_maestromovinvent c(nolock)  INNER JOIN tbl_movinvent d(nolock) ON c.num_mov = d.num_mov AND c.tipo_mov =  d.tipo_mov and c.oficina = d.oficina and c.serie_factura = d.serie_factura WHERE convert(varchar,c.FechaRegistro,111) = @Fecha AND c.tipo_mov in ('TRASPASOS','AJUSMAS','I') and c.num_mov <> 1 GROUP BY c.oficina UNION ALL SELECT c.oficina, sum(d.cantidad),'Salidas' FROM tbl_maestromovinvent c(nolock) INNER JOIN tbl_movinvent d(nolock) ON c.num_mov = d.num_mov AND c.tipo_mov = d.tipo_mov and c.oficina = d.oficina and c.serie_factura = d.serie_factura WHERE convert(varchar,c.FechaRegistro,111) = @Fecha AND c.tipo_mov IN ('STRASPASOS','AJUSMEN') and c.num_mov <> 1 GROUP BY c.oficina ORDER BY c.oficina, TipoTrx ;";

var ObtieneMovInvPV = "DECLARE @Fecha AS varchar(10) SET @Fecha = '2017/02/09' SELECT count(*) AS CanTotal, 'Registros' AS TipoTrx FROM [ITE_Pos].[fact].[tbl_MovimientoInventario_cab] c(nolock) INNER JOIN [ITE_Pos].[fact].[tbl_MovimientoInventario_det] d(nolock) on c.num_mov = d.num_mov AND c.tipo_mov = d.tipo_mov and c.serie_factura = d.serie_factura WHERE convert(varchar,c.FechaRegistro,111) = @Fecha AND c.tipo_mov IN ('TRASPASOS','STRASPASOS','AJUSMAS','AJUSMEN','I') and c.num_mov <> 1 UNION ALL SELECT sum(d.cantidad), 'Entradas' FROM [ITE_Pos].[fact].[tbl_MovimientoInventario_cab] c(nolock)  INNER JOIN [ITE_Pos].[fact].[tbl_MovimientoInventario_det] d(nolock) ON c.num_mov = d.num_mov AND c.tipo_mov = d.tipo_mov and c.serie_factura = d.serie_factura WHERE convert(varchar,c.FechaRegistro,111) = @Fecha AND c.tipo_mov IN ('TRASPASOS','AJUSMAS','I') and c.num_mov <> 1 UNION ALL SELECT sum(d.cantidad),'Salidas' FROM [ITE_Pos].[fact].[tbl_MovimientoInventario_cab] c(nolock)  INNER JOIN [ITE_Pos].[fact].[tbl_MovimientoInventario_det] d(nolock) ON c.num_mov = d.num_mov AND c.tipo_mov = d.tipo_mov and c.serie_factura = d.serie_factura WHERE convert(varchar,c.FechaRegistro,111) = @Fecha AND c.tipo_mov IN ('STRASPASOS','AJUSMEN') and c.num_mov <> 1 ;";


var storeObtieneMovInvMatriz = new Memory({});

mssql.connect("mssql://sa:sqlrm@172.16.200.20/GESTIONMASTER").then(function() {

    new mssql.Request().query(ObtieneMovInvMatriz).then(function(record) {

       //storeObtieneMovInvMatriz.setData(record);
      //console.log(record);

      PostgreSQL.query("SELECT * FROM public.view_account_network_devices WHERE iddivision = 7 AND enabled = true AND monitored = true;", []).then(function(response){
        console.log(response.rows);


        array.forEach(response.rows, function(item){
            mssql.connect("mssql://sa:sqlrm@"+item.ip+"/ITE_Pos").then(function() {

                new mssql.Request().query(ObtieneMovInvPV).then(function(recordpv) {
                    console.log(recordpv);
                });

            }).catch(function(err) {
                console.log('Algo falla ', error);
            });
        });


    });


  });

}).catch(function(err) {
    console.log('Algo falla ', error);
});


















});

 