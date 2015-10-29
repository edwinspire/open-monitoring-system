<?php

function pg_result_to_csv($result) {
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

    return arrayToCsv($arr);
}

function arrayToCsv(array &$fields, $delimiter = ';', $enclosure = '"', $encloseAll = false, $nullToMysqlNull = false) {
    $delimiter_esc = preg_quote($delimiter, '/');
    $enclosure_esc = preg_quote($enclosure, '/');

    $output = array();
    foreach ($fields as $field) {
        if ($field === null && $nullToMysqlNull) {
            $output[] = 'NULL';
            continue;
        }

        // Enclose fields containing $delimiter, $enclosure or whitespace
        if ($encloseAll || preg_match("/(?:${delimiter_esc}|${enclosure_esc}|\s)/", $field)) {
            $output[] = $enclosure . str_replace($enclosure, $enclosure . $enclosure, $field) . $enclosure;
        } else {
            $output[] = $field;
        }
    }

    return implode($delimiter, $output);
}

?>
