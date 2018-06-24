/*
SkyFox Team Controller.
On Desktop computer version we use THREE.FlyControls.
On Mobile phones we using Our Controls System.

IN: 
json_params = {
	Camera: THREE.Camera
};
*/
var THREEx = THREEx || {};
THREEx.ComputerMobileControls = function (json_params)
{
	if(json_params)
	{
		if(json_params.Camera)
			this.Camera = json_params.Camera;
		else{
			this.Camera = new THREE.PerspectiveCamera();			
		}
		if(json_params.MovingSpeed)
			this.MovingSpeed = json_params.MovingSpeed;
		else
			this.MovingSpeed = 100;

		if(json_params.RotationSpeed)
			this.RotationSpeed = json_params.RotationSpeed;
		else
			this.RotationSpeed = 30;	
			
		if(json_params.Socket)
		{
			this.Socket = json_params.Socket;
		} else
			console.log("Have no Socket");
	}

	this.Buttons = {
		TouchControl: null,
		AccelerometerControl: null,
		FrontMoving: null,
		BackMoving: null
      };

	this.touchUpdate = this.touchUpdate.bind(this);
	this.MessagesController = new MessagesController();

	this.initControls();
};

THREEx.ComputerMobileControls.prototype.initControls = function ()
{
	this.OrientationParameters = {
		alpha: 0,
		beta: 0,
		gamma: 0,
		deviceMotionInterval: 0,
		
		touchRotRadX: 0,
		touchRotRadY: 0,
		touchDeltaTime: 0,
		
		shakeTimer: 0,
		shakeTimerStep: 0.1
	};

	this.DEVICE_TYPES = {
		DESKTOP: 0,
		MOBILE: 1
	};

 	var testExp = new RegExp('Android|webOS|iPhone|iPad|' +
    		       'BlackBerry|Windows Phone|'  +
    		       'Opera Mini|IEMobile|Mobile' , 
    		      'i');
  
    if (testExp.test(navigator.userAgent)){
    	this.DeviceType = this.DEVICE_TYPES.MOBILE;
    }else{
    	this.DeviceType = this.DEVICE_TYPES.DESKTOP;
    }


	this.Buttons.AccelerometerControl = document.createElement("button");
	this.Buttons.AccelerometerControl.setAttribute("id", "AccelerometerControlButton");
    this.Buttons.AccelerometerControl.className = "AccelerometerControlButton";
    // document.body.appendChild(this.Buttons.AccelerometerControl);

	this.Buttons.TouchControl = document.createElement("button");
	this.Buttons.TouchControl.setAttribute("id", "TouchControlButton");
    this.Buttons.TouchControl.className = "TouchControlButton";
    // document.body.appendChild(this.Buttons.TouchControl);

	this.Buttons.AccelerometerControl.addEventListener("click", function () {
		this.Buttons.TouchControl.style.visibility = "visible";
		this.Buttons.AccelerometerControl.style.visibility = "hidden";
		this.RotateHammer.enable = false;
		this.update = this.accelerometerUpdate;
	}.bind(this));

	this.Buttons.TouchControl.addEventListener("click", function () {
		this.Buttons.TouchControl.style.visibility = "hidden";
		this.Buttons.AccelerometerControl.style.visibility = "visible";
		this.RotateHammer.enable = true;
		this.update = this.touchUpdate;
	}.bind(this));

	this.Buttons.FrontMoving = document.createElement("div");
	this.Buttons.FrontMoving.setAttribute("id", "FrontMovingButton");
    this.Buttons.FrontMoving.className = "FrontMovingButton";
	// document.body.appendChild(this.Buttons.FrontMoving);

	this.Buttons.FrontMoving.onmousedown = function (event)
	{
	 	this.FrontMovingOn = true;
	}.bind(this);

	this.Buttons.FrontMoving.ontouchstart = function (event)
	{
	 	this.FrontMovingOn = true;
	}.bind(this);

	this.Buttons.FrontMoving.onmouseup = function (event)
	{																																																																																																																																																																																																																																																																																																																																	
	 	this.FrontMovingOn = false;
	}.bind(this);

	this.Buttons.FrontMoving.ontouchend = function (event)
	{																																																																														
	 	this.FrontMovingOn = false;
	}.bind(this);																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																			

	this.Buttons.BackMoving = document.createElement("div");
	this.Buttons.BackMoving.setAttribute("id", "BackMovingButton");
    this.Buttons.BackMoving.className = "BackMovingButton";
	// document.body.appendChild(this.Buttons.BackMoving);

	this.Buttons.BackMoving.onmousedown = function (event)																								
	{
	 	this.BackMovingOn = true;
	}.bind(this);

	this.Buttons.BackMoving.ontouchstart = function (event)
	{
	 	this.BackMovingOn = true;
	}.bind(this);

	this.Buttons.BackMoving.onmouseup = function (event)
	{
	 	this.BackMovingOn = false;
	}.bind(this);

	this.Buttons.BackMoving.ontouchend = function (event)
	{
	 	this.BackMovingOn = false;
	}.bind(this);



	
	//mouse/touch controller
	this.RotateHammer = new Hammer(document.body);
	this.RotateHammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
	this.RotateHammer.on("pan", function (event) {

		this.OrientationParameters.touchRotRadX = THREE.Math.degToRad(event.deltaX*this.RotationSpeed);
		this.OrientationParameters.touchRotRadY = THREE.Math.degToRad(event.deltaY*this.RotationSpeed);
		this.OrientationParameters.touchDeltaTime = event.deltaTime;

	}.bind(this));


	this.AccelerometerControls = new THREE.DeviceOrientationControls(this.Camera);
	this.update = this.accelerometerUpdate;

	window.addEventListener("devicemotion", this.onDeviceMotion.bind(this));			
	window.addEventListener("deviceorientation", this.onDeviceOrientation.bind(this));					

	// if (this.DeviceType === this.DEVICE_TYPES.MOBILE) {
	// 	document.body.appendChild(this.Buttons.BackMoving);
	//     document.body.appendChild(this.Buttons.AccelerometerControl);
	//     document.body.appendChild(this.Buttons.TouchControl);
	// 	document.body.appendChild(this.FrontMovingButton);

	// 	this.RotateHammer.enable = false;
	// 	this.update = this.accelerometerUpdate;

	// } else {
		document.body.appendChild(this.Buttons.BackMoving);
	    document.body.appendChild(this.Buttons.AccelerometerControl);
	    document.body.appendChild(this.Buttons.TouchControl);
		document.body.appendChild(this.Buttons.FrontMoving);
		this.RotateHammer.enable = true;
		this.update = this.touchUpdate;
//	}
};

THREEx.ComputerMobileControls.prototype.sendFrontButtonDown = function(){
	this.Socket.send(JSON.stringify({Type: CONSTANTS.MESSAGES_TYPES.FRONT_BUTTON_DOWN}));
}
THREEx.ComputerMobileControls.prototype.sendFrontButtonUp = function(){
	this.Socket.send(JSON.stringify({Type: CONSTANTS.MESSAGES_TYPES.FRONT_BUTTON_UP}));
}

THREEx.ComputerMobileControls.prototype.sendBackButtonDown = function(){
	this.Socket.send(JSON.stringify({Type: CONSTANTS.MESSAGES_TYPES.BACK_BUTTON_DOWN}));
}
THREEx.ComputerMobileControls.prototype.sendBackButtonUp = function(){
	this.Socket.send(JSON.stringify({Type: CONSTANTS.MESSAGES_TYPES.BACK_BUTTON_UP}));
}


THREEx.ComputerMobileControls.prototype.accelerometerUpdate  = function (delta)
{
	this.AccelerometerControls.update();
	
	if(this.FrontMovingOn)
	{
		this.AntiVec = this.Camera.getWorldDirection();
		this.AntiVec.normalize();
		this.AntiVec.multiplyScalar(this.MovingSpeed);
		this.Camera.position.add(this.AntiVec);				
	}

	if(this.BackMovingOn)
	{
		this.AntiVec = this.Camera.getWorldDirection();
		this.AntiVec.normalize();
		this.AntiVec.multiplyScalar(-this.MovingSpeed);
		this.Camera.position.add(this.AntiVec);				
	}
};

THREEx.ComputerMobileControls.prototype.touchUpdate = function(delta)
{

	this.Camera.rotation.y -= this.OrientationParameters.touchRotRadX*delta;
	//this.Camera.rotation.x -= this.OrientationParameters.touchRotRadY*delta;	

    this.MessagesController.SetPositionMessage = {
		UserID: 0,
//		Position: this.Camera.position,
		Rotation: this.Camera.rotation
	  };
	  
	  if(this.Socket.readyState === WebSocket.OPEN){
		this.Socket.send(JSON.stringify(this.MessagesController.SetPositionMessage));
	  }  


	if(Math.abs(this.OrientationParameters.touchRotRadX) > 0.005)
	{
		this.OrientationParameters.touchRotRadX -= this.OrientationParameters.touchRotRadX/10;			
	} else if(this.OrientationParameters.touchRotRadX)
		this.OrientationParameters.touchRotRadX = 0;

	if(Math.abs(this.OrientationParameters.touchRotRadY) > 0.005)
	{
		this.OrientationParameters.touchRotRadY -= this.OrientationParameters.touchRotRadY/10;			
	} else if(this.OrientationParameters.touchRotRadY)
		this.OrientationParameters.touchRotRadY = 0;	

	if(this.FrontMovingOn)
	{
		this.AntiVec = this.Camera.getWorldDirection();
		this.AntiVec.normalize();
		this.AntiVec.multiplyScalar(this.MovingSpeed);
		this.Camera.position.add(this.AntiVec);				
	}

	if(this.BackMovingOn)
	{
		this.AntiVec = this.Camera.getWorldDirection();
		this.AntiVec.normalize();
		this.AntiVec.multiplyScalar(-this.MovingSpeed);
		this.Camera.position.add(this.AntiVec);				
	}
};


// Наш обработчик ускорения
THREEx.ComputerMobileControls.prototype.onDeviceMotion = function (event) {

	this.OrientationParameters.alpha = event.rotationRate.alpha;
	this.OrientationParameters.beta = -event.rotationRate.beta;
	this.OrientationParameters.deviceMotionInterval = event.interval;

	this.OrientationParameters.phi = 0;
	this.OrientationParameters.theta = 0;
};

// Наш обработчик ускорения
THREEx.ComputerMobileControls.prototype.onDeviceOrientation = function (event) {

	this.OrientationParameters.alpha = event.alpha;
	this.OrientationParameters.beta = -event.beta;
	this.OrientationParameters.deviceMotionInterval = event.interval;

	this.OrientationParameters.phi = 0;
	this.OrientationParameters.theta = 0;
};