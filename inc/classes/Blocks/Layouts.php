<?php
/**
 * Extends the Post Layouts block.
 *
 * @package zach-blocks
 */

namespace Zach\Blocks\Blocks;

/**
 * Extends the Post Layouts block.
 */
class Layouts extends Base {

	/**
	 * The scripts that have been loaded once.
	 *
	 * @var array
	 */
	private array $loaded_scripts = [];

	/**
	 * Block name. This must match the "zach/*" name given in block.json.
	 *
	 * @var string
	 */
	protected $name = 'layouts';

	/**
	 * Use the render function.
	 *
	 * @var bool
	 */
	public $use_render_function = true;

	/**
	 * Loads the scripts and styles for a block.
	 *
	 * @param  array $attributes The block attributes.
	 * @return void
	 */
	protected function load_scripts_and_styles( array $attributes ): void {
		// The front end view script handle.
		$view_script_handle = sprintf( '%s-%s-view-script', $this->namespace, $this->name );

		// Dequeue the front end view script.
		// Below we are going to enqueue only what we need.
		wp_dequeue_script( $view_script_handle );

		// Enqueue scripts.
		$scripts = [];

		$layout = $attributes['layout'] ?? 'vertical';

		switch ( $layout ) {
			case 'horizontal':
				break;
			case 'cta-card':
				break;
			case 'vertical-tabs':
				$scripts[] = 'layout-vertical-tabs';
				break;
			default:
				break;
		}

		if ( ! empty( $attributes['loadMore'] ) ) {
			$scripts[] = 'load-more';
		}

		$load_scripts = array_diff( $scripts, $this->loaded_scripts );

		$this->loaded_scripts = array_merge( $this->loaded_scripts, $load_scripts );


		foreach ( $load_scripts as $script ) {
			$file = ZACH_BLOCKS_DIR . '/build/layouts/scripts/' . $script . '/index.js';
			$url  = ZACH_BLOCKS_URL . '/build/layouts/scripts/' . $script . '/index.js';

			if ( file_exists( $file ) ) {
				wp_enqueue_script(
					'zach-blocks-layout-' . $script,
					$url,
					[],
					filemtime( $file ),
					true
				);

				if ( 'load-more' === $script ) {
					wp_add_inline_script( 'zach-blocks-layout-' . $script, 'const ZachrestLoadMoreURL = ' . wp_json_encode( get_rest_url( null, '/zach-blocks/v1/load-more/' ) ) . ';', 'before' );
				}
			}
		}
	}
}
