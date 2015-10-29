<?php
require_once "oams_php_script_private/security.php";
CheckPageAccess(0);
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <title>Equipos - oAMS</title>
        <?php include("header_dojo.php"); ?>
        <script type="text/javascript">
            require([
                "dijit/dijit",
                "dojo/parser",
                'w_common_notification_area/w_common_notification_area',
                'dijit/MenuBar',
                'dijit/Menu',
                'dijit/MenuItem',
                'dijit/PopupMenuBarItem',
                "woams_menu_header/woams_menu_header",
                "woams_equipments/woams_equipments",
                "w_common_titlebar/w_common_titlebar",
"dijit/form/Button",
"dijit/Toolbar",
"dijit/layout/TabContainer",
"dijit/layout/ContentPane"
            ]);
        </script>
        <style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "lib/dojo/gridx/resources/claro/Gridx.css";@import "app.css";@import "oams.css";
        </style>  
        <script type="text/javascript" src="oams_report_equipments.js"></script>
    </head>
    <body data-maq-flow-layout="true" data-maq-comptype="desktop" class="claro" data-maq-ws="collapse" data-maq-appstates="{}" id="myapp">

        <div id="id_mh" data-dojo-type="woams_menu_header/woams_menu_header" ></div>
        <div id="idTitulo1" data-dojo-type="w_common_titlebar/w_common_titlebar"></div>
        <div class="ContentMasterWithoutHeaderTitleMenu"><div id="wequipments" data-dojo-type="woams_equipments/woams_equipments"></div></div>
    </body>
</html>
