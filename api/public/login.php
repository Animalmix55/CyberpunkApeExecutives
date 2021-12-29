<?php
    require_once __DIR__ . "/../vendor/autoload.php";

    require_once __DIR__ . '/../utils/secrets.php'; 
    require_once __DIR__ . '/../utils/jwt.php';

    use Firebase\JWT\JWT;
    use Web3\Utils;
    use Elliptic\EC;
    use kornrunner\Keccak;

    function pubKeyToAddress($pubkey) {
        return "0x" . substr(Keccak::hash(substr(hex2bin($pubkey->encode("hex")), 1), 256), 24);
    }

    function verifySignature($message, $signature, $address) {
        $msglen = strlen($message);
        $hash   = Keccak::hash("\x19Ethereum Signed Message:\n{$msglen}{$message}", 256);
        $sign   = ["r" => substr($signature, 2, 64), 
                   "s" => substr($signature, 66, 64)];
        $recid  = ord(hex2bin(substr($signature, 130, 2))) - 27; 
        if ($recid != ($recid & 1)) 
            return false;
    
        $ec = new EC('secp256k1');
        $pubkey = $ec->recoverPubKey($hash, $sign, $recid);
    
        return $address == pubKeyToAddress($pubkey);
    }

    function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    function processRequest() {
        try {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'POST':
                    $json = file_get_contents('php://input');
                    $data = json_decode($json);
    
                    if (property_exists($data, 'address')) {
                        return login($data->address);
                    } else if (property_exists($data, 'token') && property_exists($data, 'signature')){
                        return get_credentials($data->token, $data->signature);
                    }
                    break;
                case 'OPTIONS':
                    return;
                    break;
                case 'GET':
                case 'PUT':
                default:
                    break;
            }
            http_response_code(404);
        } catch (Exception $e) {
            http_response_code(500);
            die('An error occured');
        }
    }

    function login($address) {
        $utils = new Utils();
        if (!$utils->isAddress($address)) {
            http_response_code(500);
            echo 'Invalid address';
            return;
        }

        $randomString = generateRandomString();
        $time = time();
        
        $payload = array(
            "iss" => getSecret('web_root'),
            "aud" => getSecret('web_root'),
            "iat" => $time,
            "exp" => $time + 3 * 60, // 3 minutes later
            "address" => $address,
            "message" => "Sign this message in order to log into the presale mint. Ignore this: " . $randomString,
        );

        $jwt = JWT::encode($payload, getSecret('jwt_private_login_message'), 'HS256');
        $result = array();

        $result['token'] = $jwt;
        $result['message'] = $payload['message'];

        http_response_code(200);
        echo json_encode($result);
    }

    function get_credentials($token, $signature) {
        // decoding checks exp
        try {
            $decoded_jwt = JWT::decode($token, getSecret('jwt_private_login_message'), array_keys(JWT::$supported_algs));
        } catch (Exception $e) {
            http_response_code(401);
            echo $e;
            return;
        }

        $address = strtolower($decoded_jwt->address);
        $message = $decoded_jwt->message;

        $valid = false;
        try {
            $valid = verifySignature($message, $signature, $address);
        } catch (Exception $e) {
            echo $e;
        };

        if (!$valid) {
            http_response_code(401);
            echo "Invalid signature";
            return;
        }

        $loginJWT = createLoginToken($address);
        echo $loginJWT;
        http_response_code(200);

        return;
    }

    processRequest();
?>