<?php
require_once "lib/custom/uDC/pguDC.php";
    $db = new pguDC();
    $db->connect();
	if(!$db->access_control(0)){
header("Location: login.php");
  die();
}
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>Lista de Precios - Farmacias</title>
   <?php include("header_dojo.php"); ?>
<script type="text/javascript">
require([
    "dijit/dijit",
                "dojo/parser",
                "dijit/layout/BorderContainer",
                "dijit/layout/ContentPane",
                "woams_menu_master/woams_menu_master",
                "dijit/MenuBar",
                "dijit/Menu",
                "dijit/MenuItem",
                "dijit/PopupMenuBarItem",
                "titlebar/titlebar",
                "dijit/Toolbar",
                "dijit/form/Button",
                "dijit/form/NumberSpinner",
                "dijit/form/DateTextBox",
                "dijit/form/TextBox",
                "dijit/form/SimpleTextarea",
"dijit/layout/ContentPane",
"dijit/layout/BorderContainer",
                "dijit/layout/TabContainer",             
"dijit/form/FilteringSelect",
"notification_area/notification_area",
"uDC_gridx/uDC_gridx", 
  "gridx/Grid",
  "gridx/core/model/cache/Async",
"dijit/dijit",
  "dojo/parser",
  "woams_menu_master/woams_menu_master",
  "dijit/MenuBar",
  "dijit/Menu",
  "dijit/MenuItem",
  "dijit/PopupMenuBarItem",
  "dojox/io/xhrScriptPlugin",
  "dojo/data/ItemFileReadStore",
  "gridx/Grid",
  "gridx/core/model/cache/Async",
  "dojox/data/CsvStore",
  "dijit/form/TextBox",
"uDC/uDC", 
"uDC_gridx/uDC_gridx", "dijit/ToolbarSeparator", "dijit/form/ToggleButton", "dijit/ConfirmTooltipDialog", "dijit/form/TextBox",
"dijit/form/DropDownButton",
"dojo/dom-class",
"dijit/form/RadioButton", "dijit/form/FilteringSelect",
"notification_area/notification_area",
"woams_contact_widget/woams_contact_widget",
"woams_divisions_list/woams_divisions_list",
"dijit/form/ValidationTextBox",
"dijit/form/DateTextBox",
"woams_identificationtypes_list/woams_identificationtypes_list",
"dijit/form/TextBox",
"dijit/form/Select",
"dijit/form/Textarea",
"woams_account_states_list/woams_account_states_list",
"woams_account_types_list/woams_account_types_list",
"woams_contacts_list/woams_contacts_list"
]);
</script>
<style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "lib/dojo/gridx/resources/claro/Gridx.css";@import "oams_accounts.css";@import "styles.css";
</style>
<script type="text/javascript" src="farma_lista_precios.js"></script>
</head>
<body data-maq-flow-layout="true" data-maq-comptype="desktop" class="claro" data-maq-ws="collapse" data-maq-appstates="{}" id="myapp">
 <div style="width: 100%; height: 100%;">
  <div id="id_mh" data-dojo-type="woams_menu_master/woams_menu_master"></div>
<div class="ContentMasterWithoutHeader">
<span data-dojo-type="dijit/layout/TabContainer" style="min-width: 1em; min-height: 1em;" class="WidgetFullSize" controllerWidget="dijit.layout.TabController">
<div data-dojo-type="dijit/layout/ContentPane" title="Dia Eco / Medi" selected="true">
	   
                        <div id="id_gridx_promocion" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', auto_select_on_change: true, refresh_on_changed_table: ['farma_lista_precios_farmacias'], url_export:'lib/custom/uDC_gridx/gridx/view_farma_lista_precios.php',  url_data:'lib/custom/uDC_gridx/gridx/view_farma_lista_precios.php?seleccion=promo', table: 'view_farma_lista_precios', IndirectSelect: true, referential_field: 'idaccount', fields: {account: false, account_name: false, provincia: false, ip: false, ts_server159: false, srv159_principal: false, srv159_activa: false, srv159_productos: false, ts_farmacia: false, principal: false, activa: false, productos: false, estado: false, sincronizado: false, tecnico: false}}"></div> 	  
	  
	  
</div>

<div data-dojo-type="dijit/layout/ContentPane" title="Economicas" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" closable="false" doLayout="false">

	                          <div id="id_gridx_eco" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', url_export:'lib/custom/uDC_gridx/gridx/view_farma_lista_precios.php',  url_data:'lib/custom/uDC_gridx/gridx/view_farma_lista_precios.php?seleccion=eco', table: 'view_farma_lista_precios', IndirectSelect: true, referential_field: 'idaccount', fields: {account: false, account_name: false, provincia: false, ip: false, ts_server159: false, srv159_principal: false, srv159_activa: false, srv159_productos: false, ts_farmacia: false, principal: false, activa: false, productos: false, estado: false, sincronizado: false, tecnico: false}}"></div> 	  

</div>
<div data-dojo-type="dijit/layout/ContentPane" title="Difarmes" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" selected="true" closable="false" doLayout="false">
	  
	                          <div id="id_gridx_difarmes" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', url_export:'lib/custom/uDC_gridx/gridx/view_farma_lista_precios.php',  url_data:'lib/custom/uDC_gridx/gridx/view_farma_lista_precios.php?seleccion=difarmes', table: 'view_farma_lista_precios', IndirectSelect: true, referential_field: 'idaccount', fields: {account: false, account_name: false, provincia: false, ip: false, ts_server159: false, srv159_principal: false, srv159_activa: false, srv159_productos: false, ts_farmacia: false, principal: false, activa: false, productos: false, estado: false, sincronizado: false, tecnico: false}}"></div> 	  
	  
</div>
<div data-dojo-type="dijit/layout/ContentPane" title="Medicity">
	  
	                          <div id="id_gridx_medi" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', url_export:'lib/custom/uDC_gridx/gridx/view_farma_lista_precios.php',  url_data:'lib/custom/uDC_gridx/gridx/view_farma_lista_precios.php?seleccion=medi', table: 'view_farma_lista_precios', IndirectSelect: true, referential_field: 'idaccount', fields: {account: false, account_name: false, provincia: false, ip: false, ts_server159: false, srv159_principal: false, srv159_activa: false, srv159_productos: false, ts_farmacia: false, principal: false, activa: false, productos: false, estado: false, sincronizado: false, tecnico: false}}"></div> 	  
	  
	  
</div>
<div data-dojo-type="dijit/layout/ContentPane" title="PAF">
	                          <div id="id_gridx_paf" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', url_export:'lib/custom/uDC_gridx/gridx/view_farma_lista_precios.php',  url_data:'lib/custom/uDC_gridx/gridx/view_farma_lista_precios.php?seleccion=paf', table: 'view_farma_lista_precios', IndirectSelect: true, referential_field: 'idaccount', fields: {account: false, account_name: false, provincia: false, ip: false, ts_server159: false, srv159_principal: false, srv159_activa: false, srv159_productos: false, ts_farmacia: false, principal: false, activa: false, productos: false, estado: false, sincronizado: false, tecnico: false}}"></div> 		  
	  
	  
	  
</div>
<div data-dojo-type="dijit/layout/ContentPane" title="Punto Natural">
	  	                          <div id="id_gridx_pnatural" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php',  auto_update_row: true, auto_select_on_change: true,  url_export:'lib/custom/uDC_gridx/gridx/view_farma_lista_precios.php',  url_data:'lib/custom/uDC_gridx/gridx/view_farma_lista_precios.php?seleccion=pnatural', table: 'view_farma_lista_precios', IndirectSelect: true, referential_field: 'idaccount', fields: {account: false, account_name: false, provincia: false, ip: false, ts_server159: false, srv159_principal: false, srv159_activa: false, srv159_productos: false, ts_farmacia: false, principal: false, activa: false, productos: false, estado: false, sincronizado: false, tecnico: false}}"></div> 		  

</div>
</span>

    </div>
</div>

  <div id="narea" data-dojo-type="notification_area/notification_area"></div>
</body>
</html>
