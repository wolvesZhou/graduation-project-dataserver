/**
 * Created by zwf on 17-4-9.
 */

var router = require('express').Router();
var Q = require('q');
var kindModel = require('../model/kind').kindModel;
var utilProc = require('../utils');

router.route('/kindselect')
    .get(function (req,res) {

        var pipeline = [
            {
                $project:{
                    kindname:1
                }
            }
        ]

        kindModel.aggregate(pipeline).exec().then(function (results) {
            var retStr  = '<select>';

            results.forEach(function (item) {
                retStr += '<option value="'+item.kindname+'">'+item.kindname+'</option>'
            })
            retStr += '</select>'
            res.setHeader(
                "Content-Type", "text/html; charset=UTF-8"
            )
            res.end(retStr)
        });


    })


router.route('/kindlist')
    .get(function (req,res) {
        utilProc.ProcGetAggReq(req,res,function (targetObj){
            var pipeline = [
                {
                    $project:{
                        kindname:1
                    }
                }
            ]

            return {module:kindModel,pipeline:pipeline,pushObj:{
                kindname: '$kindname'
            }};
        })
    })
    .post(function (req,res) {
        utilProc.ProcPostReq(req, res, false, utilProc.defultAuthOrg, function (targetObj) {
            if (targetObj.action==='del'){
                return kindModel.remove({kindname:targetObj.thisid})
            }
            else {
                var newObj = {
                    kindname:targetObj.value.kindname,
                }

                var pipeline = {
                    $match:{
                        kindname:targetObj.value.kindname
                    }
                }

                return kindModel.aggregate(pipeline).exec().then(function (results) {
                    if (results.length>0){
                        return Q.reject('种类不能重复')
                    }
                    if (targetObj.action==='add'){
                        kindModel.create(newObj)
                    }
                    else {
                        kindModel.findOneAndUpdate({kindname:targetObj.value.kindname},{$set:newObj},{upsert:true}).then(function (result) {
                            res.json('success')
                        })
                    }
                })

            }
        })
    })

module.exports = router;