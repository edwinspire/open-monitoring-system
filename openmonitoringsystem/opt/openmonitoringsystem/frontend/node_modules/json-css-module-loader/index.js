const path = require('path');
const JSON_EXT = '.json';

module.exports = function(source, sourceMap) {
	const fileName = this.resourcePath;
	const formatExt = path.extname(fileName);

	// There can be double ext, ie. file.css.json
	const strippedFileName = path.basename(fileName, formatExt);
	const optionalSecondExt = path.extname(strippedFileName);

	let outputSource;
	let value;

	if (formatExt === JSON_EXT) {
		value = typeof source === "string" ? JSON.parse(source) : source;
		outputSource = `module.exports = ${JSON.stringify(value)}`

	} else {
		value = source.trim();
		outputSource = value;
	}

	// Remove the extension, will be .css / .scss  / .styl etc...
	// now to be picked up by other loaders
	const extRegExp = new RegExp(optionalSecondExt + formatExt + '$');
	const cssFileName = fileName.replace(extRegExp, '.css');

	this.cacheable && this.cacheable();
	this.value = [ value ];

	var output = `require('${cssFileName.replace(/\\/g, '/')}');\n${outputSource};`;

	return output;
}
