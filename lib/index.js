var constants  = require("./constants");
var formatUrl  = require("./format");
var getOptions = require("./options");
var objUtils   = require("./util/object");
var parseUrl   = require("./parse");
var relateUrl  = require("./relate");



function RelateUrl(from, options)
{
	this.instanceOptions = getOptions(options,
	{
		defaultPorts: {ftp:21, http:80, https:443},
		directoryIndexes: ["index.html"],
		ignore_www: false,
		output: RelateUrl.SHORTEST,
		rejectedSchemes: ["data","javascript","mailto"],
		removeAuth: false,
		removeDirectoryIndexes: true,
		removeEmptyQueries: false,
		schemeRelative: true,
		slashesDenoteHost: true
	});
	
	this.from = parseUrl.from(from, this.instanceOptions, null);
}



/*
	Usage: instance=new RelateUrl(); instance.relate();
*/
RelateUrl.prototype.relate = function(from, to, options)
{
	// relate(to,options)
	if ( objUtils.isObject(to) )
	{
		options = to;
		to = from;
		from = null;
	}
	// relate(to)
	else if (!to)
	{
		to = from;
		from = null;
	}
	
	options = getOptions(options, this.instanceOptions);
	from = parseUrl.from(from, options, this.from);
	
	if (!from || !from.href)
	{
		throw new Error("from value not defined.");
	}
	else if (from.extra.hrefInfo.minimumPathOnly)
	{
		throw new Error("from value supplied is not absolute: "+from.href);
	}
	
	to = parseUrl.to(to, options);
	
	if (to.valid===false) return to.href;
	
	to = relateUrl(from, to, options);
	to = formatUrl(to, options);
	
	return to;
}



/*
	Usage: RelateUrl.relate();
*/
RelateUrl.relate = function(from, to, options)
{
	var instance = new RelateUrl(from, options);
	
	return instance.relate(to);
}



// Make constants accessible from API
for (var i in constants)
{
	if ( constants.hasOwnProperty(i) )
	{
		RelateUrl[i] = constants[i];
	}
}



module.exports = RelateUrl;