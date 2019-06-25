# A library for HbbTV-application developers

[![npm version](https://badge.fury.io/js/hbbtv-lib.svg)](https://badge.fury.io/js/hbbtv-lib)

**hbbtv-lib** is a collection of modules for common HbbTV functionality

* Application manager to handle the requested keyset, show/hide and app launch
* Companion screen manager
* Sync manager wrapping the HbbTV MediaSynchroniser object

The individual modules are implemented in CommonJS style. This is same way as JavaScript modules
are handled in Node.js runtime. Modules are intended to be used with webpack, which prepares the 
code for execution in HbbTV browser environments.

A version of hbbtv-lib that can be used without specific build tools is on the roadmap.

<img src="https://2immerse.eu/wp-content/uploads/2016/04/2-IMM_150x50.png" align="left"/><em>This project was originally developed as part of the <a href="https://2immerse.eu/">2-IMMERSE</a> project, co-funded by the European Commission’s <a hef="http://ec.europa.eu/programmes/horizon2020/">Horizon 2020</a> Research Programme</em>


## Install
Install via npm:
```
npm install --save hbbtv-lib
```

## Usage

```javascript
var AppMan = require('hbbtv-lib/main/appman');
var CSMan = require('hbbtv-lib/cs/cs_manager');
var SyncManager = require('hbbtv-lib/cs/sync_manager');
var UserAgentParser = require('hbbtv-lib/tools/useragent');
```

Use the application manager to set application visible and request keys from terminal.
```javascript
AppMan.show();
AppMan.addKey(AppMan.COLOR);
AppMan.addKey(AppMan.NAVIGATION);
```

Discover launcher applications. The maximum timeout (1sec defined by the spec) 
can be increased for testing purposes.
```javascript
CSMan.once(CSMan.CS_DISCOVERED, on_discovery_finished);
CSMan.discover_launchers(10000);

function on_discovery_finished (devices) {
	for (x in devices) {
		log(devices[x].friendly_name);
	}
}
```

Launch a webpage with the remote app2app service endpoint added to the URL.
```javascript
CSMan.once(CSMan.CS_LAUNCH_RESPONSE, on_launch_response);
CSMan.launch_html(enum_id, url + "?a2a=" + CSMan.getA2A_remote() + app_endpoint);

function on_launch_response (enum_id, val) {
	log("Launch response from enum_id = " + enum_id + ": " + val);
}
```

Enable inter-device synchronisation with video/broadcast
```javascript

mediaObj = document.getElementById("vbObject");
mediaObj.bindToCurrentChannel();

// wait for presenting state on mediaObj

syncMan = new SyncManager();

syncMan.on(SyncManager.EVT_MS_ERROR, on_ms_error);
syncMan.once(SyncManager.EVT_CII_ENABLED, on_cii_enabled);
syncMan.once(SyncManager.EVT_CII_DISABLED, on_cii_disabled);

syncMan.setMasterMedia(mediaObj, "urn:dvb:css:timeline:temi:1:1");
syncMan.enableCII();

function on_cii_enabled() {
    log("synchronisation with companion can be started.");
}
```

## Documentation
The documentation can be read [here](https://2-immerse.github.io/hbbtv-lib/index.html).

## Build from source and run tests
NOTE: The following requires [Grunt-CLI](https://gruntjs.com/) to be installed globally on your machine.

Build library from source:
```
grunt build
```

Run unit tests (this will build the libraries before running the unit tests):
```
grunt test
```

Build the documentation from JsDoc annotations in source code:
```
grunt doc
```

## License and authors

All code and documentation is licensed by the original author and contributors under the Apache License v2.0:

* [Institut für Rundfunktechnik](http://www.irt.de/)

See [AUTHORS](AUTHORS.md) file for a full list of individuals and organisations that have
contributed to this code.

## Contributing

If you wish to contribute to this project, please get in touch with the [authors](AUTHORS.md).
