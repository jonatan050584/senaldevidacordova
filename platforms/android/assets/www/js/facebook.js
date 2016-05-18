var Facebook = function(){

	this.info = null;

	this.init = function(){
		facebookConnectPlugin.browserInit('100412800363577');
	}

	this.getStatus = function(callback){
		facebookConnectPlugin.getLoginStatus(function(obj){
			if(obj.status == "connected"){
				callback(true);
			}else{
				callback(false);
			}
		}, function(err){
			callback(false);
		});
	}
	
	this.myInfo = function(callback){
		facebookConnectPlugin.api("/me?fields=email,first_name,last_name", null, function(info){
			
			info.pic = null;

			facebookConnectPlugin.api('/me/picture?width=200&height=200&redirect=0',null,function(res){  	
				//console.log(res);
				if(!res.data.is_silhouette){
					info.pic = res.data.url;
				}
				facebook.info = info;
				callback(info);
			},function(error){
				//console.log(error);
			});

		}, function(e){
			//console.log(e);
		});
	}

	this.login = function(callback){
		facebookConnectPlugin.login(["public_profile", "email"], function(obj){
			if(obj.status == "connected"){
				callback(true);
			}else{
				callback(false);
			}
		}, function(err){
			callback(false);
		});
	}
	
}