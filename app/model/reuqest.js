/**
 * Created by zwf on 17-4-19.
 */

var mongoose = require("mongoose");	//	顶会议用户组件
var Schema = mongoose.Schema;	//	创建模型
var requestScheMa = new Schema({
    username: String,
    telno: String,
    request:String,
    isDone:Boolean
});	//	定义了一个新的模型，但是此模式还未和users集合有关联
exports.requestModel = mongoose.model('requestModel', requestScheMa);