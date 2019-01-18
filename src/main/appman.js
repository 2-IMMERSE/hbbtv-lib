/*
 * Copyright: IRT 2019
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
	
var ks = false;
var app = false;
var val = 0;


/**
 * Look for applications Application and Keyset objects.
 * 
 * Store initial value for keyset.
 * @private
 */
function init () {
	try {
		var appMan = null;
		var objs = document.getElementsByTagName("object");
		for (var i=0; i<objs.length; i++) {
			if (objs.item(i).getAttribute("type") == "application/oipfApplicationManager") {
				appMan = objs.item(i);
				break;
			}
		}
		if (appMan) {
			app = appMan.getOwnerApplication(document);
		} else {
			app = oipfObjectFactory.createApplicationManagerObject().getOwnerApplication(document);
		}
		ks  = app.privateData.keyset;
		val = ks.value;
	} catch (e) {
		app = null;
		ks = null;
	}
}


/**
 * @exports AppMan
 * @class AppMan
 * @hideconstructor
 * 
 * @classdesc
 * Wrapper for the OIPF/HbbTV application manager.
 * 
 * @example <caption>Use the application manager to make the application visible and request keys from the terminal.</caption>
 * var AppMan = require('hbbtv-lib/main/appman');
 * AppMan.show();
 * AppMan.addKey(AppMan.COLOR);
 * AppMan.addKey(AppMan.NAVIGATION);
 */
var AppMan = {};

/** 
 * Key code for the red color button
 * @instance 
 * @constant
 */
AppMan.RED = 0x1;

/** 
 * Key code for the green color button
 * @instance
 * @constant
 */
AppMan.GREEN = 0x2;

/** 
 * Key code for the yellow color button
 * @instance
 * @constant
 */
AppMan.YELLOW = 0x4;

/**
 * Key code for the blue color button
 * @instance
 * @constant
 */
AppMan.BLUE = 0x8;

/**
 * Key code for all color buttons
 * @instance
 * @constant
 */
AppMan.COLOR = 0xF;

/**
 * Key code for the navigation key set (arrow keys and OK button)
 * @instance
 * @constant
 */
AppMan.NAVIGATION = 0x10;

/** 
 * Key code for the play/pause, play, pause and stop buttons
 * @instance
 * @constant
 */
AppMan.VCR = 0x20;

/** 
 * Key code the numeric buttons (0, 1, 2, ... 9)
 * @instance
 * @constant
 */
AppMan.NUMERIC = 0x100;

/** 
 * Key code for no button
 * @instance
 * @constant
 */
AppMan.NONE = 0x0;

/** 
 * Key code for all buttons
 * @instance
 * @constant
 */
AppMan.ALL = 0x13F;


/**
 * Show the browser window.
 * @function
 * @instance
 * 
 * @todo success/error feedback for user
 */
AppMan.show = function () {
	if (app === false) init();
	try {
		app.show();
	} catch (e) {}
}

/**
 * Hide the browser window.
 * @function
 * @instance
 * 
 * @todo success/error feedback for user
 */
AppMan.hide = function () {
	if (app === false) init();
	try {
		app.hide();
	} catch (e) {}
}

/**
 * <p>Add a keyset constant(s) to the requested set of remote control (RC) keys.
 * 
 * <p>RC keys in HbbTV 2 are split into a set that is available all time and a set that is available only after activation of the app.
 * The app is activated when the user presses a key from the first set assuming the application had requested it.
 * 
 * <p>Keys available all time: NAVIGATION, COLOUR.
 * 
 * <p>Keys available after activation: NUMERICAL, VCR.
 * 
 * <p>The keyset always shows which keys are available to the application, i.e. if the requested keyset is larger than the keys that are available, 
 * the resulting keyset contains only a subset of the requested one.
 * 
 * <p>You can use the appman to add all required keys by your application before activation, 
 * however you have to use applyKeyset after your application got activated.
 * 
 * <p>On terminals running HbbTV 1.x RC keys are always available to applications.
 * 
 * <p>Note: Use this function carefully, request only keys you need and release keys with remKey when you don't need a key any longer.
 * @function
 * @instance
 * 
 * @param {number} keyCode
 * @todo success/error feedback for user
 */
AppMan.addKey = function (keyValue) {
	if (ks === false) init();
	try {
		val = ks.value | keyValue;
		ks.setValue (val);
	} catch (e) {
	}
}

/**
 * Removes the value from the requested keyset, i.e. releases RC keys.
 * @function
 * @instance
 * 
 * @param {number} keyCode keys to release, return to control of terminal
 */
AppMan.remKey = function (keyCode) {
	if (ks === false) init();
	val = (ks.value | keyCode) - keyCode;
	// make sure bits are set before removing them
	ks.setValue (val);
}

/**
 * Re-applies a released keyset.
 * @see {@link AppMan.addKey}
 * @function
 * @instance
 * 
 * @todo success/error feedback for user
 */
AppMan.applyKeyset = function () {
	try {
		ks.setValue (val);
	} catch (e) {}
}

/**
 * Creates a new HbbTV application.
 * 
 *   <p>Use dvb: URLs to launch another broadcast-related application
 *   <p>Use https: URLs to launch a broadcast independent application
 * 
 * @function
 * @instance
 * 
 * @param {*} url URL of application to run,
 * @todo success/error feedback for user
 */
AppMan.createApp = function (url) {
	if (app === false) init();
	try {
		/* Create a new application and add it to the application tree. Calling this method does not
			automatically show the newly-created application.
			This call is asynchronous and may return before the new application is fully loaded. An
			ApplicationLoaded event will be targeted at the Application object when the new
			application has fully loaded.
			If the application cannot be created, this method SHALL return null. 
		*/
		return app.createApplication(url, false);
	} catch (e) {}
}

/**
 * Calls destroyApplication.
 * @function
 * @instance
 * 
 * @todo success/error feedback for user
 */
AppMan.killme = function () {
	if (app === false) init();
	try {
		/*
			Terminate the application, detach it from the application tree, and make any resources
			used available to other applications. When an application is terminated, any child
			applications shall also be terminated.
		*/
		app.destroyApplication();
	} catch (e) {
	}
}

/** 
 * An autostart broadcast related application is not activated by default (since 2.0).
 * It does not receive Numeric and VCR events if it is not activated.
 * 
 * It gets activated when it receives a colour or navigation key.
 * @function
 * @instance
 * 
 * @param {function} callback Callback function that is notfied after
 *   the activation listener has been called
 */
AppMan.addActivationListener = function (l) {
	document.addEventListener("keydown", kel, false);
	function kel (e) {
		document.removeEventListener("keydown", kel, false);
		l();
	}
}

/**
 * For broadcast related applications returns the channel that carries the AIT that currently controls 
 * this application or null.
 * 
 * @function
 * @instance
 * 
 * @returns {number} Current channel
 * @todo success/error feedback for user
 */
AppMan.getCurrentChannel = function () {
	if (app === false) init();
	try {
		/*
			For a broadcast-related application, the value of the property contains the channel whose AIT is currently
			controlling the lifecycle of this application. If no channel is being presented, or if the application is not
			broadcast-related, the value of this property shall be null.
		*/
		return app.privateData.currentChannel;
	} catch (e) {
	}
	return null;
}

module.exports = AppMan;