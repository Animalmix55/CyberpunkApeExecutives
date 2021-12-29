<?php
class DotEnv
{
    /**
     * The directory where the .env file can be located.
     *
     * @var string
     */
    protected $path;
    protected $encPath;


    public function __construct(string $encPath, string $path = null)
    {
        $this->encPath = $encPath;
        $this->path = $path;
    }

    public function encrypt(string $encryptionKey, string $cypherMethod = 'aes256')
    {
        if (!is_readable($this->path)) {
            throw new \RuntimeException(sprintf('%s file is not readable', $this->path));
        }
        $data = file_get_contents($this->path);

        $iv_length = openssl_cipher_iv_length($cypherMethod);
        $iv = openssl_random_pseudo_bytes($iv_length);
        
        $encData = $iv . openssl_encrypt($data, $cypherMethod, $encryptionKey, OPENSSL_RAW_DATA, $iv);

        file_put_contents($this->encPath, $encData);
    }

    public function load(string $encryptionKey = null, string $cypherMethod = 'aes256')
    {
        $lines = array();
        if ($encryptionKey != null) {
            if (!is_readable($this->encPath)) {
                throw new \RuntimeException(sprintf('%s file is not readable', $this->path));
            }

            $encData = file_get_contents($this->encPath);

            $iv_length = openssl_cipher_iv_length($cypherMethod);
            $iv = substr($encData, 0, $iv_length);

            $data = openssl_decrypt(substr($encData, $iv_length), $cypherMethod, $encryptionKey, OPENSSL_RAW_DATA, $iv);

            $lines = explode("\n", $data);
            $cleanedLines = array();

            foreach ($lines as $line) {
                $data = trim($line);
                if ($data == "") continue;

                $cleanedLines[] = $data;
            }
        } else {
            if (!is_readable($this->path)) {
                throw new \RuntimeException(sprintf('%s file is not readable', $this->path));
            }

            $lines = file($this->path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        }

        $result = array();
        
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) {
                continue;
            }

            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);

            if ($name == 'iv') {
                $iv = $value;
                continue;
            }

            $result[$name] = $value;
        }

        return $result;
    }
}

function getSecret($string)
{
    $dotenv = new DotEnv(__DIR__ . '/../.env.enc', __DIR__ . '/../.env');
    $secret = is_readable(getenv('SECRET')) ? file_get_contents(getenv('SECRET')) : getenv('SECRET');
    
    if (!is_readable(realpath(__DIR__ . '/../.env.enc'))) $dotenv->encrypt($secret);

    $values = $dotenv->load($secret);
    $value = $values[$string];

    if (!$value) {
        http_response_code(500);
        die($string . ' not found');
    }

    return $value;
}
