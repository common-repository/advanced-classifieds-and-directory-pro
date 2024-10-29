<?php

/**
 * Walker Category Dropdown.
 *
 * @link    https://pluginsware.com
 * @since   1.0.0
 *
 * @package Advanced_Classifieds_And_Directory_Pro
 */
 
// Exit if accessed directly
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * ACADP_Walker_CategoryDropdown Class.
 *
 * @since 1.5.4
 */
class ACADP_Walker_CategoryDropdown extends Walker_CategoryDropdown {

	/**
	 * Starts the element output.
	 *
	 * @since 3.1.0
	 * @param string  $output            Used to append additional content (passed by reference).
	 * @param WP_Term $data_object       Category data object.
	 * @param int     $depth             Depth of category. Used for padding.
	 * @param array   $args              Uses 'selected', 'show_count', and 'value_field' keys, if they exist.
	 *                                   See wp_dropdown_categories().
	 * @param int     $current_object_id Optional. ID of the current category. Default 0.
	 */
	public function start_el( &$output, $data_object, $depth = 0, $args = array(), $current_object_id = 0 ) {
		// Restores the more descriptive, specific name for use within this method.
		$category = $data_object;

		$pad = str_repeat( '&nbsp;', $depth * 3 );

		/** This filter is documented in wp-includes/category-template.php */
		$cat_name = apply_filters( 'list_cats', $category->name, $category );

		if ( isset( $args['value_field'] ) && isset( $category->{$args['value_field']} ) ) {
			$value_field = $args['value_field'];
		} else {
			$value_field = 'term_id';
		}

		$output .= "\t<option class=\"level-$depth\" value=\"" . esc_attr( $category->{$value_field} ) . '"';

		// Type-juggling causes false matches, so we force everything to a string.
		if ( (string) $category->{$value_field} === (string) $args['selected'] ) {
			$output .= ' selected="selected"';
		}

		// Disable parent option.
		if ( 0 === $depth ) {
			$output .= ' disabled';
		}

		$output .= '>';

		$output .= $pad . $cat_name;

		if ( $args['show_count'] ) {
			$output .= '&nbsp;&nbsp;(' . number_format_i18n( $category->count ) . ')';
		}

		$output .= "</option>\n";
	}

}
