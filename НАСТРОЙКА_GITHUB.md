# 🚀 Быстрая настройка GitHub

## Вариант 1: Через GitHub Desktop (РЕКОМЕНДУЕТСЯ)

1. **Откройте GitHub Desktop**
2. **Создайте новый репозиторий:**
   - File → New repository
   - Name: `wedding` или `svadba` (красивое название)
   - Local path: выберите папку `C:\Users\Алина\свадьба\`
   - Нажмите "Create repository"

3. **Опубликуйте репозиторий:**
   - Нажмите "Publish repository"
   - Выберите "Keep this code private" (опционально)
   - Нажмите "Publish repository"

4. **Настройте GitHub Pages:**
   - Откройте репозиторий на GitHub.com
   - Settings → Pages
   - Source: Branch `main`, Folder `/` (root)
   - Save

5. **Готово!** Сайт будет доступен по адресу:
   `https://ваш-username.github.io/название-репозитория/`

---

## Вариант 2: Через веб-интерфейс GitHub

1. **Создайте новый репозиторий:**
   - Откройте: https://github.com/new
   - Repository name: `wedding` или `svadba`
   - Выберите Public или Private
   - НЕ добавляйте README, .gitignore, license
   - Нажмите "Create repository"

2. **Загрузите файлы:**
   - Нажмите "uploading an existing file"
   - Перетащите все файлы из папки `свадьба`
   - Нажмите "Commit changes"

3. **Настройте GitHub Pages:**
   - Settings → Pages
   - Source: Branch `main`, Folder `/` (root)
   - Save

---

## Вариант 3: Через командную строку (для продвинутых)

```bash
cd C:\Users\Алина\свадьба
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ваш-username/название-репозитория.git
git push -u origin main
```

---

## ✅ После настройки

1. Проверьте, что сайт работает
2. Проверьте Telegram бота (заполните тестовую анкету)
3. Обновите ссылку в приглашениях

---

Удачи! 🎉

