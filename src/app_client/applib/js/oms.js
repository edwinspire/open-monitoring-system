require(["dojo/ready", 
	"dojo/cookie",
  "dojo/window",
  "dojo/dom-style",
  "Widget/EventServerIO/EventServerIO",
  "Widget/UserNotifications/UserNotifications",
  "dojo/on",
  "dojo/aspect",
  "dojo/dom-construct", 
  "Widget/app_monitor_general/app_monitor_general", 
  "Widget/app_lista_precios_promo_eco/app_lista_precios_promo_eco", 
  "Widget/app_lista_precios_promo_medi/app_lista_precios_promo_medi", 
  "Widget/app_lista_precios_pnatural/app_lista_precios_pnatural", 
  "Widget/app_lista_precios_eco/app_lista_precios_eco", 
  "Widget/app_lista_precios_medi/app_lista_precios_medi", 
  "Widget/app_monitor_network_devices/app_monitor_network_devices", 
  "Widget/Geolocations/Geolocations", 
  "Widget/app_account/app_account",
  "Widget/app_tables_views_config/app_tables_views_config",
  "Widget/app_event_management/app_event_management"
  ], function(ready, 
    cookie,
    win,
    domStyle,
    EventServerIO,
    UserNotifications, 
    on,
    aspect,
    domConstruct, 
    app_monitor_general, 
    app_lista_precios_promo_eco, 
    app_lista_precios_promo_medi, 
    app_lista_precios_pnatural, 
    app_lista_precios_eco, 
    app_lista_precios_medi, 
    app_monitor_network_devices, 
    app_geolocations, 
    app_account,
    app_tables_views_config,
    app_event_management
    ){
    ready(function(){


     // var vs = win.getBox();

      var PageContent = dijit.byId('PageContent');
      var Mainmenu = dijit.byId("MainMenu");

// console.debug(vs.h);
//  domStyle.set(PageContent.domNode, "height", (vs.h-40)+'px');

// console.debug(vs);
// domStyle.set(this.BorderContainer.domNode, "height", (vs.h-30-16)+'px');
// this.BorderContainer.resize();






Mainmenu.on("clickitem", function(e){
  console.debug(e);
  switch(e){
   case 'monitoreo_general':
   OpenApp(app_monitor_general);
   break;
   case 'monitoreo_equipos_red':
   OpenApp(app_monitor_network_devices);
   break;
   case 'GeneralEmpresaAbonados':
   OpenApp(app_account);
   break;
   case 'MenuUtilListaPrecioMedi':
   OpenApp(app_lista_precios_medi);
   break;					
   case 'MenuUtilListaPrecioEco':
   OpenApp(app_lista_precios_eco);
   break;					
   case 'MenuAdminViewTables':
   OpenApp(app_tables_views_config);
   break;					
   case 'MenuUtilListaPrecioMediPromo':
   OpenApp(app_lista_precios_promo_medi);
   break;					
   case 'MenuUtilListaPrecioEcoPromo':
   OpenApp(app_lista_precios_promo_eco);
   break;	
   case 'MenuUtilListaPrecioPN':
   OpenApp(app_lista_precios_pnatural);
   break;        
   case 'MenuEventsAll':
   OpenApp(app_event_management);
   break;  
   case 'GeneralEmpresaGeolocalizacion':
   OpenApp(app_geolocations);
   break;    				
 }
}); 

on(dojo.byId("ToogleMenu"), "click", function(e){
  Mainmenu.toggle();
});





var ESIO = new EventServerIO();
var NOTIF = new UserNotifications();

function OpenApp(appClass){
ResizeContainer();
 PageContent.destroyDescendants();
 var app = new appClass().placeAt(PageContent);
  domStyle.set(app.domNode, "height", '100%');
       Mainmenu.isVisible(false);
     }

function ResizeContainer(){
  var vs = win.getBox();
  console.debug(vs);
  domStyle.set(PageContent.domNode, "height", (vs.h-30-16)+'px');
  PageContent.resize();
}

on(window, 'resize', function(){
  ResizeContainer();        
});


aspect.after(window, "resize", function(e) {
  ResizeContainer();        
      });

     ResizeContainer();


   });
  });
