(function(djiaak, $, undefined) {
	djiaak.S3ThumbnailGenerator = function(width, height, pathPrefix) {
		var _width = width;
		var _height = height;
		var _pathPrefix = pathPrefix;
	
		var _imageResizer = djiaak.ImageResizer();
	
		var _isThumbnail = function(filename) {
			return filename.indexOf(_pathPrefix)===0;
		};
		
		var _thumbnailToFilename = function(thumbnailFilename) {
			if (_isThumbnail(thumbnailFilename)) {
				return thumbnailFilename.substr(_pathPrefix.length);
			}
			return null;
		};
		
		var _filenameToThumbnail = function(filename) {
			return _pathPrefix + filename + "." + width + "x" + height + ".jpg";
		};
		
		var _dirToThumbnailDir = function(dir) {
			return _pathPrefix + dir;
		};
		
		var _generateThumbnail = function(img) {
			return _imageResizer.resizeImage(img, _width, _height);
		};
		
		var _generateThumbnailAsync = function(img, callback) {
			if (img.complete) {
				callback(_generateThumbnail(img));
			} else {
				img.onload = function() {
					callback(_generateThumbnail(img));
				}
			}
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
