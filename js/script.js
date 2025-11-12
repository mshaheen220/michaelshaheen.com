$(document).ready(function() {

    // Add active class to current nav item based on scroll position
    function updateActiveNav() {
        var scrollPos = $(window).scrollTop() + 150; // Offset for fixed navbar
        var windowHeight = $(window).height();
        var documentHeight = $(document).height();
        var current = '';
        var sections = [];
        
        // Collect all sections with their positions
        $('section[id]').each(function() {
            var sectionTop = $(this).offset().top;
            var sectionHeight = $(this).outerHeight();
            var sectionId = $(this).attr('id');
            sections.push({
                id: sectionId,
                top: sectionTop,
                height: sectionHeight,
                bottom: sectionTop + sectionHeight
            });
        });
        
        // Check each section first (prioritize section detection)
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var nextSection = sections[i + 1];
            
            // If this is the last section (contact), check if we're past its start
            if (!nextSection) {
                if (scrollPos >= section.top - 100) {
                    current = section.id;
                    break;
                }
            } else {
                // For other sections, check if we're within bounds
                // Use the next section's top as the boundary
                if (scrollPos >= section.top - 100 && scrollPos < nextSection.top - 50) {
                    current = section.id;
                    break;
                }
            }
        }
        
        // Only if no section was found and we're near the bottom, default to contact
        if (!current && scrollPos + windowHeight >= documentHeight - 100) {
            current = 'contact';
        }
        
        // Update active class
        $('.nav-link').removeClass('active');
        if (current) {
            $('.nav-link[href="#' + current + '"]').addClass('active');
        } else {
            // If at top of page, highlight home
            if ($(window).scrollTop() < 200) {
                $('.nav-link[href="#home"]').addClass('active');
            }
        }
    }
    
    // Smooth scrolling for navigation links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70
            }, 500, 'easeInOutExpo', function() {
                // Update active nav after scroll completes
                setTimeout(updateActiveNav, 100);
            });
        }
    });

    // Navbar scroll effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
        
        // Hide scroll indicator when scrolling past hero section
        var heroSection = $('#home');
        var heroBottom = heroSection.offset().top + heroSection.outerHeight();
        var scrollTop = $(window).scrollTop() + $(window).height();
        
        if (scrollTop > heroBottom - 100) {
            $('.scroll-indicator').fadeOut(300);
        } else {
            $('.scroll-indicator').fadeIn(300);
        }
    });

    // Timeline animation on scroll
    function animateTimeline() {
        $('.timeline-item').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();

            // Check if element is in viewport
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('active');
            }
        });
    }

    // Initial check and on scroll
    animateTimeline();
    $(window).on('scroll', animateTimeline);


    // Click on timeline marker to scroll to content
    $('.timeline-marker').on('click', function() {
        var content = $(this).siblings('.timeline-content');
        $('html, body').animate({
            scrollTop: content.offset().top - 100
        }, 400);
    });

    // Animate elements on scroll (fade in) - throttled for performance
    let scrollTimeout;
    function animateOnScroll() {
        if (scrollTimeout) {
            return;
        }
        scrollTimeout = setTimeout(function() {
            $('.skill-card, .education-card').each(function() {
                var $el = $(this);
                if ($el.data('animated')) {
                    return;
                }
                var elementTop = $el.offset().top;
                var elementBottom = elementTop + $el.outerHeight();
                var viewportTop = $(window).scrollTop();
                var viewportBottom = viewportTop + $(window).height();

                if (elementBottom > viewportTop && elementTop < viewportBottom) {
                    $el.css({
                        'opacity': '1',
                        'transform': 'translateY(0)'
                    });
                    $el.data('animated', true);
                }
            });
            scrollTimeout = null;
        }, 16); // ~60fps
    }

    // Initialize elements with hidden state
    $('.skill-card, .education-card').css({
        'opacity': '0',
        'transform': 'translateY(30px)',
        'transition': 'all 0.3s ease'
    });

    // Check on scroll
    animateOnScroll();
    $(window).on('scroll', animateOnScroll);

    // Timeline year badge animation
    $('.timeline-year').each(function(index) {
        $(this).css({
            'animation-delay': (index * 0.1) + 's'
        });
    });

    // Update on scroll
    $(window).on('scroll', updateActiveNav);
    
    // Update on page load
    updateActiveNav();

    // Timeline item stagger animation
    $('.timeline-item').each(function(index) {
        $(this).css({
            'transition-delay': (index * 0.1) + 's'
        });
    });

    // Add hover effect to timeline content
    $('.timeline-content').hover(
        function() {
            $(this).find('.timeline-year').css({
                'transform': 'scale(1.1)',
                'transition': 'transform 0.3s ease'
            });
        },
        function() {
            $(this).find('.timeline-year').css({
                'transform': 'scale(1)'
            });
        }
    );

    // Skill card icon animation
    $('.skill-card').hover(
        function() {
            $(this).find('i').css({
                'transform': 'rotate(360deg)',
                'transition': 'transform 0.6s ease'
            });
        },
        function() {
            $(this).find('i').css({
                'transform': 'rotate(0deg)'
            });
        }
    );


    // Add easing function for smooth animations
    $.easing.easeInOutExpo = function(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    };

    // Mobile menu close on link click
    $('.navbar-nav .nav-link').on('click', function() {
        if ($(window).width() < 992) {
            $('.navbar-collapse').collapse('hide');
        }
    });

    // Ensure scroll indicator is visible on page load
    $('.scroll-indicator').show();

    // Projects data - embedded directly in JavaScript
    const PROJECTS_DATA = [
        {
            "id": "ai-rfp-assistant",
            "title": "AI-Powered RFP Assistant",
            "projectType": "AI Development, Internal Tool, Process Automation",
            "description": "Built an AI assistant with MS Copilot Studio to automate RFP submissions. By training the bot on past replies, it enabled content reuse, ensuring consistency, accuracy, and a unified company voice.",
            "fullDescription": "Developed an internal AI assistant using Microsoft Copilot Studio to streamline and automate the creation of RFP (Request for Proposal) submissions. The primary goal was to leverage existing knowledge by training the bot on a database of previously submitted, successful RFP replies. This allowed the tool to identify and reuse common answers to frequently asked questions, such as 'our position on server security is...'. The project automated a repetitive and time-consuming process, ensuring a consistent and accurate company voice across all submissions, regardless of the individual author.",
            "skills": ["Microsoft Copilot Studio", "AI Bot Development", "Process Automation", "Knowledge Management", "Content Strategy"],
            "results": "Successfully automated a significant portion of the RFP reply process. This led to increased consistency and accuracy in submissions, maintained a common company voice, and significantly reduced the time required by the team to respond to new proposals.",
            "link": "",
            "image": "",
            "tags": ["AI", "Automation", "Microsoft Copilot Studio", "RFP", "Internal Tool", "GenAI"]
        },
        {
            "id": "skyword-hybrid-agile-teams",
            "title": "Hybrid Agile Workflow Implementation",
            "projectType": "Team Management, Process Improvement, Agile Methodology",
            "description": "Designed and managed a hybrid agile workflow at Skyword, splitting a 12-developer team into two specialized Scrum (Application) and Kanban (Rapid Response) squads.",
            "fullDescription": "While leading a 12-developer full-stack team at Skyword, I restructured our workflow to better manage a large-scale web application. To balance new feature development with incoming bug fixes and keep the team engaged, I split the group into two sub-teams. The 'Application Team' ran on a standard Scrum model, focusing on planned feature sprints. The 'Rapid Response Team' operated in a Kanban style, allowing them to flexibly address urgent bugs and smaller tasks as they arose. To ensure knowledge-sharing and prevent burnout, we successfully rotated personnel between the two teams every couple of months.",
            "skills": ["Agile Methodologies", "Scrum", "Kanban", "Team Leadership", "Process Improvement", "Resource Management", "Workflow Optimization"],
            "results": "This dual-team structure successfully protected the Application team's sprint goals from interruption while improving the velocity of bug fixes. The rotation system increased team morale, prevented developer burnout, and fostered a broader understanding of the application across all team members.",
            "link": "",
            "image": "",
            "tags": ["Agile", "Scrum", "Kanban", "Team Management", "Process", "Skyword", "Leadership"]
        }
    ];

    // Store projects globally for click handlers
    const allProjects = PROJECTS_DATA;

    // Render projects to the grid
    function renderProjects(projects) {
        const projectsGrid = $('#projectsGrid');
        projectsGrid.empty();

        if (!projects || projects.length === 0) {
            projectsGrid.html('<p class="text-center">No projects found.</p>');
            return;
        }

        projects.forEach(function(project) {
            const projectCard = `
                <div class="project-card" data-project-id="${project.id}">
                    <div class="project-card-content">
                        <div class="project-card-type">${project.projectType}</div>
                        <h3 class="project-card-title">${project.title}</h3>
                        <p class="project-card-description">${project.description}</p>
                        <div class="project-card-tags">
                            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
            projectsGrid.append(projectCard);
        });

        // Add click handlers to project cards
        $('.project-card').on('click', function() {
            const projectId = $(this).data('project-id');
            const project = allProjects.find(p => p.id === projectId);
            if (project) {
                showProjectModal(project);
            }
        });
    }

    // Show project modal with full details
    function showProjectModal(project) {
        const modal = $('#projectModal');
        const modalBody = $('#projectModalBody');
        
        // Check if project has an image
        const hasImage = project.image && project.image.trim() !== '';
        
        const modalContent = `
            <div class="project-detail-content">
                <div class="project-detail-header">
                    <div class="project-detail-type">${project.projectType}</div>
                    <h2 class="project-detail-title">
                        ${project.title}
                        ${project.link ? `<a href="${project.link}" target="_blank" class="project-title-link" title="View Project" aria-label="View Project"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    </h2>
                    <div class="project-detail-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="project-detail-description-section ${hasImage ? 'has-image' : ''}">
                    ${hasImage ? `
                    <div class="project-detail-thumbnail">
                        <img src="${project.image}" alt="${project.title}" class="project-thumbnail-img" data-full-image="${project.image}">
                        <div class="project-thumbnail-overlay">
                            <i class="fas fa-expand"></i>
                        </div>
                    </div>
                    ` : ''}
                    <div class="project-detail-description">
                        <p>${project.fullDescription}</p>
                    </div>
                </div>
                <div class="project-detail-skills">
                    <h4>Skills Demonstrated:</h4>
                    <ul>
                        ${project.skills.map(skill => `<li>${skill}</li>`).join('')}
                    </ul>
                </div>
                <div class="project-detail-results">
                    <h4>Results/Impact:</h4>
                    <p>${project.results}</p>
                </div>
                ${project.link ? `<div class="project-detail-link"><a href="${project.link}" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> View project</a></div>` : ''}
            </div>
        `;
        
        modalBody.html(modalContent);
        modal.addClass('active');
        $('body').css('overflow', 'hidden');
    }
    
    // Show full-screen image viewer
    function showFullScreenImage(imageSrc, imageAlt) {
        const fullScreenViewer = $('#fullScreenImageViewer');
        if (fullScreenViewer.length === 0) {
            // Create the full-screen viewer if it doesn't exist
            $('body').append(`
                <div class="fullscreen-image-viewer" id="fullScreenImageViewer">
                    <div class="fullscreen-image-overlay"></div>
                    <div class="fullscreen-image-container">
                        <button class="fullscreen-image-close" id="closeFullScreenImage">
                            <i class="fas fa-times"></i>
                        </button>
                        <img src="${imageSrc}" alt="${imageAlt}" class="fullscreen-image">
                    </div>
                </div>
            `);
        } else {
            // Update existing viewer
            fullScreenViewer.find('.fullscreen-image').attr('src', imageSrc).attr('alt', imageAlt);
        }
        
        $('#fullScreenImageViewer').addClass('active');
        $('body').css('overflow', 'hidden');
    }
    
    // Close full-screen image viewer
    function closeFullScreenImage() {
        $('#fullScreenImageViewer').removeClass('active');
        // Only restore body overflow if project modal is not active
        if (!$('#projectModal').hasClass('active') && !$('#educationModal').hasClass('active')) {
            $('body').css('overflow', '');
        }
    }

    // Close modal
    function closeProjectModal() {
        const modal = $('#projectModal');
        modal.removeClass('active');
        $('body').css('overflow', '');
    }

    // Close modal handlers - use event delegation
    $(document).on('click', '.project-modal-overlay', function(e) {
        if (e.target === this) {
            closeProjectModal();
        }
    });

    $(document).on('click', '#closeModal', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeProjectModal();
    });

    // Close modal on ESC key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            if ($('#fullScreenImageViewer').hasClass('active')) {
                closeFullScreenImage();
            } else if ($('#projectModal').hasClass('active')) {
                closeProjectModal();
            } else if ($('#educationModal').hasClass('active')) {
                closeEducationModal();
            }
        }
    });
    
    // Close full-screen image viewer handlers
    $(document).on('click', '.fullscreen-image-overlay', function(e) {
        if (e.target === this) {
            closeFullScreenImage();
        }
    });
    
    $(document).on('click', '#closeFullScreenImage', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeFullScreenImage();
    });
    
    // Click handler for project thumbnail (using event delegation)
    $(document).on('click', '.project-detail-thumbnail, .project-thumbnail-img', function(e) {
        e.stopPropagation();
        const $thumbnail = $(this).closest('.project-detail-thumbnail');
        const fullImageSrc = $thumbnail.find('.project-thumbnail-img').data('full-image') || $thumbnail.find('.project-thumbnail-img').attr('src');
        const imageAlt = $thumbnail.find('.project-thumbnail-img').attr('alt') || 'Project image';
        showFullScreenImage(fullImageSrc, imageAlt);
    });

    // Load projects on page load
    renderProjects(PROJECTS_DATA);

    // Education data
    const educationData = {
        'ms': {
            degree: 'Master of Science',
            field: 'Database Development & Multimedia Technology',
            school: 'Duquesne University'
        },
        'ma': {
            degree: 'Master of Arts',
            field: 'Integrated Marketing Communication',
            school: 'Duquesne University'
        },
        'bs': {
            degree: 'Bachelor of Science',
            field: 'Organizational Behavior',
            school: 'Duquesne University'
        }
    };

    // Show education modal
    function showEducationModal(degreeKey) {
        const education = educationData[degreeKey];
        if (!education) return;

        const modal = $('#educationModal');
        const modalBody = $('#educationModalBody');
        
        const modalContent = `
            <div class="education-detail-content">
                <h2 class="education-detail-degree">${education.degree}</h2>
                <p class="education-detail-field">${education.field}</p>
                <p class="education-detail-school">${education.school}</p>
            </div>
        `;
        
        modalBody.html(modalContent);
        modal.addClass('active');
        $('body').css('overflow', 'hidden');
    }

    // Close education modal
    function closeEducationModal() {
        const modal = $('#educationModal');
        modal.removeClass('active');
        $('body').css('overflow', '');
    }


    // Education modal close handlers - use event delegation
    $(document).on('click', '.education-modal-overlay', function(e) {
        if (e.target === this) {
            closeEducationModal();
        }
    });

    $(document).on('click', '#closeEducationModal', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeEducationModal();
    });

});



