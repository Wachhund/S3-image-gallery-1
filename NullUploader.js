(function(djiaak, $, undefined) {
	djiaak.NullUploader = function(config) {
    var _upload = function(file, filename, success, failure) {
			success();
	  };
    
    return {
      upload: _upload  
    };
	}; 
}(djiaak = djiaak || {}, jQuery));
