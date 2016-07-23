const NodeGeocoder = require('node-geocoder');
const Firebase = require('firebase');
const Promise = require('bluebird');

var fs = require("fs");
// var writeStream = fs.createWriteStream("test.txt");

var ref = new Firebase('https://bittiger-ranking.firebaseio.com/user_profile');
var list = [];
var result_list = [];

var options = {
    provider: 'google',
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyAcpKWnvsLnzbOZHbhi_r4iGTgnOyuL77I', // for Mapquest, OpenCage, Google Premier
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

    var geocoder = NodeGeocoder(options);

// Or using Promise
    var someArray = [];
    for(var k = 0; k < list.length; k++) {
        someArray.push(k);
    }
    Promise.all(
        someArray.map(function(index) {
            geocoder.geocode(list[index])
                .then(function (res, status) {
                    result_list.push(Number(res[0].latitude) + "," + Number(res[0].longitude) + "," + Number(0.2));
                    // console.log(result_list);
                    Promise.all(fs.writeFile("globe", result_list , function(err) {
                        if(err) {
                            return console.log(err);
                        }

                        console.log("The file was saved!");
                    }))
                        .catch(function (err) {
                            console.log(err);
                        })

                })
                .catch(function (err) {
                    result_list.push("0,0,0.5");
                });
            }))

            .catch (function (err) {
                console.log(err);
            })

            .then (function(){
                // console.log("result: " + result_list);


                // fs.writeFile("test.txt", result_list , function(err) {
                //     if(err) {
                //         return console.log(err);
                //     }
                //
                //     console.log("The file was saved!");
                // });
            })


});
