<?php
session_start();

include "config.php";
include "DatabasePDO/DatabasePDO.php";
$db = new DatabasePDO(DB_HOST, DB_USER, DB_PASS, DB_NAME);

?>