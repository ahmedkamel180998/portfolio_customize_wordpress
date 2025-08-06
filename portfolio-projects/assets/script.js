/**
 * Portfolio Projects Frontend JavaScript
 */

jQuery(document).ready(function($) {
    
    // Initialize portfolio functionality
    initPortfolio();
    
    function initPortfolio() {
        // Add smooth scrolling to project links
        initSmoothScrolling();
        
        // Initialize lazy loading for images
        initLazyLoading();
        
        // Initialize project filtering
        initProjectFiltering();
        
        // Initialize modal functionality
        initProjectModal();
        
        // Add loading animations
        initLoadingAnimations();
    }
    
    // Smooth scrolling for internal links
    function initSmoothScrolling() {
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            
            var target = this.hash;
            var $target = $(target);
            
            if ($target.length) {
                $('html, body').animate({
                    'scrollTop': $target.offset().top - 80
                }, 800, 'swing');
            }
        });
    }
    
    // Lazy loading for project images
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('.project-thumbnail[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // Project filtering functionality
    function initProjectFiltering() {
        $('.filter-btn').on('click', function(e) {
            e.preventDefault();
            
            const filter = $(this).data('filter');
            const $projects = $('.project-card');
            
            // Update active filter
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            
            // Show loading state
            $('.portfolio-grid').addClass('loading');
            
            // Filter projects with animation
            setTimeout(() => {
                if (filter === 'all') {
                    $projects.fadeIn(400);
                } else {
                    $projects.each(function() {
                        const $project = $(this);
                        const categories = $project.data('categories');
                        
                        if (categories && categories.includes(filter)) {
                            $project.fadeIn(400);
                        } else {
                            $project.fadeOut(400);
                        }
                    });
                }
                
                $('.portfolio-grid').removeClass('loading');
            }, 300);
        });
    }
    
    // Modal functionality for project details
    function initProjectModal() {
        // Create modal HTML if it doesn't exist
        if (!$('#project-modal').length) {
            const modalHTML = `
                <div id="project-modal" class="project-modal">
                    <div class="modal-overlay"></div>
                    <div class="modal-content">
                        <button class="modal-close">&times;</button>
                        <div class="modal-body">
                            <div class="modal-image">
                                <img src="" alt="" />
                            </div>
                            <div class="modal-details">
                                <h2 class="modal-title"></h2>
                                <div class="modal-meta"></div>
                                <div class="modal-description"></div>
                                <div class="modal-actions"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('body').append(modalHTML);
        }
        
        // Handle modal trigger clicks
        $(document).on('click', '.project-details-link', function(e) {
            e.preventDefault();
            
            const $card = $(this).closest('.project-card');
            const projectData = extractProjectData($card);
            
            openProjectModal(projectData);
        });
        
        // Close modal events
        $(document).on('click', '.modal-close, .modal-overlay', function() {
            closeProjectModal();
        });
        
        // Close modal with escape key
        $(document).on('keydown', function(e) {
            if (e.keyCode === 27 && $('#project-modal').hasClass('active')) {
                closeProjectModal();
            }
        });
    }
    
    function extractProjectData($card) {
        return {
            title: $card.find('.project-title').text(),
            image: $card.find('.project-thumbnail').attr('src'),
            technology: $card.find('.project-technology').text(),
            client: $card.find('.project-client').text(),
            date: $card.find('.project-date').text(),
            description: $card.find('.project-excerpt').html(),
            url: $card.find('.project-button').attr('href'),
            permalink: $card.find('.project-details-link').attr('href')
        };
    }
    
    function openProjectModal(data) {
        const $modal = $('#project-modal');
        
        // Populate modal content
        $modal.find('.modal-title').text(data.title);
        $modal.find('.modal-image img').attr('src', data.image).attr('alt', data.title);
        
        let metaHTML = '';
        if (data.technology) metaHTML += `<p>${data.technology}</p>`;
        if (data.client) metaHTML += `<p>${data.client}</p>`;
        if (data.date) metaHTML += `<p>${data.date}</p>`;
        $modal.find('.modal-meta').html(metaHTML);
        
        $modal.find('.modal-description').html(data.description);
        
        let actionsHTML = '';
        if (data.url) {
            actionsHTML += `<a href="${data.url}" class="btn btn-primary" target="_blank">View Project</a>`;
        }
        if (data.permalink) {
            actionsHTML += `<a href="${data.permalink}" class="btn btn-secondary">Learn More</a>`;
        }
        $modal.find('.modal-actions').html(actionsHTML);
        
        // Show modal
        $modal.addClass('active');
        $('body').addClass('modal-open');
    }
    
    function closeProjectModal() {
        $('#project-modal').removeClass('active');
        $('body').removeClass('modal-open');
    }
    
    // Loading animations
    function initLoadingAnimations() {
        // Animate project cards on scroll
        if ('IntersectionObserver' in window) {
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            document.querySelectorAll('.project-card').forEach(card => {
                cardObserver.observe(card);
            });
        }
        
        // Add staggered animation delay
        $('.project-card').each(function(index) {
            $(this).css('animation-delay', (index * 0.1) + 's');
        });
    }
    
    // Utility functions
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
    
    // Handle window resize
    const handleResize = debounce(function() {
        // Recalculate grid layouts if needed
        $('.portfolio-grid').trigger('resize');
    }, 250);
    
    $(window).resize(handleResize);
    
    // Load more projects (infinite scroll)
    function initInfiniteScroll() {
        let page = 1;
        let loading = false;
        
        $(window).scroll(function() {
            if (loading) return;
            
            if ($(window).scrollTop() + $(window).height() >= $(document).height() - 1000) {
                loading = true;
                page++;
                
                // Show loading indicator
                $('.portfolio-grid').after('<div class="portfolio-loading"><div class="loading-spinner"></div><p>Loading more projects...</p></div>');
                
                // AJAX call would go here
                // For now, just simulate loading
                setTimeout(() => {
                    $('.portfolio-loading').remove();
                    loading = false;
                }, 1000);
            }
        });
    }
    
    // Initialize search functionality
    function initProjectSearch() {
        const $searchInput = $('#project-search');
        
        if ($searchInput.length) {
            $searchInput.on('input', debounce(function() {
                const query = $(this).val().toLowerCase();
                const $projects = $('.project-card');
                
                if (query === '') {
                    $projects.show();
                    return;
                }
                
                $projects.each(function() {
                    const $project = $(this);
                    const title = $project.find('.project-title').text().toLowerCase();
                    const tech = $project.find('.project-technology').text().toLowerCase();
                    const client = $project.find('.project-client').text().toLowerCase();
                    
                    if (title.includes(query) || tech.includes(query) || client.includes(query)) {
                        $project.show();
                    } else {
                        $project.hide();
                    }
                });
            }, 300));
        }
    }
    
    // Initialize all additional functionality
    initInfiniteScroll();
    initProjectSearch();
    
    // Custom events
    $(document).trigger('portfolioReady');
});

// Add CSS for animations
const animationCSS = `
<style>
.project-card {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.project-card.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.project-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.project-modal.active {
    opacity: 1;
    visibility: visible;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
}

.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 90%;
    max-height: 90%;
    width: 800px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    z-index: 1;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: white;
    transform: scale(1.1);
}

.modal-body {
    display: flex;
    min-height: 400px;
}

.modal-image {
    flex: 1;
    background: #f8fafc;
}

.modal-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.modal-details {
    flex: 1;
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.modal-title {
    font-size: 1.8em;
    margin-bottom: 20px;
    color: #2d3748;
}

.modal-meta p {
    margin: 10px 0;
    color: #4a5568;
}

.modal-description {
    flex: 1;
    margin: 20px 0;
    color: #718096;
    line-height: 1.6;
}

.modal-actions {
    display: flex;
    gap: 15px;
}

body.modal-open {
    overflow: hidden;
}

.portfolio-grid.loading {
    opacity: 0.6;
    pointer-events: none;
}

@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        max-height: 95%;
    }
    
    .modal-body {
        flex-direction: column;
    }
    
    .modal-details {
        padding: 20px;
    }
    
    .modal-title {
        font-size: 1.4em;
    }
}
</style>
`;

// Inject animation CSS
if (!document.getElementById('portfolio-animation-css')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'portfolio-animation-css';
    styleSheet.innerHTML = animationCSS.replace(/<\/?style>/g, '');
    document.head.appendChild(styleSheet);
}
