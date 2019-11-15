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

/**
 * Utility to parse HbbTV-compliant user-agent strings.
 * 
 * @module HbbTVUserAgentParser
 * 
 * @example
 * var userAgentParser = require("hbbtv-lib/tools/HbbTVUserAgentParser");
 * var userAgent = HbbTVUserAgentParser('User-Agent: HbbTV/1.2.1 (+PVR+DL; Sonic; 40VX700WDR; 1.32.455; 2.002; test reserved) BKit/445.27.1');
 */

/**
 * Object representing the version of the HbbTV specification.
 *
 * @typedef {object} HbbTVVersion
 * @property {number} major
 * @property {number} minor
 * @property {number} micro
 */

/**
 * Object with individual fields of an HbbTV user agent string.
 *
 * Requirements for certain fields are defined in HbbTV 2 onwards, see section 7.3.2.4.
 * familyName is not included in HbbTV versions before 2.0.
 *
 * 'The "vendorName", "softwareVersion", "familyName" combination, along with "hardwareVersion" where
 *   included, shall differ between terminals with significantly different implementations or performance.'
 *
 * @typedef {object} HbbTVUserAgent
 * @property {string} str a string with the HbbTV portion of the user agent string
 * @property {HbbTVVersion} version the version of the HbbTV specification the device thinks it complies to (due to ETSI rules, usually only differs in the minor part)
 * @property {Array<string>} options one or multiple HbbTV capability strings, see clause 10.2.4, e.g. DRM
 * @property {string} vendor shall reflect the consumer-facing make / brand of the terminal
 * @property {string} model should be representative of the consumer-facing model name to allow log messages to be matched up with user reported problems
 * @property {string} swVersion software version
 * @property {string} hwVersion optional hardware version
 * @property {string} familyName shall have the semantics defined in clause 7.3.3.2 of the OIPF DAE specification [1]
 *  but shall additionally be chosen so as to be globally unique. This shall be achieved either by prefixing with a
 *  reverse domain name of the organisation allocating the remaining portion of the familyName, or by using a
 *  version 4 UUID as the familyName, formatted as a simple string (i.e. without any urn:uuid prefix)
 * @property {string} reserved for future extensions
 */

/**
 * Parses an HbbTV compliant user agent string into its individual fields.
 * 
 * @param {string} userAgentString user agent string of an HbbTV TV. Applications can try to retrieve it from the navigator object, which is mandatory since 2.0,
 *   or via an HTTP request.
 *
 * @returns {HbbTVUserAgent} an HbbTVUserAgent or null if ua does not include an HbbTV compliant user agent string.
 */
module.exports = function (ua) {
    var version = null;
    var fields = null;
    var str = null;
    try {
        if (!ua) {
            ua = navigator.userAgent;
        }
        var reg = /.*(HbbTV\/(\d\.\d\.\d)\s+\(([^\)]*)\)).*/g;
        var match = reg.exec(ua);
        str = match[1];
        version = match[2].split('.');
        fields = match[3].split(';');

        fields[0] = fields[0].trim();
        if (fields[0].length > 0)
            fields[0] = fields[0].substring(1);

        if (fields.length >= 6)
            return {
                str: str,
                version: {
                    major: parseInt(version[0]),
                    minor: parseInt(version[1]),
                    micro: parseInt(version[2])
                },
                options: fields[0].length > 0 ? fields[0].split("+") : null,
                vendor: fields[1],
                model: fields[2],
                swVersion: fields[3],
                hwVersion: fields[4],
                familyName: fields.length == 7 ? fields[5] : null,
                reserved: fields[fields.length - 1]
            };
    } catch (e) {
    }
    return null;
};
