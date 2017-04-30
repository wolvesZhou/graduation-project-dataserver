/**
 * Created by zwf on 17-4-20.
 */


var router = require('express').Router();
var Q = require('q');
var adviceModel = require('../model/advice').adviceModel;
var utilProc = require('../utils');


router.route('/useradvice')
    .get(function (req,res) {
        utilProc.ProcGetAggReq(req,res,function (targetObj){
            var pipeline = [
                {
                    $project:{
                        _id:1,
                        username:1,
                        telno:1,
                        advice:1,
                        isDone:1
                    }
                }
            ]

            return {module:adviceModel,pipeline:pipeline,pushObj:{
                _id:'$_id',
                username: '$username',
                telno: '$telno',
                advice: '$advice',
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
                    advice:targetObj.value.advice,
                    isDone:false
                }

                adviceModel.create(newObject)
                return Q.resolve({sucess: true})
            })
    })

router.route('/changeAdvice')
    .post(function (req,res) {
        utilProc.ProcPostReq(req, res, false, utilProc.defultAuthOrg, function (targetObj) {
            if (targetObj.action==='del'){
                return adviceModel.remove({_id:targetObj.thisid})
            }
            else {
                var newObj = {
                    username:targetObj.value.username,
                    telno:targetObj.value.telno,
                    advice:targetObj.value.advice,
                    isDone:targetObj.value.isDone=='true'
                }
                var pipeline = {
                    $match:{
                        _id:targetObj.thisid
                    }
                }

                return adviceModel.aggregate(pipeline).exec().then(function (results) {
                    if (results.length>0){
                        return Q.reject('商店名不能重复')
                    }
                    if (targetObj.action==='add'){
                        adviceModel.create(newObj)
                    }
                    else {
                        adviceModel.findOneAndUpdate({_id:targetObj.thisid},{$set:newObj},{upsert:true}).then(function (result) {
                            res.json('success')
                        })
                    }
                })




            }
        })
    })

module.exports = router;