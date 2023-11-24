<?php
/*
Plugin Name: Quiz
Description: Give your readers a multiple choice question.
Version: 1.0
Author: banban-22
Author URI: ***
 */

if (!defined('ABSPATH'))
    exit;

class AreYouPayingAttention
{
    function __construct()
    {
        // for css
        // add_action('enqueue_block_editor_assets', array($this, 'adminAssets'));

        add_action('init', array($this, 'adminAssets'));
    }

    function adminAssets()
    {
        // for js
        // wp_enqueue_script('ournewblocktype', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element'));

        wp_register_style('quizeditcss', plugin_dir_url(__FILE__) . 'build/index.css');
        wp_register_script('ournewblocktype', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));
        register_block_type('ourplugin/are-you-paying-attention', array('editor_script' => 'ournewblocktype', 'editor_style' => 'quizeditcss', 'render_callback' => array($this, 'theHTML')));
    }

    function theHTML($attributes)
    {
        if (!is_admin()) {
            wp_enqueue_script('attentionFrontend', plugin_dir_url(__FILE__) . 'build/frontend.js', array('wp-element'));
            wp_enqueue_style('attentionFrontendStyles', plugin_dir_url(__FILE__) . 'build/frontend.css');
        }

        ob_start(); ?>
        <div class="paying-attention-update-me">
            <pre syle="display: none">
                            <?php echo wp_json_encode($attributes); ?>
                            </pre>
        </div>
        <?php return ob_get_clean();
    }
}

$areYouPayingAttention = new AreYouPayingAttention();
?>