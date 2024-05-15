const fromText = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  selectTag = document.querySelectorAll("select"),
  exchangeIcon = document.querySelector(".exchange"),
  translateBtn = document.querySelector("button"),
  icons = document.querySelectorAll(".row i");

//Add country name to the select elements
selectTag.forEach((tag, id) => {
  for (const country_code in countries) {
    let selected;
    if (id == 0 && country_code == "en-GB") {
      selected = "selected";
    } else if (id == 1 && country_code == "es-ES") {
      selected = "selected";
    }
    let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

/*=============== HANDLER FUNCTIONS ===============*/

const handleSwapLanguages = () => {
  let tempText = fromText.value;
  fromText.value = toText.value;
  toText.value = tempText;

  let tempLang = selectTag[0].value;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
};

const handleTranslation = () => {
  let text = fromText.value,
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");
  let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiURL)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data); // Check the entire response data structure
      if (data.responseData && data.responseData.translatedText) {
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "Translation");
      } else {
        console.log("Translated text not found in the response data:", data);
      }
    })
    .catch((error) => {
      console.error("Error fetching translation:", error);
    });
};

const handleSpeech = ({ target }) => {
  if (target.classList.contains("fa-copy")) {
    if (target.id == "from") {
      navigator.clipboard.writeText(fromText.value);
    } else {
      navigator.clipboard.writeText(toText.value);
    }
  } else {
    let utterance;
    if (target.id == "from") {
      utterance = new SpeechSynthesisUtterance(fromText.value);
      utterance.lang = selectTag[0].value;
    } else {
      utterance = new SpeechSynthesisUtterance(toText.value);
      utterance.lang = selectTag[1].value;
    }
    speechSynthesis.speak(utterance);
  }
};

/*=============== EVENT LISTENERS ===============*/

exchangeIcon.addEventListener("click", handleSwapLanguages);

translateBtn.addEventListener("click", handleTranslation);

icons.forEach((icon) => {
  icon.addEventListener("click", handleSpeech);
});
