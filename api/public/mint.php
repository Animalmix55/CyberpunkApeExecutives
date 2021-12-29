<?php
    require_once __DIR__ . "/../vendor/autoload.php";

    use kornrunner\Keccak;
    use Elliptic\EC;
    
    require_once __DIR__ . '/../utils/secrets.php';
    require_once __DIR__ . '/../utils/jwt.php';
    require_once __DIR__ . '/../utils/apeContract.php';
    require_once __DIR__ . '/../utils/whitelist.php';
    
    function signMessage(string $message) {
        $ec = new EC('secp256k1');

        $ecPrivateKey = $ec->keyFromPrivate(getSecret('web3_signer_private'), 'hex');
        $message = hex2bin(substr($message, 2));
        $message = "\x19Ethereum Signed Message:\n" . strlen($message) . $message;

        $hash = Keccak::hash($message, 256);

        $signature = $ecPrivateKey->sign($hash, ['canonical' => true]);

        $r = str_pad($signature->r->toString(16), 64, '0', STR_PAD_LEFT);
        $s = str_pad($signature->s->toString(16), 64, '0', STR_PAD_LEFT);
        $v = dechex($signature->recoveryParam + 27);

        return "0x$r$s$v";
    }

    function processRequest() {
        try {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'POST':
                    $json = file_get_contents('php://input');
                    $data = json_decode($json);
        
                    if(isset($data->quantity) && isset($data->token)) {
                        return getMintCredentials($data->quantity, $data->token);
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

    function getMintCredentials(int $quantity, string $token) {
        if ($quantity <= 0) {
            echo "Invalid quantity";
            http_response_code(500);
            return;
        }

        $address = "";
        try {
            $address = validateLoginToken($token);
        } catch (Exception $e) {
            echo "Invalid credentials";
            http_response_code(401);
            return;
        }

        $nonce = getLastNonce($address) + 1; // GET NONCE BEFORE COUNTS
        $alreadyMinted = whitelistMints($address);

        $presaleWhitelistCount = presaleCount($address) - $alreadyMinted['presale'];
        if ($presaleWhitelistCount < $quantity) {
            http_response_code(401);
            echo "Cannot mint more than allowed, max $presaleWhitelistCount";
            return;
        }

        $hash = getMintHash($address, $quantity, $nonce);
        $signature = signMessage($hash);

        $result = array();
        $result['signature'] = $signature;
        $result['nonce'] = $nonce;
        echo json_encode($result);
    }

    processRequest();
?>