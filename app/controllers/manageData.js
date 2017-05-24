/**
 * Created by zwf on 17-5-24.
 */

var router = require('express').Router();
var Q = require('q');
var manageModel = require('../model/manage').manageModel;
var utilProc = require('../utils');


router.route('/managelist')
    .get(function (req,res) {
        utilProc.ProcGetAggReq(req,res,function (targetObj){
            var pipeline = [
                {
                    $project:{
                        manageno:1,
                        managepas:1
                    }
                }
            ]

            return {module:manageModel,pipeline:pipeline,pushObj:{
                manageno: '$manageno',
                managepas:'$managepas'
            }};
        })
    })
    .post(function (req,res) {

        utilProc.ProcPostReq(req, res, false, utilProc.defultAuthOrg, function (targetObj) {
            if (targetObj.action==='del'){
                return manageModel.remove({telno:targetObj.thisid})
            }
            else {
                var newObj = {
                    manageno:targetObj.value.manageno,
                    managepas:targetObj.value.managepas
                }

                var pipeline = [
                    {$match:{
                        manageno:targetObj.value.manageno
                    }}
                ]

                if (targetObj.action==='edit'){
                    pipeline.push({
                        $project:{
                            manageno:1,
                            isOld:{$eq:[targetObj.value.manageno,targetObj.thisid]}
                        }
                    })
                    pipeline.push({
                        $match:{
                            "isOld":false
                        }
                    })
                }

                return manageModel.aggregate(pipeline).exec().then(function (results) {
                    if (results.length>0){
                        return Q.reject('用户名不能重复')
                    }
                    if (targetObj.action==='add'){
                        manageModel.create(newObj)
                    }
                    else {
                        manageModel.findOneAndUpdate({manageno:targetObj.value.manageno},{$set:newObj},{upsert:true}).then(function (result) {
                            res.json('success')
                        })
                    }
                })

            }
        })
    })

module.exports = router;