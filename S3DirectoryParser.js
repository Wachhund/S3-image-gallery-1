(function(djiaak, $, undefined) {
		//parses an xml bucket listing. returns all files

		//caching stuff
		var _lastBaseUrl;
		var _lastResults;
		
    djiaak.S3DirectoryParser = function() {
        var _isUrlMatch = function(url) {
       		return url.charAt(url.length-1)!=='/';
        }
        
        var _parseDirectoryListing = function(html, baseUrl) {
            var toReturn = [];
            var $contents = $(html).find('Contents');
            $contents.each(function() {
                var path = $(this).find('Key').text();
                if (_isUrlMatch(path)) {
                    toReturn.push({
                    		key: path,
                        src: baseUrl + path, 
                        text: path
                    });
                }
            });
            _lastBaseUrl = baseUrl;
            _lastResults = toReturn;
            return toReturn;
        }
	
        var _parseDirectoryFromUrl = function(baseUrl, callback) {
        		if (_lastBaseUrl === baseUrl) {
        			callback(_lastResults);
        		} else {
		          $.get(baseUrl, null, function(result) {
		              callback(_parseDirectoryListing(result, baseUrl));
		          }, 'xml');
            }
        };
	
        return {
            parseDirectoryFromUrl: _parseDirectoryFromUrl
        };
        
    }
}(window.djiaak = window.djiaak || {}, jQuery));
