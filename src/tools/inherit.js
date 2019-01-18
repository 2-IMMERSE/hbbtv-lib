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

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

/**
 * Copies prototype from B to A, i.e. A extends/inherits B.
 * 
 * @param {*} A child "class"
 * @param {*} B parent "class"
 * 
 * @ignore
 */
function inherit (A, B) {
    if (typeof (A.prototype) == "object" && typeof (B.prototype) == "object") {
        A.prototype = Object.create(B.prototype);
    }
}

module.exports = inherit;