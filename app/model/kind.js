/**
 * Created by zwf on 17-4-9.
 */


var mongoose = require("mongoose");	//	顶会议用户组件
var Schema = mongoose.Schema;	//	创建模型
var kindScheMa = new Schema({
    kindname: String
});	//	定义了一个新的模型，但是此模式还未和users集合有关联
exports.kindModel = mongoose.model('kindModel', kindScheMa);