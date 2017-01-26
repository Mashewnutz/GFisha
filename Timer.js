function Timer()
{
	this.deltaTime = 0.0;
	this.prevTime = 0.0;
	this.startTime = 0.0;
	this.reset();	
}

Timer.prototype.update = function()
{
	var currTime = this.getTime();
	
	this.deltaTime = currTime - this.prevTime;
	this.prevTime = currTime;
}

Timer.prototype.getDeltaTime = function()
{
	return this.deltaTime;
}

Timer.prototype.getAbsoluteTime = function()
{
	return this.startTime;
}

Timer.prototype.reset = function()
{
	this.startTime = this.getTime();
	this.prevTime = this.startTime;
}

Timer.prototype.getTime = function()
{
	return (new Date().getTime()) / 1000.0;
}