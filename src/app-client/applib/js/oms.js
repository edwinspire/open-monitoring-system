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
  "Widget/app_event_management/app_event_management",
  "Widget/app_event_resumen/app_event_resumen"
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
    app_event_management,
    app_event_resumen
    ){
    ready(function(){


     // var vs = win.getBox();
     var apps = [];
     apps['app_monitor_general'] = app_monitor_general;
     apps['app_lista_precios_promo_eco'] = app_lista_precios_promo_eco;
     apps['app_lista_precios_promo_medi'] = app_lista_precios_promo_medi;
     apps['app_lista_precios_pnatural'] = app_lista_precios_pnatural;
     apps['app_lista_precios_eco'] = app_lista_precios_eco;
     apps['app_lista_precios_medi'] = app_lista_precios_medi;
     apps['app_monitor_network_devices'] = app_monitor_network_devices;
     apps['app_account'] = app_account;
     apps['app_tables_views_config'] = app_tables_views_config;
     apps['app_event_management'] = app_event_management;
     apps['app_event_resumen'] = app_event_resumen;




      var PageContent = dijit.byId('PageContent');
      var Mainmenu = dijit.byId("MainMenu");

Mainmenu.on("appname", function(e){
  console.debug(e);
  console.log(apps[e]);

  if(e && apps[e]){
    OpenApp(apps[e]);
  }
  /*
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
      case 'app_event_resumen':
   OpenApp(app_event_resumen);
   break;  
   case 'GeneralEmpresaGeolocalizacion':
   OpenApp(app_geolocations);
   break;           
 }
 */
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