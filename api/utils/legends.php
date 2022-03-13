<?php
    require_once __DIR__ . '/secrets.php';

    function getLegendsCSV(): string {
        return file_get_contents(realpath(__DIR__ . '/../public/Legends/Metadata.csv'));
    }

    function getLegendById(int $tokenId) {
        if ($tokenId < 1) return false;
        $csv = getLegendsCSV();

        $lines = explode("\r\n", $csv);
        $heading = $lines[0]; // cut out heading

        $headers = explode(',', $heading);

        $body = array_slice($lines, 1);

        if (count($body) < $tokenId) return false;
    
        $target = $body[$tokenId - 1];
        if ($target == "") return false;

        $targetCells = explode(',', $target);
        $image = '';

        $attributes = array();
        for ($i = 0; $i < count($headers); $i++) {
            $header = preg_replace("/[^A-Za-z0-9 ]/", '', $headers[$i]);
            $value = $targetCells[$i];

            if ($value == "") continue;

            if ($header == 'img') {
                $image = $value;
                continue;
            }

            $asInt = intval($value);
            $isInt = $asInt != 0 || $value == "0";

            $attribute = array("trait_type" => $header, "value" => $isInt ? $asInt : $value);
            if ($isInt) $attribute["display_type"] = "number";

            $attributes[] = $attribute;
        }

        return array(
            "name" => "Cyberpunk Ape Legends #".$tokenId,
            "image" => getSecret('web_root')."/Legends/".urlencode($image),
            "attributes" => $attributes
        );
    }
?>
