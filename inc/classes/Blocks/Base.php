<?php
/**
 * Base class for Zach server side render blocks.
 *
 * @package zach-blocks
 */

namespace Zach\Blocks\Blocks;

/**
 * Define the base class and associated methods.
 */
abstract class Base {

	/**
	 * Block namespace. The default is zach.
	 *
	 * @var string
	 */
	protected $namespace = 'zach';

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $name;

	/**
	 * Use the render function. Default is false.
	 *
	 * @var bool
	 */
	public $use_render_function = false;

	/**
	 * Run the class.
	 *
	 * Called during init hook.
	 *
	 * @return void
	 */
	public function __construct() {
		add_filter( "render_block_{$this->namespace}/{$this->name}", [ $this, 'render_block' ], 10, 2 );
	}

	/**
	 * Add additional data to the $attributes array passed down to templates. This function has the ability to override data originally set in set_attributes.
	 *
	 * @param array $attributes Full list of current attributes.
	 */
	protected function set_additional_data( $attributes ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.Found
		return [];
	}

	/**
	 * Filters the content of a single block.
	 *
	 * If there is a render file defined in block.json, it would be the default $block_content.
	 *
	 * @param string $block_content The block content.
	 * @param array  $block         The full block, including name and attributes.
	 *
	 * @return string
	 */
	public function render_block( $block_content, $block ) {
		$attributes = $block['attrs'];

		ob_start();

		do_action( "zach_block_editor_block_before_render_{$this->name}" );

		if ( ! is_admin() ) {
			$this->load_scripts_and_styles( $attributes );
		}

		// Check the child theme for an override.
		$template_loaded = get_template_part( 'template-parts/blocks/' . $this->name, '', $block['attrs'] );

		do_action( "zach_block_editor_block_after_render_{$this->name}" );

		$html = ob_get_clean();

		// If a template returns with some HTML, then that will override the block content.
		if ( false !== $template_loaded && ! empty( $html ) ) {
			$block_content = $html;
		}

		// Return block content.
		return $block_content;
	}


	/**
	 * Loads the scripts and styles for a block.
	 *
	 * Must be extended by child class.
	 *
	 * @param  array $attributes The block attributes.
	 * @return void
	 */
	protected function load_scripts_and_styles( array $attributes ): void {}
}
