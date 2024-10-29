<?php

/**
 * Blocks
 *
 * @link    https://pluginsware.com
 * @since   1.6.1
 *
 * @package Advanced_Classifieds_And_Directory_Pro
 */

// Exit if accessed directly
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * ACADP_Blocks class.
 *
 * @since 1.6.1
 */
class ACADP_Blocks {

	/**
	 * Register our custom block category.
	 *
	 * @since  1.6.1
	 * @param  array $categories Default Gutenberg block categories.
	 * @return array             Modified Gutenberg block categories.
	 */
	public function block_categories( $categories ) {		
		return array_merge(
			$categories,
			array(
				array(
					'slug'  => 'advanced-classifieds-and-directory-pro',
					'title' => __( 'Advanced Classifieds and Directory Pro', 'advanced-classifieds-and-directory-pro' ),
				),
			)
		);		
	}

	/**
	 * Enqueue block assets for backend editor.
	 *
	 * @since 1.6.1
	 */
	public function enqueue_block_editor_assets() {
		$general_settings    = get_option( 'acadp_general_settings' );	
		$listings_settings   = get_option( 'acadp_listings_settings' );
		$locations_settings  = get_option( 'acadp_locations_settings' ); 
		$categories_settings = get_option( 'acadp_categories_settings' );			
	
		$editor_properties = array(
			'base_location' => max( 0, $general_settings['base_location'] ),
			'listings' => array(
				'view'               => $listings_settings['default_view'],
				'category'           => 0,
				'location'           => 0,					
				'columns'            => $listings_settings['columns'],
				'listings_per_page'  => ! empty( $listings_settings['listings_per_page'] ) ? $listings_settings['listings_per_page'] : -1,
				'filterby'           => '',
				'orderby'            => $listings_settings['orderby'],
				'order'              => $listings_settings['order'],
				'featured'           => true,
				'header'             => true,
				'show_excerpt'       => isset( $listings_settings['display_in_listing'] ) && in_array( 'excerpt', $listings_settings['display_in_listing'] ) ? 1 : 0,
				'show_category'      => isset( $listings_settings['display_in_listing'] ) && in_array( 'category', $listings_settings['display_in_listing'] ) ? 1 : 0,
				'show_location'      => isset( $listings_settings['display_in_listing'] ) && in_array( 'location', $listings_settings['display_in_listing'] ) ? 1 : 0,
				'show_price'         => isset( $listings_settings['display_in_listing'] ) && in_array( 'price', $listings_settings['display_in_listing'] ) ? 1 : 0,
				'show_date'          => isset( $listings_settings['display_in_listing'] ) && in_array( 'date', $listings_settings['display_in_listing'] ) ? 1 : 0,
				'show_user'          => isset( $listings_settings['display_in_listing'] ) && in_array( 'user', $listings_settings['display_in_listing'] ) ? 1 : 0,
				'show_views'         => isset( $listings_settings['display_in_listing'] ) && in_array( 'views', $listings_settings['display_in_listing'] ) ? 1 : 0,
				'show_custom_fields' => isset( $listings_settings['display_in_listing'] ) && in_array( 'custom_fields', $listings_settings['display_in_listing'] ) ? 1 : 0,
				'pagination'         => true,
				'i18n'               => array(
					'panel_settings'           => __( 'Listings settings', 'advanced-classifieds-and-directory-pro' ),
					'view_label'               => __( 'Select template', 'advanced-classifieds-and-directory-pro' ),
					'view_list'                => __( 'List', 'advanced-classifieds-and-directory-pro' ),
					'view_grid'                => __( 'Grid', 'advanced-classifieds-and-directory-pro' ),
					'view_map'                 => __( 'Map', 'advanced-classifieds-and-directory-pro' ),
					'location_label'           => __( 'Select location', 'advanced-classifieds-and-directory-pro' ),
					'location_none'            => __( 'All Locations', 'advanced-classifieds-and-directory-pro' ),
					'category_label'           => __( 'Select category', 'advanced-classifieds-and-directory-pro' ),
					'category_none'            => __( 'All Categories', 'advanced-classifieds-and-directory-pro' ),
					'columns_label'            => __( 'Number of columns', 'advanced-classifieds-and-directory-pro' ),
					'listings_per_page_label'  => __( 'Number of listings', 'advanced-classifieds-and-directory-pro' ),
					'listings_per_page_help'   => __( 'Enter the number of listings to show per page. Add "0" to show all listings.', 'advanced-classifieds-and-directory-pro' ),
					'filterby_label'           => __( 'Filter by', 'advanced-classifieds-and-directory-pro' ),
					'filterby_none'            => __( 'None', 'advanced-classifieds-and-directory-pro' ),
					'filterby_featured'        => __( 'Featured', 'advanced-classifieds-and-directory-pro' ),
					'orderby_label'            => __( 'Order by', 'advanced-classifieds-and-directory-pro' ),
					'orderby_title'            => __( 'Title', 'advanced-classifieds-and-directory-pro' ),
					'orderby_date'             => __( 'Date posted', 'advanced-classifieds-and-directory-pro' ),
					'orderby_price'            => __( 'Price', 'advanced-classifieds-and-directory-pro' ),
					'orderby_views'            => __( 'Views count', 'advanced-classifieds-and-directory-pro' ),
					'orderby_rand'             => __( 'Random', 'advanced-classifieds-and-directory-pro' ),
					'order_label'              => __( 'Order', 'advanced-classifieds-and-directory-pro' ),
					'order_asc'                => __( 'Ascending', 'advanced-classifieds-and-directory-pro' ),
					'order_desc'               => __( 'Descending', 'advanced-classifieds-and-directory-pro' ),
					'featured_label'           => __( 'Show featured', 'advanced-classifieds-and-directory-pro' ),
					'featured_help'            => __( 'Show or hide featured listings at the top of normal listings.', 'advanced-classifieds-and-directory-pro' ),
					'header_label'             => __( 'Show header', 'advanced-classifieds-and-directory-pro' ),
					'header_help'              => __( 'The header section consist of the "Listings count", "Views switcher", and "Sort by" options.', 'advanced-classifieds-and-directory-pro' ),
					'show_excerpt_label'       => __( 'Show excerpt (short description)', 'advanced-classifieds-and-directory-pro' ),
					'show_category_label'      => __( 'Show category name', 'advanced-classifieds-and-directory-pro' ),
					'show_location_label'      => __( 'Show location name', 'advanced-classifieds-and-directory-pro' ),
					'show_price_label'         => __( 'Show price', 'advanced-classifieds-and-directory-pro' ),
					'show_date_label'          => __( 'Show date', 'advanced-classifieds-and-directory-pro' ),
					'show_user_label'          => __( 'Show user', 'advanced-classifieds-and-directory-pro' ),
					'show_views_label'         => __( 'Show views', 'advanced-classifieds-and-directory-pro' ),
					'show_custom_fields_label' => __( 'Show custom fields', 'advanced-classifieds-and-directory-pro' ),
					'pagination_label'         => __( 'Show pagination', 'advanced-classifieds-and-directory-pro' )
				)
			),
			'locations' => array(
				'parent'     => max( 0, $general_settings['base_location'] ),
				'columns'    => $locations_settings['columns'],
				'depth'      => $locations_settings['depth'],
				'orderby'    => $locations_settings['orderby'],
				'order'      => $locations_settings['order'],
				'show_count' => empty( $locations_settings['show_count'] ) ? 0 : 1,
				'hide_empty' => empty( $locations_settings['hide_empty'] ) ? 0 : 1,
				'i18n'       => array(
					'panel_settings'   => __( 'Locations settings', 'advanced-classifieds-and-directory-pro' ),
					'parent_label'     => __( 'Select parent', 'advanced-classifieds-and-directory-pro' ),
					'columns_label'    => __( 'Number of columns', 'advanced-classifieds-and-directory-pro' ),
					'depth_label'      => __( 'Depth', 'advanced-classifieds-and-directory-pro' ),
					'orderby_label'    => __( 'Order by', 'advanced-classifieds-and-directory-pro' ),
					'orderby_id'       => __( 'ID', 'advanced-classifieds-and-directory-pro' ),
					'orderby_count'    => __( 'Count', 'advanced-classifieds-and-directory-pro' ),
					'orderby_name'     => __( 'Name', 'advanced-classifieds-and-directory-pro' ),
					'orderby_slug'     => __( 'Slug', 'advanced-classifieds-and-directory-pro' ),
					'order_label'      => __( 'Order', 'advanced-classifieds-and-directory-pro' ),
					'order_asc'        => __( 'Ascending', 'advanced-classifieds-and-directory-pro' ),
					'order_desc'       => __( 'Descending', 'advanced-classifieds-and-directory-pro' ),
					'show_count_label' => __( 'Show listings count', 'advanced-classifieds-and-directory-pro' ),
					'show_count_help'  => __( 'Check this to show the listings count next to the location name', 'advanced-classifieds-and-directory-pro' ),
					'hide_empty_label' => __( 'Hide empty locations', 'advanced-classifieds-and-directory-pro' ),
					'hide_empty_help'  => __( 'Check this to hide locations with no listings', 'advanced-classifieds-and-directory-pro' )
				)
			),
			'categories' => array(				
				'view'       => $categories_settings['view'],
				'parent'     => 0,
				'columns'    => $categories_settings['columns'],
				'depth'      => $categories_settings['depth'],
				'orderby'    => $categories_settings['orderby'],
				'order'      => $categories_settings['order'],
				'show_count' => empty( $categories_settings['show_count'] ) ? 0 : 1,
				'hide_empty' => empty( $categories_settings['hide_empty'] ) ? 0 : 1,
				'i18n'       => array(
					'panel_settings'   => __( 'Categories settings', 'advanced-classifieds-and-directory-pro' ),
					'view_label'       => __( 'Select template', 'advanced-classifieds-and-directory-pro' ),
					'view_list'        => __( 'List', 'advanced-classifieds-and-directory-pro' ),
					'view_grid'        => __( 'Grid', 'advanced-classifieds-and-directory-pro' ),
					'parent_label'     => __( 'Select parent', 'advanced-classifieds-and-directory-pro' ),
					'columns_label'    => __( 'Number of columns', 'advanced-classifieds-and-directory-pro' ),
					'depth_label'      => __( 'Depth', 'advanced-classifieds-and-directory-pro' ),
					'orderby_label'    => __( 'Order by', 'advanced-classifieds-and-directory-pro' ),
					'orderby_id'       => __( 'ID', 'advanced-classifieds-and-directory-pro' ),
					'orderby_count'    => __( 'Count', 'advanced-classifieds-and-directory-pro' ),
					'orderby_name'     => __( 'Name', 'advanced-classifieds-and-directory-pro' ),
					'orderby_slug'     => __( 'Slug', 'advanced-classifieds-and-directory-pro' ),
					'order_label'      => __( 'Order', 'advanced-classifieds-and-directory-pro' ),
					'order_asc'        => __( 'Ascending', 'advanced-classifieds-and-directory-pro' ),
					'order_desc'       => __( 'Descending', 'advanced-classifieds-and-directory-pro' ),
					'show_count_label' => __( 'Show listings count', 'advanced-classifieds-and-directory-pro' ),
					'show_count_help'  => __( 'Check this to show the listings count next to the category name', 'advanced-classifieds-and-directory-pro' ),
					'hide_empty_label' => __( 'Hide empty categories', 'advanced-classifieds-and-directory-pro' ),
					'hide_empty_help'  => __( 'Check this to hide categories with no listings', 'advanced-classifieds-and-directory-pro' )
				)
			),
			'search_form' => array(
				'style'         => 'inline',
				'keyword'       => 1,
				'location'      => empty( $general_settings['has_location'] ) ? 0 : 1,
				'category'      => 1,
				'custom_fields' => 1,
				'price'         => empty( $general_settings['has_price'] ) ? 0 : 1,
				'i18n'          => array(
					'panel_settings'      => __( 'Search form settings', 'advanced-classifieds-and-directory-pro' ),
					'style_label'         => __( 'Select template', 'advanced-classifieds-and-directory-pro' ),
					'style_vertical'      => __( 'Vertical', 'advanced-classifieds-and-directory-pro' ),
					'style_inline'        => __( 'Horizontal', 'advanced-classifieds-and-directory-pro' ),
					'keyword_label'       => __( 'Search by keyword', 'advanced-classifieds-and-directory-pro' ),
					'location_label'      => __( 'Search by location', 'advanced-classifieds-and-directory-pro' ),
					'category_label'      => __( 'Search by category', 'advanced-classifieds-and-directory-pro' ),
					'custom_fields_label' => __( 'Search by custom fields', 'advanced-classifieds-and-directory-pro' ),
					'price_label'         => __( 'Search by price', 'advanced-classifieds-and-directory-pro' )
				)
			)
		);

		wp_localize_script( 
			'wp-block-editor', 
			'acadp_blocks', 
			$editor_properties
		);	
		
		do_action( 'acadp_enqueue_block_editor_assets' );
	}	

	/**
	 * Register our custom blocks.
	 * 
	 * @since 1.6.1
	 */
	public function register_block_types() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return false;
		}

		$this->register_locations_block();
		$this->register_categories_block();
		$this->register_listings_block();
		$this->register_search_form_block();
		$this->register_listing_form_block();
	}

	/**
	 * Register the locations block.
	 *
	 * @since 2.0.0
	 */
	private function register_locations_block() {
		$attributes = array(
			'parent' => array(
				'type' => 'number'
			),
			'columns' => array(
				'type' => 'number'
			),
			'depth' => array(
				'type' => 'number'
			),
			'orderby' => array(
				'type' => 'string'
			),
			'order' => array(
				'type' => 'string'
			),
			'show_count' => array(
				'type' => 'boolean'
			),
			'hide_empty' => array(
				'type' => 'boolean'
			)				
		);

		register_block_type( __DIR__ . '/build/locations', array(
			'attributes' => $attributes,
			'render_callback' => array( $this, 'render_locations_block' )
		) );
	}

	/**
	 * Register the categories block.
	 *
	 * @since 2.0.0
	 */
	private function register_categories_block() {
		$attributes = array(
			'view' => array(
				'type' => 'string'
			),
			'parent' => array(
				'type' => 'number'
			),			
			'columns' => array(
				'type' => 'number'
			),
			'depth' => array(
				'type' => 'number'
			),
			'orderby' => array(
				'type' => 'string'
			),
			'order' => array(
				'type' => 'string'
			),
			'show_count' => array(
				'type' => 'boolean'
			),
			'hide_empty' => array(
				'type' => 'boolean'
			)				
		);

		register_block_type( __DIR__ . '/build/categories', array(
			'attributes' => $attributes,
			'render_callback' => array( $this, 'render_categories_block' )
		) );
	}

	/**
	 * Register the listings block.
	 *
	 * @since 2.0.0
	 */
	private function register_listings_block() {
		$attributes = array(
			'view' => array(
				'type' => 'string'
			),
			'location' => array(
				'type' => 'number'
			),
			'category' => array(
				'type' => 'number'
			),	
			'columns' => array(
				'type' => 'number'
			),
			'listings_per_page' => array(
				'type' => 'number'
			),							
			'filterby' => array(
				'type' => 'string'
			),
			'orderby' => array(
				'type' => 'string'
			),
			'order' => array(
				'type' => 'string'
			),			
			'featured' => array(
				'type' => 'boolean'
			),
			'header' => array(
				'type' => 'boolean'
			),
			'show_excerpt' => array(
				'type' => 'boolean'
			),
			'show_category' => array(
				'type' => 'boolean'
			),
			'show_location' => array(
				'type' => 'boolean'
			),
			'show_price' => array(
				'type' => 'boolean'
			),
			'show_date' => array(
				'type' => 'boolean'
			),
			'show_user' => array(
				'type' => 'boolean'
			),
			'show_views' => array(
				'type' => 'boolean'
			),
			'show_custom_fields' => array(
				'type' => 'boolean'
			),
			'pagination' => array(
				'type' => 'boolean'
			)				
		);

		register_block_type( __DIR__ . '/build/listings', array(
			'attributes' => $attributes,
			'render_callback' => array( $this, 'render_listings_block' ),
		) );
	}

	/**
	 * Register the search form block.
	 *
	 * @since 2.0.0
	 */
	private function register_search_form_block() {
		$attributes = array(
			'style' => array(
				'type' => 'string'
			),
			'keyword' => array(
				'type' => 'boolean'
			),
			'location' => array(
				'type' => 'boolean'
			),
			'category' => array(
				'type' => 'boolean'
			),
			'custom_fields' => array(
				'type' => 'boolean'
			),
			'price' => array(
				'type' => 'boolean'
			)
		);

		register_block_type( __DIR__ . '/build/search-form', array(				
			'attributes' => $attributes,
			'render_callback' => array( $this, 'render_search_form_block' ),
		) );
	}

	/**
	 * Register the listing form block.
	 *
	 * @since 2.0.0
	 */
	private function register_listing_form_block() {
		register_block_type( __DIR__ . '/build/listing-form', array(				
			'render_callback' => array( $this, 'render_listing_form_block' ),
		) );
	}

	/**
	 * Render the locations block frontend.
	 *
	 * @since  1.6.1
	 * @return string Locations block output.
	 */
	public function render_locations_block() {
		$output  = '<div ' . get_block_wrapper_attributes() . '>';
		$output .= do_shortcode( '[acadp_locations]' );
		$output .= '</div>';

		return $output;
	}

	/**
	 * Render the categories block frontend.
	 *
	 * @since  1.6.1
	 * @return string Categories block output.
	 */
	public function render_categories_block() {
		$output  = '<div ' . get_block_wrapper_attributes() . '>';
		$output .= do_shortcode( '[acadp_categories]' );
		$output .= '</div>';

		return $output;
	}

	/**
	 * Render the listings block frontend.
	 *
	 * @since  1.6.1
	 * @param  array  $atts An associative array of attributes.
	 * @return string       Listings block output.
	 */
	public function render_listings_block( $atts ) {
		$output  = '<div ' . get_block_wrapper_attributes() . '>';
		$output .= do_shortcode( '[acadp_listings ' . $this->build_shortcode_attributes( $atts ) . ']' );
		$output .= '</div>';

		return $output;
	}

	/**
	 * Render the search form block frontend.
	 *
	 * @since  1.6.1
	 * @param  array  $atts An associative array of attributes.
	 * @return string       Search form block output.
	 */
	public function render_search_form_block( $atts ) {
		$output  = '<div ' . get_block_wrapper_attributes() . '>';
		$output .= do_shortcode( '[acadp_search_form ' . $this->build_shortcode_attributes( $atts ) . ']' );
		$output .= '</div>';

		return $output;
	}

	/**
	 * Render the listing form block frontend.
	 *
	 * @since  1.6.1
	 * @return string Search form block output.
	 */
	public function render_listing_form_block() {
		$output  = '<div ' . get_block_wrapper_attributes() . '>';
		$output .= do_shortcode( '[acadp_listing_form]' );
		$output .= '</div>';

		return $output;
	}

	/**
	 * Build shortcode attributes string.
	 * 
	 * @since  1.6.1
	 * @access private
	 * @param  array   $atts Array of attributes.
	 * @return string        Shortcode attributes string.
	 */
	private function build_shortcode_attributes( $atts ) {
		$attributes = array();
		
		foreach ( $atts as $key => $value ) {
			if ( is_null( $value ) ) {
				continue;
			}

			if ( is_bool( $value ) ) {
				$value = ( true === $value ) ? 1 : 0;
			}

			if ( is_array( $value ) ) {
				$value = implode( ',', $value );
			}

			$attributes[] = sprintf( '%s="%s"', $key, $value );
		}
		
		return implode( ' ', $attributes );
	}

}
