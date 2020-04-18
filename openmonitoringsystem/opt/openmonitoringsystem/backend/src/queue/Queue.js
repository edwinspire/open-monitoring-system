const EventEmitter = require('events');


module.exports = class Queue extends EventEmitter {

	constructor(limit, maxMinutes){

		super();
		this.limit = limit || 2000;
		this.maxMinutes = maxMinutes || 2000;
		this.received = new Map(); 
		this.rejected = new Map();
		this.processed = new Map();
		this.expired = new Map();
		this.queuedate = new Map();

		this.status = {
			RECEIVED: 0,
			REJECTED: 1,
			PROCESSED: 2,
			EXPIRED: 3,
			UNKNOW: -1
		}

	}

	forEach(status, callback){

		switch(status){
			case this.status.RECEIVED:
			return this.received.forEach(callback);
			break;
			case this.status.REJECTED:
			return this.rejected.forEach(callback);
			break;
			case this.status.PROCESSED:
			return this.processed.forEach(callback);
			break;
			case this.status.EXPIRED:
			return this.expired.forEach(callback);
			break;
		}

	}

	set(key, value){
		return this._set(key, value, this.status.RECEIVED)
	}

	modify(key, value, status){
		let r;
		let qvalue;
		switch(status){
			case this.status.RECEIVED:
			r = this._set(key, value, this.status.RECEIVED);
			break;
			case this.status.REJECTED:
			r = this._set(key, value, this.status.REJECTED);
			break;
			case this.status.PROCESSED:
			r = this._set(key, value, this.status.PROCESSED);
			break;
			case this.status.EXPIRED:
			r = this._set(key, value, this.status.EXPIRED);
			break;
		}
		qvalue = this.get(key);

		if(r && qvalue){
			this.emit('modify', {data: qvalue, status: status});		
		}

		return r;
	}

	get(key){
		let r;
		if(this.received.has(key)){
			r = this.received.get(key);
			this._delete_duplicates(this.status.RECEIVED, key);
		}else if(this.rejected.has(key)){
			r = this.rejected.get(key);
			this._delete_duplicates(this.status.REJECTED, key);
		}else if(this.processed.has(key)){
			r = this.processed.get(key);
			this._delete_duplicates(this.status.PROCESSED, key);
		}else if(this.expired.has(key)){
			r = this.expired.get(key);
			this._delete_duplicates(this.status.EXPIRED, key);
		}
		return r;
	}

	_set(key, value, status){
		let r;
		switch(status){
			case this.status.RECEIVED:
			this._delete_duplicates(this.status.RECEIVED, key);
			r = this.received.set(key, value);	
			break;
			case this.status.REJECTED:
			this._delete_duplicates(this.status.REJECTED, key);
			r =  this.rejected.set(key, value);
			break;
			case this.status.PROCESSED:
			this._delete_duplicates(this.status.PROCESSED, key);
			r =  this.processed.set(key, value);
			break;
			case this.status.EXPIRED:
			this._delete_duplicates(this.status.EXPIRED, key);
			r =  this.expired.set(key, value);
			break;
		}
		this.queuedate.set(key, Date.now());		
		return r;
	}

	_toExpired(){
// no probado
		this.queuedate[Symbol.iterator] = function* () {
			yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
		}

		this.queuedate.forEach((_date, key, map)=>{
			if(_date.setMinutes(_date.getMinutes() + this.maxMinutes) < Date.now()){
				let reg = this.get(key);
				this.modify(reg, this.status.EXPIRED);
			}
		});

	}

	_delete_duplicates(skipMap, key){

		switch(skipMap){
			case this.status.RECEIVED: 
			//this.received.delete(key);
			this.rejected.delete(key);
			this.processed.delete(key);
			this.expired.delete(key);
			break;
			case this.status.REJECTED: 
			this.received.delete(key);
			//this.rejected.delete(key);
			this.processed.delete(key);
			this.expired.delete(key);
			break;
			case this.status.PROCESSED: 
			this.received.delete(key);
			this.rejected.delete(key);
			//this.processed.delete(key);
			this.expired.delete(key);
			break;
			case this.status.EXPIRED: 
			this.received.delete(key);
			this.rejected.delete(key);
			this.processed.delete(key);
			//this.expired.delete(key);
			break;
			default: 
			this.received.delete(key);
			this.rejected.delete(key);
			this.processed.delete(key);
			this.expired.delete(key);
			break;			
		}

	}

};