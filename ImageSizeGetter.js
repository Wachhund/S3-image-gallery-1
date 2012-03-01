(function(djiaak, $, undefined) {
    djiaak.ImageSizeGetter = function(defaultWidth, defaultHeight) {
        var _defaultWidth = defaultWidth;
        var _defaultHeight = defaultHeight;
	
        var _getImageDimensions = function(image, imageType) {
            var toReturn = {};
            try {
                var view = new jDataView(image);
                if (imageType==="jpg") {
                    var i=0;
                    var bl = view.getUint16(i,false);
                    i+=2;

                    if (bl!==0xFFD8) throw "This is not a JPEG file";
				
                    while (true) {
                        while (bl!==0xFF) {
                            bl = view.getUint8(i, false);
                            i+=1;
                        }
                        while (bl===0xFF) {
                            bl = view.getUint8(i, false);
                            i+=1;
                        }
                        if (bl>=0xC0 && bl<=0xC3) {
                            i+=3;
                            toReturn.height = view.getUint16(i,false);
                            i+=2;
                            toReturn.width = view.getUint16(i,false);
                            i+=2;
						
                            break;
                        } else {
                            i+=view.getUint16(i,false);
                        }
                    }
                } else if (imageType==="gif") {
                    view.seek(6);
                    toReturn.width = view.getUint16();
                    toReturn.height = view.getUint16();
                } else if (imageType==="png") {
                    toReturn.width = view.getUint32(16,false);
                    toReturn.height = view.getUint32(20,false);
                }
            } catch (ex) {
                return {
                    width: _defaultWidth,
                    height: _defaultHeight
                };
            }
            return toReturn;
        };
	
        var _getImageDimensionsFromUrl = function(url, callback) {
            var request = new XMLHttpRequest();
            request.overrideMimeType('text/plain; charset=x-user-defined');
            request.onreadystatechange = function() {
                switch(request.readyState) {
                    case 0: // Uninitialized
                        break;
                    case 1: // open() called
                        request.setRequestHeader("Range", "bytes=0-50000");
                        break;

                    case 2: // Request sent
                        break;

                    case 3: // Data received
                        break;

                    case 4: // Completed
                        var data = request.responseText;
                        var dim = _getImageDimensions(data, 'jpg');
                        callback(dim);
                        break;
                }
            }
            request.open('GET', url, true);
            request.send();
        };
	
        return {
            getImageDimensions: _getImageDimensions,
            getImageDimensionsFromUrl: _getImageDimensionsFromUrl
        };
    }
}(window.djiaak = window.djiaak || {}, jQuery));