// warnings when limits are exceeded
export default function limitsExceededLogic(){
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
};
