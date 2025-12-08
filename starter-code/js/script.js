    
	// Theme toggle — toggles between light and dark modes, updates icons/logo, and persists choice.
	//
	// Behavior summary:
	// - Reads saved theme from localStorage (key: 'theme') and applies it when available.
	// - If no saved theme, respects the system preference (prefers-color-scheme) and falls back to light.
	// - Sets a `data-theme` attribute on <html> so styles can be driven from CSS e.g., `html[data-theme="dark"]`.
	// - Swaps the header icon (moon/sun) and the logo image to match the current theme.
	// - Updates the toggle's aria-label to reflect the action it will perform when clicked.

(function () {
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
		// theme === 'dark' || 'light'
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
	/**
	 * Initialize theme on page load.
	 * Reads a saved value from localStorage; if none exists it uses the
	 * system preference via matchMedia('(prefers-color-scheme: dark)') and
	 * falls back to 'light' as the default.
	 */
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
})();


// update the character count in real time
(function(){
	const textarea = document.getElementById('text-input');
	const charCountEl = document.getElementById('char-count');
	const wordCountEl = document.getElementById('word-count');
	const sentenceCountEl = document.getElementById('sentence-count');

	if (!textarea || !charCountEl || !wordCountEl) return; // nothing to do

	/**
	 * Update character and word counts based on the textarea content.
	 */
	function updateCounts() {
		const text = textarea.value;
		// Character count includes all characters
		const charCount = text.length;
		// Word count: split by whitespace, filter out empty strings
		const words = text.trim().split(/\s+/).filter(word => word.length > 0);
		const wordCount = words.length;

		// Sentence count: split by ., !, ? and filter out empty strings
		const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
		const sentenceCount = sentences.length;

		charCountEl.textContent = charCount;
		wordCountEl.textContent = wordCount;
		sentenceCountEl.textContent = sentenceCount;
	}

	// Update counts on input event
	textarea.addEventListener('input', updateCounts);
	// Initialize counts on page load
	updateCounts();
})();


// warnings when limits are exceeded
(function(){
	const textarea = document.getElementById('text-input');
	const charLimitCheckbox = document.getElementById('set-character-limit');
	const charLimitInput = document.getElementById('character-limit');


	if (!textarea || !charLimitCheckbox || !charLimitInput) return; // nothing to do
	/**
	 * Check character limit and show alert if exceeded.
	 */	
	function checkCharacterLimit() {
		const limitEnabled = charLimitCheckbox.checked;
		const limit = parseInt(charLimitInput.value, 10);
		const currentLength = textarea.value.length;
		const warningEl = document.querySelector('.character-limit-warning');
		const textareaWrapper = textarea;

		// Toggle textarea border color based on limit status
		if (limitEnabled && !isNaN(limit) && currentLength > limit) {
			textareaWrapper.classList.add('char-limit-exceeded');
		} else {
			textareaWrapper.classList.remove('char-limit-exceeded');
		}

		const warningTemplate = `<img src="./assets/images/icon-info.svg" alt="Warning Icon" /> Limit reached! Your text exceeds ${limit} characters.`;

		if (limitEnabled && !isNaN(limit) && currentLength > limit) {
			if (warningEl) {
				warningEl.innerHTML = warningTemplate; 
				
				// to-do: stop further input when limit exceeded
			}

		
		} else {
			if (warningEl) {
				warningEl.innerHTML = '';
				
				// to-do: allow input again
				
			}
		}
	}	

	textarea.addEventListener('input', checkCharacterLimit);
	charLimitCheckbox.addEventListener('change', checkCharacterLimit);
	charLimitInput.addEventListener('input', checkCharacterLimit);
})();


// approximate reading time
(function(){
	const textarea = document.getElementById('text-input');
	const readingTimeEl = document.getElementById('reading-time');

	if (!textarea || !readingTimeEl) return; // nothing to do
	/**
	 * Update estimated reading time based on word count.
	 */
	function updateReadingTime() {
		const text = textarea.value;
		const words = text.trim().split(/\s+/).filter(word => word.length > 0);
		const wordCount = words.length;
		const wordsPerMinute = 10; // average reading speed
		const minutes = Math.ceil(wordCount / wordsPerMinute);
		readingTimeEl.textContent = `Approx. reading time: ${minutes} minute${minutes !== 1 ? 's' : ''}`;
	}

	textarea.addEventListener('input', updateReadingTime);
	// Initialize on page load
	updateReadingTime();
})();


// letter density calculation
(function(){
	const textarea = document.getElementById('text-input');
	const letterDensityEl = document.getElementById('letter-density');

	if (!textarea || !letterDensityEl) return; // nothing to do
	/**
	 * Update letter density (letters per 100 characters).
	 */
	function updateLetterDensity() {
		const text = textarea.value;
		const totalChars = text.length;

		letterDensityEl.innerHTML = ''; // clear previous content

		if(totalChars === 0) return; // nothing to do

		const letters = text.match(/[a-zA-Z]/g) || [];
		const lower = letters.map(l => l.toLowerCase());

		// build frequency map
		const freqMap = {};
		lower.forEach(letter => {
			freqMap[letter] = (freqMap[letter] || 0) + 1;
		});

		// convert to array of objects with percent
		const entries = Object.entries(freqMap).map(([letter, count]) => {
			return {
				letter,
				percent: (count / totalChars) * 100
			}
		});

		// sle container for bars
		const listContainer = document.createElement('div');
		listContainer.classList.add('density-list');

		entries.forEach((item, index) => {
			const bar = document.createElement('div');

			bar.classList.add('letter-density-bar');


			bar.innerHTML = `
				<span class="letter-label">${item.letter.toUpperCase()}</span>
				<div class="density-bar-outer">
					<div class="density-bar-inner" style="width: ${item.percent}%;"></div>
				</div>
				<span class="letter-percent">${item.percent.toFixed(2)}%</span>
			`;
			
			listContainer.appendChild(bar);
		});

		letterDensityEl.appendChild(listContainer);

		// only see more if more than 5 entries
		if(entries.length > 5){
			const btn = document.createElement('button');
			btn.innerHTML = `<i class="fa-solid fa-chevron-down"></i> See More`;
			btn.classList.add('see-more-btn');

			let expanded = false;

			btn.addEventListener('click', () => {
				const bars = listContainer.querySelectorAll('.letter-density-bar');
				
				expanded = !expanded;

				bars.forEach((bar, idx) => {
					if(idx < 5) return; // always show first 5

					bar.style.display = expanded ? 'flex' : 'none';
				});

				// toggle + icon
				btn.innerHTML = expanded ? `<i class="fa-solid fa-chevron-up"></i> See Less` : `<i class="fa-solid fa-chevron-down"></i> See More`;
			});

			letterDensityEl.appendChild(btn);
		}
	}

	textarea.addEventListener('input', updateLetterDensity);
	// Initialize on page load
	updateLetterDensity();
})();