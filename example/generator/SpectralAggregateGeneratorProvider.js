/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2021, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

define([

], function (

) {

    function SpectralAggregateGeneratorProvider() {

    }

    function pointForTimestamp(timestamp, count, name) {
        return {
            name: name,
            utc: String(Math.floor(timestamp / count) * count),
            ch1: String(Math.floor(timestamp / count) % 1),
            ch2: String(Math.floor(timestamp / count) % 2),
            ch3: String(Math.floor(timestamp / count) % 3),
            ch4: String(Math.floor(timestamp / count) % 4),
            ch5: String(Math.floor(timestamp / count) % 5)
        };
    }

    SpectralAggregateGeneratorProvider.prototype.supportsSubscribe = function (domainObject) {
        return domainObject.type === 'example.spectral-aggregate-generator';
    };

    SpectralAggregateGeneratorProvider.prototype.subscribe = function (domainObject, callback) {
        var count = 5000;

        var interval = setInterval(function () {
            var now = Date.now();
            var datum = pointForTimestamp(now, count, domainObject.name);
            callback(datum);
        }, count);

        return function () {
            clearInterval(interval);
        };
    };

    SpectralAggregateGeneratorProvider.prototype.supportsRequest = function (domainObject, options) {
        return domainObject.type === 'example.spectral-aggregate-generator';
    };

    SpectralAggregateGeneratorProvider.prototype.request = function (domainObject, options) {
        var start = options.start;
        var end = Math.min(Date.now(), options.end); // no future values
        var count = 5000;
        if (options.strategy === 'latest' || options.size === 1) {
            start = end;
        }

        var data = [];
        while (start <= end && data.length < 5000) {
            data.push(pointForTimestamp(start, count, domainObject.name));
            start += count;
        }

        return Promise.resolve(data);
    };

    return SpectralAggregateGeneratorProvider;

});
