<?php
/**
 * Frontend Class
 *
 * @category Frontend
 * @package  StockAlert
 * @author   Nazrul Islam Nayan <nazrulislamnayan@gmail.com>
 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
 * @link     https://github.com/nayanchamp7/patternly
 * @since    1.0.0
 */

namespace Optemiz\Base;

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'Frontend' ) ) {
	/**
	 * Frontend class
	 *
	 * @class Frontend The class that manages all about frontend
	 *
	 * @category Frontend
	 * @package  StockAlert
	 * @author   Nazrul Islam Nayan <nazrulislamnayan@gmail.com>
	 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
	 * @link     https://github.com/nayanchamp7
	 * @property null|object $_instance Instance of the class
	 */
	class Frontend {

		/**
		 * Instance of self
		 *
		 * @var Frontend
		 */
		public static $_instance = null;

		/**
		 * Settings
		 *
		 * @var Frontend
		 */
		public $_settings = null;

		/**
		 * Class constructor
		 *
		 * Sets up all the appropriate hooks and functions
		 * within our plugin.
		 *
		 * @return void
		 */
		public function __construct() {
			$this->hooks();
			$this->init();
			do_action( 'patternly_frontend_loaded', $this );
		}

		/**
		 * Initializes class
		 *
		 * Checks for an existing instance
		 * and if it doesn't find one, create it.
		 *
		 * @return object
		 */
		public static function instance() {
			if ( is_null( self::$_instance ) ) {
				self::$_instance = new self();
			}

			return self::$_instance;
		}

		/**
		 * All the executed hooks
		 *
		 * @return void
		 */
		protected function hooks() {
			add_action( 'woocommerce_simple_add_to_cart', array( $this, 'display_form_in_product' ), 31 );
			add_action( 'woocommerce_subscription_add_to_cart', array( $this, 'display_form_in_product' ), 31 );
			add_action( 'woocommerce_bundle_add_to_cart', array( $this, 'display_form_in_product' ), 31 );
			add_action( 'woocommerce_woosb_add_to_cart', array( $this, 'display_form_in_product' ), 31 );

			// show form in variation product.
			add_filter( 'woocommerce_available_variation', array( $this, 'display_form_in_variation' ), 999, 3 );
		}

		/**
		 * Initialize
		 */
		public function init() {
			$this->_settings = get_option( 'stock_alert_settings' );
		}

		/**
		 * Display Form in Product
		 *
		 * @return void
		 */
		public function display_form_in_product() {
			global $post;
			$id = $post->ID;

			if ( 'product' !== get_post_type( $post ) ) {
				return;
			}

			$settings = $this->_settings;

			$is_enable = isset( $settings['enable'] ) && ! empty( $settings['enable'] ) ? $settings['enable'] : 'yes';

			if ( 'no' === $is_enable ) {
				return;
			}

			$hide_form_for_guests  = isset( $settings['hide_form_for_guests'] ) && ! empty( $settings['hide_form_for_guests'] ) ? $settings['hide_form_for_guests'] : 'no';
			$hide_form_for_members = isset( $settings['hide_form_for_members'] ) && ! empty( $settings['hide_form_for_members'] ) ? $settings['hide_form_for_members'] : 'no';

			$exclude_products       = isset( $settings['exclude_products'] ) && ! empty( $settings['exclude_products'] ) ? $settings['exclude_products'] : array();
			$exclude_products_cats  = isset( $settings['exclude_categories_products'] ) && ! empty( $settings['exclude_categories_products'] ) ? $settings['exclude_categories_products'] : array();
			$exclude_products_tags  = isset( $settings['exclude_tags_products'] ) && ! empty( $settings['exclude_tags_products'] ) ? $settings['exclude_tags_products'] : array();
			$exclude_products_types = isset( $settings['exclude_product_types'] ) && ! empty( $settings['exclude_product_types'] ) ? $settings['exclude_product_types'] : array();

			$product_instock_quantity = get_post_meta( $id, '_stock', true );
			$stock_status             = get_post_meta( $id, '_stock_status', true );

			if ( 'outofstock' !== $stock_status || ( ! empty( $product_instock_quantity ) && $product_instock_quantity > 0 ) ) {
				return;
			}

			// get product category ids.
			$cats    = get_the_terms( $id, 'product_cat' );
			$cat_ids = wp_list_pluck( $cats, 'term_id' );

			// get product tag ids.
			$tags    = get_the_terms( $id, 'product_tag' );
			$tag_ids = wp_list_pluck( $tags, 'term_id' );

			// hide for guests when enable.
			if ( 'yes' === $hide_form_for_guests ) {
				if ( ! is_user_logged_in() ) {
					return;
				}
			}

			// hide for logged in users when enable.
			if ( 'yes' === $hide_form_for_members ) {
				if ( is_user_logged_in() ) {
					return;
				}
			}

			// hide when exclude product is matched.
			if ( ! empty( $exclude_products ) && in_array( $id, $exclude_products ) ) {
				return;
			}

			// hide when exclude categories is matched.
			if ( ! empty( array_intersect( $cat_ids, $exclude_products_cats ) ) ) {
				return;
			}

			// hide when exclude categories is matched.
			if ( ! empty( array_intersect( $tag_ids, $exclude_products_tags ) ) ) {
				return;
			}

			// hide when exclude product types is matched.
			$product      = wc_get_product( $id );
			$product_type = $product->get_type();

			if ( ! empty( $product_type ) && in_array( $product_type, $exclude_products_types ) ) {
				return;
			}

			// when product is variable product get the default variation.
			if ( $product->is_type( 'variable' ) ) {
				$default_attributes = $product->get_default_attributes();

				if ( ! empty( $default_attributes ) ) {
					$default_variation_id = $this->get_default_variation_id( $product, $default_attributes );
					$product              = wc_get_product( $default_variation_id );
				}
			}

			//show form content.
			echo $this->form_content();
		}

		/**
		 * Get form content
		 *
		 * @return mixed
		 */
		public function form_content() {
			//get settings to be used inside form template.
			$settings  = $this->_settings;

			$display_type  = isset( $settings['display_type'] ) && ! empty( $settings['display_type'] ) ? $settings['display_type'] : 'inline_form';

			// enqueue form style files.
			wp_enqueue_style( 'patternly_styles' );

			// enqueue form JS files.
			wp_enqueue_script( 'patternly_script' );
			
			ob_start();

			if( 'inline_form' === $display_type ) {
				$form_template  = patternly_get_template('form');
			}else {
				$form_template  = patternly_get_template('popup');
			}

			if( $form_template ) {
				include $form_template;
			}

			return ob_get_clean();
		}

		/**
		 * Display Form in Variation
		 *
		 * @param array  $atts attributes.
		 * @param object $product product object.
		 * @param object $variation variation object.
		 *
		 * @return mixed
		 */
		public function display_form_in_variation( $atts, $product, $variation ) {
			$settings         = $this->_settings;
			$exclude_products = isset( $settings['exclude_products'] ) && ! empty( $settings['exclude_products'] ) ? $settings['exclude_products'] : array();

			// hide when exclude product is matched.
			if ( $variation && ! empty( $exclude_products ) && in_array( $variation->get_id(), $exclude_products ) ) {
				return $atts;
			}

			// add form content tothe outofstock variation product
			if( 0 === $variation->get_stock_quantity() || 'outofstock' === $variation->get_stock_status() ) {
				$get_stock = $atts['availability_html'];
				apply_filters( 'patternly_filter_display_subscribe_form', true, $product, $variation );
	
				$atts['availability_html'] = $get_stock . $this->form_content();
			}

			return $atts;
		}

		/**
		 * Get default variation product id
		 *
		 * @param object $product product object.
		 * @param array  $attributes product attributes.
		 *
		 * @return mixed
		 */
		public function get_default_variation_id( $product, $attributes ) {
			foreach ( $attributes as $key => $value ) {
				if ( strpos( $key, 'attribute_' ) === 0 ) {
					continue;
				}
				unset( $attributes[ $key ] );
				$attributes[ sprintf( 'attribute_%s', $key ) ] = $value;
			}

			if ( class_exists( 'WC_Data_Store' ) ) {
				$data_store = \WC_Data_Store::load( 'product' );
				return $data_store->find_matching_product_variation( $product, $attributes );
			} else {
				return $product->get_matching_variation( $attributes );
			}
		}
	}
}
