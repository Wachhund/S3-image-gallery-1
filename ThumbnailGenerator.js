(function(djiaak, $, undefined) {
	djiaak.ThumbnailGenerator = function(width, height) {
		var _width = width;
		var _height = height;
	
		var _imageResizer = djiaak.ImageResizer();
		var _thumbnailPrefix = ".thumbnail";
	
		var _isThumbnail = function(filename) {
			return djiaak.FileUtils.getFilename(filename).indexOf(_thumbnailPrefix)===0;
		};
		
		var _generateThumbnailFilename = function(filename) {
			return djiaak.FileUtils.getFilePath(filename) + _thumbnailPrefix + "." + width + "x" + height + "." + djiaak.FileUtils.getFilename(filename) + ".jpg";
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
			generateThumbnailFilename: _generateThumbnailFilename,
			isThumbnail: _isThumbnail,
			getWidth: function() { return _width; },
			getHeight: function() { return _height; }
			
		};
	};
}(djiaak = djiaak || {}, jQuery));
