<?php
    require_once __DIR__ . "/../vendor/autoload.php";
    require_once __DIR__ . '/../utils/secrets.php';

    require_once __DIR__ . '/../utils/apeContract.php';
    require_once __DIR__ . '/../utils/whitelist.php';

    function processRequest() {
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'POST':
                return getContractAddress();
                break;
            case 'GET':
                return getDates();
                break;
            case 'OPTIONS':
                return;
                break;
            case 'PUT':
            default:
                break;
        }
        http_response_code(404);
    }

    function getDates() {
        echo json_encode(getMintDates());
        return;
    }

    function getContractAddress() {
        echo getSecret('ape_contract_address');
        return;
    }

    processRequest();
?>