const Account = require('./configs/account');
const Request = require('request');
const Promise = require('bluebird');
const Utils = require('./helpers/my_utils');

var username = Account.username;
var password = Account.password;
var current_date = Utils.get_current_timestamp();
var last_week_date = Utils.get_last_week_timestamp();
console.log('**** The current date on server is ' + current_date);
console.log('**** The last week date on server is ' + last_week_date);

function crawl_repos(repo) {

    return new Promise(function (fulfill, reject) {
        console.log('repo name is ' + repo.url);
        // var contributors_info = {
        //     'name': contributors_info.name,
        //     'contributions_count': contributors_info.contributions_count
        // }
        var repo_info = {
            'repo_name': repo.full_name,
            'repo_url': repo.url,
            'repo_owner': repo.name,
            'repo_description': repo.description,
            'created_at': repo.created_at,
            'updated_at': repo.updated_at,
            'pushed_at': repo.pushed_at,
            // 'lastweek_addition': repo.lastweek_addition,
            // 'lashweek_deletion': repo.lashweek_deletion,
            'forks_count': repo.forks_count,
            'stargazers_count': repo.stargazers_count,
            'watchers_count': repo.watchers_count,
            'stargazers_url': repo.stargazers_url,
            'teams_url': repo.teams_url,
            'languages_url': repo.languages_url,
            }


        var funcs = Promise.resolve(Utils.make_range(1, 10).map((n) => makeRequest(make_option(n, repo.full_name))));

        funcs
            .mapSeries(iterator)
            .catch(function (err) {
                console.log(err);
            })
            .finally(function () {
                // var repo_list = [];
                // //crawl BitTiger repos
                // var repository_list = github_info['repository_list'];
                // for (var i = 0; i < repository_list.length; i++){
                //     repo_list.push(Repo.crawl_repos(repository_list[i]));
                // }
                console.log('finished crawling: ' + repo.full_name);

                fulfill(repo_info);

            })

        function makeRequest(option) {
            return function () {
                return new Promise(function (fulfill, reject) {
                    Request(option, function (error, response, body) {
                        if (error) {
                            reject(error);
                        } else if (body.length == 0) {
                            reject('page empty in craw_repos.js');
                        } else {
                            // console.log('page is not empty in craw_repos.js');
                            fulfill(body);
                            //console.log(body.length);
                            // var should_continue = parseBody(body);
                            // if (should_continue) {
                            //     fulfill(body);
                            // } else {
                            //     reject('outdated events');
                            // }
                        }
                    })
                })
            };
        }

        function parseBody(body) {

            var should_continue = true;
            if (body[0].created_at < last_week_date) {
                should_continue = false;
            } else {
                for (var i = 0; i < body.length; i++) {
                    // event_type = body[i].type;
                    event_date = body[i].created_at;

                    
                }
            }
            return should_continue;
        }
    });
}

function iterator(f) {
    return f()
}

function make_option(page_number, repo_full_name) {
    return {
        // url: 'https://api.github.com/users/' + user_id + '/events', // URL to hit
        url: 'https://api.github.com/repos/' + repo_full_name , // URL to hit
        qs: { //Query string data
            page: page_number
        },
        method: 'GET', //Specify the method
        headers: { //Define headers
            'User-Agent': 'request'
        },
        auth: { //HTTP Authentication
            user: username,
            pass: password
        },
        json: true
    };
}

exports.crawl_repos = crawl_repos;
