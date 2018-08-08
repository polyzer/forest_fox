/*
SkyFox Team Controller.
On Desktop computer version we use THREE.FlyControls.
On Mobile phones we using Our Controls System.

IN: 
json_params = {
	Camera: THREE.Camera
};
*/
class MobileControls
{
	constructor(json_params) {
		this.DISPOSITIONS = {
			PORTRAIT: 0,
			LANDSCAPE: 1
		};


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
		this.onWindowResize();
	}

	disposition () {
		if(window.innerWidth / window.innerHeight < 1)
			return this.DISPOSITIONS.PORTRAIT;
		else 
			return this.DISPOSITIONS.LANDSCAPE;
	}

	initControls()
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

		this.onWindowResize = this.onWindowResize.bind(this);
		window.addEventListener("resize", this.onWindowResize);

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
		this.Buttons.FrontMoving.className = "FrontMovingButton-portrait-block";
		this.Buttons.FrontMoving.classList.add("hoverclass");
		// document.body.appendChild(this.Buttons.FrontMoving);

		this.Buttons.FrontMoving.onmousedown = function (event)
		{
			this.sendFrontButtonDown();
		}.bind(this);

		this.Buttons.FrontMoving.ontouchstart = function (event)
		{
			this.sendFrontButtonDown();
		}.bind(this);

		this.Buttons.FrontMoving.onmouseup = function (event)
		{																																																																																																																																																																																																																																																																																																																																	
			this.sendFrontButtonUp();
		}.bind(this);

		this.Buttons.FrontMoving.ontouchend = function (event)
		{																																																																																																																																																																																																																																																																																																																									
			this.sendFrontButtonUp();
		}.bind(this);																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																			

		this.Buttons.BackMoving = document.createElement("div");
		this.Buttons.BackMoving.setAttribute("id", "BackMovingButton");
		this.Buttons.BackMoving.className = "BackMovingButton-portrait-block";
		this.Buttons.BackMoving.classList.add("hoverclass");
		// document.body.appendChild(this.Buttons.BackMoving);

		this.Buttons.BackMoving.onmousedown = function (event)																								
		{
	//	 	this.BackMovingOn = true;
			this.sendBackButtonDown();
		}.bind(this);

		this.Buttons.BackMoving.ontouchstart = function (event)
		{
	//	 	this.BackMovingOn = true;
			this.sendBackButtonDown();

			}.bind(this);

		this.Buttons.BackMoving.onmouseup = function (event)
		{
	//	 	this.BackMovingOn = false;
			this.sendBackButtonUp();

			}.bind(this);

		this.Buttons.BackMoving.ontouchend = function (event)
		{
	//	 	this.BackMovingOn = false;
			this.sendBackButtonUp();

			}.bind(this);

		this.RotationArea = document.createElement("div");
		this.RotationArea.id = "RotationArea";
		this.RotationArea.className = "rotation-area-portrait-block";

		//mouse/touch controller
		this.RotateHammer = new Hammer(this.RotationArea);
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
		document.body.appendChild(this.RotationArea);
		this.RotateHammer.enable = true;
		this.update = this.touchUpdate;
//	}
	}
	sendFrontButtonDown(){
		this.Socket.send(JSON.stringify({Type: CONSTANTS.MESSAGES_TYPES.FRONT_BUTTON_DOWN}));
	}
	sendFrontButtonUp(){
		this.Socket.send(JSON.stringify({Type: CONSTANTS.MESSAGES_TYPES.FRONT_BUTTON_UP}));
	}

	sendBackButtonDown(){
		this.Socket.send(JSON.stringify({Type: CONSTANTS.MESSAGES_TYPES.BACK_BUTTON_DOWN}));
	}
	sendBackButtonUp(){
		this.Socket.send(JSON.stringify({Type: CONSTANTS.MESSAGES_TYPES.BACK_BUTTON_UP}));
	}


	accelerometerUpdate(delta)
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
	}

	touchUpdate(delta)
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
	}


// Наш обработчик ускорения
onDeviceMotion(event) {

	this.OrientationParameters.alpha = event.rotationRate.alpha;
	this.OrientationParameters.beta = -event.rotationRate.beta;
	this.OrientationParameters.deviceMotionInterval = event.interval;

	this.OrientationParameters.phi = 0;
	this.OrientationParameters.theta = 0;
};

// Наш обработчик ускорения
	onDeviceOrientation(event) {

		this.OrientationParameters.alpha = event.alpha;
		this.OrientationParameters.beta = -event.beta;
		this.OrientationParameters.deviceMotionInterval = event.interval;

		this.OrientationParameters.phi = 0;
		this.OrientationParameters.theta = 0;
	}

	onWindowResize(){
		let aspect = window.innerWidth / window.innerHeight;
		this.Camera.aspect = window.innerWidth / window.innerHeight;
		this.Camera.updateProjectionMatrix();
//		this.Renderer.setSize( window.innerWidth, window.innerHeight );
		if(aspect <= 1)
		{
			this.setPortraitDisposition();
		} else 
			this.setLandscapeDisposition();

	}

	setPortraitDisposition () {
		this.Buttons.FrontMoving.classList.remove("FrontMovingButton-landscape-block");
		this.Buttons.BackMoving.classList.remove("BackMovingButton-landscape-block");
		this.RotationArea.classList.remove("rotation-area-landscape-block");
		this.Buttons.FrontMoving.classList.add("FrontMovingButton-portrait-block");
		this.Buttons.BackMoving.classList.add("BackMovingButton-portrait-block");
		this.RotationArea.classList.add("rotation-area-portrait-block");

		this.RotationArea.style.width = window.innerWidth + "px";
		this.RotationArea.style.height = window.innerHeight*0.7 + "px";
		
		this.Buttons.FrontMoving.style.height = window.innerWidth*0.3 + "px";
		this.Buttons.FrontMoving.style.width = window.innerWidth*0.3 + "px";
		this.Buttons.BackMoving.style.height = window.innerWidth*0.3 + "px";
		this.Buttons.BackMoving.style.width = window.innerWidth*0.3 + "px";
		
	}
	setLandscapeDisposition () {
		this.Buttons.FrontMoving.classList.remove("FrontMovingButton-portrait-block");
		this.Buttons.BackMoving.classList.remove("BackMovingButton-portrait-block");
		this.RotationArea.classList.remove("rotation-area-portrait-block");
		this.Buttons.FrontMoving.classList.add("FrontMovingButton-landscape-block");
		this.Buttons.BackMoving.classList.add("BackMovingButton-landscape-block");
		this.RotationArea.classList.add("rotation-area-landscape-block");

		this.RotationArea.style.height = window.innerHeight + "px";
		this.RotationArea.style.width = window.innerWidth*0.6 + "px";

		this.Buttons.FrontMoving.style.height = window.innerHeight*0.3 + "px";
		this.Buttons.FrontMoving.style.width = window.innerHeight*0.3 + "px";
		this.Buttons.BackMoving.style.height = window.innerHeight*0.3 + "px";
		this.Buttons.BackMoving.style.width = window.innerHeight*0.3 + "px";
	}
};
