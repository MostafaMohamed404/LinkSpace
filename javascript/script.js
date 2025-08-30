// Global variables
let currentLang = 'en';
let socialLinks = [];

// Social media platforms with their icons
const socialPlatforms = {
    instagram: { icon: 'fab fa-instagram', color: 'instagram' },
    facebook: { icon: 'fab fa-facebook', color: 'facebook' },
    twitter: { icon: 'fab fa-twitter', color: 'twitter' },
    linkedin: { icon: 'fab fa-linkedin', color: 'linkedin' },
    youtube: { icon: 'fab fa-youtube', color: 'youtube' },
    tiktok: { icon: 'fab fa-tiktok', color: 'tiktok' },
    snapchat: { icon: 'fab fa-snapchat', color: 'snapchat' },
    whatsapp: { icon: 'fab fa-whatsapp', color: 'whatsapp' },
    telegram: { icon: 'fab fa-telegram', color: 'telegram' },
    website: { icon: 'fas fa-globe', color: 'website' }
};

// Initialize AOS (only if available)
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add first social link
    if (document.getElementById('socialLinksContainer')) {
        addSocialLink();
    }
    
    // Load any existing data
    loadDataFromStorage();
    
    // Initialize event listeners
    initializeEventListeners();
});

// Initialize event listeners
function initializeEventListeners() {
    // Profile picture handling
    const profilePic = document.getElementById('profilePic');
    if (profilePic) {
        profilePic.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewImage = document.getElementById('previewImage');
                    previewImage.innerHTML = `<img src="${e.target.result}" alt="Profile">`;
                    previewImage.classList.add('bounce-in');
                    
                    // Save image to localStorage for card page
                    localStorage.setItem('profileImage', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Name input handling
    const userName = document.getElementById('userName');
    if (userName) {
        userName.addEventListener('input', function(e) {
            const previewName = document.getElementById('previewName');
            previewName.textContent = e.target.value || (currentLang === 'en' ? 'Your Name' : 'اسمك');
            previewName.classList.add('fade-in');
            saveDataToStorage();
        });
    }

    // Bio input handling
    const userBio = document.getElementById('userBio');
    if (userBio) {
        userBio.addEventListener('input', function(e) {
            const previewBio = document.getElementById('previewBio');
            previewBio.textContent = e.target.value || (currentLang === 'en' ? 'Your bio will appear here...' : 'ستظهر نبذتك التعريفية هنا...');
            previewBio.classList.add('fade-in');
            saveDataToStorage();
        });
    }
}

// Language toggle functionality
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    const body = document.body;
    
    // Remove existing direction classes
    body.classList.remove('ltr', 'rtl');
    body.classList.add(currentLang === 'ar' ? 'rtl' : 'ltr');
    
    // Update all text elements
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
        el.textContent = el.getAttribute('data-' + currentLang);
    });

    // Update placeholders
    document.querySelectorAll('[data-placeholder-en][data-placeholder-ar]').forEach(el => {
        el.placeholder = el.getAttribute('data-placeholder-' + currentLang);
    });

    // Update language toggle button
    const langText = document.getElementById('langText');
    if (langText) {
        langText.textContent = currentLang === 'en' ? 'العربية' : 'English';
    }
}

// Background change functionality
function changeBackground(bgClass) {
    const body = document.getElementById('mainBody') || document.getElementById('cardBody');
    if (body) {
        // Keep the direction class
        const isRTL = body.classList.contains('rtl');
        body.className = bgClass;
        if (isRTL) {
            body.classList.add('rtl');
        } else {
            body.classList.add('ltr');
        }
    }
    
    // Update active template (only on main page)
    const templates = document.querySelectorAll('.bg-template');
    templates.forEach(template => {
        template.classList.remove('active');
    });
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Social links functionality
function addSocialLink() {
    const container = document.getElementById('socialLinksContainer');
    if (!container) return;
    
    const linkId = 'link_' + Date.now() + Math.random();
    
    const linkItem = document.createElement('div');
    linkItem.className = 'social-link-item fade-in';
    linkItem.id = linkId;
    
    linkItem.innerHTML = `
        <select onchange="updatePreviewAndSave()">
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="snapchat">Snapchat</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="website">Website</option>
        </select>
        <input type="url" placeholder="${currentLang === 'en' ? 'Enter URL' : 'أدخل الرابط'}" onchange="updatePreviewAndSave()">
        <button class="remove-link" onclick="removeSocialLink('${linkId}')">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    container.appendChild(linkItem);
    updatePreviewAndSave();
}

function addSocialLinkWithData(platform, url) {
    const container = document.getElementById('socialLinksContainer');
    if (!container) return;
    
    const linkId = 'link_' + Date.now() + Math.random();
    
    const linkItem = document.createElement('div');
    linkItem.className = 'social-link-item fade-in';
    linkItem.id = linkId;
    
    linkItem.innerHTML = `
        <select onchange="updatePreviewAndSave()">
            <option value="instagram" ${platform === 'instagram' ? 'selected' : ''}>Instagram</option>
            <option value="facebook" ${platform === 'facebook' ? 'selected' : ''}>Facebook</option>
            <option value="twitter" ${platform === 'twitter' ? 'selected' : ''}>Twitter</option>
            <option value="linkedin" ${platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
            <option value="youtube" ${platform === 'youtube' ? 'selected' : ''}>YouTube</option>
            <option value="tiktok" ${platform === 'tiktok' ? 'selected' : ''}>TikTok</option>
            <option value="snapchat" ${platform === 'snapchat' ? 'selected' : ''}>Snapchat</option>
            <option value="whatsapp" ${platform === 'whatsapp' ? 'selected' : ''}>WhatsApp</option>
            <option value="telegram" ${platform === 'telegram' ? 'selected' : ''}>Telegram</option>
            <option value="website" ${platform === 'website' ? 'selected' : ''}>Website</option>
        </select>
        <input type="url" value="${url || ''}" placeholder="${currentLang === 'en' ? 'Enter URL' : 'أدخل الرابط'}" onchange="updatePreviewAndSave()">
        <button class="remove-link" onclick="removeSocialLink('${linkId}')">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    container.appendChild(linkItem);
}

function removeSocialLink(linkId) {
    const element = document.getElementById(linkId);
    if (element) {
        element.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            element.remove();
            updatePreviewAndSave();
        }, 300);
    }
}

// Combined function to update preview and save data
function updatePreviewAndSave() {
    updatePreview();
    saveDataToStorage();
}

function updatePreview() {
    const previewContainer = document.getElementById('previewLinks');
    if (!previewContainer) return;
    
    previewContainer.innerHTML = '';
    
    const socialItems = document.querySelectorAll('.social-link-item');
    socialItems.forEach(item => {
        const platform = item.querySelector('select').value;
        const url = item.querySelector('input').value;
        
        if (url) {
            const linkElement = document.createElement('a');
            linkElement.href = url;
            linkElement.target = '_blank';
            linkElement.className = `social-link-preview ${socialPlatforms[platform].color}`;
            linkElement.innerHTML = `
                <i class="${socialPlatforms[platform].icon}"></i>
                <span>${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
            `;
            previewContainer.appendChild(linkElement);
        }
    });
}

// Data storage functions
function saveDataToStorage() {
    const data = {
        name: '',
        bio: '',
        links: []
    };

    // Get name and bio
    const nameInput = document.getElementById('userName');
    const bioInput = document.getElementById('userBio');
    
    if (nameInput) data.name = nameInput.value || '';
    if (bioInput) data.bio = bioInput.value || '';

    // Get all social links
    const socialItems = document.querySelectorAll('.social-link-item');
    socialItems.forEach(item => {
        const platform = item.querySelector('select').value;
        const url = item.querySelector('input').value;
        if (url) {
            data.links.push({ platform, url });
        }
    });

    // Store in localStorage
    localStorage.setItem('profileData', JSON.stringify(data));
    
    // Return shareable URL for QR code
    const encodedData = btoa(encodeURIComponent(JSON.stringify(data)));
    const currentBG = document.body.className.split(' ').find(cls => cls.startsWith('bg-')) || 'bg-gradient-1';
    return `${window.location.origin}${window.location.pathname.replace('index.html', 'card.html')}?data=${encodedData}&bg=${currentBG}`;
}

function loadDataFromStorage() {
    let data = null;
    
    // Try to load from localStorage first
    try {
        const storedData = localStorage.getItem('profileData');
        if (storedData) {
            data = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error loading data from localStorage:', error);
    }
    
    // Try to load from URL parameters (for shared links)
    if (!data) {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');
        
        if (encodedData) {
            try {
                data = JSON.parse(decodeURIComponent(atob(encodedData)));
            } catch (error) {
                console.error('Error loading data from URL:', error);
            }
        }
    }
    
    if (data) {
        // Load name
        const nameInput = document.getElementById('userName');
        const previewName = document.getElementById('previewName');
        if (data.name && nameInput && previewName) {
            nameInput.value = data.name;
            previewName.textContent = data.name;
        }
        
        // Load bio
        const bioInput = document.getElementById('userBio');
        const previewBio = document.getElementById('previewBio');
        if (data.bio && bioInput && previewBio) {
            bioInput.value = data.bio;
            previewBio.textContent = data.bio;
        }
        
        // Load profile image from localStorage
        const savedImage = localStorage.getItem('profileImage');
        const previewImage = document.getElementById('previewImage');
        if (savedImage && previewImage) {
            previewImage.innerHTML = `<img src="${savedImage}" alt="Profile">`;
        }
        
        // Clear existing social links
        const container = document.getElementById('socialLinksContainer');
        if (container) {
            container.innerHTML = '';
            
            // Load social links
            if (data.links && data.links.length > 0) {
                data.links.forEach(linkData => {
                    addSocialLinkWithData(linkData.platform, linkData.url);
                });
            } else {
                // Add default empty link if no links
                addSocialLink();
            }
        }
        
        // Update preview
        updatePreview();
    }
}

// QR Code functionality
function generateQR() {
    // Check if QRious is available
    if (typeof QRious === 'undefined') {
        console.error('QRious library not loaded');
        return;
    }
    
    // Save current data and get the shareable URL
    const shareableURL = saveDataToStorage();
    
    const canvas = document.getElementById('qrCanvas');
    if (!canvas) return;
    
    const qr = new QRious({
        element: canvas,
        value: shareableURL,
        size: 200,
        background: 'white',
        foreground: '#2d3748',
        level: 'M'
    });

    const container = document.getElementById('qrContainer');
    if (container) {
        container.classList.add('show');
        canvas.classList.add('bounce-in');
    }
    
    // Show success message
    showSuccessMessage(shareableURL);
}

function showSuccessMessage(shareableURL) {
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 25px;
        border-radius: 15px;
        z-index: 1000;
        text-align: center;
        max-width: 90%;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;
    tempDiv.innerHTML = `
        <div style="margin-bottom: 15px;">
            <i class="fas fa-check-circle" style="color: #48bb78; font-size: 2rem; margin-bottom: 10px;"></i>
            <h3>QR Code Generated Successfully!</h3>
        </div>
        <p style="margin-bottom: 15px; color: #a0aec0;">Scan this QR code to view your profile card directly</p>
        <details style="margin: 10px 0;">
            <summary style="cursor: pointer; color: #4299e1;">Show Shareable URL</summary>
            <input type="text" value="${shareableURL}" readonly style="width: 100%; padding: 8px; margin: 10px 0; border: none; border-radius: 8px; font-size: 11px; background: #2d3748; color: white;" onclick="this.select()">
        </details>
        <button onclick="this.parentElement.remove()" style="background: #4299e1; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; margin-top: 10px;">Got it!</button>
    `;
    document.body.appendChild(tempDiv);
    
    // Auto remove after 7 seconds
    setTimeout(() => {
        if (tempDiv.parentElement) {
            tempDiv.remove();
        }
    }, 7000);
}

function downloadQR() {
    const canvas = document.getElementById('qrCanvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'profile-qr-code.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Utility functions
function showErrorMessage(message) {
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fed7d7;
        color: #c53030;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-left: 4px solid #e53e3e;
    `;
    tempDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>
        ${message}
    `;
    document.body.appendChild(tempDiv);
    
    setTimeout(() => {
        if (tempDiv.parentElement) {
            tempDiv.remove();
        }
    }, 5000);
}