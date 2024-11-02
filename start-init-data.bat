@echo off

start cmd /k "php artisan db:wipe"

start cmd /k "php artisan migrate:fresh --seed"
