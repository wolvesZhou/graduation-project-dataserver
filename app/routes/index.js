/**
 * Created by zwf on 17-3-13.
 */

'use strict';

module.exports = function (app) {
    app.route('/')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/index.html');
        });
};