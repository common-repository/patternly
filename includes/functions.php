<?php
/**
 * Utility Functions.
 *
 * @package Optemiz
 */

/**
 * Update image url to local.
 *
 * @param string $content pattern content.
 * 
 * @return string
 */
function pat_update_image_url_to_local($content) {

    if(empty($content)) {
        return $content;
    }

    // match expression
    $regex = '/src="([^"]*)"/';

    // all images link matches.
    preg_match_all( $regex, $content, $matches );

    // reversing the matches array.
    $matches = array_reverse($matches);

    if( isset($matches[0]) && is_array($matches[0]) ) {
        $post_images = $matches[0];

        foreach($post_images as $post_image_link) {
            $attached_img_id    = pat_insert_attachment_from_url($post_image_link);
            $attached_img_url   = wp_get_attachment_image_url($attached_img_id, 'full');

            $content = str_replace($post_image_link, $attached_img_url, $content);
        }
    }

    return $content;

}

/**
 * Insert an attachment from a URL address.
 *
 * @param  string   $url            The URL address.
 * @param  int|null $parent_post_id The parent post ID (Optional).
 * @return int|false                The attachment ID on success. False on failure.
 */
function pat_insert_attachment_from_url( $url, $parent_post_id = null ) {

	if ( ! class_exists( 'WP_Http' ) ) {
		require_once ABSPATH . WPINC . '/class-http.php';
	}

    // validate if valid URL is passed
    if ( filter_var($url, FILTER_VALIDATE_URL) == FALSE ) {
        return false;
    }

    //sanitize url, remove everything unneccesarry after the extension type
    $url = preg_replace(
        "/(.+(\.(jpg|gif|jp2|png|bmp|jpeg|svg)))(.*)$/",
        '${1}',
        $url
    );

	$http     = new WP_Http();
	$response = $http->request( $url );
	if ( 200 !== $response['response']['code'] ) {
		return false;
	}

	$upload = wp_upload_bits( basename( $url ), null, $response['body'] );

	if ( ! empty( $upload['error'] ) ) {
		return false;
	}

	$file_path        = $upload['file'];
	$file_name        = basename( $file_path );
	$file_type        = wp_check_filetype( $file_name, null );
	$attachment_title = sanitize_file_name( pathinfo( $file_name, PATHINFO_FILENAME ) );
	$wp_upload_dir    = wp_upload_dir();

	$post_info = array(
		'guid'           => $wp_upload_dir['url'] . '/' . $file_name,
		'post_mime_type' => $file_type['type'],
		'post_title'     => $attachment_title,
		'post_content'   => '',
		'post_status'    => 'inherit',
	);

	// Create the attachment.
	$attach_id = wp_insert_attachment( $post_info, $file_path, $parent_post_id );

	// Include image.php.
	require_once ABSPATH . 'wp-admin/includes/image.php';

	// Generate the attachment metadata.
	$attach_data = wp_generate_attachment_metadata( $attach_id, $file_path );

	// Assign metadata to attachment.
	wp_update_attachment_metadata( $attach_id, $attach_data );

	return $attach_id;

}

/**
 * Get dependency plugin basename.
 * 
 * @param string $plugin_slug plugin slug.
 * 
 * @return string|boolean
 */
function pat_get_dependency_plugin_basename($plugin_slug) {

	$dependency_plugins = pat_get_dependency_plugins_list();

	if(isset($dependency_plugins[$plugin_slug])) {
		return $dependency_plugins[$plugin_slug]['file'];
	}

	return false;
}

/**
 * Get dependency plugins slug.
 * 
 * @return string|boolean
 */
function pat_get_dependency_plugins_slug() {

    $slugs = [];
	$dependency_plugins = pat_get_dependency_plugins_list();

    if(!empty($dependency_plugins)) {
        $slugs = array_keys($dependency_plugins);
    }

	return $slugs;
}

/**
 * Get dependency plugin list.
 * 
 * @return array
 */
function pat_get_dependency_plugins_list() {
	$dependency_plugins = [
		'ultimate-addons-for-gutenberg' => [
            'name' => __('Spectra – WordPress Gutenberg Blocks', 'patternly'),
            'file' => 'ultimate-addons-for-gutenberg/ultimate-addons-for-gutenberg.php'
        ],
		'fluentform' => [
            'name' => __('Fluent Forms', 'patternly'),
            'file' => 'fluentform/fluentform.php'
        ],
	];

	return apply_filters('pat_filter_dependency_plugins_list', $dependency_plugins);
}

/**
 * Get activate plugin lists.
 * 
 * @return array
 */
function pat_get_activated_plugin_list() {
	$active_plugins = get_option('active_plugins');
	$plugin_list = array();

	foreach ($active_plugins as $plugin) {
		$plugin_list[] = dirname($plugin);
	}

	return apply_filters('pat_filter_activated_plugin_list', $plugin_list);
}

/**
 * Fetch default data
 * 
 * @return array
 */
function pat_fetch_default_data($post_type = 'page') {

	$file_path = PATTERNLY_PLUGIN_URL . '/src/json/default-'. $post_type .'-templates.json';

	$string = file_get_contents($file_path);
	$result = json_decode($string,true);

	if(isset($result['data'])) {
		$data = wp_list_pluck($result['data'], 'slug');
	}

	return $data;
}
