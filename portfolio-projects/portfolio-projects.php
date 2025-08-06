<?php
/**
 * Plugin Name: Portfolio Projects
 * Plugin URI: https://your-website.com
 * Description: Custom post type for portfolio projects with custom fields using WordPress native meta boxes
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 * Text Domain: portfolio-projects
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class PortfolioProjects {
    
    public function __construct() {
        add_action('init', array($this, 'register_projects_post_type'));
        add_action('add_meta_boxes', array($this, 'add_project_meta_boxes'));
        add_action('save_post', array($this, 'save_project_meta_boxes'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_styles'));
        add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));
        
        // Add shortcode for displaying projects
        add_shortcode('portfolio_projects', array($this, 'portfolio_shortcode'));
    }
    
    // Register Custom Post Type
    public function register_projects_post_type() {
        $labels = array(
            'name'                  => _x('Projects', 'Post Type General Name', 'portfolio-projects'),
            'singular_name'         => _x('Project', 'Post Type Singular Name', 'portfolio-projects'),
            'menu_name'             => __('Projects', 'portfolio-projects'),
            'name_admin_bar'        => __('Project', 'portfolio-projects'),
            'archives'              => __('Project Archives', 'portfolio-projects'),
            'attributes'            => __('Project Attributes', 'portfolio-projects'),
            'parent_item_colon'     => __('Parent Project:', 'portfolio-projects'),
            'all_items'             => __('All Projects', 'portfolio-projects'),
            'add_new_item'          => __('Add New Project', 'portfolio-projects'),
            'add_new'               => __('Add New', 'portfolio-projects'),
            'new_item'              => __('New Project', 'portfolio-projects'),
            'edit_item'             => __('Edit Project', 'portfolio-projects'),
            'update_item'           => __('Update Project', 'portfolio-projects'),
            'view_item'             => __('View Project', 'portfolio-projects'),
            'view_items'            => __('View Projects', 'portfolio-projects'),
            'search_items'          => __('Search Project', 'portfolio-projects'),
            'not_found'             => __('Not found', 'portfolio-projects'),
            'not_found_in_trash'    => __('Not found in Trash', 'portfolio-projects'),
            'featured_image'        => __('Project Image', 'portfolio-projects'),
            'set_featured_image'    => __('Set project image', 'portfolio-projects'),
            'remove_featured_image' => __('Remove project image', 'portfolio-projects'),
            'use_featured_image'    => __('Use as project image', 'portfolio-projects'),
        );
        
        $args = array(
            'label'                 => __('Project', 'portfolio-projects'),
            'description'           => __('Portfolio Projects', 'portfolio-projects'),
            'labels'                => $labels,
            'supports'              => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'taxonomies'            => array('project_category', 'project_tag'),
            'hierarchical'          => false,
            'public'                => true,
            'show_ui'               => true,
            'show_in_menu'          => true,
            'menu_position'         => 5,
            'menu_icon'             => 'dashicons-portfolio',
            'show_in_admin_bar'     => true,
            'show_in_nav_menus'     => true,
            'can_export'            => true,
            'has_archive'           => true,
            'exclude_from_search'   => false,
            'publicly_queryable'    => true,
            'capability_type'       => 'post',
            'show_in_rest'          => true,
            'rewrite'               => array(
                'slug' => 'projects',
                'with_front' => false,
            ),
        );
        
        register_post_type('projects', $args);
        
        // Register custom taxonomies
        $this->register_project_taxonomies();
    }
    
    // Register Project Taxonomies
    public function register_project_taxonomies() {
        // Project Categories
        $cat_labels = array(
            'name'              => _x('Project Categories', 'taxonomy general name'),
            'singular_name'     => _x('Project Category', 'taxonomy singular name'),
            'search_items'      => __('Search Categories'),
            'all_items'         => __('All Categories'),
            'parent_item'       => __('Parent Category'),
            'parent_item_colon' => __('Parent Category:'),
            'edit_item'         => __('Edit Category'),
            'update_item'       => __('Update Category'),
            'add_new_item'      => __('Add New Category'),
            'new_item_name'     => __('New Category Name'),
            'menu_name'         => __('Categories'),
        );
        
        register_taxonomy('project_category', array('projects'), array(
            'hierarchical'      => true,
            'labels'            => $cat_labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'show_in_rest'      => true,
            'rewrite'           => array('slug' => 'project-category'),
        ));
        
        // Project Tags
        $tag_labels = array(
            'name'              => _x('Project Tags', 'taxonomy general name'),
            'singular_name'     => _x('Project Tag', 'taxonomy singular name'),
            'search_items'      => __('Search Tags'),
            'all_items'         => __('All Tags'),
            'edit_item'         => __('Edit Tag'),
            'update_item'       => __('Update Tag'),
            'add_new_item'      => __('Add New Tag'),
            'new_item_name'     => __('New Tag Name'),
            'menu_name'         => __('Tags'),
        );
        
        register_taxonomy('project_tag', array('projects'), array(
            'hierarchical'      => false,
            'labels'            => $tag_labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'show_in_rest'      => true,
            'rewrite'           => array('slug' => 'project-tag'),
        ));
    }
    
    // Add Meta Boxes
    public function add_project_meta_boxes() {
        add_meta_box(
            'project_details',
            __('Project Details', 'portfolio-projects'),
            array($this, 'project_details_callback'),
            'projects',
            'normal',
            'high'
        );
        
        add_meta_box(
            'project_gallery',
            __('Project Gallery', 'portfolio-projects'),
            array($this, 'project_gallery_callback'),
            'projects',
            'side',
            'default'
        );
    }
    
    // Project Details Meta Box Callback
    public function project_details_callback($post) {
        // Add nonce for security
        wp_nonce_field('save_project_details', 'project_details_nonce');
        
        // Get current values
        $client_name = get_post_meta($post->ID, '_client_name', true);
        $project_url = get_post_meta($post->ID, '_project_url', true);
        $completion_date = get_post_meta($post->ID, '_completion_date', true);
        $technology_used = get_post_meta($post->ID, '_technology_used', true);
        $project_status = get_post_meta($post->ID, '_project_status', true);
        $project_duration = get_post_meta($post->ID, '_project_duration', true);
        
        // Display fields
        echo '<table class="form-table">';
        
        echo '<tr>';
        echo '<th><label for="client_name">' . __('Client Name', 'portfolio-projects') . ':</label></th>';
        echo '<td><input type="text" id="client_name" name="client_name" value="' . esc_attr($client_name) . '" style="width: 100%;" placeholder="' . __('Enter client name', 'portfolio-projects') . '" /></td>';
        echo '</tr>';
        
        echo '<tr>';
        echo '<th><label for="project_url">' . __('Project URL', 'portfolio-projects') . ':</label></th>';
        echo '<td><input type="url" id="project_url" name="project_url" value="' . esc_attr($project_url) . '" style="width: 100%;" placeholder="https://example.com" /></td>';
        echo '</tr>';
        
        echo '<tr>';
        echo '<th><label for="completion_date">' . __('Completion Date', 'portfolio-projects') . ':</label></th>';
        echo '<td><input type="date" id="completion_date" name="completion_date" value="' . esc_attr($completion_date) . '" /></td>';
        echo '</tr>';
        
        echo '<tr>';
        echo '<th><label for="technology_used">' . __('Technology Used', 'portfolio-projects') . ':</label></th>';
        echo '<td><input type="text" id="technology_used" name="technology_used" value="' . esc_attr($technology_used) . '" style="width: 100%;" placeholder="' . __('e.g., WordPress, PHP, JavaScript, React', 'portfolio-projects') . '" /></td>';
        echo '</tr>';
        
        echo '<tr>';
        echo '<th><label for="project_status">' . __('Project Status', 'portfolio-projects') . ':</label></th>';
        echo '<td>';
        echo '<select id="project_status" name="project_status" style="width: 100%;">';
        echo '<option value="">' . __('Select Status', 'portfolio-projects') . '</option>';
        echo '<option value="completed"' . selected($project_status, 'completed', false) . '>' . __('Completed', 'portfolio-projects') . '</option>';
        echo '<option value="in-progress"' . selected($project_status, 'in-progress', false) . '>' . __('In Progress', 'portfolio-projects') . '</option>';
        echo '<option value="on-hold"' . selected($project_status, 'on-hold', false) . '>' . __('On Hold', 'portfolio-projects') . '</option>';
        echo '</select>';
        echo '</td>';
        echo '</tr>';
        
        echo '<tr>';
        echo '<th><label for="project_duration">' . __('Project Duration', 'portfolio-projects') . ':</label></th>';
        echo '<td><input type="text" id="project_duration" name="project_duration" value="' . esc_attr($project_duration) . '" style="width: 100%;" placeholder="' . __('e.g., 3 months, 2 weeks', 'portfolio-projects') . '" /></td>';
        echo '</tr>';
        
        echo '</table>';
    }
    
    // Project Gallery Meta Box Callback
    public function project_gallery_callback($post) {
        $gallery_images = get_post_meta($post->ID, '_project_gallery', true);
        
        echo '<div id="project-gallery-container">';
        echo '<input type="hidden" id="project_gallery" name="project_gallery" value="' . esc_attr($gallery_images) . '" />';
        echo '<button type="button" class="button" id="upload-gallery-button">' . __('Add Gallery Images', 'portfolio-projects') . '</button>';
        echo '<div id="gallery-images-preview">';
        
        if ($gallery_images) {
            $images = explode(',', $gallery_images);
            foreach ($images as $image_id) {
                if ($image_id) {
                    $image_url = wp_get_attachment_image_src($image_id, 'thumbnail');
                    if ($image_url) {
                        echo '<div class="gallery-image" data-id="' . $image_id . '">';
                        echo '<img src="' . $image_url[0] . '" alt="" style="width: 80px; height: 80px; object-fit: cover; margin: 5px;" />';
                        echo '<span class="remove-image" style="cursor: pointer; color: red;">×</span>';
                        echo '</div>';
                    }
                }
            }
        }
        
        echo '</div>';
        echo '</div>';
    }
    
    // Save Meta Box Data
    public function save_project_meta_boxes($post_id) {
        // Verify nonce
        if (!isset($_POST['project_details_nonce']) || !wp_verify_nonce($_POST['project_details_nonce'], 'save_project_details')) {
            return;
        }
        
        // Check if autosave
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        // Check user permissions
        if (isset($_POST['post_type']) && 'projects' == $_POST['post_type']) {
            if (!current_user_can('edit_page', $post_id)) {
                return;
            }
        } else {
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
        }
        
        // Save custom fields
        $fields = array(
            'client_name' => 'sanitize_text_field',
            'project_url' => 'esc_url_raw',
            'completion_date' => 'sanitize_text_field',
            'technology_used' => 'sanitize_text_field',
            'project_status' => 'sanitize_text_field',
            'project_duration' => 'sanitize_text_field',
            'project_gallery' => 'sanitize_text_field'
        );
        
        foreach ($fields as $field => $sanitize_function) {
            if (isset($_POST[$field])) {
                $value = call_user_func($sanitize_function, $_POST[$field]);
                update_post_meta($post_id, '_' . $field, $value);
            }
        }
    }
    
    // Enqueue Frontend Styles and Scripts
    public function enqueue_styles() {
        // Enqueue Google Fonts
        wp_enqueue_style( 
            'portfolio-google-fonts', 
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap',
            array(), 
            null 
        );
        
        // Enqueue plugin styles
        wp_enqueue_style(
            'portfolio-projects-style', 
            plugin_dir_url(__FILE__) . 'assets/style.css', 
            array('portfolio-google-fonts'),
            '1.0.0'
        );
        
        // Enqueue plugin scripts
        wp_enqueue_script(
            'portfolio-projects-script',
            plugin_dir_url(__FILE__) . 'assets/script.js',
            array('jquery'),
            '1.0.0',
            true
        );
    }
    
    // Enqueue Admin Styles and Scripts
    public function admin_enqueue_scripts($hook) {
        global $post;
        
        if ($hook == 'post-new.php' || $hook == 'post.php') {
            if ('projects' === $post->post_type) {
                wp_enqueue_media();
                wp_enqueue_script(
                    'portfolio-admin-script',
                    plugin_dir_url(__FILE__) . 'assets/admin-script.js',
                    array('jquery'),
                    '1.0.0',
                    true
                );
            }
        }
    }
    
    // Portfolio Shortcode
    public function portfolio_shortcode($atts) {
        $atts = shortcode_atts(array(
            'posts_per_page' => -1,
            'category' => '',
            'orderby' => 'date',
            'order' => 'DESC',
            'columns' => 3,
        ), $atts, 'portfolio_projects');
        
        $query_args = array(
            'post_type' => 'projects',
            'posts_per_page' => intval($atts['posts_per_page']),
            'orderby' => $atts['orderby'],
            'order' => $atts['order'],
            'post_status' => 'publish'
        );
        
        if (!empty($atts['category'])) {
            $query_args['tax_query'] = array(
                array(
                    'taxonomy' => 'project_category',
                    'field'    => 'slug',
                    'terms'    => explode(',', $atts['category']),
                ),
            );
        }
        
        $projects = new WP_Query($query_args);
        
        if (!$projects->have_posts()) {
            return '<p>' . __('No projects found.', 'portfolio-projects') . '</p>';
        }
        
        ob_start();
        
        echo '<div class="portfolio-grid columns-' . esc_attr($atts['columns']) . '">';
        
        while ($projects->have_posts()) {
            $projects->the_post();
            $this->render_project_card();
        }
        
        echo '</div>';
        
        wp_reset_postdata();
        
        return ob_get_clean();
    }
    
    // Render Project Card
    private function render_project_card() {
        $project_id = get_the_ID();
        $client_name = get_post_meta($project_id, '_client_name', true);
        $project_url = get_post_meta($project_id, '_project_url', true);
        $completion_date = get_post_meta($project_id, '_completion_date', true);
        $technology_used = get_post_meta($project_id, '_technology_used', true);
        $project_status = get_post_meta($project_id, '_project_status', true);
        ?>
        
        <div class="project-card" data-status="<?php echo esc_attr($project_status); ?>">
            <?php if (has_post_thumbnail()) : ?>
                <div class="project-image">
                    <?php the_post_thumbnail('medium', array('class' => 'project-thumbnail')); ?>
                    <div class="project-overlay">
                        <div class="project-overlay-content">
                            <?php if ($project_url) : ?>
                                <a href="<?php echo esc_url($project_url); ?>" class="project-link" target="_blank" rel="noopener">
                                    <span class="dashicons dashicons-external"></span>
                                </a>
                            <?php endif; ?>
                            <a href="<?php echo get_permalink(); ?>" class="project-details-link">
                                <span class="dashicons dashicons-visibility"></span>
                            </a>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
            
            <div class="project-content">
                <h3 class="project-title">
                    <a href="<?php echo get_permalink(); ?>"><?php the_title(); ?></a>
                </h3>
                
                <?php if ($technology_used) : ?>
                    <p class="project-technology">
                        <strong><?php _e('Technology:', 'portfolio-projects'); ?></strong> 
                        <?php echo esc_html($technology_used); ?>
                    </p>
                <?php endif; ?>
                
                <?php if ($client_name) : ?>
                    <p class="project-client">
                        <strong><?php _e('Client:', 'portfolio-projects'); ?></strong> 
                        <?php echo esc_html($client_name); ?>
                    </p>
                <?php endif; ?>
                
                <?php if ($completion_date) : ?>
                    <p class="project-date">
                        <strong><?php _e('Completed:', 'portfolio-projects'); ?></strong> 
                        <?php echo date('F Y', strtotime($completion_date)); ?>
                    </p>
                <?php endif; ?>
                
                <div class="project-excerpt">
                    <?php the_excerpt(); ?>
                </div>
                
                <div class="project-actions">
                    <?php if ($project_url) : ?>
                        <a href="<?php echo esc_url($project_url); ?>" 
                           class="btn btn-primary project-button" 
                           target="_blank" rel="noopener">
                           <?php _e('View Project', 'portfolio-projects'); ?>
                        </a>
                    <?php endif; ?>
                    
                    <a href="<?php echo get_permalink(); ?>" class="btn btn-secondary">
                        <?php _e('Learn More', 'portfolio-projects'); ?>
                    </a>
                </div>
            </div>
        </div>
        
        <?php
    }
}

// Initialize the plugin
new PortfolioProjects();

// Flush rewrite rules on activation
register_activation_hook(__FILE__, function() {
    // Create the portfolio projects instance to register post types
    new PortfolioProjects();
    flush_rewrite_rules();
});

// Flush rewrite rules on deactivation
register_deactivation_hook(__FILE__, function() {
    flush_rewrite_rules();
});
