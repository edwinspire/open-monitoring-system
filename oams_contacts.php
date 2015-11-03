<?php
require_once "oams_php_script_private/misc.php";
CheckPageAccess(0);
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <title>Contactos - OAMS</title>
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
                "woams_equipments_gridx/woams_equipments_gridx",
                "woams_phones_gridx/woams_phones_gridx",
                "woams_common_gridx/woams_common_gridx",
                "woams_contact_widget/woams_contact_widget"
            ]);
        </script>
        <style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "lib/dojo/gridx/resources/claro/Gridx.css";@import "oams_accounts.css";@import "oams.css";
        </style>
        <script type="text/javascript" src="oams_contacts.js"></script>
    </head>
    <body data-maq-flow-layout="true" data-maq-comptype="desktop" class="claro" data-maq-ws="collapse" data-maq-appstates="{}" id="myapp">
        <div style="width: 100%; height: 100%;">
            <div data-dojo-type="woams_menu_header/woams_menu_header" id="idMenuHeader"></div>
            <div data-dojo-type="w_common_titlebar/w_common_titlebar"></div>
            <div class="ContentMasterWithoutHeader">
                <div id="BContainer" data-dojo-type="dijit/layout/BorderContainer" design="sidebar" persist="false" gutters="true" style="min-width: 1em; min-height: 100px; z-index: 0; width: 100%; height: 100%;">
                    <div data-dojo-type="dijit/layout/ContentPane" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" region="left" splitter="true" maxSize="Infinity" style="width: 40%; height: 100%;" doLayout="false">
                        <div id="gridx_account_view" data-dojo-type="woams_common_gridx/woams_common_gridx"></div> 
                    </div>
                    <div data-dojo-type="dijit/layout/ContentPane" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" region="center" splitter="false" maxSize="Infinity" doLayout="false">
                        <div id="id_account_widget" data-dojo-type="woams_contact_widget/woams_contact_widget"></div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
