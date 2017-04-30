/**
 * Created by zwf on 17-3-14.
 */

var router = require('express').Router();
// import pet from './pet'
var Q = require('q');
//var pet = require('../model/pet').pet;
var petShopModel = require('../model/petShopName').petShopModel;
var utilProc = require('../utils');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage}).fields(([{name: 'icon', maxCount: 1}, {name: 'netInfo', maxCount: 1}]));

router.route('/petlist')
    .get(function (req,res) {
        utilProc.ProcGetAggReq(req,res,function (targetObj){
            var pipeline = [
                {
                    $match:{shopname:req.query.shopname}
                },
                {
                    $unwind:'$pets'
                },
                {
                    $project:{
                        petname:'$pets.petname',
                        kind:'$pets.kind',
                        variety:'$pets.variety',
                        sex:'$pets.sex',
                        age:'$pets.age',
                        price:'$pets.price'
                    }
                }


            ];

            return {module:petShopModel,pipeline:pipeline,pushObj:{
                petname:'$petname',
                kind:'$kind',
                variety:'$variety',
                sex:'$sex',
                age:'$age',
                price:'$price'
            }};
        })
    })
    .post(function (req,res) {
        utilProc.ProcPostReq(req, res, false, utilProc.defultAuthOrg,
            function (targetObj) {
                if (targetObj.action ==='del'){
                    return petShopModel.findOneAndUpdate({shopname:targetObj.query.shopname},{$pull:{pets:{petname:targetObj.thisid}}})
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
                            $unwind:"$pets"
                        },


                    ];
                    if (targetObj.action == 'add'){
                        pipeline.push({
                            $match:{
                                "pets.petname":targetObj.value.petname
                            }
                        })
                    }
                    else {
                        pipeline.push({
                            $match:{
                                "pets.petname":targetObj.value.petname
                            }
                        })
                        pipeline.push({
                            $project:{
                                "pets.petname":1,
                                isOld:{$eq:["$pets.petname",targetObj.thisid]}
                            }
                        })
                        pipeline.push({
                            $match:{
                                "isOld":false
                            }
                        })
                    }

                    var newObject = {
                        petname:targetObj.value.petname,
                        kind:targetObj.value.kind,
                        variety:targetObj.value.variety,
                        sex:targetObj.value.sex,
                        age:targetObj.value.age,
                        price:targetObj.value.price
                    }


                    return petShopModel.aggregate(pipeline).exec().then(function (results) {
                        if (results.length>0){
                            return Q.reject('宠物名不能重复')
                        }

                        if (targetObj.action === 'add'){
                            return petShopModel.findOneAndUpdate({shopname:targetObj.query.shopname},{$push:{pets:
                            newObject
                            }})
                        }
                        else {

                            return petShopModel.findOneAndUpdate({shopname:targetObj.query.shopname,'pets.petname':targetObj.value.petname},
                                {
                                    $set:{
                                        "pets.$.petname":newObject.petname,
                                        "pets.$.kind":newObject.kind,
                                        "pets.$.variety":newObject.variety,
                                        "pets.$.sex":newObject.sex,
                                        "pets.$.age":newObject.age,
                                        "pets.$.price":newObject.price
                                    }}
                            )
                        }
                    })

                }
            })
    })


router.route('/files')
    .get(function (req,res) {
        var pipeline = [
            {
                $match: {
                    shopname: req.query.shopname
                }
            },
            {
                $unwind: '$pets'
            },
            {
                $project:{
                    petname:'$pets.petname',
                    icon:'$pets.icon'
                }
            },
            {
                $match:{
                    petname:req.query.petname
                }
            }
        ]

        petShopModel.aggregate(pipeline).exec().then(function (results) {
            if(results[0] && results[0].icon){
                var icon = results[0].icon;
                // icon = icon.replace(/[^,]*,/,'')
                // return Q.resolve(new Buffer(icon,'base64'));
                if (!req.query.isString){
                    icon = icon.replace(/[^,]*,/,'');
                    return Q.resolve(new Buffer(icon,'base64'));
                }
                return Q.resolve(icon)
            }
            else {
                // return Q.reject('no icon');
                res.end('')
            }
        }).then(function (icon) {
            if (!req.query.isString){
                res.setHeader(
                    "Content-Type", "image/png"
                );
            }
            res.end(icon)
        }).catch(function (e) {
            res.status(500).end(e.message || e);
        })
    })
    .post(function (req,res) {
        upload(req, res, function (err) {
            utilProc.ProcPostReq(req, res, false, utilProc.defultAuthOrg, function (targetObj) {

                if (targetObj.value && req.files) {

                    var icoFile = (req.files.icon && req.files.icon[0]);
                    var type = icoFile && icoFile.mimetype.replace(/.*\/(.*)/, '$1');
                    // var netFile = (req.files.netInfo && req.files.netInfo[0]);// || new Buffer();
                    return Q().then(function(){
                        if(icoFile){
                            return utilProc.createThumbnail(icoFile.buffer,type);
                        }else{
                            return null;
                        }
                    }).then(function (base64Buffer) {
                        return petShopModel.findOneAndUpdate({shopname: req.query.shopname,'pets.petname':req.query.petname},
                            {
                                $set:{
                                    'pets.$.icon':base64Buffer
                                }
                            },{upsert:true,new:true}).then(function (result) {

                                var petArray = result.pets
                                var temlIcon = ''
                                petArray.forEach(function (item) {
                                    if (item.petname==req.query.petname){
                                        temlIcon = item.icon
                                    }
                                })
                                res.json(temlIcon)


                        })
                    }).catch(function (result) {
                        return Q.resolve(result)
                    })
                }
                else {
                    return Q.reject('file needed');
                }

            })
        })
    })

module.exports = router;