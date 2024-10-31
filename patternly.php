<?php
/**
 *  Patternly
 *
 * @package Patternly
 * @author  Nazrul Islam Nayan <nazrulislamnayan@gmail.com>
 *
 * Plugin Name:       Patternly - Gutenberg Starter Templates, Patterns, WordPress Landing Pages & Sites
 * Plugin URI:        https://optemiz.com
 * Description:       Gutenberg template library to build full sites with starter templates, patterns, landing pages and ready sites for WordPress block editor.
 * Version:           1.1.3
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Author:            Optemiz
 * Author URI:        https://optemiz.com
 * Text Domain:       patternly
 * License:           GPL v3 or later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Domain Path:       /languages
 */

/**
 * Bootstrap the plugin.
 */
defined( 'ABSPATH' ) || die( 'Keep Silent' );

use Optemiz\Base\Plugin;

if ( ! defined( 'PATTERNLY_VERSION' ) ) {
	define( 'PATTERNLY_VERSION', '1.1.3' );
}

if ( ! defined( 'PATTERNLY_FILE' ) ) {
	define( 'PATTERNLY_FILE', __FILE__ );
}

if ( ! defined( 'PATTERNLY_PLUGIN_URL' ) ) {
	define( 'PATTERNLY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

if ( ! defined( 'PATTERNLY_PLUGIN_DIR' ) ) {
	define( 'PATTERNLY_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
}

if ( ! defined( 'PATTERNLY_PLUGIN_PATH' ) ) {
	define( 'PATTERNLY_PLUGIN_PATH', untrailingslashit(plugin_dir_path(__FILE__)) );
}

if ( ! defined( 'PATTERNLY_PLUGIN_DIRNAME' ) ) {
	define( 'PATTERNLY_PLUGIN_DIRNAME', dirname( plugin_basename( __FILE__ ) ) );
}

if ( ! defined( 'PATTERNLY_PLUGIN_BASENAME' ) ) {
	define( 'PATTERNLY_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
}

if ( ! defined( 'PATTERNLY_REMOTE_URL' ) ) {
	define( 'PATTERNLY_REMOTE_URL', "https://patternly.optemiz.com" );
}

if ( ! defined( 'PATTERNLY_PRO_URL' ) ) {
	define( 'PATTERNLY_PRO_URL', "https://optemiz.com/patternly" );
}

/**
 * Bootstrap the plugin.
 */
require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';

/**
 * Initialize the plugin tracker
 *
 * @return void
 */
function appsero_init_tracker_patternly() {

    if ( ! class_exists( 'Appsero\Client' ) ) {
    	require_once __DIR__ . '/appsero/src/Client.php';
    }

    $client = new Appsero\Client( '4afaf912-03e0-48f3-a562-c3826040cf21', 'Patternly &#8211; WordPress Pattern Library for Gutenberg', __FILE__ );

    // Active insights
    $client->insights()->init();

}

appsero_init_tracker_patternly();

if ( class_exists( 'Optemiz\Base\Plugin' ) ) {
	/**
	 * Plugin class init
	 */
	function patternly_init() {
		// Include the main class.
		return Plugin::instance();
	}

	add_action( 'plugins_loaded', 'patternly_init' );
}

/**
 * Is pro activated
 * 
 * @return boolean
 */
function pat_is_pro_activated() {
	$apl = get_option('active_plugins');
	$plugins = get_plugins();
	$activated_plugins = array();

	foreach ($apl as $p) {           
		if(isset($plugins[$p])) {
			array_push($activated_plugins, $plugins[$p]);
		}           
	}
	
	if(!empty($activated_plugins)) {
		$activated_plugins = wp_list_pluck($activated_plugins, 'TextDomain');

		if(in_array('patternly-pro', $activated_plugins)) {
			return true;
		}
	}

	return false;
}
