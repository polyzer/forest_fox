
/*
  That class devines object, that will be shown
  at the computer, and will be controlled by mobile users.
*/

class DesktopMasterProgram {
    constructor(){
        this.makeBindings();

        window.addEventListener("resize", this.onWindowResize);

        this.FrontMovingOn = false;
        this.BackMovingOn = false;
        this.LeftMovingOn = false;
        this.RightMovingOn = false;

        this.updatableFunctions = [];

        this.Scene = new THREE.Scene();
        this.Scene.background = new THREE.Color( 0xaaccff );
        this.Scene.fog = new THREE.FogExp2( 0xaaccff, 0.007 );

        this.Cameras = {
            // This camera is with fox
            FoxFirstPersonCamera: null,
            // This camera uses when
            WaitingConnectionCamera: null
        };
        this.Cameras.FoxFirstPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
        this.Cameras.WaitingConnectionCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
        
        this.Scene.add(this.Cameras.FoxFirstPersonCamera);
        this.Scene.add(this.Cameras.WaitingConnectionCamera);

        
        this.speedMult = 10;
        //Flag defines that scene was created
        this.itWasCreated = false;

        this.MessagesController = new MessagesController();
        this.CodeController = new CodeController();
        this.Clock = new THREE.Clock();

        this.Socket = new WebSocket(CONSTANTS.WEB_SOCKET_ADDR);

        this.Socket.onopen = function (event) {
            // There we setting up parameters for AddMasterMessage, and send it to server.
            this.MessagesController.AddMasterMessage.Code = this.CodeController.Code;
            this.Socket.send(JSON.stringify(this.MessagesController.AddMasterMessage));
            console.log("Socket was open."); 
        }.bind(this);

        this.Socket.onmessage = function(event) {
            let data = JSON.parse(event.data);
            switch(data.Type) {
                case CONSTANTS.MESSAGES_TYPES.SET_POSITION:
                    this.setPosition(data);
                break;

                case CONSTANTS.MESSAGES_TYPES.ADD_USER:
                    this.addUser(data);
                break;

                case CONSTANTS.MESSAGES_TYPES.REMOVE_USER:
                    this.removeUser(data);
                break;

                case CONSTANTS.MESSAGES_TYPES.FIRE_BUTTON_DOWN:
                    this.fireButtonDown(data);
                break;

                case CONSTANTS.MESSAGES_TYPES.FIRE_BUTTON_UP:
                    this.fireButtonUp(data);
                break;

                case CONSTANTS.MESSAGES_TYPES.USER_CODE_IS_SUBMITTED:
                    this.onCodeSubmit();
                break;
                
                case CONSTANTS.MESSAGES_TYPES.CONTROLLER_IS_DISCONNECTED:
                    this.onControllerDisconnect();
                break;

                //MOVEMENT_MESSAGES START
                case CONSTANTS.MESSAGES_TYPES.FRONT_BUTTON_DOWN:
                    this.FrontMovingOn = true;    
                break;
                case CONSTANTS.MESSAGES_TYPES.FRONT_BUTTON_UP:
                    this.FrontMovingOn = false; 
                break;
                case CONSTANTS.MESSAGES_TYPES.BACK_BUTTON_DOWN:
                    this.BackMovingOn = true;
                break;
                case CONSTANTS.MESSAGES_TYPES.BACK_BUTTON_UP:
                    this.BackMovingOn = false;
                break;
                case CONSTANTS.MESSAGES_TYPES.LEFT_BUTTON_DOWN:
                    this.LeftMovingOn = true;
                break;
                case CONSTANTS.MESSAGES_TYPES.LEFT_BUTTON_UP:
                    this.LeftMovingOn = false;
                break;
                case CONSTANTS.MESSAGES_TYPES.RIGHT_BUTTON_DOWN:
                    this.RightMovingOn = true;
                break;
                case CONSTANTS.MESSAGES_TYPES.RIGHT_BUTTON_UP:
                    this.RightMovingOn = false;
                break;
                //MOVEMENT_MESSAGES END

                default:
                    console.log(data.Type);
                    throw new Error("sho za huynya???");
            }

        }.bind(this);

        this.Socket.onclose = function (event) {
            console.log("Socket was closed");    
        /*
            Now we need to tell User. that Connection was Closed;
        */
        }.bind(this);
        this.createScene();
        this.update();
    }

    makeBindings(){
        this.waitingUserConnectionUpdate = this.waitingUserConnectionUpdate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onLaserShot = this.onLaserShot.bind(this);
        this.update = this.update.bind(this);
    }

    waitingUserConnectionUpdate(time)
    {
        this.Cameras.WaitingConnectionCamera.rotation.y += 0.1*time;
    }
    setFoxFirstPersonCamera()
    {
        this.Camera = this.Cameras.FoxFirstPersonCamera;   
    }

    setWaitingUserCamera()
    {
        this.Camera = this.Cameras.WaitingConnectionCamera;   
    }

    reinitScene()
    {
        this.ControlObject.position.set(0,0,0);
    }

    // If Controller is disconnected;
    onControllerDisconnect()
    {
        if(this.Controller)
        {
//            window.alert("Connection with Controller is closed");
        }
        this.reinitScene();
        this.onUserExit();
        this.CodeController.showCodeViewWindow();
        console.log("Controller is disconnected");
    }

    hideContainer(){
        if(this.Container){
            this.Container.style.visibility = "hidden";

        }else{
            throw new Error("We have no Container");
        }
    }

    onCodeSubmit()
    {
        console.log("code is submitted");
        this.CodeController.hideCodeViewWindow();
        if(!this.itWasCreated) {
            this.itWasCreated = true;
        }
        this.onUserComing();
    }

    onUserComing()
    {
        this.updatableFunctions.splice(0,this.updatableFunctions.length);
        this.setFoxFirstPersonCamera();            
    }
    onUserExit()
    {
        this.updatableFunctions.splice(0,this.updatableFunctions.length);
        this.updatableFunctions.push(this.waitingUserConnectionUpdate);
        this.setWaitingUserCamera();            
    }    
    createScene (){
        this.update = this.update.bind(this);
        this.Container = document.createElement("div");
        this.Container.id = "MainContainer";
        this.Container.classList.add("Container");

        this.Renderer = new THREE.WebGLRenderer();
        this.Renderer.setSize(window.innerWidth, window.innerHeight);
        this.Container.appendChild(this.Renderer.domElement);
        document.body.appendChild(this.Container);

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
        
        this.Camera = this.Cameras.WaitingConnectionCamera;
        this.Camera.position.set(0, 20, 0);
        this.Camera.rotation.x -= 0.1*Math.PI;

        this.Loader = new THREE.ColladaLoader();

        let TextureLoader = new THREE.TextureLoader();
        TextureLoader.load("./src/models/forest/grass.png", function (tex) {
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(100, 100);
            let ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), new THREE.MeshBasicMaterial({map: tex}));
            ground.rotation.x -= Math.PI/2;
            this.Scene.add(ground);
        }.bind(this));

        this.Loader.load("./src/models/forest/forest1.dae", function (dae){
            let BloodwoodTree = dae.scene.getChildByName("BloodwoodTree");
            let Grass = dae.scene.getChildByName("Grass");
            let Hedgehog = dae.scene.getChildByName("Hedgehog");
            let Mushrooms = dae.scene.getChildByName("Mushrooms");
            let PineTree = dae.scene.getChildByName("PineTree");
            let Rabbit = dae.scene.getChildByName("Rabbit");
            let SycamoreTree = dae.scene.getChildByName("SycamoreTree");
            
            let obj_arr = [BloodwoodTree, SycamoreTree, Grass, Hedgehog, Mushrooms, PineTree, Rabbit];
            this.WIDTH_SIZE = 1000; this.HEIGHT_SIZE = 1000;
            for(let i = 0; i < obj_arr.length; i++)
            {
                obj_arr[i].rotation.x -= Math.PI/2;          
                if(obj_arr[i].name === "Grass")
                {
                    this.copyObjectOnScene(obj_arr[i], 4000, 0.1, true);
                }
                if(obj_arr[i].name === "Mushrooms")
                {
                    this.copyObjectOnScene(obj_arr[i], 20, 0.001);
                }
                if(obj_arr[i].name === "Hedgehog")
                {
                    this.copyObjectOnScene(obj_arr[i], 20, 0.01);
                }
                if(obj_arr[i].name === "BloodwoodTree")
                {
                    this.copyObjectOnScene(obj_arr[i], 500, 1);
                }
                if(obj_arr[i].name === "PineTree")
                {
                    this.copyObjectOnScene(obj_arr[i], 500, 1);
                }
                if(obj_arr[i].name === "SycamoreTree")
                {
                    this.copyObjectOnScene(obj_arr[i], 100, 1);
                }
                if(obj_arr[i].name === "Rabbit")
                {
                    this.copyObjectOnScene(obj_arr[i], 100, 100);
                }
            }
        }.bind(this));
        this.Loader.load("./src/models/fox_walk.dae", function (dae){
            this.ControlObject = new THREE.Object3D();
            this.Cameras.FoxFirstPersonCamera.position.set(-1, 1.2, -0.35);
            this.Scene.add(this.ControlObject);
            this.ControlObject.add(this.Cameras.FoxFirstPersonCamera);
            this.ControlObject.add(dae.scene);
            dae.scene.rotation.z+= Math.PI;
            dae.scene.scale.set(0.5, 0.5, 0.5);
            var animations = dae.animations;
			var avatar = dae.scene;
			dae.scene.children[1].material.color = new THREE.Color(0xFFFFFF);
			dae.scene.children[1].material.needsUpdate = true;

			this.Mixer = new THREE.AnimationMixer( avatar );
			var action = this.Mixer.clipAction( animations[ 0 ] ).play();
        }.bind(this));    

        this.AmbientLight = new THREE.AmbientLight(0xFFFFFF, 0.9);
        this.Scene.add(this.AmbientLight);

        this.updatableFunctions.push(this.waitingUserConnectionUpdate);
    }

    copyObjectOnScene(obj,count, scale, rand){
        for(let j = 0; j < count; j++){
            let mesh = obj.clone();
            if(rand){
                let sc = Math.random();
                mesh.scale.set(scale*sc+(0.2*scale), scale*sc+(0.2*scale), scale*sc+(0.2*scale));
            
            }
            else
                mesh.scale.set(scale, scale, scale);
            mesh.position.set(Math.random()*this.WIDTH_SIZE-(this.WIDTH_SIZE/2), 0, Math.random()*this.HEIGHT_SIZE-(this.HEIGHT_SIZE/2));
            this.Scene.add(mesh);
        }
    }


    /*
    IN: json_params = {UserID};
    */
    removeUser(json_params) {
        this.Scene.remove(this.Lights[json_params.UserID]);
        this.Lights.splice(json_params.UserID, 1);
        console.log("User was spliced");
    }
    /*
    IN: json_params = {UserID, Position,Rotation}
    */
    setPosition(json_params) {
//        this.ControlObject.position.copy(json_params.Position);
        this.ControlObject.rotation.copy(json_params.Rotation);
//        console.log(this.ControlObject.position);
    }

    update(){
        this.stats.update();
        
        let delta = this.Clock.getDelta();
        
        if(this.LeftMovingOn)
            this.ControlObject.rotation.y -= 0.5*delta;
        if(this.RightMovingOn)
            this.ControlObject.rotation.y += 0.5*delta;

        if(this.FrontMovingOn){
            if (this.Mixer !== undefined ) {
                this.Mixer.update(delta);
            }
            delta *= this.speedMult;
            this.ControlObject.position.add(this.Camera.getWorldDirection().normalize().multiplyScalar(delta));
        }
        if(this.BackMovingOn){
            if (this.Mixer !== undefined ) {
                this.Mixer.update(delta);
            }
            delta *= this.speedMult;
            this.ControlObject.position.sub(this.Camera.getWorldDirection().normalize().multiplyScalar(delta));
        }

        this.updatableFunctions.forEach(function (el){
            el(delta);
        });
        this.Renderer.render(this.Scene, this.Camera);
        requestAnimationFrame(this.update);
    }
    

        
    onWindowResize(){
        this.Camera.aspect = window.innerWidth / window.innerHeight;
        this.Camera.updateProjectionMatrix();
        this.Renderer.setSize( window.innerWidth, window.innerHeight );
    }

    onLaserShot(mesh){
        let rot_speed = 0.01;
        if(mesh.material.color.getHex() < 0xFFFFFF){
            mesh.material.color.r += (1 - mesh.material.color.r) / 10;
            mesh.material.color.g += (1 - mesh.material.color.g) / 10;
            mesh.material.color.b += (1 - mesh.material.color.b) / 10;
            this.Ambientlight.intensity += 0.003;
        }
        if(mesh.rotSpeed < 0.3){
            mesh.rotSpeed += rot_speed;
            
        }
    }

};