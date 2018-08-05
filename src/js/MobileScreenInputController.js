/**
 * This class provides set of input Elements,
 * that user will use to control character.
 * It Provides 4 button:
 *  -Front - coming to front direction;
 *  -Back - coming to back direction;
 *  -Left - rotate with angle;
 *  -Right - rotate with angle;
 */
class MobileScreenInputController{
    constructor(socket){

        this.Buttons = {
            Left: null,
            Right: null,
            Front: null,
            Back: null
        }

        this.Socket = socket;

        this.FrontMovingOn = false;
        this.BackMovingOn = false;
        this.LeftMovingOn = false;
        this.RightMovingOn = false;


        /**
         * FtontMovingButton
         */
        this.Buttons.Front = document.createElement("div");
        this.Buttons.Front.setAttribute("id", "FrontMovingButton");
        this.Buttons.Front.className = "FrontMovingButton";
        document.body.appendChild(this.Buttons.Front);
    
        this.Buttons.Front.onmousedown = function (event)
        {
            this.sendFrontButtonDown();
        }.bind(this);
    
        this.Buttons.Front.ontouchstart = function (event)
        {
            this.sendFrontButtonDown();
        }.bind(this);
    
        this.Buttons.Front.onmouseup = function (event)
        {
            this.sendFrontButtonUp();
        }.bind(this);
    
        this.Buttons.Front.ontouchend = function (event)
        {
            this.sendFrontButtonUp();
        }.bind(this);
    
        this.Buttons.Back = document.createElement("div");
        this.Buttons.Back.setAttribute("id", "BackMovingButton");
        this.Buttons.Back.className = "BackMovingButton";
        document.body.appendChild(this.Buttons.Back);
    
        /**
         * BackMovingButton
         */
        this.Buttons.Back.onmousedown = function (event)
        {
            this.sendBackButtonDown();
        }.bind(this);
    
        this.Buttons.Back.ontouchstart = function (event)
        {
            this.sendBackButtonDown();
        }.bind(this);
    
        this.Buttons.Back.onmouseup = function (event)
        {
            this.sendBackButtonUp();
        }.bind(this);
    
        this.Buttons.Back.ontouchend = function (event)
        {
            this.sendBackButtonUp();
        }.bind(this);

        /**
         * LeftMovingButton
         */        
        this.Buttons.Left = document.createElement("div");
        this.Buttons.Left.setAttribute("id", "LeftMovingButton");
        this.Buttons.Left.className = "LeftMovingButton";
        document.body.appendChild(this.Buttons.Left);
    
        this.Buttons.Left.onmousedown = function (event)
        {
            this.sendLeftButtonDown();
        }.bind(this);
    
        this.Buttons.Left.ontouchstart = function (event)
        {
            this.sendLeftButtonDown();
        }.bind(this);
    
        this.Buttons.Left.onmouseup = function (event)
        {
            this.sendLeftButtonUp();
        }.bind(this);
    
        this.Buttons.Left.ontouchend = function (event)
        {
            this.sendLeftButtonUp();
        }.bind(this);    
        /**
         * RightMovingButton
         */        
        this.Buttons.Right = document.createElement("div");
        this.Buttons.Right.setAttribute("id", "RightMovingButton");
        this.Buttons.Right.className = "RightMovingButton";
        document.body.appendChild(this.Buttons.Right);
    
        this.Buttons.Right.onmousedown = function (event)
        {
            this.sendRightButtonDown();
            event.preventDefault();
        }.bind(this);
    
        this.Buttons.Right.ontouchstart = function (event)
        {
            this.sendRightButtonDown();
            event.preventDefault();
        }.bind(this);
    
        this.Buttons.Right.onmouseup = function (event)
        {
            this.sendRightButtonUp();
            event.preventDefault();
        }.bind(this);
    
        this.Buttons.Right.ontouchend = function (event)
        {
            this.sendRightButtonUp();
            event.preventDefault();

        }.bind(this);    
    
    
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

    sendLeftButtonDown(){
        this.Socket.send(JSON.stringify({Type: CONSTANTS.MESSAGES_TYPES.LEFT_BUTTON_DOWN}));
    }
    sendLeftButtonUp(){
        this.Socket.send(JSON.stringify({Type: CONSTANTS.MESSAGES_TYPES.LEFT_BUTTON_UP}));
    }

    sendRightButtonDown(){
        this.Socket.send(JSON.stringify({Type: CONSTANTS.MESSAGES_TYPES.RIGHT_BUTTON_DOWN}));
    }
    sendRightButtonUp(){
        this.Socket.send(JSON.stringify({Type: CONSTANTS.MESSAGES_TYPES.RIGHT_BUTTON_UP}));
    }

};