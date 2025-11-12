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
        "id": "hbase-wal",
        "title": "Write-Ahead Logs (WAL) implementation guide",
        "projectType": "Feature Launch Documentation, CLI Reference",
        "description": "Created complete documentation suite for  HBase Write-Ahead Logs feature for Amazon EMR from scratch. WAL prevents data loss during system failures—a critical data protection capability.",
        "fullDescription": "Created complete documentation suite for Amazon EMR's HBase Write-Ahead Logs feature from scratch. WAL prevents data loss during system failures—a critical data protection capability. Worked with engineering to understand distributed database architecture and translated it into developer-friendly guides. Wrote step-by-step implementation docs, CLI reference, service-linked roles configuration, and troubleshooting scenarios.",
        "skills": ["Net-new feature documentation", "Complex technical concept explanation", "CLI documentation", "Decision tree design", "Troubleshooting content"],
        "results": "Launched simultaneously with feature. Became definitive resource for EMR WAL implementation. Enabled day-one customer adoption of critical data protection feature.",
        "link": "https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-hbase-wal.html",
        "tags": ["Feature Documentation", "CLI Reference", "Technical Writing", "AWS", "Data Protection", "Developer Guides"]
    },
    {
        "id": "aurora-encryption",
        "title": "Data encryption for Amazon Aurora DSQL",
        "projectType": "Feature Documentation, Technical Writing",
        "description": "Created comprehensive documentation for Aurora DSQL's data encryption feature from launch. Worked directly with engineering team to understand encryption architecture, key management, and security model.",
        "fullDescription": "Created comprehensive documentation for Aurora DSQL's data encryption feature from launch. Worked directly with engineering team to understand encryption architecture, key management, and security model. Wrote developer guide explaining encryption at rest, in transit, and key rotation procedures. Included code examples and CLI reference.",
        "skills": ["Technical documentation for complex features", "Security and compliance documentation", "Developer audience writing", "Code sample creation", "Collaboration with engineering"],
        "results": "Launched with feature. Provided developers with clear guidance on implementing encryption correctly for compliance-sensitive workloads.",
        "link": "https://docs.aws.amazon.com/aurora-dsql/latest/userguide/data-encryption.html",
        "tags": ["Technical Writing", "Security Documentation", "Developer Docs", "AWS", "Compliance", "API Documentation"]
    },
    {
        "id": "s3-access-grants",
        "title": "S3 Access Grants integration",
        "projectType": "Integration Documentation, API Documentation",
        "description": "Documented the integration between Amazon EMR and S3 Access Grants, enabling fine-grained access control for S3 data. Explained concepts, configuration steps, IAM permissions, and troubleshooting.",
        "fullDescription": "Documented the integration between Amazon EMR and S3 Access Grants, enabling fine-grained access control for S3 data. Explained concepts, configuration steps, IAM permissions, and troubleshooting. Created workflow diagrams (collaborated with visual designer on graphics) and code examples.",
        "skills": ["Integration documentation", "Cross-service technical writing", "Conceptual explanation", "Procedural documentation", "Collaboration with designers"],
        "results": "Enabled customers to implement advanced S3 access controls with EMR. Clear documentation reduced configuration errors.",
        "link": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-access-grants.html",
        "image": "img/projects/s3.png",
        "tags": ["Integration Docs", "API Documentation", "AWS", "IAM", "Technical Writing", "Cross-Service"]
    },
    {
        "id": "service-linked-roles",
        "title": "Service-linked roles configuration",
        "projectType": "Security Documentation, Configuration Guide",
        "description": "Documented service-linked roles for Amazon EMR—IAM roles that are linked directly to AWS services. Explained when they're created, what permissions they include, how to edit them, and how to delete them.",
        "fullDescription": "Documented service-linked roles for Amazon EMR—IAM roles that are linked directly to AWS services. Explained when they're created, what permissions they include, how to edit them, and how to delete them. Critical for customers managing security and compliance.",
        "skills": ["Security and IAM documentation", "Permission and role documentation", "Audience-appropriate technical depth", "Procedural writing"],
        "results": "Provided clear guidance on IAM security model for EMR. Helped customers implement least-privilege access correctly.",
        "link": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/using-service-linked-roles-wal.html",
        "tags": ["Security Documentation", "IAM", "Configuration Guides", "AWS", "Compliance"]
    },
    {
        "id": "release-notes",
        "title": "Comprehensive release notes",
        "projectType": "Release Communication, Feature Documentation",
        "description": "Created detailed release notes for Amazon EMR releases, documenting new features, improvements, bug fixes, and known issues. Translated engineering changelogs into customer-friendly summaries.",
        "fullDescription": "Created detailed release notes for Amazon EMR releases, documenting new features, improvements, bug fixes, and known issues. Translated engineering changelogs into customer-friendly summaries with links to relevant documentation.",
        "skills": ["Release communication", "Technical summarization", "Customer-focused writing", "Cross-linking and information architecture"],
        "results": "Kept customers informed of product changes. Enabled quick assessment of release value and upgrade decisions.",
        "link": "https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-release-7x.html",
        "tags": ["Release Notes", "Technical Writing", "AWS", "Communication"]
    },
    {
        "id": "wandb-tutorial",
        "title": "Content improvement: Weights & Biases machine-learning experiment tracking with PyTorch",
        "projectType": "Content Revision, Before/After Improvement",
        "description": "Revised existing tutorial on integrating Weights & Biases with PyTorch projects. Original content was technically accurate but verbose and difficult to follow.",
        "fullDescription": "Revised existing tutorial on integrating Weights & Biases with PyTorch projects. Original content was technically accurate but verbose and difficult to follow. Restructured for clarity, simplified language, improved code examples, and added clearer prerequisites and troubleshooting.",
        "skills": ["Content editing and improvement", "Tutorial writing", "Code example refinement", "Information architecture", "User-focused revision"],
        "results": "Improved tutorial comprehension and completion rates. Reduced user friction in adopting ML experiment tracking.",
        "link": "https://github.com/wandb/docs/pull/1385",
        "tags": ["Content Revision", "Tutorial Writing", "ML/AI", "User Experience"]
    },
    {
        "id": "emr-console-redesign",
        "title": "Amazon EMR console redesign",
        "projectType": "UX writing for AWS Management Console",
        "description": "Led content design for the complete redesign of create/modify cluster workflows. Wrote all interface text including section titles, field labels, help panels, descriptions, radio button labels, and navigational elements.",
        "fullDescription": "Led content design for the complete redesign of Amazon EMR's cluster creation and modification workflows. Wrote all interface text including section titles, field labels, help panels, descriptions, radio button labels, and navigational elements. Collaborated with product designers through multiple Figma iterations, ensuring content aligned with CloudScape design system and AWS Style Guide standards for terminology, accessibility, and global audiences.",
        "skills": ["UX writing for complex technical workflows", "Cross-functional collaboration (design, engineering, product)", "Design system implementation (CloudScape)", "Progressive disclosure and information architecture", "Accessibility and inclusive language", "Writing for global/ESL audiences"],
        "results": "Launched with redesigned console. Improved clarity of cluster configuration process for millions of AWS developers. Reduced user errors through clearer labeling and contextual help.",
        "link": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/whats-new-in-console.html",
        "image": "img/projects/emr-console-thumb.png",
        "tags": ["UX Writing", "Interface Design", "CloudScape", "AWS", "Design Systems", "Accessibility"]
    },
    {
        "id": "emr-error-messages",
        "title": "EMR error message standardization",
        "projectType": "Content Strategy, UX Writing",
        "description": "Led initiative to refactor the top 20 most-emitted Amazon EMR console errors. Worked with engineering to add a new plain-language ErrorMessage field to the error structure.",
        "fullDescription": "Led initiative to refactor the top 20 most-emitted Amazon EMR console errors. Worked with engineering to add a new plain-language ErrorMessage field to the error structure (previously only programmatic ErrorCode and ErrorData existed). Wrote customer-facing error messages and created corresponding troubleshooting resolution pages in the developer guide. Designed reusable error message framework adopted across EMR service.",
        "skills": ["Technical writing", "Error message design", "Self-service content strategy", "Cross-functional influence (changed product architecture)", "Reusable framework creation"],
        "results": "Transformed programmatic-only errors into actionable guidance. Enabled customers to self-resolve issues, reducing support case volume. Framework adopted as standard across EMR service for consistent, helpful error communication.",
        "link": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-troubleshoot-error-errordetail.html",
        "image": "img/projects/error-thumb.png",
        "tags": ["Error Messages", "Content Strategy", "UX Writing", "Information Architecture", "AWS", "Self-Service"]
    },
    {
        "id": "notebooks-workspaces",
        "title": "EMR Notebooks to Workspaces transition",
        "projectType": "UX Writing, Change Management",
        "description": "Wrote in-product guidance to educate users on major conceptual changes in the redesigned EMR Studio console. The product was shifting from a \"Notebooks\" model to a \"Workspaces\" model.",
        "fullDescription": "Wrote in-product guidance to educate users on major conceptual changes in the redesigned EMR Studio console. The product was shifting from a \"Notebooks\" model to a \"Workspaces\" model, requiring clear explanation of new concepts, migration paths, and updated workflows. Created content for landing page, action panels, and contextual help to support smooth transition.",
        "skills": ["Conceptual explanation", "Change management through content", "User education in-product", "Information design", "Action-oriented writing"],
        "link": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-managed-notebooks-migration.html",
        "results": "Enabled smooth migration from legacy console to new experience. Users could understand new model and take appropriate actions without requiring extensive support.",
        "image": "img/projects/notebooks.png",
        "tags": ["UX Writing", "Change Management", "User Education", "Information Design", "AWS"]
    },
    {
        "id": "sugarbpm",
        "title": "SugarBPM administrator guide",
        "projectType": "Administrator Documentation, Business Process Documentation",
        "description": "Created comprehensive administrator guide for SugarBPM, SugarCRM's business process management and workflow automation tool. Documented process design, automation rules, email templates, approval workflows, and system administration.",
        "fullDescription": "Created comprehensive administrator guide for SugarBPM—SugarCRM's business process management and workflow automation tool. Documented process design, automation rules, email templates, approval workflows, and system administration. Wrote for technical administrators managing complex business processes.",
        "skills": ["Administrator-level technical writing", "Business process documentation", "Workflow documentation", "System configuration writing"],
        "results": "Enabled administrators to successfully configure and manage automated business processes. Reduced support inquiries for BPM configuration.",
        "link": "https://support.sugarcrm.com/smartlinks/administration_guide/sugarbpm/",
        "tags": ["Administrator Docs", "Business Process", "Workflow Automation", "SugarCRM", "Technical Writing"]
    },
    {
        "id": "status-tracking",
        "title": "Admin tutorial: Tracking record status duration",
        "projectType": "Tutorial, Technical How-To",
        "description": "Created step-by-step tutorial showing administrators how to track and report on how long CRM records spend in each status (e.g., how long a sales opportunity stays in \"Negotiation\" stage).",
        "fullDescription": "Created step-by-step tutorial showing administrators how to track and report on how long CRM records spend in each status (e.g., how long a sales opportunity stays in \"Negotiation\" stage). Included calculated fields, workflow automation, and reporting configuration.",
        "skills": ["Tutorial writing", "Use case documentation", "Step-by-step instruction", "Configuration documentation"],
        "link": "https://support.sugarcrm.com/knowledge_base/sugarbpm/capturing_how_long_a_record_spends_in_each_status_using_sugarbpm/",
        "results": "Provided customers with solution to common reporting need. Reduced support tickets for status duration tracking.",
        "tags": ["Tutorial", "Use Cases", "SugarCRM", "Reporting", "Configuration"]
    },
    {
        "id": "team-permissions",
        "title": "Admin documentation: Permissions management",
        "projectType": "Security Documentation, Permissions Documentation",
        "description": "Documented SugarCRM's team-based security and permissions model. Explained how to create teams, assign users, configure role permissions, and implement data access controls.",
        "fullDescription": "Documented SugarCRM's team-based security and permissions model. Explained how to create teams, assign users, configure role permissions, and implement data access controls. Critical for enterprises with complex organizational structures and security requirements.",
        "skills": ["Security and permissions documentation", "Enterprise feature documentation", "Configuration procedures", "Access control documentation"],
        "link": "https://support.sugarcrm.com/smartlinks/administration_guide/team_management/",
        "results": "Enabled administrators to correctly implement team-based security. Supported enterprise compliance requirements.",
        "tags": ["Security Documentation", "Permissions", "Enterprise", "SugarCRM", "Compliance"]
    },
    {
        "id": "upsert-products",
        "title": "Product descriptions: SugarCRM Marketplace addons",
        "projectType": "Product Marketing, Technical Marketing Content",
        "description": "Created product descriptions and technical marketing content for CRM enhancements sold on SugarCRM Marketplace. Wrote for both business decision-makers and technical administrators.",
        "fullDescription": "Created product descriptions and technical marketing content for CRM enhancements sold on SugarCRM Marketplace. Wrote for both business decision-makers and technical administrators. Explained features, benefits, use cases, and technical requirements.",
        "skills": ["Product marketing writing", "Technical marketing content", "Multi-audience writing (business + technical)", "Benefit-focused writing"],
        "results": "Supported product sales on SugarCRM Marketplace. Communicated value proposition to potential customers.",
        "link": "https://upsertconsulting.com/#/plugins",
        "tags": ["Product Marketing", "Technical Marketing", "Multi-Audience", "SugarCRM", "Marketplace"]
    },
    {
        "id": "wiki-refactor",
        "title": "AWS service documentation wiki refactor",
        "projectType": "Content Governance, Information Architecture",
        "description": "Led comprehensive restructure of AWS Technical Content Experience wiki ecosystem serving 200+ writers. Designed standardized templates, editorial guidelines, and governance framework.",
        "fullDescription": "Led comprehensive restructure of AWS Technical Content Experience wiki ecosystem serving 200+ writers. Designed standardized templates, editorial guidelines, and governance framework for org-wide content consistency. Managed 8-week, 4-workstream delivery plan with cross-functional team of 10 contributors. Optimized content architecture for AI-powered knowledge management.",
        "skills": ["Content governance at scale", "Information architecture", "Template and framework design", "Program management", "Cross-functional leadership", "Change management"],
        "results": "Consistent structure across AWS doc org. Enables AI-powered discovery and content findability.",
        "tags": ["Content Governance", "Information Architecture", "Program Management", "AWS", "AI/ML", "Scale"]
    },
    {
        "id": "ai-upskilling",
        "title": "AWS documentation AI upskilling program",
        "projectType": "Training Program, AI Tool Development",
        "description": "Contributed to design and implementation of AI transformation program for 200+ AWS technical writers. Built internal GenAI tool for content creation and review—now has thousands of executions across AWS services.",
        "fullDescription": "Contributed to design and implementation of AI transformation program for 200+ AWS technical writers. Built internal GenAI tool for content creation and review—now has thousands of executions across AWS services. Created organization-wide AI context files and training materials for content automation. Established best practices for AI-assisted writing workflows and quality assurance.",
        "skills": ["AI tool training and development", "Organizational change management", "Training material creation", "Quality assurance framework", "Best practices development", "Scale thinking"],
        "results": "GenAI tool achieved thousands of uses across AWS services. Increased writer efficiency while maintaining quality standards. Established framework for responsible AI use in technical content.",
        "tags": ["AI/ML", "Training Programs", "Organizational Change", "Automation", "AWS", "GenAI"]
    },
    {
        "id": "task-migration",
        "title": "AWS task management tool migration",
        "projectType": "Process Improvement, Change Management",
        "description": "Led pilot program transitioning AWS documentation intake from legacy SIM ticket system to modern Taskei platform. Analyzed feedback from 15+ service verticals.",
        "fullDescription": "Led pilot program transitioning AWS documentation intake from legacy SIM ticket system to modern Taskei platform. Analyzed feedback from 15+ service verticals. Documented 40 data-driven recommendations for organization-wide rollout. Created comprehensive training materials and migration checklists.",
        "skills": ["Process analysis and improvement", "Stakeholder feedback synthesis", "Training material creation", "Change management", "Data-driven recommendations"],
        "results": "Reduced task processing overhead. Improved cross-team collaboration workflows. Recommendations informed organization-wide migration strategy.",
        "tags": ["Process Improvement", "Change Management", "Program Management", "AWS", "Data-Driven"]
    },
    {
        "id": "multi-company",
        "title": "Multi-company documentation integration",
        "projectType": "Content Consolidation, Change Management",
        "description": "Managed documentation consolidation during 3 SugarCRM product acquisitions. Standardized content processes across 150+ annual releases and 20+ product versions.",
        "fullDescription": "Managed documentation consolidation during 3 SugarCRM product acquisitions. Standardized content processes across 150+ annual releases and 20+ product versions. Integrated newly acquired product documentation into existing content ecosystem while maintaining quality and team morale.",
        "skills": ["M&A documentation management", "Content standardization at scale", "Process design", "Team leadership", "Quality management"],
        "results": "Maintained 100% team retention through 3 acquisitions. Successfully integrated all acquired product documentation. Reduced customer support case volume by 30% through strategic content improvements.",
        "tags": ["M&A", "Content Consolidation", "Team Leadership", "Process Design", "SugarCRM", "Scale"]
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



