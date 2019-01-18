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

var appman = require ('../../src/main/appman');

describe("Application Manager Wrapper", function () {
        var app = window.oipfObjectFactory.createApplicationManagerObject().getOwnerApplication(document);
    
        it("Exists", function () {
            expect(appman).toBeDefined();
        });

        it("Show/Hide", function () {
            spyOn(app, 'show');
            spyOn(app, 'hide');
            appman.show();
            appman.hide();
            expect(app.show).toHaveBeenCalled();
            expect(app.hide).toHaveBeenCalled();
        });

        it("request keys", function(){
            var ks = app.privateData.keyset;
			spyOn(ks, 'setValue').and.callThrough();
            appman.addKey(appman.RED);
            appman.addKey(appman.NAVIGATION);
            expect(ks.setValue).toHaveBeenCalledWith(0x1);
            expect(ks.setValue).toHaveBeenCalledWith(0x11);
        });
    
        it("release keys", function(){
            var ks = app.privateData.keyset;
			spyOn(ks, 'setValue').and.callThrough();
            appman.addKey(appman.ALL);
            expect(ks.setValue).toHaveBeenCalledWith(0x13F);
            appman.remKey(appman.YELLOW + appman.GREEN);
            expect(ks.setValue).toHaveBeenCalledWith(0x139);
            appman.remKey(appman.COLOR);
            expect(ks.setValue).toHaveBeenCalledWith(0x130);
            appman.remKey(appman.NAVIGATION);
            expect(ks.setValue).toHaveBeenCalledWith(0x120);
            appman.remKey(appman.NUMERIC);
            expect(ks.setValue).toHaveBeenCalledWith(0x20);
            appman.remKey(appman.NAVIGATION + appman.VCR);
            expect(ks.setValue).toHaveBeenCalledWith(0x0);
        });

        it("key constants have correct values", function(){
            expect(appman.RED).toEqual(0x1);
            expect(appman.GREEN).toEqual(0x2);
            expect(appman.YELLOW).toEqual(0x4);
            expect(appman.BLUE).toEqual(0x8);
            expect(appman.COLOR).toEqual(appman.RED+appman.GREEN+appman.YELLOW+appman.BLUE);
            expect(appman.NAVIGATION).toEqual(0x10);
            expect(appman.VCR).toEqual(0x20);
            expect(appman.NUMERIC).toEqual(0x100);
            expect(appman.ALL).toEqual(appman.COLOR+appman.NAVIGATION+appman.VCR+appman.NUMERIC);
        });
    });
     