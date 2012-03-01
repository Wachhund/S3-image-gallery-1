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
            thumbnailWidth: 64,
            thumbnailHeight: 64,
            imageTags: [],
            browserHighlightTag: null,
            imageViewMode: djiaak.ImageViewModes.original
        },
        config || {});

        var _images,
        _other;
        var _currentImageIndex = -1;
        var _preloadCount = 1;
        var _thumbnailSuffix = ".thumb_" + _config.thumbnailWidth + 'x' + _config.thumbnailHeight + '.jpg';
        var _currentImage;

        var _handleResize = function() {
            _config.browserTag.css('left', ($(window).width() - _config.browserTag.outerWidth()) / 2);
            _config.nextImageTag.add(_config.prevImageTag).css('top', ($(window).height() - _config.prevImageTag.outerWidth()) / 2);
            _scaleImage();
        };

        var _getImageType = function(fileName) {
            var src = fileName.toLowerCase();
            if (src.match(/\.jpg$/) || src.match(/\.jpeg$/)) {
                return 'jpg';
            } else if (src.match(/\.gif$/)) {
                return 'gif';
            } else if (src.match(/\.png$/)) {
                return 'png';
            }
            return null;
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

        var _bindTemplates = function() {
            $.template(_config.browserTemplate.attr('id'), _config.browserTemplate);
            $.tmpl(_config.browserTemplate.attr('id'), _images).appendTo(_config.browserTag);
            _config.browserTag.css('height', _config.thumbnailHeight + 20);

            _config.browserTag.find('.browser-image').click(function() {
                var index = parseInt($(this).closest('.browser-image-container').data("index"), 10);
                _setCurrentImageIndex(index);
            });
            _config.browserTag.append(_config.browserHighlightTag);

        };

        var _parseDirectory = function(callback) {
            var parser = new djiaak.DirectoryParserS3();
            parser.parseDirectoryFromUrl(_config.url, '/',
            function(result) {
                _images = [];
                _other = [];
                var imageIndex = 0;
                for (var i = 0; i < result.length; i++) {
                    result[i].path = window.location.pathname + '?path=' + result[i].src;
                    result[i].browserSrc = result[i].src;
                    result[i].fullSrc = result[i].src;
                    result[i].browserWidth = _config.thumbnailWidth;
                    result[i].browserHeight = _config.thumbnailHeight;
                    var type = _getImageType(result[i].src);
                    if (type) {
                        result[i].index = imageIndex++;
                        _images.push(result[i]);
                    } else {
                        _other.push(result[i]);
                    }
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