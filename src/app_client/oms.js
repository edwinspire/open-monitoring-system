require(["dojo/ready", 
  "dojo/cookie",
  "dojo/fx",
  "dojo/fx/Toggler",
  "Widget/EventServerIO/EventServerIO",
  "Widget/UserNotifications/UserNotifications",
  "dojo/_base/connect",
  "dojo/_base/window", 
  "dojo/on",
  "dojo/topic",
  "dojo/dom-class",
  "dojo/dom-attr",
  "dojo/query",
  "dojo/mouse",
  "dojo/NodeList-dom",
  "dojo/dom-construct", 
  "Widget/app_monitor_general/app_monitor_general", 
  "Widget/app_lista_precios_promo_eco/app_lista_precios_promo_eco", 
  "Widget/app_lista_precios_promo_medi/app_lista_precios_promo_medi", 
  "Widget/app_lista_precios_pnatural/app_lista_precios_pnatural", 
  "Widget/app_lista_precios_eco/app_lista_precios_eco", 
  "Widget/app_lista_precios_medi/app_lista_precios_medi", 
  "app_monitor_network_devices/app_monitor_network_devices", 
  "Geolocations/Geolocations", 
  "app_accounts_table/app_accounts_table", 
  "app_account/app_account",
  "app_tables_views_config/app_tables_views_config",
  "app_login_report/app_login_report"
  ], function(ready, 
    cookie,
    coreFx,
    Toggler,
    EventServerIO,
    UserNotifications,
    connect, 
    win,
    on,
    topic,
    domClass,
    domAttr,
    query, 
    mouse,
    nodeListDom,
    domConstruct, 
    app_monitor_general, 
    app_lista_precios_promo_eco, 
    app_lista_precios_promo_medi, 
    app_lista_precios_pnatural, 
    app_lista_precios_eco, 
    app_lista_precios_medi, 
    app_monitor_network_devices, 
    app_geolocations, 
    app_accounts_table, 
    app_account,
    app_tables_views_config,
    app_login_report
    ){
   ready(function(){


var Mainmenu = dojo.byId("MainMenu");
on(Mainmenu, "clickitem", function(e){
console.debug(e);
}); 

//var menuVisible = false;

on(dojo.byId("ToogleMenu"), "click", function(e){

Mainmenu.visible = !Mainmenu.visible;

// console.debug(e, this.isshow);

// if(this.isshow){
//       var slideArgs = {
//         node: Mainmenu,
// top: (dojo.marginBox(Mainmenu).t).toString(),
// left: 0,
//         unit: "px"
//       };
//       dojo.fx.slideTo(slideArgs).play();
//   this.isshow = false;

// }else{

//       var slideArgs = {
//         node: Mainmenu,
//         top: (dojo.marginBox(Mainmenu).t).toString(),
//         left: (dojo.marginBox(Mainmenu).l -250).toString(),
//         unit: "px"
//       };
//       dojo.fx.slideTo(slideArgs).play();
// this.isshow = true;
// }
  
});

  



/*
 var ESIO = new EventServerIO();
var NOTIF = new UserNotifications();


    var FullName = dojo.byId('FullName');
//     var SIDEBAR_MENU = dojo.byId('sidebar-menu');
var bcloseitems = dojo.byId('support_empty_button_to_close_the_remaining_items_when_loading_an_app');
var PageContent = dojo.byId("PageContent");
var GeneralEmpresaAbonados = dojo.byId("GeneralEmpresaAbonados");
var MonitorGeneral = dojo.byId("MonitorGeneral");
var BODY = win.body();

var widget  = {};

FullName.innerHTML = cookie('oms_fullname');
//on(node, mouse.enter, hoverHandler);

on(PageContent, mouse.enter, function(){

//console.debug('Estamos dentro');
if (!domClass.contains(BODY, "nav-md")){  
 bcloseitems.click();
}

});


///////////////////////////////////////////////////////////
dojo.connect(GeneralEmpresaAbonados, 'onclick', function(){
  OpenApp(new app_account());
});


///////////////////////////////////////////////////////////
dojo.connect(dojo.byId("admin_tables_views_edit"), 'onclick', function(){
  OpenApp(new app_tables_views_config());
});


///////////////////////////////////////////////////////////
dojo.connect(dojo.byId('Idapp_login_report'), 'onclick', function(){
  OpenApp(new app_login_report());
});



///////////////////////////////////////////////////////////
dojo.connect(dojo.byId("GeneralEmpresaGeolocalizacion"), 'onclick', function(){
  OpenApp(new app_geolocations());
});   


//////////////////////////////////////////////////////
dojo.connect(MonitorGeneral, 'onclick', function(){
  OpenApp(new app_monitor_general());
}); 

//////////////////////////////////////////////////////
dojo.connect(Monitor_NetworkDevices, 'onclick', function(){
  OpenApp(new app_monitor_network_devices());
}); 


///////////////////////////////////////////////////////////
dojo.connect(dojo.byId("utilitarios_lista_precios_farma_promo_eco"), 'onclick', function(){
  OpenApp(new app_lista_precios_promo_eco());
});


///////////////////////////////////////////////////////////
dojo.connect(dojo.byId("utilitarios_lista_precios_farma_promo_medi"), 'onclick', function(){
  OpenApp(new app_lista_precios_promo_medi());
});


///////////////////////////////////////////////////////////
dojo.connect(dojo.byId("utilitarios_lista_precios_pnatural"), 'onclick', function(){
  OpenApp(new app_lista_precios_pnatural());
});


///////////////////////////////////////////////////////////
dojo.connect(dojo.byId("utilitarios_lista_precios_farma_eco"), 'onclick', function(){
  OpenApp(new app_lista_precios_eco());
});


///////////////////////////////////////////////////////////
dojo.connect(dojo.byId("utilitarios_lista_precios_farma_medi"), 'onclick', function(){
  OpenApp(new app_lista_precios_medi());
});

*/


function OpenApp(_widget){

  if(widget.app){
    widget.app.destroy();
  }

domConstruct.empty(PageContent);
widget.app = _widget;
domConstruct.place(_widget.domNode, PageContent, 'only');
}


});
 });
