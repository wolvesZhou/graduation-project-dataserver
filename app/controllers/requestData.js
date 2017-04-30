/**
 * Created by zwf on 17-4-20.
 */


var router = require('express').Router();
var Q = require('q');
var requestModel = require('../model/reuqest').requestModel;
var utilProc = require('../utils');


router.route('/petask')
    .get(function (req,res) {
        utilProc.ProcGetAggReq(req,res,function (targetObj){
            var pipeline = [
                {
                    $project:{
                        _id:1,
                        username:1,
                        telno:1,
                        request:1,
                        isDone:1
                    }
                }
            ]

            return {module:requestModel,pipeline:pipeline,pushObj:{
                _id:'$_id',
                username: '$username',
                telno: '$telno',
                request: '$request',
                isDone: '$isDone'
            }};
        })
    })
    .post(function (req,res) {
        utilProc.ProcPostReq(req, res, false, utilProc.defultAuthOrg,
            function (targetObj) {
                var newObject = {
                    username:targetObj.value.username,
                    telno:targetObj.value.telno,
                    request:targetObj.value.request,
                    isDone:false
                }

                requestModel.create(newObject)
                return Q.resolve({sucess: true})
            })
    })

router.route('/changeInfo')
    .post(function (req,res) {
        utilProc.ProcPostReq(req, res, false, utilProc.defultAuthOrg, function (targetObj) {
            if (targetObj.action==='del'){
                return requestModel.remove({_id:targetObj.thisid})
            }
            else {
                var newObj = {
                    username:targetObj.value.username,
                    telno:targetObj.value.telno,
                    request:targetObj.value.request,
                    isDone:targetObj.value.isDone=='true'
                }
                var pipeline = {
                    $match:{
                        _id:targetObj.thisid
                    }
                }

                return requestModel.aggregate(pipeline).exec().then(function (results) {
                    if (results.length>0){
                        return Q.reject('商店名不能重复')
                    }
                    if (targetObj.action==='add'){
                        requestModel.create(newObj)
                    }
                    else {
                        requestModel.findOneAndUpdate({_id:targetObj.thisid},{$set:newObj},{upsert:true}).then(function (result) {
                            res.json('success')
                        })
                    }
                })




            }
        })
    })

module.exports = router;