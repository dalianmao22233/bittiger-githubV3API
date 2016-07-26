const NodeGeocoder = require('node-geocoder');
const Firebase = require('firebase');
const Promise = require('bluebird');
const Account = require('./configs/account');
const Request = require('request');
const Utils = require('./helpers/my_utils');


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

   
    var funcs = Promise.resolve(Utils.make_range(1, 10).map((n) => geocoder.geocode(list[n])
            .then(function (res, status) {
                result_list.push([(Number(res[0].longitude) + random * 5) + "," + (Number(res[0].latitude) + random * 5)]);
            })
            .catch(function (err) {
                result_list.push([77.2355, 28.552]);
            })));
    funcs
        .mapSeries(iterator)
        .catch(function (err) {
            console.log(err);
        })
        .finally(function () {

            console.log("result: " + result_list);
        })





});

function iterator(f) {
    return f()
}
