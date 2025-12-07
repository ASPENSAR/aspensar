/**
 * Version Check System
 * Automatically reloads the page once when a new version is detected
 */

(function() {
    // Update this version number whenever you make significant changes
    const CURRENT_VERSION = '7.4.1';
    const VERSION_KEY = 'axiom-site-version';
    
    const storedVersion = localStorage.getItem(VERSION_KEY);
    
    // If version doesn't match and we haven't already reloaded
    if (storedVersion !== CURRENT_VERSION) {
        console.log(`🔄 Version update detected: ${storedVersion} → ${CURRENT_VERSION}`);
        
        // Update the version first
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        
        // Check if we just reloaded (prevent infinite reload loop)
        const justReloaded = sessionStorage.getItem('axiom-just-reloaded');
        
        if (!justReloaded) {
            // Mark that we're about to reload
            sessionStorage.setItem('axiom-just-reloaded', 'true');
            
            // Clear the reload marker after reload completes
            window.addEventListener('load', () => {
                setTimeout(() => {
                    sessionStorage.removeItem('axiom-just-reloaded');
                }, 1000);
            });
            
            // Reload the page
            console.log('♻️ Reloading page to apply updates...');
            window.location.reload(true);
        }
    } else {
        console.log(`✅ Version ${CURRENT_VERSION} loaded successfully`);
    }
})();
