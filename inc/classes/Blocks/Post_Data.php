<?php
/**
 * Post Data class
 *
 * Holds a count for each instance of the posts so that the layout block can be used multiple times on a page.
 *
 * @package zach-blocks
 */

namespace Zach\Blocks\Blocks;

/**
 * Data store Class
 */
class Post_Data {

	/**
	 * Instances of the data store.
	 *
	 * @var array
	 */
	protected static $instances = array();

	/**
	 * This instance's partial path.
	 *
	 * @var string
	 */
	public $count;

	/**
	 * Holds an array of attributes for the instance.
	 *
	 * @var array
	 */
	public $attributes;

	/**
	 * Stores an array of WP_Post objects when they are pre-fetched.
	 *
	 * @var array
	 */
	protected $posts = array();

	/**
	 * Keeps a log of where we are in the array each time the get_posts function is called.
	 *
	 * @var int
	 */
	protected $total_count = 0;

	/**
	 * Store the attributes for use with the class.
	 *
	 * @param array $attributes Attributes from block.
	 */
	public function __construct( $attributes ) {
		$this->attributes = $attributes;
	}

	/**
	 * Use a hashed version of block attributes in order to figure out which block we are on.
	 *
	 * This allows us to iterate through each feed differently, without interfering with other feeds.
	 * So if a block has a certain tag, it is stored in an instance, and a certain category,
	 * in onother instance.
	 *
	 * @param object $attributes Full array of attributes for this block.
	 *
	 * @return Post_Data
	 */
	public static function get_instance( $attributes ) {
		$path = md5( maybe_serialize( self::normalize_attributes( $attributes ) ) );

		if ( empty( static::$instances[ $path ] ) ) {
			static::$instances[ $path ] = new Post_Data( $attributes );
		}

		return static::$instances[ $path ];
	}

	/**
	 * Reset a few things in the attributes so it's even between blocks.
	 *
	 * @param array $attributes Full array of attributes for this block.
	 */
	public static function normalize_attributes( $attributes ) {
		return $attributes;
	}

	/**
	 * Get Posts
	 *
	 * @return Posts
	 */
	public function get_posts() {
		if ( empty( $this->posts ) ) {
			$this->query_posts();
		}

		$posts = $this->posts;

		if ( 'manual' !== $this->attributes['curationType'] ) {
			$length            = 4;
			$offset            = $this->total_count;
			$posts             = array_slice( $this->posts, $offset, $length );
			$this->total_count = $this->total_count + $length;
		}

		return $posts;
	}

	/**
	 * Pre-fetch posts if required.
	 */
	public function query_posts() {
		$default_count = get_option( 'posts_per_page' );

		$args = [];

		if ( 'manual' === $this->attributes['curationType'] ) {
			$args['post__in'] = $this->attributes['posts'];
			$args['orderby']  = 'post__in';
		} else {
			$args['numberposts'] = $default_count;

			if ( 'tag' === $this->attributes['curation'] ) {
				$args['tag__in'] = $this->attributes['term_id'];
			}

			if ( 'category' === $this->attributes['curation'] ) {
				$args['cat'] = $this->attributes['term_id'];
			}
		}

		$this->posts = get_posts( $args );
	}
}
