var hack = false;

function Metronome(audio, callback)
{
	this.track = audio;
	this.prevTime = 0;
	this.callback = callback;
	this.bpm = 100;
	this.beatLength = this.bpmToSeconds(this.bpm);
	this.ttnb = this.beatLength;
}

Metronome.prototype.setBpm = function(bpm)
{
	this.bpm = bpm;
	this.beatLength = this.bpmToSeconds(bpm);
}

Metronome.prototype.getBeatLength = function()
{
	return this.beatLength;
}

Metronome.prototype.update = function()
{
	var currTime = this.track.currentTime;
	var deltaTime = currTime - this.prevTime;

	this.ttnb -= deltaTime;

	if(this.ttnb <= 0.0)
	{
		this.callback(-this.ttnb);
		this.ttnb += this.beatLength;
	}
	
	this.prevTime = currTime;
}

Metronome.prototype.bpmToSeconds = function(bpm)
{
	return (60.0 / bpm);
}