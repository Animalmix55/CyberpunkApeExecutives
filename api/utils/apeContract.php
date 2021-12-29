<?php
    require_once __DIR__ . '/secrets.php';
    use Web3\Contract;

    function getApeContract() {
        return new Contract(getSecret('web3_provider'), file_get_contents(realpath(__DIR__ . '/../data/ape_abi.json')));
    }

    function getLastNonce(string $address) {
        global $nonce;

        $contract = getApeContract();
        $nonce;

        $contractAddress = getSecret('ape_contract_address');
        if ($contractAddress == false) die('Missing address');
        
        $contract->at($contractAddress)->call('lastMintNonce', $address, function($err, $n) use(&$nonce) {
            if ($err) {
                echo "Could not communicate with chain";
                http_response_code(500);
                exit();
            }
            $nonce = $n;
        });

        return intVal($nonce[0]->toString(), 10);
    }

    function getMintHash(string $minter, int $quantity, int $nonce) {
        $contract = getApeContract();
        $hash = '';

        $contractAddress = getSecret('ape_contract_address');
        if ($contractAddress == false) die('Missing address');
        
        $contract->at($contractAddress)->call('getPremintHash', $minter, $quantity, $nonce, function($err, $h) use(&$hash) {
            if ($err) {
                echo "Could not communicate with chain";
                http_response_code(500);
                exit();
            }
            $hash = $h;
        });

        return strVal($hash[0]);
    }

    function whitelistMints(string $address) {
        $contract = getApeContract();
        $result = array();

        $result = -1;

        $contractAddress = getSecret('ape_contract_address');
        if ($contractAddress == false) die('Missing address');
        
        $contract->at($contractAddress)->call('getPresaleMints', $address, function($err, $fm) use(&$result) {
            if ($err) {
                echo "Could not communicate with chain";
                http_response_code(500);
                exit();
            }

            $result = intval($fm[0]->toString());
        });

        return $result;
    }

    function getMintDates() {
        $result = array(
            'presale' => array(
                'start' => 0,
                'end' => 0,
            ),
            'public' => array(
                'start' => 0,
            ),
        );
        $contract = getApeContract();

        $address = getSecret('ape_contract_address');
        if ($address == false) die('Missing address');
        $contract->at($address)->call('publicMint', function($err, $fm) use(&$result) {
            if ($err) {
                echo "Could not communicate with chain";
                http_response_code(500);
                exit();
            }
            $start = intval($fm['startDate']->toString());

            $result['public']['start'] = $start;
        });
        
        $contract->at($address)->call('presaleMint', function($err, $fm) use(&$result) {
            if ($err) {
                echo "Could not communicate with chain";
                http_response_code(500);
                exit();
            }
            $start = intval($fm['startDate']->toString());
            $end = intval($fm['endDate']->toString());

            $result['presale']['start'] = $start;
            $result['presale']['end'] = $end;
        });

        return $result;
    }

    function mintsActive() {
        $dates = getMintDates();

        $result['presaleMintActive'] = $dates['presale']['start'] <= time() && $dates['presale']['end'] > time();
        $result['publicMintActive'] = $dates['public']['start'] <= time();

        return $result;
    }
?>
