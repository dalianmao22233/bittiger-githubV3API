const Account = require('./configs/account');
const Request = require('request');
const Promise = require('bluebird');
const Utils = require('./helpers/my_utils');
const Repo = require('./crawl_repos');


function crawl_changes(change) {
    
    return new Promise(function (fulfill, reject) {

        var change_info = {
            'lastweek_addition': change[1],
            'lashweek_deletion': change[2],
        }


        var funcs_change = Promise.resolve(makeRequest(make_option_change(repo.full_name)));

        funcs_change
            .mapSeries(iterator)
            .catch(function (err) {
                console.log(err);
            })
            .finally(function () {
                fulfill(change_info);
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

                        }
                    })
                })
            };
        }


    });
}

function iterator(f) {
    return f()
}


function make_option_change(repo_full_name) {
    return {
        url: 'https://api.github.com/repos/' + repo_full_name + '/stats/code_frequency',
        //don't need page string
        method: 'GET',
        headers: {
            'User-Agent': 'request'
        },

        auth: { //HTTP Authentication
            user: 'dalianmao22233',
            pass: 'Aa1313250!'
        },
        json: true

    };
}
exports.crawl_changes = crawl_changes;
