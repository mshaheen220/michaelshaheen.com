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
            "id": "gene-e-genealogy-agent",
            "title": "Gene E. - AI Genealogy Agent & RAG Pipeline",
            "projectType": "AI/Machine Learning, Retrieval-Augmented Generation (RAG), Data Engineering",
            "description": "Developed a localized AI-powered genealogy assistant featuring a dual-brain Retrieval-Augmented Generation (RAG) architecture to parse family trees, process historical documents via OCR, and accurately answer complex family history queries.",
            "fullDescription": "I engineered a comprehensive AI Genealogy Agent designed to parse large GEDCOM family trees and historical media into a highly searchable local environment. The system utilizes a 'Dual-Brain' routing architecture: it intelligently routes aggregate and mathematical questions to a dynamically queried SQLite database to prevent hallucinations, while directing biographical or story-based queries to a LanceDB vector store using locally generated embeddings. A Python data pipeline handles GEDCOM extraction and utilizes the Google Gemini API to perform OCR transcription and automated triage on archival documents. The frontend features a Node.js/Express application with WebSockets (Socket.io) for live audio transcription during family interviews and includes a proactive Triage Dashboard that evaluates documents to generate actionable research tasks.",
            "skills": ["Python", "Node.js", "Retrieval-Augmented Generation (RAG)", "Generative AI", "Google Gemini API", "LanceDB", "SQLite", "Vector Databases", "LangChain", "WebSockets", "OCR", "Data Engineering"],
            "results": "Delivered a highly accurate, privacy-centric AI application that performs blazing-fast local semantic searches. Successfully automated the transcription and entity resolution of unstructured historical documents, significantly reducing manual research time while providing an intuitive, voice-enabled interface for interactive family history exploration.",
            "link": "",
            "image": "",
            "tags": ["AI", "RAG", "Python", "Node.js", "Gemini", "LLM", "LanceDB", "SQLite", "Genealogy", "Full-Stack"],
            "flag": ["cool"]
        },
        {
            "id": "mindframe-cbt-app",
            "title": "Mindframe: AI-Powered CBT Application",
            "projectType": "AI Application Development, Front-End Architecture, HealthTech",
            "description": "Built a privacy-first React application leveraging the Google Gemini API to guide users through structured cognitive behavioral therapy (CBT) workflows like Socratic restructuring and mood regulation.",
            "fullDescription": "Designed and built Mindframe, a personal cognitive behavioral therapy (CBT) tool that helps users navigate difficult thoughts through guided workflows. The application features a Thought Triage system, Socratic Questioning, and a Worry Tree. I integrated the Google Gemini API using advanced prompt engineering and system instructions to act as a CBT therapist, providing users with personalized AI analysis, balanced thoughts, and coping strategies. Built entirely as a client-side React application using Vite, the app ensures complete user privacy by utilizing LocalStorage for all data persistence—meaning sensitive data never leaves the user's device. Additional features include a comprehensive analytics dashboard for tracking sessions and technique usage, interactive cognitive distortion identification, and local data backup/import functionality.",
            "skills": ["React", "Google Gemini API", "Prompt Engineering", "Vite", "Front-End Architecture", "LocalStorage", "State Management", "AI Integration"],
            "results": "Delivered a responsive, privacy-focused client-side application that successfully integrates generative AI to provide real-time cognitive reframing assistance, completely eliminating the need for a backend database while maintaining full data portability.",
            "link": "",
            "image": "",
            "tags": ["React", "Google Gemini", "AI", "Vite", "Front-End", "HealthTech", "Web App", "Privacy-First"],
            "flag": []
        },
        {
            "id": "dynamic-family-tree",
            "title": "Dynamic Interactive Family Tree",
            "projectType": "Front-End Development, Data Visualization, Algorithms",
            "description": "Developed a browser-based, interactive family tree viewer in React that dynamically parses GEDCOM files and calculates complex, multi-generational Directed Acyclic Graph (DAG) layouts on the fly.",
            "fullDescription": "Built a serverless, interactive family tree application capable of rendering massive genealogy datasets directly in the browser. Using React and a specialized math engine, the app parses standard GEDCOM files and handles complex lineage scenarios like pedigree collapse, half-siblings, and multiple marriages through Directed Acyclic Graph (DAG) algorithms. I engineered a highly-resilient custom parser that sanitizes flawed data from major genealogy platforms, utilizing techniques like strict bidirectionality checks and invisible dummy nodes to prevent layout crashes. Features include smooth pan/zoom camera controls, high-resolution PDF exports, demographic analytics, interactive branch highlighting, and dynamic recentering.",
            "skills": ["React", "JavaScript", "Data Visualization", "Algorithms (DAG)", "Data Parsing & Sanitization", "Front-End Development", "Vite", "UI/UX Design"],
            "results": "Created a seamless, interactive experience for exploring vast family networks without a backend. The robust custom parsing engine successfully mitigated common data export errors from platforms like Ancestry.com, ensuring crash-free, mathematically balanced, and printable genealogical grid layouts.",
            "link": "",
            "image": "",
            "tags": ["React", "Data Visualization", "GEDCOM", "Algorithms", "Front-End", "Vite", "Parsing"],
            "flag": ["cool"]
        },
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
            "tags": ["AI", "Automation", "Microsoft Copilot Studio", "RFP", "Internal Tool", "GenAI"],
            "flag": []
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
            "tags": ["Agile", "Scrum", "Kanban", "Team Management", "Process", "Skyword", "Leadership"],
            "flag": []
        },
        {
            "id": "ai-marketing-persona-bot",
            "title": "Dynamic AI Marketing Persona Engine",
            "projectType": "AI Development, Marketing Technology, Internal Tool",
            "description": "Developed an AI bot at Brunner to create, manage, and evolve marketing personas. The tool ensures consistency and allows personas to be dynamically updated with new traits or product preferences.",
            "fullDescription": "At Brunner, I architected and built an AI assistant for creating and managing marketing personas. The initial goal was consistency and the re-use of successful archetypes. Its key innovation was the ability for personas to 'grow'—a user could request the 'Busy Bee' persona and add a new trait, like 'avid outdoorsman'. This information was saved, allowing the persona to evolve. The team could then interact with the bot, asking it to craft content for specific personas (e.g., 'appeal to Marketing Professionals and Creative Writers') or query its knowledge base ('which persona would like this slogan the most?'), making our marketing efforts more targeted and intelligent.",
            "skills": ["AI Bot Development", "Marketing Technology (MarTech)", "Persona Generation", "Content Strategy", "Prompt Engineering", "Knowledge Management", "GenAI"],
            "results": "Delivered a 'living' library of reusable, consistent marketing personas. This tool empowered the team to dynamically update personas with new preferences and query the system for content tailoring, significantly improving the relevance and targeting of our creative work.",
            "link": "",
            "image": "",
            "tags": ["AI", "Marketing", "Personas", "Brunner", "Internal Tool", "GenAI", "Content Strategy", "MarTech"],
            "flag": []
        },
        {
            "id": "pm-workflow-integration",
            "title": "Developer Workflow & PM Integration Tool",
            "projectType": "Internal Tool, Process Automation, API Integration",
            "description": "Created a simple web-based checklist for developers to update an antiquated project management system via its SOAP API, saving time and adding accountability.",
            "fullDescription": "Developed a simple web page to streamline developer workflows. The interface allowed a developer to select their name and project from drop-downs, then check off all completed project steps. Upon submission, the tool automatically connected to our antiquated project management system, which only had a SOAP API. I successfully integrated our new tool with this legacy system to automatically update the ticket status and log a message, saving the team a bunch of time and adding a layer of accountability, as each ticket update was now formally tied to a developer's attestation of completed work.",
            "skills": ["API Integration", "SOAP APIs", "Web Development", "Process Automation", "Workflow Optimization", "Legacy System Integration"],
            "results": "Dramatically reduced the time developers spent on manual data entry in the PM system. The integration successfully bridged a modern web tool with a legacy SOAP API and introduced a new layer of accountability for project step completion.",
            "link": "",
            "image": "",
            "tags": ["Automation", "Internal Tool", "API", "SOAP", "Process Improvement", "Project Management", "Legacy System"],
            "flag": []
        },
        {
            "id": "brunner-headless-website",
            "title": "Strategic Headless CMS Redevelopment (R&D)",
            "projectType": "Headless CMS, Web Redevelopment, R&D, Strategic Planning",
            "description": "Led an R&D project to redevelop the Brunner website as a headless build (Builder.io & React). The goal was to gain direct experience to advise clients, proving we believed in the technology.",
            "fullDescription": "At Brunner, I led the strategic redevelopment of our marketing website as a hands-on R&D project. With headless CMS being a major new trend, our goal was to 'dogfood' the technology to gain the hands-on experience needed to confidently advise future clients. This required extensive research and testing of many systems. We initially selected Contentful as the data store and Builder.io as the visual editor, but as Builder.io's platform rapidly added features, it made Contentful unnecessary, and we pivoted to using Builder.io exclusively. The project, built in React, also integrated our Figma design system with Storybook and successfully pulled in legacy blog content from WordPress via its API.",
            "skills": ["Headless CMS", "Technology Evaluation", "R&D", "Strategic Planning", "Builder.io", "React", "Storybook", "Figma", "API Integration", "Contentful", "Project Leadership"],
            "results": "Successfully launched the new site and gained critical, hands-on expertise with the headless paradigm. This R&D gave us the authority to advise clients on the true trade-offs. The key strategic insight was that while headless offers flexibility, it often requires rebuilding mature editor-focused features that traditional CMSes already provide, allowing us to make more nuanced and appropriate recommendations for clients.",
            "link": "",
            "image": "",
            "tags": ["Headless", "CMS", "R&D", "Strategy", "Builder.io", "React", "Storybook", "Figma", "Brunner", "Website", "API"],
            "flag": []
        },
        {
            "id": "skyword-legacy-migration",
            "title": "Legacy App Modernization (AngularJS to React)",
            "projectType": "Legacy Modernization, Technical Debt Management, Front-End Architecture",
            "description": "Orchestrated a strategic, incremental migration of a large Skyword application from AngularJS, jQuery, and vanilla JS to React, successfully reducing technical debt without disrupting existing functionality.",
            "fullDescription": "At Skyword, I tackled the challenge of a large application encumbered with legacy code, including a mix of AngularJS 1, jQuery, and vanilla JavaScript. Recognizing the need to move off AngularJS, I architected a tech debt plan for an incremental migration to React. We stopped all new AngularJS development and began building a new section of the app entirely in React. This strategy allowed us to modernize without breaking existing features. For a time, we maintained both technologies, but this phased approach enabled us to systematically convert legacy modules into modern React components, eventually eliminating the older frameworks.",
            "skills": ["Legacy Migration", "Technical Debt Management", "AngularJS", "React", "Front-End Architecture", "JavaScript", "JQuery", "Change Management", "Strategic Planning"],
            "results": "Successfully modernized the application's front-end stack, phasing out AngularJS and significantly reducing technical debt. This incremental strategy minimized risk, prevented service disruption, and successfully transitioned the development team to modern React practices.",
            "link": "",
            "image": "",
            "tags": ["React", "AngularJS", "Legacy Code", "Migration", "Technical Debt", "Skyword", "Front-End", "Architecture"],
            "flag": []
        },
        {
            "id": "sugarcrm-iot-integration-poc",
            "title": "IoT & App Integration Proof-of-Concept",
            "projectType": "Proof-of-Concept (PoC), IoT Integration, API Integration, R&D",
            "description": "Rapidly developed (in 3 days) a PoC at SugarCRM using Zapier and IFTTT to connect the CRM to Slack, smart bulbs, and Arduinos, proving hardware/software connectivity.",
            "fullDescription": "At SugarCRM, I built an experimental project to illustrate the integration and connectivity of disparate apps and hardware. Using no-code platforms like Zapier and IFTTT, I connected our SugarCRM instance to our office. When a new sales 'Opportunity' was marked as 'Closed-Won', it would automatically trigger multiple events: a Slack message would fire off to designated people, a smart bulb in the office would turn on and blink, and an Arduino-powered device would play a sound. The entire project took only 3 days but successfully proved that we could connect both software (SaaS) and hardware (IoT) to our core application.",
            "skills": ["Proof-of-Concept (PoC)", "Rapid Prototyping", "API Integration", "IoT", "Zapier", "IFTTT", "SugarCRM", "Slack", "Arduino", "Smart Devices"],
            "results": "Successfully demonstrated in just 3 days that the SugarCRM platform could be integrated with both third-party SaaS applications and physical IoT hardware. This tangible PoC clearly illustrated the platform's powerful and flexible integration capabilities.",
            "link": "",
            "image": "",
            "tags": ["IoT", "API", "Integration", "SugarCRM", "Zapier", "IFTTT", "PoC", "R&D", "Hardware", "Rapid Prototyping"],
            "flag": []
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
            const isCool = project.flag && project.flag.includes("cool");
            const coolClass = isCool ? ' project-card-cool' : '';
            const coolBadge = isCool ? `<div class="project-cool-badge" title="Visually cool project!"><i class="fas fa-star"></i></div>` : '';

            const projectCard = `
                <div class="project-card${coolClass}" data-project-id="${project.id}">
                    ${coolBadge}
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
