<?php

session_start();
unset($_SESSION['token']);
unset($_SESSION['googleId']);
header("Location: ../index.php");




?>