<?php
/**
 * Settings Class
 *
 * @category Settings
 * @package  StockAlert
 * @author   Nazrul Islam Nayan <nazrulislamnayan@gmail.com>
 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
 * @link     https://github.com/nayanchamp7
 * @since    1.0.0
 */

namespace Optemiz\Base;

defined( 'ABSPATH' ) || exit;

/**
 * Settings class
 *
 * @class Settings The class that manages settings
 *
 * @category Settings
 * @package  StockAlert
 * @author   Nazrul Islam Nayan <nazrulislamnayan@gmail.com>
 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
 * @link     https://github.com/nayanchamp7
 * @property null|object $_instance Instance of the class
 */
class Settings extends AdminSettings {
	/**
	 * @return self
	 */
	public static function instance() {
		static $instance = null;

		if ( is_null( $instance ) ) {
			$instance = new self();
		}

		return $instance;
	}
}
