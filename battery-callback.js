var BatteryCallback = function(opts) {

    this.BatteryManager = window.navigator.battery;

    this.settings = {
        "batteryThreshold": 0.5,
        "title": "",
        "message": "",
        "useNativeAlert": false,
        "storeInput": "all",
        "executeOnFailure": true
    };

    // This is just for dekstop testing
    if(!this.BatteryManager){
        this.BatteryManager = {
            'level': 0.1,
            'charging': false
        };
    }

    this.settings = opts || this.settings;
    return this;
};

BatteryCallback.prototype.checkBattery = function( callback, node ){
    this.callback = callback || '';

    if(this.BatteryManager){

        console.log('Battery status API is supported');
        if(this.BatteryManager.charging || this.storedChoice === 'confirm'){

            console.log('Status: Charging');
            this.executeCallback();
        }else{

            console.log('Checking battery level');
            var currentLevel = this.BatteryManager.level;

            if(currentLevel < this.settings.batteryThreshold){

                console.log('Status: Low - Create Message');
                this.createMessage( node );

            }else{

                console.log('Execute code: above threshold');
                this.executeCallback();
            }
        }
    }else{

        console.log('Battery status API is not supported');
        if(this.settings.executeOnFailure){

            console.log('Execute code anyway');
            this.executeCallback();
        }
    }
};

BatteryCallback.prototype.createMessage = function( obj ){

    var baseClass = "batcallback";

    var messageWrapper = document.createElement("div");
    messageWrapper.className = baseClass;

    var title = document.createElement("h3");
    title.className = baseClass + "--title";

    var message = document.createElement("p");
    message.className = baseClass + "--msg";

    var confirmButton = document.createElement("button");
    confirmButton.className = baseClass + "--button confirm";
    confirmButton.innerText = "Confirm";

    var cancelButton = document.createElement("button");
    cancelButton.className = baseClass + "--button cancel";
    cancelButton.innerText = "Cancel";

    var elements = [title, message, confirmButton, cancelButton];
    elements.reverse();

    for (var i = elements.length - 1; i >= 0; i--) {

        messageWrapper.appendChild(elements[i]);
    }

    obj.parentNode.appendChild(messageWrapper);
    this.uievents(messageWrapper);
};

BatteryCallback.prototype.destroyMessage = function( obj ){

    console.log('Destroy Message');
    var boo = document.querySelectorAll('.batcallback');

    for (var i = 0; i < boo.length; ++i) {
        boo[i].innerHTML = '';
    }
};

BatteryCallback.prototype.uievents = function( obj ){

    var _this = this,
        confirmButton = obj.querySelectorAll('.confirm'),
        cancelButton = obj.querySelectorAll('.cancel');

    for (var i = 0; i < confirmButton.length; ++i) {

        confirmButton[i].addEventListener('click', function(){
            _this.executeCallback(_this);
        }, false);
    }

    for (var c = 0; c < cancelButton.length; ++c) {

        cancelButton[c].addEventListener('click', _this.destroyMessage, false);
    }
};

BatteryCallback.prototype.executeCallback = function( obj ){

    if(obj){
        obj.callback();
        obj.destroyMessage();
    }else{
        this.callback();
        this.destroyMessage();
    }
};


/**
 * Storage Helper Functionality
 * -----------------------------
 */

/**
 * Get Choice Stored
 */
BatteryCallback.prototype.getChoiceStored = function(){

    return localStorage.getKey('batteryCheckChoice');
};

/**
 * Set Choice Stored
 */
BatteryCallback.prototype.setChoiceStored = function(){

    this.storedChoice = 'confirmed';
};
