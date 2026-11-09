// Load data from JSON files
async function loadData() {
    try {
        const [profileData, educationData, experienceData, projectsData, certificatesData] = await Promise.all([
            fetch('data/profile.json').then(res => res.json()),
            fetch('data/education.json').then(res => res.json()),
            fetch('data/experience.json').then(res => res.json()),
            fetch('data/projects.json').then(res => res.json()),
            fetch('data/certificates.json').then(res => res.json())
        ]);
        
        renderProfile(profileData);
        renderEducation(educationData);
        renderExperience(experienceData);
        renderProjects(projectsData);
        renderCertificates(certificatesData);
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Render Profile Section
function renderProfile(data) {
    document.getElementById('profile-name').textContent = data.name;
    document.getElementById('profile-description').textContent = data.description;
    document.getElementById('profile-email').textContent = data.email;
    document.getElementById('profile-phone').textContent = data.phone;
    
    const profilePic = document.getElementById('profile-pic');
    profilePic.src = data.profileImage;
    profilePic.alt = `${data.name}'s profile picture`;
    
    const socialLinks = document.getElementById('social-links');
    data.socialMedia.forEach(social => {
        const link = document.createElement('a');
        link.href = social.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = `<i class="fab fa-${social.platform.toLowerCase()}"></i>`;
        socialLinks.appendChild(link);
    });
	
	    // Render skills
    if (data.skills) {
        const skillsGrid = document.getElementById('skills-grid');
        data.skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
                <div class="skill-icon"><i class="${skill.icon}"></i></div>
                <div>
                    <div class="skill-name">${skill.name}</div>
                    ${skill.level ? `<div class="skill-level"><div class="skill-level-bar" style="width: ${skill.level}%"></div></div>` : ''}
                </div>
            `;
            skillsGrid.appendChild(skillItem);
        });
    }	
	
    if (data.cv) {
        const cvLink = document.getElementById('cv-download');
        cvLink.href = data.cv.file;
        cvLink.querySelector('i').className = data.cv.icon;
        cvLink.setAttribute('download', '');
        
        // Insert CV button inside social links container
        document.getElementById('social-links').appendChild(cvLink);
    }
}

// Render Education Section
function renderEducation(data) {
    const educationList = document.getElementById('education-list');
    
    data.forEach(edu => {
        const eduItem = document.createElement('div');
        eduItem.className = 'education-item';
        eduItem.innerHTML = `
            <div class="edu-header">
                ${edu.logo ? `<img src="${edu.logo}" alt="${edu.university} logo" class="edu-logo">` : ''}
                <div>
                    <h3>${edu.university}</h3>
                    <p class="degree">${edu.major}</p>
                </div>
            </div>
            <p class="year">${edu.year}</p>
            <p>${edu.description}</p>
        `;
        educationList.appendChild(eduItem);
    });
}

// Render Experience Section
function renderExperience(data) {
    const experienceList = document.getElementById('experience-list');
    
    data.forEach(exp => {
        const expItem = document.createElement('div');
        expItem.className = 'experience-item';
        expItem.innerHTML = `
            <div class="exp-header">
                ${exp.logo ? `<img src="${exp.logo}" alt="${exp.company} logo" class="exp-logo">` : ''}
                <div>
                    <h3>${exp.company}</h3>
                    <p class="position">${exp.position}</p>
                </div>
            </div>
            <p class="duration">${exp.year}</p>
            <p>${exp.description}</p>
        `;
        experienceList.appendChild(expItem);
    });
}

// Render Projects Section
function renderProjects(data) {
    const projectsGrid = document.getElementById('projects-grid');
    
    data.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <div class="project-meta">
                    <span><i class="fas fa-calendar-alt"></i> ${project.year}</span>
                    ${project.fund ? `<span><i class="fas fa-money-bill-wave"></i> ${project.fund}</span>` : ''}
                    ${project.partner ? `<span><i class="fas fa-users"></i> ${project.partner}</span>` : ''}
                    ${project.role ? `<span><i class="fas fa-user-tie"></i> ${project.role}</span>` : ''}
                    ${project.institution ? `<span><i class="fas fa-building-columns"></i> ${project.institution}</span>` : ''}
                </div>
                <p>${project.description}</p>
                ${project.link ? `<a href="${project.link}" class="project-link" target="_blank">View Project <i class="fas fa-external-link-alt"></i></a>` : ''}
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });
}


// Render Certificates Section
function renderCertificates(data) {
    const certificatesGrid = document.getElementById('certificates-grid');

    if (!certificatesGrid) return;

    certificatesGrid.innerHTML = '';

    data.forEach(certificate => {
        const certificateCard = document.createElement('div');
        certificateCard.className = 'certificate-card';

        const pdfUrl = new URL(certificate.file, document.baseURI).href;

        certificateCard.innerHTML = `
            <div class="certificate-image">
                <iframe
                    src="${pdfUrl}#toolbar=0&navpanes=0"
                    title="${certificate.title}"
                    loading="lazy">
                </iframe>
            </div>

            <div class="certificate-info">
                <h3>${certificate.title}</h3>

                <p class="certificate-issuer">
                    <i class="fas fa-certificate"></i>
                    ${certificate.issuer}
                </p>

                <p class="certificate-year">
                    <i class="fas fa-calendar-alt"></i>
                    ${certificate.year}
                </p>

                <p class="certificate-description">
                    ${certificate.description}
                </p>

                <div class="certificate-actions">
                    <button type="button" class="certificate-link">
                        <i class="fas fa-eye"></i>
                        View Certificate
                    </button>

                    <button type="button" class="certificate-download">
                        <i class="fas fa-download"></i>
                        Download
                    </button>
                </div>
            </div>
        `;

        // View Certificate
        const viewButton = certificateCard.querySelector('.certificate-link');

        viewButton.addEventListener('click', () => {
            window.open(pdfUrl, '_blank', 'noopener');
        });

        // Download Certificate
        const downloadButton = certificateCard.querySelector('.certificate-download');

        downloadButton.addEventListener('click', async () => {
            try {
                downloadButton.disabled = true;

                const response = await fetch(pdfUrl);

                if (!response.ok) {
                    throw new Error('PDF tidak ditemukan');
                }

                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = certificate.file.split('/').pop();

                document.body.appendChild(link);
                link.click();
                link.remove();

                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

            } catch (error) {
                console.error('Download error:', error);
                alert('Sertifikat gagal diunduh. Periksa file PDF dan koneksi server.');

            } finally {
                downloadButton.disabled = false;
            }
        });

        certificatesGrid.appendChild(certificateCard);
    });
}


// Initialize the page
document.addEventListener('DOMContentLoaded', loadData);

document.addEventListener('DOMContentLoaded', function() {
    // Highlight active section
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });
    
    // Animate sections on scroll
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
    });
});