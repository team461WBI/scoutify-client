var gui = require('nw.gui');
var win = gui.Window.get();

/* Load other components. */
var fs = require('fs');
var path = require('path');

function getUserHome() {
	return process.env.HOME || process.env.USERPROFILE;
}

function stringyJson(dragons) {
	var orc = "{\n"

	for (x = 0; x < dragons.length / 2; x++) {
		orc += dragons[x * 2] + ":";
		orc += dragons[(x * 2) + 1];

		if ((x * 2) + 2 != dragons.length) {
			orc += ",\n";
		}
	}

	orc += "\n}\n";

	return orc;
}

function writeToFile(teamNumber, whereToWrite, thingToWrite, eventThing) {
	whereToWrite += '.json';

	if(!fs.existsSync(path.join(getUserHome(), '.scoutify'))){
		fs.mkdir(path.join(getUserHome(), '.scoutify'));
	}

	if(!fs.existsSync(path.join(getUserHome(), '.scoutify', eventThing))){
		fs.mkdir(path.join(getUserHome(), '.scoutify', eventThing));
	}

	if(!fs.existsSync(path.join(getUserHome(), '.scoutify', eventThing, teamNumber))){
		fs.mkdir(path.join(getUserHome(), '.scoutify', eventThing, teamNumber));
	}

	fs.writeFile(path.join(getUserHome(), '.scoutify', eventThing, teamNumber, whereToWrite), thingToWrite, function(err) {
		if (err) {
			console.log(err);
		} else {
			alert("The file was saved!");
			if(getUrlVars()["position"] == undefined) {
				window.location = document.URL +"?position=" + $("#position").val();
			}
			else {
				win.reload();
			}
		}
	});
}

function generateJsonString() {
	var dragons = $(".inputThings").map(function() {
		var valwrap = "";

		if ($(this).hasClass("outputAsNumber")) {
			valwrap = "";
		} else {
			valwrap = "\"";
		}

		var unicorns = ["\"" + $(this).attr("id") + "\"",

						valwrap +
						$(this).val().replace(/\n/g, "\\n") +
						valwrap];

		return unicorns;
	});

	console.log(jQuery.makeArray(dragons));

	return stringyJson(jQuery.makeArray(dragons));
}

// initialize vars for left side spinners
var leftspins = {};
$(function() {
	$(".leftspin").map(function() {
		leftspins[$(this).attr('id')] = parseInt($(this).val());
	});
});

/* Smartly changes the counters to reduce work by the user. */
function changeCounter(side, leftID, rightID) {
	var left = $("#" + leftID)[0];
	var right = $("#" + rightID)[0];

	/* LEFT out of RIGHT */
	if (side == "left") {
		/* .value is a string, so we need to convert it to an integer for comparison to work. */
		if (parseInt(left.value) != leftspins[leftID]) {
			diff = parseInt(left.value) - leftspins[leftID];


			right.value = diff + parseInt(right.value);

			leftspins[leftID] += diff;
		}
	} else if (side == "right") {
		if (parseInt(right.value) < parseInt(left.value)) {
			left.value = right.value;
			leftspins[leftID] = parseInt(left.value);
		}
	}
}

$(".writefilebutton").click(function() {
	var medusa = $("#team").val() + "." + $("#round").val();

	writeToFile($("#team").val(), medusa, generateJsonString(),$("#event").val());
});

$(function() {
	$("#notes").height($("#tablething").height() - 14);
});

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
											 function(m,key,value) {
												 vars[key] = value;
											 });
    return vars;
}

if (getUrlVars()["position"]) {
	$("#position").val(getUrlVars()["position"]);
};
