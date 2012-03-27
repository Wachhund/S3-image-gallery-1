(function(djiaak, $, undefined) {
	djiaak.DummyThumbnailGenerator = function(width, height, resizeFunc) {
		var _width = width;
		var _height = height;
		var _resizeFunc = resizeFunc;
	
		var _isThumbnail = function(filename) {
			return false;
		};
		
		var _thumbnailToFilename = function(thumbnailFilename) {
			return null;
		};
		
		var _filenameToThumbnail = function(filename) {
			return null;
		};
		
		var _dirToThumbnailDir = function(dir) {
			return null;
		};
		
		var _generateThumbnail = function(img) {
			return _resizeFunc(img, _width, _height);
		};
		
		var _generateThumbnailAsync = function(imageUrl, callback) {
			var img = new Image();
			
			img.onload = function() {
				callback(_generateThumbnail(img));
			}
			img.onerror = function() {
				callback(null);
			}
			
			img.src = imageUrl;
		};
		
		return {
			generateThumbnailAsync: _generateThumbnailAsync,
			filenameToThumbnail: _filenameToThumbnail,
			dirToThumbnailDir: _dirToThumbnailDir,
			getThumbnailFilename: _thumbnailToFilename,
			isThumbnail: _isThumbnail,
			getWidth: function() { return _width; },
			getHeight: function() { return _height; }
			
		};
	};
}(djiaak = djiaak || {}, jQuery));
