// approximate reading time
export default function approximateReadingTimeLogic(){
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
		const wordsPerMinute = 200; // average reading speed
		const minutes = Math.ceil(wordCount / wordsPerMinute);
		readingTimeEl.textContent = `Approx. reading time: ${minutes} minute${minutes !== 1 ? 's' : ''}`;
	}

	textarea.addEventListener('input', updateReadingTime);
	// Initialize on page load
	updateReadingTime();
};