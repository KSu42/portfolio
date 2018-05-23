$(document).ready(function() {
	// Log message to console after DOM is loaded
	console.log('bonjour');

	// Define variables
	const submitButton = $("input[type='button']");
	const designCanvas = $("#pixelCanvas");

	// Submit button
	submitButton.on("click",function(event) {

		// prevent submit button from submitting data to form handler
		event.preventDefault();

		// store values from size input to use for makeGrid
		const height = $("#inputHeight").val();
		const width = $('#inputWeight').val();

		// clear canvas before drawing
		designCanvas.empty();

		// draw new grid according to size input values
		makeGrid(height,width);
	});

	var isShiftPressed = false;
	// Check if Shift is pressed
	var syncShift = function(event) {
		isShiftPressed = event.shiftKey;
	};

	// Set up grid with default values on page load
	submitButton.click();

	// When size is submitted by the user, call makeGrid()
	function makeGrid(height,width) {

		// for number up to hieght
		for (let i = 0; i < height; i++) {

			// create row
			designCanvas.append($("<tr></tr>"));

			// for number up to width
			for (let j = 0; j < width; j++) {

				// add cell to row
				$("tr").last().append($("<td></td>"));
			}
		}

		// change cell color when clicked
		designCanvas.on("mousedown mouseover", "td", function(e) {

			if (e.buttons === 1) {

				if (isShiftPressed) {
					$(this).css("background-color", "");
				} else {
					$(this).css("background-color", $("#colorPicker").val());
				}
			}
		});
	}

	$(document).keydown(syncShift);
	$(document).keyup(syncShift);
});

// Credit to Matthew Cranford for help with the project
// Credit to Julia Chistiakova for help with erase function
