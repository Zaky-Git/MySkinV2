@echo off

start cmd /k "php artisan serve"

start cmd /k "cd react && npm run dev"
start cmd /k " cd flask && python app.py"