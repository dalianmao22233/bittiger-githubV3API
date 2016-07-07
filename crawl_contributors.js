const Account = require('./configs/account');
const Request = require('request');
const Promise = require('bluebird');
const Utils = require('./helpers/my_utils');


function crawl_contributors(repo_full_name, callback) {


    var url = "https://api.github.com/repos/" + repo_full_name + "/stats/contributors";
    var return_list = [];

    Request({
        url: url,
        json: true,
        method: 'GET', //Specify the method
        headers: { //Define headers
            'User-Agent': 'request'
        },
        auth: { //HTTP Authentication
            user: 'dalianmao22233',
            pass: 'Aa1313250!'
        },
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if (body == null || body.length == 0) {
                return callback(error || {statusCode: response.statusCodes});
            }
            for (var i = 0; i < body.length; ++i) {
                var cont_info = {
                    'contributor': body[i].author.login,
                    'url': body[i].author.url,
                    'total': body[i].total
                }
                return_list.push(cont_info);

            }
            callback(null, return_list);
        }
        else {
            console.log("err");
        }
    })


}
exports.crawl_contributors = crawl_contributors;
