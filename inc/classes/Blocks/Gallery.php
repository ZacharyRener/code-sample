<?php
/**
 * Extends the Gallery block.
 *
 * @package zach-blocks
 */

namespace Zach\Blocks\Blocks;

/**
 * Extends the Gallery block.
 */
class Gallery {

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

		$asset_file = ZACH_BLOCKS_DIR . 'build/core-gallery/index.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = include $asset_file;

		// Dequeue the front end view script.
		$script_file = ZACH_BLOCKS_DIR . 'build/core-gallery/index.js';

		$script_url = ZACH_BLOCKS_URL . 'build/core-gallery/index.js';

		$style_url = ZACH_BLOCKS_URL . 'build/core-gallery/style-index.css';


		if ( file_exists( $script_file ) ) {
			wp_enqueue_script(
				'zach-blocks-gallery',
				$script_url,
				$asset['dependencies'],
				$asset['version'],
				[
					'in_footer' => true,
				]
			);

			wp_enqueue_style(
				'zach-blocks-gallery',
				$style_url,
				[],
				$asset['version']
			);
		}
	}
}
