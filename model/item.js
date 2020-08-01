
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/brainstorm',{useNewUrlParser: true});
mongoose.set('useFindAndModify',false);

var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));

db.once('open',function(){
 console.log("Connection to MongoDB database successfully established");
});

var itemSchema = new mongoose.Schema({
   itemCode: {type: Number,required: true},
   itemName: {type: String,required: true},
   catalogCategory: {type: String,required: true},
   description: {type: String,required: true},
   rating: {type: Number,required: true},
   imgUrl: {type: String,required: true}
},{collection:'ItemData'});

class Item {
    
    constructor(itemCode, itemName, catalogCategory, description, rating, imgUrl) {
        this._itemCode = itemCode;
        this._itemName = itemName;
        this._catalogCategory = catalogCategory;
        this._description = description;
        this._rating = rating;
        this._imgUrl = imgUrl;
    }


    get itemCode() {
        return this._itemCode;
    }

    set itemCode(value) {
        this._itemCode = value;
    }

    get itemName() {
        return this._itemName;
    }

    set itemName(value) {
        this._itemName = value;
    }

    get catalogCategory() {
        return this._catalogCategory;
    }

    set catalogCategory(value) {
        this._catalogCategory = value;
    }


    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get rating() {
        return this._rating;
    }

    set rating(value) {
        this._rating = value;
    }

    get imgUrl() {
        return this._imgUrl;
    }

    set imgUrl(value) {
        this._imgUrl = value;
    }

}

module.exports.Item = Item;
module.exports.ItemModel = mongoose.model('ItemData',itemSchema);