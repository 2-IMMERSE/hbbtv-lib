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

var Emitter = require('events').EventEmitter;
var inherit = require('../tools/inherit');

/**
 * @external EventEmitter
 * @see https://nodejs.org/api/events.html
 */

/**
 * The CII endpoint of the HbbTV terminal has been disabled.
 * @event SyncManager#EVT_CII_DISABLED
 */

/**
 * The CII endpoint of the HbbTV terminal has been enabled.
 * @event SyncManager#EVT_CII_ENABLED
 */

/**
 * An error occured 
 * @event SyncManager#EVT_ERROR
 * @param {string} message A textual description of what happened
 */

/**
 * An error occured 
 * @event SyncManager#EVT_MS_ERROR
 * @param {string} message A textual description of what happened
 */



/**
 * @exports SyncManager
 * @class SyncManager
 * 
 * @classdesc 
 * Simplifies the use of the Media Synchroniser Object API of HbbTV 2.0
 * 
 * <p>SyncManager may fire the following events:
 * <ul>
 *   <li>[EVT_CII_DISABLED]{@link SyncManager#event:EVT_CII_DISABLED}</li>
 *   <li>[EVT_CII_ENABLED]{@link SyncManager#event:EVT_CII_ENABLED}</li>
 *   <li>[EVT_ERROR]{@link SyncManager#event:EVT_ERROR}</li>
 *   <li>[EVT_MS_ERROR]{@link SyncManager#event:EVT_MS_ERROR}</li>
 * </ul>
 * 
 * @example <caption>Enable inter-device synchronisation with video/broadcast</caption>
 * var SyncManager  = require('hbbtv-lib/cs/sync_manager');
 * 
 * mediaObj = document.getElementById("vbObject");
 * mediaObj.bindToCurrentChannel();
 * 
 * // wait for presenting state
 * syncMan = new SyncManager();
 * 
 * syncMan.on(SyncManager.EVT_MS_ERROR, on_ms_error);
 * syncMan.once(SyncManager.EVT_CII_ENABLED, on_cii_enabled);
 * syncMan.once(SyncManager.EVT_CII_DISABLED, on_cii_disabled);
 * 
 * syncMan.setMasterMedia(mediaObj, "urn:dvb:css:timeline:temi:1:1");
 * syncMan.enableCII();
 * 
 * function on_cii_enabled() {
 *     log("synchronisation with companion can be started.");
 * }
 * 
 * @constructor
 * 
 * @augments external:EventEmitter
 */
function SyncManager() {
    try {
        this.syncMan  = oipfObjectFactory.createMediaSynchroniser();
    } catch (e) {
        throw new Error("Can't instantiate Media Synchroniser");
    }
    
    if (!this.syncMan || typeof this.syncMan.initMediaSynchroniser != "function") {
        this.syncMan = null;
        throw new Error("No MediaSynchroniser available");
    }

    var that = this;
    this.syncMan.onerror = this.syncMan.onError = function (/*Number*/lastError, /*Object*/lastErrorSource) {
        var errorDescription = "unknown";
        var isTransient = false;
        switch (lastError) {
        case 1:
            errorDescription =
                "Synchronization is unachievable because the terminal could not delay presentation of " +
                "content (represented by a media object added using the addMediaObject() method) " +
                "sufficiently to synchronize it with the master media. For example: the buffer size for " +
                "media synchronization is not sufficient.";
            isTransient = true;
            break;
        case 2:
            errorDescription =
                "The presentation of media object(that was added using the addMediaObject() method) " +
                "failed. The specific reason is given by the error handler of that media object. ";
            isTransient = true;
            break;

        case 3:
            errorDescription =
                "The media or the selected timeline for the media could not be found or the media " +
                "timeline is no longer present (for media represented by a media object that was added " +
                "using the addMediaObject() method). ";
            isTransient = true;
            break;

        case 4:
            errorDescription =
                " Media object is already associated with the MediaSynchroniser.";
            isTransient = true;
            break;

        case 5:
            errorDescription =
                "The correlation timestamp set for a media object is null or has an invalid format.";
            isTransient = true;
            break;

        case 6:
            errorDescription =
                "Inter-device synchronization with a master terminal failed because of unavailability, e.g. " +
                "an endpoint is not available or disappeared. Applications should rediscover available " +
                "terminals as defined in clause 14.7.2 before continuing with inter-device synchronization. ";
            break;

        case 7:
            errorDescription =
                " The call failed because the MediaSynchroniser is not yet initialized.";
            isTransient = true;
            break;

        case 8:
            errorDescription =
                "The media object referenced as an argument in the call needed to have already been " +
                "added to the MediaSynchroniser using the addMediaObject() method, but it has not " +
                "been. ";
            isTransient = true;
            break;

        case 9:
            errorDescription =
                "The media object (that was passed using the addMediaObject() method) is not in a " +
                "suitable state to participate in synchronization. See clause 9.7.1. ";
            isTransient = true;
            break;

        case 10:
            errorDescription =
                "Inter-device synchronization with a master terminal failed because of a fault in protocol " +
                "interaction, e.g. the master terminal did not provide required messages or data. " +
                "Applications can consider trying again. ";
            break;

        case 11:
            errorDescription =
                "Synchronization is unachievable because the terminal could not present the content " +
                "(represented by a media object added using the addMediaObject() method) " +
                "sufficiently early to synchronize it with the master media. ";
            isTransient = true;
            break;

        case 13:
            errorDescription =
                "The method call failed because the MediaSynchroniser is in a permanent error state or " +
                "because it has been replaced by a newer initialized MediaSynchroniser. ";
            isTransient = true;

            break;

        case 14:
            errorDescription =
                "The presentation of the master media (that was specified as an argument when the " +
                "initMediaSynchroniser() method was called) failed. The specific reason is given by " +
                "the error handler of that media object. ";
                    break;
        case 15:
            errorDescription =
                "The master media object or the selected timeline for a media object could not be found " +
                "or the media timeline is no longer present. ";
            break;

        case 16:
            errorDescription =
                " The master media object is not in a suitable state to participate in synchronization. See " +
                "clause 9.7.1. ";
            break;

        case 17:
            errorDescription =
                " The method call failed because the MediaSynchroniser is already initialized.";
            isTransient = true;
            break;

        case 18:
            errorDescription =
                "The MediaSynchroniser has been replaced by a new MediaSynchroniser being " +
                "initialized. ";
            break;

        case 19:
            errorDescription =
                "The master terminal has reported that the presentationStatus of the master media has " +
                "changed to 'transitioning' (see clause 13.6.3). ";
            isTransient = true;
            break;
        }

        that.log (errorDescription);
        that.emit(SyncManager.EVT_MS_ERROR, lastError, isTransient, errorDescription);
    }

    // this.syncMan.onSyncNowAchievable = function (o) {

    // }
}

inherit(SyncManager, Emitter);

/**
 * Adds the master media to the sync manager, i.e. by calling initMediaSynchroniser. Note: this can be called only once.
 * 
 * @param {media_object} master - either a A/V or V/B object, or an HTML5 media element in a suitable state for media synchronisation.
 * @param {string} tl_spec - a synchronisation timeline specifier.
 * 
 * @returns {boolean} TRUE if method executed without errors, else FALSE.
 * 
 * @fires SyncManager#EVT_ERROR
 */
SyncManager.prototype.setMasterMedia = function (master, tl_spec) {
    if (this.syncMan == null) {
        this.emit(SyncManager.EVT_ERROR, "Internal HbbTV MediaSynchroniser object is null.");
        return false;
    }

    if (this.masterMedia) {
        this.emit(SyncManager.EVT_ERROR, "The media synchroniser already has a master element.");
        return false;
    }

    if (!master) {
        this.emit(SyncManager.EVT_ERROR, "Need to call with a supported HbbTV media element.");
        return false;
    }

    if (!checkMediaState(master)) {
        this.emit(SyncManager.EVT_ERROR, "The media element is not in a sufficient state to get a master in HbbTV media synchronisation.");
        return false;
    }

    if (tl_spec && !checkTLSpec(tl_spec)) {
        this.emit(SyncManager.EVT_ERROR, "The timeline spec is not valid: "+ tl_spec);
        return false;
    } else if (!tl_spec && !(tl_spec = inferTLSpecFromMedia(master)) ) {
        this.emit(SyncManager.EVT_ERROR, "Can't infer timeline spec from given media element.");
        return false;
    }

    this.masterMedia = master;
    this.syncMan.initMediaSynchroniser(master, tl_spec);

    this.log("initMediaSync: " + tl_spec);

    return true;
}


/**
 * Adds the media object to the sync manager, i.e. by calling addMediaObject.
 * 
 * @param {object} mediaObject - either a A/V or V/B object, or an HTML5 media element in a suitable state for media synchronisation.
 * @param {string} tl_spec - a synchronisation timeline specifier.
 * @param {object} cor - an object providing a correlation tuple (support dvbcss_clocks from BBC and MRS formats)
 * 
 * @returns {boolean} TRUE if method executed without errors, else FALSE.
 * 
 * @fires SyncManager#EVT_ERROR
 */
SyncManager.prototype.addMediaObject = function (obj, tl_spec, cor) {
    if (this.syncMan == null) {
        this.emit(SyncManager.EVT_ERROR, "Internal HbbTV MediaSynchroniser object is null.");
        return false;
    }

    if (!this.masterMedia) {
        this.emit(SyncManager.EVT_ERROR, "The media synchroniser is not initialised with a master element.");
        return false;
    }

    if (!obj) {
        this.emit(SyncManager.EVT_ERROR, "Need to call with a supported HbbTV media element.");
        return false;
    }

    if (!checkMediaState(obj)) {
        this.emit(SyncManager.EVT_ERROR, "The media element is not in a sufficient state to participate in HbbTV media synchronisation.");
        return false;
    }

    if (tl_spec && !checkTLSpec(tl_spec)) {
        this.emit(SyncManager.EVT_ERROR, "The timeline spec is not valid: "+ tl_spec);
        return false;
    } else if (!tl_spec && !(tl_spec = inferTLSpecFromMedia(obj)) ) {
        this.emit(SyncManager.EVT_ERROR, "Can't infer timeline spec from given media element.");
        return false;
    }

    cor = translate_correlation_ts(cor);

    this.log("Add media object with " + tl_spec + " : cor " + cor);

    this.syncMan.addMediaObject(obj, tl_spec, cor);

    return true;
}


/**
 * Removes the media object from the sync manager, i.e. by calling removeMediaObject.
 * 
 * @param {video|audio|object} obj - either a A/V or V/B object, or an HTML5 media element in a suitable state for media synchronisation.
 * 
 * @returns {boolean} TRUE if method executed without errors, else FALSE.
 * 
 * @fires SyncManager#EVT_ERROR
 */
SyncManager.prototype.addMediaObject = function (obj) {
    if (this.syncMan == null) {
        this.emit(SyncManager.EVT_ERROR, "Internal HbbTV MediaSynchroniser object is null.");
        return false;
    }

    if (!obj) {
        this.emit(SyncManager.EVT_ERROR, "Need to call with a supported HbbTV media element.");
        return false;
    }

    this.syncMan.removeMediaObject(obj);

    return true;
}

/**
 * Checks whether a timeline specifier is syntactically correct. Supports CT, DASH, PTS and TEMI. 
 * 
 * @param {string} tls the DVB CSS timeline specifier.
 * @returns {boolean} Returns TRUE if correct, else FALSE.
 * @private
 */
function checkTLSpec (tls) {
    // https://regex101.com/r/MVX8is/2/
    var regex = /^urn:dvb:css:timeline:(mpd:period:rel:[0-9]+(:[a-z0-9]+)?|pts|ct|temi:[0-9]+:[0-9]+)$/gm;
    return regex.test(tls);
}

/**
 * Retrieves timeline specifier from mime type or URL of the media element.
 * @param {object} media element
 * @returns {string|boolean} Timeline specifier or FALSE if timeline specifier could not be retrieved. 
 * @private
 */
function inferTLSpecFromMedia(o) {
    if (!o)
        return false;

    if (o.tagName.toLowerCase() == "object") {
        switch (o.getAttribute("type")) {
        case "video/broadcast":
            return "urn:dvb:css:timeline:pts"; // if apps require TEMI need to specify themselve.
        case "video/mp4":
        case "audio/mp4":
            return "urn:dvb:css:timeline:ct";
        case "application/dash+xml":
            return "urn:dvb:css:timeline:mpd:period:rel:1000"; // if apps require specific period or tickrate need to specify this themselve
        }
    } else if (o.tagName.toLowerCase() == "video" || o.tagName.toLowerCase() == "audio") {
        if (o.currentSrc.indexOf(".mp4")>0) {
            return "urn:dvb:css:timeline:ct";
        } else if (o.currentSrc.indexOf(".mpd")>0) {
            return "urn:dvb:css:timeline:mpd:period:rel:1000";
        }
    }
    return false;
}

/**
 * Checks whether an object is in a state to be added to the MediaSynchroniser.
 * 
 * @see HbbTV2.0 chapter 9.7.1
 * 
 * @param {HTMLElement} o
 * 
 * @returns {boolean} TRUE if object can be added to the MediaSynchroniser, else FALSE.
 * @private
 */
function checkMediaState (o) {

    if (!o instanceof HTMLElement) return false;

    if (o.tagName.toLowerCase() == "object") {
        if (o.getAttribute("type") == "video/broadcast") {
            return (o.playState == 2 || o.playState == 1);
        } else {
            return (o.playState >= 1 && o.playState <= 4);
        }

    } else if (o.tagName.toLowerCase() == "video" || o.tagName.toLowerCase() == "audio") {
        return (o.readyState >= o.HAVE_CURRENT_DATA) ;
    }

    return false;
}

/**
 * Enables inter-device synchronisation for MediaSynchroniser that is properly initialized.
 * An event is fired when the service endpoints (e.g. DVB CII) are operational.
 * 
 * @returns {boolean} true if the SyncManager is initialized properly.
 * 
 * @fires SyncManager#EVT_CII_ENABLED
 */
SyncManager.prototype.enableCII = function () {
    if (this.syncMan == null) return false;

    var that = this;
    this.syncMan.enableInterDeviceSync(
        function () {
            that.log("enableCII: inter-device sync enabled.");
            that.emit (SyncManager.EVT_CII_ENABLED);
        }
    );
    this.log("enableCII called enableInterDeviceSync.");
    return true;
}

/**
 * Disables inter-device synchronisation. Closes the terminals CII endpoints.
 * @returns {boolean}
 * 
 * @fires SyncManager#EVT_CII_DISABLED
 */
SyncManager.prototype.disableCII = function () {
    if (this.syncMan == null) return false;

    var that = this;
    this.syncMan.disableInterDeviceSync(function (){
        that.emit(SyncManager.EVT_CII_DISABLED);
    });
}

/**
 * Returns current position on the media timeline
 * @returns {number} Current time
 */
SyncManager.prototype.currentTime = function () {
    if (this.syncMan) {
        return this.syncMan.currentTime;
    }
    return null;
}

/**
 * Stops any active MediaSynchroniser, i.e. disables inter-device sync (aka DVB CSS).
 */
SyncManager.prototype.stop = function () {
    try {
        this.removeAllListeners();
        this.removeAudioTrack(true);
        this.syncMan.removeMediaObject(this.masterMedia);
        this.masterMedia = null;
        this.syncMan = null;
    } catch (e) {
        this.log("stop(): " + e);
    }
}

/**
 * Creates an object that type is CorrelationTimestamp, as there was an ambigouity in the specification,
 * whether the timestamp required to have the type or not.
 *
 * @param {*} m a timestamp on the timeline of the master media.
 * @param {*} o a correlating timestamp on the timeline of the slave/other media used for multistream synchronisation.
 * @private
 */
function CorrelationTimestamp (m,o) {
    this.tlvMaster = m;
    this.tlvOther  = o;
}

CorrelationTimestamp.prototype.toString = function () {
    return "tlvMaster = " + this.tlvMaster + "; tlvOther = " + this.tlvOther;
}

function translate_correlation_ts (cor) {
    var ts = new CorrelationTimestamp(0, 0);
    if (cor) {
        if (cor.point && cor.materialPoint) {
            ts.tlvMaster = parseInt (cor.point);
            ts.tlvOther  = parseInt (cor.materialPoint);
        } else if (cor.parentTime && cor.childTime) {
            ts.tlvMaster = parseInt (cor.parentTime);
            ts.tlvOther  = parseInt (cor.childTime);
        }
    }
    return ts;
}

/**
 * Event name constant for the [EVT_CII_DISABLED]{@link SyncManager#event:EVT_CII_DISABLED} event.
 */
SyncManager.EVT_CII_DISABLED = 0;

/**
 * Event name constant for the [EVT_CII_ENABLED]{@link SyncManager#event:EVT_CII_ENABLED} event.
 */
SyncManager.EVT_CII_ENABLED = 1;

/**
 * Event name constant for the [EVT_ERROR]{@link SyncManager#event:EVT_ERROR} event.
 */
SyncManager.EVT_ERROR = 2;

/**
 * Event name constant for the [EVT_MS_ERROR]{@link SyncManager#event:EVT_MS_ERROR} event.
 */
SyncManager.EVT_MS_ERROR = 3;

module.exports = SyncManager;