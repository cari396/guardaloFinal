<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOperationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('operations', function (Blueprint $table) {
            $table->id();
            $table->string('operation_code')->unique(); // e.g. '#OP-9482'
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('box_id')->constrained()->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date'); // Expiration date (e.g. '22 de diciembre')
            $table->decimal('amount', 10, 2);
            $table->string('payment_status')->default('pendiente'); // 'pagado', 'pendiente', 'vencido'
            $table->string('payment_method')->nullable(); // 'mercadopago', 'transferencia', 'efectivo'
            $table->string('contract_pdf_path')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('operations');
    }
}
