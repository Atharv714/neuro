// let amp, fft;
// let myShader;
// let angle = 0.0;
// let jitter = 0.0;

// function preload() {
//   // Load the shader files
//   myShader = loadShader("static/shader/vertex.vert", "static/shader/fragment.frag");
//   frameRate(60);
// }

// function setup() {
//   createCanvas(windowWidth, windowHeight, WEBGL);
//   shader(myShader);
//   userStartAudio();

//   amp = new p5.Amplitude();
//   fft = new p5.FFT();

//   // If the global sound object is already loaded, set it as input
//   if (window.mySound) {
//     amp.setInput(window.mySound);
//     fft.setInput(window.mySound);
//   }
// }

// function draw() {
//   background(255);
  
//   // If window.mySound exists, ensure our analyzers use it
//   if (window.mySound) {
//     amp.setInput(window.mySound);
//     fft.setInput(window.mySound);
//   }
  
//   fft.analyze();
//   const volume = amp.getLevel();
//   let freq = fft.getCentroid() * 0.001;

//   // Add some jitter based on time
//   if (second() % 2 === 0) {
//     jitter = random(0, 0.1);
//     jitter += jitter;
//   }
//   angle += jitter;

//   rotateX(sin(freq) + angle * 0.1);
//   rotateY(cos(volume) + angle * 0.1);

//   const mapF = map(freq, 0, 1, 0, 20);
//   const mapV = map(volume, 0, 0.2, 0, 0.5);

//   myShader.setUniform("uTime", frameCount);
//   myShader.setUniform("uFreq", mapF);
//   myShader.setUniform("uAmp", mapV);

//   sphere(200, 400, 400);
// }


let amp, fft;
let myShader;
let angle = 0.0;
let jitter = 0.0;

function preload() {
  // Load the shader files
  myShader = loadShader(
    "static/shader/vertex.vert",
    "static/shader/fragment.frag"
  );
  frameRate(60);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  shader(myShader);
  userStartAudio();

  amp = new p5.Amplitude();
  fft = new p5.FFT();

  // If the global sound object is already loaded, set it as input
  if (window.mySound) {
    amp.setInput(window.mySound);
    fft.setInput(window.mySound);
  }
}

function draw() {
  background(255);

  // If window.mySound exists, ensure our analyzers use it
  if (window.mySound) {
    amp.setInput(window.mySound);
    fft.setInput(window.mySound);
  }

  fft.analyze();
  const volume = amp.getLevel();
  let freq = fft.getCentroid() * 0.001;

  // Add some jitter based on time
  if (second() % 2 === 0) {
    jitter = random(0, 0.1);
    jitter += jitter;
  }
  angle += jitter;

  rotateX(sin(freq) + angle * 0.1);
  rotateY(cos(volume) + angle * 0.1);

  const mapF = map(freq, 0, 1, 0, 20);
  const mapV = map(volume, 0, 0.2, 0, 0.5);

  myShader.setUniform("uTime", frameCount);
  myShader.setUniform("uFreq", mapF);
  myShader.setUniform("uAmp", mapV);

  sphere(200, 400, 400);
}
