<?php
$custom = array();
$path = "lib/custom/";
$ficheros1  = scandir($path);
foreach($ficheros1 as $dir){
$p = $path.$dir;
if(is_dir ($p) && strpos($p,'.') === false){
array_push($custom, "{'name':'".$dir."','location':'../../custom/".$dir."'}"."\n");
//{'name':'woams_event_comment_view','location':'../../custom/woams_event_comment_view'}
}
}
echo "<script type=\"text/javascript\" src=\"lib/dojo/dojo/dojo.js\" 
data-dojo-config=\"'parseOnLoad':true,'async':true,'packages':[
{'name':'bootstrap','location':'../bootstrap'}
,{'name':'gridx','location':'../gridx'}
,{'name':'widgets','location':'../../custom'}
,".implode(",", $custom)."]\"></script>";
?> 
