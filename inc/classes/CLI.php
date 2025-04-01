<?php
/**
 * Registers CLI command for adding sample content
 *
 * @package ZachBlocks
 */

namespace Zach\Blocks;

class CLI {

	/**
	 * Constructor, registers the command for inserting sample data / content
	 */
	public function __construct() {
		if ( class_exists( '\WP_CLI' ) ) {
			\WP_CLI::add_command( 'zach-insert-posts', [ __CLASS__, 'cli_add_sample_data' ] );
		}
	}

	/**
	 * Adds homepage & the sample posts from posts.json
	 *
	 *     $ wp zach-insert-posts
	 *
	 * @throws \Exception Exception for failing to retrieve posts.json
	 *
	 * @return void
	 */
	public function cli_add_sample_data(): void {
		$data = wp_json_file_decode( MAIN_DIR . '/assets/posts.json', [ 'associative' => true ] );

		if ( null === $data ) {
			\WP_CLI::error( 'Couldn\'t locate posts.json.' );
			return;
		}

		ob_start();
		include( __DIR__ . '/../../patterns/page-pattern-hompage-variant-1.php' );
		$homepage_content = ob_get_clean();

		\WP_CLI::log(
			sprintf( 'Adding and configuring homepage' )
		);

		$home_page_id = wp_insert_post(
			[
				'post_title'   => 'Homepage',
				'post_content' => $homepage_content,
				'post_type'    => 'page',
				'post_status'  => 'publish',
			]
		);

		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $home_page_id );

		foreach ( $data as $post_object ) {
			if ( ! isset( $post_object['title'] ) || empty( $post_object['content'] ) || empty( $post_object['excerpt'] ) ) {
				continue;
			}

			\WP_CLI::log(
				sprintf( 'Adding post: %s', $post_object['title'] )
			);

			$post_id = wp_insert_post(
				[
					'post_title'   => $post_object['title'],
					'post_status'  => 'publish',
					'post_excerpt' => $post_object['excerpt'],
					'post_content' => sprintf(
						'<p>%s</p>',
						$post_object['content'],
					),
				]
			);

			if ( ! empty( $post_object['featured_image_url'] ) ) {
				$attachment_id = $this->download_and_attach_image( $post_object['featured_image_url'], $post_id );

				if ( $attachment_id ) {
					set_post_thumbnail( $post_id, $attachment_id );
				} else {
					\WP_CLI::warning( sprintf( 'No featured image added for: %s', $post_object['title'] ) );
				}
			}
		}
	}

	/**
	 * Download an image from a URL and attach it to a post as the featured image.
	 *
	 * @param string $image_url The URL of the image.
	 * @param int    $post_id   The post ID to attach the image to.
	 *
	 * @return int|false Attachment ID on success, false on failure.
	 */
	private function download_and_attach_image( string $image_url, int $post_id ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		// Download the file into the WP temp directory.
		$tmp = download_url( $image_url );

		if ( is_wp_error( $tmp ) ) {
			\WP_CLI::warning( sprintf( 'Could not download image: %s', $image_url ) );
			return false;
		}

		$file_array = [
			'name'     => basename( $image_url ),
			'tmp_name' => $tmp,
		];

		// Upload the file.
		$attachment_id = media_handle_sideload( $file_array, $post_id );

		// Check for errors.
		if ( is_wp_error( $attachment_id ) ) {
			\WP_CLI::warning( sprintf( 'Could not attach image: %s', $attachment_id->get_error_message() ) );
			@unlink( $file_array['tmp_name'] ); // Clean up the temp file.
			return false;
		}

		return $attachment_id;
	}
}
