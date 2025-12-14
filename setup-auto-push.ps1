# Скрипт для настройки автоматической загрузки на GitHub
# Создает Git hook, который будет автоматически пушить изменения после каждого коммита

Write-Host ""
Write-Host "Настройка автоматической загрузки на GitHub..." -ForegroundColor Cyan
Write-Host ""

# Проверяем, что мы в git репозитории
if (-not (Test-Path ".git")) {
    Write-Host "Ошибка: это не git репозиторий!" -ForegroundColor Red
    Write-Host "Сначала инициализируйте git: git init" -ForegroundColor Yellow
    exit 1
}

# Создаем папку для hooks, если её нет
$hooksDir = ".git\hooks"
if (-not (Test-Path $hooksDir)) {
    New-Item -ItemType Directory -Path $hooksDir -Force | Out-Null
}

# Создаем post-commit hook для автоматического push
$hookContent = @"
#!/bin/sh
# Автоматическая загрузка на GitHub после каждого коммита

branch=`$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

echo ""
echo "Автоматическая загрузка на GitHub..."

# Пытаемся отправить изменения
git push origin `$branch

if [ `$? -eq 0 ]; then
    echo ""
    echo "Успешно загружено на GitHub!"
    echo "https://github.com/nikiash2700-ship-it/wedding"
else
    echo ""
    echo "Не удалось автоматически загрузить на GitHub"
    echo "Выполните вручную: git push origin `$branch"
fi
"@

$hookPath = Join-Path $hooksDir "post-commit"
$hookContent | Out-File -FilePath $hookPath -Encoding UTF8 -NoNewline

Write-Host "Git hook создан!" -ForegroundColor Green
Write-Host ""
Write-Host "Теперь после каждого коммита изменения будут автоматически загружаться на GitHub!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Как использовать:" -ForegroundColor Yellow
Write-Host "   1. Внесите изменения в файлы" -ForegroundColor White
Write-Host "   2. Выполните: git add ." -ForegroundColor White
Write-Host "   3. Выполните: git commit -m 'Ваше сообщение'" -ForegroundColor White
Write-Host "   4. Изменения автоматически загрузятся на GitHub!" -ForegroundColor White
Write-Host ""
