require(["dojo/ready", 
  "dojo/cookie",
  "Widget/EventServerIO/EventServerIO",
  "Widget/UserNotifications/UserNotifications",
  "dojo/on",
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
  "app_login_report/app_login_report",
  
  ], function(ready, 
    cookie,
    EventServerIO,
    UserNotifications, 
    on,
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



var PageContent = dijit.byId('PageContent');
    var Mainmenu = dojo.byId("MainMenu");
    on(Mainmenu, "clickitem", function(e){
      console.debug(e);
      switch(e.detail.name){
        case 'monitoreo_general':
        OpenApp(app_monitor_general);
        break;
                case 'GeneralEmpresaAbonados':
        OpenApp(app_account);
        break;
      }
    }); 


    on(dojo.byId("ToogleMenu"), "click", function(e){
      Mainmenu.visible = !Mainmenu.visible; 
    });





var ESIO = new EventServerIO();
var NOTIF = new UserNotifications();

/*


FullName.innerHTML = cookie('oms_fullname');
//on(node, mouse.enter, hoverHandler);


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


function OpenApp(appClass){

PageContent.destroyDescendants();
new appClass().placeAt(PageContent);
Mainmenu.visible = false;
  // if(widget.app){
  //   widget.app.destroy();
  // }

  // domConstruct.empty(PageContent);
  // widget.app = _widget;
  // domConstruct.place(_widget.domNode, PageContent, 'only');
}


});
 });
