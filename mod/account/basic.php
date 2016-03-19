<?php 
require_once "lib/custom/uDC/pguDC.php";
?> 
<div id="AccountBasicForm" >
    <input   data-dojo-type="dijit/form/TextBox" class="udc_account_basic" id="account_input_idcontact" name="idcontact" value="0"   type="hidden"></input>
<div id="account_idcontact_label" style="text-align: right; color: #aeb6bf;">0000</div>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "enabled");
?> </legend>
    <input   class="udc_account_basic"  required="true" data-dbFieldType="checkbox"  name="enabled"  type="checkbox" data-dojo-type="dijit/form/CheckBox"></input>
</fieldset>


<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "iddivision");
?></legend>
   <div   class="udc_account_basic"  required="true" data-dbFieldType="text"  name="iddivision" data-dojo-type="woams_divisions_list/woams_divisions_list"></div>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "account");
?></legend>
            <input   class="udc_account_basic" required="true" name="account" type="text" value="oams" data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "first_name");
?></legend>
            <input id="account_firtsname_input" class="udc_account_basic"   required="true" name="first_name" type="text"  data-dojo-type="dijit/form/ValidationTextBox"  data-dojo-props="invalidMessage:'Invalid Non-Space Text.', missingMessage: 'Este campo es necesario'"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "last_name");
?></legend>
            <input id="account_lastname_input" class="udc_account_basic"   required="true" name="last_name"  type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>


<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "birthday");
?></legend>
            <input  class="udc_account_basic"   data-dbFieldType="date" name="birthday"  type="text"  data-dojo-type="dijit/form/DateTextBox"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "ididtype");
?></legend>
            <div   class="udc_account_basic"   name="ididtype"  data-dojo-type="woams_identificationtypes_list/woams_identificationtypes_list" style="display: inline;"></div> 
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "identification");
?></legend>
            <input  class="udc_account_basic"   required="true" name="identification"  type="text" data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "postal_code");
?></legend>
            <input  class="udc_account_basic"   name="postal_code"  type="text" data-dojo-type="dijit/form/TextBox"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "gender");
?></legend>
            <select  class="udc_account_basic"   name="gender"  data-dojo-type="dijit/form/Select" value="" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" invalidMessage="$_unset_$" pageSize="Infinity" searchDelay="200">
                <option value="0" selected="true">No especificado</option>
                <option value="1">Masculino</option>
                <option value="2">Femenino</option>
            </select>
</fieldset>


<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "geox");
?></legend>
 <input  class="udc_account_basic"  name="geox"  type="number" step="any" data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>


<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "geoy");
?></legend>
 <input  class="udc_account_basic"   name="geoy" type="number" step="any" data-dojo-type="dijit/form/ValidationTextBox"></input>
</fieldset>


<fieldset style="width: 98%;">
    <legend><?php 
echo pguDC::column_label("accounts", "address");
?></legend>
        <textarea  class="udc_account_basic"   name="address" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>
</fieldset>


<fieldset style="width: 98%;">
    <legend><?php 
echo pguDC::column_label("accounts", "address_ref");
?></legend>
        <textarea  class="udc_account_basic"   name="address_ref" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "idaccountstate");
?></legend>
<div  class="udc_account_basic"   required="true" data-dbFieldType="text"  name="idaccountstate" data-dojo-type="woams_account_states_list/woams_account_states_list"></div>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "idaccounttype");
?></legend>
<div  class="udc_account_basic"   required="true" data-dbFieldType="text"  name="idaccounttype" data-dojo-type="woams_account_types_list/woams_account_types_list"></div>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "start_date");
?></legend>
            <input  class="udc_account_basic"   data-dbFieldType="date" name="start_date"  type="text" data-dojo-type="dijit/form/DateTextBox"></input>
</fieldset>

<fieldset>
    <legend><?php 
echo pguDC::column_label("accounts", "end_date");
?></legend>
            <input  class="udc_account_basic"   data-dbFieldType="date" name="end_date"  type="text" data-dojo-type="dijit/form/DateTextBox"></input>
</fieldset>

<fieldset style="width: 98%;">
    <legend><?php 
echo pguDC::column_label("accounts", "note");
?></legend>
        <textarea  class="udc_account_basic"   name="note" type="text" data-dojo-type="dijit/form/Textarea" style="width: 100%; height: auto;"></textarea>
</fieldset>

</div>


<div data-dojo-type="uDC/uDC" data-udc-config="{url_data: 'oams_php_query/udc/accounts.php', referential_field: 'idcontact', table: 'accounts', selector_class: '.udc_account_basic', node_container: 'AccountBasicForm', append_byArrayIds:[]}"   id="uDC_Account_Basic_Form"></div>
