<?php
require_once "oams_php_script_private/misc.php";
CheckPageAccess(0);
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <title>Administradores - OAMS</title>
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
"woams_contacts_list/woams_contacts_list",
"woams_admin_widget/woams_admin_widget"
            ]);
        </script>
        <style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "lib/dojo/gridx/resources/claro/Gridx.css";@import "oams_accounts.css";@import "oams.css";
        </style>
        <script type="text/javascript" src="oams_admins.js"></script>
    </head>
    <body data-maq-flow-layout="true" data-maq-comptype="desktop" class="claro" data-maq-ws="collapse" data-maq-appstates="{}" id="myapp">
        <div style="width: 100%; height: 100%;">
            <div data-dojo-type="woams_menu_master/woams_menu_master" id="idMenuHeader"></div>
            <div data-dojo-type="titlebar/titlebar" id="idTitle"></div>
            <div class="ContentMasterWithoutHeader">
                <div id="BContainer" data-dojo-type="dijit/layout/BorderContainer" design="sidebar" persist="false" gutters="true" style="min-width: 1em; min-height: 100px; z-index: 0; width: 100%; height: 100%;">
                    <div data-dojo-type="dijit/layout/ContentPane" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" region="left" splitter="true" maxSize="Infinity" style="width: 40%; height: 100%;" doLayout="false">
                       
                        <div id="gridx_account_view" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', new: {node_form: 'account_form_new_account', class: '.udc_account_form_new'},  url_export:'',  url_data:'lib/custom/uDC_gridx/gridx/view_admins.php', table: 'contacts', IndirectSelect: true, referential_field: 'idcontact', fields: {enabled: false, account_division: false, account: false, account_name: false, account_type: false}}"></div> 


                    </div>
                    <div data-dojo-type="dijit/layout/ContentPane" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" region="center" splitter="false" maxSize="Infinity" doLayout="false">
                        <div id="id_account_widget" data-dojo-type="woams_admin_widget/woams_admin_widget"></div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
