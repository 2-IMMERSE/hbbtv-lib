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

var fs = require("fs");
var path = require("path");

const FOLDERS_WITH_DIST_MODULES = ["./src/cs", "./src/main", "./src/tools"];
const DIST_MODULES_FOLDER = "./dist/modules";

Array.prototype.flatten = function () {
    return Array.prototype.concat.apply([], this);
};

function find(dirs, pattern) {
    dirs = [].concat(dirs);
    pattern = pattern || /.*/;

    function filterElements(list, elem) {
        if (!fs.statSync(elem).isDirectory()) {
            if (pattern.test(elem)) {
                list = list.concat(elem);
            }

            return list;
        }

        // Tail recursion
        return list.concat(find(elem, pattern));
    }

    return dirs
        .map(dir => fs.readdirSync(dir).map(elem => path.join(dir, elem)))
        .flatten()
        .reduce(filterElements, []);
}

function libraryName(filepath) {
    const subDir = path.dirname(filepath);
    const fn = path.basename(filepath, path.extname(filepath));
    return ["hbbtvLib"].concat(subDir.split(path.sep)).concat(fn);
}

module.exports = function (grunt) {
    grunt.initConfig({

        jsdoc: {
            dist: {
                src: ["README.md", "src/**/*.js"],
                options: {
                    destination: "docs"
                }
            }
        },

        clean: {
            dist: "dist",
            build: "build",
            doc: "docs"
        },

        webpack: {
            dist: find(FOLDERS_WITH_DIST_MODULES, /\.js/).map(file => ({
                entry: file,
                output: {
                    path: path.resolve(DIST_MODULES_FOLDER, path.dirname(file).replace("src/", "")),
                    filename: path.basename(file),
                    library: libraryName(file),
                    libraryTarget: "umd"
                },
                resolve: {
                    modules: [path.resolve(".")]
                }
            })),

            specs: {
                entry: "./tests/main.js",
                output: {
                    path: path.resolve("build/tests/"),
                    filename: "specs.js"
                },
                resolve: {
                    modules: [path.resolve(".")]
                }
            },

            mocks: {
                entry: "./tests/mocks/oipf-object-factory.mock.js",
                output: {
                    path: path.resolve("build/mocks/"),
                    filename: "mocks.js"
                }
            }
        },

        jasmine: {
            tests: {
                src: ["./build/tests/mocks.js"],
                options: {
                    specs: "build/tests/specs.js",
                    outfile: "build/tests/_specRunner.html",
                    summary: true,
                    keepRunner: true
                }
            }
        },

        copy: {
            srcdirs: {
                files: [
                    { expand: true, cwd: "src", src: ['**/*'], dest: './'}
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-webpack");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.registerTask("default", ["build"]);
    grunt.registerTask("build", ["clean:dist", "clean:build", "webpack"]);
    grunt.registerTask("test", ["build", "jasmine"]);
    grunt.registerTask("doc", ["clean:doc", "jsdoc"]);
    grunt.registerTask("copy_src_dirs_to_root", ["copy:srcdirs"]); // This is for backwrd compatibility
};
