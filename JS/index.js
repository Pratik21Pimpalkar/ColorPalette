// Variables
const colorDivs = document.querySelectorAll(".color");
const generateButton = document.querySelectorAll(".generate");
const sliders = document.querySelectorAll(`input[type="range"]`);

function generatecolor() {
  const hexcolor = chroma.random();
  return hexcolor;
}
function randomcolors() {
  colorDivs.forEach((div, index) => {
    const hexText=div.children[0];
    const randcolor=generatecolor();

    // Addimg Backgroundcolor
    div.style.backgroundColor=randcolor;
    hexText.innerText=randcolor;
    //  Textcontrast
    textContrast(randcolor,hexText); 
  });
}

function textContrast(color,text){
    const luminance = chroma(color).luminance();
    if (luminance<.5) {
        text.style.color="white"
        
    } else {
        text.style.color="black"
        
    }
}
randomcolors();
