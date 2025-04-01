<?php
/**
 * Default card template.
 *
 * This template can be invoked with
 * args that alter the output.
 *
 * @package zach-blocks
 */

namespace Zach\Blocks;

$args = $args ?? [];

$default_args = [
	'layout'            => 'default',
	'excerpt'           => 'show',
	'image_size'        => '16x9',
	'heading_tag'       => 'h2',
	'image'             => true,
	'category'          => false,
	'title'             => true,
	'date'              => 'show',
	'continue_reading'  => false,
	'author'            => true,
	'font_size'         => 'default',
	'classes'           => '',
	'max-lines-heading' => 2,
	'max-lines-excerpt' => 4,
	'read-more-message' => 'Learn More',
];

$args = wp_parse_args( $args, $default_args );


// Classes.
$classes = [
	'card',
	'card__layout-' . $args['layout'],
	$args['classes'],
];

if ( ! $args['image'] || ! has_post_thumbnail() ) {
	$classes[] = 'card__no-image';
} else {
	$classes[] = 'card__has-image';
}

if ( $args['excerpt'] ) {
	$classes[] = sprintf( 'card__has-excerpt-%s', $args['excerpt'] );
}

if ( $args['date'] ) {
	$classes[] = sprintf( 'card__has-date-%s', $args['date'] );
}

if ( $args['hover-style'] ) {
	// Hover Style.
	$classes[] = 'var(--wp--preset--color--light-yellow)' === $args['hover-style'] ? 'has-hover-style-yellow' : '';
}

// Card Image.
$card_figure = card_image(
	$args['image_size'] ?: '16x9',
	'card__image'
);

?>
<article class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>">
	<a href="<?php the_permalink(); ?>" class="card__link" aria-label="<?php the_title_attribute( [ 'echo' => true ] ); ?>"></a>
	<div class="card__inner">
		<?php if ( $args['image'] && has_post_thumbnail() && $card_figure ) : ?>
			<figure class="card__figure">
				<?php
				echo wp_kses_post( $card_figure );
				?>
			</figure>
		<?php endif; ?>
		<div class="card__content">
			<div class="card__content-top has-animation-zach-fade-in has-delay-0">
				<?php if ( $args['category'] ) : ?>
					<?php get_template_part( 'template-parts/cards/terms', '', $args ); ?>
				<?php endif; ?>
				<?php if ( $args['title'] ) : ?>
					<<?php echo esc_html( $args['heading_tag'] ); ?> class="has-<?php echo esc_attr( $args['font_size'] ); ?>-font-size card__title zach-content-truncated" data-max-lines="<?php echo absint( $args['max-lines-heading'] ); ?>">
						<?php the_title(); ?>
					</<?php echo esc_html( $args['heading_tag'] ); ?>>
				<?php endif; ?>
				<?php if ( 'show' === $args['date'] ) : ?>
					<span class="card__date">
						<?php echo esc_html( get_the_date() ); ?>
					</span>
				<?php endif; ?>
				<?php if ( 'show' === $args['excerpt'] ) : ?>
					<div class="card__excerpt zach-content-truncated" data-max-lines="<?php echo absint( $args['max-lines-excerpt'] ); ?>">
						<?php the_excerpt(); ?>
					</div>
				<?php endif; ?>
			</div>
			<div class="card__content-middle">
				<?php if ( 'hover' === $args['date'] ) : ?>
					<span class="card__date">
						<?php echo esc_html( get_the_date() ); ?>
					</span>
				<?php endif; ?>
				<?php if ( 'hover' === $args['excerpt'] ) : ?>
					<div class="card__excerpt zach-content-truncated" data-max-lines="<?php echo absint( $args['max-lines-excerpt'] ); ?>">
						<?php the_excerpt(); ?>
					</div>
				<?php endif; ?>
			</div>
			<?php if ( ( $args['continue_reading'] ) || $args['author'] ) : ?>
				<div class="card__content-bottom has-animation-zach-fade-in has-delay-100">
					<?php if ( $args['continue_reading'] ) : ?>
						<span class="card__continue-reading">
						<?php
						// Handle replacing the Read More message with a per-post string.
						$read_more_message = get_post_meta( get_the_ID(), 'zach_read_more_message', 'true' );

						if ( ! empty( $custom_read_more_message ) ) {
							// If there is a custom read more message.
							echo esc_html( $custom_read_more_message );
						} else {
							// Use the default read more message with a screen reader text of the post title.
							echo esc_html( $args['read-more-message'] );
							?>
							<span class="screen-reader-text"><?php the_title(); ?></span>
							<?php
						}
						?>
						</span><!-- .card__continue-reading -->
					<?php endif; ?>
					<?php if ( $args['author'] ) : ?>
						<span class="card__author">
							<?php echo get_avatar( get_the_author_meta( 'ID' ), 24 ); ?>
								<span>by <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>"><?php echo wp_kses_post( get_the_author_meta( 'display_name' ) ); ?></a></span>
						</span>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</article>
