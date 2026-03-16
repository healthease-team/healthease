// Load shared navbar dynamically
(async () => {
  const container = document.getElementById('navbar-container');
  if (!container) {
    console.warn('No #navbar-container found');
    return;
  }

  // Loading state
  container.innerHTML = '<div class="text-center p-5 navbar-loading">Loading navigation...</div>';

  try {
    // Fetch navbar HTML
    const response = await fetch('/shared/navbar.html');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    let navbarHTML = await response.text();
    
    // Extract body content (remove doctype/html/head/body)
    const parser = new DOMParser();
    const doc = parser.parseFromString(navbarHTML, 'text/html');
    const navbarBody = doc.body.innerHTML;
    
    // Insert HTML
    container.innerHTML = navbarBody;
    
    // Dynamically load CSS if not present
    if (!document.querySelector('#shared-navbar-css')) {
      const cssLink = document.createElement('link');
      cssLink.id = 'shared-navbar-css';
      cssLink.rel = 'stylesheet';
      cssLink.href = '/shared/navbar.css';
      document.head.appendChild(cssLink);
    }
    
    // Load navbar.js and app.js if not loaded
    ['shared/navbar.js', 'app.js'].forEach(src => {
      if (!Array.from(document.scripts).some(s => s.src.includes(src))) {
        const script = document.createElement('script');
        script.src = `/${src}`;
        script.async = true;
        document.body.appendChild(script);
      }
    });
    
    // Trigger resize for Bootstrap components
    window.dispatchEvent(new Event('resize'));
    
  } catch (error) {
    console.error('Failed to load navbar:', error);
    container.innerHTML = '<header class="bg-danger text-white p-3 text-center">Navigation temporarily unavailable</header>';
  }
})();
