const Account = require('./configs/account');
const HolyShit = require('./helpers/top_coders');
const Utils = require('./helpers/my_utils');
const Repo = require('./crawl_repos');
const Cont = require('./crawl_contributors');
const Request = require('request');
const Promise = require('bluebird');
const Firebase = require('firebase');

var ref = new Firebase(Account.firebase_url);
var repo_list_ref = ref.child("repo_list"); //repo list
var current_time_ref = ref.child("current_time");//current time
var cont_list_ref = ref.child("cont_list");//cont_list

//test auth(login process)
var crawl_github_auth = function (production) {

    ref.authWithCustomToken(Account.firebase_secrets, function (error, authData) {
        if (error) {
            console.log("Login Failed!", error);
            terminate_app();
        } else {
            console.log("Login Succeeded!", authData);
            crawl_github(production);
        }
    });
}

var crawl_github = function (production) {

    var github_info = {
        'members_list' : [],
        'repository_list' : [],
        'contributor_list' : []
    }
    var current_time = Utils.get_current_timestamp();
    var funcs = Promise.resolve(Utils.make_range(1, 1).map((n) => makeRequest(make_option(n), 'repository_list')));
    current_time_ref.set(current_time);
    var repos_list = [];
    funcs
        .mapSeries(iterator)
        .catch(function (err) {
            console.log(err);
        })
        .finally(function () {
            var contributor_list = github_info['contributor_list'];
            //crawl BitTiger repos
            var repository_list = github_info['repository_list'];
            for (var i = 0; i < repository_list.length; ++i) {
                repos_list.push(Repo.crawl_repos(repository_list[i]));
            }

            Promise.all(repos_list)
                .catch(function (err) {
                    console.log(err);
                })
                .then(function (repo_event) {

                    // for (var i = 0; i < repo_event.length; i++){
                    //     var repo_each_name = repo_event[i].repo_name;
                    //     var conts_list = [];
                    //     Cont.crawl_contributors(repo_each_name, function(error, body) {
                    //         if (error) {
                    //             console.log(error);
                    //         } else {
                    //             conts_list.push(body);
                    //             cont_list_ref.set(conts_list);
                    //             // repo_event[i]["contributors"] = conts_list;
                    //
                    //         }
                    //     });
                    //
                    // }


                    var slice_repo = repo_event.slice(0,-1);
                    // slice_repo[0]["contributors"] = "yuxin";
                    for (var i = 0; i < slice_repo.length; i++) {
                        var repo_each_name = repo_event[i].repo_name;
                        var conts_list = [];
                        var cont_new_list = [];
                        cont_new_list.push(Cont.crawl_contributors(repo_each_name, function(error, body) {
                            if (error) {
                                console.log(error);
                            } else {
                                conts_list.push(body);
                                // slice_repo[i]["contributors"] = [];
                                // cont_list_ref.set(conts_list);
                                console.log(conts_list);
                                // repo_event[i]["contributors"] = conts_list;

                            }
                        }));
                        Promise.all(cont_new_list)
                            .catch(function(err) {
                                console.log(err);
                            })
                            .then(function(cont_new) {
                                console.log("in promise: " + cont_new);

                            })

                        // slice_repo[i]["contributors"] = cont_new_list;
                        // slice_repo[i]["contributors"] = conts_list;
                    }

                    // console.log(slice_repo[0]);
                    var repo_events_update = repo_list_ref.set(slice_repo);
                })
        })

    function iterator(f) {
        return f()
    }

    function makeRequest(option, key) {

        return function () {
            return new Promise(function (fulfill, reject) {
                Request(option, function (error, reponse, body) {
                    if(error) {
                        reject(error);
                    } else if (body.length == 0) {
                        reject('page empty in crawl_github.js');
                    } else {
                        github_info[key] = github_info[key].concat(body);
                        fulfill(body);
                    }
                })
            });
        };
    }

    function make_option(page_number) {
        return {
            url: 'https://api.github.com/orgs/bittigerInst/repos', //URL to hit
            qs: { // Query string data
                page: page_number
            },
            method: 'GET', // Specify the method
            headers: { // Define headers
                'User-Agent': 'request'
            },
            auth: { // HTTP Authentication
                user: 'dalianmao22233',
                pass: 'Aa1313250!'
            },
            json: true
        };
    }
}
function terminate_app() {
    console.log("Finished!");
}

exports.crawl_github = crawl_github_auth;
