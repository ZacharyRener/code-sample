<?php
/**
 * Layouts block template.
 *
 * @package zach-blocks
 *
 * $attributes (array): The block attributes.
 * $content (string): The block default content.
 * $block (WP_Block): The block instance.
 */

namespace Zach\Blocks;

global $zach_layout_posts_displayed, $zach_previous_layout_query;

if ( ! is_array( $zach_layout_posts_displayed ) ) {
	$zach_layout_posts_displayed = [];
}


$default_args = [
	'curationType'     => 'automatic',
	'numberPosts'      => get_option( 'posts_per_page' ),
	'postType'         => 'post',
	'order'            => 'desc',
	'orderBy'          => 'date',
	'curation'         => 'default',
	'term_id'          => 0,
	'excludeType'      => false,
	'exclude_term_id'  => 0,
	'layout'           => 'vertical',
	'loadMore'         => false,
	'pagination'       => false,
	'paginationStyle'  => 'numbered',
	'showAsCarousel'   => false,
	'excerptLineLimit' => 0,
];

$attributes = wp_parse_args( $attributes, $default_args );

$load_more = ! empty( $attributes['loadMore'] );

$pagination = ! empty( $attributes['pagination'] );

$curration_type = $attributes['curationType'] ?? 'automatic';

// The query type is only valid on archive pages.
if ( 'query' === $curration_type
&& is_singular() ) {
	$curration_type = 'automatic';
}

if ( 'automatic' === $curration_type ) {
	$args = [
		'posts'                  => [],
		'posts_per_page'         => $attributes['numberPosts'],
		'post_type'              => $attributes['postType'],
		'post_status'            => 'publish',
		'no_found_rows'          => true,
		'update_post_meta_cache' => false,
		'update_post_term_cache' => false,
		'order'                  => $attributes['order'],
		'orderby'                => $attributes['orderBy'],
		'paged'                  => $pagination ? $paged : 0,
	];

	$curration = $attributes['curation'];
	$term_id   = $attributes['term_id'];

	if ( 'default' !== $curration && $term_id ) {
		$args['tax_query'] = [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
			[
				'taxonomy' => $curration,
				'field'    => 'term_id',
				'terms'    => absint( $term_id ),
			],
		];
	} elseif ( ! empty( $zach_layout_posts_displayed ) ) {
			$args['post__not_in'] = $zach_layout_posts_displayed; // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_post__not_in
	}

	if ( ! empty( $attributes['skipDuplicatePosts'] ) ) {
		if ( ! empty( $zach_layout_posts_displayed ) ) {
			$args['post__not_in'] = $zach_layout_posts_displayed; // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_post__not_in
		}
	}

	if ( $attributes['excludeType'] && $attributes['exclude_term_id'] ) {
		if ( ! isset( $args['tax_query'] ) ) {
			$args['tax_query'] = []; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		} else {
			$args['tax_query']['relation'] = 'AND';
		}

		$args['tax_query'][] = [
			'taxonomy' => $attributes['excludeType'],
			'field'    => 'term_id',
			'terms'    => absint( $attributes['exclude_term_id'] ),
			'operator' => 'NOT IN',
		];
	}
} else {
	$args = [
		'post__in'               => $attributes['posts'],
		'posts_per_page'         => $attributes['numberPosts'] ?? get_option( 'posts_per_page' ),
		'post_type'              => $attributes['postType'] ?? 'post',
		'post_status'            => 'publish',
		'orderby'                => 'post__in',
		'ignore_sticky_posts'    => true,
		'no_found_rows'          => true,
		'update_post_meta_cache' => false,
		'update_post_term_cache' => false,
	];
}

if ( 'query' === $curration_type ) {
	global $wp_query;
	$query                     = $wp_query;
	$args                      = $wp_query->query_vars;
	$zach_previous_layout_query = $query;
} elseif ( 'previous' === $curration_type && is_a( $zach_previous_layout_query, 'WP_Query' ) ) {
	$query = $zach_previous_layout_query;
	$query->rewind_posts();
} else {
	$query = new \WP_Query( $args );

	$zach_previous_layout_query = $query;
}

$query_args = $args;

$layout = $attributes['layout'];

$slider = $attributes['showAsCarousel'];

$wrapper_classes = [ 'card__wrapper', sprintf( 'has-col-count-%d', $attributes['numberColumns'] ) ];

if ( $slider ) {
	$wrapper_classes = [ 'wp-block-zach-slider' ];
	$slider_classes  = [ 'zach-slider' ];

	if ( 'vertical' === $layout ) {
		$slider_classes[] = 'vertical';
	} else {
		$slider_classes[] = 'horizontal';
	}
}

if ( $query->have_posts() ) {
	$attributes['posts'] = $query->posts;
	$attributes['query'] = $query;

	switch ( $layout ) {
		case 'vertical':
		case 'vertical-light-inset':
			$args = [
				'orientation'       => 'vertical',
				'image'             => $attributes['showImage'],
				'title'             => $attributes['showTitle'],
				'category'          => $attributes['showCategory'],
				'excerpt'           => $attributes['showExcerpt'],
				'date'              => $attributes['showDate'],
				'continue_reading'  => $attributes['showContinueReading'],
				'author'            => $attributes['showAuthor'],
				'font_size'         => $attributes['fontSize'],
				'max-lines-heading' => $attributes['headingLineLimit'] > 0 ? $attributes['headingLineLimit'] : 0,
				'max-lines-excerpt' => $attributes['excerptLineLimit'] > 0 ? $attributes['excerptLineLimit'] : 0,
				'classes'           => $attributes['className'] ?? [],
				'read-more-message' => $attributes['readMoreMessage'] ?? '',
				'hover-style'       => $attributes['hoverStyle'] ?? null,
			];
			break;
		default:
			$args = [
				'orientation'       => 'horizontal',
				'image'             => $attributes['showImage'],
				'title'             => $attributes['showTitle'],
				'category'          => $attributes['showCategory'],
				'date'              => $attributes['showDate'],
				'excerpt'           => $attributes['showExcerpt'],
				'continue_reading'  => $attributes['showContinueReading'],
				'author'            => $attributes['showAuthor'],
				'font_size'         => $attributes['fontSize'],
				'max-lines-heading' => $attributes['headingLineLimit'] > 0 ? $attributes['headingLineLimit'] : 0,
				'max-lines-excerpt' => $attributes['excerptLineLimit'] > 0 ? $attributes['excerptLineLimit'] : 0,
				'classes'           => $attributes['className'] ?? [],
				'read-more-message' => $attributes['readMoreMessage'] ?? '',
				'hover-style'       => $attributes['hoverStyle'] ?? null,
			];
	}
	// Add logic to set classes, image size, etc.
	$args['layout'] = $layout;

	// Classes.
	$args['classes'] = implode(
		' ',
		[
			'card',
			'is-style-' . $args['orientation'],
			'card__layout-' . $args['layout'],
			( true === $args['continue_reading'] && '' === $args['read-more-message'] ) ? 'read-more-arrow-only' : '', // Check if Continue Reading is true && Read More Message is empty.
			(string) $args['classes'],
		]
	);

	$data = [
		'card_args'  => $args,
		'query_args' => $query_args,
		'pagination' => $pagination ?? false,
	];

	// For some reason the blockGap is not coming through using get_block_wrapper_attributes, so this manually adds it in.
	$gap = $attributes['style']['spacing']['blockGap'] ?? null;
	// Skip if gap value contains unsupported characters.
	// Regex for CSS value borrowed from `safecss_filter_attr`, and used here because we only want to match against the value, not the CSS attribute.
	if ( is_string( $gap ) ) {
		// Make sure $gap is a string to avoid PHP 8.1 deprecation error in preg_match() when the value is null.
		$gap = is_string( $gap ) ? $gap : '';
		$gap = $gap && preg_match( '%[\\\(&=}]|/\*%', $gap ) ? null : $gap;

		// Get spacing CSS variable from preset value if provided.
		if ( is_string( $gap ) && str_contains( $gap, 'var:preset|spacing|' ) ) {
			$index_to_splice = strrpos( $gap, '|' ) + 1;
			$slug            = _wp_to_kebab_case( substr( $gap, $index_to_splice ) );
			$gap             = "var(--wp--preset--spacing--$slug)";

			// Add the gap to the block wrapper attributes array.
			$block_wrapper_attributes_style = sprintf( '--block-gap: %s;', $gap );
		}
	}

	// Block Wrapper Attributes.
	$block_wrapper_attributes = get_block_wrapper_attributes(
		[
			'class' => implode( ' ', $wrapper_classes ),
			'style' => $block_wrapper_attributes_style ?? '',
		]
	);

	?>
		<div <?php echo wp_kses_data( $block_wrapper_attributes ); ?> <?php
		if ( $load_more ) :
			?>
			data-args='<?php echo wp_json_encode( $data ); ?>'<?php endif; ?>>
		<?php if ( $slider ) : ?>
			<div class="<?php echo esc_attr( implode( ' ', $slider_classes ) ); ?>">
		<?php endif; ?>
		<?php
		while ( $query->have_posts() ) {
			$query->the_post();

			if ( ! in_array( get_the_ID(), $zach_layout_posts_displayed, true ) ) {
				$zach_layout_posts_displayed[] = get_the_ID();
			}

			// Get template.
			get_template_part( 'template-parts/cards/card', $layout, $args );
		}
		?>
		<?php if ( $slider ) : ?>
			</div>
		<?php endif; ?>
		</div>
	<?php
	$query->rewind_posts();
	wp_reset_postdata();

	if ( $load_more ) {
		$data = [
			'query_args' => $query_args,
			'card_args'  => $args,
		];

		?>
		<div class="is-content-justification-center is-layout-flex wp-block-buttons" style="margin-top:var(--wp--preset--spacing--40)">
			<div class="wp-block-button">
				<button class="wp-block-button__link wp-element-button zach-load-more-button" data-args='<?php echo wp_json_encode( $data ); ?>'>
					<?php esc_html_e( 'Load More', 'zach-blocks' ); ?>
				</button>
			</div>
		</div>
		<?php
	}
	if ( $pagination ) {
		$data = [
			'query_args' => $query_args,
			'card_args'  => $args,
		];
		?>
		<div class="pagination__wrapper alignwide <?php echo esc_attr( $attributes['paginationStyle'] ); ?>">
			<?php
			if ( 'previous-next' === $attributes['paginationStyle'] ) {
				previous_posts_link();
				next_posts_link();
			} else {
				the_posts_pagination(
					array(
						'mid_size'  => 2,
						'prev_text' => __( '&laquo;', 'zach-blocks' ),
						'next_text' => __( '&raquo;', 'zach-blocks' ),
					)
				);
			}
			?>
		</div>
		<?php
	}
}
