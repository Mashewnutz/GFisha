function Fish(image)
{
	this.timer = timer;
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	this.r = 0;
	this.img = image;
	this.anger = 310;
	this.beatTimer = Math.PI;
	this.beatHeight = 50;
	this.by = 0;
	this.dir = 1;
}

Fish.prototype.setPos = function(x, y)
{
	this.x = x;
	this.y = y;
	this.by = 0;
}

Fish.prototype.setAnger = function(anger)
{
	this.anger = anger;
}

Fish.prototype.decAnger = function(anger)
{
	this.anger -= anger;
}

Fish.prototype.getAnger = function()
{
	return this.anger;
}

Fish.prototype.getPos = function()
{
	var o = new Object();
	o.x = this.x;
	o.y = this.y + this.by;
	return o;
}

Fish.prototype.getVel = function()
{
	var o = new Object();
	o.x = this.vx;
	o.y = this.y;
	return o;
}

Fish.prototype.setVel = function(vx, vy)
{
	this.vx = vx;
	this.vy = vy;
}

Fish.prototype.getRot = function()
{
	return this.r;
}

Fish.prototype.setRot = function(r)
{
	this.r = r;
}

Fish.prototype.update = function(dt)
{	
	this.x += this.vx * dt;

	if(this.beatTimer < Math.PI)
	{
		this.beatTimer += (dt*2 * Math.PI);

		if(this.dir > 0)
			this.by = Math.sin(this.beatTimer) * this.beatHeight;
		else
			this.by = -Math.sin(this.beatTimer) * this.beatHeight;
	}
}

Fish.prototype.draw = function(ctx)
{
	ctx.save();

	var y = this.y + this.by;
	

	ctx.translate(this.x, y);
	ctx.rotate(this.r);	
	ctx.scale(this.vx > 0 ? 1 : -1,1);
	ctx.translate(-this.img.width*0.9, -this.img.height*0.5);

	ctx.drawImage(this.img, 0, 0);
	ctx.restore();		
}

Fish.prototype.intersects = function(x, y)
{
	var dx = Math.abs(this.x-x);
	var dy = Math.abs(this.y-y);
	return (dx < 40) && (dy < 40);
}

Fish.prototype.cancelBeat = function()
{
	return this.beatTimer = Math.PI;
}

Fish.prototype.onBeat = function(height, cycles, dir)
{
	this.beatTimer = -(cycles-1) * Math.PI;
	this.beatHeight = 50;
	this.dir = dir;
}