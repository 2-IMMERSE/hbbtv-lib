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

if (typeof window.oipfObjectFactory != "undefined" && typeof window.oipfObjectFactory.createApplicationManagerObject == "undefined") {
    window.oipfObjectFactory.createApplicationManagerObject = (function () {
        //console.log("Create ApplicationManager mock.");
        var KS = {
                value : 0,
                setValue : function (x) {
                    //console.log("KS: " + x);
                    KS.value = x;
                }
            };
        
        function show () {
            console.log("app.show");
        }

        function hide () {
            console.log("app.hide");
        }

        function createApplication(url) {
            console.log("app.createApp: " + url);
        }
        
        var application = {
            privateData : {
                keyset : KS
            },
            show : show,
            hide : hide,
            createApplication : createApplication
        };

        var AppMan = {
            getOwnerApplication : function (doc) {
                //console.log("return application mock");
                return application;
            }
        }
        return function () {
            //console.log("return application manager mock");
            return AppMan;
        };
    })();
}
