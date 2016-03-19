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
<title>Divisiones - Open AMS</title>
   <?php include("header_dojo.php"); ?>
<script type="text/javascript">
require([
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
"notification_area/notification_area"
]);
</script>
<style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "lib/dojo/gridx/resources/claro/Gridx.css";@import "accounts.css";@import "styles.css";
</style>
<script type="text/javascript" src="divisions.js"></script>
</head>
<body data-maq-flow-layout="true" data-maq-comptype="desktop" class="claro" data-maq-ws="collapse" data-maq-appstates="{}" id="myapp">
 <div style="width: 100%; height: 100%;">
  <div id="id_mh" data-dojo-type="woams_menu_master/woams_menu_master"></div>
  <div id="idTitulo1" data-dojo-type="titlebar/titlebar"></div>
<div class="ContentMasterWithoutHeader">
	   <div id="id_gridx_divisions" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', new: {node_form: 'FieldsNewDivision', class: '.udc_new_division', append_byArrayIds: ['idprobando']},  url_export:'',  url_data:'lib/custom/uDC_gridx/gridx/divisions.php', table: 'divisions', IndirectSelect: true, auto_update_row: true, referential_field: 'iddivision', fields: {enabled: true, name: true, description: true, notes: true}}"></div>

<div id="FieldsNewDivision" style="display: none; width: 250px;">

<fieldset>
    <legend><?php 
echo pguDC::column_label("divisions", "enabled");
?> </legend>
 <input type="checkbox" data-dojo-type="dijit/form/CheckBox" intermediateChanges="false" iconClass="dijitNoIcon" class="udc_new_division" name="enabled"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("divisions", "name");
?> </legend>
<input type="text" data-dojo-type="dijit/form/TextBox" name="name" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" class="udc_new_division"></input>
</fieldset>


<fieldset>
    <legend><?php 
echo pguDC::column_label("divisions", "name");
?> </legend>
<textarea type="text" data-dojo-type="dijit/form/Textarea" intermediateChanges="false" rows="3" trim="false" uppercase="false" lowercase="false" propercase="false" style="width: 200px; height: auto;" class="udc_new_division" name="description"></textarea>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("divisions", "name");
?> </legend>
<textarea type="text" data-dojo-type="dijit/form/Textarea" intermediateChanges="false" rows="3" trim="false" uppercase="false" lowercase="false" propercase="false" style="width: 200px; height: auto;" class="udc_new_division" name="notes"></textarea>
</fieldset>

    </div>


</div>

  <div id="narea" data-dojo-type="notification_area/notification_area"></div>
</body>
</html>
