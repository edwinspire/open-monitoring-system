<div>

    <input data-dbTuple="woams_contact_form_widget" data-dojo-type="dijit/form/TextBox" name="idcontact" value="0" type="hidden"></input>

    <div style="display: inline-block;" class="form_field">
        <label for="enabled" class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("contacts", "enabled");
?> 
</label>
        <span>
            <input data-dbTuple="woams_contact_form_widget" required="true" data-dbFieldType="checkbox"  name="enabled" data-dojo-attach-point="Enabled" type="checkbox" data-dojo-type="dijit/form/CheckBox"></input>
        </span></div>

    <div style="display: inline-block;" class="form_field">
        <label class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("contacts", "account");
?> 
</label>
        <span>
            <input data-dbTuple="woams_contact_form_widget" required="true" name="account" type="text" value="oams" data-dojo-type="dijit/form/ValidationTextBox"></input>
        </span></div>

    <div style="display: inline-block;" class="form_field">
        <label for="first_name" class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("contacts", "first_name");
?> 
</label>
        <span>
            <input data-dbTuple="woams_contact_form_widget" required="true" name="first_name" type="text"  data-dojo-type="dijit/form/ValidationTextBox"  data-dojo-props="invalidMessage:'Invalid Non-Space Text.', missingMessage: 'Este campo es necesario'"></input>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("contacts", "last_name");
?> 
</label>
        <span>
            <input data-dbTuple="woams_contact_form_widget" required="true" name="last_name" data-dojo-attach-point="LName" type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("contacts", "birthday");
?> 
</label>
        <span>
            <input data-dbTuple="woams_contact_form_widget" required="true" data-dbFieldType="date" name="birthday" data-dojo-attach-point="BDay" type="text"  data-dojo-type="dijit/form/DateTextBox"></input>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("contacts", "ididtype");
?> 
</label>
        <span>
            <div  data-dbTuple="woams_contact_form_widget" name="ididtype" data-dojo-attach-point="IDType" data-dojo-type="woams_identificationtypes_list/woams_identificationtypes_list" style="display: inline;"></div> 
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("contacts", "identification");
?> 
</label>
        <span>
            <input data-dbTuple="woams_contact_form_widget" required="true" name="identification" data-dojo-attach-point="Identification" type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("contacts", "postal_code");
?> 
</label>
        <span>
            <input data-dbTuple="woams_contact_form_widget" name="postal_code" data-dojo-attach-point="CPostal" type="text" data-dojo-type="dijit/form/TextBox"></input>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("contacts", "gender");
?> 
</label>
        <span>
            <select data-dbTuple="woams_contact_form_widget" name="gender" data-dojo-attach-point="Gender" data-dojo-type="dijit/form/Select" value="" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" invalidMessage="$_unset_$" pageSize="Infinity" searchDelay="200">
                <option value="0" selected="true">No especificado</option>
                <option value="1">Masculino</option>
                <option value="2">Femenino</option>
            </select>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("contacts", "geox");
?> 
</label>
        <span>
            <input data-dbTuple="woams_contact_form_widget" name="geox" value="0" data-dojo-attach-point="Geox" type="number" step="0.01" required="true"  data-dojo-type="dijit/form/ValidationTextBox"></input>
        </span></div>
    <div style="display: inline-block;" class="form_field">
        <label class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("contacts", "geoy");
?> 
</label>
        <span>
            <input data-dbTuple="woams_contact_form_widget" name="geoy" value="0" data-dojo-attach-point="Geoy" type="numbre" step="0.01" required="true"  data-dojo-type="dijit/form/ValidationTextBox"></input>
        </span></div>

    <div class="form_field">
        <label class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("contacts", "address");
?> 
</label>

        <textarea data-dbTuple="woams_contact_form_widget" name="address" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>

    </div>

    <div class="form_field">

        <label class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("contacts", "address_ref");
?> 
</label>

        <textarea data-dbTuple="woams_contact_form_widget" name="address_ref" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>

    </div>

    <div class="form_field">
        <label class="form_label">
                        <?php 
require_once "../../../oams_php_script_private/misc.php";
echo get_table_column_label("contacts", "note");
?> 
</label>

        <textarea data-dbTuple="woams_contact_form_widget" name="note" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>

    </div>


    <div style="float: left; width: 49%; min-width: 200px; height: 200px; display: none;" >         <div  data-dojo-type="woams_groups_gridx/woams_groups_gridx"></div> </div>

    <div style="float: right; width: 49%; min-width: 200px; height: 200px; display: none;" >
        <div  data-dojo-type="woams_groups_gridx/woams_groups_gridx"></div>

    </div>   


</div>

