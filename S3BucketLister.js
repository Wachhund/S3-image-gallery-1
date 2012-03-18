(function(djiaak, $, undefined) {
	djiaak.S3BucketLister = function(url) {
		var _url = url;
		
		var _parseDirectoryListing = function(html) {
			var toReturn = {
				contents: [],				
				commonPrefixes: []
			};
			var $html = $(html);
			$html.find('Contents').each(function() {
				var $e = $(this);
				toReturn.contents.push({
					key: $e.find('Key').text(),
					lastModified: $e.find('LastModified').text(),
					etag: $e.find('ETag').text(),
					size: $e.find('Size').text(),
					storageClass: $e.find('StorageClass').text()
				});		
			});
			
			$html.find('CommonPrefixes').each(function() {
				toReturn.commonPrefixes.push($(this).find('Prefix').text());
			});

			return toReturn;
		};
		
		var _list = function(settings, callback) {
			$.get(url, settings, function(result) {
          callback(_parseDirectoryListing(result));
      });
		};
			
		var _listFilesDirs = function(dir, callback) {
			_list({
				prefix: dir,
				delimiter: '/'
				}, function(data) {
					callback({
						files: $.map(data.contents, function(val) {
							return val.key;
						}),
						dirs: data.commonPrefixes
					});
				}
			);
		};	
	
		return {
			list: _list,
			listFilesDirs: _listFilesDirs
		};
		
	};
}(window.djiaak = window.djiaak || {}, jQuery));
