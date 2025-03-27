<?php
/**
 * Extends the Animation block.
 *
 * @package zach-blocks
 */

namespace Zach\Blocks\Blocks;

/**
 * Extends the Animation block.
 */
class Animation {

	/**
	 * Run the class.
	 *
	 * Called during init hook.
	 *
	 * @return void
	 */
	public function __construct() {
		if ( ! is_admin() ) {
			add_action( 'wp_enqueue_scripts', [ $this, 'load_scripts_and_styles' ] );
		}
	}


	/**
	 * Loads the scripts and styles for a block.
	 *
	 * @return void
	 */
	public function load_scripts_and_styles(): void {
		wp_enqueue_style( 'aos', get_stylesheet_directory_uri() . '/assets/aos.css' );
	}

}
