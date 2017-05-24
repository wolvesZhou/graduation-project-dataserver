/**
 * Created by zwf on 17-4-23.
 */

var mongoose = require("mongoose");	//	顶会议用户组件
var Schema = mongoose.Schema;	//	创建模型
var orderScheMa = new Schema({
    //orderUser:String,
    orderTel:String,
    receiveUser:String,
    receiveTel:String,
    address:String,
    message:String,
    petName:String,
    petFrom:String,
    petPrice:Number,
    isDone:Boolean
});	//	定义了一个新的模型，但是此模式还未和users集合有关联
exports.orderModel = mongoose.model('orderModel', orderScheMa);