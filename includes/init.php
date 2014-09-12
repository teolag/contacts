<?php
session_start();

include "config.php";
include "/var/www/xioCodeBeta2/classes/DatabasePDO/DatabasePDO.php";
$db = new DatabasePDO(DB_HOST, DB_USER, DB_PASS, DB_NAME);

?>