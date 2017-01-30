// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "dojo/request"], function(lang, request){
	lang.extend(request, {
		hostName: 'www.farmaenlace.com:8093',
		omsPost: function(target, options){
			if(this.hostName && this.hostName.length > 0){
				target = this.hostName+'/'+target;
			}
			return this.post(target, options);
		}
		
		
		
		
	});
});
