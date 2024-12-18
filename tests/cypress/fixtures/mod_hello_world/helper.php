<?php
defined('_JEXEC') or die;

class ModHelloWorldHelper
{
    public static function getHelloMessage($params)
    {
        return JText::_('MOD_HELLO_WORLD_HELLO_WORLD');
    }
}
