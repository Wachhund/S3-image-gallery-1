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

if len(sys.argv) != 7:
	sys.exit("invalid arguments. usage: {0}\nsecret key: {1}".format(generatepolicydocument('argv[1]','argv[2]','argv[3]','argv[4]','argv[5]'), 'argv[6]'))

policy = base64.b64encode(generatepolicydocument(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]))

signature = base64.b64encode(
    hmac.new(sys.argv[6], policy, sha).digest())
    
print("policy:{0}\nsignature:{1}\n".format(policy,signature))

