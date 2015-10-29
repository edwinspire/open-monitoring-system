<?php
require_once "oams_php_script_private/security.php";
CheckPageAccess(0);
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <title>Errores en tarjetas - Farmaenlace</title>
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
                "w_common_titlebar/w_common_titlebar",
"dojo/data/ItemFileReadStore",
"gridx/Grid",
'gridx/modules/Focus', 'gridx/modules/VirtualVScroller', 'gridx/modules/RowHeader', 'gridx/modules/select/Row', 'gridx/modules/extendedSelect/Row', 'gridx/modules/IndirectSelect', 'gridx/modules/Pagination', 'gridx/modules/pagination/PaginationBar', 'gridx/modules/ColumnResizer', 'gridx/modules/Filter','gridx/modules/filter/FilterBar',	'gridx/modules/filter/QuickFilter','gridx/modules/SingleSort',	'gridx/modules/extendedSelect/Row','gridx/modules/IndirectSelectColumn','gridx/modules/VirtualVScroller'
            ]);
        </script>
        <style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "lib/dojo/gridx/resources/claro/Gridx.css";@import "app.css";@import "oams.css";
        </style>  
               <script type="text/javascript" src="farma_tarjetas_errores.js"></script>
    </head>
    <body data-maq-flow-layout="true" data-maq-comptype="desktop" class="claro" data-maq-ws="collapse" data-maq-appstates="{}" id="myapp">

        <div id="id_mh" data-dojo-type="woams_menu_header/woams_menu_header" ></div>
        <div id="idTitulo1" data-dojo-type="w_common_titlebar/w_common_titlebar"></div>

<div class="ContentMasterWithoutHeader">
<span url="/farma/errores_tarjetas.php" data-dojo-type="dojo/data/ItemFileReadStore" id="ItemFileReadStore_4" jsId="ItemFileReadStore_4" data="{&quot;identifier&quot;:&quot;unique_id&quot;,&quot;items&quot;:[{&quot;unique_id&quot;:[1],&quot;nombre&quot;:[&quot;1&quot;],&quot;oficina&quot;:[&quot;Label 1&quot;],&quot;nombre_oficina&quot;:[&quot; &quot;],&quot;cc&quot;:[&quot; &quot;],&quot;nombre_cc&quot;:[&quot; &quot;],&quot;código&quot;:[&quot; &quot;],&quot;técnico&quot;:[&quot;&quot;]}]}"></span>
<table data-dojo-type="gridx/Grid" id="idGridClavesImpresorasMatriz" style="min-width: 1em; min-height: 1em; width: 100%; height: 100%;" data-dojo-props="cacheClass: 'gridx/core/model/cache/Async',structure:[{width:'auto',name:'COD. ERROR',field:'error_cod'},{width:'auto',name:'MENSAJE DE ERROR',field:'error_msg'},{width:'auto',name:'DESCRIPCION DEL ERROR',field:'error_descrip'},{width:'auto',name:'POSIBLE SOLUCION',field:'error_solucion'}],store:ItemFileReadStore_4, modules: ['gridx/modules/Focus', 'gridx/modules/VirtualVScroller', 'gridx/modules/RowHeader', 'gridx/modules/select/Row', 'gridx/modules/extendedSelect/Row', 'gridx/modules/IndirectSelect', 'gridx/modules/Pagination', 'gridx/modules/pagination/PaginationBar', 'gridx/modules/ColumnResizer', 'gridx/modules/Filter','gridx/modules/filter/FilterBar',	'gridx/modules/filter/QuickFilter','gridx/modules/SingleSort',	'gridx/modules/extendedSelect/Row','gridx/modules/IndirectSelectColumn','gridx/modules/VirtualVScroller']"></table>
    </div>



    </body>
</html>
