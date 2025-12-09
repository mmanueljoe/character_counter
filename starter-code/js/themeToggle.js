// Theme toggle — toggles between light and dark modes, updates icons/logo, and persists choice.

export default function themeToggle() {
	const THEME_KEY = 'theme';
	
	const ICONS = {
		moon: './assets/images/icon-moon.svg',
		sun: './assets/images/icon-sun.svg'
	};

	const LOGOS = {
		light: './assets/images/logo-light-theme.svg',
		dark: './assets/images/logo-dark-theme.svg'
	};

	const toggler = document.getElementById('theme-toggler');
	if (!toggler) return; // nothing to do

	const togglerImg = toggler.querySelector('img');
	const logoImg = document.querySelector('.logo');

	/**
	 * Apply a theme to the document
	 * - sets html[data-theme]
	 * - updates header icon and logo to reflect current theme
	 * - updates aria-label for accessibility
	 * - persists the selected theme to localStorage
	 * @param {'dark'|'light'} theme
	 */
	function applyTheme(theme) {
		
		document.documentElement.setAttribute('data-theme', theme);
		// update icon: show moon when in light mode (so clicking it moves to dark), show sun in dark mode
		if (togglerImg) togglerImg.src = theme === 'dark' ? ICONS.sun : ICONS.moon;
		// update accessible label (reflect the action the button will perform)
		if (toggler) toggler.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
		// update logo
		if (logoImg) logoImg.src = theme === 'dark' ? LOGOS.dark : LOGOS.light;
		// persist
		try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
	}

	// determine starting theme priority: saved > system preference > fallback light
		function initTheme() {
		let saved = null;
		try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}

		if (saved === 'dark' || saved === 'light') {
			applyTheme(saved);
			return;
		}

		const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		applyTheme(prefersDark ? 'dark' : 'light');
	}

	toggler.addEventListener('click', function () {
		const current = document.documentElement.getAttribute('data-theme') || 'light';
		const next = current === 'dark' ? 'light' : 'dark';
		applyTheme(next);
	});

	// initialize on load
	initTheme();
};