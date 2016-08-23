/**
 * Created by dalianmao22233 on 8/22/16.
 */
const NodeGeocoder = require('node-geocoder');
const Firebase = require('firebase');
const Promise = require('bluebird');

var fs = require('fs');
var $ = jQuery = require('jQuery');
require('../src/jquery.csv.js');

var list = [];
// var list = {};
var map = {};
var short_name_list = {};

var options = {
    provider: 'google',
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyAawoGdmmjttUNMte8w70zRf-eu_3X0Znc',
    formatter: null         // 'gpx', 'string', ...
};

var ref_id_set = new Firebase('https://firstproject-a737a.firebaseio.com/map-location-count');
var ref_state_set = new Firebase('https://firstproject-a737a.firebaseio.com/final-state-count');
var ref_short_name_set = new Firebase('https://firstproject-a737a.firebaseio.com/location_2D_state');
ref_short_name_set.on('value', function (snapshot) {
    var data = snapshot.val();
    var list = [];
    for (var i in data) {
        // console.log(data[i]);
        list.push(data[i][2]);
    }
    var counts = {};
    list.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
    });
    // console.log(counts["UT"]);
    ref_id_set.on('value', function (snapshot) {

        var data = snapshot.val();
        for (var i in data) {
            list.push(data[i]['name']);
            map[data[i]['name']] = i;
        }
        // console.log(list);
        // console.log(map);

        var geocoder = NodeGeocoder(options);

        var someArray = [];
        for (var k = 0; k < list.length; k++) {
            someArray.push(k);
        }
        Promise.all(
            someArray.map(function (index) {
                return new Promise(function (fulfill, rejection) {
                    var final_location = list[index];
                    geocoder.geocode(final_location)
                        .then(function (res, status) {
                            // console.log(counts);
                            if (res[0] != null) {
                                // console.log(res[0]);
                                if (res[0].hasOwnProperty('administrativeLevels')) {
                                    if (res[0].administrativeLevels != null)
                                        if (res[0].administrativeLevels.hasOwnProperty("level1short"))
                                        // short_name_list.push([res[0].administrativeLevels.level1short, map[list[index]]]);
                                            short_name_list[map[list[index]]] = res[0].administrativeLevels.level1short;
                                        else {
                                            // console.log('res[0]:' + res[0]);
                                            short_name_list[map[list[index]]] = "AR";

                                            // short_name_list.push(["AR", map[list[index]]]);
                                        }
                                    else {
                                        // console.log('res[0]:' +
                                        short_name_list[map[list[index]]] = "AR";

                                        // short_name_list.push(["AR", map[list[index]]]);
                                    }
                                }
                                else {
                                    short_name_list[map[list[index]]] = "AR";

                                }
                            }

                            else {
                                short_name_list[map[list[index]]] = "AR";

                            }
                            ref_state_set.child(map[list[index]].toString()).child("state").set(short_name_list[map[list[index]]]);
                            ref_state_set.child(map[list[index]].toString()).child("name").set(list[index]);
                            console.log(counts[short_name_list[map[list[index]]]]);
                            if(counts[short_name_list[map[list[index]]]] == null)
                                ref_state_set.child(map[list[index]].toString()).child("count").set("0");
                            else
                                ref_state_set.child(map[list[index]].toString()).child("count").set(counts[short_name_list[map[list[index]]]]);
                            fulfill(short_name_list);


                        })
                        .catch(function (err) {
                            rejection(err);
                        });
                })
            }))

            .catch(function (err) {
                console.log(err);
            })

            .then(function () {



            })


    });


});
