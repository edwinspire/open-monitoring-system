<?php
require_once "oams_php_script_private/oams_db.php";
    $db = new oamsDB();
    $db->connect();
$db->logout();
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <title>Open Alarm Management System</title>
   <?php include("header_dojo.php"); ?>
        <script type="text/javascript">
            require([
                "dijit/dijit",
                "dojo/parser",
                'w_common_notification_area/w_common_notification_area',
'dijit/MenuBar',
'dijit/Menu',
'dijit/MenuItem',
'dijit/PopupMenuBarItem',
                "woams_menu_header/woams_menu_header",
                "dijit/form/TextBox",
                "dijit/form/Form",
                "dijit/form/Button"
            ]);
        </script>
<style>@import "themes/claro/document.css";@import "themes/claro/claro.css";@import "lib/dojo/gridx/resources/claro/Gridx.css";@import "lib/dojo/gridx/resources/claro/Gridx_rtl.css";@import "app.css";
</style>        
    </head>
    <body data-maq-flow-layout="true" data-maq-comptype="desktop" class="claro" data-maq-ws="collapse" data-maq-appstates="{}" id="myapp">
        <div data-dojo-type="woams_menu_header/woams_menu_header" ></div>

<div style="width: 100%; height: 80%;">
  <div data-dojo-type="dijit/form/Form" action="verification_of_identity.php" method="post" name="Login_Form oams" style="margin: auto; min-width: 1em; min-height: 1em; width: 20%; padding-top: 4em;">
 <div style="border: 1px solid #B8B8B8; border-radius: 6px; -moz-border-radius: 6px; margin: auto; -webkit-box-shadow: 7px 7px 5px 0px rgba(50, 50, 50, 0.75); -moz-box-shadow:    7px 7px 5px 0px rgba(50, 50, 50, 0.75); box-shadow:         7px 7px 5px 0px rgba(50, 50, 50, 0.75); width: auto; height: auto; display: inline-block;">
  <div style="padding: 0.5em;">
    <table border="0" style="margin: auto; border-collapse: collapse; table-layout: fixed; height: auto; width: auto;">
      <colgroup>
        <col style="width: 84px;"></col>
        <col></col>
      </colgroup>
      <tbody>
        <tr>
          <td style="padding: 0.5em;">
            <label style="font-weight: bold;">
              
              
              Usuario:</label>
          </td>
          <td>
            <input type="text" data-dojo-type="dijit/form/TextBox" class="btn btn-primary" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" name="oams_user"></input>
          </td>
        </tr>
        <tr>
          <td style="padding: 0.5em;">
            <label style="font-weight: bold;">
              
              
              Contraseña:</label>
          </td>
          <td>
            <input type="password" placeHolder="Password" data-dojo-type="dijit/form/TextBox" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" name="oams_pwd"></input>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div style="margin: auto; padding: 0.5em; text-align: center;">
    <input type="Submit" name="oams_submit" data-dojo-type="dijit/form/Button" intermediateChanges="false" label="Aceptar" iconClass="dijitNoIcon"></input>
    <input type="reset" data-dojo-type="dijit/form/Button" intermediateChanges="false" label="Cancelar" iconClass="dijitNoIcon"></input>
  </div>
</div>
  </div>
  </div>
    
    </body>
</html>
