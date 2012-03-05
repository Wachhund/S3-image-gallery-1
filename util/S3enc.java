
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import sun.misc.BASE64Encoder;

public class S3enc {
	private static String generatePolicyDocumentString(String expiration, 
	String bucket, 
	String keyStartsWith, 
	String acl, 
	String successActionRedirect, 
	String contentLengthRangeMax) {
		return "{'expiration': '" + expiration + "'," +
              "'conditions': [ " +
                "{'bucket': '" + bucket + "'}, " +
                "['starts-with', '$key', '" + keyStartsWith + "']," +
                "{'acl': '" + acl + "'}," +
                "['content-length-range', 0, " + contentLengthRangeMax + "]" +
              "]" +
            "}";
	}

    public static void main(String[] args) throws UnsupportedEncodingException, NoSuchAlgorithmException, InvalidKeyException {
    	if (args.length!=7) {
    		System.out.println("usage:\n" + generatePolicyDocumentString("args[0]","args[1]","args[2]","args[3]","args[4]","args[5]"));
    		System.out.println("\nsecret key: args[6]");
    		return;
    	}
        String policy_document = generatePolicyDocumentString(args[0],args[1],args[2],args[3],args[4],args[5]);
        String aws_secret_key = args[6];
        
        String policy = (new BASE64Encoder()).encode(
                policy_document.getBytes("UTF-8")).replaceAll("\n", "").replaceAll("\r", "");

        Mac hmac = Mac.getInstance("HmacSHA1");
        hmac.init(new SecretKeySpec(
                aws_secret_key.getBytes("UTF-8"), "HmacSHA1"));
        String signature = (new BASE64Encoder()).encode(
                hmac.doFinal(policy.getBytes("UTF-8"))).replaceAll("\n", "");
        System.out.println("policy:" + policy);
        System.out.println("signature:" + signature);
    }
}
