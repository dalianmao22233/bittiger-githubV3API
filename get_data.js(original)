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

    var geocoder = NodeGeocoder(options);

// Or using Promise
    var someArray = [];
    for(var k = 0; k < uniquelist.length; k++) {
        someArray.push(k);
    }
    Promise.all(
        someArray.map(function(index) {
            return new Promise(function(fulfill, rejection) {
                geocoder.geocode(uniquelist[index])
                    .then(function (res, status) {
                        // console.log(res[0].formattedAddress);
                        if(res[0] != null)
                            result_list.push([Number(res[0].latitude) + "," + Number(res[0].longitude)]);

                        else
                            result_list.push(0,0,0.5);

                        fulfill(result_list);


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
            console.log("result: " + result_list);



        })


});
