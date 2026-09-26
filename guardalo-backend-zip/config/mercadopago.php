<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Mercado Pago Configuration
    |--------------------------------------------------------------------------
    |
    | Credentials for Mercado Pago Checkout Pro and Card payments.
    | Obtain these from your Mercado Pago Developer Dashboard.
    |
    */
    'access_token' => env('MERCADOPAGO_ACCESS_TOKEN', ''),
    'public_key' => env('MERCADOPAGO_PUBLIC_KEY', ''),
    'webhook_secret' => env('MERCADOPAGO_WEBHOOK_SECRET', ''),
    'sandbox' => env('MERCADOPAGO_SANDBOX', false),

    /*
    |--------------------------------------------------------------------------
    | Bank Transfer Configuration
    |--------------------------------------------------------------------------
    |
    | Official banking credentials for customer direct bank transfers.
    |
    */
    'bank' => [
        'bank_name' => env('BANK_NAME', 'Banco Santander Río'),
        'account_holder' => env('BANK_ACCOUNT_HOLDER', 'Guardalo S.R.L.'),
        'cuit' => env('BANK_CUIT', '30-71649281-9'),
        'cbu' => env('BANK_CBU', '0720218820000001234567'),
        'alias' => env('BANK_ALIAS', 'GUARDALO.BOXES'),
        'account_type' => env('BANK_ACCOUNT_TYPE', 'Cuenta Corriente en Pesos'),
        'instructions' => 'Una vez realizada la transferencia, enviá el comprobante o ingresá el código de operación para confirmar la reserva de tu box.',
    ],
];
