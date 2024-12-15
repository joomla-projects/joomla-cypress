<?php
defined('_JEXEC') or die;

require_once __DIR__ . '/helper.php';

// Get parameters from helper and render
$helloMessage = ModHelloWorldHelper::getHelloMessage($params);

// Display the output
echo '<div>' . htmlspecialchars($helloMessage) . '</div>';
