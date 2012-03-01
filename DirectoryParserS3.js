(function(djiaak, $, undefined) {
    djiaak.DirectoryParserS3 = function() {
        var _isUrlMatch = function(url, dest) {
            if (dest.length<url.length)
                return false;
            
            var indexOfSlash = dest.substr(url.length).indexOf('/');
            return dest !== url &&  
            dest.substr(0, url.length) === url && 
            (indexOfSlash === dest.length - url.length - 1 || indexOfSlash === -1);
        }
        
        var _parseDirectoryListing = function(html, url) {
            var toReturn = [];
            var $contents = $(html).find('Contents');
            $contents.each(function() {
                var path = $(this).find('Key').text();
                if (_isUrlMatch(url, path)) {
                    toReturn.push({
                        src: '/' + path, 
                        text: path
                    });
                }
            });
               
            return toReturn;
        }
	
        var _parseDirectoryFromUrl = function(url, baseUrl, callback) {
            $.get(baseUrl, null, function(result) {
                callback(_parseDirectoryListing(result, url.substr(1)));
            }, 'xml');
        };
	
        return {
            parseDirectoryFromUrl: _parseDirectoryFromUrl
        };
        
    }
}(window.djiaak = window.djiaak || {}, jQuery));