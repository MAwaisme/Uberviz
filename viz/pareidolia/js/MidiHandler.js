/**
* Using Web MIDI API Polyfill - https://github.com/cwilso/WebMIDIAPIShim
* Requires JAzz Plugin v1.2 or higher installed - http://jazz-soft.net/download/Jazz-Plugin/
*/

var MidiHandler = function() {

	var midi;


	var midiParams = {
		useMidi:true
	};

	function init() {


		if (midiParams.useMidi){
			console.log("Starting up MIDI...");
			navigator.requestMIDIAccess().then( onSuccess, onError2 );
		}

	}

	function onSuccess( access ) { 

		console.log("MIDI ready!");

	    midi = access;
	    var inputs = midi.inputs();   // inputs = array of MIDIPorts

	    console.log(inputs.length+" inputs");

	    inputs[0].onmidimessage = onMidiIn; // onmidimessage( event ), event.data & event.receivedTime are populated	    
	}

	function onError2( err ) {
	    console.log("MIDI Init Error. Error code: " + err.code );
	}

	function onMidiIn(ev){

		// testing - just reflect.
		//console.log("Message: " + ev.data.length + " bytes, timestamp: " + ev.timestamp);
		if (ev.data.length == 3) {
			//UberVizMain.trace(ev.data[0].toString(16) + " : " + ev.data[1].toString(16) + " : " + ev.data[2].toString(16));
			//UberVizMain.trace("midi: " +  ev.data[1] + " : " + ev.data[2]/127);
			handleMidiControl(ev.data[1],ev.data[2]/127);
		}

	}


	//for korg nano kontrol

	//id = 1st difigit is 1 - 9  slider id
	//		2nd dgit is 1-4 
	//		1 = knob
	//		2 = top btn
	//		3 = bottom btn
	//		4 = slider


	//val - for knob and slider goes 0 -127

	function handleMidiControl(id,val){


		console.log("midiControl",{id:id,val:val});
		events.emit("midiControl",{id:id,val:val});
	}

	return {
		init:init,
	};

}();