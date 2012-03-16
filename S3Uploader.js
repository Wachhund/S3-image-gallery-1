(function(djiaak, $, undefined) {
	djiaak.S3Uploader = function(config) {
    var _upload = function(file, filename, success, failure) {
        var fd = new FormData();
        fd.append("key", filename);
        fd.append("AWSAccessKeyId", config['AWSAccessKeyId']);
        fd.append("acl", config['acl']);
        fd.append("policy", config['policy']);
        fd.append("signature", config['signature']);
        fd.append("file", file);

        var xhr = new XMLHttpRequest();

        //req.addEventListener("progress", updateProgress, false);  
        xhr.addEventListener("load", function(e) {
            success();
        }, false);  
        xhr.addEventListener("error", function(e) {
            failure();
        }, false);  
        xhr.addEventListener("abort", function(e) {
            failure();
        }, false);

        xhr.open("POST", "https://dj-public.s3.amazonaws.com/");
        xhr.send(fd);  
    };
    
    return {
      upload: _upload  
    };
	};
}(djiaak = djiaak || {}, jQuery));
