const Account = require('./configs/account');
const Request = require('request');
const Promise = require('bluebird');
const Utils = require('./helpers/my_utils');


function crawl_contributors(repo_full_name) {
    return new Promise(function (fulfill, reject) {
        var cont_info = {};
        var cont_return_list = [];
        var funcs = Promise.resolve(makeRequest(make_option(repo_full_name)));
        funcs
            // .mapSeries(iterator)
            .catch(function (err) {
                console.log(err);
            })
            .finally(function () {
                // console.log("cont_return_list: " + cont_return_list);

                fulfill(cont_return_list);

            })
        function makeRequest(option) {
            return new Promise(function (fulfill, reject) {
                Request(option, function (error, response, body) {
                    if (error) {
                        reject(error);
                    } else if (body == null || body.length == 0) {
                        reject('page empty in craw_repos.js');
                    } else {

                        for (var i = 0; i < body.length; ++i) {
                            cont_info = {
                                'contributor': body[i].author.login,
                                'url': body[i].author.url,
                                'total': body[i].total
                            }
                            cont_return_list.push(cont_info);
                            // console.log("in request: " + cont_info.url);
                            fulfill(body);

                        }

                    }
                })
            })
            // };
        }

    });

}
function make_option(repo_full_name) {
    return {
        url: 'https://api.github.com/repos/' + repo_full_name + '/stats/contributors',// URL to hit
        // url: 'https://api.github.com/repos/twbs/bootstrap/stats/contributors',
        method: 'GET', //Specify the method
        headers: { //Define headers
            'User-Agent': 'request'
        },
        auth: { //HTTP Authentication
            user: 'dalianmao22233',
            pass: 'Aa1313250!'
        },
        json: true

    };
}
function iterator(f) {
    return f()
}
exports.crawl_contributors = crawl_contributors;
