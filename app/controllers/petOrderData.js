/**
 * Created by zwf on 17-4-24.
 */

var router = require('express').Router();
// import pet from './pet'
var Q = require('q');
//var pet = require('../model/pet').pet;
var orderModel = require('../model/petOrder').orderModel;
var utilProc = require('../utils');

router.route('/orderlist')
    .get(function (req,res) {
        utilProc.ProcGetAggReq(req,res,function (targetObj){
            var pipeline = [
                {
                    $project:{
                        _id:1,

                        orderTel:1,
                        receiveUser:1,
                        receiveTel:1,
                        address:1,
                        message:1,
                        petName:1,
                        petFrom:1,
                        petPrice:1,
                        isDone:1
                    }
                }
            ]

            return {module:orderModel,pipeline:pipeline,pushObj:{
                _id:'$_id',

                orderTel:'$orderTel',
                receiveUser:'$receiveUser',
                receiveTel:'$receiveTel',
                address:'$address',
                message:'$message',
                petName:'$petName',
                petFrom:'$petFrom',
                petPrice:'$petPrice',
                isDone:'$isDone'
            }};
        })
    })
    .post(function (req,res) {
        utilProc.ProcPostReq(req, res, false, utilProc.defultAuthOrg,
            function (targetObj) {
                var newObject = {
                    //orderUser:targetObj.value.orderUser,
                    orderTel:targetObj.value.orderTel,
                    receiveUser:targetObj.value.receiveUser,
                    receiveTel:targetObj.value.receiveTel,
                    address:targetObj.value.address,
                    message:targetObj.value.message,
                    petName:targetObj.value.petName,
                    petFrom:targetObj.value.petFrom,
                    petPrice:targetObj.value.petPrice,
                    isDone:false
                }

                orderModel.create(newObject)
                return Q.resolve({sucess: true})
            })
    })

router.route('/changeorder')
    .post(function (req,res) {
        utilProc.ProcPostReq(req, res, false, utilProc.defultAuthOrg, function (targetObj) {
            if (targetObj.action==='del'){
                return adviceModel.remove({_id:targetObj.thisid})
            }
            else {
                var newObject = {
                    //orderUser:targetObj.value.orderUser,
                    orderTel:targetObj.value.orderTel,
                    receiveUser:targetObj.value.receiveUser,
                    receiveTel:targetObj.value.receiveTel,
                    address:targetObj.value.address,
                    message:targetObj.value.message,
                    petName:targetObj.value.petName,
                    petFrom:targetObj.value.petFrom,
                    petPrice:targetObj.value.petPrice,
                    isDone:targetObj.value.isDone=='true'
                }
                var pipeline = {
                    $match:{
                        _id:targetObj.thisid
                    }
                }

                return orderModel.aggregate(pipeline).exec().then(function (results) {
                    if (results.length>0){
                        return Q.reject('商店名不能重复')
                    }
                    if (targetObj.action==='add'){
                        orderModel.create(newObject)
                    }
                    else {
                        orderModel.findOneAndUpdate({_id:targetObj.thisid},{$set:newObject},{upsert:true}).then(function (result) {
                            res.json('success')
                        })
                    }
                })




            }
        })
    })

module.exports = router;