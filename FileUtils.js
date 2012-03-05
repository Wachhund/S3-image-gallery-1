(function(djiaak, $, undefined) {
	djiaak.FileUtils = { 
		getFilename: function(str) {
			return str.substring(str.lastIndexOf('/')+1);
		},
		getFilePath: function(str) {
			return str.substring(0, str.lastIndexOf('/')+1);
		}
	};
}(window.djiaak = window.djiaak || {}, jQuery));
