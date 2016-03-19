/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready", 'dojo/on', 'dojo/dom-style'], function(ready, on, domStyle){
     ready(function(){

//dijit.byId('idTitulo1').set('label', 'LISTA DE PRECIOS');
var mh = dijit.byId('id_mh');
var g_eco = dijit.byId('id_gridx_eco');
var g_medi = dijit.byId('id_gridx_medi');
var g_difarmes = dijit.byId('id_gridx_difarmes');
var g_paf = dijit.byId('id_gridx_paf');
var g_pnatural = dijit.byId('id_gridx_pnatural');
var g_promo = dijit.byId('id_gridx_promocion');
//var update = dijit.byId('update');


setTimeout(function(){
            g_eco.select();
g_medi.select();
g_difarmes.select();
g_paf.select();
g_pnatural.select();
g_promo.select();
}, 3000);


setInterval(function(){
            g_eco.select();
g_medi.select();
g_difarmes.select();
g_paf.select();
g_pnatural.select();
g_promo.select();
}, 1000*15*60);

/*
dijit.byId('narea').on("sse_onchanged_table", function(e){
 console.log(e);
//console.log("vamos "+e.table_name);
    if(e.table_name.indexOf("farma_lista_precios_farmacias") == 0){
if(update.get("checked") == true){
            g_eco.select();
g_medi.select();
g_difarmes.select();
g_paf.select();
g_pnatural.select();
g_promo.select();
}
    }
    
});
*/


/*

            var stvm = new gsViewListaPrecios();

            var sg1 = stvm.structure;

sg1.estado.r.class = function (cell) {
                        return color_class_status(cell.data());
                    }

sg1.estado.w.class = function (cell) {
                        return color_class_status(cell.data());
                    }


sg1.sincronizado.r.class = function (cell) {
                        return color_class_status(cell.data());
                    }

sg1.sincronizado.w.class = function (cell) {
                        return color_class_status(cell.data());
                    }





function (cell) {
var n = cell.data();
        var b;
            try {
switch(n){
case 'ERROR':
                b = 'levelbg1';
break;
case 'OK':
                b = 'levelbg10';
break;
default:
                b = 'levelbg4';
break;
}


            } catch (error) {
                b = '';
            }
            return b;
                    }







/*
function color_class_sincronizado (n) {
            var b;
            try {
switch(n){
case 'true':
                b = 'levelbg10';
break;
case true:
                b = 'levelbg10';
break;
default:
                b = 'levelbg1';
break;
}


            } catch (error) {
                b = '';
            }
//console.log(b);
            return b;
        }

function color_class_status (n) {
            var b;
            try {
switch(n){
case 'ERROR':
                b = 'levelbg1';
break;
case 'OK':
                b = 'levelbg10';
break;
default:
                b = 'levelbg4';
break;
}


            } catch (error) {
                b = '';
            }
//console.log(b);
            return b;
        }

//console.log(sg1);
var grid_structure_com = [{field: "unique_id", name: "#", width: '35px'},
               sg1.account.r, sg1.account_name.r, sg1.provincia.r, sg1.ip.r, sg1.ts_server159.r, sg1.srv159_principal.r, sg1.srv159_activa.r, sg1.srv159_productos.r, sg1.ts_farmacia.r, sg1.principal.r, sg1.activa.r, sg1.productos.r, sg1.estado.r, sg1.sincronizado.r, sg1.tecnico.r
            ];


            g_eco.Url = "oams_php_query/view_farma_lista_precios.php?seleccion=eco";
            g_eco.set("structure", grid_structure_com);

            g_medi.Url = "oams_php_query/view_farma_lista_precios.php?seleccion=medi";
            g_medi.set("structure", grid_structure_com);

            g_difarmes.Url = "oams_php_query/view_farma_lista_precios.php?seleccion=difarmes";
            g_difarmes.set("structure", grid_structure_com);

            g_paf.Url = "oams_php_query/view_farma_lista_precios.php?seleccion=paf";
            g_paf.set("structure", grid_structure_com);

            g_pnatural.Url = "oams_php_query/view_farma_lista_precios.php?seleccion=pnatural";
            g_pnatural.set("structure", grid_structure_com);
            
            g_promo.Url = "oams_php_query/view_farma_lista_precios.php?seleccion=promo";
            g_promo.set("structure", grid_structure_com);



setTimeout(function(){
            g_eco.load({});
g_medi.load({});
g_difarmes.load({});
g_paf.load({});
g_pnatural.load({});
g_promo.load({});
}, 2000);

*/




         

     });
});
