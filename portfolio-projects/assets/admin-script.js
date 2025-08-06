/**
 * Portfolio Projects Admin JavaScript
 */

jQuery(document).ready(function($) {
    
    // Initialize admin functionality
    initAdminFeatures();
    
    function initAdminFeatures() {
        initMediaUploader();
        initDatePicker();
        initFormValidation();
        initPreviewFunctionality();
    }
    
    // Media uploader for project gallery
    function initMediaUploader() {
        let mediaUploader;
        
        $('#upload-gallery-button').on('click', function(e) {
            e.preventDefault();
            
            // If the uploader object has already been created, reopen the dialog
            if (mediaUploader) {
                mediaUploader.open();
                return;
            }
            
            // Create the media frame
            mediaUploader = wp.media({
                title: 'Choose Gallery Images',
                button: {
                    text: 'Add to Gallery'
                },
                multiple: true
            });
            
            // When images are selected, run a callback
            mediaUploader.on('select', function() {
                const attachments = mediaUploader.state().get('selection').toJSON();
                let galleryIds = [];
                let previewHtml = '';
                
                attachments.forEach(function(attachment) {
                    galleryIds.push(attachment.id);
                    previewHtml += `
                        <div class="gallery-image" data-id="${attachment.id}" style="position: relative; display: inline-block;">
                            <img src="${attachment.sizes.thumbnail.url}" alt="${attachment.alt}" style="width: 80px; height: 80px; object-fit: cover; margin: 5px;" />
                            <span class="remove-image" style="cursor: pointer; color: red; font-size: 18px; position: absolute; top: 0; right: 0; background: white; border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 18px;">×</span>
                        </div>
                    `;
                });
                
                // Update hidden field
                const currentIds = $('#project_gallery').val();
                const newIds = currentIds ? currentIds + ',' + galleryIds.join(',') : galleryIds.join(',');
                $('#project_gallery').val(newIds);
                
                // Update preview
                $('#gallery-images-preview').append(previewHtml);
                
                // Show success message
                showAdminNotice('Gallery images added successfully!', 'success');
            });
            
            // Open the uploader dialog
            mediaUploader.open();
        });
        
        // Remove gallery image
        $(document).on('click', '.remove-image', function() {
            const $galleryImage = $(this).closest('.gallery-image');
            const imageId = $galleryImage.data('id');
            
            // Remove from preview
            $galleryImage.fadeOut(300, function() {
                $(this).remove();
                
                // Update hidden field
                const currentIds = $('#project_gallery').val().split(',');
                const updatedIds = currentIds.filter(id => id != imageId);
                $('#project_gallery').val(updatedIds.join(','));
            });
        });
    }
    
    // Enhanced date picker
    function initDatePicker() {
        if ($('#completion_date').length) {
            // Set max date to today
            const today = new Date().toISOString().split('T')[0];
            $('#completion_date').attr('max', today);
            
            // Add change event
            $('#completion_date').on('change', function() {
                const selectedDate = new Date($(this).val());
                const today = new Date();
                
                if (selectedDate > today) {
                    showAdminNotice('Completion date cannot be in the future.', 'error');
                    $(this).val('');
                }
            });
        }
    }
    
    // Form validation
    function initFormValidation() {
        // URL validation
        $('#project_url').on('blur', function() {
            const url = $(this).val();
            if (url && !isValidUrl(url)) {
                showAdminNotice('Please enter a valid URL (include http:// or https://)', 'error');
                $(this).focus();
            }
        });
        
        // Technology field suggestions
        const techSuggestions = [
            'WordPress', 'PHP', 'JavaScript', 'React', 'Vue.js', 'Angular',
            'HTML5', 'CSS3', 'SASS', 'Bootstrap', 'Tailwind CSS',
            'jQuery', 'Node.js', 'Express.js', 'MongoDB', 'MySQL',
            'Python', 'Django', 'Laravel', 'CodeIgniter', 'Shopify',
            'WooCommerce', 'Elementor', 'Gutenberg', 'ACF'
        ];
        
        $('#technology_used').autocomplete({
            source: techSuggestions,
            minLength: 2
        });
        
        // Client name suggestions (from previous projects)
        if (typeof projectClients !== 'undefined') {
            $('#client_name').autocomplete({
                source: projectClients,
                minLength: 2
            });
        }
        
        // Form submission validation
        $('#post').on('submit', function(e) {
            let isValid = true;
            const errors = [];
            
            // Check required fields
            const title = $('#title').val().trim();
            if (!title) {
                errors.push('Project title is required.');
                isValid = false;
            }
            
            // Check URL format
            const url = $('#project_url').val().trim();
            if (url && !isValidUrl(url)) {
                errors.push('Please enter a valid project URL.');
                isValid = false;
            }
            
            // Check date
            const date = $('#completion_date').val();
            if (date && new Date(date) > new Date()) {
                errors.push('Completion date cannot be in the future.');
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
                showAdminNotice('Please fix the following errors:\n' + errors.join('\n'), 'error');
                return false;
            }
        });
    }
    
    // Preview functionality
    function initPreviewFunctionality() {
        // Live preview of project card
        const $previewContainer = $('<div id="project-preview" style="margin-top: 20px; padding: 20px; border: 1px solid #ccd0d4; border-radius: 4px; background: #f9f9f9;"><h3>Live Preview</h3><div id="preview-content"></div></div>');
        
        if ($('#project_details').length) {
            $('#project_details').after($previewContainer);
            
            // Update preview on field changes
            $('#title, #client_name, #project_url, #technology_used, #completion_date').on('input change', debounce(updatePreview, 500));
            
            // Initial preview
            updatePreview();
        }
    }
    
    function updatePreview() {
        const title = $('#title').val() || 'Project Title';
        const client = $('#client_name').val();
        const url = $('#project_url').val();
        const tech = $('#technology_used').val();
        const date = $('#completion_date').val();
        
        let previewHtml = `
            <div class="project-card" style="max-width: 300px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: white;">
                <div style="height: 150px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white;">
                    <span>Featured Image</span>
                </div>
                <div style="padding: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: #333;">${title}</h4>
        `;
        
        if (tech) {
            previewHtml += `<p style="margin: 5px 0; color: #666; font-size: 0.9em;"><strong>Technology:</strong> ${tech}</p>`;
        }
        
        if (client) {
            previewHtml += `<p style="margin: 5px 0; color: #666; font-size: 0.9em;"><strong>Client:</strong> ${client}</p>`;
        }
        
        if (date) {
            const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
            previewHtml += `<p style="margin: 5px 0; color: #666; font-size: 0.9em;"><strong>Completed:</strong> ${formattedDate}</p>`;
        }
        
        previewHtml += `
                    <div style="margin-top: 15px;">
        `;
        
        if (url) {
            previewHtml += `<a href="#" style="background: #667eea; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 0.9em; margin-right: 8px;">View Project</a>`;
        }
        
        previewHtml += `
                        <a href="#" style="background: #f0f0f0; color: #333; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 0.9em;">Learn More</a>
                    </div>
                </div>
            </div>
        `;
        
        $('#preview-content').html(previewHtml);
    }
    
    // Utility functions
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    function showAdminNotice(message, type = 'info') {
        const noticeClass = type === 'error' ? 'notice-error' : type === 'success' ? 'notice-success' : 'notice-info';
        
        const $notice = $(`
            <div class="notice ${noticeClass} is-dismissible">
                <p>${message}</p>
                <button type="button" class="notice-dismiss">
                    <span class="screen-reader-text">Dismiss this notice.</span>
                </button>
            </div>
        `);
        
        $('.wrap h1').after($notice);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            $notice.fadeOut();
        }, 5000);
        
        // Manual dismiss
        $notice.find('.notice-dismiss').on('click', function() {
            $notice.fadeOut();
        });
    }
    
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            
            if (callNow) func.apply(context, args);
        };
    }
    
    // Meta box enhancement
    function enhanceMetaBoxes() {
        // Make meta boxes collapsible with custom animation
        $('.postbox .handlediv').on('click', function() {
            $(this).closest('.postbox').find('.inside').slideToggle(200);
        });
        
        // Add help tooltips
        const helpTexts = {
            'client_name': 'Enter the name of the client or company this project was created for.',
            'project_url': 'The live URL where this project can be viewed online.',
            'completion_date': 'The date when this project was completed.',
            'technology_used': 'List the main technologies, frameworks, or tools used in this project.',
            'project_status': 'Current status of the project.',
            'project_duration': 'How long the project took to complete.'
        };
        
        Object.keys(helpTexts).forEach(function(fieldName) {
            const $field = $(`#${fieldName}`);
            if ($field.length) {
                const $help = $(`<span class="field-help" title="${helpTexts[fieldName]}" style="margin-left: 5px; color: #666; cursor: help;">?</span>`);
                $field.after($help);
                
                $help.tooltip();
            }
        });
    }
    
    // Character counter for fields
    function addCharacterCounters() {
        const fieldLimits = {
            'technology_used': 100,
            'client_name': 50,
            'project_duration': 30
        };
        
        Object.keys(fieldLimits).forEach(function(fieldName) {
            const $field = $(`#${fieldName}`);
            if ($field.length) {
                const limit = fieldLimits[fieldName];
                const $counter = $(`<div class="char-counter" style="font-size: 12px; color: #666; text-align: right; margin-top: 5px;">0/${limit}</div>`);
                
                $field.after($counter);
                
                $field.on('input', function() {
                    const length = $(this).val().length;
                    $counter.text(`${length}/${limit}`);
                    
                    if (length > limit) {
                        $counter.css('color', 'red');
                        $(this).css('border-color', 'red');
                    } else {
                        $counter.css('color', '#666');
                        $(this).css('border-color', '');
                    }
                });
                
                // Initial count
                $field.trigger('input');
            }
        });
    }
    
    // Initialize enhancements
    enhanceMetaBoxes();
    addCharacterCounters();
    
    // Bulk actions for projects list
    function initBulkActions() {
        // Add custom bulk actions
        $('<option>').val('mark_completed').text('Mark as Completed').appendTo('select[name="action"]');
        $('<option>').val('mark_in_progress').text('Mark as In Progress').appendTo('select[name="action"]');
        
        // Handle bulk actions
        $('#doaction').on('click', function(e) {
            const action = $('select[name="action"]').val();
            const selectedPosts = $('input[name="post[]"]:checked');
            
            if ((action === 'mark_completed' || action === 'mark_in_progress') && selectedPosts.length > 0) {
                e.preventDefault();
                
                const newStatus = action === 'mark_completed' ? 'completed' : 'in-progress';
                const postIds = [];
                
                selectedPosts.each(function() {
                    postIds.push($(this).val());
                });
                
                // AJAX call to update status
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'update_project_status',
                        post_ids: postIds,
                        status: newStatus,
                        nonce: $('#_wpnonce').val()
                    },
                    success: function(response) {
                        if (response.success) {
                            showAdminNotice(`${postIds.length} project(s) updated successfully!`, 'success');
                            location.reload();
                        } else {
                            showAdminNotice('Failed to update projects.', 'error');
                        }
                    },
                    error: function() {
                        showAdminNotice('An error occurred while updating projects.', 'error');
                    }
                });
            }
        });
    }
    
    // Initialize bulk actions if on projects list page
    if ($('.wp-list-table').length && window.location.href.includes('post_type=projects')) {
        initBulkActions();
    }
    
    // Project statistics dashboard widget
    function createProjectStats() {
        if ($('#dashboard_right_now').length) {
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'get_project_stats',
                    nonce: $('#_wpnonce').val()
                },
                success: function(response) {
                    if (response.success) {
                        const stats = response.data;
                        let statsHtml = '<div class="project-stats" style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 4px;">';
                        statsHtml += '<h4>Project Statistics</h4>';
                        statsHtml += `<p>Total Projects: <strong>${stats.total}</strong></p>`;
                        statsHtml += `<p>Completed: <strong>${stats.completed}</strong></p>`;
                        statsHtml += `<p>In Progress: <strong>${stats.in_progress}</strong></p>`;
                        statsHtml += `<p>On Hold: <strong>${stats.on_hold}</strong></p>`;
                        statsHtml += '</div>';
                        
                        $('#dashboard_right_now .inside').append(statsHtml);
                    }
                }
            });
        }
    }
    
    // Initialize project stats on dashboard
    if ($('#dashboard_right_now').length) {
        createProjectStats();
    }
});
