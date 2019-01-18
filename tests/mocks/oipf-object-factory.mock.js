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

// create a context containing all the files in the specs folder
// http://webpack.github.io/docs/context.html

var _oipf_objects = require.context("./objects", true, /.*/)

if (typeof window.oipfObjectFactory == "undefined") {
    console.log("Create oipfObjectFactory mock");
    window.oipfObjectFactory = (function () {
        var map = {};
        var factory = {
            isObjectSupported : function (type) {
                return true;
            }
        };

        return factory;
    })();
}

// now require all the files contained in this context

_oipf_objects.keys().forEach(function(key) {
	_oipf_objects(key);
})
