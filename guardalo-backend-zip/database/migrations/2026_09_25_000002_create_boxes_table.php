<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBoxesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('boxes', function (Blueprint $table) {
            $table->id();
            $table->string('box_number')->unique(); // e.g. 'BOX 16', 'BOX 17'
            $table->string('size'); // 'Pequeño', 'Mediano', 'Grande'
            $table->string('dimensions')->nullable(); // e.g. '13.75m² (2.75x5m)'
            $table->string('status')->default('disponible'); // 'disponible', 'alquilado', 'mantenimiento'
            $table->decimal('base_price', 10, 2)->nullable();
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
        Schema::dropIfExists('boxes');
    }
}
