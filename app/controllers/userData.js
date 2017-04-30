/**
 * Created by zwf on 17-3-14.
 */


var router = require('express').Router();
var Q = require('q');
var userModel = require('../model/user').userModel;
var utilProc = require('../utils');

router.route('/userlist')
    .get(function (req,res) {
        utilProc.ProcGetAggReq(req,res,function (targetObj){
            var pipeline = [
                {
                    $project:{
                        telno:1,
                        password:1
                    }
                }
            ]

            return {module:userModel,pipeline:pipeline,pushObj:{
                telno: '$telno',
                password:'$password'
            }};
        })
    })
    .post(function (req,res) {
        // var username = req.body.username;
        // var password = req.body.password;
        // var newObj = {
        //     username:username,
        //     password:password
        // }
        //
        // userModel.findOneAndUpdate({username:username},{$set:newObj},{upsert:true}).then(function (result) {
        //     res.json('success')
        // })
        utilProc.ProcPostReq(req, res, false, utilProc.defultAuthOrg, function (targetObj) {
            if (targetObj.action==='del'){
                return userModel.remove({telno:targetObj.thisid})
            }
            else {
                var newObj = {
                    telno:targetObj.value.telno,
                    password:targetObj.value.password
                }

                var pipeline = {
                    $match:{
                        telno:targetObj.value.telno
                    }
                }

                return userModel.aggregate(pipeline).exec().then(function (results) {
                    if (results.length>0){
                        return Q.reject('用户名不能重复')
                    }
                    if (targetObj.action==='add'){
                        userModel.create(newObj)
                    }
                    else {
                        userModel.findOneAndUpdate({telno:targetObj.value.telno},{$set:newObj},{upsert:true}).then(function (result) {
                                res.json('success')
                            })
                    }
                })

            }
        })
    })

router.route('/checkuser')
    .get(function (req,res) {
        var telno = req.query.telno;
        var password = req.query.password;
        var pipeline = [
            {
                $match:{
                    telno:telno
                }
            },
            {
                $lookup:{
                    "from" : "petshopmodels",
                    "localField" : "telno",
                    "foreignField" : "user.useraccount",
                    "as" : "userinfo"
                }
            },
            {
                $unwind:'$userinfo'
            },
            {
                $project:{
                    telno:1,
                    password:1,
                    uservalue:'$userinfo.user'
                }
            },
            {
                $unwind:'$uservalue'
            },
            {
                $match:{
                    'uservalue.useraccount':telno
                }
            }
        ]

        userModel.aggregate(pipeline).exec().then(function (results) {
            if(results.length>0){
                if (results[0].password==password){
                    res.json(results[0])
                }
                else {
                    res.end('密码错误')
                }
            }
            else {
                res.end('用户不存在')
            }
        })

    })

module.exports = router;
