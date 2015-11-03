<div>
<div data-dojo-attach-point="ContainerForm" >
    <input data-dbTuple="woams_account_form_widget"  data-dojo-type="dijit/form/TextBox" name="idcontact" value="0" data-dojo-attach-point="idaccount"  type="hidden"></input>

    <div style="display: inline-block;" class="form_field">
        <label for="enabled" cclass="form_label">
<?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "enabled");
?>            
</label>

        <span>
            <input data-dbTuple="woams_account_form_widget" required="true" data-dbFieldType="checkbox"  name="enabled" data-dojo-attach-point="Enabled" type="checkbox" data-dojo-type="dijit/form/CheckBox"></input>
        </span></div>

    <div style="display: inline-block;" class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "account");
?>
  </label>
        <span>
            <input data-dbTuple="woams_account_form_widget" required="true" name="account" type="text" value="oams" data-dojo-type="dijit/form/ValidationTextBox"></input>
        </span></div>

    <div style="display: inline-block;" class="form_field">
        <label for="first_name" cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "first_name");
?>            
</label>
        <span>
            <input data-dbTuple="woams_account_form_widget" required="true" name="first_name" type="text"  data-dojo-type="dijit/form/ValidationTextBox"  data-dojo-props="invalidMessage:'Invalid Non-Space Text.', missingMessage: 'Este campo es necesario'"></input>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "last_name");
?>               
</label>
        <span>
            <input data-dbTuple="woams_account_form_widget" required="true" name="last_name" data-dojo-attach-point="LName" type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "birthday");
?>               
</label>
        <span>
            <input data-dbTuple="woams_account_form_widget" required="true" data-dbFieldType="date" name="birthday" data-dojo-attach-point="BDay" type="text"  data-dojo-type="dijit/form/DateTextBox"></input>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "ididtype");
?>             
</label>
        <span>
            <div  data-dbTuple="woams_account_form_widget" name="ididtype" data-dojo-attach-point="IDType" data-dojo-type="woams_identificationtypes_list/woams_identificationtypes_list" style="display: inline;"></div> 
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "identification");
?>  
</label>
        <span>
            <input data-dbTuple="woams_account_form_widget" required="true" name="identification" data-dojo-attach-point="Identification" type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "postal_code");
?>  
</label>
        <span>
            <input data-dbTuple="woams_account_form_widget" name="postal_code" data-dojo-attach-point="CPostal" type="text" data-dojo-type="dijit/form/TextBox"></input>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "gender");
?>  
</label>
        <span>
            <select data-dbTuple="woams_account_form_widget" name="gender" data-dojo-attach-point="Gender" data-dojo-type="dijit/form/Select" value="" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" invalidMessage="$_unset_$" pageSize="Infinity" searchDelay="200">
                <option value="0" selected="true">No especificado</option>
                <option value="1">Masculino</option>
                <option value="2">Femenino</option>
            </select>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "geox");
?>  
</label>
        <span>
            <input data-dbTuple="woams_account_form_widget" name="geox" value="0" data-dojo-attach-point="Geox" required="true"  data-dojo-type="dijit/form/ValidationTextBox"></input>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "geoy");
?>  
</label>
        <span>
            <input data-dbTuple="woams_account_form_widget" name="geoy" value="0" data-dojo-attach-point="Geoy" required="true"  data-dojo-type="dijit/form/ValidationTextBox"></input>
        </span><button data-dojo-type="dijit/form/Button" data-dojo-attach-point="OpenStreetMaps" data-dojo-props="iconClass:'dijitEditorIcon dijitEditorIconFullScreen', showLabel: true" type="button">Ver en mapa externo</button></div>

    <div class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "address");
?> 
</label>

        <textarea data-dbTuple="woams_account_form_widget" name="address" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>

    </div>

    <div class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "address_ref");
?> 
</label>

        <textarea data-dbTuple="woams_account_form_widget" name="address_ref" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>

    </div>


    <div style="display: inline-block;" class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "idaccountstate");
?> 
</label>
        <span>
            <div data-dbTuple="woams_account_form_widget" name="idaccountstate" data-dojo-attach-point="AccountState" data-dojo-type="woams_account_states_list/woams_account_states_list" style="display: inline;"></div> 
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "idaccounttype");
?> 
</label>
        <span>
            <div data-dbTuple="woams_account_form_widget" name="idaccounttype" data-dojo-attach-point="AccountType" data-dojo-type="woams_account_types_list/woams_account_types_list" style="display: inline;"></div> 
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "start_date");
?> 
</label>
        <span>
            <input data-dbTuple="woams_account_form_widget" required="true" data-dbFieldType="date" name="start_date" data-dojo-attach-point="DStart" type="text" data-dojo-type="dijit/form/DateTextBox"></input>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "end_date");
?> 
</label>
        <span>
            <input data-dbTuple="woams_account_form_widget" required="true" data-dbFieldType="date" name="end_date" data-dojo-attach-point="DEnd" type="text" data-dojo-type="dijit/form/DateTextBox"></input>
        </span></div>

    <div class="form_field">
        <label cclass="form_label">
            <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("accounts", "note");
?> 
</label>

        <textarea data-dbTuple="woams_account_form_widget" name="note" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>

    </div>



</div >


</div>

