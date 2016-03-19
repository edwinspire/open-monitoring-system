<!DOCTYPE html>
<html >
<head>


   <?php include("header_dojo.php"); ?>	
	<script>
require(["dojo/parser", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator", "dijit/PopupMenuItem", "dijit/ColorPalette"]);
	</script>

<style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "lib/dojo/gridx/resources/claro/Gridx.css";@import "oams_accounts.css";@import "oams.css";
</style>

</head>
<body class="claro">

<div> 
    <div style="background-color: #f1f1f1; background-image: -webkit-gradient(linear, left top, right top, to(#f8f8f8), color-stop(40%, #f1f1f1)); background-image: -o-linear-gradient(to right,#f1f1f1 40%, #f8f8f8); background-image: -ms-linear-gradient(to right,#f1f1f1 40%, #f8f8f8); background-image: -moz-linear-gradient(to right,#f1f1f1 40%, #f8f8f8); background-image: -webkit-linear-gradient(to right,#f1f1f1 40%, #f8f8f8); background-image: linear-gradient(to right,#f1f1f1 40%, #f8f8f8);">
        <img src="images/logo.png" alt="Open Alarm Management System" style="margin: 3px; display: inline-block; height: 25px; width: auto;"></img>
        <span style="margin: 3px; display: inline-block; vertical-align: top;"><span data-dojo-type="dijit/MenuBar" tabIndex="0">
                <span data-dojo-type="dijit/PopupMenuBarItem" label="Sistema" iconClass="dijitNoIcon">
                    <span data-dojo-type="dijit/Menu" style="display: none;">
                        <span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmlogin" label="Entrar" iconClass="dijitNoIcon"></span>
                        <span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmlogout" label="Salir" iconClass="dijitNoIcon"></span>
                        <span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmmonitor" label="Monitor de eventos" iconClass="dijitNoIcon"></span></span>
                </span>
                <span data-dojo-type="dijit/PopupMenuBarItem" label="Farmacias" iconClass="dijitNoIcon"><span data-dojo-type="dijit/Menu" style="display: none;"><span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmaccountedit" label="Detalle" iconClass="dijitNoIcon"></span><span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmaccountmap" label="Distribución Geográfica" iconClass="dijitNoIcon" disabled="false"></span></span>
                </span>

                <span data-dojo-type="dijit/PopupMenuBarItem" label="Eventos" iconClass="dijitNoIcon">
                    <span data-dojo-type="dijit/Menu">
                        <span data-dojo-type="dijit/MenuItem" label="Administrador"  data-dojo-attach-point="idmeventmanager"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Monitor"  data-dojo-attach-point="idmmonitor2"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Reporte General"  data-dojo-attach-point="idmeventreportgeneral"></span>
                    </span>
                </span>

                <span data-dojo-type="dijit/PopupMenuBarItem" label="Reportes" iconClass="dijitNoIcon">
                    <span data-dojo-type="dijit/Menu">
                        <span data-dojo-type="dijit/MenuItem" label="Administradores"  disabled="true" data-dojo-attach-point="idmrepadmin"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Aperturas y Cierres" data-dojo-attach-point="idmacfarmacias"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Eventos" disabled="true" data-dojo-attach-point="idmrepevents"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Equipos" data-dojo-attach-point="idmrequipments"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Equipos de red" disabled="true" data-dojo-attach-point="idmrequipmentsnetwork"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Farmacias - Técnicos" data-dojo-attach-point="idmfarmatecnicostarmacias"></span>
                        <span data-dojo-type="dijit/MenuItem" label="Lista de Precios" data-dojo-attach-point="idmfarmalistaprecios"></span>
                    </span>
                </span>

                <span data-dojo-type="dijit/PopupMenuBarItem" label="Configuraci&amp;oacute;n" iconClass="dijitNoIcon">
                    <span data-dojo-type="dijit/Menu" style="display: none;">
                        <span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmadm" label="Administradores" iconClass="dijitNoIcon"></span>
                        <span data-dojo-type="dijit/MenuItem" data-dojo-attach-point="idmcontacts" label="Directorio Contactos" iconClass="dijitNoIcon"></span>
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
<span data-dojo-type="dijit/MenuItem" label="Recargar sin cache"  data-dojo-attach-point="idmreload"></span>

  <div data-dojo-type="dijit/PopupMenuItem">
        <span>Enabled Submenu</span>
        <div data-dojo-type="dijit/Menu" >
            <div data-dojo-type="dijit/MenuItem" data-dojo-props="onClick:function(){alert('Submenu 1!')}">Submenu Item One</div>
            <div data-dojo-type="dijit/MenuItem" data-dojo-props="onClick:function(){alert('Submenu 2!')}">Submenu Item Two</div>
        </div>
    </div>

                    </span>
                </span>

</span>
        </span>
    </div>
    <div data-dojo-type="w_common_notification_area/w_common_notification_area" style="z-index: 999;" data-dojo-attach-point="notification"></div>
</div>



    <div data-dojo-type="dijit/Menu" data-dojo-props="contextMenuForWindow:true" style="display: none;">
    <div data-dojo-type="dijit/MenuItem" data-dojo-props="iconClass:'dijitEditorIcon dijitEditorIconCut',
        onClick:function(){alert('not actually cutting anything, just a test!')}">Cut</div>
    <div data-dojo-type="dijit/MenuItem" data-dojo-props="iconClass:'dijitEditorIcon dijitEditorIconCopy',
        onClick:function(){alert('not actually copying anything, just a test!')}">Copy</div>
    <div data-dojo-type="dijit/MenuItem" data-dojo-props="iconClass:'dijitEditorIcon dijitEditorIconPaste',
        onClick:function(){alert('not actually pasting anything, just a test!')}">Paste</div>
    <div data-dojo-type="dijit/MenuSeparator"></div>
    <div data-dojo-type="dijit/PopupMenuItem">
        <span>Enabled Submenu</span>
        <div data-dojo-type="dijit/Menu" >
            <div data-dojo-type="dijit/MenuItem" data-dojo-props="onClick:function(){alert('Submenu 1!')}">Submenu Item One</div>
            <div data-dojo-type="dijit/MenuItem" data-dojo-props="onClick:function(){alert('Submenu 2!')}">Submenu Item Two</div>
        </div>
    </div>
    <div data-dojo-type="dijit/PopupMenuItem">
        <span>Popup of something other than a menu</span>
        <div data-dojo-type="dijit/ColorPalette"></div>
    </div>
</div>

<span>Right click anywhere on this page to see a menu</span>
</body>
</html>
