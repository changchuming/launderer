# Launderer

# Main Idea
* There will be a GUI on a Raspberry Pi with a touchscreen and an attached NFC reader.
* User can tap one of four buttons to set timer for machines. If card is detected during tap, user will be identified by the system. Else, it'll be anonymous.
* If system identifies first-time user, it will prompt user to input nickname and phone number using touchscreen. This will then be stored in our backend database.
* When timer is up, notification will be sent to user.
* Other users can check frontend webpage for *last used by* and *time left*.

# Stack
1. Backend Server
 * Node.js
 * Express.js
 * Pug template machine
 * Any database
2. Frontend
 * Knockout.js
 * Bootstrap
3. Application
 * Python GUI
 * nfc-tools to read nfc cards

# Setting up backend server
1. Install node.js
2. Do `npm install` to install node dependencies
3. Use `npm install -g bower` to install bower
4. Do `bower install` to install frontend frameworks
5. Pages are included in `/views/` folder
6. Routes are in `/routes` folder