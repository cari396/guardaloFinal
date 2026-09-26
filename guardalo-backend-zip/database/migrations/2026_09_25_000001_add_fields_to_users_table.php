<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('cliente')->after('email'); // 'admin' or 'cliente'
            $table->string('dni')->nullable()->after('role');
            $table->string('cuit')->nullable()->after('dni');
            $table->string('phone')->nullable()->after('cuit');
            $table->string('cellphone')->nullable()->after('phone');
            $table->string('address')->nullable()->after('cellphone');
            $table->string('city')->nullable()->after('address');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'dni', 'cuit', 'phone', 'cellphone', 'address', 'city']);
        });
    }
}
