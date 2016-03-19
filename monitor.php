<?php
require_once "oams_php_script_private/misc.php";
CheckPageAccess(0);
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <title>Monitor - oAMS</title>
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
                "woams_events_monitor_gridx/woams_events_monitor_gridx",
                "w_common_titlebar/w_common_titlebar"
            ]);
        </script>
        <style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "lib/dojo/gridx/resources/claro/Gridx.css";@import "styles.css";
        </style>  
        <script type="text/javascript" src="monitor.js"></script>
    </head>
    <body data-maq-flow-layout="true" data-maq-comptype="desktop" class="claro" data-maq-ws="collapse" data-maq-appstates="{}" id="myapp">

        <div id="id_mh" data-dojo-type="woams_menu_header/woams_menu_header" ></div>
        <div id="idTitulo1" data-dojo-type="w_common_titlebar/w_common_titlebar"></div>
        <div class="ContentMasterWithoutHeader"><div id="id_gridx_event_monitor" data-dojo-type="woams_events_monitor_gridx/woams_events_monitor_gridx"></div></div>
    </body>
</html>
