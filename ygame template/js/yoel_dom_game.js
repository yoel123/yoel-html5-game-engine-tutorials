/*YOEL DOM ENGINE*/
var ytrace= function(bla){return console.log(bla);}
var y$=function(id){return document.getElementById(id);};


//prevent resolution change in smartphone
document.body.ontouchstart = function(e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    if (e && e.stopPropagation) { e.stopPropagation(); }
    return false;
}

document.body.ontouchmove = function(e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    if (e && e.stopPropagation) { e.stopPropagation(); }
    return false;
}
//ytrace(123);
////////////////////yoel engine class//////////////////////////////////////////
var yoel_engine= function ()
{
	var _world;
	var _game_loop=null;


}//end yoel engine
var yoel_engine_p = yoel_engine.prototype;

yoel_engine_p.current_world = "";
yoel_engine_p.camera = {x:0,y:0,z:1,f:100};
yoel_engine_p.world_num = 0;

yoel_engine_p.init= function ()
{
  yoel_engine_p.current_world.init();
  animate();

  
}//end init
//update engine
yoel_engine_p.switch_world = function (world)
{
	var old_world = yoel_engine_p.current_world;
	
	yoel_engine_p.current_world = world;
	//loop new world and show everything
	for(var i = 0, len =world.y_world_mc.length;len > i; i++ )
	{
		y_entity_p.visble.call(world.y_world_mc[i],true);
	}
	//loop old world and hide everything
	for(var i = 0, len =old_world.y_world_mc.length;len > i; i++ )
	{
		y_entity_p.visble.call(old_world.y_world_mc[i],false);
	}
}//switch_world
yoel_engine_p.update = function ()
{
    yoel_engine_p.current_world.update();
}//end update

yoel_engine_p.set_camera = function (x,y,z,f) 
{
      yoel_engine.prototype.camera.x = x;
	  yoel_engine.prototype.camera.y = y;
	  yoel_engine.prototype.camera.z = z;
	   yoel_engine.prototype.camera.f = f;
	   
}//end set_camera

function animate()
{
 yoel_engine_p.update();
	 //setInterval(yoel_engine_p.update, 1000 / 60);
	window.requestAnimationFrame( animate ); 

}

////////////////////end yoel engine class//////////////////////////////////////////

////////////////////world class//////////////////////////////////////////

var y_world= function (game_wraper)
{
	this.game_wraper = game_wraper;
	this.scene = 1;
	this.entity_count = 0;
	this.world_id = yoel_engine_p.world_num++;
	//array that holds all the worlds entitys
	this.y_world_mc = new Array();
	this.cam = {x:0,y:0,z:0}
	
	
}//end WORLD

var y_world_p = y_world.prototype;

y_world_p.debug_mode=false;
y_world_p.init = function ()
{}


y_world_p.update = function ()
{

	//alert(123);
	for(var i = 0, len =this.y_world_mc.length;len > i; i++ )
	{
		if(this.y_world_mc[i]  && this.y_world_mc[i].scene == this.scene )
		{
			if (typeof this.y_world_mc[i].update == 'function')
			{
				this.y_world_mc[i].update();
				//ytrace($(window).width())
				

			}
			//console.log(typeof this.y_world_mc[i]);
			//this.ctx.globalAlpha = 1;
			
		}
		else
		{
			//.visble(false);
			y_entity_p.visble.call(this.y_world_mc[i],false);
			//ytrace(this.y_world_mc[i].secne +"=="+ this.scene );
		}

	}

}//end update

y_world_p.change_world = function (world)
{
	//hide all entitys in this world
	for(var i = 0, len =this.y_world_mc.length;len > i; i++ )
	{
		y_entity_p.visble.call(this.y_world_mc[i],false);
	}
	//show all in new world
	for(var i = 0, len =world.y_world_mc.length;len > i; i++ )
	{
		y_entity_p.visble.call(world.y_world_mc[i],true);
	}
	yoel_engine_p.current_world = world;
}//change_world
y_world_p.not_active = function ()
{
		//hide all entitys in this world
	for(var i = 0, len =this.y_world_mc.length;len > i; i++ )
	{
		y_entity_p.visble.call(this.y_world_mc[i],false);
	}
}//end not_active


y_world_p.add = function (entity)
{
	this.y_world_mc[this.y_world_mc.length] = entity;
	//entity.init();
	y_entity_p.init.call(entity);
	
	//this.entity_count++;//no need its incremented on constructor
}
y_world_p.remove = function (entity,type,delay)
{
	entity.removed = true;//just in case
    var entity_r = yoel_engine_p.current_world.y_world_mc;
  var to_remove = entity.ecount;
 // ytrace($('#'+entity.id));


  delete entity_r[to_remove];
  if( $('#'+entity.id))
  {
  	if(type == "fade")
	{
		 $('#'+entity.id).fadeOut(delay,function(){$('#'+entity.id).remove(); });	
	}
	else
	{
		$('#'+entity.id).remove(); 
	}
  	 	
  }
  //remove from Array
  var to_remove = yoel_engine_p.current_world.y_world_mc.indexOf(entity);
  delete yoel_engine_p.current_world.y_world_mc[to_remove];
  yoel_engine_p.current_world.y_world_mc[to_remove]="no";

}

////////////////////end world class//////////////////////////////////////////


////////////////////entity class//////////////////////////////////////////

var y_entity= function (x,y,z,speed,img)
{
	if(!this.type)
	{
		this.type="entity";
	}
	this.world = yoel_engine_p.current_world;
	this.id="entity"+this.world.entity_count+"_"+this.world.world_id;
	this.world.entity_count++;//there was a bug when incremented n init,its need to be here
	this.scene=1;
	this.x=x;
	this.y=y;
	this.z=z;
	this.width=50;
	this.height=50;
	this.speed=speed;
	this.img=img;
	this.class="";
	this.visble = true;
	this.collision_show = true;
	this.collision_rad=20;
	this.hitbox_isset = false;
	this.hitbox_width=50;
	this.hitbox_height=50;
	this.hitbox_depth=2;
	this.y3d = false;
	this.y3dp = {"x":1,"y":1,"z":1}; 
	//extra stuff
	this.is_key_control = false;
	this.is_bullet_movment = false;
	this.is_clicked = false;
	this.did_click_chake_init = false;
	this.no_cam = false;// is a camera element
	this.dir="up";//genral entity dir
}
y_entity_p = y_entity.prototype;
y_entity_p.init=function()
{

	this.world =yoel_engine_p.current_world;
	var wrapper = this.world.game_wraper;

	//var wrapper2 =  y$(wrapper);

//	var entity_grafic ='<div class="entity '+this.type+'" id="'+this.id+'"></div>';
	//$("#"+wrapper).prepend(entity_grafic);
	//wrapper2.innerHTML +=  entity_grafic;
	
        //get game warper
	var wrapper2 = document.getElementById(wrapper);
	//create div
        ydiv = document.createElement("div");
	//put it in wraper
        var entity_div = wrapper2.appendChild(ydiv);
       //set class and id
        entity_div.setAttribute('class', 'entity '+this.type);
        entity_div.setAttribute('id', this.id);
	var entity = $('#'+this.id); // get rid of jq
	var entity2 = y$(this.id);
	
	//add castume class
	//$('#'+this.id).addClass(this.class);
	//var div = document.getElementById(this.id);
	if(!entity_div){return;}//if no div escape
    entity_div.style.left = this.x+"px";
    entity_div.style.top = this.y+"px";
	entity_div.style.zIndex =this.z;
	entity_div.style.width = this.width+"px";
	entity_div.style.height = this.height+"px";
    
	y_entity_p.change_img.call(this);
	 this.div = document.getElementById(this.id);
}//end init

y_entity_p.change_img = function()
{
	 this.div = document.getElementById(this.id);
	if(this.img && this.img !="")
	{
		//ytrace(this.img)
		//entity.append('<img src="'+this.img+'" />');

		 $("#"+this.id).css("background", "url("+this.img+") no-repeat");// get rid of jq
		 // entity.css({backgroundPosition: '-100px -50px'});
	
		
	}
	 this.div = document.getElementById(this.id);
	this.div.style.height = this.height+"px";
	this.div.style.width = this.width+"px";
	y_entity_p.responsive.call(this);
}//end change_img

y_entity_p.update=function()
{
	
	//update pos
	/*var entity = $('#'+this.id);
	var position = entity.position();
	this.x = position.left ;
	this.y = position.top;
	this.z = entity.css("z-index");*/
	//ytrace(this.x);
	 
	//$( "#y_game" ).scrollLeft( 100 );
	//entity.animate({left: "+=0.5"});

	//set pos
	


      
	
    y_entity_p.keyboard_control.call(this);
	y_entity_p.bullet_movment.call(this);
	
	
	//if(this.is_clicked){ytrace(this.id+" clicked");}
	//if(this.is_clicked){ytrace(" clicked");}
	if(this.y3d){update_3d(this.y3dp.x,this.y3dp.y,this.y3dp.z, this);}
	if(this.is_clicked){this.is_clicked = false;}//if is clicked reset flag
	if(this.yclicked_key){this.yclicked_key = false; }//if is clicked reset flag
	//y_entity_p.colide.call(this,"entity");
	
}//end update


y_entity_p.move_by=function(x,y,z,solid)
{

	
	var cam = yoel_engine_p.camera;
	this.x += x;//-cam.x;
	this.y += y;//-cam.y;
	this.z += z;
	if(this.y3d)
	{
		
		this.z = 1000 - this.y3dp.z;
		//this.y3dp.x +x;
		
	}


	if(!this.div){return;}//if no div escape

        this.div.style.left = this.x+"px";
        this.div.style.top = this.y+"px";
	this.div.style.zIndex =this.z;
	
}

y_entity_p.set_pos=function(x,y,z)
{
	if(this.div)
	{
		this.div.style.left = x+"px";
        this.div.style.top = y+"px";
		this.div.style.zIndex =z;
	}
}//end set_pos

y_entity_p.colide=function(type)
{
	//entity array from current world
	var entity_list = yoel_engine_p.current_world.y_world_mc;
	
	//length of the array
	var entity_list_len = entity_list.length-1;
	
	//create visble hitbox for debug
	if(this.collision_show)
	{
		if(!this.hitbox_isset)
		{
			y_entity_p.create_hitbox.call(this);
			this.hitbox_isset = true;
		}
		else
		{
			y_entity_p.move_hitbox.call(this);
		}
		
	}
	

	var x = this.x ;//- this.hitbox_width/2;
	var y = this.y ;//- this.hitbox_height/2;
	
	for(var i = 0; entity_list_len>=i ; i++)
	{
		//ytrace("test");
		if(entity_list[i] == "no" && i<entity_list_len){i++;}
		
		var entity_type = entity_list[i].type;
		
		if(type == entity_type)
		{ 
		
			var target = entity_list[i];
			//ytrace(target.y > this.y );
			//&& target.y < this.hitbox_height && target.y > this.y
			//
			//ytrace(target.x +" "+1);
				var tx = target.x ;//- target.hitbox_width/2;
				var ty = target.y ;//- target.hitbox_height/2;
	//ytrace(tx +"<"+ (this.hitbox_width+x) +"&&"+ tx +">"+ x+" -"+ty +"<"+ (this.hitbox_height+y) +"&&"+ ty +">"+ y);
			if( tx <= (this.hitbox_width+x)  && tx >= x- target.hitbox_width/2 && ty <= (this.hitbox_height+y) && ty >= y- target.hitbox_height/2 )
			{
				//if 3d chack z index too
				if(this.y3d && (this.y3dp.z+this.hitbox_depth)> target.y3dp.z&&this.y3dp.z<target.y3dp.z){return false;}//dosnt work
				if(this.y3dp.z!=target.y3dp.z){
					return;
				}
				ytrace("collide");
				return target;
				
			}
		}
	}

}//end collide

y_entity_p.create_hitbox = function()
{
	$("#"+this.world.game_wraper).append('<div id="hitbox_'+this.id+'" class="hitbox"></div>');
	$('#hitbox_'+this.id).css({width:this.hitbox_width,height:this.hitbox_height});
	y_entity_p.move_hitbox.call(this);
}//end do_collition_show
y_entity_p.move_hitbox = function()
{
	//set entitys start point at mid insted of top left
	var x = this.x ;//- this.hitbox_width/2;
	var y = this.y ;//- this.hitbox_height/2;
	//var x = this.x;
	//var y = this.y;
	
	//$('#hitbox_'+this.id).css({left:x,top:y});
	var div = document.getElementById('hitbox_'+this.id);
//	ytrace(div);
	if(!div){return;}
	div.style.left = x+"px";
    div.style.top = y+"px";
	div.style.zIndex =this.z;
}//end move_hitbox 

y_entity_p.get_by_type = function(type)
{

	//entity array from current world
	var entity_list = yoel_engine_p.current_world.y_world_mc;
	
	//length of the array
	var entity_list_len = entity_list.length-1;
	
	var entity_catch = [];
	
	for(var i = 0; entity_list_len>=i ; i++)
	{
		//ytrace("test");
		if(entity_list[i] == "no" && i<entity_list_len){i++;}
		
		var entity_type = entity_list[i].type;
		
		if(type == entity_type)
		{ 
			entity_catch.push(entity_list[i]);
		}
	}
	return entity_catch;
}

y_entity_p.keyboard_control = function()
{
	
	if(this.is_key_control)
	{
		var speed = this.speed;
		this.yclicked_key = false;
		//move left
		if(y_input2_p.key_down[y_key.A] ||y_input2_p.key_down[y_key.left])
		{
			y_entity_p.move_by.call(this,-speed,0,0);
			
			this.yclicked_key = true;
		}
		//move rught
		if(y_input2_p.key_down[y_key.D] || y_input2_p.key_down[y_key.right])
		{
			y_entity_p.move_by.call(this,speed,0,0);
			this.yclicked_key = true;
		}
		//move up
		if(y_input2_p.key_down[y_key.W]  || y_input2_p.key_down[y_key.up])
		{
			y_entity_p.move_by.call(this,0,-speed,0);
			this.yclicked_key = true;
		}
		//move down
		if(y_input2_p.key_down[y_key.S]|| y_input2_p.key_down[y_key.down])
		{
			y_entity_p.move_by.call(this,0,speed,0);
			this.yclicked_key = true;
		}
		
	}
}//end keyboard_control

y_entity_p.bullet_movment= function()
{
	if(this.is_bullet_movment)
	{
		var speed = this.speed;
		if(this.b_dir =="up"){y_entity_p.move_by.call(this,0,-speed,0);}
		if(this.b_dir =="down"){y_entity_p.move_by.call(this,0,speed,0);}
		if(this.b_dir =="left"){y_entity_p.move_by.call(this,-speed,0,0);}
		if(this.b_dir =="right"){y_entity_p.move_by.call(this,speed,0,0);}	
	}
}//end bullet_movment

y_entity_p.move_to = function(t)
{
	var speed = this.speed;
	if(this.x>t.x){y_entity_p.move_by.call(this,-speed,0,0); }
	if(this.x<t.x){y_entity_p.move_by.call(this,speed,0,0);}
	if(this.y>t.y){y_entity_p.move_by.call(this,0,-speed,0);}
	if(this.y<t.y){y_entity_p.move_by.call(this,0,speed,0);}
}//end move_to

y_entity_p.distanse = function(x,y)
{
    dx = this.x-x;
	dy = this.y-y;
	
	return Math.sqrt(dx * dx + dy * dy);
}//distanse

y_entity_p.click_chack= function()
{
	//if(this.did_click_chake_init){return;}//dont want too meany click event

	var that = this;
	$( '#'+this.id).unbind( "touchstart click" );
	$('#'+this.id).on("touchstart click",{entity:that},function(e){
		e.preventDefault();
		e.data.entity.is_clicked = true;
	});
this.did_click_chake_init=true;
	
	//else
	
	
}//end click_chack

y_entity_p.was_click = function()
{
	
	if(this.is_clicked){this.is_clicked = false;return true;}
	return false;
}

y_entity_p.drag=function()
{
	
	if(this.is_clicked)
	{
		mx = y_input2_p.mouse_cor.x;
		my = y_input2_p.mouse_cor.y;
		this.x = mx;
		this.y = my;
		this.move_by(0,0,this.z);
	}
}

//example
//y_entity_p.rotate.call(this,10); 
y_entity_p.rotate= function(degree)
{
	//var entity = $('#'+this.id);
	
	/*  // For webkit browsers: e.g. Chrome
        entity.css({ 'WebkitTransform': 'rotate(' + degree + 'deg) '});
      // For Mozilla browser: e.g. Firefox
        entity.css({ '-moz-transform': 'rotate(' + degree + 'deg)'});*/
	var entity = y$(this.id);
	if(!entity){return;}//if no div escape
	entity.style.webkitTransform = 'rotate(' + degree + 'deg)';
	entity.style.MozTransform = 'rotate(' + degree + 'deg)';
}//end rotate

y_entity_p.to3d= function(x,y,z)
{
	var entity = y$(this.id);
	if(!entity){return;}//if no div escape
	entity.style.webkitTransform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px," + z.toFixed(2) + "px)" ;
	//entity.style.MozTransform = 'rotate(' + degree + 'deg)';
}

y_entity_p.height = function(num)
{
	var div = document.getElementById(this.id);
//	ytrace(div);
	if(!div){return;}//if no div escape
   // div.setAttribute("style","height:"+num+"px");
	div.style.height= num+'px';	
}//end width

y_entity_p.width = function(num)
{
	var div = document.getElementById(this.id);
//	ytrace(div);
	if(!div){return;}//if no div escape
    //div.setAttribute("style","width:"+num+"px");
	div.style.width=num+'px';	
}//end width

y_entity_p.visble= function(is)
{
	if(is)
	{
		$('#'+this.id).show();
	}
	else
	{
		$('#'+this.id).hide();
	}
	
}
y_entity_p.alpha= function(present)
{
	//$('#'+this.id).css({ 'opacity' :present });
	var div = document.getElementById(this.id);
	div.style.opacity = present;
	div.style.filter  = 'alpha(opacity='+present+')'; // IE fallback
}

y_entity_p.kyboard_camera_controle =function(type)
{
	if(y_input2_p.key_down[y_key.A] ||y_input2_p.key_down[y_key.left])
	{
		
	}
	if(y_input2_p.key_down[y_key.D] ||y_input2_p.key_down[y_key.right])
	{
		
	}
}//end kyboard_camera_controle
y_entity_p.camera_move =function(dir,type)
{
	var entity_list = yoel_engine_p.current_world.y_world_mc;
	
	//length of the array
	var entity_list_len = entity_list.length-1;
		
	for(var i = 0; entity_list_len>=i ; i++)
	{
		e= entity_list[i];
		do_stuff=true;
		if(e.type !=type && !e.no_cam){do_stuff=false}
		if(dir == "up"){e.y += this.speed; this.world.cam.y +=this.speed;}
		if(dir == "down"){e.y -= this.speed; this.world.cam.y -=this.speed;}
		if(dir == "left"){e.x -= this.speed; this.world.cam.x -=this.speed;}
		if(dir == "right"){e.x += this.speed; this.world.cam.x +=this.speed;}
		y_entity_p.move_by.call(e,0,0);//updatexy
	}//end loop
}//end camera_move

y_entity_p.responsive=function()
{
	//width = $('#'+this.id).parent().parent().width();
	width = $(window).width();
	//width = 340;
	ytrace(width+"screen");
	if(width<400)
	{
		this.width *=2.5;
		this.height *=2.5;
		yw_h(this,this.width,this.height)
		
	}
}

////////////////////end entity class//////////////////////////////////////////

/////3d funcs//////
var y_3d = {"zoomZ":100,"focus":100,"shiftX":50,"shiftY":50};
PZ = {x:10, y:10};

function y_3dscale(z)
{

    var scale = 100 * y_3d.zoomZ / (y_3d.focus + z);
    return (scale);
} // End y_3dscale

function update_3d(x,y,z,obj)
{
		
		var cam = yoel_engine_p.camera;
		var y3d_scale = y_3dscale(z-cam.z); 
	    var x3d = (x+ y_3d.shiftX) * y3d_scale / 100 + PZ.x;
        var y3d = (y + y_3d.shiftY) * y3d_scale / 100 + PZ.y;
        var Y0z0 = y_3d.shiftY * y_3dscale(0) / 100;
        //3d point converted to 2d
		var pt2 = {x: x3d, y: y3d};
	//	ytrace(Y0z0);
        
		//3d scale
		scale = 200/z;
		y_entity_p.width.call(obj,y3d_scale);
		y_entity_p.height.call(obj,y3d_scale);
		this.hitbox_width = y3d_scale;
	    this.hitbox_height = y3d_scale;
     
     //  obj.x = pt2.x ;
      // obj.y = pt2.y //- Y0z0;
	  
	

		
		
	
        
		//swapDepths(10000 - z);
}
/////end 3d funcs//////

//////////////////// y_input2 class//////////////////////////////////////////
var y_input2 = function ()
{
	this.mouse_x_cor=0;
	this.mouse_y_cor=0;
}
y_input2_p = y_input2.prototype;
y_input_p = y_input2.prototype;
//y_input2.prototype.this_world = yoel_engine.prototype.get_world.call(this);
//y_input2.prototype.canvas = y_input2.prototype.this_world.y_game_canvas;
y_input2_p.mouse_down = false;
y_input2_p.mouse_up = true;
y_input2_p.mouse_cor = {x:0,y:0};
y_input2_p.key_down =  [];

y_input2.prototype.is_down = function(keyCode)
{
	if(y_input2.prototype.key_down[keyCode]==null ){return false;}
    return y_input2.prototype.key_down[keyCode];
}//end is_down


//mouseup
window.addEventListener("mouseup", function(mouseEvent){y_input2.prototype.mouse_down = false;
y_input2.prototype.mouse_up = true;
	var mouse_x_cor = mouseEvent.offsetX;
   		var mouse_y_cor = mouseEvent.offsetY;
		
		y_input2.prototype.mouse_cor.x = mouse_x_cor;
		y_input2.prototype.mouse_cor.y = mouse_y_cor;
//window.removeEventListener("mouseup", arguments.callee, false);
});

//mousedown
window.addEventListener("mousedown", function(mouseEvent)
{
	  y_input2.prototype.mouse_down = true;
	  y_input2.prototype.mouse_up = false;
	  var mouse_x_cor = mouseEvent.offsetX;
   		var mouse_y_cor = mouseEvent.offsetY;
		
		y_input2.prototype.mouse_cor.x = mouse_x_cor;
		y_input2.prototype.mouse_cor.y = mouse_y_cor;
//window.removeEventListener("mousedown", arguments.callee, false);
});

//touchstart
window.addEventListener("touchstart", function(e)
{
	e.preventDefault();
	var touch = e.touches[0]; // Get the information for finger #1
       
 	//get xy cor
	
	var x = touch.pageX ;
    var y = touch.pageY;
	//alert(x+" "+y);
	y_input2.prototype.mouse_cor.x = x;
	y_input2.prototype.mouse_cor.y = y;
	
	y_input2.prototype.mouse_down = true;
	y_input2.prototype.mouse_up = false;
	
	
	
	return false;


});

window.addEventListener("touchmove", function(e)
{
	e.preventDefault();
	var touch = e.touches[0]; // Get the information for finger #1
       
 	//get xy cor
	
	var x = e.changedTouches[0].pageX;  
	var y = e.changedTouches[0].pageY;
	//alert(x+" "+y);
	y_input2.prototype.mouse_cor.x = x;
	y_input2.prototype.mouse_cor.y = y;
	
	y_input2.prototype.mouse_down = true;
	y_input2.prototype.mouse_up = false;
	
	
	return false;
});

////mousedown
window.addEventListener("touchend", function(e)
{
	e.preventDefault();
	var touch = e.touches[0]; // Get the information for finger #1
       
 	//get xy cor
	
	var x = e.changedTouches[0].pageX ;
    var y = e.changedTouches[0].pageY;
	//alert(x+" "+y);
	y_input2.prototype.mouse_cor.x = x;
	y_input2.prototype.mouse_cor.y = y;
	
	y_input2.prototype.mouse_down = false;
	y_input2.prototype.mouse_up = true;
	
	return false;
});

//keydown
window.addEventListener("keydown", function(event)
{
event.preventDefault();
y_input2.prototype.key_down[event.keyCode] = true;
//window.removeEventListener("mousedown", arguments.callee, false);
});

//keyup
window.addEventListener("keyup", function(event)
{
y_input2.prototype.key_down[event.keyCode] = false;
//window.removeEventListener("mousedown", arguments.callee, false);
});

//mousemove
window.addEventListener("mousemove", function (mouseEvent){
		
		var mouse_x_cor = mouseEvent.pageX;
   		var mouse_y_cor = mouseEvent.pageY;
		
		y_input2.prototype.mouse_cor.x = mouse_x_cor;
		y_input2.prototype.mouse_cor.y = mouse_y_cor;
	});
//keydown keyup

y_key =  
{

 up: 38,
 down:40,
 left:37,
 right:39,
 
 ENTER:13,
 CONTROL:17,
 SPACE:32,
 SHIFT:16,

 CAPS_LOCK:20,
 DELETE:46,
 END:35,
 ESCAPE:27,
 HOME:36,
 INSERT:45,
 TAB:9,
 PAGE_DOWN:34,
 PAGE_UP:33,
 LEFT_SQUARE_BRACKET:219,
 RIGHT_SQUARE_BRACKET:221,
 
 A:65,
 B:66,
 C:67,
 D:68,
 E:69,
 F:70,
 G:71,
 H:72,
 I:73,
 J:74,
 K:75,
 L:76,
 M:77,
 N:78,
 O:79,
 P:80,
 Q:81,
 R:82,
 S:83,
 T:84,
 U:85,
 V:86,
 W:87,
 X:88,
 Y:89,
 Z:90,
		
 DIGIT_0:48,
 DIGIT_1:49,
 DIGIT_2:50,
 DIGIT_3:51,
 DIGIT_4:52,
 DIGIT_5:53,
 DIGIT_6:54,
 DIGIT_7:55,
 DIGIT_8:56,
 DIGIT_9:57,

}//end key

////////////////////end y_input2 class//////////////////////////////////////////



////////////////button/////////////////////////
var y_button =  function(x,y,text,yclass,mesh)
{
	
	y_entity_p.click_chack.call(this);
	this.type = "btn";
	this.text = text;
	this.text_x = 100;
	this.text_y = 20;
	
	this.released =false;
	this.clicked = false;
	this.click_catch = false;
	this.width =200;
	this.height =20;
	
	this.released_count = 0; 
	
	
	this.visble = true;
	y_entity.call(this,x,y,0,mesh);
	this.z = 9999;//show ontop of everthing


}

var y_button_p = y_button.prototype;

y_button_p.update = function()
{
	y_entity_p.click_chack.call(this);
	this.click_do();
	y_entity_p.update.call(this);
	$('#'+this.id).text(this.text);
	
	y_entity_p.update.call(this);
 
}//end update	

y_button_p.click_do= function()
{
	if(this.clicked){this.click_catch = true;}
	if(y_input2.prototype.mouse_up && this.click_catch  )
	{
	
		this.released = true;
		this.click_catch = false;
		this.released_count++;
	//	ytrace("relese");

	}else{this.released = false;}
	this.clicked =	this.is_clicked;
}//end click_do
////////////////end button/////////////////////////

////////////////menu_ui /////////////////////////

var menu_ui =  function(x,y,btns,align)
{
	this.x = x;
	this.y = y;
	
	this.btns = [];
	this.menu_name ="start"
	this.align = align;
	this.distanse = 60;
	this.world = yoel_engine_p.current_world;
	
}//end manu ui

var menu_ui_p = menu_ui.prototype;

menu_ui_p.init = function()
{
	
	this.start_menu();
	//y_entity_p.init.call(this);
}//end init

menu_ui_p.update = function()
{
	
	//this.handlle_click();
	//y_entity_p.update.call(this);
}//end update

menu_ui_p.start_menu = function()
{

	if(this.align== "vertical")
	{
		var i = 0;
		for(var key in this.btns)//var i=0; i <= this.btns.length-1; i++
		{
			//ytrace(i);
			var add_b = this.btns[key];
			
			add_b.x = this.x;
			add_b.y = this.distanse*(i)+this.y;
			ytrace(i);
			this.world.add(add_b);
			i++;
			//ytrace(this.world.entity_count);
		}
	}
	
	if(this.align== "horizontal")
	{
		for(var i=0; i <= this.btns.length-1; i++)
		{
			//ytrace(i);
			var add_b = this.btns[i];
			ytrace(add_b.id);
			add_b.x = this.distanse*(i+1)+this.x;
			add_b.y = this.y;
			
			this.world.add(add_b);
			
			
			//ytrace(this.world.entity_count);
		}
	}
}//end start manu
menu_ui_p.visble = function(is)
{
	for(var i=0; i <= this.btns.length-1; i++)
	{
		var add_b = this.btns[i];
		if(is)
		{
			y_entity_p.visble.call(add_b,true);
		}
		else
		{
			y_entity_p.visble.call(add_b,false);
		}
	}
}//hide manu
menu_ui_p.show = function()
{
}//hide manu

////////////////end menu_ui /////////////////////////

/////shuffel///////

shuffle_array = function(arr)
{
	var shuffeld =arr;
	var element_num = arr.length;
	for(var i = element_num; i>1 ; i--)
	{
		j = Math.round(Math.random() * element_num-1);
		if(j<0){j=0;}
		var temp = shuffeld[j]
		shuffeld[j] = shuffeld[i-1];
		shuffeld[i-1]=temp;
		var v =i-1;
		//ytrace(shuffeld[j]+" "+shuffeld[i-1]+" "+v+" "+j);
	}
	//ytrace(shuffeld);
	return shuffeld;
}//end shuffle_array

//////end shuffle_array///////////////


////////////timer class/////////////

var y_timer = function(duration)
{
	this.duration = duration *framerate;
	this.counter = 0;
	this.finished = false;
};

y_timer.prototype.update = function()
{
	this.counter++;
	if(this.counter >= this.duration){this.finished = true;}
};

y_timer.prototype.reset = function()
{
	this.counter = 0;
	this.finished = false;	
}

y_timer.prototype.cduration = function(d)
{
	this.duration = d *framerate;
}

////////////end timer class/////////////

//////////////// ystore (store data on cookie)/////////////////////////

var y_store = function(){};

y_store_p = y_store.prototype;

y_store_p.set = function(key,val)
{
	localStorage.setItem(key, JSON.stringify(val));
}//end set

y_store_p.get = function(key,val)
{
	result = localStorage.getItem(key);
	
	return JSON.parse(result);
}//end get
////////////////end ystore/////////////////////////	

//////////////////// y_sound class//////////////////////////////////////////

y_sound = function(sound,volume,loop)
{
	this.sound = new Audio(sound);
	this.valume = volume;
	this.sound.loop = loop;
}

y_sound.prototype.init = function()
{
	this.sound.load();
	this.sound.volume = this.valume;	 
}//end init 

y_sound.prototype.play = function()
{
	this.sound.play();
}//end play

y_sound.prototype.pause = function()
{
	this.sound.pause();
}//end pause

/*
function test_sound()
{
		laser = new Audio("sound/laser.wav");
        laser.volume = .12;
        laser.load();
		laser.play();
		laser.loop=true;
		laser.pause();
		
}*/
////////////////////end y_sound class//////////////////////////////////////////

////////////////////ai class//////////////////////////////////////////

var y_ai = function(that)
{
	var speed = that.speed;
	
	this.zombie =function()
	{
		var tx = that.tx;
		var ty = that.ty;
		var x = that.x;
		var y = that.y;
		
		if(!tx ){return;}
		if(tx && x > tx){y_entity_p.move_by.call(that,-speed,0,0); that.status = "moving";}
		if(tx&&x < tx){y_entity_p.move_by.call(that,speed,0,0);that.status = "moving";}
	    if(ty&&y > ty){y_entity_p.move_by.call(that,0,-speed,0);that.status = "moving";}
	    if(ty&&y < ty){y_entity_p.move_by.call(that,0,speed,0);that.status = "moving";}
		
	};//end zombie
};
////////////////////end ai class//////////////////////////////////////////
///random/
function y_random(minimum,maximum)
{
  var randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;	
  return randomnumber;
}
///end random//

//////////////////dom_animation/////////////
var y_animation= function(id,width,height,dir)
{
	this.id = id;
	this.width = width;
	this.height = height;
	this.dir = dir;//this.pr_row
	this.current_frame = 0;
	this.animations = [];
	this.rewind = false;
	//this.row = 0;
	
}
y_animation_p = y_animation.prototype;

y_animation_p.go_to_frame = function(frame)
{
	this.current_frame = frame;
	var width = this.width * -frame;
	var height = this.height *-frame;
	if(this.dir == "forword"){height = 0 }
	if(this.dir == "down"){width = 0 }
	
	$('#'+this.id).css({backgroundPosition: ''+width+'px '+height+'px'});
	
	//set width hight
	$('#'+this.id).width(this.width);
	$('#'+this.id).height(this.height);
	
	
	
	
}//end go_to_frame
y_animation_p.play = function(animation)
{
	//cant be longer then animation leangth
	if(this.current_frame > this.animations[animation].length){this.current_frame = this.animations[animation].length;}
	current_frame = this.animations[animation][this.current_frame];

	this.go_to_frame(current_frame)
	
	this.current_frame++;
	//rewind if needed
	if(this.rewind && this.current_frame > this.animations[animation].length){this.current_frame =0}
}//end animate
//////////////////end dom_animation/////////////


/////////math stuff///////////
/*def yget_angle(x,y,x2,y2)
	dx = x2 - x;
	dy = y2 - y;
	angle = dy.atan2( dx );
	return angle;
end ///yget_angle*/
function yget_angle(x,y,x2,y2)
{
	dx = x2-x;
	dy = y2-y;
	angle = Math.atan2(dy,dx);
	//return -angle;//cool
	//angle *= 180 / Math.PI;
	
	return angle;
}


function ManhattanDistance(Point, Goal)
{	
	return Math.abs(Point.x - Goal.x) + Math.abs(Point.y - Goal.y);
}

function DiagonalDistance(Point, Goal)
{	
	//max(5,10)=10
	return Math.max(Math.abs(Point.x - Goal.x), Math.abs(Point.y - Goal.y));
}


function EuclideanDistance(Point, Goal)
{	 
	// diagonals are considered a little farther than cardinal directions	
	// diagonal movement using Euclide (AC = sqrt(AB^2 + BC^2))
	// where AB = x2 - x1 and BC = y2 - y1 and AC will be [x3, y3]
	return Math.sqrt(Math.pow(Point.x - Goal.x, 2) + Math.pow(Point.y - Goal.y, 2));
}

//radian to angle
function r2d(x) 
{
    return x / (Math.PI / 180);
}
//angle to radian
function d2r(x) 
{
    return x * (Math.PI / 180);
}
/////////end math stuff///////////


/////////shortcuts/////////

function supdate(t)
{
	y_entity_p.update.call(t);
}

function ycolide(t,type)
{
	return y_entity_p.colide.call(t,type);
}

function yget_by_type(t,type)
{
	return y_entity_p.get_by_type.call(t,type);
}

function yremove(t,e)
{
	t.world.remove(e);
}

function ychange_img(t)
{
	y_entity_p.change_img.call(t);
}
function yw_h(t,w,h)
{
	y_entity_p.height.call(t,h); 
	y_entity_p.width.call(t,h);
}

function ydist(t,x,y)
{
	return y_entity_p.distanse.call(t,x,y)
}
/////////end shortcuts/////////

var framerate = 60;
/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */

if (!window.requestAnimationFrame)
{
  window.requestAnimationFrame = (function() 
  {
    return window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback,element) 
    {
      window.setTimeout(callback, 1000 / framerate);
    };
  })();
}

