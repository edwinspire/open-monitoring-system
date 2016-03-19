<?php
require_once "oams_php_script_private/misc.php";
CheckPageAccess(0);
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <title>Abonados - OAMS</title>
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
                "w_common_titlebar/w_common_titlebar",
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
"woams_contacts_list/woams_contacts_list"
            ]);
        </script>
        <style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "lib/dojo/gridx/resources/claro/Gridx.css";@import "oams_accounts.css";@import "oams.css";
        </style>
<script type="text/javascript" src="_oams_accounts.js"></script>
    </head>
    <body data-maq-flow-layout="true" data-maq-comptype="desktop" class="claro" data-maq-ws="collapse" data-maq-appstates="{}" id="myapp">
        <div style="width: 100%; height: 100%;">
            <div data-dojo-type="woams_menu_master/woams_menu_master" id="idMenuHeader"></div>

            <div class="ContentMasterWithoutHeader">
                <div id="BContainer" data-dojo-type="dijit/layout/BorderContainer" design="sidebar" persist="false" gutters="true" style="min-width: 1em; min-height: 100px; z-index: 0; width: 100%; height: 100%;">
                    <div data-dojo-type="dijit/layout/ContentPane" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" region="left" splitter="true" maxSize="Infinity" style="width: 40%; height: 100%;" doLayout="false">

                        <div id="grid_view_accounts" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', new: {node_form: 'account_form_new_account', class: '.udc_account_form_new'},  url_export:'',  url_data:'lib/custom/uDC_gridx/gridx/view_accounts.php', table: 'view_accounts', IndirectSelect: true, referential_field: 'idcontact', fields: {enabled: false, account_division: false, account: false, account_name: false, account_type: false}}"></div> 

                    </div>
                    <div data-dojo-type="dijit/layout/ContentPane" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" region="center" splitter="false" maxSize="Infinity" doLayout="false">


 <div>
 <span id="account_name_label" style="text-shadow: 4px 1px 2px rgba(150, 150, 150, 1); float: left; font-weight: bold; margin-left: 10px; margin-top: 7px; font-size: 1.1em; float: left;">ABONADO</span><span data-dojo-type="dijit/Toolbar" dir="rtl">
<input dir="ltr" type="button" data-dojo-type="dijit/form/Button" tabIndex="-1" intermediateChanges="false" id="account_save_button" label="Guardar" iconClass="dijitIconSave"></input>
</span>
   </div>


<div class="account_block">
        <span id="TabContainerAccount" class="WidgetFullSize" data-dojo-type="dijit/layout/TabContainer" style="min-width: 5em; min-height: 5em;" controllerWidget="dijit.layout.TabController">

            <div data-dojo-type="dijit/layout/ContentPane" id="account_tab_basic" title="Datos Principales" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" selected="true" closable="false" >
                            <?php require_once "mod/account/basic.php";?>  
            </div>

            <div  data-dojo-type="dijit/layout/ContentPane" id="account_tab_map" title="Ubicación Geográfica" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" selected="true" closable="false" >

<div id="account_map" class="woams_map_into_widget" data-dojo-type="dijit/layout/ContentPane" style="height: 100%"></div>

            </div>

            <div data-dojo-type="dijit/layout/ContentPane" id="account_tab_groups" title="Grupos" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" closable="false">

<div id="account_groups_view" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php',  url_data:'lib/custom/uDC_gridx/gridx/view_account_groups.php', table: 'view_contact_groups_they_belong', IndirectSelect: false, auto_update_row: true, referential_field: 'idcontact', fields: {ismember: true, enabled: false, name: false, description: false, notes: false}}"></div> 

</div>

            <div data-dojo-type="dijit/layout/ContentPane" id="account_tab_contacts" title="Contactos" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" closable="false">
                <div data-dojo-type="dijit/layout/BorderContainer" design="sidebar" persist="false" gutters="true" style="min-width: 1em; min-height: 1px; z-index: 0; width: 100%; height: 95%;">

                    <div data-dojo-type="dijit/layout/ContentPane" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" region="left" splitter="true" maxSize="Infinity" style="width: 50%;" doLayout="false">


                        <div id="grid_view_account_contacts" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', new: {node_form: 'account_new_contact_form', class: '.udc_account_new_contact_form', append_byArrayIds: ['account_input_idcontact']},  url_export:'',  url_data:'lib/custom/uDC_gridx/gridx/view_account_contacts.php', table: 'view_account_contacts', IndirectSelect: true, referential_field: 'idaccountcontact', auto_update_row: true, fields: {enabled: false, contact_name: false, identification: false, appointment: true, priority: true}}"></div> 

                      
                    </div>

                    <div data-dojo-type="dijit/layout/ContentPane" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" region="center" splitter="false" maxSize="Infinity" doLayout="false">

 <div id="contact_widget" data-dojo-type="woams_contact_widget/woams_contact_widget"></div>
                        
                    </div>

                </div>
            </div>
            <div data-dojo-type="dijit/layout/ContentPane" id="account_tab_users" title="Usuarios" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" closable="false">
                <div data-dojo-type="dijit/layout/BorderContainer" design="sidebar" persist="false" gutters="true" style="min-width: 1em; min-height: 1px; z-index: 0; width: 100%; height: 95%;">

                    <div data-dojo-type="dijit/layout/ContentPane" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" region="left" splitter="true" maxSize="Infinity" style="width: 50%;" doLayout="false">
                

                        <div id="grid_view_account_users" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', new: {node_form: 'FieldsNewAccountxxx', class: '.udc_new_accountxxx', append_byArrayIds: ['idprobando']},  url_export:'',  url_data:'lib/custom/uDC_gridx/gridx/view_account_users.php', table: 'view_account_users', IndirectSelect: true, referential_field: 'idaccountuser', auto_update_row: true, fields: {enabled: false, user_name: false, identification: false, appointment: true, priority: true, account_user: false, account_pwd: false}}"></div> 

                    </div>

                    <div data-dojo-type="dijit/layout/ContentPane" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" region="center" splitter="false" maxSize="Infinity" doLayout="false">
                  <div id="user_widget" data-dojo-type="woams_contact_widget/woams_contact_widget"></div>
                    </div>

                </div>
            </div>

            <div data-dojo-type="dijit/layout/ContentPane" id="account_tab_equipments" title=" Equipos" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" closable="false">

                <div data-dojo-type="dijit/layout/TabContainer" style="width: 100%; height: 100%;">
                    <div data-dojo-type="dijit/layout/ContentPane" title="General" data-dojo-props="selected:true">

 <div id="grid_account_equipments" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', new: {node_form: 'FieldsNewAccountxxx', class: '.udc_new_accountxxx', append_byArrayIds: ['idprobando']},  url_export:'prueba.csv',  url_data:'lib/custom/uDC_gridx/gridx/equipments.php', table: 'equipments', IndirectSelect: true, referential_field: 'idequipment', auto_update_row: true, fields: {equipment: true, mark: true, model: true, code_ref: true,  serial_number: true, description: true, operability: true, note: true}}"></div>  
                        
                    </div>
                    <div data-dojo-type="dijit/layout/ContentPane" title="Equipos de redes">
                   
 <div id="grid_account_network_devices" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', new: {node_form: 'FieldsNewAccountxxx', class: '.udc_new_accountxxx', append_byArrayIds: ['idprobando']},  url_export:'',  url_data:'lib/custom/uDC_gridx/gridx/network_devices.php', table: 'network_devices', IndirectSelect: true, referential_field: 'idequipment', auto_update_row: true, fields: {equipment: true, mark: true, model: true, code_ref: true,  serial_number: true, description: true, operability: true, ip: true, mac: true, username: true, pwd: true, monitored: true, note: true}}"></div>                        
                        
                    </div>
                </div>




            </div>

            <div data-dojo-type="dijit/layout/ContentPane" id="account_tab_events" title="Eventos" style="width: 100%; height: 100%;">
                

<div data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', new: {node_form: 'FieldsNewDivision', class: 'udc_new_division', append_byArrayIds: ['idprobando']},  url_export:'',  url_data:'lib/custom/uDC_gridx/gridx/divisions.php', table: 'divisions', IndirectSelect: true, auto_update_row: true, referential_field: 'iddivision', fields: {enabled: true, name: true, description: true, notes: true}}"></div>                 
                
            </div>

        </span>
    </div>

                    </div>
                </div>
            </div>
        </div>


<div id="account_form_new_account" style="width: 200px; display: none;">

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "enabled");
?> </legend>
    <input   class="udc_account_form_new"  required="true" data-dbFieldType="checkbox"  name="enabled"  type="checkbox" data-dojo-type="dijit/form/CheckBox"></input>
</fieldset>


<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "iddivision");
?></legend>
   <div   class="udc_account_form_new"  required="true" data-dbFieldType="text"  name="iddivision" data-dojo-type="woams_divisions_list/woams_divisions_list"></div>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "account");
?></legend>
            <input   class="udc_account_form_new" required="true" name="account" type="text" value="oams" data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "first_name");
?></legend>
            <input  class="udc_account_form_new"   required="true" name="first_name" type="text"  data-dojo-type="dijit/form/ValidationTextBox"  data-dojo-props="invalidMessage:'Invalid Non-Space Text.', missingMessage: 'Este campo es necesario'"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "last_name");
?></legend>
            <input class="udc_account_form_new"   required="true" name="last_name"  type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>



<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "ididtype");
?></legend>
            <div   class="udc_account_form_new"   name="ididtype"  data-dojo-type="woams_identificationtypes_list/woams_identificationtypes_list" style="display: inline;"></div> 
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "identification");
?></legend>
            <input  class="udc_account_form_new"   required="true" name="identification"  type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>

</div>




<div id="account_new_contact_form" style="width: 200px; display: none;">

<fieldset>
    <legend><?php 
echo pguDC::column_label("view_contacts", "contact_name");
?> </legend>
    <div   class="udc_account_new_contact_form"  required="true" name="account_contact_idcontact"  type="text" data-dojo-type="woams_contacts_list/woams_contacts_list"></div>
</fieldset>


<fieldset>
    <legend><?php 
echo pguDC::column_label("account_contacts", "appointment");
?> </legend>
<input  class="udc_account_new_contact_form" required="true" name="appointment"  type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>


<fieldset>
    <legend><?php 
echo pguDC::column_label("account_contacts", "priority");
?> </legend>
<input  class="udc_account_new_contact_form" required="true" name="priority"  type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("account_contacts", "note");
?> </legend>
<input  class="udc_account_new_contact_form" name="note"  type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>



</div>












  <div id="narea" data-dojo-type="notification_area/notification_area"></div>
    </body>
</html>
