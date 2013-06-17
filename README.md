Battery Callback
================

Trigger a notification based on the users battery level.

## Options
- "batteryLevel" (Integer): Battery level to trigger alert
- "title" (String): Text within the message
- "message" (String): Text within the message
- "useDefaultMsg" (Bool): Usage of the default confirm/alert message (true = native message)
- "storeChoice" (String): Retain choice by user when they choose accept or cancel (choices = "confirm", "cancel", "all")

## Process
- Gather battery level
- When functionality invoked;
 - Check to see if user has chosen to either confirm or cancel before (and run based on previously selected option - and check against the option "storeChoice" e.g. if "storeChoice" = "confirm" then only check if the user has selected "confirm" before)
 - If battery is lower than option "batteryLevel" either - append HTML and show message or open alert. This will include the constructing of event listeners on the confirm or cancel button
 - If the battery is equal or higher than "batteryLevel" then run the callback
