// Simple script to highlight the current post link in navigation (if needed)
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (window.location.pathname.endsWith(link.getAttribute('href'))) {
            link.style.fontWeight = 'bold';
            link.style.textDecoration = 'none';
        }
    });
});
