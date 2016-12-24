<?php
ini_set('display_errors', 1);
include "js/dojo/custom/uDC/pguDC.php";
header('Content-type: application/json');

class Receiver extends pguDC {
  
    function validator ($idequipment, $report_validator) {
            $r = false;        
 $result = $this-> query_params("SELECT COUNT(*) as rv FROM equipments WHERE idequipment = $1::BIGINT AND report_validator = $2::TEXT;", array($idequipment, $report_validator));

        $row = pg_fetch_assoc($result);
//print_r($row);
        if ($row["rv"] > 0) {
            $r = true;
        }else{
$d = array("idaccount"=>0);
$d["description"]="Intento no autorizado de reportar desde: ".$_SERVER["REMOTE_ADDR"]." - idequipment: ".$idequipment." - report_validator: ".$report_validator;
if(isset($_POST["IPDevice"]) ){
$d["description"] = $d["description"]." - IPDevice: ".$_POST["IPDevice"];
}
$d["ideventtype"]=1005;

$this->connect("events");
$this->insert_result_as_json($d);
}

return $r;
    }
}


function Ping($Data){
$r = "{result: null}";
$db = new Receiver();
$db->connect("events_networkdevice_ping");
if($db->validator($Data["idequipment"], $Data["report_validator"])){

$d = array("report_validator"=>$Data["report_validator"], "roundtriptime"=>$Data["roundtriptime"], "idequipment"=>$Data["idequipment"]);

switch($Data["Status"]){
case "TtlExpired":
$d["ideventtype"]=85;
$d["description"]="IP ".$Data["ToIP"];
$r = $db->insert_result_as_json($d);
break;
case "Success":
$d["description"]="IP ".$Data["ToIP"]." ".$d["roundtriptime"]." ms";
if($Data["roundtriptime"] > $Data["MaxTime"]){
$d["ideventtype"]=81;
}else{
$d["ideventtype"]=84;
}
$r = $db->insert_result_as_json($d);
break;
default:
$d["ideventtype"]=0;
$d["description"]="IP ".$Data["ToIP"]." ".$Data["Status"];
$r = $db->insert_result_as_json($d);
break;
}


}

return $r;
}

function StartMachine($Data){
$r = "{result: null}";
$db = new Receiver();
$db->connect("events");
if($db->validator($Data["idequipment"], $Data["report_validator"])){

$d = array("idequipment"=>$Data["idequipment"]);

$d["ideventtype"]=86;
//$d["description"]="";
$r = $db->insert_result_as_json($d);

}

return $r;
}


function DeleteBackup($Data){

echo "Imprime drivers  ";
print_r(json_decode($_POST["Drivers"]));

$r = "{result: null}";
$db = new Receiver();
$db->connect("events");
if($db->validator($Data["idequipment"], $Data["report_validator"])){

$d = array("idequipment"=>$Data["idequipment"]);
$d["description"]="Se ha ejecutado Borrado de backups ".$_SERVER["REMOTE_ADDR"];
$d["ideventtype"]=0;
//$d["description"]="";
$r = $db->insert_result_as_json($d);

}

return $r;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

print_r($_POST);

$result = "{}";


// report_validator
if (isset($_POST["PluginName"]) && isset($_POST["idequipment"]) && isset($_POST["report_validator"])) {


        switch ($_POST["PluginName"]) {
case "Ping":
//$result = $db->select_where_result_as_json(array(), array($_POST["udc_referential_field"]=>$_POST[$_POST["udc_referential_field"]]));
$result = Ping($_POST);
break;
case "Client":
$result = StartMachine($_POST);
//$result = $db->update_resutl_as_json($_POST, array($_POST["udc_referential_field"]=>$_POST[$_POST["udc_referential_field"]]), array("ts", "groups"));
break;
case "DeleteFiles":
$result = DeleteBackup($_POST);
break;
case "delete":
//$result = $db->select_result_as_json();
break;
case "delete_selection":
//$result = $db->delete_selection_result_as_json($_POST["udc_referential_field"], $_POST["udc_selected_id"]);
break;
default:

break;
}

}




echo $result;







?>
