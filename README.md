# jillshaheen.com

Professional portfolio website for Jill Shaheen - Technical Writer, Content Strategist, and Team Leader.

## Overview

This is a single-page portfolio website showcasing professional experience, technical skills, education, and projects. The site features a modern, responsive design with smooth scrolling navigation and interactive elements.

## Live Site

Visit the live portfolio at: [jillshaheen.com](https://jillshaheen.com)



## Project Structure

```
jillshaheen.com/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Custom CSS styles
├── js/
│   └── script.js        # JavaScript functionality
├── img/                 # Image assets
│   ├── profile.jpg      # Profile photo
│   ├── favicon/         # Favicon files
│   └── projects/        # Project images and assets
│       ├── emr-console-thumb.png
│       ├── error-thumb.png
│       ├── notebooks.png
│       └── s3.png
└── README.md            # This file
```

## Sections

1. **Hero Section**: Introduction with profile photo and call-to-action buttons
2. **About**: Professional summary and philosophy
3. **Professional Experience**: Timeline of work history including:
   - AWS (2022 - Present)
   - SugarCRM (2014 - 2022)
   - Aerotech Inc. (2007 - 2014)
4. **Technical Skills**: Organized by category:
   - Documentation
   - Development
   - AI/Automation
   - Design/Media
   - Project Management
   - Marketing/CRM
5. **Education**: Academic credentials from Duquesne University
6. **Projects**: Portfolio of notable work and achievements
   - Click project cards to view detailed information in a modal
   - Projects with images display thumbnails next to descriptions
   - Click thumbnails to view images in full-screen mode
   - Projects with external links show an icon next to the title
7. **Contact**: Email and LinkedIn connection options

## Local Development

To run this website locally:

1. Clone the repository:
```bash
git clone https://github.com/jburgh/jillshaheen.com.git
cd jillshaheen.com
```

2. Open `index.html` in your web browser, or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

3. Navigate to `http://localhost:8000` (or the appropriate port)

## Customization

### Updating Content

- **Personal Information**: Edit the content in `index.html` within each section
- **Styles**: Modify `css/styles.css` for design changes
- **Images**: Replace images in the `img/` directory
  - Profile images: `img/profile.jpg`
  - Project images: `img/projects/` directory
- **Projects**: Add or modify project data in `js/script.js` within the `PROJECTS_DATA` array
  - Each project can include: `id`, `title`, `projectType`, `description`, `fullDescription`, `skills`, `results`, `link`, `image`, `tags`
  - Projects with an `image` property will display a thumbnail in the modal
  - Projects with a `link` property will show a clickable icon next to the title

### Color Scheme

The site uses a professional color palette that can be customized in `css/styles.css`:
- Primary colors defined in CSS custom properties
- Mid-century modern inspired design elements
- Accessible color contrast ratios

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contact

- **Email**: jillshaheen@gmail.com
- **LinkedIn**: [linkedin.com/in/jillshaheen](https://www.linkedin.com/in/jillshaheen)

## License

© 2025 Jill Shaheen. All rights reserved.

## Acknowledgments

- Bootstrap for responsive framework
- Font Awesome for icons
- Google Fonts for typography
