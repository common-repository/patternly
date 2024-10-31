<?php
/**
 * Assets Class
 *
 * @category Assets
 * @package  Optemiz\Base
 * @author   Nazrul Islam Nayan <nazrulislamnayan@gmail.com>
 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
 * @link     https://github.com/nayanchamp7/patternly
 * @since    1.0.0
 */

namespace Optemiz\Base;

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'Assets' ) ) {
	/**
	 * Assets class
	 *
	 * @class Assets The class that manages assets
	 *
	 * @category Assets
	 * @package  Optemiz\Base
	 * @author   Nazrul Islam Nayan <nazrulislamnayan@gmail.com>
	 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
	 * @link     https://github.com/nayanchamp7
	 * @property null|object $_instance Instance of the class
	 */
	class Assets {

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
			$this->hooks();
			do_action( 'patternly_assets_loaded', $this );
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

			if ( is_admin() ) {
				add_action( 'admin_enqueue_scripts', array( $this, 'admin_scripts' ), 25 );
			} else {
				// add_action( 'wp_enqueue_scripts', array( $this, 'register_public_styles' ), 999 );
				// add_action( 'wp_enqueue_scripts', array( $this, 'register_public_scripts' ), 999 );
			}
		}

		/**
		 * Admin styles and scripts
		 *
		 * @param string $handle file handle.
		 *
		 * @return void
		 */
		public function admin_scripts( $handle ) {

			if ( $handle === 'post-new.php' || $handle === 'post.php' ) {
				
				// include dependencies file
				if (file_exists(PATTERNLY_PLUGIN_PATH . '/build/backend.asset.php')) {
					$script_dependencies = include PATTERNLY_PLUGIN_PATH . '/build/backend.asset.php';
					$script_dependencies['dependencies'][] = 'wp-editor';
					$script_dependencies['dependencies'][] = 'wp-data';
					$script_dependencies['dependencies'][] = 'jquery';
				}

				wp_enqueue_style( 'patternly_admin_css', PATTERNLY_PLUGIN_URL . 'build/style-backend.css', array(), time() );
				wp_enqueue_script(
					'patternly_admin_js',
					PATTERNLY_PLUGIN_URL . 'build/backend.js',
					$script_dependencies['dependencies'],
					time(), //@TODO will be -> $script_dependencies['version']
				);

				wp_localize_script(
					'patternly_admin_js',
					'PatLocalize',
					array(
						'nonce' => wp_create_nonce( 'patternly-admin' ),
						'ajax_url' => admin_url( 'admin-ajax.php' ),
						'pat_plugin_url' => PATTERNLY_PLUGIN_URL,
						'pat_pro_url' => PATTERNLY_PRO_URL,
						'homeurl' => home_url(),
						'save_as_fav_api_url' => home_url('wp-json/optemiz/v1/patternly/save-as-favourite'),
						'remoteurl' => PATTERNLY_REMOTE_URL,
						'is_pro_activated' => pat_is_pro_activated(),
						'depenency_plugins_list' => pat_get_dependency_plugins_list(),
						'depenency_plugins_slug' => pat_get_dependency_plugins_slug(),
						'activated_plugins' => pat_get_activated_plugin_list(),
						'default_page_data' => pat_fetch_default_data('page'),
						'default_pattern_data' => pat_fetch_default_data('pattern'),
					)
				);
			}

		}

		/**
		 * Register styles.
		 *
		 * @return void
		 */
		public function register_public_styles() {

			// Register form style.
			wp_register_style( 'patternly_styles', PATTERNLY_PLUGIN_URL . '/build/style-frontend.css', array(), time() );
		}

		/**
		 * Register scripts.
		 *
		 * @return void
		 */
		public function register_public_scripts() {

			// Register form script.
			wp_register_script( 'patternly_script', PATTERNLY_PLUGIN_URL . '/build/frontend.js', array( 'jquery' ), time(), true );
			wp_localize_script(
				'patternly_script',
				'patternly_script',
				array(
					'ajaxurl'       => admin_url( 'admin-ajax.php' ),
					'form_messages' => array(
						'email_invalid'  => __( 'Invalid email', 'stock-alert' ),
						'mobile_invalid' => __( 'Invalid mobile number', 'stock-alert' ),
						'empty'          => __( "Field can't be empty", 'stock-alert' ),
					),
				)
			);
		}
	}
}
