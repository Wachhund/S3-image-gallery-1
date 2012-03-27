(function(djiaak, $, undefined) {
	djiaak.StandardDirLister = function(url) {
		var _url = url;
		
		var _parseDirectoryListing = function(html) {
			var files = [];
			var $html = $(html);
			$html.find('a,A').each(function() {
				var filename = $(this).attr('href') || $(this).attr('HREF');
				files.push(djiaak.FileUtils.getFilename(filename));		
			});
			
			return files;
		};
		
		var _list = function(settings, callback) {
			$.get(url, settings, function(result) {
          callback(_parseDirectoryListing(result));
      });
		};
			
		var _listFilesDirs = function(dir, callback) {
			$.get(_url + dir, null, function(result) {
				var data = _parseDirectoryListing(result); 
				var filesDirs = {
					files: [],
					dirs: []
				};
				for (var i=0; i<data.length; i++) {
					var f = data[i];
					if (f!==djiaak.FileUtils.getFilename(djiaak.FileUtils.getParentDir(dir))) {
						if (f.charAt(f.length-1)==='/') {
							filesDirs.dirs.push(dir + f);
						} else {
							filesDirs.files.push(dir + f);
						}
					}
				}
				callback(filesDirs);
			});
					
		};	
	
		return {
			list: _list,
			listFilesDirs: _listFilesDirs
		};
		
	};
}(window.djiaak = window.djiaak || {}, jQuery));
