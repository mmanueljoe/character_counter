// update the character count in real time
export default function characterCountLogic(){
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

		// Word count: split by whitespace, filter out empty strings, filter out non-word entries,filter special characters

        const words = text.trim().split(/\s+/).filter(word => word.length > 0 && /\w/.test(word));

		const wordCount = words.length;

		// Sentence count: split by ., !, ? and filter out empty strings
		const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
		const sentenceCount = sentences.length;

        // Update the DOM elements with padded counts
        charCountEl.textContent = charCount.toString().padStart(2, '0');

        wordCountEl.textContent = wordCount.toString().padStart(2, '0');

        if (sentenceCountEl) {
            sentenceCountEl.textContent = sentenceCount.toString().padStart(2, '0');
        }
	}

	// Update counts on input event
	textarea.addEventListener('input', updateCounts);
	// Initialize counts on page load
	updateCounts();
};



