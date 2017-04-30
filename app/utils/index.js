/**
 * Created by zhuqizhong on 16-5-6.
 */
var Q = require('q');
var _ = require('underscore');
var async = require('async-q');
var util = require('util');
// var HouseScene = require('mongo/Scene').HouseScene;
// var HouseModel = require('mongo/house')
var image = require('lwip');
var locale = {
    "AD": "Andorra",
    "AE": "United Arab Emirates",
    "AF": "Afghanistan",
    "AG": "Antigua And Barbuda",
    "AI": "Anguilla",
    "AL": "Albania",
    "AM": "Armenia",
    "AN": "Netherlands Antilles",
    "AO": "Angola",
    "AR": "Argentina",
    "AS": "American Samoa",
    "AT": "Austria",
    "AU": "Australia",
    "AW": "Aruba",
    "AX": "Åland Islands",
    "AZ": "Azerbaijan",
    "BA": "Bosnia And Herzegovina",
    "BB": "Barbados",
    "BD": "Bangladesh",
    "BE": "Belgium",
    "BF": "Burkina Faso",
    "BG": "Bulgaria",
    "BH": "Bahrain",
    "BI": "Burundi",
    "BJ": "Benin",
    "BM": "Bermuda",
    "BN": "Brunei Darussalam",
    "BO": "Bolivia",
    "BR": "Brazil",
    "BS": "Bahamas",
    "BT": "Bhutan",
    "BW": "Botswana",
    "BY": "Belarus",
    "BZ": "Belize",
    "CA": "Canada",
    "CC": "Cocos (Keeling) Islands",
    "CD": "Congo, The Democratic Republic Of The",
    "CF": "Central African Republic",
    "CG": "Congo",
    "CH": "Switzerland",
    "CI": "Côte D'ivoire",
    "CK": "Cook Islands",
    "CL": "Chile",
    "CM": "Cameroon",
    "CN": "China",
    "CO": "Colombia",
    "CR": "Costa Rica",
    "CS": "Serbia And Montenegro",
    "CU": "Cuba",
    "CV": "Cape Verde",
    "CX": "Christmas Island",
    "CY": "Cyprus",
    "CZ": "Czech Republic",
    "DE": "Germany",
    "DJ": "Djibouti",
    "DK": "Denmark",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "DZ": "Algeria",
    "EC": "Ecuador",
    "EE": "Estonia",
    "EG": "Egypt",
    "ER": "Eritrea",
    "ES": "Spain",
    "ET": "Ethiopia",
    "FI": "Finland",
    "FJ": "Fiji",
    "FK": "Falkland Islands (Malvinas)",
    "FM": "Micronesia, Federated States Of",
    "FO": "Faroe Islands",
    "FR": "France",
    "GA": "Gabon",
    "GB": "United Kingdom",
    "GD": "Grenada",
    "GE": "Georgia",
    "GF": "French Guiana",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GL": "Greenland",
    "GM": "Gambia",
    "GN": "Guinea",
    "GP": "Guadeloupe",
    "GQ": "Equatorial Guinea",
    "GR": "Greece",
    "GT": "Guatemala",
    "GU": "Guam",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HK": "Hong Kong",
    "HN": "Honduras",
    "HR": "Croatia",
    "HT": "Haiti",
    "HU": "Hungary",
    "ID": "Indonesia",
    "IE": "Ireland",
    "IL": "Israel",
    "IN": "India",
    "IO": "British Indian Ocean Territory",
    "IQ": "Iraq",
    "IR": "Iran, Islamic Republic Of",
    "IS": "Iceland",
    "IT": "Italy",
    "JM": "Jamaica",
    "JO": "Jordan",
    "JP": "Japan",
    "KE": "Kenya",
    "KG": "Kyrgyzstan",
    "KH": "Cambodia",
    "KI": "Kiribati",
    "KM": "Comoros",
    "KN": "Saint Kitts And Nevis",
    "KP": "Korea, Democratic People's Republic Of",
    "KR": "Korea, Republic Of",
    "KW": "Kuwait",
    "KY": "Cayman Islands",
    "KZ": "Kazakhstan",
    "LA": "Lao People's Democratic Republic",
    "LB": "Lebanon",
    "LC": "Saint Lucia",
    "LI": "Liechtenstein",
    "LK": "Sri Lanka",
    "LR": "Liberia",
    "LS": "Lesotho",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "LV": "Latvia",
    "LY": "Libyan Arab Jamahiriya",
    "MA": "Morocco",
    "MC": "Monaco",
    "MD": "Moldova, Republic Of",
    "MG": "Madagascar",
    "MH": "Marshall Islands",
    "MK": "Macedonia, The Former Yugoslav Republic Of",
    "ML": "Mali",
    "MM": "Myanmar",
    "MN": "Mongolia",
    "MO": "Macao",
    "MP": "Northern Mariana Islands",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MS": "Montserrat",
    "MT": "Malta",
    "MU": "Mauritius",
    "MV": "Maldives",
    "MW": "Malawi",
    "MX": "Mexico",
    "MY": "Malaysia",
    "MZ": "Mozambique",
    "NA": "Namibia",
    "NC": "New Caledonia",
    "NE": "Niger",
    "NF": "Norfolk Island",
    "NG": "Nigeria",
    "NI": "Nicaragua",
    "NL": "Netherlands",
    "NO": "Norway",
    "NP": "Nepal",
    "NR": "Nauru",
    "NU": "Niue",
    "NZ": "New Zealand",
    "OM": "Oman",
    "PA": "Panama",
    "PE": "Peru",
    "PF": "French Polynesia",
    "PG": "Papua New Guinea",
    "PH": "Philippines",
    "PK": "Pakistan",
    "PL": "Poland",
    "PM": "Saint Pierre And Miquelon",
    "PN": "Pitcairn",
    "PR": "Puerto Rico",
    "PS": "Palestinian Territory, Occupied",
    "PT": "Portugal",
    "PW": "Palau",
    "PY": "Paraguay",
    "QA": "Qatar",
    "RE": "Réunion",
    "RO": "Romania",
    "RU": "Russian Federation",
    "RW": "Rwanda",
    "SA": "Saudi Arabia",
    "SB": "Solomon Islands",
    "SC": "Seychelles",
    "SD": "Sudan",
    "SE": "Sweden",
    "SG": "Singapore",
    "SH": "Saint Helena",
    "SI": "Slovenia",
    "SK": "Slovakia",
    "SL": "Sierra Leone",
    "SM": "San Marino",
    "SN": "Senegal",
    "SO": "Somalia",
    "SR": "Suriname",
    "ST": "Sao Tome And Principe",
    "SV": "El Salvador",
    "SY": "Syrian Arab Republic",
    "SZ": "Swaziland",
    "TC": "Turks And Caicos Islands",
    "TD": "Chad",
    "TG": "Togo",
    "TH": "Thailand",
    "TJ": "Tajikistan",
    "TK": "Tokelau",
    "TL": "Timor-Leste",
    "TM": "Turkmenistan",
    "TN": "Tunisia",
    "TO": "Tonga",
    "TR": "Turkey",
    "TT": "Trinidad And Tobago",
    "TV": "Tuvalu",
    "TW": "Taiwan, Province Of China",
    "TZ": "Tanzania, United Republic Of",
    "UA": "Ukraine",
    "UG": "Uganda",
    "UM": "United States Minor Outlying Islands",
    "US": "United States",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VA": "Holy See (Vatican City State)",
    "VC": "Saint Vincent And The Grenadines",
    "VE": "Venezuela",
    "VG": "Virgin Islands, British",
    "VI": "Virgin Islands, U.S.",
    "VN": "Viet Nam",
    "VU": "Vanuatu",
    "WF": "Wallis And Futuna",
    "WS": "Samoa",
    "YE": "Yemen",
    "YT": "Mayotte",
    "YU": "Yugoslavia",
    "ZA": "South Africa",
    "ZM": "Zambia",
    "ZW": "Zimbabwe"
};
/**
 * accessToken:mqqmkt3LpMaeVKCPQYTWZJX1k0ASKF2K.waCBpE6dHN05Ajl4u3v2xZdUrevcE31FCUsE1tNaOoE
 nodeId:025cb553-7262-4399-96b9-263f7f4b3db1
 _search:true
 nd:1463123866297
 rows:15
 page:1
 sidx:
 sord:asc
 searchField:telNo
 searchString:1234
 searchOper:eq
 filters:
 * @param jqg_param
 */
function BuildOptions(jqg_param) {
    jqg_param = jqg_param || {};
    var options = {};
    if (jqg_param.sidx) {
        options.sort = {};
        options.sort[jqg_param.sord === 'asc' ? 'asc' : 'desc'] = jqg_param.sidx;
    }
    var rows = parseInt(jqg_param.rows) || 15;
    var pages = parseInt(jqg_param.page) || 1;
    options.start = rows * (pages - 1);
    options.count = rows;


    if (jqg_param._search && jqg_param.searchOper) {
        options.filters = {};
        options.filters.mandatory = {};
        var condition;
        switch (jqg_param.searchOper) {
            case 'eq': //等于
                options.filters.mandatory.exact = {};
                condition = options.filters.mandatory.exact;
                break;
            case 'cn'://包含
                options.filters.mandatory.contains = {};
                condition = options.filters.mandatory.contains;
                break;
            case 'bw'://begin with
                options.filters.mandatory.startsWith = {};
                condition = options.filters.mandatory.startsWith;
                break;
            case 'ew'://end with
                options.filters.mandatory.endsWith = {};
                condition = options.filters.mandatory.endsWith;
                break;
        }
        condition[jqg_param.searchField] = [];
        condition[jqg_param.searchField].push(jqg_param.searchString);
    }
    if (jqg_param.filters) {
        options.filters = options.filters || {};
        /*filters:{"groupOp":"OR","rules":[{"field":"name","op":"eq","data":"1234"},{"field":"name","op":"bw","data":"df"}]}*/
        try {
            var condition;

            var filters = eval("(" + jqg_param.filters + ")");
            if (filters.groupOp === 'AND') {
                options.filters.mandatory = options.filters.mandatory || {};
                condition = options.filters.mandatory;
            } else {
                options.filters.optional = options.filters.optional || {};
                condition = options.filters.optional;
            }
            _.each(filters.rules, function (rule_item) {
                switch (rule_item.op) {
                    case 'eq':
                        condition.exact = condition.exact || {};
                        condition.exact[rule_item.field] = [];
                        condition.exact[rule_item.field].push(rule_item.data);
                        break;
                    case 'cn':
                        condition.contains = condition.contains || {};
                        condition.contains[rule_item.field] = [];
                        condition.contains[rule_item.field].push(rule_item.data);
                        break;
                    case 'bw':
                        condition.startsWith = condition.startsWith || {};
                        condition.startsWith[rule_item.field] = [];
                        condition.startsWith[rule_item.field].push(rule_item.data);
                        break;
                    case 'ew':
                        condition.endsWith = condition.endsWith || {};
                        condition.endsWith[rule_item.field] = [];
                        condition.endsWith[rule_item.field].push(rule_item.data);
                        break;
                }
            });
        } catch (e) {
            console.error('error', e);
        }

    }
    return options;
}
/*
 sidx -> sortname
 sord -> sortorder
 page -> page
 rows -> rowNum
 */
function BuildQueryParam(req, query, callback) {

    var options = BuildOptions(req.query);

    return query.filter(options)
        .order(options)
        .page(options, callback);
}

function CreateQueryResult(count, req) {
    var rows = parseInt(req.query.rows || 20);
    return {
        page: req.query.page,
        total: parseInt((count + rows - 1) / rows),
        records: count
    }
}

//表格上来的数据
/*{
 name:
 memo:

 oper:add
 id: _empty
 parent_id:
 oper:edit:
 id:xxxx
 oper:del
 id:xxx
 }*/

function authorizeOrgMaster(req, isMaster, authFunc) {
    var userName = req.session && req.session.telNo;
    var master_nodeid = req.query.nodeid || req.query.nodeId || req.query.parentId;
    var this_nodeid;
    switch (req.body && req.body.oper) {
        case 'add':
            this_nodeid = req.body.parent_id || req.body.parentId;
            break;
        case 'del':
            this_nodeid = req.body.id;
            break;
        case 'edit':
            this_nodeid = req.body.id;
            break;
    }
    return authFunc(userName, (isMaster ? this_nodeid : master_nodeid)).then(function () {
        return {
            masterid: master_nodeid,
            thisid: this_nodeid,
            action: req.body.oper,
            value: req.body,
            query: req.query,
            user: userName,
            isSuper: (userName == '13900000000'),
            superID:'13900000000'
        };
    });
}

function reqDataProc(req) {
    var userName = req.session && req.session.telNo;
    var master_nodeid = req.query.nodeid || req.query.nodeId;
    var this_nodeid;
    switch (req.body && req.body.oper) {
        case 'add':
            this_nodeid = req.body.parent_id || req.body.parentId;
            break;
        case 'del':
            this_nodeid = req.body.id;
            break;
        case 'edit':
            this_nodeid = req.body.id;
            break;
    }

    return {
        masterid: master_nodeid,
        thisid: this_nodeid,
        action: req.body.oper,
        query: req.query,
        value: req.body,
        user: userName,
        isSuper:userName=='13900000000'
    };

}

function procPipeline(req, result) {
    if (req.query.searchField && req.query.searchOper) {
        var filter = {};
        switch (req.query.searchOper) {
            case 'ne':
                filter[req.query.searchField] = {$ne:req.query.searchString};
                break;
            case 'eq':
                filter[req.query.searchField] = req.query.searchString;
                break;
            case 'cn':
                filter[req.query.searchField] = new RegExp(req.query.searchString);
                break;
            case 'bw':
                filter[req.query.searchField] = new RegExp('^' + req.query.searchString);
                break;
            case 'ew':
                filter[req.query.searchField] = new RegExp(req.query.searchString + '$');
                break;
            default :
                filter[req.query.searchField] = req.query.searchString;
                break;
        }
        result.pipeline.push({
            $match: filter
        });
    }
    if (req.query.sidx) {
        var sort = {};
        sort[req.query.sidx] = (req.query.sord == 'asc') ? 1 : -1;
        result.pipeline.push({
            $sort: sort
        });
    }
    result.pipeline.push({
        $group: {
            _id: null,
            rows: {$push: result.pushObj},
            records: {$sum: 1},
            // total:1
        }

    });
    var rowsOfPage = parseInt(req.query.rows) || 500;
    var page = parseInt(req.query.page) || 1;
    page = (page<1)? 0: page -1 ;
    result.pipeline.push({
        $project: {
            _id: 0,
            rows: { $slice: [ '$rows', page*rowsOfPage , rowsOfPage ] },
            records: 1,
            total:{$ceil:{$divide: [ "$records",rowsOfPage ] }}
        }

    });
}

function procJQGridGetAggReq(req, res, createQuery, procResult) {
    Q(createQuery(reqDataProc(req))).then(function (result) {
        if(result.pipeline && result.pushObj){
            procPipeline(req, result);
            return result.module.aggregate(result.pipeline).exec().then(function (results) {
                var retObj = null ;
                // var rowsOfPage = parseInt(req.query.rows) || 15;
                if(util.isArray(results)){
                    retObj = results[0] ;
                }
                //retObj.total = (results[0] ? Math.ceil(results[0].rows.length / rowsOfPage) : 0);
                if (procResult && retObj) {
                    return Q(procResult(retObj.rows)).then(function (rows) {
                        retObj.rows = rows;
                        return retObj;
                    })
                } else {
                    return retObj ? retObj : results;
                }
            });
        }
        else{
            return Q(result);
        }


    }).then(function (results) {
        res.json(results || {success: true});
    }).catch(function (e) {
        res.status(500).end(e.message || e);
    });
}


/**
 * 处理jqGrid的get请求
 * @param req
 * @param res
 * @param asMaster   作为主表
 * @param authorizeFunc(userName,nodeId)  权限认证函数
 * @param createQuery(targetObj)  创建query的函数，返回一个Promise[query]
 * @param procResult(dataResult) 处理查询得到的数据的函数
 */
function procJQGridGetReq(req, res, asMaster, authorizeFunc, createQuery, procResult) {
    authorizeOrgMaster(req, asMaster, authorizeFunc).then(function (targetObj) {
        return createQuery(targetObj).then(function (queries) {

            var retObjInfo = {};

            return Q().then(function () {

                return async.each(queries, function (query) {
                    var defer = Q.defer();
                    BuildQueryParam(req, query.query, function (e, results) {
                        if (e) {
                            defer.reject(e.message || e);
                        } else {
                            defer.resolve({id: query.id, results: results});
                        }
                    });
                    return defer.promise;
                }).then(function (results) {

                    if (procResult) {
                        if (results && results.length == 1 && results[0].id === '__noid__') {
                            return Q(procResult(results[0].results.results)).then(function (rows) {
                                var total;
                                var rowsOfPage = parseInt(req.query.rows) || 15;

                                if (rows instanceof Array) {
                                    total = results[0].results.total;// Math.ceil( /rowsOfPage);
                                } else {
                                    total = rows.totalRecords;//Math.ceil( rows.totalRecords/rowsOfPage);
                                    rows = rows.data;
                                }


                                return {
                                    page: parseInt(req.query.page),
                                    total: Math.ceil(total / rowsOfPage),
                                    records: total,
                                    rows: rows
                                };
                            })

                        } else {
                            //retObjInfo.total = results.total;
                            return Q(procResult(results));
                        }
                    } else {
                        return {};
                    }

                })

            }).then(function (results) {

                res.json(results || {success: true});
            })

        }).catch(function (e) {
            res.status(500).end(e.message || e);
        });
    })
}

/**
 * 处理JqGrid的Post请求
 * @param req
 * @param res
 * @param authorizeFunc (userName,nodeId)  权限认证函数
 * @param processFunc(targetObj)  执行操作的函数
 */
function procJQGridPostReq(req, res, asMaster, authorizeFunc, processFunc) {
    authorizeOrgMaster(req, asMaster, authorizeFunc).then(function (targetObj) {
        return processFunc(targetObj);
    }).then(function (result) {
        res.json(result);
    }).catch(function (e) {
        // res.json({status:false,message:e.message || e});
        res.status(500).end(e.message || e);

    });
}

function createThumbnail(img_buffer, type) {
    return Q.denodeify(image.open)(img_buffer, type)
        .then(function (img) {
            var defer = Q.defer();
            if (img) {
                img.batch().resize(96, 96).exec(function (err, newImg) {

                    if (err) {
                        defer.reject(err);
                    } else {
                        newImg.toBuffer('png', function (error, buffer) {
                            if (error) {
                                defer.reject(error);
                            } else {
                                defer.resolve('data:image/png;base64,' + buffer.toString('base64'));
                            }
                        })
                    }
                });
            } else {
                defer.reject('没有文件');
            }
            return defer.promise;
        });
}


function createTemplateFromModule(module_netlist) {

}


function filterEndpointsByGroupId(groupId, endpoints) {
    if (!groupId || groupId === '.') {
        return endpoints;
    } else {
        return _.filter(endpoints, function (endpoint) {
            return (endpoint.groupId === groupId);
        })
    }
}

function filterEndpointsByGroupName(groupName, endpoints) {
    if (!groupId || groupName === '.') {
        return endpoints;
    } else {
        return _.filter(endpoints, function (endpoint) {
            return (endpoint.groupName === groupName);
        })
    }
}
/**
 * 获取houseId下所有的endpoints
 * @param houseId
 * @constructor
 */
// function Step2_GetAllEndpoints(houseId) {
//     var pineLine =// Pipeline
//         [
//             // Stage 1
//             {
//                 $match: {
//                     "uuid": houseId
//                 }
//             },
//
//             // Stage 2
//             {
//                 $project: {
//                     "uuid": 1,
//                     "groups": {
//                         "$concatArrays": [
//                             [
//                                 {
//
//                                     "name": "$name",
//                                     "devs": "$houseGroup.devs"
//                                 }
//                             ],
//                             "$groups"
//                         ]
//                     }
//                 }
//             },
//
//             // Stage 3
//             {
//                 $unwind: "$groups"
//             },
//
//             // Stage 4
//             {
//                 $unwind: "$groups.devs"
//             },
//
//             // Stage 5
//             {
//                 $lookup: {
//                     "from": "devicetypes",
//                     "localField": "groups.devs.devType",
//                     "foreignField": "deviceType",
//                     "as": "device"
//                 }
//             },
//
//             // Stage 6
//             {
//                 $unwind: "$device"
//             },
//
//             // Stage 7
//             {
//                 $unwind: "$device.endpoints"
//             },
//
//             // Stage 8
//             {
//                 $lookup: {
//                     "from": "productcatalogs",
//                     "localField": "device.endpoints.catalogId",
//                     "foreignField": "_id",
//                     "as": "productcatalog"
//                 }
//             },
//
//             // Stage 9
//             {
//                 $unwind: "$productcatalog"
//             },
//
//             // Stage 10
//             {
//                 $project: {
//                     "groupName": "$groups.name",
//                     "groupId": "$groups._id",
//                     "devName": "$groups.devs.name",
//                     "devType": "$groups.devs.devType",
//                     "endpoint": "$endpoints.no",
//                     "catalog": "$productcatalog.catalog",
//                     "func": {
//                         "$filter": {
//                             "input": "$productcatalog.funcs",
//                             "as": "func",
//                             "cond": {
//                                 "$eq": [
//                                     "$$func._id",
//                                     "$device.endpoints.funcId"
//                                 ]
//                             }
//                         }
//                     }
//                 }
//             },
//
//             // Stage 11
//             {
//                 $unwind: "$func"
//             },
//
//             // Stage 12
//             {
//                 $project: {
//                     "groupName": 1,
//                     "groupId": 1,
//                     "devName": 1,
//                     "devType": 1,
//                     "endpoint": 1,
//                     "catalog": 1,
//                     "func": "$func.func",
//                     "access": "$func.access"
//                 }
//             }
//
//         ];
//     return HouseModel.aggregate(pineLine).exec().then(function (result) {
//         return result[0];
//     })
// }
/**
 * 将endpoints根据options指定的要求分类
 * @param endpoints  所有的要分类的endpoints数据
 *[{
    uuid:xxx,     任意，只要是唯一的
    groupName:xxx,  分组的名称
    groupId:xxx,    组的id号，如果在houseGroup上，就是.
    devName:xxx,    设备在组内的名称
    devType:xxx,    设备类型
    endpoint:xxx,   endpoint端点号
    catalog:xxx     endpoint的分类
    func:xxx         endpoin的功能分类
    access:xxx      读写方式
    }]
 * @param options
 *      catalog
 *      funcs
 *      pin
 *      dir
 *
 */
function Step3_classifyEndpoints(endpoints, option) {

    _.each(endpoints, function (endpoint) {
        var toCheck = true;
        //模块的输出引脚略过 endpoint中只读的
        if (option.dir == 'fromModule' && !endpoint.access.test(/w/i)) {
            toCheck = false;
        }
        if (toCheck) {
            if (option.catalog == endpoint.catalog || option.catalog === '*') { //catalog匹配
                if (!option.funcs || option.funcs.length === 0 || option.funcs.indexOf(endpoint.func) >= 0) {
                    if (!endpoint.matched) {
                        endpoint.matched = [];
                    }
                    endpoint.matched.push({pin: option.pin, dir: option.dir});
                }
            }
        }

    })
}
// function Step4_getBoundInfo(sceneId) {
//     var pineline = [
//         // Stage 1
//         {
//             $match: {
//                 uuid: sceneId
//             }
//         },
//
//         // Stage 2
//         {
//             $project: {
//                 dir: {$literal: ['toModule', 'fromModule']},
//                 in_pin: '$bindConfig.in_pin',
//                 out_pin: '$bindConfig.out_pin'
//             }
//         },
//
//         // Stage 3
//         {
//             $unwind: '$dir'
//         },
//
//         // Stage 4
//         {
//             $project: {
//                 dir: 1,
//                 pin: {$cond: {if: {$eq: ['$dir', 'toModule']}, then: '$in_pin', else: '$out_pin'}}
//             }
//         },
//
//         // Stage 5
//         {
//             $unwind: '$pin'
//         },
//
//         // Stage 6
//         {
//             $unwind: '$pin.epBound'
//         },
//
//         // Stage 7
//         {
//             $project: {
//                 _id: 0,
//                 groupId: '$pin.epBound.groupId',
//                 nameInGroup: '$pin.epBound.nameInGroup',
//                 deviceType: '$pin.epBound.deviceType',
//                 ep: '$pin.epBound.ep',
//                 dir: '$dir',
//                 pin: '$pin.pin'
//             }
//         }
//
//     ]
//     return HouseScene.aggregate(pineline).exec().then(function (result) {
//         return result[0];
//     })
// }
/**
 *
 * @param endpoints
 *
 * [{
    uuid:xxx,     任意，只要是唯一的
    groupName:xxx,  分组的名称
    groupId:xxx,    组的id号，如果在houseGroup上，就是.
    devName:xxx,    设备在组内的名称
    devType:xxx,    设备类型
    endpoint:xxx,   endpoint端点号
    catalog:xxx     endpoint的分类
    func:xxx         endpoin的功能分类
    access:xxx      读写方式
    }]
 * @param markedInfo
 *
 * [{groupId:String,devName:String,devType:String, endpoint:Number,dir:xxx,pin:xxx}]
 */
function Step5_markConnectEndpoints(endpoints, markedInfo) {

    _.each(endpoints, function (endpoint) {

        if (_.find(markedInfo, function (item) {
                return (item.groupId == endpoint.groupId && item.devName == endpoint.devName
                && item.devType == endpoint.devType);
            })) {
            if (!endpoint.connected) {
                endpoint.connected = [];
            }
            endpoint.connected.push({pin: item.pin, dir: item.dir});

        }
    })
}
// function Step6_getScenePinLogic(sceneId) {
//     var pipeLine = [
//         // Stage 1
//         {
//             $match: {
//                 uuid: '607dec3a-c2fb-42ea-b0a0-70a8a333933b'
//             }
//         },
//
//         // Stage 2
//         {
//             $lookup: {
//                 "from": "moduledefs",
//                 "localField": "module_def",
//                 "foreignField": "uuid",
//                 "as": "module"
//             }
//         },
//
//         // Stage 3
//         {
//             $unwind: '$module'
//         },
//
//         // Stage 4
//         {
//             $project: {
//                 dir: {$literal: ['toModule', 'fromModule']},
//                 in_pin: '$module.in_pin',
//                 out_pin: '$module.out_pin'
//             }
//         },
//
//         // Stage 5
//         {
//             $unwind: '$dir'
//         },
//
//         // Stage 6
//         {
//             $project: {
//                 dir: 1,
//                 pin: {$cond: {if: {$eq: ['$dir', 'toModule']}, then: '$in_pin', else: '$out_pin'}}
//             }
//         },
//
//         // Stage 7
//         {
//             $unwind: '$pin'
//         },
//
//         // Stage 8
//         {
//             $project: {
//                 _id: 0,
//                 dir: 1,
//                 pin: '$pin.pin',
//                 logic: '$pin.defBinder.pinLogic'
//             }
//         }
//
//     ];
//     return HouseScene.aggregate(pipeLine).exec().then(function (result) {
//         return result[0];
//     })
// }

function authOrg(userName, nodeId) {
    //获取当前用户是否在nodeId里，具有管理员权限
    return Q.resolve(true);
    /*
     return Q().then(function(){
     return  userName === 'superme' || OrgInfo.findOne({telNo:userName,uuid:nodeId,isSuper:true}).then(function(){
     if(result)
     return Q.resolve(true);
     else{
     return Q.reject({id:8,message:'No rights'});
     }
     })
     })
     */
}

function routerAuth(req, res, next) {
    if(req.session && req.session.telNo){
        next();
    }
    else {
        res.status(401).end();
    }
}

module.exports = {
    ProcGetReq: procJQGridGetReq,
    ProcGetAggReq: procJQGridGetAggReq,
    ProcPostReq: procJQGridPostReq,
    BuildOptions: BuildOptions,
    createThumbnail: createThumbnail,
    classifyEndpoints: Step3_classifyEndpoints,
    markConnectEndpoints: Step5_markConnectEndpoints,
    filterEndpointsByGroupId: filterEndpointsByGroupId,
    filterEndpointsByGroupName: filterEndpointsByGroupName,
    // getAllEndpoints: Step2_GetAllEndpoints,
    // getScenePinLogic: Step6_getScenePinLogic,
    defultAuthOrg:authOrg,
    routerAuth:routerAuth,
    locale: locale
};