// Variables
const colorDivs = document.querySelectorAll(".color");
const generateButton = document.querySelector(".generate");
const sliders = document.querySelectorAll(`input[type="range"]`);
const currentColors = document.querySelectorAll(".color h2");
let initialcolor;
const popup = document.querySelector(".copy-container");
const adjust = document.querySelectorAll(".adjust");
const lock = document.querySelectorAll(".lock");
const closeAdjust = document.querySelectorAll(".closeAdjust");
const sliderContainer = document.querySelectorAll(".slider");

// Event Listners

sliders.forEach((slider) => {
  slider.addEventListener("input", hslcontrols);
});

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});

currentColors.forEach((color) => {
  color.addEventListener("click", () => {
    copyToClipboard(color);
  });
});

adjust.forEach((button, index) => {
  button.addEventListener("click", () => {
    toggleSlider(index);
  });
});

closeAdjust.forEach((button, index) => {
  button.addEventListener("click", () => {
    sliderContainer[index].classList.remove("active");
  });
});

lock.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    lockLayer(e, index);
  });
});

generateButton.addEventListener("click", randomcolors);

// Functions

function generatecolor() {
  const hexcolor = chroma.random();
  return hexcolor;
}

function randomcolors() {
  initialcolor = [];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randcolor = generatecolor();
    if (div.classList.contains("locked")) {
      initialcolor.push(hexText.innerText);
      return;
    } else {
      initialcolor.push(chroma(randcolor).hex());
    }

    // Adding Backgroundcolor

    div.style.backgroundColor = randcolor;
    hexText.innerText = randcolor;

    //  Text  contrast
    textContrast(randcolor, hexText);

    // Sliders
    const color = chroma(randcolor);
    const sliders = div.querySelectorAll(".slider input");
    const hue = sliders[0];
    const bright = sliders[1];
    const saturation = sliders[2];
    colorizeSlider(color, hue, bright, saturation);
  });
  //
  resetInputs();

  // Buttons Contrast

  adjust.forEach((button, index) => {
    textContrast(initialcolor[index], button);
    textContrast(initialcolor[index], lock[index]);
  });
}



function resetInputs() {
  const sliders = document.querySelectorAll(".slider input");

  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialcolor[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];

      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "Brightness") {
      const brightColor = initialcolor[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];

      slider.value = Math.floor(brightValue * 100) / 100;
    }
    if (slider.name === "Saturation") {
      const satColor = initialcolor[slider.getAttribute("data-saturation")];
      const satValue = chroma(satColor).hsl()[1];

      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}
function textContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance < 0.5) {
    text.style.color = "white";
  } else {
    text.style.color = "black";
  }
}

function colorizeSlider(color, hue, bright, saturation) {
  // Saturation
  const noSat = color.set("hsl.s", 0);
  const maxSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, maxSat]);
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
    0
  )},${scaleSat(1)})`;

  //   Brightness
  const midBright = color.set("hsl.l", 0.5);
  const scalebright = chroma.scale(["black", midBright, "white"]);
  bright.style.backgroundImage = `linear-gradient(to right, ${scalebright(
    0
  )}, ${scalebright(0.5)}, ${scalebright(1)})`;

  // Hue
  hue.style.backgroundImage = `linear-gradient(to right,rgb(204,75,75),rgb(204,204,75), rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75)`;
}

function hslcontrols(e) {
  const index =
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-saturation");

  const slider = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = slider[0];
  const Brightness = slider[1];
  const saturation = slider[2];
  const bgcolor = initialcolor[index];

  let color = chroma(bgcolor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", Brightness.value)
    .set("hsl.h", hue.value);

  colorDivs[index].style.backgroundColor = color;
  colorizeSlider(color, hue, Brightness, saturation);
}

function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const bgcolor = chroma(activeDiv.style.backgroundColor);
  const hexText = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  hexText.innerText = bgcolor.hex();
  textContrast(bgcolor, hexText);

  for (icon of icons) {
    textContrast(bgcolor, icon);
  }
}

function copyToClipboard(hex) {
  const copytext = document.createElement("textarea");
  copytext.value = hex.innerText;
  document.body.appendChild(copytext);
  copytext.select();
  document.execCommand("copy");
  document.body.removeChild(copytext);

  //Popup

  const popupBox = popup.children[0];
  popupBox.classList.add("active");
  popup.classList.add("active");
  setTimeout(() => {
    popup.classList.remove("active");
    popupBox.classList.remove("active");
  }, 1000);
}

function toggleSlider(index) {
  sliderContainer[index].classList.toggle("active");
}

function lockLayer(e, index) {
  const lockSVG = e.target.children[0];
  const activeBg = colorDivs[index];
  activeBg.classList.toggle("locked");

  if (lockSVG.classList.contains("fa-lock-open")) {
    e.target.innerHTML = '<i class="fas fa-lock"></i>';
  } else {
    e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
  }
}

// Saving Palette

const saveButton = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const collectionContainer = document.querySelector(".collection-container");
const collectionbutton = document.querySelector(".collection");
const closeCollectionButton = document.querySelector(".close-collection");

let savedPalettes = [];

// Event Listener

saveButton.addEventListener("click", openPalette);
function openPalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
}
closeSave.addEventListener("click", closePalette);
function closePalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
}
submitSave.addEventListener("click", savedPalette);

collectionbutton.addEventListener("click", openCollection);
closeCollectionButton.addEventListener("click", closeCollection);

function openCollection() {
  const popup = collectionContainer.children[0];
  collectionContainer.classList.add("active");
  popup.classList.add("active");
}

function closeCollection() {
  const popup = collectionContainer.children[0];
  collectionContainer.classList.remove("active");
  popup.classList.remove("active");
}

function savedPalette(e) {
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
  const name = saveInput.value;
  const colors = [];
  currentColors.forEach((hex) => {
    colors.push(hex.innerText);
  });

  // Creating the Object
  let paletteNr
  const paletteObjects=JSON.parse(localStorage.getItem("palettes"));
  if(paletteObjects){
    paletteNr=paletteObjects.length
  }else{
  paletteNr = savedPalettes.length;
  }



  const paletteObj = { name, colors, nr: paletteNr };
  savedPalettes.push(paletteObj);

  // Saving
  saveToLocal(paletteObj);
  saveInput.value = "";

  // Generate the palette for collection
  const palette = document.createElement("div");
  palette.classList.add("custom-palette");

  const title = document.createElement("h4");
  title.innerText = paletteObj.name;

  const preview = document.createElement("div");
  preview.classList.add("preview");

  paletteObj.colors.forEach((color) => {
    const smalldiv = document.createElement("div");
    smalldiv.style.background = color;
    preview.appendChild(smalldiv);
  });

  const paletteButton = document.createElement("button");
  paletteButton.classList.add("palette-btn");
  paletteButton.classList.add(paletteObj.nr);
  paletteButton.innerText = "Select";

  // SelectButton
  paletteButton.addEventListener("click", (e) => {
    closeCollection();
    const paletteIndex = e.target.classList[1];
    initialcolor = [];
    savedPalettes[paletteIndex].colors.forEach((color, index) => {
      initialcolor.push(color);
      console.log(initialcolor)
      colorDivs[index].style.backgroundColor = color;
      const text = colorDivs[index].children[0];
      textContrast(color,text);
      updateTextUI(index)
    });
    resetInputs();
  });

  // Appending to collection
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteButton);
  collectionContainer.children[0].appendChild(palette);
}

function saveToLocal(paletteObj) {
  let localPalettes;
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }
  localPalettes.push(paletteObj);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function getLocal(){
  let localPalettes
  if (localStorage.getItem('palettes')===null) {
    localPalettes=[];
    
  } else {
    const paletteObjects=JSON.parse(localStorage.getItem('palettes'))
    savedPalettes=[...paletteObjects]
    paletteObjects.forEach((paletteObj)=>{
      // Generate the palette for collection
  const palette = document.createElement("div");
  palette.classList.add("custom-palette");

  const title = document.createElement("h4");
  title.innerText = paletteObj.name;

  const preview = document.createElement("div");
  preview.classList.add("preview");

  paletteObj.colors.forEach((color) => {
    const smalldiv = document.createElement("div");
    smalldiv.style.background = color;
    preview.appendChild(smalldiv);
  });

  const paletteButton = document.createElement("button");
  paletteButton.classList.add("palette-btn");
  paletteButton.classList.add(paletteObj.nr);
  paletteButton.innerText = "Select";

  // SelectButton
  paletteButton.addEventListener("click", (e) => {
    closeCollection();
    const paletteIndex = e.target.classList[1];
    initialcolor = [];
    paletteObjects[paletteIndex].colors.forEach((color, index) => {
      initialcolor.push(color);
      console.log(initialcolor)
      colorDivs[index].style.backgroundColor = color;
      const text = colorDivs[index].children[0];
      textContrast(color,text);
      updateTextUI(index)
    });
    resetInputs();
  });

  // Appending to collection
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteButton);
  collectionContainer.children[0].appendChild(palette);
    })
  }
}
getLocal();
randomcolors();