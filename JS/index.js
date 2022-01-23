// Variables
const colorDivs = document.querySelectorAll(".color");
const generateButton = document.querySelectorAll(".generate");
const sliders = document.querySelectorAll(`input[type="range"]`);
let initialcolor;
// Event Listners

sliders.forEach((slider) => {
  slider.addEventListener("input", hslcontrols);
});

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});

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
    initialcolor.push(chroma(randcolor).hex());
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
  resetInputs();
}
randomcolors();

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
  
      slider.value = Math.floor(brightValue*100)/100;
    }
    if (slider.name === "Saturation") {
      const satColor = initialcolor[slider.getAttribute("data-saturation")];
      const satValue = chroma(satColor).hsl()[1];
      
      slider.value = Math.floor(satValue*100)/100;
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
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)},${scaleSat(1)})`;

  //   Brightness
  const midBright = color.set("hsl.l", 0.5);
  const scalebright = chroma.scale(["black", midBright, "white"]);
  bright.style.backgroundImage = `linear-gradient(to right, ${scalebright(0)}, ${scalebright(0.5)}, ${scalebright(1)})`;

  // Hue
  hue.style.backgroundImage = `linear-gradient(to right,rgb(204,75,75),rgb(204,204,75), rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75)`;
}

function hslcontrols(e) {
  const index =
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-saturation");

  const slider = e.target.parentElement.querySelectorAll('input[type="range');
  const hue = slider[0];
  const Brightness = slider[1];
  const saturation = slider[2];
  const bgcolor = initialcolor[index];

  let color = chroma(bgcolor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", Brightness.value)
    .set("hsl.h", hue.value);

  colorDivs[index].style.backgroundColor = color;
  colorizeSlider(color,hue,Brightness,saturation)
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
