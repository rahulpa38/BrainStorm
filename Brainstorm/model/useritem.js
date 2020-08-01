
//var UserDB = require('../utility/UserDB');

class UserItem{
  constructor(itemCode,itemName,rating,madeIt,catalogCategory){
    this._itemCode = itemCode;
    this._itemName = itemName;
    this._rating = rating;
    this._madeIt = madeIt;
    this._catalogCategory = catalogCategory;
  }

  get catalogCategory(){
    return this._catalogCategory;
  }
  set catalogCategory(value){
    this.catalogCategory = value;
  }
  get itemCode(){
    return this._itemCode;
  }
  set itemCode(value){
    this.userId = itemCode;
  }
  get itemName() {
      return this._itemName;
  }

  set itemName(value) {
      this._itemName = value;
  }

  get rating() {
      return this._rating;
  }

  set rating(value) {
      this._rating = value;
  }

  get madeIt() {
      return this._madeIt;
  }

  set madeIt(value) {
      this._madeIt = value;
  }
}

module.exports = UserItem;
