var dotty = require('dotty');

module.exports = wrapper;

function valuereader(model, name){
  if(!name){
  	return model;
  }
  return dotty.get(model, name);
}

function valuesetter(model, value, name){
	if(!name){
  	return value;
  }
  dotty.put(model, name, value);
  return value;
}

function makepath(path, base){
	var parts = [];
	if(path){
		parts.push(path);
	}
	if(base){
		parts.unshift(base);
	}
	return parts.join('.');
}

function get_data(context, data){
	if(typeof(data)==='function'){
		data = data.apply(context);
	}
	return data;
}

function get_model(context, data){
	data = get_data(context, data);
	if(data && data[0]){
		return data[0];
	}
	else{
		return data;
	}
}

function get_models(context, data){
	data = get_data(context, data);
	if(data && data[0]){
		return data;
	}
	else{
		return [data];
	}
}


function wrapper(data, basepath, type){
	if(typeof(type)==='boolean'){
		type = 'primitive';
	}
	if(type=='remove'){
		return function(path){
			var self = this;
			var usepath = makepath(path, basepath);
			var models = get_models(self, data) || [];
			models.forEach(function(model){
				dotty.remove(model, usepath);
			})	
			return self;
		}	
	}
	else if(type=='array:add'){
		return function(val){
			var self = this;
			var models = get_models(self, data) || [];
			models.forEach(function(model){
				var arr = dotty.get(model, basepath) || [];
				var found = false;
		    arr.forEach(function(a){
		    	if(a==val){
		    		found = true;
		    	}
		    })
		    if(!found){
		    	arr.push(val);	
		    }
				dotty.put(model, basepath, arr);
			})
		}
	}
	else if(type=='array:remove'){
		return function(val){
			var self = this;
			var models = get_models(self, data) || [];
			models.forEach(function(model){
				var arr = (dotty.get(model, basepath) || []).filter(function(v){
					return v!=val;
				})
				dotty.put(model, basepath, arr);
			})
		}
	}
	else if(type=='array:has'){
		return function(val){
			var self = this;
			var model = get_model(self, data);
			if(!model){
				return false;
			}
			var arr = (dotty.get(model, basepath) || []).filter(function(v){
				return v==val;
			})
			return arr.length>0;
		}
	}
	else if(type=='has'){
		return function(path){
			var self = this;
			var model = get_model(self, data);
			if(!model){
				return false;
			}
			var usepath = makepath(path, basepath);
			return valuereader(model, usepath) ? true : false;
		}
	}
	else if(type=='is'){
		return function(val){
			var self = this;
			var model = get_model(self, data);
			if(!model){
				return false;
			}
			var v = valuereader(model, basepath);
			return v==val;
		}
	}
	else{
		return function(path, val){
			var self = this;
			var model = get_model(self, data);
			var models = get_models(self, data) || [];

			if(arguments.length<=0){
	      if(!model){
	      	return null;
	      }
				return valuereader(model, basepath);
			}
			else if(arguments.length==1){
				if(type=='primitive'){
					models.forEach(function(model){
						valuesetter(model, path, basepath);
					})
					return self;
				}
				else{
					if(typeof(path)==='string'){
						if(!model){
							return null;
						}
						return valuereader(model, makepath(path, basepath));
					}
					else{
						models.forEach(function(model){
							valuesetter(model, path, basepath);
						})
						return self;
					}
				}
			}
			else if(arguments.length>1){
				var usepath = makepath(path, basepath);
				models.forEach(function(model){
					valuesetter(model, val, usepath);
				})
				return self;	
			}
		}
	}
	
}