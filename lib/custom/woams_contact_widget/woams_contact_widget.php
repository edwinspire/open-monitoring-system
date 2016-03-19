<?php 
require_once "../uDC/pguDC.php";
$id_udc_contact_new_email = md5("woams_contact_widget".microtime());
$id_udc_contact_new_phone = md5("woams_contact_widget".microtime());
?> 

<div data-dojo-attach-point="C0" style="width: 100%; height: 100%;">
    <div data-dojo-attach-point="TBar"  data-dojo-type="titlebar/titlebar"></div>
    <div class="woams_account_widget_c1">
        <span class="woams_account_widget_tc1" data-dojo-attach-point="TC1" data-dojo-type="dijit/layout/TabContainer" style="min-width: 5em; min-height: 5em;" controllerWidget="dijit.layout.TabController">
            <div data-dojo-type="dijit/layout/ContentPane" title="Principal" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" selected="true" closable="false" >

<div data-dojo-attach-point="ContainerForm" >
    <input   data-dojo-type="dijit/form/TextBox" class="udc_contact_widget" data-dojo-attach-point="idcontact" name="idcontact" value="0"   type="hidden"></input>
<div data-dojo-attach-point="idcontact_label" style="text-align: right; color: #aeb6bf;">0000</div>

<fieldset>
    <legend><?php 
echo pguDC::column_label("contacts", "enabled");
?> </legend>
    <input   class="udc_contact_widget"  required="true" data-dbFieldType="checkbox"  name="enabled"  type="checkbox" data-dojo-type="dijit/form/CheckBox"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("contacts", "first_name");
?></legend>
            <input data-dojo-attach-point="firtsname_input" class="udc_contact_widget"   required="true" name="first_name" type="text"  data-dojo-type="dijit/form/ValidationTextBox"  data-dojo-props="invalidMessage:'Invalid Non-Space Text.', missingMessage: 'Este campo es necesario'"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("contacts", "last_name");
?></legend>
            <input data-dojo-attach-point="lastname_input" class="udc_contact_widget"   required="true" name="last_name"  type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>


<fieldset>
    <legend><?php 
echo pguDC::column_label("contacts", "birthday");
?></legend>
            <input  class="udc_contact_widget"   data-dbFieldType="date" name="birthday"  type="text"  data-dojo-type="dijit/form/DateTextBox"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("contacts", "ididtype");
?></legend>
            <div   class="udc_contact_widget"   name="ididtype"  data-dojo-type="woams_identificationtypes_list/woams_identificationtypes_list" style="display: inline;"></div> 
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("contacts", "identification");
?></legend>
            <input  class="udc_contact_widget"   required="true" name="identification"  type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("contacts", "postal_code");
?></legend>
            <input  class="udc_contact_widget"   name="postal_code"  type="text" data-dojo-type="dijit/form/TextBox"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("contacts", "gender");
?></legend>
            <select  class="udc_contact_widget"   name="gender"  data-dojo-type="dijit/form/Select" value="" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" invalidMessage="$_unset_$" pageSize="Infinity" searchDelay="200">
                <option value="0" selected="true">No especificado</option>
                <option value="1">Masculino</option>
                <option value="2">Femenino</option>
            </select>
</fieldset>


<fieldset>
    <legend><?php 
echo pguDC::column_label("contacts", "geox");
?></legend>
            <input  class="udc_contact_widget"   name="geox" value="0"  required="true"  data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>


<fieldset>
    <legend><?php 
echo pguDC::column_label("contacts", "geoy");
?></legend>
            <input  class="udc_contact_widget"   name="geoy" value="0"  required="true"  data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>


<fieldset style="width: 98%;">
    <legend><?php 
echo pguDC::column_label("contacts", "address");
?></legend>
        <textarea  class="udc_contact_widget"   name="address" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>
</fieldset>


<fieldset style="width: 98%;">
    <legend><?php 
echo pguDC::column_label("contacts", "address_ref");
?></legend>
        <textarea  class="udc_contact_widget"   name="address_ref" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>
</fieldset>


<fieldset style="width: 98%;">
    <legend><?php 
echo pguDC::column_label("contacts", "note");
?></legend>
        <textarea  class="udc_contact_widget"   name="note" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>
</fieldset>

</div>



            </div>
            <div data-dojo-type="dijit/layout/ContentPane" title="Teléfonos" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" closable="false">
               

                        <div data-dojo-attach-point="grid_phones" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php', new: {node_form: '<?php echo $id_udc_contact_new_phone; ?>', class: '.woams_contact_new_phone'},  url_export:'',  url_data:'lib/custom/uDC_gridx/gridx/contact_phones.php', table: 'phones', IndirectSelect: true, referential_field: 'idphone', refresh_on_changed_table: ['phones'], auto_select_on_change: true, auto_update_row: true, fields: {enabled: true, number: true, ext: true, note: true}}"></div> 


            </div>

            <div data-dojo-type="dijit/layout/ContentPane" title="Email" extractContent="false" preventCache="false" preload="false" refreshOnShow="false" doLayout="true" closable="false">


                        <div data-dojo-attach-point="grid_email" data-dojo-type="uDC_gridx/uDC_gridx"  data-udc-gridx-config="{structure: 'lib/custom/uDC_gridx/uDC_gridx_structure.php',  new: {node_form: '<?php echo $id_udc_contact_new_email; ?>', class: '.woams_contact_new_email'}, url_export:'',  url_data:'lib/custom/uDC_gridx/gridx/contact_emails.php', table: 'emails', IndirectSelect: true, referential_field: 'idemail', refresh_on_changed_table: ['emails'], auto_select_on_change: true, auto_update_row: true, fields: {email: true, priority: true, note: true}}"></div> 


            </div>

        </span>
    </div>
<div data-dojo-type="uDC/uDC" data-udc-config="{url_data: 'oams_php_query/udc/contacts.php', referential_field: 'idcontact', table: 'contacts'}"   data-dojo-attach-point="udc_contact"></div>


<div id="<?php echo $id_udc_contact_new_email; ?>" style="display: none; width: 250px;">

<input  class="woams_contact_new_email" name="idcontact" type="hidden" value="000000@xxx.com"></input>
<fieldset>
    <legend><?php 
echo pguDC::column_label("emails", "email");
?> </legend>
 <input type="text" data-dojo-type="dijit/form/TextBox" intermediateChanges="false" iconClass="dijitNoIcon" class="woams_contact_new_email" name="email"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("emails", "priority");
?> </legend>
 <input class="woams_contact_new_email" required="true" name="priority" type="range" min="1" max="10" data-dojo-type="dijit/form/NumberSpinner" value="10" style="width: 50px;"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("emails", "note");
?> </legend>
<input  class="woams_contact_new_email" name="note"  type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>

</div>


<div id="<?php echo $id_udc_contact_new_phone; ?>" style="display: none; width: 250px;">

<input class="woams_contact_new_phone" name="idcontact" type="hidden" value="-99999"></input>

<fieldset>
    <legend><?php 
echo pguDC::column_label("phones", "number");
?> </legend>
 <input type="text" data-dojo-type="dijit/form/TextBox" intermediateChanges="false"  class="woams_contact_new_phone" name="number"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("phones", "ext");
?> </legend>
 <input type="text" data-dojo-type="dijit/form/TextBox" intermediateChanges="false" class="woams_contact_new_phone" name="ext"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("phones", "priority");
?> </legend>
 <input class="woams_contact_new_phone" required="true" name="priority" type="range" min="1" max="10" data-dojo-type="dijit/form/NumberSpinner" value="10" style="width: 50px;"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("phones", "note");
?> </legend>
<input  class="woams_contact_new_phone" name="note"  type="text" data-dojo-type="dijit/form/TextBox"></input>
</fieldset>

</div>


</div>

