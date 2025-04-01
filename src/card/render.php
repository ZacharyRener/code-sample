<?php
/**
 * Single Card block template.
 *
 * @package zach-blocks
 */

namespace ZACH\Blocks;

// Get the Post ID for this card from the attributes.
$card_post_id = (int) $attributes['postId'] > 0 ? (int) $attributes['postId'] : 0;

// If it is still 0, try getting it from the block's context.
if ( 0 === $card_post_id && isset( $block->context['postId'] ) ) {
	$card_post_id = (int) $block->context['postId'];
}
$args = [
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
	'classes'           => $attributes['className'] ?? '',
	'read-more-message' => $attributes['readMoreMessage'] ?? 'Learn More',
	'card-is-link'      => $attributes['cardIsLink'] ?? true,
	'link'              => $attributes['link'] ?? null,
	'hover-style'       => $attributes['hoverStyle'] ?? null,
];


// When there is no Post Type context (from a Query Loop block, for example),
// We can assume the content will be coming from innerBlocks.
if ( ! isset( $block->context['postType'] ) ) {
	$args['content'] = $content ?? '';
	// Ensure there is a className.
	if ( ! empty( $attributes['className'] ) ) {
		// Statistics card style.
		if ( str_contains( $attributes['className'], 'is-style-statistics' ) ) {
			// include the innerblocks content.
			get_template_part( 'template-parts/cards/card', 'statistics', $args );
			return;
		}
	}

	get_template_part( 'template-parts/cards/card', 'default', $args );
	return;
}


// When there is a Card Post ID, run a query for it.
$single_card_query = new \WP_Query(
	[
		'p'                   => $card_post_id,
		'post_type'           => $block->context['postType'],
		'ignore_sticky_posts' => true,
	]
);

if ( $single_card_query->have_posts() ) {
	while ( $single_card_query->have_posts() ) {
		$single_card_query->the_post();

		if ( ! empty( $attributes['className'] ) ) {
			// Newsletter card style.
			if ( str_contains( $attributes['className'], 'is-style-newsletter' ) ) {
				// include the innerblocks content.
				get_template_part( 'template-parts/cards/card', 'newsletter', $args );
				return;
			}
		}

		// Get template.
		get_template_part( 'template-parts/cards/card', null, $args );
	}
	wp_reset_postdata();
}
