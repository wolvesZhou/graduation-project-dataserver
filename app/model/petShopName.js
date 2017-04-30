/**
 * Created by zwf on 17-4-6.
 */


var mongoose = require("mongoose");	//	顶会议用户组件
var Schema = mongoose.Schema;	//	创建模型


var userScheMa = new Schema({
    useraccount: String,
    username: String,
    createTime:{type: Date, default: Date.now},
    isSuper:Boolean,
    remarks:String
});

var manageScheMa = new Schema({
    manageaccount: String,
    managename: String,
    createTime:{type: Date, default: Date.now},
    isSuper:Boolean,
    remarks:String
});

var petScheMa = new Schema({
    petname: String,
    kind: String,
    icon:String,
    variety:String,
    sex:String,
    age:Number,
    price:Number
});


var petShopScheMa = new Schema({
    shopname: String,
    address: String,
    createTime:{type: Date, default: Date.now},
    remarks:String,
    user:[userScheMa],
    manage:[manageScheMa],
    pets:[petScheMa]
});	//	定义了一个新的模型，但是此模式还未和users集合有关联
exports.petShopModel = mongoose.model('petShopModel', petShopScheMa);