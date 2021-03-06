/*
  CONSTANTS defines all constants
*/

function setJSONParams(json_params, names_array, obj)
{
  for(let param_name in names_array)
    if(json_params[param_name])
      obj[param_name] = json_params[param_name];
    else
      throw new Error("We have no needed parameter: " + param_name);
}

let DEVICE_TYPES = {
  DESKTOP: 0,
  MOBILE: 1
};

function checkPlatform()
{

 	let testExp = new RegExp('Android|webOS|iPhone|iPad|' +
    		       'BlackBerry|Windows Phone|'  +
    		       'Opera Mini|IEMobile|Mobile' , 
    		      'i');
  
    if (testExp.test(navigator.userAgent)){
    	return DEVICE_TYPES.MOBILE;
    }else{
    	return DEVICE_TYPES.DESKTOP;
    }

}

const CONSTANTS = {
   MESSAGES_TYPES : {
     ADD_USER: 0,
     REMOVE_USER: 1,
     SET_POSITION: 2,
     FIRE_BUTTON_DOWN: 3,
     FIRE_BUTTON_UP: 4,
     ADD_MASTER: 5,
     // Code that user sent is right.
     USER_CODE_IS_SUBMITTED: 6,
     // Code that user sent is not right.
     USER_CODE_IS_NOT_SUBMITTED: 7,
     // It indicates to Master, that
     CONTROLLER_IS_CONNECTED: 8,
     // When user is disconnect from service.
     CONTROLLER_IS_DISCONNECTED: 9,
     MASTER_IS_DISCONNECTED: 10,
     ENTER_YOUR_CODE: 11,
     
     LEFT_BUTTON_UP: 12,
     LEFT_BUTTON_DOWN: 13,
     RIGHT_BUTTON_UP: 14,
     RIGHT_BUTTON_DOWN: 15,
     FRONT_BUTTON_UP: 16,
     FRONT_BUTTON_DOWN: 17,
     BACK_BUTTON_UP: 18,
     BACK_BUTTON_DOWN: 19,

     CHANGEVIEW_BUTTON_DOWN: 20,
     CHANGEVIEW_BUTTON_UP: 21,

     NEED_CALL_FOX: 22,
     FOX_CALLED: 23

   },
   WEB_SOCKET_ADDR : "wss://www.polyzer.org:8081"
};

if(typeof(module) !== "undefined")
{
  module.exports = CONSTANTS;
}