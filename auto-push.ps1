# Скрипт для автоматической загрузки изменений на GitHub
# Использование: запустите этот скрипт в папке с вашим проектом

param(
    [string]$CommitMessage = "Auto-commit: изменения файлов"
)

# Проверяем, что мы в git репозитории
if (-not (Test-Path ".git")) {
    Write-Host "Ошибка: это не git репозиторий!" -ForegroundColor Red
    Write-Host "Перейдите в папку с вашим проектом wedding" -ForegroundColor Yellow
    exit 1
}

# Проверяем наличие изменений
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "Нет изменений для загрузки" -ForegroundColor Green
    exit 0
}

Write-Host "Обнаружены изменения. Загружаю на GitHub..." -ForegroundColor Cyan

# Добавляем все изменения
git add .

# Создаем коммит
git commit -m $CommitMessage

# Отправляем на GitHub
$pushResult = git push origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Успешно загружено на GitHub!" -ForegroundColor Green
    Write-Host "Посмотреть: https://github.com/nikiash2700-ship-it/wedding" -ForegroundColor Cyan
} else {
    Write-Host "`n✗ Ошибка при загрузке:" -ForegroundColor Red
    Write-Host $pushResult -ForegroundColor Yellow
    Write-Host "`nПопробуйте выполнить вручную: git push origin main" -ForegroundColor Yellow
}

