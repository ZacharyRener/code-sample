<?php
/**
 * The core Zach blocks class.
 *
 * @package zach-blocks
 */

namespace Zach\Blocks;

/**
 * Initialize all other classes here.
 */
class Core {
	/**
	 * The classes or callables.
	 *
	 * Provide fully qualified classes or callbacks
	 * to instantiate the various objects for
	 * the utilities.
	 *
	 * @var array
	 */
	private $classes = [
		// Editor.
		'\Zach\Blocks\Editor\Block_Category',
		// REST.
		'\Zach\Blocks\REST\Load_More',
		'\Zach\Blocks\REST\Post_Select',
		// Blocks.
		'\Zach\Blocks\Blocks\Gallery',
		'\Zach\Blocks\Blocks\Layouts',
		'\Zach\Blocks\Blocks\Mega_Menu',
		'\Zach\Blocks\Blocks\Animation',
	];

	/**
	 * Files that should be loaded.
	 *
	 * @var array
	 */
	private $files = [
		'inc/helpers.php',
	];

	/**
	 * Calls the classes callbacks and initializes the objects.
	 */
	public function __construct() {
		$this->init_classes();
		$this->require_files();
		add_action( 'init', [ $this, 'register_block_types' ] );
	}

	/**
	 * Initialize the classes.
	 *
	 * @return void
	 */
	private function init_classes() {
		/**
		 * Allow filtering the classes.
		 *
		 * @param array $classes The classes or callables.
		 */
		$classes = apply_filters( 'zach_blocks_classes', $this->classes );

		foreach ( $classes as $class ) {
			if ( is_callable( $class ) ) {
				call_user_func( $class );
			} elseif ( class_exists( $class ) ) {
				$obj = new $class();

				if ( method_exists( $obj, 'run' ) ) {
					$obj->run();
				}
			}
		}
	}

	/**
	 * Require the files.
	 *
	 * @return void
	 */
	private function require_files() {
		/**
		 * Allow filtering the files.
		 *
		 * @param array $files The files.
		 */
		$files = apply_filters( 'zach_blocks_files', $this->files );

		foreach ( $files as $file ) {
			$file_path = trailingslashit( ZACH_BLOCKS_DIR ) . $file;

			if ( file_exists( $file_path ) ) {
				require_once $file_path;
			}
		}
	}


	/**
	 * Registers the block using the metadata loaded from the `block.json` file.
	 * Behind the scenes, it registers also all assets so they can be enqueued
	 * through the block editor in the corresponding context.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	public function register_block_types() {
		// Define the blocks.
		// Use glob with GLOB_ONLYDIR to get only directories.
		$blocks = glob( ZACH_BLOCKS_DIR . '/build/*', GLOB_ONLYDIR );

		// Register each block.
		foreach ( $blocks as $block ) {
			/**
			 * Filter the registration arguments in PHP.
			 * Really only useful for assigning a `render_callback` function.
			 *
			 * @param array $args The registration arguments.
			 */
			$args = (array) apply_filters( sprintf( 'zach_blocks_register_block_type_args_%s', basename( $block ) ), [] );

			$block_directory = ZACH_BLOCKS_DIR . sprintf( '/build/%s/', basename( $block ) );

			register_block_type( $block_directory );
		}
	}
}
