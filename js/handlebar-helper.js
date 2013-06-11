// JavaScript Document for handlebar helper

(function (root, factory) {
if (typeof exports === 'object') {
	// Node. Does not work with strict CommonJS, but
	// only CommonJS-like enviroments that support module.exports,
	// like Node.
	module.exports = factory(require('handlebars'));
} else if (typeof define === 'function' && define.amd) {
	// AMD. Register as an anonymous module.
	define(['handlebars'], factory);
} else {
	// Browser globals (root is window)
	root.returnExports = factory(root.Handlebars);
}
}(this, function (Handlebars) {

	//helper function for comaprision
	 Handlebars.registerHelper('if_eq', function(context, options) {
		if (context == options.hash.compare)
			return options.fn(this);
		else
			return options.inverse(this);
	});

	// handlebar helper for showing tweet time using moment.js
	Handlebars.registerHelper('get_date_time', function(created_at) {
		var rtn_date = moment(created_at).fromNow();
		if(rtn_date.indexOf("days") < 0)
			return rtn_date;
		else 
			return moment(created_at).fromNow();
	});

	//handlebar helper for making clickabe links,hashtags,etc
	Handlebars.registerHelper('twityfy', function(text) {
		var chn_text = parseTwit(text);
		return new Handlebars.SafeString( chn_text );
	
	});

}));