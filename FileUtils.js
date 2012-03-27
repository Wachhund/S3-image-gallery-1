(function(djiaak, $, undefined) {
	djiaak.FileUtils = { 
	
		getFilename: function(filename) {
			var getFilenameOnly = function(str) {
				return str.substring(str.lastIndexOf('/')+1);
			}
			
			if (filename.charAt(filename.length-1)==='/') {
				filename = getFilenameOnly(filename.substr(0,filename.length-1)) + '/';
			} else {
				filename = getFilenameOnly(filename);
			}
			return filename;
		},
		getFilePath: function(str) {
			return str.substring(0, str.lastIndexOf('/')+1);
		},
		getParentDir: function(str) {
			var index = str.lastIndexOf('/');
			var parentIndex = str.substr(0, index).lastIndexOf('/');
			return str.substr(0,parentIndex) + '/';
		}
	};
}(window.djiaak = window.djiaak || {}, jQuery));
