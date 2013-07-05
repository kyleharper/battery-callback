Battery Callback
================

## Battery Callback allows you to trigger JS functionality with the users battery charge in mind.

When conditionally loading content you may want to check if the users battery charge is high enough to handle the content you're embeding. If their battery is low you may want user confirmation before they dive into content that could eat away at their battery and make their device unusable.

### Configuration
* `batteryThreshold` (Int) Battery level to trigger alert (Default: 0.1)
* `msgTitle` (String) Warning message title (Default: "Warning: Your battery is low")
* `message` (String) Warning message text (Default: "It seems that your battery is quite low. Are you sure you wish view this map? If not you could always come back later.")
* `confirmButtonText` (String) Confirm button text (Default: "")
* `cancelButtonText` (String) Cancel button text (Default: "")
* `useNativeAlert` (Bool) Usage of the default browser confirm message (Default: false)
* `storeInput` (Bool) Store the users 'confirmed' choice (Default: true)
* `executeOnFailure` (Bool) If the battery check fails (API may not be supported) then execute the functionality anyways (Default: true)
* `activeDelay` (Int) The time before a 'active' class is added to the message, which helps with animation the message if required (Default: 200)

### Methods

### Example
```javascript
// Construct
var AppBatteryCallback = new BatteryCallback({
    "batteryThreshold": 0.2,
    "msgTitle": "Your battery is low!",
    "message": "It seems that your battery is quite low. Are you sure you wish view this content? If not you could always come back later.",
});

// A example of a function that utilises the battery callback
function yourFunction(){
    // Runs the "checkBattery" method
    AppBatteryCallback.checkBattery(function(){
        // RUN YOUR CODE HERE
    }, this);
}

### Demo

// Just a normal click event listener
document.getElementById('id').addEventListener('click', yourFunction , false);
```
