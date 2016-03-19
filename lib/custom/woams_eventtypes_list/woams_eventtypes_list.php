<div style="display: inline-block;">
    <select style=" width: auto;" data-dojo-type="dijit/form/FilteringSelect"  value="0" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" required="true" invalidMessage="$_unset_$" pageSize="Infinity" searchDelay="200" data-dojo-attach-point="FS">
<?php
ini_set('display_errors', -1);
include "../uDC/pguDC.php";
echo pguDC::html_tag_option_values("SELECT ideventtype as id, label as name FROM eventtypes WHERE length(label) > 0  ORDER BY label;");
?>
 </select>
</div>
