var dotty = require('dotty');

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
	var parts = [path];
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
	data = get_data(data);
	if(data[0]){
		return data[0];
	}
	else{
		return data;
	}
}

function get_models(context, data){
	data = get_data(data);
	if(data[0]){
		return data;
	}
	else{
		[data];
	}
}

function wrapper(data, basepath, isproperty){
	if(typeof(basepath)==='boolean'){
		isproperty = basepath;
		basepath = '';
	}
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
		else if(arguments.length===1){
			if(isproperty){
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