#!/usr/bin/env python
# file: s3enc.py
import base64
import hmac, sha
import sys

def generatepolicydocument(expiration, bucket, keyprefix, acl, contentlengthrangemax):
	return """{{'expiration': '{0}',
	'conditions': [ 
		{{'bucket': '{1}'}}, 
		['starts-with', '$key', '{2}'],
		{{'acl': '{3}'}},
		['content-length-range', 0, {4}]
	]
}}""".format(expiration, bucket, keyprefix, acl, contentlengthrangemax)

def generatejson(accesskeyid, acl, policy, signature, thumbnailpath):
	return """
if (typeof djiaak === 'undefined') djiaak = {{}};
djiaak.settings = {{
	s3 : {{
		'AWSAccessKeyId': '{0}',
		'acl': '{1}',
		'policy': '{2}',
		'signature': '{3}'
	}},
	thumbnailPath: '{4}'
}};
""".format(accesskeyid, acl, policy, signature, thumbnailpath)

if len(sys.argv) != 8:
	sys.exit("invalid arguments. usage: s3enc.py [expiration] [bucket] [thumbnail path prefix] [acl] [content max size] [aws access key id] [aws secret key]")

policy = base64.b64encode(generatepolicydocument(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]))

signature = base64.b64encode(
    hmac.new(sys.argv[7], policy, sha).digest())
    
print(generatejson(sys.argv[6], sys.argv[4], policy, signature, sys.argv[3]))

