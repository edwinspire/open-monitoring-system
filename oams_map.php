<?php
require_once "oams_php_script_private/misc.php";
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
<script>
<?php 
require_once "oams_php_script_private/oams_db.php";

    $db = new oamsDB();
    $db->connect();

$result = "[{}]";

    if ($db->access_control(0)) {

switch($_GET["maptype"]){
case 0:
// Muestra todos los abonados del sistema
$result =  oamsDB::result_to_json("accounts", pg_query_params($db->connection, "SELECT account, last_name, first_name, geox, geoy, address, address_ref FROM accounts WHERE enabled = true AND geox != 0 AND geoy != 0;", array()));
break;
case 1:
// Muestra solo el abonado seleccionado
if(isset($_GET["idcontact"]) && $_GET["idcontact"] > 0){
$result =  oamsDB::result_to_json("accounts", pg_query_params($db->connection, "SELECT account, last_name, first_name, geox, geoy, address, address_ref FROM accounts WHERE idcontact = $1::bigint AND geox != 0 AND geoy != 0;", array($_GET["idcontact"])));
}
break;
case 2:
// Muestra los abonados asignados al contacto pasado como parametro
if(isset($_GET["idcontact"]) && $_GET["idcontact"] > 0){
$result =  oamsDB::result_to_json("accounts", pg_query_params($db->connection, "SELECT account, last_name, first_name, geox, geoy, address, address_ref FROM accounts WHERE idcontact IN (SELECT idaccount FROM view_account_contacts WHERE idcontact = $1::bigint AND appointment = 'oams_assigned') AND geox != 0 AND geoy != 0;", array($_GET["idcontact"])));
}
break;
}

    } else {
        header('HTTP/1.1 401 Unauthorized', true, 401);
    }

echo "var geodata = ".$result."\n\r";
?>
</script>
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
        <div id="map" style="background-color: #b5d0d0; width: 100%;  height: 100%; overflow: hidden;">
            <span>
                <div data-dojo-type="dijit/form/VerticalSlider" id="id_zoom" intermediateChanges="false" discreteValues="Infinity" style="width: auto; height: 200px; position: absolute; z-index: 900; right: 0px; top: 0px; background-color: white; opacity: 7.85;" title="Zoom">
                    <div data-dojo-type="dijit/form/VerticalRule" container="rightDecoration" style="width: 5px;"></div>
                    <ol data-dojo-type="dijit/form/VerticalRuleLabels" container="rightDecoration" labels="0%,50%,100%" style="width: 3em;"></ol>
                </div>
<a target="_blank" id="link_openstreetmaps" href="http://www.openstreetmap.org" style="width: auto; padding: 0.5em; position: absolute; z-index: 901; right: 0px; bottom: 0px; background-color: white; opacity: 0.75;">Ver OpenStreetMap</a>
            </span></div>
    </body>
</html>


