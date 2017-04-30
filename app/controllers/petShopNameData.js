/**
 * Created by zwf on 17-4-6.
 */


var router = require('express').Router();
var Q = require('q');
var petShopModel = require('../model/petShopName').petShopModel;
var utilProc = require('../utils');

router.route('/petshoplist')
    .get(function (req,res) {
        utilProc.ProcGetAggReq(req,res,function (targetObj){
            var pipeline = [
                {
                    $project:{
                        shopname:1,
                        address:1,
                        createTime:1,
                        remarks:1
                    }
                }
            ]

            return {module:petShopModel,pipeline:pipeline,pushObj:{
                shopname: '$shopname',
                address:'$address',
                createTime:'$createTime',
                remarks:'$remarks'
            }};
        })
    })
    .post(function (req,res) {
        utilProc.ProcPostReq(req, res, false, utilProc.defultAuthOrg, function (targetObj) {
            if (targetObj.action==='del'){
                return petShopModel.remove({shopname:targetObj.thisid})
            }
            else {
                var newObj = {
                    shopname:targetObj.value.shopname,
                    address:targetObj.value.address,
                    remarks:targetObj.value.remarks
                }

                newObj.createTime = new Date();

                var pipeline = {
                    $match:{
                        shopname:targetObj.value.shopname
                    }
                }

                return petShopModel.aggregate(pipeline).exec().then(function (results) {
                    if (results.length>0){
                        return Q.reject('商店名不能重复')
                    }
                    if (targetObj.action==='add'){
                        petShopModel.create(newObj)
                    }
                    else {
                        petShopModel.findOneAndUpdate({shopname:targetObj.value.shopname},{$set:newObj},{upsert:true}).then(function (result) {
                            res.json('success')
                        })
                    }
                })

            }
        })
    })

router.route('/userInfo')
    .get(function (req,res) {
        utilProc.ProcGetAggReq(req,res,function (targetObj){
            var pipeline = [
                {
                    $match:{shopname:req.query.shopname}
                },
                {
                    $unwind:'$user'
                },
                {
                    $project:{
                        useraccount:'$user.useraccount',
                        username:'$user.username',
                        createTime:'$user.createTime',
                        isSuper:'$user.isSuper',
                        remarks:'$user.remarks'
                    }
                }


            ];

            return {module:petShopModel,pipeline:pipeline,pushObj:{
                useraccount:'$useraccount',
                username:'$username',
                createTime:'$createTime',
                isSuper:'$isSuper',
                remarks:'$remarks'
            }};
        })
    })
    .post(function (req,res) {
        utilProc.ProcPostReq(req, res, false, utilProc.defultAuthOrg,
            function (targetObj) {
                if (targetObj.action ==='del'){
                    return petShopModel.findOneAndUpdate({shopname:targetObj.query.shopname},{$pull:{user:{useraccount:targetObj.value.useraccount}}})
                }

                else {
                    //添加判断条件,不能添加重复
                    var pipeline = [
                        {
                            $match:{
                                shopname:targetObj.query.shopname
                            }
                        },
                        {
                            $unwind:"$user",
                        },


                    ];
                    if (targetObj.action == 'add'){
                        pipeline.push({
                            $match:{
                                "user.useraccount":targetObj.value.useraccount
                            }
                        })
                    }
                    else {
                        pipeline.push({
                            $match:{
                                "user.useraccount":targetObj.value.useraccount
                            }
                        })
                        pipeline.push({
                            $project:{
                                "user.useraccount":1,
                                isOld:{$eq:["$user.useraccount",targetObj.thisid]}
                            }
                        })
                        pipeline.push({
                            $match:{
                                "isOld":false
                            }
                        })
                    }

                    var newObject = {
                        useraccount:targetObj.value.useraccount,
                        username:targetObj.value.username,
                        createTime:targetObj.value.createTime,
                        isSuper:targetObj.value.isSuper=='true',
                        remarks:targetObj.value.remarks
                    }


                    return petShopModel.aggregate(pipeline).exec().then(function (results) {
                        if (results.length>0){
                            return Q.reject('控制器名不能重复')
                        }

                        if (targetObj.action === 'add'){
                            return petShopModel.findOneAndUpdate({shopname:targetObj.query.shopname},{$push:{user:
                                newObject
                            }})
                        }
                        else {

                            return petShopModel.findOneAndUpdate({shopname:targetObj.query.shopname,'user.useraccount':targetObj.value.useraccount},
                                {
                                    $set:{
                                        "user.$.useraccount":newObject.useraccount,
                                        "user.$.username":newObject.username,
                                        "user.$.createTime":newObject.createTime,
                                        "user.$.isSuper":newObject.isSuper,
                                        "user.$.remarks":newObject.remarks
                                }}
                            )
                        }
                    })

                }
            })
    })

router.route('/manageInfo')
    .get(function (req,res) {
        utilProc.ProcGetAggReq(req,res,function (targetObj){
            var pipeline = [
                {
                    $match:{shopname:req.query.shopname}
                },
                {
                    $unwind:'$manage'
                },
                {
                    $project:{
                        manageaccount:'$manage.manageaccount',
                        managename:'$manage.managename',
                        createTime:'$manage.createTime',
                        isSuper:'$manage.isSuper',
                        remarks:'$manage.remarks'
                    }
                }


            ];

            return {module:petShopModel,pipeline:pipeline,pushObj:{
                manageaccount:'$manageaccount',
                managename:'$managename',
                createTime:'$createTime',
                isSuper:'$isSuper',
                remarks:'$remarks'
            }};
        })
    })
    .post(function (req,res) {
        utilProc.ProcPostReq(req, res, false, utilProc.defultAuthOrg,
            function (targetObj) {
                if (targetObj.action ==='del'){
                    return petShopModel.findOneAndUpdate({shopname:targetObj.query.shopname},{$pull:{user:{manageaccount:targetObj.value.manageaccount}}})
                }

                else {
                    //添加判断条件,不能添加重复
                    var pipeline = [
                        {
                            $match:{
                                shopname:targetObj.query.shopname
                            }
                        },
                        {
                            $unwind:"$manage"
                        }


                    ];
                    if (targetObj.action == 'add'){
                        pipeline.push({
                            $match:{
                                "manage.manageaccount":targetObj.value.manageaccount
                            }
                        })
                    }
                    else {
                        pipeline.push({
                            $match:{
                                "manage.manageaccount":targetObj.value.manageaccount
                            }
                        })
                        pipeline.push({
                            $project:{
                                "manage.manageaccount":1,
                                isOld:{$eq:["$manage.manageaccount",targetObj.thisid]}
                            }
                        })
                        pipeline.push({
                            $match:{
                                "isOld":false
                            }
                        })
                    }

                    var newObject = {
                        manageaccount:targetObj.value.manageaccount,
                        managename:targetObj.value.managename,
                        createTime:targetObj.value.createTime,
                        isSuper:targetObj.value.isSuper=='true',
                        remarks:targetObj.value.remarks
                    }


                    return petShopModel.aggregate(pipeline).exec().then(function (results) {
                        if (results.length>0){
                            return Q.reject('控制器名不能重复')
                        }

                        if (targetObj.action === 'add'){
                            return petShopModel.findOneAndUpdate({shopname:targetObj.query.shopname},{$push:{manage:
                            newObject
                            }})
                        }
                        else {

                            return petShopModel.findOneAndUpdate({shopname:targetObj.query.shopname,'manage.manageaccount':targetObj.value.manageaccount},
                                {
                                    $set:{
                                        "manage.$.manageaccount":newObject.manageaccount,
                                        "manage.$.managename":newObject.managename,
                                        "manage.$.createTime":newObject.createTime,
                                        "manage.$.isSuper":newObject.isSuper,
                                        "manage.$.remarks":newObject.remarks
                                    }}
                            )
                        }
                    })

                }
            })
    })

router.route('/shopname')
    .get(function (req,res) {
        utilProc.ProcGetAggReq(req,res,function (targetObj){
            var pipeline = [
                {
                    $project:{
                        shopname:1,
                    }
                }
            ]

            return {module:petShopModel,pipeline:pipeline,pushObj:{
                shopname: '$shopname',
            }};
        })
    })

router.route('/curshop')
    .get(function (req,res) {
        var curshopname = req.query.shopname;
        var pipeline = [
            {
                $match:{
                    shopname:curshopname
                }
            }
        ]

        petShopModel.aggregate(pipeline).exec().then(function (results) {
            if(results[0] && results[0].pets){
                res.json(results[0].pets)
            }
            else {
                res.end({})
            }
        })
    })

module.exports = router;