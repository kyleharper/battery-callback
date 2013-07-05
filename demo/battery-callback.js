/**
 * Battery Callback Plugin
 *
 * Copyright © 2013 Kyle Shrives | BSD & MIT license | https://github.com/kyleshrives/battery-callback
 */

/**
 * BatteryCallback constuction
 * @param  {obj} opts [Settings for the plugin]
 * @return {obj}      [Constructed object]
 */
var BatteryCallback = function(opts) {

    this.BatteryManager = window.navigator.battery;

    this.settings = {
        "batteryThreshold": opts.batteryThreshold || 0.1,
        "msgTitle": opts.msgTitle || "Warning your battery is low.",
        "message": opts.message || "If you're happy to view this content then choose continue",
        "confirmButtonText": opts.confirmButtonText || "Confirm",
        "cancelButtonText": opts.cancelButtonText || "Cancel",
        "useNativeAlert": opts.useNativeAlert || false,
        "storeInput": opts.storeInput || true,
        "executeOnFailure": opts.executeOnFailure || true,
        "activeDelay": opts.activeDelay || 200
    };

    // This is just for dekstop testing
    // if(!this.BatteryManager){
    //     this.BatteryManager = {
    //         'level': 0.1,
    //         'charging': false
    //     };
    // }

    return this;
};

/**
 * Check the battery and conduct behaviour as required
 * @param  {Function} callback [The desired executable code]
 * @param  {Node}     node     [The node in which the plugin can used to constuct the message]
 */
BatteryCallback.prototype.checkBattery = function( callback, node ){
    this.callback = callback || '';

    if(this.BatteryManager){

        // Battery status: API is supported
        if(this.BatteryManager.charging || this.getChoiceStored() === 'confirm'){

            // If device is charging or a user has previously confirmed then execute callback
            this.executeCallback();

            return false;
        }else{

            // Checking battery level
            var currentLevel = this.BatteryManager.level;
            if(currentLevel < this.settings.batteryThreshold){

                // Battery Status: Low - Create Warning Message
                this.createMessage( node );

            }else{

                // Execute code: above threshold
                this.executeCallback();
            }
        }

    }else{

        // Battery status: API is not supported
        if(this.settings.executeOnFailure){

            this.executeCallback();

        }
    }
};

/**
 * Create warning message (includes a title, message and buttons)
 * @param  {object} obj [A node object to append the message HTML to]
 */
BatteryCallback.prototype.createMessage = function( obj ){

    this.destroyMessage();

    if(this.settings.useNativeAlert){

        var boo = confirm(this.settings.msgTitle + '\n\n' + this.settings.message),
            _this = this;

        if(boo){
            _this.setChoiceStored( 'confirm' );
            _this.executeCallback( _this );
        }else{

            _this.setChoiceStored( 'cancel' );
            if(_this.settings.executeOnFailure){
                _this.executeCallback( _this );
            }
        }
    }else{
        var baseClass = "batcallback";

        var messageWrapper = document.createElement("div");
        messageWrapper.className = baseClass;

        var title = document.createElement("h3");
        title.className = baseClass + "--title";
        title.innerText = this.settings.msgTitle;

        var message = document.createElement("p");
        message.className = baseClass + "--msg";
        message.innerText = this.settings.message;

        var confirmButton = document.createElement("button");
        confirmButton.className = baseClass + "--button confirm";
        confirmButton.innerText = this.settings.confirmButtonText;

        var cancelButton = document.createElement("button");
        cancelButton.className = baseClass + "--button cancel";
        cancelButton.innerText = this.settings.cancelButtonText;

        var buttonHolder = document.createElement("div");
        buttonHolder.className = baseClass + "--button-holder";
        buttonHolder.appendChild(confirmButton);
        buttonHolder.appendChild(cancelButton);

        var elements = [title, message, buttonHolder];
        elements.reverse();

        for (var i = elements.length - 1; i >= 0; i--) {
            messageWrapper.appendChild(elements[i]);
        }

        obj.parentNode.appendChild(messageWrapper);
        this.uievents(messageWrapper);

        window.setTimeout(function(){
            messageWrapper.className += ' active';
        }, this.settings.activeDelay);
    }
};

/**
 * Destory / Delete the warning messages
 */
BatteryCallback.prototype.destroyMessage = function(){

    var messages = document.querySelectorAll('.batcallback');

    for (var i = 0; i < messages.length; ++i) {
        messages[i].parentNode.removeChild(messages[i]);
    }
};

/**
 * Binding UI Events
 * @param  {object} obj [A node object to better identify the buttons required for binding using 'querySelectorAll']
 */
BatteryCallback.prototype.uievents = function( obj ){

    var _this = this,
        confirmButton = obj.querySelectorAll('.confirm'),
        cancelButton = obj.querySelectorAll('.cancel');

    for (var i = 0; i < confirmButton.length; ++i) {

        confirmButton[i].addEventListener('click', function(){

            _this.setChoiceStored( 'confirm', _this );
            _this.executeCallback( _this );
        }, false);
    }

    for (var c = 0; c < cancelButton.length; ++c) {

        cancelButton[c].addEventListener('click', function(){

            _this.setChoiceStored( 'cancel', _this );
            _this.destroyMessage();
        }, false);
    }
};

/**
 * GET choice stored
 * @return {string} [Returns stored choice made by the user in a previous warning message e.g. 'confirm' or 'cancel']
 */
BatteryCallback.prototype.getChoiceStored = function(){

    if(this.settings.storeInput){
        return localStorage.getItem('batteryCheckChoice');
    }
};

/**
 * SET choice stored
 * @param  {string} userChoice ['confirm' or 'cancel' - this is saved in localStorage]
 * @param  {object} obj        ['this' changes on event so plugin scope needed to be passed in]
 */
BatteryCallback.prototype.setChoiceStored = function( userChoice, obj ){

    if(obj.settings.storeInput){
        window.localStorage.setItem('batteryCheckChoice', userChoice);
    }
};

/**
 * CLEAR choice stored
 */
BatteryCallback.prototype.clearChoiceStored = function(){

        window.localStorage.clear('batteryCheckChoice');
};

/**
 * Execute the callback
 * @param  {object} obj ['this' changes on event so plugin scope needed to be passed in]
 */
BatteryCallback.prototype.executeCallback = function( obj ){

    if(obj){
        obj.callback();
        obj.destroyMessage();
    }else{
        this.callback();
        this.destroyMessage();
    }
};
