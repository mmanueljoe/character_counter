// letter density calculation
export default function letterDensityLogic() {
  const textarea = document.getElementById("text-input");
  const letterDensityEl = document.getElementById("letter-density");

  // exit if essential elements are missing
  if (!textarea || !letterDensityEl) {
    // show default message if letter density element is missing
    if (letterDensityEl) {
      letterDensityEl.innerHTML =
        '<p class="info-text">No characters found. Start typing to see letter density.</p>';
    }

    return;
  }

  // render placeholder text when no characters are present
  function renderPlaceholder() {
    letterDensityEl.innerHTML =
      '<p class="info-text">No characters found. Start typing to see letter density.</p>';
  }

  /**
   * Update letter density (letters per 100 characters).
   */
  function updateLetterDensity() {
    const text = textarea.value || "";
    const totalChars = text.length;

    // if no characters, show placeholder
    if (totalChars === 0) {
      renderPlaceholder();
      return;
    }

    letterDensityEl.innerHTML = ""; // clear previous content

    if (totalChars === 0) return; // nothing to do

    const letters = text.match(/[a-zA-Z]/g) || [];
    const lower = letters.map((l) => l.toLowerCase());

    // build frequency map
    const freqMap = {};
    lower.forEach((letter) => {
      freqMap[letter] = (freqMap[letter] || 0) + 1;
    });

    // console.log(freqMap);

    // convert to array of objects with percent
    const entries = Object.entries(freqMap).map(([letter, count]) => {
      return {
        letter,
        percent: (count / totalChars) * 100,
      };
    });

    // create container for bars
    const listContainer = document.createElement("div");
    listContainer.classList.add("density-list");

    entries
      .sort((a, b) => b.percent - a.percent) // sort descending by percent
      .forEach((item) => {
        const bar = document.createElement("div");

        bar.classList.add("letter-density-bar");

        const percent = Math.max(0, Math.min(100, Number(item.percent) || 0)); // clamp
        const rounded = Math.round(percent);

        bar.innerHTML = `
        <p class="letter-label">${item.letter.toUpperCase()}</p>

        <progress
            class="density-bar-outer"
            max="100"
            value="${rounded}"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="${rounded}"
            aria-label="Letter ${item.letter.toUpperCase()} density percentage"
        ></progress>

        <p class="letter-percent">${Math.floor(percent)} (${percent.toFixed(
          2
        )}%)</p>
        `;

        listContainer.appendChild(bar);
      });

    letterDensityEl.appendChild(listContainer);

    // only see more if more than 5 entries
    if (entries.length > 5) {
      const btn = document.createElement("button");
      btn.innerHTML = `See More <i class="fa-solid fa-angle-down arrow-custom-style"></i>`;
      btn.classList.add("more-less-btn");

      let expanded = false;

      btn.addEventListener("click", () => {
        const bars = listContainer.querySelectorAll(".letter-density-bar");

        expanded = !expanded;

        bars.forEach((bar, idx) => {
          if (idx < 5) return; // always show first 5

          bar.style.display = expanded ? "grid" : "none";
        });

        // toggle + icon
        btn.innerHTML = expanded
          ? 'See less <i class="fa-solid fa-angle-up arrow-custom-style"></i>'
          : 'See more <i class="fa-solid fa-angle-down arrow-custom-style"></i>';
      });

      letterDensityEl.appendChild(btn);
    }
  }

  // if nothing is typed display text tell user to type something

  textarea.addEventListener("input", updateLetterDensity);
  // Initialize on page load
  updateLetterDensity();
}
