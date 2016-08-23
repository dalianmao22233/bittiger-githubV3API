const NodeGeocoder = require('node-geocoder');
const Firebase = require('firebase');
const Promise = require('bluebird');

var fs = require("fs");
// var writeStream = fs.createWriteStream("test.txt");

var ref = new Firebase('https://bittiger-ranking.firebaseio.com/user_profile');
var ref_set = new Firebase('https://firstproject-a737a.firebaseio.com/location_2D_state');

var list = [];
var result_list = [];

var options = {
    provider: 'google',
    httpAdapter: 'https', // Default
    // apiKey: 'AIzaSyAcpKWnvsLnzbOZHbhi_r4iGTgnOyuL77I', // for Mapquest, OpenCage, Google Premier
    // apiKey: 'AIzaSyD6hh_2ix_whMciOODk-3vUNutCRzu31p4',
    // apiKey: 'AIzaSyBlr4Lgj2ZnGJLHlQBe9TofUi5zbv1ixSE',
    // apiKey: 'AIzaSyDZfvsC7DGR1C7dwfkQxEpyum5TXr2Ux8M',
    // apiKey: 'AIzaSyD-sPD-G6IIiMjvZH2wh0hoasu_dvzC1vg',
    // apiKey: 'AIzaSyASbcsUDwqbUu7q3_BLhSbF32x63dIGcIk',
    // apiKey: 'AIzaSyBGrOvEPRH4OI1lknxEeZczy8FaMAHbMLk',
    apiKey: 'AIzaSyCt7tVsjhlpiqiU_tTnX_24g6xISSqfOjQ',
    formatter: null         // 'gpx', 'string', ...
};

ref.on('value', function (snapshot) {

    var data = snapshot.val();
    var count = 0;
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            list.push(data[key].location);

            if(data[key].location == "M78") count += 1;
        }
    }
    console.log("list.length: " + list.length);

    var uniquelist = list.filter(function (elem, pos) {
        return list.indexOf(elem) == pos;
    })


    // var list_for_after = list;
    for(var i = uniquelist.length - 1; i >= 0; i--) {
        if(uniquelist[i] === "M78") {
            uniquelist.splice(i, 1);
        }
    }



    var geocoder = NodeGeocoder(options);

// Or using Promise
    var someArray = [];
    for(var k = 0; k < list.length; k++) {
        someArray.push(k);
    }
    function randomWithProbability() {
        var notRandomNumbers = uniquelist;
        var idx = Math.floor(Math.random() * notRandomNumbers.length);
        // console.log( notRandomNumbers[idx]);
        return notRandomNumbers[idx];
    }
    Promise.all(
        someArray.map(function(index) {
            return new Promise(function(fulfill, rejection) {
                var final_location = list[index];
                if(list[index] == "M78") {
                    final_location = randomWithProbability();
                }
                // var setAPI = setInterval(function () {
                // console.log("step into setAPI");
                geocoder.geocode(final_location)

                    .then(function (res, status) {

                        if (res[0] != null) {

                            // tmp_list.push("[");
                            // tmp_list.pushNumber(res[0].longitude));
                            // tmp_list.push(Number(res[0].latitude));
                            // tmp_list.push("]");
                            // console.log("res[0]: " + JSON.stringify(res[0]));
                            var random = Math.random();
                            if(res[0].hasOwnProperty('administrativeLevels')) {
                                if (res[0].administrativeLevels != null)
                                    if(res[0].administrativeLevels.hasOwnProperty("level1short"))
                                        // short_name_list.push(res[0].administrativeLevels.level1short);
                                        result_list.push([ Number(res[0].longitude + random * 2), Number(res[0].latitude + random), res[0].administrativeLevels.level1short ]);

                                    else
                                        result_list.push([ Number(res[0].longitude + random * 2), Number(res[0].latitude + random), "AR"]);
                                else
                                    // short_name_list.push("AR");
                                    result_list.push([ Number(res[0].longitude + random * 2), Number(res[0].latitude + random), "AR"]);

                            }
                            else
                                result_list.push([ Number(res[0].longitude + random * 2), Number(res[0].latitude + random), res[0].administrativeLevels.level1short ]);
                        }

                        else {
                            result_list.push([77.2355, 28.552, "AR"]);
                        }


                        fulfill(result_list);

                    })
                    .catch(function (err) {
                        rejection(err);
                    });
                // }, 100);
                // geocoder.geocode(final_location)
                //
                //     .then(function (res, status) {
                //         if(status == "OK") {
                //             if (res[0] != null) {
                //                 // tmp_list.push("[");
                //                 // tmp_list.pushNumber(res[0].longitude));
                //                 // tmp_list.push(Number(res[0].latitude));
                //                 // tmp_list.push("]");
                //                 var random = Math.random();
                //                 result_list.push("[" + (res[0].longitude + random * 2) + "," + (res[0].latitude + random) + "]");
                //             }
                //
                //             else {
                //                 result_list.push("[77.2355, 28.552]");
                //             }
                //         }
                //         else if(status == "OVER_QUERY_LIMIT") {
                //             console.log("over query listmt");
                //         }
                //         fulfill(result_list);
                //
                //     })
                //     .catch(function (err) {
                //         rejection(err);
                //     });
            })
        }))

        .catch (function (err) {
            console.log(err);
        })

        .then (function(){

            // var fs = require('fs');
            // fs.writeFile("globe2.txt", result_list, function(err) {
            //     if(err) {
            //         return console.log(err);
            //     }
            //
            //     console.log("The file was saved!");
            // });

            ref_set.set(result_list);
            // console.log("result: " + result_list);
        })


});