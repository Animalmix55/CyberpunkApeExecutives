<?php
    require_once __DIR__ . "/../vendor/autoload.php";
    require_once __DIR__ . '/../utils/whitelist.php';
    require_once __DIR__ . '/../utils/apeContract.php';

    function processRequest() {
        try {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'GET':
                    if (isset($_GET['address'])) {
                        return getWhitelist($_GET['address']);
                    }
                    break;
                case 'POST':
                case 'PUT':
                default:
                     break;
            }
            http_response_code(404);
        } catch (Exception $e) {
            http_response_code(500);
            die('An error occurred');
        }
    }

    function getWhitelist($address) {
        $presaleWhitelist = getPresaleWhitelist();
        
        $presaleWhitelistLength = count($presaleWhitelist);

        $result = 0;

        for ($i = 0; $i < $presaleWhitelistLength; $i++) {
            if (strtolower($presaleWhitelist[$i]->address) === strtolower($address)) {
                $result += $presaleWhitelist[$i]->amount;
            }
        }

        if ($result == 0) return 0;

        $alreadyMinted = whitelistMints($address);
        $result = max($result - $alreadyMinted, 0);
        
        echo $result;
        return;
    }

    processRequest();
?>