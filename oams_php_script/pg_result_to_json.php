<?php

function pg_result_to_json($result) {
    $arr = array();

    if (!$result) {
        echo pg_last_error($result);
        echo pg_result_error($result);
    } else {
        $arrx = pg_fetch_all($result);
        if (is_array($arrx)) {
            $arr = $arrx;
        }
    }

    return json_encode($arr);
}

?>
