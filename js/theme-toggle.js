// ASPEN Theme Toggle System
// Manages theme switching between default ASPEN and paramilitary terminal aesthetics

(function() {
    'use strict';

    const THEME_STORAGE_KEY = 'aspen-theme';
    const DEFAULT_THEME = 'default';

    // Load saved theme on page load
    function loadTheme() {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
        applyTheme(savedTheme);
    }

    // Apply theme to document
    function applyTheme(theme) {
        const html = document.documentElement;
        
        // Remove all theme attributes
        html.removeAttribute('data-theme');
        
        // Apply new theme if not default
        if (theme !== 'default') {
            html.setAttribute('data-theme', theme);
        }
        
        // Save to storage
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        
        // Update active button state
        updateButtonStates(theme);
    }

    // Update button visual states
    function updateButtonStates(activeTheme) {
        const buttons = document.querySelectorAll('.theme-btn');
        buttons.forEach(btn => {
            const btnId = btn.id.replace('theme-', '');
            if (btnId === activeTheme) {
                btn.style.borderColor = 'var(--accent-primary)';
                btn.style.background = 'var(--bg-button-active)';
                btn.style.transform = 'scale(1.05)';
            } else {
                btn.style.borderColor = 'var(--border-primary)';
                btn.style.background = 'var(--bg-button)';
                btn.style.transform = 'scale(1)';
            }
        });
    }

    // Initialize theme system when DOM is ready
    function init() {
        // Load saved theme
        loadTheme();

        // Set up button event listeners
        const themeButtons = [
            { id: 'theme-default', theme: 'default' },
            { id: 'theme-military', theme: 'military' },
            { id: 'theme-tactical', theme: 'tactical' },
            { id: 'theme-command', theme: 'command' }
        ];

        themeButtons.forEach(({ id, theme }) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => {
                    applyTheme(theme);
                    console.log(`[ASPEN Theme] Switched to: ${theme.toUpperCase()}`);
                });
            }
        });

        console.log('[ASPEN Theme] System initialized');
    }

    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
