<?php
/*
Plugin Name: Voting Like
Plugin URI: 
Description: This plugin is for job test.
Version: 1.0
Author: Adeel Nazar
Author URI: http://www.kodeforest.com
License: 
Text-Domain: wp-voting
*/

//Voting and Likes
register_activation_hook(__FILE__,'wpha_create_voting_table');
function wpha_create_voting_table(){
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	global $wpdb;
	
	// for payment transaction
	$table_name = 'wp_votusers';
	$sql = "CREATE TABLE $table_name (
		`day` INT(2), 
		`voter` VARCHAR(15), 
		`item` VARCHAR(200) NOT NULL DEFAULT ''
	) DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;";
	dbDelta( $sql );	

	$table_name = 'wp_voting';
	$sql = "CREATE TABLE $table_name (
		`item` VARCHAR(200) PRIMARY KEY NOT NULL DEFAULT '',
		`vote` INT(10) NOT NULL DEFAULT 0,
		`nvotes` INT(9) NOT NULL DEFAULT 1
	) DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;";
	dbDelta( $sql );	
	
}

//////////////////////////////////////////////////////////////////
// Voting Script
//////////////////////////////////////////////////////////////////
add_shortcode('voting_shortcode', 'wpha_voting_shortcode');
function wpha_voting_shortcode($atts, $content = null) {
	global $data;

	extract(shortcode_atts(array(
		
	), $atts));
	$html = '';
	
	wp_register_script('wpha-voting', plugin_dir_url( __FILE__ ).'asserts/voting.js', false, '1.0', true);
	wp_localize_script('wpha-voting', 'ajax_var', array( 'PLUGIN_PATH' => plugin_dir_url( __FILE__ ) ));
	wp_enqueue_script('wpha-voting');
	wp_enqueue_style( 'wpha-voting', plugin_dir_url( __FILE__ ) . 'asserts/voting.css' );  //Voting Script
	
	static $voting_counter = 1;
	
		$html .= '<div class="vot_updown1" id="vt_voting_'.esc_attr(get_the_ID()).'"></div>';
	
	$voting_counter++;

	return $html;
}


register_deactivation_hook(__FILE__,'wpha_create_deactivatation_hook');
function wpha_create_deactivatation_hook(){
	global $wpdb;
	$table_name = 'wp_votusers';
	$sql = "DROP TABLE IF EXISTS $table_name";
	$wpdb->query($sql);
	
	$table_name = 'wp_voting';
	$sql = "DROP TABLE IF EXISTS $table_name";
	$wpdb->query($sql);
	
}