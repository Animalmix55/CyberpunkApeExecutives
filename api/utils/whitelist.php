<?php
    $presaleLocation = realpath(__DIR__ . '/../data/whitelist.json');

    function getPresaleWhitelist() {
        global $presaleLocation;
        return json_decode(file_get_contents($presaleLocation));
    }

    function presaleCount(string $address) {
        $whitelist = getPresaleWhitelist();
        $length = count($whitelist);

        $count = 0;
        for ($i = 0; $i < $length; $i++) {
            if (strtolower($whitelist[$i]->address) == strtolower($address)) {
                $count += $whitelist[$i]->amount;
            }
        }

        return $count;
    }
?>