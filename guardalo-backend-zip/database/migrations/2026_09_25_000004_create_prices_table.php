<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePricesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prices', function (Blueprint $table) {
            $table->id();
            $table->string('period'); // '1 DÍA', '30 DÍAS', '90 DÍAS', '180 DÍAS', '1 AÑO'
            $table->decimal('amount', 10, 2); // e.g. 450.00, 13500.00
            $table->string('promo_text')->nullable(); // e.g. 'promo +10 días'
            $table->string('size_category')->nullable(); // 'pequeño', 'mediano', 'grande'
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
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
        Schema::dropIfExists('prices');
    }
}
