<?php
	/**
	 * Plugin Class.
	 *
	 * @package    Patternly
	 * @subpackage Base
	 */

	namespace Optemiz\Base;

	defined( 'ABSPATH' ) || die( 'Keep Silent' );


	/**
	 * Class Plugin.
	 */
class Plugin {

	/**
	 * Class Instance.
	 *
	 * @var Plugin
	 */
	protected static $instance = null;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->includes();
		$this->hooks();
		$this->init();
		do_action('patternly_loaded', $this);
	}

	/**
	 * Plugin Version.
	 */
	public function version() {
		return esc_attr( PATTERNLY_PLUGIN_VERSION );
	}

	/**
	 * Set constant if not defined and prevent reassign
	 *
	 * @param string $name  Constant name.
	 * @param array  $value Constant value.
	 *
	 * @return void No Return.
	 */
	protected function define( $name, $value ) {
		if ( ! defined( $name ) ) {
			define( $name, $value );
		}
	}

	/**
	 * Instance.
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Includes.
	 */
	public function includes() {
	}

	/**
	 * Initialize
	 */
	public function init() {
		new Assets();
		new Api();

		// if ( is_admin() ) {
		// 	new Admin();
		// 	new Settings();
		// } else {
		// 	new Frontend();
		// }
	}

	/**
	 * Hooks.
	 */
	public function hooks() {
		// Register with hook.
		add_action( 'init', array( $this, 'language' ), 1 );
	}

	/**
	 * Language
	 */
	public function language() {
		load_plugin_textdomain( 'patternly', false, $this->plugin_path() . '/languages' );
	}

	/**
	 * Get Plugin basename directory name
	 */
	public function basename() {
		return basename( dirname( PATTERNLY_FILE ) );
	}

	/**
	 * Get Plugin basename
	 */
	public function plugin_basename() {
		return plugin_basename( PATTERNLY_FILE );
	}

	/**
	 * Get Plugin directory name
	 */
	public function plugin_dirname() {
		return dirname( plugin_basename( PATTERNLY_FILE ) );
	}

	/**
	 * Get Plugin directory path
	 */
	public function plugin_path() {
		return untrailingslashit( plugin_dir_path( PATTERNLY_FILE ) );
	}

	/**
	 * Get Plugin directory url
	 */
	public function plugin_url() {
		return untrailingslashit( plugin_dir_url( PATTERNLY_FILE ) );
	}

	/**
	 * Get Plugin image url
	 */
	public function images_url() {
		return untrailingslashit( plugin_dir_url( PATTERNLY_FILE ) . 'images' );
	}

	/**
	 * Get WordPress.org asset url
	 *
	 * @param string $file Asset file name.
	 *
	 * @return string WordPress.org file url
	 */
	public function org_assets_url( $file = '' ) {
		return 'https://ps.w.org/patternly/assets' . $file . '?ver=' . $this->version();
	}

	/**
	 * Get Asset URL
	 */
	public function assets_url() {
		return untrailingslashit( plugin_dir_url( PATTERNLY_FILE ) . 'assets' );
	}

	/**
	 * Get Asset path
	 */
	public function assets_path() {
		return $this->plugin_path() . '/assets';
	}

	/**
	 * Get Build URL
	 */
	public function build_url() {
		return untrailingslashit( plugin_dir_url( PATTERNLY_FILE ) . 'build' );
	}

	/**
	 * Get Build path
	 */
	public function build_path() {
		return $this->plugin_path() . '/build';
	}

	/**
	 * Get Asset version
	 *
	 * @param string $file Asset file name.
	 *
	 * @return numeric asset file make time.
	 */
	public function assets_version( $file ) {
		return filemtime( $this->assets_path() . $file );
	}

	/**
	 * Get Include path
	 */
	public function include_path() {
		return untrailingslashit( plugin_dir_path( PATTERNLY_FILE ) . 'includes' );
	}
}
