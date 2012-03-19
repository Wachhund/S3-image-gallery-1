(function(djiaak, $, undefined) {
	djiaak.ImageResizer = function() {     
    var _resizeImage = function(img, targetWidth, targetHeight) {
			var sourceAspect = img.width / img.height;
			var targetAspect = targetWidth / targetHeight;
		      var newWidth, newHeight;
			if (sourceAspect>targetAspect) {
				newWidth = targetWidth;
				newHeight = targetWidth / sourceAspect;
			} else {
				newWidth = targetHeight * sourceAspect;
				newHeight = targetHeight;
			}
      var canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      var dataUri = canvas.toDataURL("image/jpg");
      return {
      	blob: _dataURItoBlob(dataUri),
      	dataUri: dataUri
      };
    };
  
    var _dataURItoBlob = function(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var bb;
        if (typeof BlobBuilder !== 'undefined')
            bb = new BlobBuilder();
        else if (typeof WebKitBlobBuilder !== 'undefined')
            bb = new WebKitBlobBuilder();
        else if (typeof MozBlobBuilder !== 'undefined')
            bb = new MozBlobBuilder();
        else
            throw 'BlobBuilder not supported';
        bb.append(ab);
        return bb.getBlob(mimeString);
    }
  
  
    return {
        resizeImage: _resizeImage  
    };
};
}(djiaak = djiaak || {}, jQuery));

