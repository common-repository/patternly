<?php
/**
 * Api Class
 *
 * @category Api
 * @package  Optemiz\Base
 * @author   Nazrul Islam Nayan <nazrulislamnayan@gmail.com>
 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
 * @link     https://github.com/nayanchamp7/patternly
 * @since    1.0.0
 */

namespace Optemiz\Base;

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'Api' ) ) {
	/**
	 * Api class
	 *
	 * @class Api The class that manages API requests
	 *
	 * @category Api
	 * @package  Optemiz\Base
	 * @author   Nazrul Islam Nayan <nazrulislamnayan@gmail.com>
	 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
	 * @link     https://github.com/nayanchamp7
	 * @property null|object $_instance Instance of the class
	 */
	class Api {

		/**
		 * Instance of self
		 *
		 * @var Api
		 */
		public static $_instance = null;

		/**
		 * Current user id.
		 */
		public $current_user_id = 0;

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
			do_action( 'patternly_api_loaded', $this );
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
			add_action('rest_api_init',  [$this, 'register_api']);
		}

		/**
		 * Register API Endpoints
		 *
		 * @return void
		 */
        function register_api() {

			$this->current_user_id = get_current_user_id();

            //register endpoint to save favourite templates.
            register_rest_route(
                'optemiz/v1',
                '/patternly/save-as-favourite',
                array(
                    'methods' => \WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'save_as_favourite'],
                    'permission_callback' => '__return_true',
                )
            );

			register_rest_route(
                'optemiz/v1',
                '/patternly/get-favourite-templates',
                array(
                    'methods' => \WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'get_favourite_templates'],
                    'permission_callback' => '__return_true',
                )
            );

			//register endpoint to import template content.
            register_rest_route(
                'optemiz/v1',
                '/patternly/get_template',
                array(
                    'methods' => \WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_template'],
                    'permission_callback' => '__return_true',
                )
            );

			register_rest_route(
                'optemiz/v1',
                '/patternly/activate_plugins',
                array(
                    'methods' => \WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'activate_plugins'],
                    'permission_callback' => '__return_true',
                )
            );
        }

		/**
		 * Save as favourite
		 */
		function save_as_favourite($request) {
			$body = $request->get_body();

			//validate nonce.
			if(isset($body['nonce'])) {
				if(!wp_verify_nonce($body['nonce'], 'patternly-admin')) {
					error_log('nonce is not valid!');
					return;
				}
			}

			//post type.
			$post_type = $request->get_param('post_type');
			
			//template slug.
			$template_slug = $request->get_param('template_slug');

			if( "pattern" === $post_type ) {
				$option_name = "pat_favourite_patterns";
			}else {
				$option_name = "pat_favourite_pages";
			}

			$fav_templates = get_option($option_name);
			$fav_templates = !empty($fav_templates) ? $fav_templates : [];
			
			$message = __('Something is wrong during pattern saved!', 'patternly');
			if(!empty($body)) {
				$body = json_decode($body, true);

				if(isset($body['template_slug']) && !empty($body['template_slug'])) {
					$template_slug = sanitize_text_field($body['template_slug']);
					array_push($fav_templates, $template_slug);

					//unique slug.
					$fav_templates = array_unique($fav_templates);

					//update option.
					$pattarn_saved = update_option($option_name, $fav_templates);

					//set message.
					if($pattarn_saved) {
						$message = __('Favourite Template saved!', 'patternly');
					}
				}
			}

			return new \WP_REST_Response([
				'message' => $message,
				'template_slug' => !empty($template_slug) ? $template_slug : '',
            ]);
		}

		/**
		 * Get favourite templates
		 */
		function get_favourite_templates($request) {
			$body = $request->get_body();

			//validate nonce.
			if(isset($body['nonce'])) {
				if(!wp_verify_nonce($body['nonce'], 'patternly-admin')) {
					error_log('nonce is not valid!');
					return;
				}
			}

			//post type.
			$post_type = $request->get_param('post_type');

			if( "pattern" === $post_type ) {
				$option_name = "pat_favourite_patterns";
			}else {
				$option_name = "pat_favourite_pages";
			}

			$fav_templates = get_option($option_name);
			$fav_templates = !empty($fav_templates) ? $fav_templates : [];

			return new \WP_REST_Response([
				'templates' => implode(',', $fav_templates),
				'data' => $fav_templates,
				'count' => count($fav_templates),
            ]);
		}

		/**
		 * Import content
		 */
		function get_template($request) {

			// template slug.
            $template_slug = $request->get_param('template_slug');
            $template_slug = isset($template_slug) ? wp_unslash( sanitize_text_field($template_slug) ) : '';

			if(empty($template_slug)) {
				return;
			}
			
			// post type.
            $post_type = $request->get_param('post_type');
            $post_type = isset($post_type) ? wp_unslash( sanitize_text_field($post_type) ) : 'pattern';

			if(!empty($template_slug)) {

				$url = PATTERNLY_REMOTE_URL . '/wp-json/optemiz/v1/patternly/import_template';
				$url = add_query_arg('template_slug', $template_slug, $url);
				$url = add_query_arg('post_type', $post_type, $url);

				error_log('import template > url');
				error_log(print_r($url, true));

				// get pattern content with remote image url.
				$response = wp_remote_get($url);

				// check for errors.
				if ( is_wp_error( $response ) ) {
					$error_message = $response->get_error_message();
				} else {
					// get response body.
					$content = wp_remote_retrieve_body( $response );

					$content = json_decode($content, true);

					if(isset($content['content'])) {
						$content = $content['content'];
	
						// update image url to local.
						$content = pat_update_image_url_to_local($content);
					}
				}
			}

			$data = [
                "content" => $content,
            ];
			
            return new \WP_REST_Response($data);
		}

		/**
		 * Activate plugins.
		 *
		 * @return mixed
		 */
		function activate_plugins($request) {

			$body = $request->get_body();
			$body = json_decode($body, true);
		
			$current_user_id = $this->current_user_id;

			//skip if user has no authorization.
			if(!user_can($current_user_id, 'manage_options')) {
				return new \WP_REST_Response([
					'msg' => __('Current user has no authorization to access data.', 'patternly'),
				]);
			}

			// @TODO need to check current user capabilities.
			if (!isset($body['plugin_slug'])) {
				return new \WP_REST_Response([
					'message' => __('Plugin slug is missing.', 'patternly')
				]);
			}
		
			$plugin_slug = sanitize_text_field($body['plugin_slug']);

			$plugin_files = pat_get_dependency_plugins_list();
		
			error_log("plugin_slug: " . $plugin_slug);
		
			if (!isset($plugin_files[$plugin_slug])) {
				return new \WP_REST_Response([
					'message' => sprintf(__('Invalid plugin slug: %s', 'patternly'), $plugin_slug)
				]);
			}
		
			if (!empty($plugin_slug)) {
				$plugin_name = pat_get_dependency_plugin_basename($plugin_slug);

				require_once ABSPATH . 'wp-admin/includes/file.php';
				require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
				require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
		
				WP_Filesystem();
		
				$skin = new \Automatic_Upgrader_Skin();
				$upgrader = new \WP_Upgrader($skin);
		
				$installed_plugins = array_keys(\get_plugins());
		
				$plugin_file = $plugin_files[$plugin_slug]['file'];

				error_log("plugin_file: " . $plugin_file);
		
				$installed  	= false;
				$activated   	= false;
		
				// See if the plugin is installed already.
				if (isset($installed_plugins) && in_array($plugin_file, $installed_plugins)) {
					$installed 	= true;
					$activated 	= is_plugin_active($plugin_file);
				}
		
				// Install the plugin.
				if (!$installed) {
					// start buffering.
					ob_start();
		
					try {
						$plugin_information = plugins_api(
							'plugin_information',
							array(
								'slug'   => $plugin_slug,
								'fields' => array(
									'short_description' => false,
									'sections'          => false,
									'requires'          => false,
									'rating'            => false,
									'ratings'           => false,
									'downloaded'        => false,
									'last_updated'      => false,
									'added'             => false,
									'tags'              => false,
									'homepage'          => false,
									'donate_link'       => false,
									'author_profile'    => false,
									'author'            => false,
								),
							)
						);
		
						if (is_wp_error($plugin_information)) {
							throw new \Exception($plugin_information->get_error_message());
						}
		
						$package = $plugin_information->download_link;
						$download = $upgrader->download_package($package);
		
						if (is_wp_error($download)) {
							throw new \Exception($download->get_error_message());
						}
		
						$working_dir = $upgrader->unpack_package($download, true);
		
						if (is_wp_error($working_dir)) {
							throw new \Exception($working_dir->get_error_message());
						}
		
						$result = $upgrader->install_package(
							array(
								'source'                      => $working_dir,
								'destination'                 => WP_PLUGIN_DIR,
								'clear_destination'           => false,
								'abort_if_destination_exists' => false,
								'clear_working'               => true,
								'hook_extra'                  => array(
									'type'   => 'plugin',
									'action' => 'install',
								),
							)
						);
		
						if (is_wp_error($result)) {
							throw new \Exception($result->get_error_message());
						}
		
					} catch (\Exception $e) {
					}
		
					// clean buffering.
					ob_end_clean();
				}
		
				wp_clean_plugins_cache();

				$success = true;
				$message = sprintf(__('%s Plugin activated!', 'patternly'), $plugin_name);
		
				// Activate the plugin.
				if (!$activated) {
					$success 	= true;
					$result 	= activate_plugin($plugin_file);
		
					if (is_wp_error($result)) {
						$message = $result->get_error_message();
					}
				}

				return new \WP_REST_Response([
					'success' => $success,
					'message' => $message
				]);
			}
		}
	}
}
