// Используем переменные окружения из GitHub Secrets при сборке
// ВАЖНО: токен все равно будет виден в браузере (это ограничение статических сайтов)
// Для локальной разработки создайте файл .env.local с этими переменными
// ВАЖНО: Замените этот токен на новый через GitHub Secrets после настройки!
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8548278322:AAEqnfAgxru4XpzWMYx8dz5J1oWojalbAOM'

// Список Chat ID для отправки сообщений (можно несколько)
const TELEGRAM_CHAT_IDS = import.meta.env.VITE_TELEGRAM_CHAT_IDS 
  ? import.meta.env.VITE_TELEGRAM_CHAT_IDS.split(',').map(id => id.trim())
  : ['647597624', '506432416'] // Значения по умолчанию, если не указаны в env

export function useRSVP() {
  const submitRSVP = async (formData) => {
    // Сохраняем в localStorage
    const rsvps = JSON.parse(localStorage.getItem('rsvps') || '[]')
    rsvps.push({
      ...formData,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('rsvps', JSON.stringify(rsvps))

    // Формируем сообщение для Telegram
    const attendanceText = formData.attendance === 'yes' ? '✅ Да, с удовольствием' : '❌ К сожалению, не могу'
    const childrenText = formData.children === 'yes' ? `Да (${formData.childrenCount} детей)` : 'Нет'
    const drinksText = formData.drinks.length > 0 ? formData.drinks.join(', ') : 'Не указано'
    const secondDayText = formData.secondDay === 'yes' ? 'Да' : 'Нет'

    const telegramMessage = `
🎉 <b>Новая анкета гостя!</b>

👤 <b>Имя:</b> ${formData.name}
📱 <b>Телефон:</b> ${formData.phone}

🎊 <b>Присутствие:</b> ${attendanceText}
🍷 <b>Напитки:</b> ${drinksText}
👶 <b>С детьми:</b> ${childrenText}
🍽️ <b>Горячее:</b> ${formData.mainCourse}
📅 <b>Второй день:</b> ${secondDayText}

💬 <b>Пожелания:</b>
${formData.message || 'Нет пожеланий'}

⏰ <i>${new Date().toLocaleString('ru-RU')}</i>
    `.trim()

    // Отправляем в Telegram во все указанные чаты (не блокируем UI)
    if (!TELEGRAM_BOT_TOKEN) {
      console.error('⚠️ TELEGRAM_BOT_TOKEN не установлен! Анкеты не будут отправляться в Telegram.')
      return
    }
    
    if (TELEGRAM_CHAT_IDS.length > 0) {
      TELEGRAM_CHAT_IDS.forEach(chatId => {
        sendToTelegram(telegramMessage, chatId).catch(err => {
          console.error(`❌ Ошибка отправки в Telegram (chat_id: ${chatId}):`, err.message || err)
          // Не блокируем UI, данные уже сохранены в localStorage
        })
      })
    } else {
      console.error('⚠️ TELEGRAM_CHAT_IDS пуст! Укажите хотя бы один Chat ID.')
    }
  }

  return {
    submitRSVP
  }
}

async function sendToTelegram(message, chatId) {
  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  
  const formData = new URLSearchParams()
  formData.append('chat_id', chatId)
  formData.append('text', message)
  formData.append('parse_mode', 'HTML')
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)
  
  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    const result = await response.json()
    
    if (!result.ok) {
      // Более детальная информация об ошибке
      const errorMessage = result.description || 'Ошибка отправки в Telegram'
      console.error(`Telegram API ошибка: ${errorMessage}`, result)
      throw new Error(errorMessage)
    }

    console.log(`✅ Сообщение успешно отправлено в чат ${chatId}`)
    return result
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}



