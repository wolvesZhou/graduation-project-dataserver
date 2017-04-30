/**
 * Created by zwf on 17-3-14.
 */

var mongoose = require("mongoose");	//	顶会议用户组件
var Schema = mongoose.Schema;	//	创建模型
var userScheMa = new Schema({
    telno: String,
    password: String
});	//	定义了一个新的模型，但是此模式还未和users集合有关联
exports.userModel = mongoose.model('userModel', userScheMa);