<?php
/**
 * Ajax Class
 *
 * @category Ajax
 * @package  Optemiz\Base
 * @author   Nazrul Islam Nayan <nazrulislamnayan@gmail.com>
 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
 * @since    1.0.0
 */

namespace Optemiz\Base;

use WP_Query;

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'Ajax' ) ) {
	/**
	 * Ajax class
	 *
	 * @class Ajax The class that manages ajax requests
	 *
	 * @category Ajax
	 * @package  Optemiz\Base
	 * @author   Nazrul Islam Nayan <nazrulislamnayan@gmail.com>
	 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
	 * @property null|object $_instance Instance of the class
	 */
	class Ajax {

		/**
		 * Instance of self
		 *
		 * @var Ajax
		 */
		public static $_instance = null;

		/**
		 * Settings
		 *
		 * @var Ajax
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
			do_action( 'patternly_ajax_loaded', $this );
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
			//add_action( 'wp_ajax_patternly_submit_form_data', array( $this, 'submit_form' ) );
			//add_action( 'wp_ajax_nopriv_patternly_submit_form_data', array( $this, 'submit_form' ) );

			add_action( 'wp_ajax_pat_save_pattern_as_favourite', array( $this, 'save_as_favourite' ) );
		}

		/**
		 * Initialize
		 */
		public function init() {
			$this->_settings = get_option( 'stock_alert_settings' );
		}

		/**
		 * Submit form
		 *
		 * @return void
		 */
		public function submit_form() {

			// check and validate nonce.
			if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST['_wpnonce'] ) ), 'patternly_form_nonce' ) ) {
				wp_send_json_error( __( 'Invalid nonce', 'stock-alert' ) );
			}

			// initialize meta data.
			$meta_data = array();

			// settings.
			$settings = $this->_settings;

			$subscribe_mail_subject = isset( $settings['subscribe_mail_subject'] ) && ! empty( $settings['subscribe_mail_subject'] ) ? $settings['subscribe_mail_subject'] : __( 'You subscribed to {product_name}', 'stock-alert' );
			$subscribe_mail_content = isset( $settings['subscribe_mail_content'] ) && ! empty( $settings['subscribe_mail_content'] ) ? $settings['subscribe_mail_content'] : wp_kses_post( 'Dear {subscriber_name}, <br />Thank you for subscribing to the #{product_name}. We will email you once product back in stock.' );

			// messages option values.
			$subscription_success_msg      = isset( $settings['subscription_success_message'] ) && ! empty( $settings['subscription_success_message'] ) ? $settings['subscription_success_message'] : __( 'Subscription Sucessful', 'stock-alert' );
			$email_already_subscribed_msg  = isset( $settings['email_exists_message'] ) && ! empty( $settings['email_exists_message'] ) ? $settings['email_exists_message'] : __( 'Email already exists!', 'stock-alert' );
			$name_field_empty_error_msg    = isset( $settings['name_field_empty_error'] ) && ! empty( $settings['name_field_empty_error'] ) ? $settings['name_field_empty_error'] : __( "Name field can't be empty!", 'stock-alert' );
			$email_field_empty_error_msg   = isset( $settings['email_field_empty_error'] ) && ! empty( $settings['email_field_empty_error'] ) ? $settings['email_field_empty_error'] : __( "Email field can't be empty!", 'stock-alert' );
			$email_field_invalid_error_msg = isset( $settings['invalid_email_error'] ) && ! empty( $settings['invalid_email_error'] ) ? $settings['invalid_email_error'] : __( 'Invalid Email!', 'stock-alert' );

			// check subscriber name value.
			if ( isset( $_POST['patternly_product_id'] ) || ! empty( $_POST['patternly_product_id'] ) ) {
				$product_id                  = sanitize_text_field( wp_unslash( $_POST['patternly_product_id'] ) );
				$meta_data['patternly_product_id'] = $product_id;
			} else {
				$message = __( 'No product found.', 'stock-alert' );
				wp_send_json_error( $message );
			}

			// check subscriber name value.
			if ( isset( $_POST['patternly_subscriber_name'] ) || ! empty( $_POST['patternly_subscriber_name'] ) ) {
				$subscriber_name                  = sanitize_text_field( wp_unslash( $_POST['patternly_subscriber_name'] ) );
				$meta_data['patternly_subscriber_name'] = $subscriber_name;
			} else {
				wp_send_json_error( $name_field_empty_error_msg );
			}

			// check subscriber email value.
			$subscriber_email = '';
			if ( isset( $_POST['patternly_subscriber_email'] ) || ! empty( $_POST['patternly_subscriber_email'] ) ) {
				$subscriber_email                  = sanitize_text_field( wp_unslash( $_POST['patternly_subscriber_email'] ) );
				$meta_data['patternly_subscriber_email'] = $subscriber_email;
			} else {
				wp_send_json_error( $email_field_empty_error_msg );
			}

			// check email already exists or not.
			$args = array(
				'post_type'      => 'saw-subscriber',
				'fields'         => 'ids',
				'posts_per_page' => -1,
				'relation'       => 'AND',
				'meta_query'     => array(
					'relation' => 'AND',
					array(
						'key'     => 'patternly_product_id',
						'value'   => $product_id,
						'compare' => '=',
					),
					array(
						'key'     => 'patternly_subscriber_email',
						'value'   => $subscriber_email,
						'compare' => '=',
					),
				),
			);

			$posts = new WP_Query( $args );

			// exit when email already exists.
			if ( count( $posts->posts ) > 0 ) {
				wp_send_json_error( $email_already_subscribed_msg );
				exit;
			}

			// update post and meta.
			if ( ! empty( $meta_data ) && ! empty( $subscriber_email ) ) {
				$args = array(
					'post_title'  => $subscriber_email,
					'post_type'   => 'saw-subscriber',
					'post_status' => 'patternly_subscribed', // @TODO need to be dynamic
				);

				$id = wp_insert_post( $args );

				if ( ! is_wp_error( $id ) ) {
					foreach ( $meta_data as $key => $value ) {
						update_post_meta( $id, $key, $value );
					}
				}
			}

			$insert_id = true;

			// send mail after successfully data inserted.
			if ( $insert_id && 0 !== $id ) {
				// set mail arguments.
				$args['email']              = $subscriber_email;
				$args['contact_name']       = $subscriber_name;
				$args['subject']            = $subscribe_mail_subject; //@TODO will be used of woocommerce mailing settings by defaults
				$args['content']            = $subscribe_mail_content; //@TODO will be used of woocommerce mailing settings by default
				$args['subscriber_post_id'] = $id;
				$args['product_id']         = $product_id;
				$args['contact_message']    = '';

				error_log('patternly_trigger_send_subscriber_mail');

				// send mail action.
				do_action( 'patternly_trigger_send_subscriber_mail', $args );

				// send copy mail.
				// do_action( 'patternly_trigger_send_copy_mail', $args );

				// send email success msg.
				wp_send_json_success( $subscription_success_msg );
			}
		}

		/**
		 * Save as favourite
		 *
		 * @return void
		 */
		public function save_as_favourite() {

			error_log(print_r($_POST, true));
			wp_send_json_success([
				'data' => [1, 2, 3],
				'message' => __('wow'),
			]);
			return;

			// check and validate nonce.
			if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST['_wpnonce'] ) ), 'patternly_form_nonce' ) ) {
				wp_send_json_error( __( 'Invalid nonce', 'stock-alert' ) );
			}

			// initialize meta data.
			$meta_data = array();

			// settings.
			$settings = $this->_settings;

			$subscribe_mail_subject = isset( $settings['subscribe_mail_subject'] ) && ! empty( $settings['subscribe_mail_subject'] ) ? $settings['subscribe_mail_subject'] : __( 'You subscribed to {product_name}', 'stock-alert' );
			$subscribe_mail_content = isset( $settings['subscribe_mail_content'] ) && ! empty( $settings['subscribe_mail_content'] ) ? $settings['subscribe_mail_content'] : wp_kses_post( 'Dear {subscriber_name}, <br />Thank you for subscribing to the #{product_name}. We will email you once product back in stock.' );

			// messages option values.
			$subscription_success_msg      = isset( $settings['subscription_success_message'] ) && ! empty( $settings['subscription_success_message'] ) ? $settings['subscription_success_message'] : __( 'Subscription Sucessful', 'stock-alert' );
			$email_already_subscribed_msg  = isset( $settings['email_exists_message'] ) && ! empty( $settings['email_exists_message'] ) ? $settings['email_exists_message'] : __( 'Email already exists!', 'stock-alert' );
			$name_field_empty_error_msg    = isset( $settings['name_field_empty_error'] ) && ! empty( $settings['name_field_empty_error'] ) ? $settings['name_field_empty_error'] : __( "Name field can't be empty!", 'stock-alert' );
			$email_field_empty_error_msg   = isset( $settings['email_field_empty_error'] ) && ! empty( $settings['email_field_empty_error'] ) ? $settings['email_field_empty_error'] : __( "Email field can't be empty!", 'stock-alert' );
			$email_field_invalid_error_msg = isset( $settings['invalid_email_error'] ) && ! empty( $settings['invalid_email_error'] ) ? $settings['invalid_email_error'] : __( 'Invalid Email!', 'stock-alert' );

			// check subscriber name value.
			if ( isset( $_POST['patternly_product_id'] ) || ! empty( $_POST['patternly_product_id'] ) ) {
				$product_id                  = sanitize_text_field( wp_unslash( $_POST['patternly_product_id'] ) );
				$meta_data['patternly_product_id'] = $product_id;
			} else {
				$message = __( 'No product found.', 'stock-alert' );
				wp_send_json_error( $message );
			}

			// check subscriber name value.
			if ( isset( $_POST['patternly_subscriber_name'] ) || ! empty( $_POST['patternly_subscriber_name'] ) ) {
				$subscriber_name                  = sanitize_text_field( wp_unslash( $_POST['patternly_subscriber_name'] ) );
				$meta_data['patternly_subscriber_name'] = $subscriber_name;
			} else {
				wp_send_json_error( $name_field_empty_error_msg );
			}

			// check subscriber email value.
			$subscriber_email = '';
			if ( isset( $_POST['patternly_subscriber_email'] ) || ! empty( $_POST['patternly_subscriber_email'] ) ) {
				$subscriber_email                  = sanitize_text_field( wp_unslash( $_POST['patternly_subscriber_email'] ) );
				$meta_data['patternly_subscriber_email'] = $subscriber_email;
			} else {
				wp_send_json_error( $email_field_empty_error_msg );
			}

			// check email already exists or not.
			$args = array(
				'post_type'      => 'saw-subscriber',
				'fields'         => 'ids',
				'posts_per_page' => -1,
				'relation'       => 'AND',
				'meta_query'     => array(
					'relation' => 'AND',
					array(
						'key'     => 'patternly_product_id',
						'value'   => $product_id,
						'compare' => '=',
					),
					array(
						'key'     => 'patternly_subscriber_email',
						'value'   => $subscriber_email,
						'compare' => '=',
					),
				),
			);

			$posts = new WP_Query( $args );

			// exit when email already exists.
			if ( count( $posts->posts ) > 0 ) {
				wp_send_json_error( $email_already_subscribed_msg );
				exit;
			}

			// update post and meta.
			if ( ! empty( $meta_data ) && ! empty( $subscriber_email ) ) {
				$args = array(
					'post_title'  => $subscriber_email,
					'post_type'   => 'saw-subscriber',
					'post_status' => 'patternly_subscribed', // @TODO need to be dynamic
				);

				$id = wp_insert_post( $args );

				if ( ! is_wp_error( $id ) ) {
					foreach ( $meta_data as $key => $value ) {
						update_post_meta( $id, $key, $value );
					}
				}
			}

			$insert_id = true;

			// send mail after successfully data inserted.
			if ( $insert_id && 0 !== $id ) {
				// set mail arguments.
				$args['email']              = $subscriber_email;
				$args['contact_name']       = $subscriber_name;
				$args['subject']            = $subscribe_mail_subject; //@TODO will be used of woocommerce mailing settings by defaults
				$args['content']            = $subscribe_mail_content; //@TODO will be used of woocommerce mailing settings by default
				$args['subscriber_post_id'] = $id;
				$args['product_id']         = $product_id;
				$args['contact_message']    = '';

				error_log('patternly_trigger_send_subscriber_mail');

				// send mail action.
				do_action( 'patternly_trigger_send_subscriber_mail', $args );

				// send copy mail.
				// do_action( 'patternly_trigger_send_copy_mail', $args );

				// send email success msg.
				wp_send_json_success( $subscription_success_msg );
			}
		}
	}
}
