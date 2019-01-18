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

/*
 * Query string parser
 * 
 * Provides key value pair based query strings. The query (search) string will be parsed upon module loading.
 * 
 * Usage: 
 * var qs = require('hbbtv-lib/tools/query_string');
 * var value = qs.get(key);
 */

var qs_map = {};

var x = window.location.search;

if (x && x.length > 0) {
    x = x.substr(1).split("&");
    for (i in x) {
        var y = x[i].split("=");
        if (y && y.length == 2) {
            qs_map[y[0]] = y[1];
        }
    }
}

module.exports = {
    get : function (key, def) {
        if (key in qs_map) {
            return qs_map[key];
        }
        return def;
    }
};