// Elementos del DOM
const leftButton = document.getElementById("left--button");
const leftOutput = document.getElementById("speech--left");
const leftLangSelect = document.getElementById("left-lang");

const rightButton = document.getElementById("right--button");
const rightOutput = document.getElementById("speech--right");
const rightLangSelect = document.getElementById("right-lang");

// Función para traducir texto usando el backend Flask
async function traducirTexto(texto, idiomaOrigen, idiomaDestino) {
  try {
    const response = await fetch("/traducir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: texto,
        source: idiomaOrigen,
        target: idiomaDestino
      })
    });

    const data = await response.json();

    if (data.translatedText) {
      return data.translatedText;
    } else {
      throw new Error(data.error || "Error desconocido al traducir");
    }
  } catch (err) {
    console.error("Error en traducirTexto:", err);
    throw err;
  }
}

// Reconocimiento de voz - lado izquierdo
const recognitionLeft = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognitionLeft.interimResults = false;
recognitionLeft.maxAlternatives = 1;

let isRecognizingLeft = false;

leftButton.addEventListener("click", () => {
  if (!isRecognizingLeft) {
    recognitionLeft.lang = leftLangSelect.value || "es";
    recognitionLeft.start();
    isRecognizingLeft = true;
    leftButton.classList.add("listening"); // ⬅️ AUMENTO
    leftOutput.textContent = "🎤 Escuchando... habla ahora";
    console.log("Inicio reconocimiento izquierdo");
  } else {
    console.log("Reconocimiento izquierdo ya está activo");
  }
});

recognitionLeft.onspeechstart = () => {
  console.log("Speech started - reconocimiento izquierdo");
};

recognitionLeft.onresult = async (event) => {
  const texto = event.results[0][0].transcript;
  console.log("Texto reconocido izquierda:", texto);
  const idiomaDestino = rightLangSelect.value || "en";

  try {
    const traduccion = await traducirTexto(texto, "auto", idiomaDestino);
    rightOutput.textContent = traduccion;
  } catch (err) {
    rightOutput.textContent = "❌ Error al traducir";
  }
};

recognitionLeft.onerror = (event) => {
  console.error("Error reconocimiento izquierdo:", event.error);
  if (event.error !== 'no-speech') {
    leftOutput.textContent = "❌ Error reconocimiento: " + event.error;
  }
};

recognitionLeft.onend = () => {
  isRecognizingLeft = false;
  leftButton.classList.remove("listening"); // ⬅️ AUMENTO
  console.log("Reconocimiento izquierdo terminado");
};

recognitionLeft.onspeechend = () => {
  console.log("Speech ended - recognitionLeft");
  recognitionLeft.stop();
};

// Reconocimiento de voz - lado derecho
const recognitionRight = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognitionRight.interimResults = false;
recognitionRight.maxAlternatives = 1;

let isRecognizingRight = false;

rightButton.addEventListener("click", () => {
  if (!isRecognizingRight) {
    recognitionRight.lang = rightLangSelect.value || "en";
    recognitionRight.start();
    isRecognizingRight = true;
    rightButton.classList.add("listening"); // ⬅️ AUMENTO
    rightOutput.textContent = "🎤 Escuchando... habla ahora";
    console.log("Inicio reconocimiento derecho");
  } else {
    console.log("Reconocimiento derecho ya está activo");
  }
});

recognitionRight.onspeechstart = () => {
  console.log("Speech started - reconocimiento derecho");
};

recognitionRight.onresult = async (event) => {
  const texto = event.results[0][0].transcript;
  console.log("Texto reconocido derecha:", texto);
  const idiomaDestino = leftLangSelect.value || "es";

  try {
    const traduccion = await traducirTexto(texto, "auto", idiomaDestino);
    leftOutput.textContent = traduccion;
  } catch (err) {
    leftOutput.textContent = "❌ Error al traducir";
  }
};

recognitionRight.onerror = (event) => {
  console.error("Error reconocimiento derecho:", event.error);
  if (event.error !== 'no-speech') {
    rightOutput.textContent = "❌ Error reconocimiento: " + event.error;
  }
};

recognitionRight.onend = () => {
  isRecognizingRight = false;
  rightButton.classList.remove("listening"); // ⬅️ AUMENTO
  console.log("Reconocimiento derecho terminado");
};

recognitionRight.onspeechend = () => {
  console.log("Speech ended - recognitionRight");
  recognitionRight.stop();
};

const listenLeft = document.getElementById("listen--left");
const listenRight = document.getElementById("listen--right");

function hablarTexto(texto, lang) {
  const utter = new SpeechSynthesisUtterance();
  utter.text = texto;
  utter.lang = lang;
  speechSynthesis.speak(utter);
}

listenLeft.addEventListener("click", () => {
  const texto = document.getElementById("speech--left").textContent;
  const lang = document.getElementById("left-lang").value || "es";
  if (texto.trim()) {
    hablarTexto(texto, lang);
  }
});

listenRight.addEventListener("click", () => {
  const texto = document.getElementById("speech--right").textContent;
  const lang = document.getElementById("right-lang").value || "en";
  if (texto.trim()) {
    hablarTexto(texto, lang);
  }
});

let main = document.getElementById("main--container")
let openbtn = document.getElementById("top--start-button")

openbtn.addEventListener("click", () => {
  if (main) {
    main.style.display = "none";
  }
});