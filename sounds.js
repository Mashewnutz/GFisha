window.onload = init;

var bpm = 120;
var timer = new Timer();
var metronome = new Metronome(timer, onBeat);
var ctx;
var canvas;
var audio;
var sync = false;
var timer = new Timer();
var fish = new Array();
var images = new Array();
var loadedImages = 0;
var spawn = 1;
var mouseX = 0;
var mouseY = 0;
var hookedFish;
var escapeFish;
var fishingrod;
var fishingRodX;
var fishingRodY;
var score;
var hook;
var hookX;
var hookY;
var casting = false;
var boat;
var bait;
var boatX;
var boatY;
var baited;
var baitX;
var baitY;
var baitvx;
var baitvy;
var power;
var hooktime;
var hard;
var lives;
var gameover;
var gameovertimer;
var casttimer = 0;
var beat = 0;

function createHook()
{
	this.x = 0;
	this.y = 0;
	this.img = images[4];
}

function getMousePos(c, evt) {
    var rect = c.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

window.requestAnimFrame=function()
{
	return window.requestAnimationFrame||
	window.webkitRequestAnimationFrame||
	window.mozRequestAnimationFrame||
	window.oRequestAnimationFrame||
	window.msRequestAnimationFrame||
	function(a){window.setTimeout(a,1E3/60)}
}();

function loop()
{	
	metronome.update();
	timer.update();
	update();
	draw();	
	requestAnimFrame(loop);
}

function update()
{
	spawn -= timer.getDeltaTime();
	casttimer -= timer.getDeltaTime();
	if(spawn <= 0.0)
	{
		spawnFish();
		spawn = 3;
	}

	boatX = fishingRodX + 30;
	boatY = 10;
	
	for(var i = 0; i < fish.length; ++i)
	{
		var pos = fish[i].getPos();
		if(pos.x < -100 || pos.x > canvas.width + 100)
		{
			fish.splice(i,1);
		}
		else
		{
			fish[i].update(timer.getDeltaTime());				
		}
	}		    

	

	hookX = baitX-30;
	hookY = baitY-60;

	if(hookedFish != null)
	{
		hooktime += timer.getDeltaTime();
		if(hooktime > 3 && hookedFish.getPos().y > 150)
		{
			escapeFish = hookedFish;
			baited = false;
			power = -400;
			escapeFish.setVel(Math.random() < 0.5 ? 400 : -400, 0);
			hookedFish = null;
		}
	}
	else
	{
		hooktime = 0;
	}

	var exmin = 100;
	if(baitY < exmin) //hit the top
	{
		baitY = exmin;
		casting = false;
		power = 0;
		if(hookedFish != null)
		{
			fish.splice(fish.indexOf(hookedFish), 1);
			hookedFish = null;
			score += 10;
			casttimer = 0.25;
		}
		else
		{
			if(lives == 0 && !baited)
			{
				gameover = true;
				gameovertimer = 3;
			}
		}
	}
	else if(baitY > 500) // hit the bottom
	{
		baitY = 500;
		if(hookedFish == null)
		{
			power = -400;
		}
	}


	if(casting)
	{
		baitvx = (fishingRodX - baitX)*5;
		if(hookedFish != null)
		{
			var fishvel = hookedFish.getVel();
			
			baitvx += hookedFish.getVel().x * 10;
			fishvel.x = Math.cos(hooktime*20) * 20;
			hookedFish.setVel(fishvel.x, 0);
		}
	}
	else
	{
		baitvx = 0
		baitX = fishingRodX;
	}
	baitvy += power * timer.getDeltaTime();

	baitX += baitvx * timer.getDeltaTime();
	baitY += power * timer.getDeltaTime();

	

	if(hookedFish == null) // Catch a fish
	{
		if(baited)
		{
			for(var i = 0; i < fish.length; ++i)
			{
				if(fish[i] == escapeFish) continue;

				if(fish[i].intersects(baitX, baitY))
				{
					hookedFish = fish[i];
					hookedFish.cancelBeat();
					break;
				}
			}
		}
	}
	else // Update fish position to the bait
	{
		hookedFish.setPos(baitX, baitY);
		var fishv = hookedFish.getVel();
	}
}

function draw()
{
	ctx.drawImage(images[6],0,0, canvas.width, canvas.height);
	ctx.drawImage(boat, boatX, boatY);

	for(var i = 0; i < fish.length; ++i)
	{
		fish[i].draw(ctx);
	}

	ctx.drawImage(fishingrod, fishingRodX, fishingRodY);

	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle='grey'
	ctx.lineWidth = 2;
	ctx.moveTo(fishingRodX+6, fishingRodY+3);
	ctx.lineTo(hookX+hook.width*0.5-3,hookY+30);
    ctx.stroke();
    ctx.restore();

    for(var i = 0; i < lives; ++i)
    {
    	ctx.drawImage(bait, 10 + (i) * 50, 10);
    }

    ctx.drawImage(hook, hookX, hookY);
	if(escapeFish != null)
	{
		ctx.drawImage(bait, escapeFish.getPos().x-bait.width*0.5, escapeFish.getPos().y-bait.height*0.5);
	}
	
	if(baited)
	{
		ctx.drawImage(bait, baitX-bait.width*0.5, baitY-bait.height*0.5);
	}

	if(gameover)
	{
		gameovertimer -= timer.getDeltaTime();
		ctx.strokeStyle='black'
		ctx.lineWidth = 2;
		ctx.strokeText('Out of bait!', 300, 300); 
		ctx.strokeText('You earned: $' + score + '.00', 240, 340); 

		ctx.fillStyle='white';	
		ctx.fillText('Out of bait!', 300, 300); 
		ctx.fillText('You earned: $' + score + '.00', 240, 340); 

		ctx.strokeText('Click to play again', 240, 460); 
		ctx.fillText('Click to play again', 240, 460); 
	}
	else
	{
		ctx.strokeStyle = 'black';
		ctx.strokeText('$' + score + '.00', 10, 90); 

		ctx.fillStyle = '#1CB028';
		ctx.fillText('$' + score + '.00', 10, 90); 
	}
}

function spawnFish()
{
	var dir = Math.random() < 0.5 ? 1 : -1;
	var randX = dir < 0 ? 0 : canvas.width;
	var randY = 200+Math.random()*canvas.height*0.5;
	var p = new Fish(images[Math.floor(Math.random()*6)]);
	p.setPos(randX,randY);	
	p.setVel(dir < 0 ? 40 : -40,0);
	p.setAnger(150 + beat*0.5);
	fish.push(p);
}

function onBeat(overshoot)
{
	beat++;


	if(beat == 68 || beat == 100 || beat == 132 || beat == 140 || beat == 148 || beat == 156 
		|| beat == 228 || beat == 236 || beat == 244 || beat == 252 || beat == 356 || beat == 420 || beat == 428 || beat == 436
		|| beat == 444 || beat == 452)
	{
		for(var i = 0; i < fish.length; ++i)
		{
			fish[i].onBeat(100, 1, Math.random < 0.5 ? 1 : -1);
		}		
	}
	else if( (beat > 68 && beat < 258) || (beat > 356))
	{
		jumpFish(fish.length);
	}
	else if(beat >= 293)
	{
		if (beat%2 == 1)
		{
			jumpFish(fish.length);
		}
	}
}

function jumpFish(count)
{
	while(count > 0)
	{
		var beatfish = Math.floor(Math.random() * fish.length);
		var dir = Math.random() < 0.5 ? 1 : -1;
		if(fish[beatfish] != hookedFish)
		{
			fish[beatfish].onBeat(50, 1, dir);			
		}
		count--;
	}
}

function begin(count)
{
	loadedImages++;
	console.log("Loaded " + loadedImages + "/" + count);
	if(loadedImages == count)
	{
		console.log("Assets loaded! Game beginning...");
		requestAnimFrame(loop);
	}
}

function onMouseMove(ev)
{
	ev.preventDefault();
	
	var m = getMousePos(canvas, ev);
	mouseX = m.x;
	mouseY = m.y;
	
	fishingRodX = mouseX - fishingrod.width;
	fishingRodY = 60-fishingrod.height+50;
	
	for(var i = 0; i < fish.length; ++i)
	{
		var p = fish[i];

		var pos = fish[i].getPos();
	}
}

function onMouseDown(ev)
{
	ev.preventDefault();

	if(gameover )
	{
		if(gameovertimer < 0)
		{
			reset();
			gameover = false;
		}
	}
	else
	{
		if(!casting && casttimer <= 0) // casting
		{
			casting = true;		
			if(!baited)
			{
				lives--;
			}
			baited = true;
			power = 80;
			escapeFish = null;
		}

		if(hookedFish != null)
		{
			power -= 180;
			power += Math.random() * hookedFish.getAnger();
			hookedFish.decAnger(Math.random() * 10);
		}
	}
	
}

function onMouseUp(ev)
{
	ev.preventDefault();
}

function reset()
{
	lives = 3;
	hookedFish = null;
	escapeFish = null;
	baited = false;
	power = 0;
	score = 0;
}

function init()
{
	canvas = document.getElementById('c');
	audio = document.getElementById('music');
	ctx = canvas.getContext('2d');
	ctx.font = '40px Calibri';

	canvas.addEventListener('mousedown', onMouseDown, false);
	canvas.addEventListener('mousemove', onMouseMove, false);
	canvas.addEventListener('mouseup', onMouseUp, false);

	metronome = new Metronome(audio, onBeat);
	metronome.setBpm(96);

	var imageSrcs = ["fish1.gif", 
	"fish1.png",
	"fish2.png",
	"fish3.png",
	"fish4.png",
	"fish5.png",
	"fishtank.jpg",
	"fishingrod.png",
	"bait.png",
	"hook.png",
	"boat.png"];

	for(var i = 0; i < imageSrcs.length; ++i)
	{
		var img = new Image();
		img.src = imageSrcs[i];
		img.onload = begin(imageSrcs.length);
		images.push(img);
	}

	fishingrod = images[7];
	bait = images[8];
	hook = images[9];
	boat = images[10];
	fishingRodX = 200;
	baitX = fishingRodX;
	baitY = 100;
	baitvx = 0;
	baitvy = 0;
	hookedFish = null;
	escapeFish = null;
	score = 0;
	power = 0;
	hooktime = 0;
	lives = 3;
	baited = false;
	gameover = false;
	gameovertimer = 0;
}