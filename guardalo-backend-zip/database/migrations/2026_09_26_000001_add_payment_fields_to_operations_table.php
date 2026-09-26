<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPaymentFieldsToOperationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('operations', function (Blueprint $table) {
            if (!Schema::hasColumn('operations', 'mercadopago_preference_id')) {
                $table->string('mercadopago_preference_id')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('operations', 'mercadopago_payment_id')) {
                $table->string('mercadopago_payment_id')->nullable()->after('mercadopago_preference_id');
            }
            if (!Schema::hasColumn('operations', 'transfer_reference')) {
                $table->string('transfer_reference')->nullable()->after('mercadopago_payment_id');
            }
            if (!Schema::hasColumn('operations', 'transfer_receipt_path')) {
                $table->string('transfer_receipt_path')->nullable()->after('transfer_reference');
            }
            if (!Schema::hasColumn('operations', 'card_last_four')) {
                $table->string('card_last_four', 4)->nullable()->after('transfer_receipt_path');
            }
            if (!Schema::hasColumn('operations', 'card_brand')) {
                $table->string('card_brand')->nullable()->after('card_last_four');
            }
            if (!Schema::hasColumn('operations', 'installments')) {
                $table->integer('installments')->default(1)->nullable()->after('card_brand');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('operations', function (Blueprint $table) {
            $columns = [
                'mercadopago_preference_id',
                'mercadopago_payment_id',
                'transfer_reference',
                'transfer_receipt_path',
                'card_last_four',
                'card_brand',
                'installments',
            ];
            foreach ($columns as $column) {
                if (Schema::hasColumn('operations', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
}
