<?php
/**
 * Newsletter card template.
 *
 * This template can be invoked with
 * args that alter the output.
 *
 * @package zach-blocks
 */

namespace Zach\Blocks;

$args = $args ?? [];

$default_args = [
	'layout'            => 'newsletter',
	'excerpt'           => 'show',
	'image_size'        => '16x9',
	'heading_tag'       => 'h2',
	'image'             => true,
	'category'          => false,
	'title'             => true,
	'date'              => 'hide',
	'continue_reading'  => true,
	'author'            => false,
	'font_size'         => 'default',
	'classes'           => '',
	'max-lines-heading' => 2,
	'max-lines-excerpt' => 4,
	'read-more-message' => 'Read this Issue',
];

$args = wp_parse_args( $args, $default_args );

// Classes.
$classes = [
	'card',
	'newsletter-card',
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

// Render the date element on 'show' or 'hover'. Not on 'hide'.
$render_date = in_array( $args['date'], [ 'show', 'hover' ] );

// Render the excerpt element on 'show' or 'hover'. Not on 'hide'.
$render_excerpt = true;

// Card Image.
$card_figure = card_image(
	$args['image_size'] ?: '16x9',
	'card__image'
);

$issue_date      = get_post_meta( get_the_ID(), 'newsletter_issue_date', true ) ?: get_the_title();
$selected_colors = get_post_meta( get_the_ID(), 'path_ribbon_color', true );

?>
<article class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>">
	<a href="<?php the_permalink(); ?>" class="card__link" aria-label="<?php the_title_attribute( [ 'echo' => true ] ); ?>"></a>
	<div class="card__inner">
		<!-- newsletter header -->
		<div class="wp-block-group compass-header">
		<p class="has-text-align-right newsletter-issue-date has-black-color has-yellow-background-color has-text-color has-background has-link-color"><?php echo wp_kses_post( $issue_date ); ?></p>
		<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQyIiBoZWlnaHQ9IjExOSIgdmlld0JveD0iMCAwIDM0MiAxMTkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xMDU4XzEyNjcwKSI+CjxwYXRoIGQ9Ik02OS41NzUgMTQuMzJINzUuNzU1VjcuNTZMODEuODc1IDMuNThWMTQuMzJIOTAuNTk1VjE5LjkySDgxLjg3NVYzNS4yOEM4MS44NzUgMzguNjkgODMuNTQ1IDQwLjE5IDg1Ljk3NSA0MC4xOUM4Ny4xODUgNDAuMTkgODguMTY1IDM5Ljg0IDg5LjE1NSAzOC45OEw5Mi4xMDQ5IDQ0LjE4QzkwLjMxNDkgNDUuMzkgODguMTI1IDQ2LjA5IDg1LjUyNSA0Ni4wOUM3OS4zNDUgNDYuMDkgNzUuNzY1IDQzLjAzIDc1Ljc2NSAzNS4zNVYxOS45M0g2OS41ODVWMTQuMzNMNjkuNTc1IDE0LjMyWk05NS4yNjUgMEgxMDEuNDQ1VjE4LjQ4QzEwMy42MzUgMTUuNTkgMTA3LjEwNSAxMy42OSAxMTEuMzE1IDEzLjY5QzExOS4yMjUgMTMuNjkgMTI0LjEzNSAxOC44OSAxMjQuMTM1IDI3LjQzVjQ1LjVIMTE3Ljc4NVYyNy44OUMxMTcuNzg1IDIyLjU4IDExNS4xMjUgMTkuMTcgMTA5LjgxNSAxOS4xN0MxMDUuMTM1IDE5LjE3IDEwMS41MDUgMjIuNjkgMTAxLjUwNSAyOC4yOVY0NS41SDk1LjI2NVYwWk0xMjcuMjM1IDMwLjAzQzEyNy4yMzUgMjAuODUgMTM0LjI3NSAxMy42OSAxNDMuNDY1IDEzLjY5QzE1Mi42NTUgMTMuNjkgMTU5LjQ1NSAyMC4zOSAxNTkuNDU1IDI5LjYzVjMyLjIzSDEzMy4yNDVDMTM0LjE2NSAzNy4yNSAxMzguMDk1IDQwLjYgMTQzLjgxNSA0MC42QzE0OC4yMDUgNDAuNiAxNTEuMDk1IDM4LjU4IDE1Mi45MzUgMzUuNThMMTU4LjA3NSAzOC42NEMxNTUuMDc1IDQzLjE0IDE1MC41NjUgNDYuMTUgMTQzLjgxNSA0Ni4xNUMxMzMuODg1IDQ2LjE1IDEyNy4yNDUgMzkuMTEgMTI3LjI0NSAzMC4wNEwxMjcuMjM1IDMwLjAzWk0xMzMuNDc1IDI2LjkxSDE1My4xNjVDMTUyLjI0NSAyMiAxNDguNjA1IDE5LjE3IDE0My40NjUgMTkuMTdDMTM4LjMyNSAxOS4xNyAxMzQuNjg1IDIyLjQgMTMzLjQ3NSAyNi45MVoiIGZpbGw9IiM0RDRENEYiLz4KPHBhdGggZD0iTTAuMTU1MDIgNzMuNzk5OUMwLjE1NTAyIDU3LjU0OTkgMTIuODI1IDQ1LjE4OTkgMjguNzY1IDQ1LjE4OTlDMzkuMjk1IDQ1LjE4OTkgNDguNDQ1IDUwLjgzOTkgNTMuNDA1IDU5LjIyOTlMNDYuMTU1IDYzLjcyOTlDNDIuNzI1IDU3LjMxOTkgMzYuNjE1IDUzLjE5OTkgMjguNzU1IDUzLjE5OTlDMTcuMTU1IDUzLjE5OTkgOC40NTUwMiA2Mi4zNTk5IDguNDU1MDIgNzMuNzk5OUM4LjQ1NTAyIDg1LjIzOTkgMTcuMTU1IDk0LjI0OTkgMjguNjc1IDk0LjI0OTlDMzcuMjk1IDk0LjI0OTkgNDMuNDc1IDg5LjUxOTkgNDYuNjg1IDgyLjgwOTlMNTQuMTY1IDg2Ljc3OTlDNDkuMzU1IDk2LjA4OTkgNDAuMTI1IDEwMi40MiAyOC43NTUgMTAyLjQyQzEyLjI3NSAxMDIuNDIgMC4xNDUwMiA4OS41OTk5IDAuMTQ1MDIgNzMuODA5OUwwLjE1NTAyIDczLjc5OTlaTTU4LjQ1NSA4MS4wNDk5QzU4LjQ1NSA2OS4xNDk5IDY3Ljk5NSA1OS42MDk5IDc5Ljg5NSA1OS42MDk5QzkxLjc5NSA1OS42MDk5IDEwMS4zMzUgNjkuMTQ5OSAxMDEuMzM1IDgxLjA0OTlDMTAxLjMzNSA5Mi45NDk5IDkxLjc5NSAxMDIuNDkgNzkuODk1IDEwMi40OUM2Ny45OTUgMTAyLjQ5IDU4LjQ1NSA5Mi45NDk5IDU4LjQ1NSA4MS4wNDk5Wk05My4xNjUgODEuMDQ5OUM5My4xNjUgNzMuNDE5OSA4Ny4yODUgNjcuMzE5OSA3OS44ODUgNjcuMzE5OUM3Mi40ODUgNjcuMzE5OSA2Ni42ODUgNzMuNDE5OSA2Ni42ODUgODEuMDQ5OUM2Ni42ODUgODguNjc5OSA3Mi40MDUgOTQuNzc5OSA3OS44ODUgOTQuNzc5OUM4Ny4zNjUgOTQuNzc5OSA5My4xNjUgODguNjc5OSA5My4xNjUgODEuMDQ5OVpNMTA3LjgyNSA2MC40NDk5SDExNS45ODVWNjUuMTc5OUMxMTguNTA1IDYxLjc0OTkgMTIyLjM5NSA1OS42MDk5IDEyNy42NTUgNTkuNjA5OUMxMzQuMjE1IDU5LjYwOTkgMTM4LjU2NSA2Mi4zNTk5IDE0MC43NzUgNjYuODU5OUMxNDMuMzY1IDYyLjUwOTkgMTQ4LjEwNSA1OS42MDk5IDE1NC4yMDUgNTkuNjA5OUMxNjUuNDk1IDU5LjYwOTkgMTcwLjc2NSA2Ni4zOTk5IDE3MC43NjUgNzcuMDA5OVYxMDEuNjVIMTYyLjI5NVY3Ny40NTk5QzE2Mi4yOTUgNzEuMDQ5OSAxNTkuNDc1IDY2Ljg0OTkgMTUyLjk4NSA2Ni44NDk5QzE0Ny4xMDUgNjYuODQ5OSAxNDMuMjk1IDcwLjY1OTkgMTQzLjI5NSA3OC4yMTk5VjEwMS42NEgxMzQuOTc1Vjc2LjkxOTlDMTM0Ljk3NSA3MC42NTk5IDEzMi4xNTUgNjYuODQ5OSAxMjUuODk1IDY2Ljg0OTlDMTE5LjYzNSA2Ni44NDk5IDExNi4wNTUgNzAuODE5OSAxMTYuMDU1IDc4LjU5OTlWMTAxLjY0SDEwNy44MTVWNjAuNDM5OUwxMDcuODI1IDYwLjQ0OTlaTTE4Ni42NDUgOTYuMTU5OVYxMTguMTNIMTc4LjYzNVY2MC40NDk5SDE4Ni42NDVWNjYuNTQ5OUMxODkuNzc1IDYyLjI3OTkgMTk1LjE5NSA1OS42MDk5IDIwMC44MzUgNTkuNjA5OUMyMTEuNzQ1IDU5LjYwOTkgMjIxLjQzNSA2OC4wNzk5IDIyMS40MzUgODEuMDQ5OUMyMjEuNDM1IDk0LjAxOTkgMjExLjUxNSAxMDIuNDkgMjAwLjgzNSAxMDIuNDlDMTk1LjAzNSAxMDIuNDkgMTg5LjY5NSAxMDAuMjggMTg2LjY0NSA5Ni4xNTk5Wk0yMTMuMTk1IDgwLjk3OTlDMjEzLjE5NSA3My4xOTk5IDIwNy4zMjUgNjcuMDg5OSAxOTkuNjk1IDY3LjA4OTlDMTkyLjA2NSA2Ny4wODk5IDE4Ni4xMTUgNzMuMzQ5OSAxODYuMTE1IDgwLjk3OTlDMTg2LjExNSA4OC42MDk5IDE5MS45MTUgOTQuOTM5OSAxOTkuNjk1IDk0LjkzOTlDMjA3LjQ3NSA5NC45Mzk5IDIxMy4xOTUgODguNzU5OSAyMTMuMTk1IDgwLjk3OTlaTTIyNS45NDUgOTAuMjc5OUMyMjUuOTQ1IDgxLjgwOTkgMjMyLjk2NSA3Ni42MTk5IDI0NC40ODUgNzYuNjE5OUgyNTYuNjk1Vjc1LjkyOTlDMjU2LjY5NSA3MC40Mzk5IDI1My4zMzUgNjYuNjE5OSAyNDYuMDE1IDY2LjYxOTlDMjQwLjU5NSA2Ni42MTk5IDIzNi41NTUgNjkuMjA5OSAyMzQuMTg1IDczLjI1OTlMMjI2Ljg2NSA2OC45ODk5QzIzMC45MDUgNjMuNTY5OSAyMzcuMjQ1IDU5LjYwOTkgMjQ2LjA5NSA1OS42MDk5QzI1Ny45MjUgNTkuNjA5OSAyNjQuNjM1IDY2LjE2OTkgMjY0LjYzNSA3Ni4xNjk5VjEwMS42NUgyNTYuNjk1Vjk0LjM5OTlDMjUzLjQxNSA5OS4yNzk5IDI0Ny4zODUgMTAyLjQ5IDI0MC41MTUgMTAyLjQ5QzIzMC45NzUgMTAyLjQ5IDIyNS45NDUgOTcuMjI5OSAyMjUuOTQ1IDkwLjI3OTlaTTI1Ni42ODUgODYuNjE5OVY4My4xODk5SDI0NS4wMTVDMjM3LjM4NSA4My4xODk5IDIzNC4zMzUgODUuNTU5OSAyMzQuMzM1IDg5LjU5OTlDMjM0LjMzNSA5My4xODk5IDIzNi43NzUgOTUuMzE5OSAyNDIuMjc1IDk1LjMxOTlDMjQ4LjE1NSA5NS4zMTk5IDI1NC4wMjUgOTIuMDM5OSAyNTYuNjk1IDg2LjYxOTlIMjU2LjY4NVpNMjY5LjIwNSA5My40MDk5TDI3Ni42MDUgODkuMjA5OUMyNzkuMTI1IDkzLjA5OTkgMjgyLjYzNSA5NS4zMDk5IDI4Ny43NDUgOTUuMzA5OUMyOTIuODU1IDk1LjMwOTkgMjk1LjkwNSA5Mi42Mzk5IDI5NS45MDUgODkuNTA5OUMyOTUuOTA1IDg1LjkxOTkgMjkwLjg2NSA4NS4wNzk5IDI4NS40NTUgODMuOTM5OUMyNzguNTE1IDgyLjQ4OTkgMjcxLjExNSA4MC4xOTk5IDI3MS4xMTUgNzEuODA5OUMyNzEuMTE1IDY1LjM5OTkgMjc3LjI5NSA1OS40NDk5IDI4Ni45ODUgNTkuNTI5OUMyOTQuNjk1IDU5LjUyOTkgMjk5Ljk1NSA2Mi4zNDk5IDMwMy41NDUgNjcuMjM5OUwyOTYuNDQ1IDcxLjI3OTlDMjk0LjM4NSA2OC4yMjk5IDI5MS40MDUgNjYuMzk5OSAyODYuOTg1IDY2LjM5OTlDMjgxLjk0NSA2Ni4zOTk5IDI3OS41MDUgNjguNzY5OSAyNzkuNTA1IDcxLjY1OTlDMjc5LjUwNSA3NC45Mzk5IDI4My4yNDUgNzUuNjk5OSAyODkuNDk1IDc3LjA3OTlDMjk2LjM2NSA3OC41Mjk5IDMwNC4xNDUgODAuODk5OSAzMDQuMTQ1IDg5LjQzOTlDMzA0LjE0NSA5NS40Njk5IDI5OC43MjUgMTAyLjU2IDI4Ny4zNTUgMTAyLjQ5QzI3OC42NTUgMTAyLjQ5IDI3Mi43MDUgOTkuMzU5OSAyNjkuMTk1IDkzLjQwOTlIMjY5LjIwNVpNMzA2Ljg5NSA5My40MDk5TDMxNC4yOTUgODkuMjA5OUMzMTYuODE1IDkzLjA5OTkgMzIwLjMyNSA5NS4zMDk5IDMyNS40MzUgOTUuMzA5OUMzMzAuNTQ1IDk1LjMwOTkgMzMzLjU5NSA5Mi42Mzk5IDMzMy41OTUgODkuNTA5OUMzMzMuNTk1IDg1LjkxOTkgMzI4LjU1NSA4NS4wNzk5IDMyMy4xNDUgODMuOTM5OUMzMTYuMjA1IDgyLjQ4OTkgMzA4LjgwNSA4MC4xOTk5IDMwOC44MDUgNzEuODA5OUMzMDguODA1IDY1LjM5OTkgMzE0Ljk4NSA1OS40NDk5IDMyNC42NzUgNTkuNTI5OUMzMzIuMzg1IDU5LjUyOTkgMzM3LjY0NSA2Mi4zNDk5IDM0MS4yMzUgNjcuMjM5OUwzMzQuMTM1IDcxLjI3OTlDMzMyLjA3NSA2OC4yMjk5IDMyOS4wOTUgNjYuMzk5OSAzMjQuNjc1IDY2LjM5OTlDMzE5LjYzNSA2Ni4zOTk5IDMxNy4xOTUgNjguNzY5OSAzMTcuMTk1IDcxLjY1OTlDMzE3LjE5NSA3NC45Mzk5IDMyMC45MzUgNzUuNjk5OSAzMjcuMTg1IDc3LjA3OTlDMzM0LjA1NSA3OC41Mjk5IDM0MS44MzUgODAuODk5OSAzNDEuODM1IDg5LjQzOTlDMzQxLjgzNSA5NS40Njk5IDMzNi40MTUgMTAyLjU2IDMyNS4wNDUgMTAyLjQ5QzMxNi4zNDUgMTAyLjQ5IDMxMC4zOTUgOTkuMzU5OSAzMDYuODg1IDkzLjQwOTlIMzA2Ljg5NVoiIGZpbGw9IiM0RDRENEYiLz4KPHBhdGggZD0iTTY0Ljc1NDkgMzAuOTE5OVY1Mi42MTk5TDQzLjA1NDkgMzAuOTE5OUg2NC43NTQ5WiIgZmlsbD0iI0ZFQkMxMSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzEwNThfMTI2NzAiPgo8cmVjdCB3aWR0aD0iMzQxLjY5IiBoZWlnaHQ9IjExOC4xMyIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMTU1MDI5KSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=" alt="Compass Newsletter header">
		</div>
		<!-- end newsletter header -->
		<?php if ( $args['image'] && has_post_thumbnail() && $card_figure ) : ?>
			<figure class="card__figure <?php echo esc_attr( $selected_colors ); ?>">
				<?php
				echo wp_kses_post( $card_figure );
				?>
			</figure>
		<?php endif; ?>
		<div class="card__content">
			<div class="card__content-top">
				<?php if ( $args['category'] ) : ?>
					<?php get_template_part( 'template-parts/cards/terms', '', $args ); ?>
				<?php endif; ?>
				<?php if ( $args['title'] ) : ?>
					<<?php echo esc_html( $args['heading_tag'] ); ?> class="has-<?php echo esc_attr( $args['font_size'] ); ?>-font-size card__title zach-content-truncated" data-max-lines="<?php echo absint( $args['max-lines-heading'] ); ?>">
						<?php the_title(); ?>
					</<?php echo esc_html( $args['heading_tag'] ); ?>>
				<?php endif; ?>
				<?php if ( $render_date ) : ?>
					<span class="card__date">
						<?php the_date(); ?>
					</span>
				<?php endif; ?>
				<?php if ( $render_excerpt ) : ?>
					<div class="card__excerpt zach-content-truncated" data-max-lines="<?php echo absint( $args['max-lines-excerpt'] ); ?>">
						<?php the_excerpt(); ?>
					</div>
				<?php endif; ?>
			</div>
			<?php if ( ( $args['continue_reading'] ) || $args['author'] ) : ?>
				<div class="card__content-bottom">
					<?php if ( $args['continue_reading'] ) : ?>
						<span class="card__continue-reading">
						<?php
						// Handle replacing the Read More message with a per-post string.
						$custom_read_more_message = get_post_meta( get_the_ID(), 'zach_read_more_message', 'true' );

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
