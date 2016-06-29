const Account = require('./configs/account');
const Request = require('request');
const Promise = require('bluebird');
const Utils = require('./helpers/my_utils');
const Repo = require('./crawl_repos');


function crawl_contributors(cont) {

    return new Promise(function (fulfill, reject) {
        var cont_info = {
            'name': cont.login,
            'contributions_count': cont.contributions
        }


        var funcs_cont = Promise.resolve(Utils.make_range(1, 10).map((n) => makeRequest(make_option_cont(n, repo.full_name))));

        funcs_cont
            .mapSeries(iterator)
            .catch(function (err) {
                console.log(err);
            })
            .finally(function () {
                fulfill(cont_info);
            })

        function makeRequest(option) {
            return function () {
                return new Promise(function (fulfill, reject) {
                    Request(option, function (error, response, body) {
                        if (error) {
                            reject(error);
                        } else if (body.length == 0) {
                            reject('page empty in craw_cont.js');
                        } else {
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


function make_option_cont(page_number, repo_full_name) {
    return {
        url: 'https://api.github.com/repos/' + repo_full_name + '/contributors',
        qs: { //Query string data
            page: page_number
        },
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
exports.crawl_contributors = crawl_contributors;
