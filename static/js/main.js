function createForm() {}

// function destroyForm() {

// }

function submitForm() {
  var checkedNames = [];
  var checkboxes = document.getElementsByName("name");
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      checkedNames.push(checkboxes[i].value);
    }
  }
  console.log("Checked names: " + checkedNames);
}

let lastProgress = 0;
let timeoutId;

function updateProgressBar() {
  const progressBar = document.getElementById("progress-bar");

  fetch("/get_progress")
    .then((response) => response.json())
    .then((data) => {
      let progress = data.progress;
      console.log(progress);
      let animationSpeed = Math.abs(progress[0] - lastProgress) * 10;

      animationSpeed = Math.max(animationSpeed, 200);

      progressBar.style.width = `${100 * progress[0]}%`;
      lastProgress = progress[0];

      // Check if the progress has reached the target
      if (progress >= 1) {
        clearTimeout(timeoutId);
        progressBar.style.width = 0;
      } else {
        timeoutId = setTimeout(updateProgressBar, animationSpeed);
      }
    });
}

// let datap = [];
// async function getData() {
//   datap = [];
//   const response = await fetch("/long_task");
//   datap = await response.json();
//   console.log(datap[0]);

//   for (let i = 0; i < datap; i++) {
//     // Do something with the data

//     // Update the progress bar
//     const progressBar = document.getElementById("progress-bar");
//     // progressBar.style.width = (i / datap.length) * 100 + "%";
//     progressBar.style.width = 100*datap[0] + "%";
//   }
// }

function createTrackList(route) {
  fetch(route)
    .then((response) => response.json())
    .then((response) => {
      let container = document.getElementById("myContainer");
      container.innerHTML = "";
      let form = document.createElement("form");
      form.method = "post";
      form.id = "submit2";
      container.appendChild(form);

      let ul = document.createElement("ul");
      form.appendChild(ul);
      // Create an array of top tracks
      let topTracks = response;

      // Loop through the array of top tracks
      for (let i = 0; i < topTracks.length; i++) {
        // Create a new list item element
        let li = document.createElement("li");

        // Create a new checkbox input element
        let input = document.createElement("input");
        input.type = "checkbox";
        input.name = "checkbox_items";
        input.id = "checkbox_" + i;
        input.value = topTracks[i];

        // Create a new label element
        let label = document.createElement("label");
        label.htmlFor = "checkbox_" + i;
        label.innerHTML = topTracks[i];

        // Append the input and label elements to the list item element
        li.appendChild(input);
        li.appendChild(label);

        // Append the list item element to the container element
        ul.appendChild(li);
      }
      let br = document.createElement("br")
      let getrec = document.createElement("button");
      getrec.type = "submit";
      getrec.value = "Submit2";
      getrec.textContent = "Discover new music";
      // getrec.onclick="submitForm()";
      form.appendChild(br)
      form.appendChild(getrec);
      

      // let pbar = document.createElement("div");
      // pbar.id = "progress-bar";
      // form.appendChild(pbar);
    });
}

window.addEventListener("pageshow", function () {
  var tl_intro = gsap.timeline({
    delay: 0,
    paused: true,
  });
  tl_intro.to("html", 0.8, {
    autoAlpha: 1,
    ease: Power1.easeOut,
  });

  tl_intro.play();

  var tl = gsap.timeline({
    delay: 0.8,
    paused: true,
  });
  tl.staggerFromTo(
    ".stagger",
    1.0,
    {
      y: "150%",
      skewY: 5,
      autoAlpha: 0,
    },
    {
      y: "0%",
      skewY: 0,
      autoAlpha: 1,
      ease: Circ.easeOut,
    },
    0.3
  ).fromTo(
    ".audio_button",
    1.0,
    {
      scale: 0.8,
      autoAlpha: 0,
    },
    {
      scale: 1.0,
      autoAlpha: 1,
      ease: Power4.easeOut,
    },
    2
  );

  tl.play();

  var dashboards_button = document.querySelector(".dashboards_button");

  dashboards_button.addEventListener("click", function () {
    event.stopPropagation();
    gsap.to(window, {
      duration: 0.5,
      scrollTo: ".dashboards_section",
      ease: Circ.easeOut,
    });
  });

  var recommender_button = document.querySelector(".recommender_button");

  recommender_button.addEventListener("click", function () {
    event.stopPropagation();
    gsap.to(window, {
      duration: 0.5,
      scrollTo: ".recommender_section",
      ease: Circ.easeOut,
    });
  });

  var gpt3_button = document.querySelector(".gpt3_button");

  gpt3_button.addEventListener("click", function () {
    event.stopPropagation();
    gsap.to(window, {
      duration: 0.5,
      scrollTo: ".gpt3_section",
      ease: Circ.easeOut,
    });
  });

  var neural_nets_button = document.querySelector(".neural_nets_button");

  neural_nets_button.addEventListener("click", function () {
    event.stopPropagation();
    gsap.to(window, {
      duration: 0.5,
      scrollTo: ".neural_nets_section",
      ease: Circ.easeOut,
    });
  });

  [...document.querySelectorAll(".work_item")].forEach(function (item) {
    var this_inner = item.querySelector(".work_item_inner");

    var staggers = item.querySelectorAll(".stagger_body");

    var tl02 = gsap.timeline({
      paused: true,
    });
    tl02.staggerFromTo(
      staggers,
      1.0,
      {
        y: "200%",
        skewY: 10,
        autoAlpha: 0,
      },
      {
        y: "0%",
        skewY: 0,
        autoAlpha: 1,
        ease: Power4.easeOut,
      },
      0.3
    );

    ScrollTrigger.create({
      trigger: item,
      start: "center bottom",
      onEnter: () => tl02.play(),
    });

    ScrollTrigger.create({
      trigger: item,
      start: "top bottom",
      onLeaveBack: () => tl02.pause(0),
    });

    // this_inner.addEventListener("mousemove", function () {
    //   rotate_cursor.play();
    //   show_cursor.play();
    // });

    // this_inner.addEventListener("mouseleave", function () {
    //   rotate_cursor.pause();
    //   show_cursor.reverse();
    // });
  }); /*close forEach*/

  [...document.querySelectorAll(".underline_trigger")].forEach(function (item) {
    var this_underline = item.querySelector(".underline");

    item.addEventListener("mouseover", function () {
      gsap.fromTo(
        this_underline,
        0.4,
        {
          width: 0,
        },
        { width: "100%", ease: Power4.easeOut, overwrite: true }
      );
    });

    item.addEventListener("mouseleave", function () {
      gsap.to(this_underline, 0.4, {
        width: "0%",
        ease: Power4.easeOut,
        overwrite: true,
      });
    });
  });

  // var btn = document.querySelector(".changingDivs");

  // // Add a click event listener to the button
  // btn.addEventListener("click", function () {
  //   btn.innerHTML = "";
  //   // Create form element
  //   var form = document.createElement("form");
  //   form.method = "post";
  //   form.id = "todo-form";
  //   form.name = "submit1";

  //   // Create label element
  //   var label = document.createElement("label");
  //   label.htmlFor = "todo-form";
  //   label.innerHTML = "Dashboards" + "<br />";

  //   // Create input element
  //   var input = document.createElement("input");
  //   input.type = "text";
  //   input.name = "todo";
  //   input.id = "todo";

  //   // Create button element
  //   var button = document.createElement("button");
  //   button.type = "submit";
  //   button.value = "Submit1";
  //   button.id = "submit1";
  //   button.innerHTML = "submit";

  //   // Append elements to form
  //   form.appendChild(label);
  //   form.appendChild(input);
  //   form.appendChild(button);

  //   // Append form to body

  //   btn.appendChild(form);
  // });
}); /*close on pageview load*/

// Dashboard + Recommendation List

fetch("/predef1")
  .then((response) => response.json())
  // .then(response => console.log(response))
  .then((graphs) => {
    Plotly.plot("chart0", graphs, {});
  });

createTrackList("/rec0");

$(document).on("submit", "#todo-form", function (e) {
  console.log("hello");
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "/",
    data: {
      todo: $("#todo").val(),
    },
    success: function () {
      alert("saved");
      fetch("/data")
        .then((response) => response.json())
        .then((graphs) => {
          // let chart0 = document.getElementById("chart0");
          // chart0.innerHTML = "";
          Plotly.newPlot("chart0", graphs, {});
        });

      createTrackList("/rec");
    },
  });
});

// Recommendation

$(document).on("submit", "#submit2", function (e) {
  console.log("hello2");
  e.preventDefault();
  let checkboxValues = document.querySelectorAll(
    'input[name="checkbox_items"]:checked'
  );
  let selectedValues = [];
  checkboxValues.forEach(function (checkbox) {
    selectedValues.push(checkbox.value);
  });
  let data = { checkbox_items: selectedValues };
  console.log(data);

  let lastProgress = 0;
  const progressBar = document.getElementById("progress-bar");
  updateProgressBar();
  // setInterval(async function () {
  //   await getData();
  // }, 100);

  fetch("/process_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: data }),
  })
    .then((response) => response.json())
    .then((response) => {
      let rec = document.createElement("div");
      rec.textContent = response.rec;
      let container = document.getElementById("myContainer");
      container.appendChild(rec);
    });
});

// Classifier

$(document).on("submit", "#submit4", function (e) {
  e.preventDefault(); // To prevent the form from submitting
  console.log("hello4");
  let inputValue = $("#input4").val();
  console.log(inputValue); // To check the value in the console
  // Perform other actions with the inputValue variable
  fetch("/classifier", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: inputValue }),
  })
    .then((response) => response.json())
    .then((response) => {
      let pred = document.createElement("div");
      pred.textContent = response.string;
      let container4 = document.getElementById("neuralPrediction");
      container4.innerHTML = ""
      container4.appendChild(pred);
      let explanation = document.createElement("p")
      explanation.textContent = "The conclusion was reached by the model through utilization of the melspectrogram below."
      container4.appendChild(explanation)
      // Example call
      // const rgbData = [255, 0, 0, 0, 255, 0, 0, 0, 255];
      let imgData = JSON.parse(response.array);
      console.log(imgData.flat().flat());
      let x = imgData.length;
      let y = imgData[0].length;
      rgbData = imgData.flat().flat();

      console.log(x);
      console.log(y);

      const parent = document.getElementById("melSpectogram");
      let width = response.width;
      let height = response.height;
      melSpec(rgbData, 512, 512);
      createImageFromRGBData(rgbData, height, height, parent);
    })
    .then(() => {});
});

// NLP

$(document).on("submit", "#submit3", function (e) {
  e.preventDefault(); // To prevent the form from submitting
  console.log("hello3");
  let Prompt = $("#input3").val();
  console.log(Prompt); // To check the value in the console
  // Perform other actions with the inputValue variable
  fetch("/nlp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: Prompt }),
  })
    .then((response) => response.json())
    .then((response) => {
      let previous = response[0];
      let current = response[1];
      let partial_log = document.getElementById("partial_log");
      partial_log.innerHTML = "";
      let words_ = document.getElementById("words");
      words_.innerHTML = "";
      for (let i = 0; i < previous.length; i++) {
        // Create a new list item element
        let p = document.createElement("p");
        partial_log.appendChild(p);
        p.textContent = previous[i];
      }
      for (let i = 0; i < current.length; i++) {
        let sp = document.createElement("span");
        sp.classList.add("word");
        sp.textContent = current[i];
        words_.appendChild(sp);
      }
    })
    .then(() => {
      let words = document.querySelectorAll(".word");
      let i = 0;

      setInterval(function () {
        words[i].style.display = "inline";
        i++;
      }, 500);
    });
});

function createImageFromRGBData(rgbData, width, height, parent) {
  // Create an empty canvas element
  const canvas = document.createElement("canvas");

  // Set the canvas dimensions
  canvas.width = width;
  canvas.height = height;

  // Get the canvas context
  const ctx = canvas.getContext("2d");

  // Create an ImageData object
  const imageData = ctx.createImageData(canvas.width, canvas.height);

  // Get the data property of the ImageData object (this is a typed array)
  const data = imageData.data;

  // Set the RGB data
  for (let i = 0; i < data.length; i += 4) {
    data[i] = rgbData[i]; // Red
    data[i + 1] = rgbData[i + 1]; // Green
    data[i + 2] = rgbData[i + 2]; // Blue
    data[i + 3] = 255; // Alpha (fully opaque)
  }

  // Put the ImageData object onto the canvas
  ctx.putImageData(imageData, 0, 0);

  // Create an image element
  const img = document.createElement("img");

  // Set the src of the image to the data URL of the canvas
  img.src = canvas.toDataURL();

  // Append the image element to the body of the page
  parent.innerHTML = ''
  parent.appendChild(img);
}

// function createGround() {
//   const groundGeo = new THREE.PlaneGeometry(1000, 1000, 32, 32);

//   let disMap = new THREE.TextureLoader()
//     // .setPath("../static/img")
//     .load("staticimg\6.jpg");

//   disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
//   disMap.repeat.set(1, 1);

//   const groundMat = new THREE.MeshStandardMaterial({
//     color: 0x000000,
//     wireframe: true,
//     displacementMap: disMap,
//     displacementScale: 1,
//   });

//   // Create a scene
//   const scene = new THREE.Scene();

//   // Create a camera
//   // const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//   // Create a renderer
//   // const renderer = new THREE.WebGLRenderer();
//   // renderer.setSize( window.innerWidth, window.innerHeight );
//   // document.body.appendChild( renderer.domElement );

//   // Create your three.js object
//   groundMesh = new THREE.Mesh(groundGeo, groundMat);
//   scene.add(groundMesh);
//   groundMesh.rotation.x = -Math.PI / 2;
//   groundMesh.position.y = -0.5;

//   // Position the camera
//   // camera.position.z = 5;

//   // Render the scene
//   // renderer.render( scene, camera );
// }

function melSpec(rgbData, x, y) {
  // import './style.css'
  // import * as THREE from 'three'
  // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  // import * as dat from 'dat.gui'

  // Debug
  // const gui = new dat.GUI()
  // Canvas
  const canvas = document.querySelector("canvas.webgl");

  // Texture Loader

  const loader = new THREE.TextureLoader();
  const texture = loader.load("/static/img/texture.png");
  // const height = loader.load('/static/img/image.jpg')
  const alpha = loader.load("/static/img/alpha2.png");

  var uint8Array = new Uint8Array(rgbData);
  const height = new THREE.DataTexture(uint8Array, x, y, THREE.RGBAFormat);
  console.log(uint8Array);
  height.needsUpdate = true;

  // Scene
  const scene = new THREE.Scene();

  const geometry = new THREE.PlaneBufferGeometry(4, 4, 128, 128);
  const material = new THREE.MeshStandardMaterial({
    color: "gray",
    map: texture,
    displacementMap: height,
    displacementScale: 0.3,
    alphaMap: alpha,
    transparent: true,
    depthTest: false,
  });

  const plane = new THREE.Mesh(geometry, material);

  scene.add(plane);

  plane.rotation.x = 181;

  // Lights

  // const pointLight = new THREE.PointLight('#507D01', 2)
  const pointLight = new THREE.PointLight("#507D01", 2);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;
  scene.add(pointLight);

  const col = { color: "blue" };

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 3;
  scene.add(camera);

  // Controls
  // const controls = new OrbitControls(camera, canvas)
  // controls.enableDamping = true

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // antialias: true,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // renderer.setPixelRatio(window.devicePixelRatio*2);
  renderer.setClearColor("#f4eae1");

  /**
   * Animate
   */

  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime

    plane.rotation.z = 0.1 * elapsedTime;

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
}
