<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>Untitled</title>
   <?php include("header_dojo.php"); ?>
<script type="text/javascript">
require([
  "dijit/dijit",
  "dojo/parser",
  "woams_menu_header/woams_menu_header",
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
"dijit/form/RadioButton", "dijit/form/FilteringSelect"
]);
</script>
<style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "lib/dojo/gridx/resources/claro/Gridx.css";@import "lib/dojo/gridx/resources/claro/Gridx_rtl.css";@import "app.css";
</style>
<script type="text/javascript" src="udc_test.js"></script>
</head>
<body data-maq-flow-layout="true" data-maq-comptype="desktop" class="claro" data-maq-ws="collapse" id="myapp" data-maq-appstates="{}">

 <div id="tupla"></div>

<input type="text" class="udc_new udc_prueba" id="idprobando" name="probando" value="1234566789"></input>

<div data-dojo-type="uDC_gridx/uDC_gridx" data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', new: {form: 'ContenedorForm', class: 'udc_new', appendidfield: ['idprobando']},  url_export:'prueba.csv',  data:'lib/custom/uDC_gridx/uDC_gridx_data.php', table: 'groups', IndirectSelect: true, auto_update_row: true, id_name_field: 'idgroup', fields: {idgroup: false, name: false, note: true}}"  id="tabla_datos" style="min-width: 1em; min-height: 1em; width: 100%; height: 300px;" >
</div>

 <div id="ContenedorForm" style="display: none; width: 180px;">
   <span><label>
   Label</label>
<input type="text" data-dojo-type="dijit/form/TextBox" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" class="udc_new" name="name"></input>
</span><span><label>
   Label</label>
<input type="text" data-dojo-type="dijit/form/TextBox" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" class="udc_new" name="description"></input>
</span><span><label>
   Label</label>
<input type="text" data-dojo-type="dijit/form/TextBox" id="xxx123" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" class="udc_new" name="note"></input>
</span>

<select data-dojo-type="dijit/form/FilteringSelect" name="fruit" class="udc_new">
    <option value="AP">Apples</option>
    <option value="OR" selected>Oranges</option>
    <option value="PE" >Pears</option>
</select>

<input type="text" class="udc_new" name="notehtml" value="fafafa"></input>

 </div>


</body>
</html>

