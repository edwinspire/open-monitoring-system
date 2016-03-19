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
<title>Monitor de eventos - OAMS</title>
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
<style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "lib/dojo/gridx/resources/claro/Gridx.css";@import "styles.css";
</style>
<script type="text/javascript" src="index.js"></script>
</head>
<body data-maq-flow-layout="true" data-maq-comptype="desktop" class="claro" data-maq-ws="collapse" data-maq-appstates="{}" id="myapp">
 <div style="width: 100%; height: 100%;">
  <div id="id_mh" data-dojo-type="woams_menu_master/woams_menu_master"></div>
  <div id="idTitulo1" data-dojo-type="titlebar/titlebar"></div>
<div class="ContentMasterWithoutHeader">
	
                        <div id="grid_view_monitor" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', url_export:'',  url_data:'lib/custom/uDC_gridx/gridx/view_events_monitor.php', table: 'view_events_monitor', auto_select_on_change: true,  auto_update_row: true, refresh_on_changed_table: ['events'], IndirectSelect: true, referential_field: 'idevent', fields: {dateevent: false, account: false, account_name: false, code: false, priority: false, label: false, description: false, status_label: false, oams_assigned: false}}"></div> 
    </div>
</div>


  <div id="narea" data-dojo-type="notification_area/notification_area"></div>
</body>
</html>
