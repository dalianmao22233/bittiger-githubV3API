/**
 * Created by dalianmao22233 on 8/21/16.
 */
const Firebase = require('firebase');
var ref_count_set = new Firebase('https://firstproject-a737a.firebaseio.com/map-location-count');
ref_count_set.on('value', function (snapshot) {
    var data = snapshot.val();
    // for (var key in data) {
    // for(var i = 1 ;i <data.length; i++){
    //     var tmp = [];
    //     // tmp.push(data[i].id, data[i].name, data[i].count);
    //     // ref_set.child(i.toString()).child('count').update("222");
    //     // ref_set.update({ i: { name: data[i].name, id: data[i].id, count: "22222" }});
    //     // console.log(tmp);
    // }

    // ref_count_set.child("529").child('count').set("@222222");
});


var ref_short_name_set = new Firebase('https://firstproject-a737a.firebaseio.com/location_2D_state');
ref_short_name_set.on('value', function (snapshot) {
    var data = snapshot.val();
    var list = [];
    for (var i in data) {
        // console.log(data[i]);
        list.push(data[i][2]);
    }
    var counts = {};
    list.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    console.log(counts["UT"]);
})
