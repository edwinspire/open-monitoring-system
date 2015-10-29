<?php
require_once "oams_php_script_private/security.php";
CheckPageAccess(0);
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <title>Ubicación Geográfica Abonados - oAMS</title>
        <script type="text/javascript" src="http://openlayers.org/api/OpenLayers.js"></script>
        <?php include("header_dojo.php"); ?>
        <script type="text/javascript">
            require([
                "dijit/dijit",
                "dojo/parser",
                "dojox/geo/openlayers/widget/Map",
                "w_common_mappoint/w_common_mappoint",
                "dijit/form/VerticalSlider",
                "dijit/form/VerticalRule",
                "dijit/form/VerticalRuleLabels",
                "woams_menu_header/woams_menu_header",
                "dijit/MenuBar",
                "dijit/Menu",
                "dijit/MenuItem",
                "dijit/PopupMenuBarItem",
                "dijit/Toolbar",
                "dijit/form/Button",
                "w_common_tooltipdialogconfirmation/w_common_tooltipdialogconfirmation"
            ]);
        </script>
        <style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "app.css";@import "oams.css";
        </style>
        <script type="text/javascript" src="oams_map.js"></script>
    </head>
    <body data-maq-flow-layout="true" data-maq-comptype="desktop" class="claro" data-maq-ws="collapse" id="myapp" data-maq-appstates="{}">

<?php 
if(isset($_GET["with_menu"])){
if($_GET["with_menu"] == "true"){
echo "<div style=\"position: absolute; width: 95%; top: 0; z-index: 999;\"><div data-dojo-type=\"woams_menu_header/woams_menu_header\" id=\"idMenuHeader\"></div></div>\n\r";
}
}
?>
        <div id="map" data-oams-with_contacts_users="<?php echo $_GET["with_contacts_users"]; ?>" data-oams-idaccount="<?php echo $_GET["idaccount"]; ?>" style="background-color: #b5d0d0; width: 100%;  height: 100%; overflow: hidden;">
            <span>
                <div data-dojo-type="dijit/form/VerticalSlider" id="id_zoom" intermediateChanges="false" discreteValues="Infinity" style="width: auto; height: 200px; position: absolute; z-index: 900; right: 0px; top: 0px; background-color: white; opacity: 0.85;" title="Zoom">
                    <div data-dojo-type="dijit/form/VerticalRule" container="rightDecoration" style="width: 5px;"></div>
                    <ol data-dojo-type="dijit/form/VerticalRuleLabels" container="rightDecoration" labels="0%,50%,100%" style="width: 3em;"></ol>
                </div>
            </span></div>
    </body>
</html>


