<div> 
    <div style="background-color: #f1f1f1; background-image: -webkit-gradient(linear, left top, right top, to(#f8f8f8), color-stop(40%, #f1f1f1)); background-image: -o-linear-gradient(to right,#f1f1f1 40%, #f8f8f8); background-image: -ms-linear-gradient(to right,#f1f1f1 40%, #f8f8f8); background-image: -moz-linear-gradient(to right,#f1f1f1 40%, #f8f8f8); background-image: -webkit-linear-gradient(to right,#f1f1f1 40%, #f8f8f8); background-image: linear-gradient(to right,#f1f1f1 40%, #f8f8f8);">
        <img src="images/logo.png" alt="Open Alarm Management System" style="margin: 3px; display: inline-block; height: 25px; width: auto;"></img>
<span style="float: right; padding: 8px; text-shadow: 1px 1px 2px rgba(150, 150, 150, 1); font-weight: bold; position: relative; top: 2px; bottom: 2px; display: inline-block; left: 2px;  color: #131339;" data-dojo-attach-point="username" >Anonymous</span>
        <span style="margin: 3px; display: inline-block; vertical-align: top;"><span data-dojo-type="dijit/MenuBar" tabIndex="0">
                <span data-dojo-type="dijit/PopupMenuBarItem" label="Sistema" iconClass="dijitNoIcon">
                    <span data-dojo-type="dijit/Menu" style="display: none;">
                        <span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmlogin" label="Entrar" iconClass="dijitNoIcon"></span>
                        <span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmlogout" label="Salir" iconClass="dijitNoIcon"></span>
</span>
                </span>
                <span data-dojo-type="dijit/PopupMenuBarItem" label="Farmacias" iconClass="dijitNoIcon"><span data-dojo-type="dijit/Menu" style="display: none;"><span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmaccountedit" label="Detalle" iconClass="dijitNoIcon"></span><span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmaccountmap" label="Distribución Geográfica" iconClass="dijitNoIcon" disabled="false"></span></span>
                </span>


                <span data-dojo-type="dijit/PopupMenuBarItem" disabled="true" label="<?php 
//require_once "../../../oams_php_script_private/misc.php";
require_once "../uDC/pguDC.php";
//echo get_table_column_label("divisions", "name");
echo pguDC::column_label("divisions", "name");
?>" iconClass="dijitNoIcon">

<span data-dojo-type="dijit/Menu">
                    
<?php

require_once "../uDC/pguDC.php";
    $db = new pguDC();
    $db->connect();

$resultdivisions = pg_query($db->connection, "SELECT iddivision, name FROM divisions WHERE length(name) > 0 AND iddivision > 0 ORDER BY name;");
$arrdivisions = pg_fetch_all($resultdivisions);

foreach ($arrdivisions as $row) 
{ 

echo '<div data-dojo-type="dijit/PopupMenuItem">'."\n";
echo "   <span>".$row["name"]."</span>\n";
echo '<div data-dojo-type="dijit/Menu" >'."\n";

$resultgroups = pg_query_params($db->connection, "SELECT idgroup, name FROM groups WHERE length(name) > 0 AND idgroup > 0 AND iddivision = $1::BIGINT ORDER BY name;", array($row["iddivision"]));
$param = md5("idgroup");
echo '<div data-dojo-type="dijit/MenuItem" data-dojo-props="onClick:function(){window.open(\'oams_accounts.php?'.$param.'=-1\', \'_self\')}">Todos</div>'."\n";

while($rowg = pg_fetch_array($resultgroups)) {
echo '<div data-dojo-type="dijit/MenuItem" data-dojo-props="onClick:function(){window.open(\'oams_accounts.php?'.$param.'='.$rowg["idgroup"].'\', \'_self\')}">'.$rowg["name"].'</div>'."\n";
}

echo "   </div>
    </div>\n";



/*
echo  '<div data-dojo-type="dijit/PopupMenuItem">
        <span>Enabled Submenu</span>
        <div data-dojo-type="dijit/Menu" >
            <div data-dojo-type="dijit/MenuItem" data-dojo-props="onClick:function(){alert()}">Submenu Item One</div>
            <div data-dojo-type="dijit/MenuItem" data-dojo-props="onClick:function(){alert()}">Submenu Item Two</div>
        </div>
    </div>';
*/

} 

?>
         </span>     
                </span>




                <span data-dojo-type="dijit/PopupMenuBarItem" label="Eventos" iconClass="dijitNoIcon">
                    <span data-dojo-type="dijit/Menu">
                        <span data-dojo-type="dijit/MenuItem" label="Administrador"  data-dojo-attach-point="idmeventmanager"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Monitor" disabled="true" data-dojo-attach-point="idmmonitor"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Reporte General" disabled="true" data-dojo-attach-point="idmeventreportgeneral"></span>
                    </span>
                </span>

                <span data-dojo-type="dijit/PopupMenuBarItem" label="Reportes" iconClass="dijitNoIcon">
                    <span data-dojo-type="dijit/Menu">
                        <span data-dojo-type="dijit/MenuItem" label="Administradores"  disabled="true" data-dojo-attach-point="idmrepadmin"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Eventos" disabled="true" data-dojo-attach-point="idmrepevents"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Equipos" disabled="true" data-dojo-attach-point="idmrequipments"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Equipos de red" disabled="true" data-dojo-attach-point="idmrequipmentsnetwork"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Farmacias - Técnicos" disabled="true" data-dojo-attach-point="idmfarmatecnicostarmacias"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Lista de Precios" data-dojo-attach-point="idmfarmalistaprecios"></span>
                    </span>
                </span>

                <span data-dojo-type="dijit/PopupMenuBarItem" label="Configuraci&amp;oacute;n" iconClass="dijitNoIcon">
                    <span data-dojo-type="dijit/Menu" style="display: none;">
                        <span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmadm" label="Administradores" iconClass="dijitNoIcon"></span>
                        <span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmcontacts" label="Directorio Contactos" iconClass="dijitNoIcon" disabled="true"></span>
                        <span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmgroups" label="Grupos" iconClass="dijitNoIcon" disabled="true"></span>
                        <span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmformatnotify" label="Formato notificaciones" iconClass="dijitNoIcon" disabled="true"></span>
                        <span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmpanelmodel" label="Modelos de panel" iconClass="dijitNoIcon" disabled="true" disabled="true"></span>
                        <span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmeventtypes" label="Tipos de eventos" iconClass="dijitNoIcon" disabled="true"></span>
                    </span>
                </span>



                <span data-dojo-type="dijit/PopupMenuBarItem" label="Ayuda" iconClass="dijitNoIcon">
<span data-dojo-type="dijit/Menu">
<span data-dojo-type="dijit/MenuItem" label="Acerca de oAMS"  data-dojo-attach-point="idmaboutusaga" disabled="true"></span>
<span data-dojo-type="dijit/MenuItem" label="Errores en tarjetas"  data-dojo-attach-point="idmtarjetaserrores"></span>
<span data-dojo-type="dijit/MenuItem" label="Recargar página sin cache"  data-dojo-attach-point="idmreload"></span>
                    </span>
                </span>

</span>
        </span>
    </div>
</div>
