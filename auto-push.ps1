# Скрипт для автоматической загрузки изменений на GitHub
# Использование: .\auto-push.ps1

param(
    [string]$CommitMessage = "Обновление файлов"
)

Write-Host "`n🚀 Автоматическая загрузка на GitHub`n" -ForegroundColor Cyan

# Проверяем, что мы в git репозитории
if (-not (Test-Path ".git")) {
    Write-Host "❌ Ошибка: это не git репозиторий!" -ForegroundColor Red
    Write-Host "Сначала инициализируйте git: git init" -ForegroundColor Yellow
    exit 1
}

# Проверяем наличие изменений
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✅ Нет изменений для загрузки" -ForegroundColor Green
    exit 0
}

Write-Host "📝 Обнаружены изменения:" -ForegroundColor Yellow
git status --short

Write-Host "`n📦 Добавляю все изменения..." -ForegroundColor Cyan
git add .

Write-Host "💾 Создаю коммит..." -ForegroundColor Cyan
git commit -m $CommitMessage

Write-Host "☁️  Отправляю на GitHub..." -ForegroundColor Cyan
$pushResult = git push origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Успешно загружено на GitHub!" -ForegroundColor Green
    Write-Host "🔗 https://github.com/nikiash2700-ship-it/wedding`n" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Ошибка при загрузке:" -ForegroundColor Red
    Write-Host $pushResult -ForegroundColor Yellow
    Write-Host "`n💡 Попробуйте выполнить вручную: git push origin main`n" -ForegroundColor Yellow
}
