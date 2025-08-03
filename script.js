// Inicia la app al cargar
window.addEventListener("DOMContentLoaded", () => {
  localStorage.clear();
  data.Spin = [];
  initApp();
});

// Datos del dado
const data = {
  Dice: {
    6: [1, 2, 3, 4, 5, 6],
  },
  Coin: {
    Head: "Head",
    Tail: "Tail",
  },

  Spin: JSON.parse(localStorage.getItem("personsList")) || [],
};

const numberToWord = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
];

// Inicia la app
function initApp() {
  renderDiceTypes();

  //Simular la aparición de cualquiera
  handleTypeSelection("Dice");
  //handleTypeSelection("Coin");
  //handleTypeSelection("Spin");
}

// Renderiza los tipos de dados
function renderDiceTypes() {
  const wrapper = document.getElementById("typeOfDice");
  if (!wrapper) return;
  wrapper.innerHTML = "";

  for (const key in data) {
    const title = document.createElement("h2");
    const link = document.createElement("a");
    link.textContent = key;
    link.href = "#";
    link.className = "selector-link";
    link.addEventListener("click", function (e) {
      e.preventDefault();
    });
    title.appendChild(link);
    title.addEventListener("click", () => handleTypeSelection(key));
    wrapper.appendChild(title);
  }
}

// Maneja la selección de tipo
function handleTypeSelection(type) {
  const wrapperOptions = document.getElementById("optionsTypes");
  const wrapperDie = document.getElementById("wrapperDie");
  const message = document.getElementById("message");

  if (!wrapperOptions || !wrapperDie) return;

  wrapperOptions.innerHTML = "";
  wrapperDie.innerHTML = "";
  if (message) message.innerHTML = "";

  if (type === "Dice") {
    renderNumberOptions(wrapperOptions);
    renderCube(wrapperDie);
  }

  if (type === "Coin") {
    renderHeadsOrTails(wrapperDie);
  }

  if (type === "Spin") {
    renderPersonInput(wrapperOptions);
    renderPersonsContainer(wrapperDie);
    renderExistingPersons();
  }
}

// Renderiza opciones de números
function renderNumberOptions(container) {
  const subkeys = Object.keys(data.Dice);
  subkeys.forEach((key) => {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.className = "option-button";
    btn.style.display = "none";
    container.appendChild(btn);
  });
}

// Renderiza opciones de colores
function renderHeadsOrTails(container) {
  const coinContainer = `
    <div class="coin-container">
        <button id="toss-button">Flip coin</button>
        <div class="coin" id="coin">
            <img src="./public/heads.png" alt="Heads" />
        </div>
    </div>
  `;
  container.innerHTML = coinContainer;

  const coinIcon = document.getElementById("coin");
  const tossBtn = document.getElementById("toss-button");

  tossBtn.addEventListener("click", () => {
    tossBtn.disabled = true;
    tossCoinFunction(coinIcon, tossBtn);
  });
}

// Renderiza el cubo 3D
function renderCube(container) {
  const cubeHTML = `
    <div class="container-dice">
      <div id="cube">
        <div class="front"><span class="dot dot1"></span></div>
        <div class="back"><span class="dot dot1"></span><span class="dot dot2"></span></div>
        <div class="right"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span></div>
        <div class="left"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span></div>
        <div class="top"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span><span class="dot dot5"></span></div>
        <div class="bottom"><span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span><span class="dot dot4"></span><span class="dot dot5"></span><span class="dot dot6"></span></div>
      </div>
    </div>
  `;
  container.innerHTML = cubeHTML;
  assignCubeBehavior();
}

// Asigna comportamiento al cubo
function assignCubeBehavior() {
  const cube = document.getElementById("cube");
  if (!cube) return;

  const min = 1;
  const max = 24;

  cube.onclick = () => {
    const xRand = getRandomAngle(min, max);
    const yRand = getRandomAngle(min, max);
    cube.style.transform = `rotateX(${xRand}deg) rotateY(${yRand}deg)`;
  };
}

function tossCoinFunction(coinIcon, tossBtn) {
  const randomVal = Math.random();
  const faceCoin = randomVal < 0.5 ? "Heads" : "Tails";
  const imageUrl =
    faceCoin === "Heads" ? "./public/heads.png" : "./public/tails.png";

  coinIcon.classList.add("flip");
  setTimeout(() => {
    coinIcon.innerHTML = `<img src="${imageUrl}" alt="${faceCoin}">`;
    coinIcon.classList.remove("flip");
    setTimeout(() => {
      tossBtn.disabled = false;
    }, 500);
  }, 1000);
}

// Genera ángulos aleatorios
function getRandomAngle(min, max) {
  return (Math.floor(Math.random() * (max - min)) + min) * 90;
}

// Renderiza el input de personas
function renderPersonInput(container) {
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper-input-numbers";
  wrapper.innerHTML = `
    <input type="text" id="nameInput" placeholder="Enter a name">
    <button class="btn-add" onclick="addPersonFromInput('nameInput')" id="btnAdd"><span>Add</span></button>
  `;
  container.appendChild(wrapper);
}

// Renderiza el contenedor de personas
function renderPersonsContainer(container) {
  const scaleWrapper = document.createElement("div");
  scaleWrapper.className = "scale-wrapper";

  const personsDice = document.createElement("div");
  personsDice.className = "persons-dice";
  personsDice.id = "personsDice";

  scaleWrapper.appendChild(personsDice);
  container.appendChild(scaleWrapper);
}

// Renderiza personas desde localStorage
function renderExistingPersons() {
  const personsDice = document.getElementById("personsDice");
  personsDice.innerHTML = "";

  data.Spin.forEach((name) => {
    const person = createPersonElement(name);
    personsDice.appendChild(person);
  });

  updatePersonsVisual();
  maybeAddSpinButton();
}

// Añade persona desde input
function addPersonFromInput(inputId) {
  const input = document.getElementById(inputId);
  const name = input.value.trim();
  addPerson(name);
  input.value = "";
}

// Añade persona al DOM y datos
function addPerson(name) {
  const personsDice = document.getElementById("personsDice");
  const message = document.getElementById("message");

  if (data.Spin.length >= 8) {
    if (message) message.innerHTML = "No more names are allowed";
    const btn = document.getElementById("btnAdd");
    if (btn) btn.style.pointerEvents = "none";
    return;
  }

  if (name === "") {
    if (message) message.innerHTML = "* Please enter a name *";
    return;
  }

  if (data.Spin.includes(name)) {
    if (message) message.innerHTML = "* This name already exists *";
    return;
  }

  data.Spin.push(name);
  localStorage.setItem("personsList", JSON.stringify(data.Spin));

  const person = createPersonElement(name);
  personsDice.appendChild(person);
  message.innerHTML = "";

  updatePersonsVisual();
  maybeAddSpinButton();
}

// Crea elemento DOM de persona
function createPersonElement(name) {
  const person = document.createElement("p");
  person.className = "person";
  person.id = name;
  person.textContent = name;
  return person;
}

// Actualiza layout de personas
function updatePersonsVisual() {
  const personsDice = document.getElementById("personsDice");
  const count = data.Spin.length;

  personsDice.setAttribute("data-number-persons", count);
  numberToWord.forEach((word) => personsDice.classList.remove(word));
  personsDice.classList.add(numberToWord[count]);

  positionPersons();
  renderDividers();
}

// Posiciona personas en círculo
function positionPersons() {
  const personsDice = document.getElementById("personsDice");
  const numPersons = parseInt(
    personsDice.getAttribute("data-number-persons"),
    10
  );
  const persons = personsDice.querySelectorAll(".person");
  const total = persons.length;
  const radius = personsDice.offsetWidth * 0.3;
  const classNames = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
  ];

  persons.forEach((el, index) => {
    const angle = (360 / total) * index;
    el.classList.add(classNames[index]);
    el.style.transform = `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`;
  });
}

// Renderiza líneas divisorias
function renderDividers() {
  const personsDice = document.getElementById("personsDice");
  const existingLines = document.querySelector(".divider-lines");
  if (existingLines) existingLines.remove();

  const total = data.Spin.length;
  if (total < 2) return;

  const dividerWrapper = document.createElement("div");
  dividerWrapper.className = "divider-lines";

  for (let i = 0; i < total; i++) {
    const angle = (360 / total) * i;
    const line = document.createElement("div");
    line.className = "divider-line";
    line.style.transform = `rotate(${angle}deg)`;
    dividerWrapper.appendChild(line);
  }

  personsDice.appendChild(dividerWrapper);
}

// Añade botón de girar si hay 2+
function maybeAddSpinButton() {
  const personsDice = document.getElementById("personsDice");
  const wrapperDie = document.getElementById("wrapperDie");
  const count = data.Spin.length;
  const existingButton = document.getElementById("spinWheel");

  const selectorWheel = document.createElement("div");
  selectorWheel.className = "selector-wheel";
  wrapperDie.appendChild(selectorWheel);

  if (count >= 2 && !existingButton && personsDice) {
    const wrapperBtns = document.createElement("div");
    wrapperBtns.className = "wrapper-btns";
    wrapperDie.appendChild(wrapperBtns);

    const spinWheel = document.createElement("button");
    spinWheel.id = "spinWheel";
    spinWheel.textContent = "Spin!";
    spinWheel.className = "spin-wheel";
    spinWheel.addEventListener("click", () => spinTheWheel());

    const removeBtn = document.createElement("button");
    removeBtn.id = "removerBtn";
    removeBtn.textContent = "Remove";
    removeBtn.className = "remover-btn";
    removeBtn.addEventListener("click", () => removeNames());

    wrapperBtns.appendChild(spinWheel);
    wrapperBtns.appendChild(removeBtn);
  }
}

let currentRotation = 0;
function spinTheWheel() {
  const personsDice = document.getElementById("personsDice");
  const message = document.getElementById("message");

  if (!personsDice) return;

  if (message.innerHTML === "* Please enter a name *" || "* This name already exists *") {
    message.innerHTML = "";
  }
  const fullSpins = 10 * 360;
  const randomAngle = Math.floor(Math.random() * 360);
  const spinAmount = fullSpins + randomAngle;

  currentRotation += spinAmount;

  personsDice.style.transition = "transform 5s ease-in-out";
  personsDice.style.transform = `rotate(${currentRotation}deg)`;
}

function removeNames() {
  const personsDice = document.getElementById("personsDice");
  const wrapperDie = document.getElementById("wrapperDie");
  const message = document.getElementById("message");
  const addBtn = document.getElementById("btnAdd");

  data.Spin = [];
  localStorage.clear();

  message.innerHTML = "";

  addBtn.style.pointerEvents = "auto";

  if (personsDice) {
    personsDice.innerHTML = "";
    personsDice.removeAttribute("data-number-persons");

    numberToWord.forEach((word) => personsDice.classList.remove(word));

    const existingLines = personsDice.querySelector(".divider-lines");
    if (existingLines) existingLines.remove();
  }

  const spinBtn = document.getElementById("spinWheel");
  const removeBtn = document.getElementById("removerBtn");
  const wrapperBtns = document.querySelector(".wrapper-btns");

  if (spinBtn || wrapperBtns || removeBtn) wrapperBtns.remove();
}
