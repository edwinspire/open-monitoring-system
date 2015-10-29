<?php

//ini_set('display_errors', 0);
include "../oams_php_script_private/pg_conn_string.php";
include "../common_php_script/pg_result_to_json.php";
include "../oams_php_script_private/security.php";

header('Content-type: application/json');
$pGdbconn = pg_connect($conn_string) or die("Could not connect");

$result = false;

if (isset($_POST["query_type"])) {

//    session_start();
    $idadmin = get_idadmin($pGdbconn);

    if ($idadmin > 0) {

        /*
          fun_event_insert_by_ideventtype(
          IN idateevent timestamp without time zone,
          IN iidaccount integer,
          IN izu integer,
          IN ipriority integer,
          IN iideventtype integer,
          IN idescription text,
          IN iidadmin integer, OUT fun_return integer, OUT fun_msg text)

         */


        switch ($_POST["query_type"]) {
            case "save":
                if (isset($_POST["idaccount"]) && isset($_POST["ideventtype"]) && isset($_POST["dateevent"]) && isset($_POST["priority"]) && isset($_POST["code"]) && isset($_POST["zu"]) && isset($_POST["description"])
                ) {
                    $result = pg_query_params($pGdbconn, "SELECT fun_event_insert_by_ideventtype($1::timestamp without time zone, $2::integer, $3:: integer, $4::integer, $5::integer, $6::text, $7::integer);", array($_POST["dateevent"],
                        $_POST["idaccount"],
                        $_POST["zu"],
                        $_POST["priority"],
                        $_POST["ideventtype"],
                        $_POST["description"],
                        $idadmin
                    ));
                } else {
                    print_r($_POST);
                    echo 'No hay todos los campos necesarios </br>';
                }
//fun_edit_accounts(IN id integer, IN enabled boolean, IN first_name text, IN last_name text, IN birthday timestamp without time zone, IN identification text, IN ididtype integer, IN postal_code text, IN gender integer, IN geox real, IN geoy real, IN note text, IN address text, IN address_ref text, IN idaccountstate integer, IN idaccounttype integer, IN start_date timestamp without time zone, IN end_date timestamp without time zone, IN account text, OUT fun_return integer, OUT fun_msg text)
                break;

            case "load":
                if (isset($_POST["id"])) {
                    $result = pg_query_params($pGdbconn, "SELECT * FROM events WHERE idevent = $1::integer", array($_POST["id"]));
                }
                break;
            case "delete":
                if (isset($_POST["id"])) {
                    $result = pg_query_params($pGdbconn, "SELECT fun_msg, fun_return FROM fun_edit_accounts($1::integer, $2::boolean, $3::text, $4::text, $5::timestamp without time zone, $6::text, $7::integer, $8::text, $9::integer, $10::real, $11::real, $12::text, $13::text, $14::text, $15::integer, $16::integer, $17::timestamp without time zone, $18::timestamp without time zone, $19::text, $20::integer) as resultado;", array($_POST["id"] * -1,
                        $_POST["enabled"],
                        $_POST["first_name text"],
                        $_POST["last_name text"],
                        $_POST["birthday"],
                        $_POST["identification"],
                        $_POST["ididtype"],
                        $_POST["postal_code text"],
                        $_POST["gender"],
                        $_POST["geox"],
                        $_POST["geoy"],
                        $_POST["note"],
                        $_POST["address"],
                        $_POST["address_ref"],
                        $_POST["idaccountstate"],
                        $_POST["idaccounttype"],
                        $_POST["start_date"],
                        $_POST["end_date"],
                        $_POST["account"],
                        $idadmin
                    ));
                }
                break;
        }
    } else {
        header('HTTP/1.1 401 Unauthorized', true, 401);
    }
} else {
    echo 'No hay definido un tipo de query </br>';
}
echo pg_result_to_json($result);
?>
