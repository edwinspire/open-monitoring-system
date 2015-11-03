<div data-dojo-attach-point="C0" style="width: 100%; height: 100%;">
    <div data-dojo-attach-point="T1" data-dojo-type="w_common_titlebar/w_common_titlebar"></div>
    <div data-dojo-attach-point="Menu" data-dojo-type="w_common_basic_menubar/w_common_basic_menubar"></div>
    <div class="woams_account_widget_c1">
        <span class="woams_account_widget_tc1" data-dojo-attach-point="TC1" data-dojo-type="dijit/layout/TabContainer" style="min-width: 5em; min-height: 5em;" controllerWidget="dijit.layout.TabController">

            <div data-dojo-type="dijit/layout/ContentPane" title="Datos Principales" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" selected="true" closable="false" >
                <div data-dojo-attach-point="AccountForm" data-dojo-type="woams_account_form/woams_account_form"></div>
            </div>

            <div data-dojo-type="dijit/layout/ContentPane" title="Ubicación Geográfica" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" selected="true" closable="false" >

                <div data-dojo-attach-point="ContainerMap" class="woams_map_into_widget" data-dojo-type="dijit/layout/ContentPane" style="height: 100%"></div>

            </div>

            <div data-dojo-type="dijit/layout/ContentPane" title="Grupos" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" closable="false">
                <div data-dojo-attach-point="AccountGroups" data-dojo-type="woams_contacts_groups_gridx/woams_contacts_groups_gridx" style="height: 100%"></div>
</div>

            <div data-dojo-type="dijit/layout/ContentPane" title="Contactos" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" closable="false">
                <div data-dojo-attach-point="C2" data-dojo-type="dijit/layout/BorderContainer" design="sidebar" persist="false" gutters="true" style="min-width: 1em; min-height: 1px; z-index: 0; width: 100%; height: 95%;">

                    <div data-dojo-type="dijit/layout/ContentPane" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" region="left" splitter="true" maxSize="Infinity" style="width: 50%;" doLayout="false">
                        <div data-dojo-type="woams_common_gridx/woams_common_gridx" data-dojo-attach-point="GridAccountContacts" ></div>
                    </div>

                    <div data-dojo-type="dijit/layout/ContentPane" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" region="center" splitter="false" maxSize="Infinity" doLayout="false">
                        <div data-dojo-type="woams_contact_widget/woams_contact_widget" data-dojo-attach-point="AccountContactsx" ></div>
                    </div>

                </div>
            </div>
            <div data-dojo-type="dijit/layout/ContentPane" title="Usuarios" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" closable="false">
                <div data-dojo-attach-point="C3" data-dojo-type="dijit/layout/BorderContainer" design="sidebar" persist="false" gutters="true" style="min-width: 1em; min-height: 1px; z-index: 0; width: 100%; height: 95%;">

                    <div data-dojo-type="dijit/layout/ContentPane" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" region="left" splitter="true" maxSize="Infinity" style="width: 50%;" doLayout="false">
                        <div data-dojo-type="woams_common_gridx/woams_common_gridx" data-dojo-attach-point="GridAccountUsers" ></div>
                    </div>

                    <div data-dojo-type="dijit/layout/ContentPane" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" region="center" splitter="false" maxSize="Infinity" doLayout="false">
                        <div data-dojo-type="woams_contact_widget/woams_contact_widget" data-dojo-attach-point="AccountUser" ></div>
                    </div>

                </div>
            </div>

            <div data-dojo-type="dijit/layout/ContentPane" title=" Equipos" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" closable="false">

                <div data-dojo-type="dijit/layout/TabContainer" style="width: 100%; height: 100%;">
                    <div data-dojo-type="dijit/layout/ContentPane" title="General" data-dojo-props="selected:true">
                        <span data-dojo-type="dijit/Toolbar" data-dojo-attach-point="idtoolbar">

                            <input type="button" data-dojo-type="dijit/form/Button" data-dojo-attach-point="new_equipment" tabIndex="-1" intermediateChanges="false" label="Agregar" iconClass="dijitIconNewTask"></input>

                            <input type="button" data-dojo-type="dijit/form/Button" data-dojo-attach-point="new_network_device" tabIndex="-1" intermediateChanges="false" label="Agregar Equipo de Red" iconClass="dijitIconNewTask"></input>

                            <input type="button" data-dojo-type="dijit/form/Button" data-dojo-attach-point="delete_selection" tabIndex="-1" intermediateChanges="false" label="Eliminar seleccionados" iconClass=""></input>

                        </span>

                        <div class="woams_size_without_toolbar">
                            <div  data-dojo-type="woams_common_gridx/woams_common_gridx" data-dojo-attach-point="GridAccountEquipments" ></div>
                        </div>
                    </div>
                    <div data-dojo-type="dijit/layout/ContentPane" title="Equipos de redes">
                        <span data-dojo-type="dijit/Toolbar" data-dojo-attach-point="idtoolbar">

                            <input type="button" data-dojo-type="dijit/form/Button" data-dojo-attach-point="new_equipment_network" tabIndex="-1" intermediateChanges="false" label="Agregar" iconClass="dijitIconNewTask"></input>

                            <input type="button" data-dojo-type="dijit/form/Button" data-dojo-attach-point="delete_selection_network" tabIndex="-1" intermediateChanges="false" label="Eliminar seleccionados" iconClass=""></input>

                        </span>

                        <div class="woams_size_without_toolbar">
                            <div  data-dojo-type="woams_common_gridx/woams_common_gridx" data-dojo-attach-point="GridAccountEquipmentsNetwork" ></div>
                        </div>
                    </div>
                </div>




            </div>

            <div data-dojo-type="dijit/layout/ContentPane" title="Eventos" style="width: 100%; height: 100%;">
                <div data-dojo-attach-point="EventsComments" data-dojo-type="woams_events_comments/woams_events_comments" ></div>
            </div>

        </span>
    </div>


    <div style="display: none;" data-dojo-attach-point="CttdNewEquipment" data-dojo-type="dijit/ConfirmTooltipDialog">

        <input style="display: none;" data-dojo-type="dijit/form/TextBox" data-dbTuple="woams_account_equipment_tuple" name="idaccount" data-dojo-attach-point="idaccount" />

        <label for="code_ref">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("equipments", "code_ref");
?>  
</label> <input data-dbTuple="woams_account_equipment_tuple" required="true" data-dojo-type="dijit/form/TextBox" name="code_ref" /><br />
        <label for="description">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("equipments", "description");
?>  
</label> <input data-dbTuple="woams_account_equipment_tuple" data-dojo-type="dijit/form/TextBox" name="description" /><br />
        <label for="equipment">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("equipments", "equipment");
?>  
</label> <input data-dbTuple="woams_account_equipment_tuple" required="true" data-dojo-type="dijit/form/TextBox" name="equipment" /><br />
        <label for="mark">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("equipments", "mark");
?>  
</label> <input data-dbTuple="woams_account_equipment_tuple" data-dojo-type="dijit/form/TextBox"  name="mark" /><br />
        <label for="model">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("equipments", "model");
?>  
</label> <input data-dbTuple="woams_account_equipment_tuple" required="true" data-dojo-type="dijit/form/TextBox"  name="model" /><br />
        <label for="serial_number">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("equipments", "serial_number");
?>  
</label> <input data-dbTuple="woams_account_equipment_tuple" required="true" data-dojo-type="dijit/form/TextBox"  name="serial_number" /><br />
        <label for="installation_date">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("equipments", "installation_date");
?>  
</label><input data-dbTuple="woams_account_equipment_tuple" required="true"  name="installation_date" type="text" data-dojo-type="dijit/form/DateTextBox" data-dbFieldType="date"></input><br />
        <label for="operativity">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("equipments", "operativity");
?>  
</label> <input data-dbTuple="woams_account_equipment_tuple" required="true" data-dojo-type="dijit/form/TextBox" type="number" min="0" max="100" value="100" name="operativity" /><br />
        <label for="note">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("equipments", "note");
?>  
</label> <textarea data-dbTuple="woams_account_equipment_tuple" name="note" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea><br/>


    </div>

    <div style="display: none;" data-dojo-attach-point="CttdDeleteEquipments" data-dojo-type="dijit/ConfirmTooltipDialog">
        Esta seguro de eliminar los equipos seleccionados?
    </div>


    <div style="display: none;  width: 50%;" data-dojo-attach-point="CttdNewAccount" data-dojo-type="dijit/ConfirmTooltipDialog">

    <div style="display: inline-block;" class="form_field">
        <label for="enabled" class="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "enabled");
?>              
</label>
        <span>
            <input data-dbTuple="woams_account_widget_new_account" required="true" data-dbFieldType="checkbox"  name="enabled"  type="checkbox" data-dojo-type="dijit/form/CheckBox"></input>
        </span></div>

    <div style="display: inline-block;" class="form_field">
        <label class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "account");
?> 
 </label>
        <span>
            <input data-dbTuple="woams_account_widget_new_account" required="true" name="account" type="text" value="oams" data-dojo-type="dijit/form/ValidationTextBox"></input>
        </span></div>

    <div style="display: inline-block;" class="form_field">
        <label for="first_name" class="form_label">
                     <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "first_name");
?>             
</label>
        <span>
            <input data-dbTuple="woams_account_widget_new_account" required="true" name="first_name" type="text"  data-dojo-type="dijit/form/ValidationTextBox"  data-dojo-props="invalidMessage:'Invalid Non-Space Text.', missingMessage: 'Este campo es necesario'"></input>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label class="form_label">
                     <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "last_name");
?>             
</label>
        <span>
            <input data-dbTuple="woams_account_widget_new_account" required="true" name="last_name"  type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
        </span></div>
        
    <div style="display: inline-block;" class="form_field">
        <label class="form_label">
                                 <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "ididtype");
?> 
</label>
        <span>
            <div  data-dbTuple="woams_account_widget_new_account" name="ididtype"  data-dojo-type="woams_identificationtypes_list/woams_identificationtypes_list" style="display: inline;"></div> 
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label class="form_label">
                     <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "identification");
?>             
</label>
        <span>
            <input data-dbTuple="woams_account_widget_new_account" required="true" name="identification"  type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
        </span></div>
        <div class="form_field">
        <label class="form_label">
                     <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "address");
?>             
</label>

        <textarea data-dbTuple="woams_account_widget_new_account" name="address" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>

    </div>

    <div class="form_field">
        <label class="form_label">
                     <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "address_ref");
?> 
</label>

        <textarea data-dbTuple="woams_account_widget_new_account" name="address_ref" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>

    </div>


    <div class="form_field">
        <label class="form_label">
                                 <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "note");
?> 
</label>

        <textarea data-dbTuple="woams_account_widget_new_account" name="note" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>

    </div>
        
    </div>

</div>

