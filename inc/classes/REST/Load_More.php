<?php
/**
 * The Load More endpoint for the REST API.
 *
 * @package zach-blocks
 */

namespace Zach\Blocks\REST;

use WP_Error;
use WP_Query;

/**
 * Create Load More endpoint.
 */
class Load_More {
	/**
	 * The namespace part.
	 *
	 * @var string
	 */
	private string $namespace = 'zach-blocks';
	/**
	 * The version part.
	 *
	 * @var string
	 */
	private string $version = 'v1';

	/**
	 * Add the actions.
	 */
	public function __construct() {
		add_action( 'rest_api_init', [ $this, 'init' ] );
	}

	/**
	 * Rest API Init callback.
	 *
	 * Registers the route.
	 *
	 * @return void
	 */
	public function init() {
		register_rest_route(
			$this->get_namespace(),
			'/load-more',
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'callback' ],
				'permission_callback' => '__return_true',
			]
		);
	}

	/**
	 * Gets the full namespace from the parts.
	 *
	 * @return string
	 */
	private function get_namespace() {
		return sprintf( '%1$s/%2$s', $this->namespace, $this->version );
	}

	/**
	 * The callback
	 *
	 * @param \WP_REST_Request $req The request object.
	 *
	 * @return mixed array|WP_Error
	 */
	public function callback( $req ) {
		$params       = json_decode( $req->get_body_params()['json'], true );
		$query_params = $req->get_query_params();

		$query_args = $params['query_args'] ?? [];

		if ( empty( $query_args ) ) {
			return new WP_Error( 'no_query_args', __( 'Query args are required', 'zach-blocks' ) );
		}

		$card_args = $params['card_args'] ?? [];

		if ( empty( $card_args ) ) {
			return new WP_Error( 'no_card_args', __( 'Card args are required', 'zach-blocks' ) );
		}

		$page = $query_params['paged'] ?? 0;

		if ( empty( $page ) ) {
			return new WP_Error( 'page', __( 'Page is required', 'zach-blocks' ) );
		}

		$query_args['paged'] = $page;

		$posts = new WP_Query( $query_args );

		$results = [ 'body' => '' ];

		if ( $posts->have_posts() ) {
			ob_start();

			while ( $posts->have_posts() ) {
				$posts->the_post();
				\Zach\Blocks\get_template_part( 'template-parts/cards/card', get_post_type(), $card_args );
			}

			$results['body'] = ob_get_clean();

			return $results;
		}

		return $results;
	}
}
