<?php
require_once "oams_php_script_private/security.php";
CheckPageAccess(0);
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>Administrador de eventos - OAMS</title>
   <?php include("header_dojo.php"); ?>
<script type="text/javascript">
require([
  "dijit/dijit",
  "dojo/parser",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "woams_menu_header/woams_menu_header",
  "dijit/MenuBar",
  "dijit/Menu",
  "dijit/MenuItem",
  "dijit/PopupMenuBarItem",
  "w_common_titlebar/w_common_titlebar",
  "dijit/Toolbar",
  "dijit/form/Button",
  "w_common_tooltipdialogconfirmation/w_common_tooltipdialogconfirmation",
  "w_common_basic_menubar/w_common_basic_menubar",
  "dijit/form/NumberSpinner",
  "dijit/form/DateTextBox",
  "dijit/form/TextBox",
  "dijit/form/SimpleTextarea",
  "woams_account_form/woams_account_form",
  "w_common_tooltipdialogconfirmation/w_common_tooltipdialogconfirmation",
  "w_common_basic_menubar/w_common_basic_menubar",
  "dijit/layout/TabContainer",
  "woams_groups_gridx/woams_groups_gridx",
  "woams_equipments_gridx/woams_equipments_gridx",
  "woams_phones_gridx/woams_phones_gridx",
"woams_events_comments/woams_events_comments"
]);
</script>
<style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "lib/dojo/gridx/resources/claro/Gridx.css";@import "oams_accounts.css";@import "oams.css";
</style>
<script type="text/javascript" src="oams_event_admin.js"></script>
</head>
<body data-maq-flow-layout="true" data-maq-comptype="desktop" class="claro" data-maq-ws="collapse" data-maq-appstates="{}" id="myapp">
 <div style="width: 100%; height: 100%;">
  <div id="id_mh" data-dojo-type="woams_menu_header/woams_menu_header"></div>
  <div id="idTitulo1" data-dojo-type="w_common_titlebar/w_common_titlebar"></div>
<div class="ContentMasterWithoutHeader">
	  <div id="id_gridx_event_monitor" data-dojo-type="woams_events_comments/woams_events_comments"></div>
    </div>
</div>
</body>
</html>
