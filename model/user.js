
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  userId: {type:Number,required:true},
  password:{type:String},
  firstName: {type:String},
  lastName: {type:String},
  emailid:{type:String},
  address1:{type:String},
  address2:{type:String},
  city:{type:String},
  state:{type:String},
  zipCode:{type:String},
  country:{type:String},
  user_item:[{
    itemName:{type:String},
    itemCode:{type:Number,required:true},
    rating:{type:Number},
    catalogCategory:{type:String},
    madeIt:{type:String}
  }]
},{collection:'UserData'});

class User{


   constructor(userId,firstName,lastName,emailid,address1,address2,city,state,zipCode,country){
     this._userId = userId;
     this._firstName = firstName;
     this._lastName = lastName;
     this._emailid =  emailid;
     this._address1 = address1;
     this._address2 = address2;
     this._city = city;
     this._state = state;
     this._zipCode = zipCode;
     this._country = country;
   }

   /*
   * Getters and Setters
   */

   get userId() {
       return this._userId;

   }

   set userId(value) {
       this._userId = value;

   }

   get firstName() {
       return this._firstName;
   }

   set firstName(value) {
       this._firstName = value;
   }

   get lastName() {
       return this._lastName;
   }

   set lastName(value) {
       this._lastName = value;
   }

   get emailid() {
       return this._emailid;
   }

   set emailid(value) {
       this._emailid = value;
   }

   get address1() {
       return this._address1;
   }

   set address1(value) {
       this._address1 = value;
   }

   get address2() {
       return this._address2;
   }

   set address2(value) {
       this._address2 = value;
   }

   get city() {
       return this._city;
   }

   set city(value) {
       this._city = value;
   }

   get state() {
       return this._state;
   }

   set state(value) {
       this._state = value;
   }

   get zipCode() {
       return this._zipCode;
   }

   set zipCode(value) {
       this._zipCode = value;
   }

   get country() {
       return this._country;
   }

   set country(value) {
       this._country = value;
   }
}

module.exports.User = User;
module.exports.UserModel = mongoose.model('UserData',userSchema);
