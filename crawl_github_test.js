const Account = require('./configs/account');
const HolyShit = require('./helpers/top_coders');
const Utils = require('./helpers/my_utils');
const Repo = require('./crawl_repos');
const Change = require('./crawl_changes');
const cont = require('./crawl_contributors');
const Request = require('request');
const Promise = require('bluebird');
const Firebase = require('firebase');

var ref = new Firebase(Account.firebase_url);
var repo_list_ref = ref.child("repo_list"); //repo list
var current_time_ref = ref.child("current_time");//current time


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
        'repository_list' : []
    }
    var current_time = Utils.get_current_timestamp();
    var funcs = Promise.resolve(Utils.make_range(1, 10).map((n) => makeRequest(make_option(n), 'repository_list')));
    current_time_ref.set(current_time);
    
    funcs
        .mapSeries(iterator)
        .catch(function (err) {
            console.log(err);
        })
        .finally(function () {
            var repos_list = [];
            
            //crawl BitTiger repos
            var repository_list = github_info['repository_list'];
            for (var i = 0; i < repository_list.length; ++i){
                repos_list.push(Repo.crawl_repos(repository_list[i]));

            }
            Promise.all(repos_list)
                .catch(function (err) {
                    console.log(err);
                })
                .then(function (repo_event) {
                    for (var i = 0; i < repo_event.length; i++){
                        var repo_full_name = repo_event[i].repo_name;
                        console.log(repo_full_name);
                    }
                    var top25_repo = repo_event.slice(0,25);
                    var repo_events_update = repo_list_ref.child('repo').set(top25_repo);
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
                        // console.log('fulfill body in crawl_github.js');
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
