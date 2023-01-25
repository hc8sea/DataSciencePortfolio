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
}); /*close on pageview load*/

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
			Plotly.plot("chart0", graphs, {});
		  });
		fetch("/rec")
		  .then(response => response.json())
		  .then(response => {
            let container = document.getElementById("myContainer");
			let form = document.createElement('form');
			form.method = "post";
			form.id = "submit2";
			container.appendChild(form);
			let ul = document.createElement('ul');
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
			let getrec = document.createElement('button');
			getrec.type = 'submit';
			getrec.value = 'Submit2';
			getrec.textContent = "Submit";
			// getrec.onclick="submitForm()";


			form.appendChild(getrec);})
			// .then(() => {
			// 	document.querySelector("checkboxes").addEventListener("submit", function () {
				// event.preventDefault();
				// const textNode = document.createTextNode("We recommend you " + rec);
			
				// });
}});

});

$(document).on("submit", "#submit2", function (e) {
console.log("hello2");
e.preventDefault();
let checkboxValues = document.querySelectorAll('input[name="checkbox_items"]:checked');
let selectedValues = [];
checkboxValues.forEach(function(checkbox) {
selectedValues.push(checkbox.value);
});
let data = {'checkbox_items': selectedValues};
console.log(data);
fetch('/process_data', {
	method: 'POST',
	headers: {
	  'Content-Type': 'application/json'
	},
	body: JSON.stringify({'data': data})
  })
  .then(response => response.json())
  .then(recommendation => {
	let rec = document.createElement("div");
	rec.textContent = recommendation;
	let container = document.getElementById("myContainer");
	container.appendChild(rec);
  });
})

$(document).on("submit", "#submit4", function (e) {
    e.preventDefault(); // To prevent the form from submitting
	console.log("hello4");
    let inputValue = $("#input4").val();
    console.log(inputValue); // To check the value in the console
    // Perform other actions with the inputValue variable
	fetch('/classifier', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({'data': inputValue})
	  })
	  .then(response => response.json())
	  .then((predict) => {
		let pred = document.createElement("div");
		pred.textContent = predict;
		let container4 = document.getElementById("Container4");
		container4.appendChild(pred);
	  })
});

$(document).on("submit", "#submit3", function (e) {
    e.preventDefault(); // To prevent the form from submitting
	console.log("hello3");
    let Prompt = $("#input3").val();
    console.log(Prompt); // To check the value in the console
    // Perform other actions with the inputValue variable
	fetch('/nlp', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({'data': Prompt})
	  })
	  .then(response => response.json())
	  .then(response => {
		let previous = response[0];
		let current = response[1];
		let partial_log = document.getElementById("partial_log");
		partial_log.innerHTML = ""
		let words_ = document.getElementById("words");
		words_.innerHTML = ""
		for (let i = 0; i < previous.length; i++) {
			// Create a new list item element
			let p = document.createElement("p");
			partial_log.appendChild(p);
			p.textContent = previous[i];
	  }
	  	for(let i = 0; i < current.length; i++) {
			let sp = document.createElement("span");
			sp.classList.add('word');
			sp.textContent = current[i];
			words_.appendChild(sp);
		}
		
	}
	  )
	  .then(() => {
		let words = document.querySelectorAll('.word');
		let i = 0;

		setInterval(function() {
			words[i].style.display = 'inline';
			i++;
		}, 500);
	  })
	  })

// let words = document.querySelectorAll('.word');
// let i = 0;

// setInterval(function() {
// 	words[i].style.display = 'inline';
// 	i++;
// }, 500);