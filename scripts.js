console.log("scripts.js wurde geladen");

async function corsBypass(url, options) {
  const proxy = "https://corsproxy.io/?";
  const response = await fetch(proxy + encodeURIComponent(url), options);
  return response;
}

async function fetchWord(guess) {
  const response = await corsBypass("https://wordle-api.vercel.app/api/wordle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ guess })
  });

  const data = await response.json();
  console.log("🔍 API Antwort:", data);
  return data;
}

const inputs = document.querySelectorAll("#word-container input");
const checkBtn = document.querySelector("#checkBtn");
const status = document.querySelector("#status");

checkBtn.addEventListener("click", async () => {
  const userGuess = Array.from(inputs).map(i => i.value.toLowerCase()).join('');

  if ([...inputs].some(i => i.value.trim() === '')) {
    status.textContent = "Bitte alle Buchstaben eingeben.";
    return;
  }

  const result = await fetchWord(userGuess);

  if (!result || (!result.character_info && !result.was_correct)) {
    status.textContent = "Ungültige Antwort von der API.";
    return;
  }

  inputs.forEach(i => i.classList.remove('correct', 'misplaced', 'wrong', 'pop'));

  if (result.was_correct) {
    status.textContent = "Richtig! Du hast das Wort erraten!";
    inputs.forEach(i => i.classList.add('correct', 'pop'));
    return;
  }

  result.character_info.forEach((info, i) => {
    if (info.scoring.correct_idx) {
      inputs[i].classList.add('correct', 'pop');
    } else if (info.scoring.in_word) {
      inputs[i].classList.add('misplaced', 'pop');
    } else {
      inputs[i].classList.add('wrong', 'pop');
    }
  });

  status.textContent = "Womp Womp! Versuch es erneut.";
});

// https://github.com/petergeorgas/Wordle-API?tab=readme-ov-file