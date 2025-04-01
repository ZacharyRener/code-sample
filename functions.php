<?php
/**
 * Zach Code Sample
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

define( 'ZACH_BLOCKS_DIR', get_stylesheet_directory() );
define( 'ZACH_BLOCKS_URL', get_stylesheet_directory_uri() );

// Classes are included here.
new Core();
new \Zach\Blocks\CLI();

// Set up the slugs for each function file to include.
$functions = [
	'admin',
	'blocks',
	'colors',
	'menu',
	'patterns',
	'search',
	'setup',
	'styles',
];

// Include the function files.
foreach ( $functions as $function ) {
	require_once ZACH_BLOCKS_DIR . sprintf( '/inc/functions-%s.php', $function );
}
