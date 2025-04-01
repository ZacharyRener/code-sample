<?php
/**
 * Adds a new Zach category to the block categories.
 *
 * @package zach-blocks
 */

namespace Zach\Blocks\Editor;

/**
 * Block Category class.
 */
class Block_Category {

	/**
	 * Add filter and actions.
	 */
	public function __construct() {
		add_filter( 'block_categories_all', [ $this, 'block_categories_all' ], PHP_INT_MAX );
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ] );
	}

	/**
	 * Adding a custom block category.
	 *
	 * @param array $block_categories Array of categories for block types.
	 */
	public function block_categories_all( $block_categories ) {
		return array_merge(
			[
				[
					'slug'  => 'zach-blocks',
					'title' => esc_html__( 'Zach', 'zach-blocks' ),
					'icon'  => 'zach-blocks',
				],
			],
			$block_categories,
		);
	}

	/**
	 * Adds some CSS for the fake `zach-blocks` dashicon. This is instead of registering an actual SVG as the icon because there are no non-block javascript files being built.
	 *
	 * Fires after block assets have been enqueued for the editing interface.
	 *
	 * In the function call you supply, simply use `wp_enqueue_script` and
	 * `wp_enqueue_style` to add your functionality to the block editor.
	 */
	public static function enqueue_block_editor_assets() {
		// Using ob_start because the CSS has both double and single quotes.
		ob_start();
		?>
		.dashicons-zach-blocks {
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url("data:image/svg+xml,%3Csvg version='1.2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 81' width='150' height='81'%3E%3Ctitle%3ENew Project%3C/title%3E%3Cdefs%3E%3Cimage width='151' height='81' id='img1' href='data:image/png;base64,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'/%3E%3C/defs%3E%3Cstyle%3E%3C/style%3E%3Cuse id='zr.' href='%23img1' x='0' y='0'/%3E%3C/svg%3E");
			background-position: center;
		<?php
		$custom_css = ob_get_contents();
		ob_end_clean();
		wp_add_inline_style( 'wp-block-directory', $custom_css );
	}
}
