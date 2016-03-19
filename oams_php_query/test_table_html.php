<?php
require_once "../oams_php_script_private/oams_db.php";
header('Content-type: application/vnd.oasis.opendocument.spreadsheet');
header("Content-Disposition:attachment;filename=report.ods");

ini_set('display_errors', -1);

echo '
<h2>Cell that spans two columns:</h2>
<table style="width:100%">
  <tr>
    <th>Name</th>
    <th colspan="2">Telephone</th>
  </tr>
  <tr>
    <td>Bill Gates</td>
    <td>555 77 854</td>
    <td>555 77 855</td>
  </tr>
</table>
';
?>

