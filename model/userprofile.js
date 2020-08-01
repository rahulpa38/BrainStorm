//var UserDB = require('../utility/UserDB');
var UserItem = require('../model/useritem');

class UserProfile{

	constructor(userId){
		this._userId = userId;
		this._userList = [];
	}

	get userId(){
		return this._userId;
	}
	set userId(value){
		this._userId = value;
	}

	get userlist(){
		return this._userList;
	}
	set userlist(value){
		this._userList = value;
	}


	    addItem(userItem) {
	        if (userItem instanceof UserItem) {
	            this._userList.push(userItem);
	        } else {
	            //console.log('Object is not of type UserItem')
	        }
	    }

	    removeItem(userItem) {
	        if (userItem instanceof UserItem) {
	            this._userList.filter(function (item) {
	                return item != userItem;
	            });
	        } else {
	            //console.log('Object is not of type UserItem')
	        }
	    }

	    updateItem(userItem) {
	        if (userItem instanceof UserItem) {
	            const index = this._userList.findIndex((e) => e.item.itemCode === userItem.item.itemCode);
	            if (index === -1) {
	                //console.log('User has not added this item to the list');
	            } else {
	                this._userList[index] = userItem;
	            }
	        } else {
	           // console.log('Object is not of type UserItem')
	        }
	    }

	    getItems() {
	        return this._userList;
	    }

	    emptyProfile() {
	        this.userList = [];
	    }

}

module.exports = UserProfile;
