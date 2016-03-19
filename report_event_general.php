<?php
require_once "oams_php_script_private/misc.php";
CheckPageAccess(0);
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <title>Reporte General Eventos - oAMS</title>
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
                "w_common_titlebar/w_common_titlebar",
"dijit/form/Button",
"dijit/Toolbar",
"dijit/layout/TabContainer",
"dijit/layout/ContentPane"
            ]);
        </script>
        <style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "lib/dojo/gridx/resources/claro/Gridx.css";@import "styles.css";
        </style>  
        <script type="text/javascript" src="report_event_general.js"></script>
    </head>
    <body data-maq-flow-layout="true" data-maq-comptype="desktop" class="claro" data-maq-ws="collapse" data-maq-appstates="{}" id="myapp">

        <div id="id_mh" data-dojo-type="woams_menu_header/woams_menu_header" ></div>
        <div id="idTitulo1" data-dojo-type="w_common_titlebar/w_common_titlebar"></div>
<div id="MasterContainer" class="ContentMasterWithoutHeader">
    <div data-dojo-type="dijit/layout/TabContainer" style="width: 100%; height: 100%;">
        <div data-dojo-type="dijit/layout/ContentPane" title="Eventos" data-dojo-props="selected:true">
            Lorem ipsum and all around...
        </div>
        <div data-dojo-type="dijit/layout/ContentPane" title="Filtros">

    <div data-dojo-type="dijit/layout/TabContainer" style="width: 100%; height: 100%;">
        <div data-dojo-type="dijit/layout/ContentPane" title="Abonados">
            Lorem ipsum and all around...
        </div>
        <div data-dojo-type="dijit/layout/ContentPane" title="Tipos de evento">
            Lorem ipsum and all around - second...
        </div>
        <div data-dojo-type="dijit/layout/ContentPane" title="Otros filtros">
            Lorem ipsum and all around - last...
        </div>
 
</div>
        </div>
    </div>
</div>
    </body>
</html>
