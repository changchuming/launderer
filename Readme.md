# Launderer

# Main Idea
* There will be a GUI on a Raspberry Pi with a touchscreen and an attached NFC reader.
* User can tap one of four buttons to set timer for machines. If matric card is placed on NFC reader during tap, user will be identified by the UID of the matric card. Else, user be anonymous.
* If system does not recognize the UID of the matric card, it will prompt user to input nickname and phone number using touchscreen. This will then be stored in our backend database.
* When timer is up, notification will be sent to user.
* Other users can check frontend webpage for *last used by: nickname* and *time left*.

# Packages
1. Backend Server
 * Node.js
 * Express.js
 * Pug template machine
 * MongoDB
2. Frontend
 * Vue.js
 * Bower
 * Bootstrap
3. Application
 * Vue.js
 * Bower
 * Bootstrap
 * nfc-tools to read nfc cards

# Setting up backend server
1. Install node.js
2. Do `npm install` to install node dependencies
3. Use `npm install bower -g` to install bower
4. Do `bower install` to install frontend frameworks
5. Do `npm install gulp -g` to install gulp
6. Run `gulp` to include frontend libraries
7. Pages are included in `/views/` folder
8. Routes are in `/routes` folder
9. Source files are located in `/src` and is compiled to `/public`