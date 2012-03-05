(function(djiaak, $, undefined) {
	//iterates through a list of S3 objects and returns the items which are
	//either images or directories containing images
	djiaak.S3FileDirMatcher = function(fileExtensions) {
	var _fileExtensions = fileExtensions || [ '.jpg', '.gif', '.png', '.jpeg' ];
		var _endsWith = function(str, suffix) {
			return str.indexOf(suffix, str.length - suffix.length) !== -1
		};
		
		var _isExtensionMatch = function(str) {
			for (var i=0; i<_fileExtensions.length; i++) {
				if (_endsWith(str.toLowerCase(), _fileExtensions[i])) {
					return true;
				}
			}
			return false;
		};
		
			
		var _getFilenameOnly = function(str) {
			if (_isExtensionMatch(str)) {
				return djiaak.FileUtils.getFilename(str);
			};
			return null;
		};
		
		var _isValidFile = function(str, path) {
			var filename = _getFilenameOnly(str);
			if (!filename) return false;
			return path === str.substring(0, str.length - filename.length);
		};
	
		
		var _getFileDir = function(str) {
			return str.substring(0, str.lastIndexOf('/') + 1);
		};

		var _match = function(items, url) {
			var files = [];
			var dirs = [];
			for (var i=0; i<items.length; i++) {
				var item = items[i];
				if (_isValidFile(item.src, url)) {
					files.push(item);
				}
				if (_isExtensionMatch(item.src)) {
					var dir = _getFileDir(item.src);
					if (dir && !$.inArray(dir, dirs)) {
						dirs.push(item);
					}	
				}
				

			}

			return {
				files: files,
				dirs: dirs
			};
		};
		
		return {
			match: _match
		};
	};
}(djiaak = djiaak || {}, jQuery));
