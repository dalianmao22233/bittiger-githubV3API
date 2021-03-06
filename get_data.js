const NodeGeocoder = require('node-geocoder');
const Firebase = require('firebase');
const Promise = require('bluebird');

var fs = require("fs");
// var writeStream = fs.createWriteStream("test.txt");

var ref = new Firebase('https://bittiger-ranking.firebaseio.com/user_profile');
var ref_set = new Firebase('https://firstproject-a737a.firebaseio.com/location_conversion_data');
var list = [];
var result_list = [];
var short_name_list = [];
// ref_set.set("test success!");
var options = {
    provider: 'google',
    httpAdapter: 'https', // Default
    // apiKey: 'AIzaSyAcpKWnvsLnzbOZHbhi_r4iGTgnOyuL77I', // for Mapquest, OpenCage, Google Premier
    apiKey: 'AIzaSyD6hh_2ix_whMciOODk-3vUNutCRzu31p4',
    formatter: null         // 'gpx', 'string', ...
};

ref.on('value', function (snapshot) {

    var data = snapshot.val();
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            list.push(data[key].location);
        }
    }
    var uniquelist = list.filter(function (elem, pos) {
        return list.indexOf(elem) == pos;
    })
    for(var i = uniquelist.length - 1; i >= 0; i--) {
        if(uniquelist[i] === "M78") {
            uniquelist.splice(i, 1);
        }
    }
    function randomWithProbability() {
        var notRandomNumbers = uniquelist;
        var idx = Math.floor(Math.random() * notRandomNumbers.length);
        // console.log( notRandomNumbers[idx]);
        return notRandomNumbers[idx];
    }
    var geocoder = NodeGeocoder(options);

    var someArray = [];
    for(var k = 0; k < list.length; k++) {
        someArray.push(k);
    }
    Promise.all(
        someArray.map(function(index) {
            return new Promise(function(fulfill, rejection) {
                var final_location = list[index];
                if(list[index] == "M78") {
                    final_location = randomWithProbability();
                }
                geocoder.geocode(final_location)
                    .then(function (res, status) {

                        var random = Math.random();

                        var tmp_list = [];
                        if(res[0] != null) {
                            // tmp_list.push("[");
                            // tmp_list.pushNumber(res[0].longitude));
                            // tmp_list.wwpush(Number(res[0].latitude));
                            // tmp_list.push("]");
                            // if(res[0].hasOwnProperty('administrativeLevels')) {
                            //     if (res[0].administrativeLevels != null)
                                    // if(res[0].administrativeLevels.hasOwnProperty("level1short"))
                                        // short_name_list.push(res[0].administrativeLevels.level1short);
                                    // else
                                        // short_name_list.push("AR");
                                // else
                                    // short_name_list.push("AR");
                            result_list.push((Number(res[0].latitude)+random*2) + "," + (Number(res[0].longitude)+random*2) + "," + Number(0.15));

                        }
                            // else
                                // short_name_list.push("AR");
                        // }

                        else {
                            // tmp_list.push(77.2355);
                            // tmp_list.push(28.552);
                            // short_name_list.push("AR");
                            result_list.push("28.552,77.2355,0.15");
                        }
                        // console.log(res[0]);
                        fulfill(result_list, short_name_list);
                        // fulfill(short_name_list);


                    })
                    .catch(function (err) {
                        // result_list.push([77.2355, 28.552]);
                        rejection(err);
                    });
            })
        }))

        .catch (function (err) {
            console.log(err);
        })

        .then (function(){
            // console.log(short_name_list);
            // ref_set.set(result_list);

            // var fs = require('fs');

            // fs.writeFile("globe.txt", result_list, function(err) {
            //     if(err) {
            //         return console.log(err);
            //     }
            //
            //     console.log("The file was saved!");
            // });

            // console.log("result: " + result_list);
        })


});





