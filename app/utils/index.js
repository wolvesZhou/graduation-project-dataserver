
var Q = require('q');
var _ = require('underscore');
var async = require('async-q');
var util = require('util');
var image = require('lwip');

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

function BuildQueryParam(req, query, callback) {

    var options = BuildOptions(req.query);

    return query.filter(options)
        .order(options)
        .page(options, callback);
}


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
    defultAuthOrg:authOrg,
    routerAuth:routerAuth,

};