<?php
/**
 * Zach Blocks
 *
 * Plugin Name: Zach Blocks
 * Description: Blocks from Zach's Coding Sample
 * Version: 1.0.0
 * Author: Zach
 *
 * @package zach-blocks
 */

namespace Zach\Blocks;

const MAIN_FILE = __FILE__;
const MAIN_DIR  = __DIR__;

/**
 * Autoloader
 */
require MAIN_DIR . '/vendor/autoload.php';

define( 'ZACH_BLOCKS_DIR', plugin_dir_path( __FILE__ ) );
define( 'ZACH_BLOCKS_URL', plugin_dir_url( __FILE__ ) );

// Classes are included here.
new Core();
