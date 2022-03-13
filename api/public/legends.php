<?php
    require_once __DIR__ . "/../vendor/autoload.php";
    require_once __DIR__ . '/../utils/legends.php';

    function processRequest() {
        try {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'GET':
                    if (isset($_GET['tokenId'])) {
                        return getMetadata($_GET['tokenId']);
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

    function getMetadata(int $tokenId) {
        $meta = getLegendById($tokenId);
        if (!$meta) {
            http_response_code(404);
            echo "Token not found";
            return;
        }

        http_response_code(200);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($meta);
        return;
    }

    processRequest();
?>