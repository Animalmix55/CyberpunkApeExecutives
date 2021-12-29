<?php
    require_once __DIR__ . '/secrets.php';
    use Firebase\JWT\JWT;

    /**
     * Creates the login token for the given address and duration
     * 
     * @param string $address the address of the user
     */
    function createLoginToken(string $address) {
        $time = time();
        
        $payload = array(
            "iss" => getSecret('web_root'),
            "aud" => getSecret('web_root'),
            "iat" => $time,
            "address" => $address,
        );

        return JWT::encode($payload, getSecret('jwt_private_session'), 'HS256');
    }

    /**
     * Validates the login token provided
     * 
     * @throws
     * @return string the address of the user
     */
    function validateLoginToken(string $token) {
        $data = JWT::decode($token, getSecret('jwt_private_session'), array_keys(JWT::$supported_algs));

        return $data->address;
    }
?>