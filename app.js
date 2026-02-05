// Supabase configuration
const SUPABASE_URL = 'https://pxqoyrvnceeyxkvgyyjz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4cW95cnZuY2VleXhrdmd5eWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMzg2OTQsImV4cCI6MjA4NDcxNDY5NH0.T1aPTcH0URF0r36-d8ybcnafWDUnTbziXwVzPj6Ye0w';

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Form elements
const form = document.getElementById('waitlistForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim().toLowerCase(),
        preferred_model: formData.get('preferred_model')
    };
    
    // Validate form data
    if (!data.name || !data.email || !data.preferred_model) {
        showError('Please fill in all fields');
        return;
    }
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Set loading state
    setLoading(true);
    
    try {
        // Insert data into Supabase
        const { error } = await supabaseClient
            .from('waitlist')
            .insert([data]);
        
        if (error) {
            // Check for duplicate email error
            if (error.code === '23505') {
                showError('This email is already on the waitlist!');
            } else {
                console.error('Supabase error:', error);
                showError('Failed to join waitlist. Please try again.');
            }
            return;
        }
        
        // Show success message
        showSuccess();
        
    } catch (err) {
        console.error('Error:', err);
        showError('An unexpected error occurred. Please try again.');
    } finally {
        setLoading(false);
    }
});

// Set loading state
function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'inline';
    btnLoader.style.display = isLoading ? 'inline-flex' : 'none';
}

// Show success message
function showSuccess() {
    form.style.display = 'none';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Add celebration animation
    createConfetti();
}

// Show error message
function showError(message) {
    const errorText = errorMessage.querySelector('p');
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ffc107', '#ff9800', '#ffffff', '#9e9e9e'];
    const container = document.querySelector('.form-card');
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.8;
            left: 50%;
            top: 50%;
        `;
        
        container.appendChild(confetti);
        
        // Animate confetti
        const angle = (Math.PI * 2 * i) / 50;
        const velocity = 100 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - 100;
        const rotation = Math.random() * 360;
        
        confetti.animate([
            { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 0.8 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${rotation}deg)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'cubic-bezier(0, .9, .57, 1)',
        }).onfinish = () => confetti.remove();
    }
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded - Initializing dropdown');
    
    // Custom Dropdown functionality
    const dropdownTrigger = document.getElementById('dropdownTrigger');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownOptions = document.querySelectorAll('.model-option');
    const triggerText = document.querySelector('.trigger-text');
    const hiddenInput = document.getElementById('preferred_model');
    let isOpen = false;
    
    console.log('Dropdown elements found:', {
        trigger: !!dropdownTrigger,
        menu: !!dropdownMenu,
        options: dropdownOptions.length
    });
    
    // Toggle dropdown
    dropdownTrigger.addEventListener('click', (e) => {
        console.log('Dropdown trigger clicked');
        e.stopPropagation();
        isOpen = !isOpen;
        dropdownMenu.classList.toggle('show', isOpen);
        dropdownTrigger.classList.toggle('active', isOpen);
        
        console.log('Dropdown state:', isOpen, 'Menu classes:', dropdownMenu.classList.toString());
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdownTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
            isOpen = false;
            dropdownMenu.classList.remove('show');
            dropdownTrigger.classList.remove('active');
        }
    });
    
    // Prevent closing when clicking inside dropdown
    dropdownMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Handle option selection
    dropdownOptions.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const name = option.querySelector('.model-name').textContent;
            
            // Update hidden input
            hiddenInput.value = value;
            
            // Update trigger text
            triggerText.textContent = name;
            triggerText.classList.add('selected');
            
            // Update selected state
            dropdownOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            // Close dropdown
            isOpen = false;
            dropdownMenu.classList.remove('show');
            dropdownTrigger.classList.remove('active');
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            isOpen = false;
            dropdownMenu.classList.remove('show');
            dropdownTrigger.classList.remove('active');
        }
    });
});