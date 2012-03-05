(function(djiaak, $, undefined) {
    djiaak.ImageViewModes = {
        scale: 'scale',
        original: 'original'
    };

    djiaak.FullscreenImageViewer = function(config) {
        var _config = $.extend({
            mainImageTag: null,
            browserTag: null,
            browserTemplate: null,
            nextImageTag: null,
            prevImageTag: null,
            url: '/',
            imageTags: [],
            browserHighlightTag: null,
            imageViewMode: djiaak.ImageViewModes.original,
            directoryParser: null,
            fileDirMatcher: null,
            thumbnailGenerator: null,
            fileUploader: null
        },
        config || {});

        var _images, _other, _thumbnails;
        var _currentImageIndex = -1;
        var _preloadCount = 1;
        var _currentImage;

				var _elementInViewport = function(el) {
					var top = el.offsetTop;
					var left = el.offsetLeft;
					var width = el.offsetWidth;
					var height = el.offsetHeight;
		
					while(el.offsetParent) {
						el = el.offsetParent;
						top += el.offsetTop;
						left += el.offsetLeft;
					}
		
					return (top < (window.pageYOffset + window.innerHeight) &&
							left < (window.pageXOffset + window.innerWidth) &&
							(top + height) > window.pageYOffset &&
							(left + width) > window.pageXOffset);
				};

        var _handleResize = function() {
            _config.browserTag.css('left', ($(window).width() - _config.browserTag.outerWidth()) / 2);
            _config.nextImageTag.add(_config.prevImageTag).css('top', ($(window).height() - _config.prevImageTag.outerWidth()) / 2);
            _scaleImage();
        };

        var _setCurrentImageIndex = function(index) {
            _currentImageIndex = index;
            _loadCurrentImage();
        };

        var SCALE_IMAGE_RETRY_MAX = 10;
        var _scaleImageRetryCurrent = 0;

        var _scaleImage = function() {
            if (!_currentImage || !_currentImage.attr('src')) return;
            if (!_currentImage.width() || !_currentImage.height()) {
				_currentImage.css('left', 0).css('top', 0).css('width', '').css('height', '');
                if (_scaleImageRetryCurrent < SCALE_IMAGE_RETRY_MAX) {
                    _scaleImageRetryCurrent++;
                    setTimeout(function() {
                        _scaleImage();
                    },
                    100);
                } else {
                    _scaleImageRetryCurrent = 0;
                }
            } else {
                if (_config.imageViewMode === djiaak.ImageViewModes.scale) {

                    } else {
                    if (_currentImage.width() < $(window).width())
                    _currentImage.css('left', ($(window).width() - _currentImage.width()) / 2);

                    if (_currentImage.height() < $(window).height())
                    _currentImage.css('top', ($(window).height() - _currentImage.height()) / 2);
                }
            }
        };

        var _loadCurrentImage = function() {
            if (_currentImageIndex > -1) {
                var toHide;
                if (!_currentImage || _currentImage === _config.imageTags[0]) {
                    _currentImage = _config.imageTags[1];
                    toHide = _config.imageTags[0];
                }
                else {
                    _currentImage = _config.imageTags[0];
                    toHide = _config.imageTags[1];
                }

                _currentImage.attr("src", _images[_currentImageIndex].fullSrc).fadeIn(200);
                toHide.fadeOut(200);
                _scaleImage();

                var toHighlight = _config.browserTag.find('.browser-image-container').filter(function() {
                    return $(this).data("index") === _currentImageIndex;
                }).find('.browser-image');
                _config.browserHighlightTag.show();
                _config.browserHighlightTag.css("width", toHighlight.innerWidth()).css("height", toHighlight.innerHeight());

                var left = toHighlight.position().left - (_config.browserHighlightTag.outerWidth() - _config.browserHighlightTag.width()) / 2;
                var top = toHighlight.position().top - (_config.browserHighlightTag.outerHeight() - _config.browserHighlightTag.height()) / 2;
                _config.browserHighlightTag.animate({
                    left: left,
                    top: top
                },
                500);
            }
        };
        
        var _getThumbnail = function(src) {
        	var thumbnailSrc = _config.thumbnailGenerator.generateThumbnailFilename(src);
        	for (var i=0; i<_thumbnails.length; i++) {
        		if (_thumbnails[i].fullSrc === thumbnailSrc) return _thumbnails[i];
        	}
        	return null;
        };
        
        //check which thumbnails have become visible, and load or generate them
        var _thumbnailsScroll = function() {
        	var $currentTag = _config.browserTag.find('.browser-image-container:first');
        	var index = parseInt($currentTag.data('index'), 10);
        	var item = _images[index];
        	var thumbnail = _getThumbnail(item.fullSrc);
        	if (thumbnail) {
        		$currentTag.find('.browser-image').attr('src', thumbnail.fullSrc);
        	} else {
        		var img = new Image();
        		img.src = item.fullSrc;
        		_config.thumbnailGenerator.generateThumbnailAsync(img, function(result) {
        			_config.fileUploader.upload(result, _config.thumbnailGenerator.generateThumbnailFilename(item.key), function() {
        				//success
        			}, function() {
        				//failure
        			});
        		});
        	}
        };

				//all items have been loaded, so bind html containers
        var _bindTemplates = function() {
            $.template(_config.browserTemplate.attr('id'), _config.browserTemplate);
            $.tmpl(_config.browserTemplate.attr('id'), _images).appendTo(_config.browserTag);
            _config.browserTag.css('height', _config.thumbnailHeight + 20);

            _config.browserTag.find('.browser-image').click(function() {
                var index = parseInt($(this).closest('.browser-image-container').data("index"), 10);
                _setCurrentImageIndex(index);
            });
            _config.browserTag.append(_config.browserHighlightTag);
						
						_thumbnailsScroll();
        };
        
        var _generateItem = function(input, index) {
       		return {
       			key: input.key,
        		path: window.location.pathname + '?path=' + input.src,
        		fullSrc: input.src,
        		browserWidth: _config.thumbnailGenerator.getWidth(),
        		browserHeight: _config.thumbnailGenerator.getHeight(),
        		index: index
        	};
        	
        };

        var _parseDirectory = function(callback) {
            _config.directoryParser.parseDirectoryFromUrl('/',
            function(result) {
							var items =	_config.fileDirMatcher.match(result, _config.url);
                _images = [];
                _other = [];
                _thumbnails = [];
                var fileIndex = 0;
               	for (var i= 0; i<items.files.length; i++) {
               		var file = items.files[i];
               		if (_config.thumbnailGenerator.isThumbnail(file.src)) {
               			_thumbnails.push(_generateItem(file, 0));
               		} else {
	               		_images.push(_generateItem(file, fileIndex++));
               		}
               	}
               	for (var i= 0; i<items.dirs.length; i++) {
               		_other.push(_generateItem(items.dirs[i], i));
               	}
               	
                
                if (callback) callback();
            });
        };

        var _nextImage = function() {
            if (_currentImageIndex < _images.length - 1)
            _setCurrentImageIndex(_currentImageIndex + 1);
        };

        var _prevImage = function() {
            if (_currentImageIndex > 0)
            _setCurrentImageIndex(_currentImageIndex - 1);
        };

        var _bindGlobalEvents = function() {
            $(window).resize(function() {
                _handleResize();
            });

            _config.browserTag.mouseover(function() {
                _config.browserTag.stop().fadeTo(100, 1.0);
            }).mouseout(function() {
                _config.browserTag.stop().fadeTo(100, 0.2);
            }).mouseout();

            _config.nextImageTag.add(_config.prevImageTag).mouseover(function() {
                _config.nextImageTag.add(_config.prevImageTag).stop().fadeTo(100, 1.0);
            }).mouseout(function() {
                _config.nextImageTag.add(_config.prevImageTag).stop().fadeTo(100, 0.2);
            }).mouseout();

            _config.nextImageTag.click(function() {
                _nextImage();
            });
            _config.prevImageTag.click(function() {
                _prevImage();
            });
        };

        var _init = function() {
            _parseDirectory(function() {
                _bindTemplates();
                _bindGlobalEvents();
                _handleResize();
            });

        };

        return {
            init: _init
        }
    }
} (window.djiaak = window.djiaak || {},
jQuery));
