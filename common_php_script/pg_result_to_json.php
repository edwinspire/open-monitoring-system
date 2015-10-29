<?php

function pg_result_to_json($result) {
    $arr = array();

    if (!$result) {
        //echo "PostgreSQL: Query an error occurred.\n";
    } else {
        $arrx = pg_fetch_all($result);
        if (is_array($arrx)) {
            $arr = $arrx;
        }
    }

    return json_encode($arr);
}

?>
