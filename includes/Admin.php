<?php
/**
 * Admin Class
 *
 * @category Admin
 * @package  Optemiz\Base
 * @author   Nazrul Islam Nayan <nazrulislamnayan@gmail.com>
 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
 * @link     https://github.com/nayanchamp7/patternly
 * @since    1.0.0
 */

namespace Optemiz\Base;

defined( 'ABSPATH' ) || exit;

use Optemiz\Base;

if ( ! class_exists( 'Admin' ) ) {
	/**
	 * Admin class
	 *
	 * @class Admin The class that manages all about Admin
	 *
	 * @category Admin
	 * @package  Optemiz\Base
	 * @author   Nazrul Islam Nayan <nazrulislamnayan@gmail.com>
	 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
	 * @link     https://github.com/nayanchamp7
	 * @property null|object $_instance Instance of the class
	 */
	class Admin {

		/**
		 * Instance of self
		 *
		 * @var Ajax
		 */
		public static $_instance = null;

		/**
		 * Class constructor
		 *
		 * Sets up all the appropriate hooks and functions
		 * within our plugin.
		 *
		 * @return void
		 */
		public function __construct() {
			do_action( 'patternly_admin_loaded', $this );
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
		 * Plugin row meta
		 *
		 * @param array  $links links.
		 * @param string $file  file.
		 *
		 * @return array
		 */
		public function plugin_row_meta( $links, $file ) {
			if ( plugin_basename( SAW_FILE ) !== $file ) {
				return $links;
			}

			$row_meta = apply_filters(
				'woo_variation_swatches_row_meta',
				array(
					'docs'    => '<a target="_blank" href="' . esc_url( 'https://getwooplugins.com/documentation/woocommerce-variation-swatches/' ) . '" aria-label="' . esc_attr__( 'View documentation', 'woo-variation-swatches' ) . '">' . esc_html__( 'Documentation', 'woo-variation-swatches' ) . '</a>',
					'videos'  => '<a target="_blank" href="' . esc_url( 'https://www.youtube.com/channel/UC6F21JXiLUPO7sm-AYlA3Ig/videos' ) . '" aria-label="' . esc_attr__( 'Video Tutorials', 'woo-variation-swatches' ) . '">' . esc_html__( 'Video Tutorials', 'woo-variation-swatches' ) . '</a>',
					'support' => '<a target="_blank" href="' . esc_url( 'https://getwooplugins.com/tickets/' ) . '" aria-label="' . esc_attr__( 'Help & Support', 'woo-variation-swatches' ) . '">' . esc_html__( 'Help & Support', 'woo-variation-swatches' ) . '</a>',
				)
			);

			return array_merge( $links, $row_meta );
		}

		/**
		 * Plugin action links
		 *
		 * @param array $links action links.
		 *
		 * @return array
		 */
		public function plugin_action_links( $links ) {
			// $action_links = array(
			// 'settings' => '<a href="' . esc_url( $this->get_admin_menu()->get_settings_link( 'woo_variation_swatches' ) ) . '" aria-label="' . esc_attr__( 'View Swatches settings', 'woo-variation-swatches' ) . '">' . esc_html__( 'Settings', 'woo-variation-swatches' ) . '</a>',
			// );
			//
			//
			// $pro_links = array(
			// 'gwp-go-pro-action-link' => '<a target="_blank" href="' . esc_url( $this->get_pro_link() ) . '" aria-label="' . esc_attr__( 'Go Pro', 'woo-variation-swatches' ) . '">' . esc_html__( 'Go Pro', 'woo-variation-swatches' ) . '</a>',
			// );
			//
			// if ( woo_variation_swatches()->is_pro() ) {
			// $pro_links = array();
			// }
			//
			// return array_merge( $action_links, $links, $pro_links );
		}
	}
}
