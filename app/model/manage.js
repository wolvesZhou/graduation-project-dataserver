/**
 * Created by zwf on 17-5-24.
 */

var mongoose = require("mongoose");	//	顶会议用户组件
var Schema = mongoose.Schema;	//	创建模型
var userScheMa = new Schema({
    manageno: String,
    managepas: String
});	//	定义了一个新的模型，但是此模式还未和users集合有关联
exports.manageModel = mongoose.model('manageModel', userScheMa);