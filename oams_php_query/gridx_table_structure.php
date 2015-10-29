<?php

/*
  //ini_set('display_errors', 0);
  include "../oams_php_script_private/pg_conn_string.php";
  include "../common_php_script/pg_result_to_json.php";
  include "../oams_php_script_private/security.php";
  include "../oams_php_script_private/oams_db.php";
 */
/*
  header('Content-type: application/json');

  $result = false;

  if(isset($_POST["query_type"])){

  session_start();

  $db = new oamsDB();
  $db->connect();
  $db->mapper_table("contacts");

  switch($_POST["query_type"]){
  case "insert":
  $result = $db->insert("contacts", $_POST, array("idcontact"), array("idcontact"));
  break;
  case "update":
  $result = $db->update("contacts", $_POST, array("idcontact", "ts"), array("idcontact"));
  break;
  case "select":
  if(isset($_POST["idcontact"])){
  $result = $db->select("contacts", array(), array("idcontact" => $_POST["idcontact"]));
  }
  break;
  case "delete":

  break;
  }

  }else{
  //header('HTTP/1.1 412 Precondition Failed', true, 412);
  http_response_code(412);
  }
  echo pg_result_to_json($result);
 */

print_r($_POST);
?>
