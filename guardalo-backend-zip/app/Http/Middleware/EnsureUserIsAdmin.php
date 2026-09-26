<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request and ensure user has admin role.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Acceso denegado. Se requieren permisos de administrador.',
            ], 403);
        }

        return $next($request);
    }
}
