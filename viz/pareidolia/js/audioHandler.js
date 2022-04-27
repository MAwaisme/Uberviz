var source;
var buffer;
var audioBuffer;
var dropArea;
var audioContext;
//var processor;
var analyser;
var freqByteData;
var levels;
var isPlayingAudio = false;
var normLevel =0;

function getMicInput() {

	//x-browser
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	if (navigator.getUserMedia ) {

		navigator.getUserMedia(

			{audio: true}, 

			function(stream) {
			//called after user has enabled mic access
			source = audioContext.createBufferSource();
			analyser = audioContext.createAnalyser();
			analyser.fftSize = 1024;

			microphone = audioContext.createMediaStreamSource(stream);
			microphone.connect(analyser);
			startViz();

			promptPanel.style.display = 'none';
			showTag();

		},

			// errorCallback
			function(err) {
				alert("Error getting mic input: " + err);
			});
	}else{
		alert("Could not getUserMedia");
	}
}

//load sample MP3
function loadSampleAudio() {

	source = audioContext.createBufferSource();
	analyser = audioContext.createAnalyser();
	analyser.fftSize = 1024;

	// Connect audio processing graph
	source.connect(analyser);
	analyser.connect(audioContext.destination);
	loadAudioBuffer("mp3/Szerencsetlen_edit03.mp3");
}

function loadAudioBuffer(url) {
	// Load asynchronously
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	request.onload = function() {
		

		audioContext.decodeAudioData(request.response, function(buffer) {
				audioBuffer = buffer;
				finishLoad();
		 }, function(e) {
			console.log(e);
		});

	};

	request.send();
}

function finishLoad() {
	source.buffer = audioBuffer;
	source.loop = true;
	source.start(0.0);
	startViz();
}

function onDocumentDragOver(evt) {
	introPanel.style.display = 'none';
	promptPanel.style.display = 'inline';
	evt.stopPropagation();
	evt.preventDefault();
	return false;
}

//load dropped MP3
function onDocumentDrop(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	if (source) source.disconnect();

	var droppedFiles = evt.dataTransfer.files;

	var reader = new FileReader();

	reader.onload = function(fileEvent) {
		var data = fileEvent.target.result;
		initAudio(data);
	};

	reader.readAsArrayBuffer(droppedFiles[0]);
	promptPanel.innerHTML = '<h1>loading...</h1>';

}

function initAudio(data) {
	source = audioContext.createBufferSource();

	if(audioContext.decodeAudioData) {
		audioContext.decodeAudioData(data, function(buffer) {
			source.buffer = buffer;
			createAudio();
		}, function(e) {
			console.log(e);
		});
	} else {
		source.buffer = audioContext.createBuffer(data, false );
		createAudio();
	}
}


function createAudio() {
	//processor = audioContext.createJavaScriptNode(2048 , 1 , 1 );

	analyser = audioContext.createAnalyser();
	analyser.smoothingTimeConstant = 0.1;

	source.connect(audioContext.destination);
	source.connect(analyser);

	//analyser.connect(processor);
	//processor.connect(audioContext.destination);

	source.start(1,45,30);

	source.loop = true;

	startViz();
}

function startViz(){
	freqByteData = new Uint8Array(analyser.frequencyBinCount);
	levels = [];
	isPlayingAudio = true;

	promptPanel.style.display = 'none';
	showTag();


	//rudimentary sequnce
	setTimeout(seq2, 34500);

	// setTimeout(glitchOn,  47212);
	// setTimeout(glitchOff, 48212);

	// setTimeout(glitchOn,  52250);
	// setTimeout(glitchOff, 53250);

	// setTimeout(glitchOn,  121453);
	// setTimeout(glitchOff, 123453);

	// setTimeout(glitchWildOn, 128751);
	// setTimeout(glitchWildOff, 132751);


}

function seq2(){
	console.log("seq2");
	sketchParams.volSens = 1.5;
}

function glitchOn(){
	glitchPass.enabled = true;
}

function glitchOff(){
	glitchPass.enabled = false;
}

function glitchWildOn(){
	glitchPass.goWild = true;
}

function glitchWildOff(){
	glitchPass.goWild = false;
}

// function getAudioTime(){

// 	//console.log(source.currentTime);
// 	return source.currentTime;
// }