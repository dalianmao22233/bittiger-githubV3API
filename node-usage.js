var fs = require('fs');
var $ = jQuery = require('jQuery');
const Firebase = require('firebase');
require('../src/jquery.csv.js');
var ref_id_set = new Firebase('https://firstproject-a737a.firebaseio.com/map-location-count');

var sample = './data/data.csv';
fs.readFile(sample, 'UTF-8', function(err, csv) {
  $.csv.toArrays(csv, {}, function(err, data) {
    for(var i = 1; i < data.length; i++) {
      ref_id_set.child(data[i][0]).child('name').set(data[i][1]);
      ref_id_set.child(data[i][0]).child('count').set(data[i][2]);

      // ref_set.child(i.toString()).child('id').set(data[i][0]);
      // ref_set.child(i.toString()).child('name').set(data[i][1]);
      // ref_set.child(i.toString()).child('count').set(data[i][2]);
    }
  });
});
