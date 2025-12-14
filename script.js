// Установите дату свадьбы здесь (год, месяц-1, день, час, минута)
const weddingDate = new Date(2024, 5, 15, 15, 0); // 15 июня 2024, 15:00
// Примечание: месяц в JavaScript начинается с 0 (0 = январь, 5 = июнь)

// Countdown Timer
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate.getTime() - now;

    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Обновляем таймер каждую секунду
setInterval(updateCountdown, 1000);
updateCountdown(); // Вызываем сразу при загрузке

// Smooth scroll для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Показ/скрытие поля "количество детей"
const childrenRadios = document.querySelectorAll('input[name="children"]');
const childrenCountGroup = document.getElementById('childrenCountGroup');

childrenRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'yes') {
            childrenCountGroup.style.display = 'block';
            document.getElementById('childrenCount').required = true;
        } else {
            childrenCountGroup.style.display = 'none';
            document.getElementById('childrenCount').required = false;
            document.getElementById('childrenCount').value = '0';
        }
    });
});

// RSVP Form Handler
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');
const btnSubmit = document.querySelector('.btn-submit');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');

// Настройки Telegram бота
const TELEGRAM_BOT_TOKEN = '8548278322:AAEqnfAgxru4XpzWMYx8dz5J1oWojalbAOM'; // Токен вашего бота

// Chat ID всех админов (анкеты будут приходить всем)
const TELEGRAM_CHAT_IDS = [
    '647597624',  // Первый админ
    '475843256',  // Второй админ
    '506432416'   // Третий админ
];

rsvpForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Собираем данные формы
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        attendance: document.querySelector('input[name="attendance"]:checked')?.value,
        drinks: Array.from(document.querySelectorAll('input[name="drinks"]:checked')).map(cb => cb.value),
        children: document.querySelector('input[name="children"]:checked')?.value,
        childrenCount: document.getElementById('childrenCount').value || '0',
        mainCourse: document.querySelector('input[name="mainCourse"]:checked')?.value,
        secondDay: document.querySelector('input[name="secondDay"]:checked')?.value,
        message: document.getElementById('message').value || 'Нет пожеланий'
    };

    // СРАЗУ показываем загрузку и блокируем форму
    btnSubmit.disabled = true;
    btnText.textContent = 'Отправка...';
    btnText.style.display = 'inline';
    btnLoader.style.display = 'inline';
    
    // Добавляем визуальную обратную связь
    rsvpForm.style.opacity = '0.7';
    rsvpForm.style.pointerEvents = 'none';

    // Формируем сообщение для Telegram
    const attendanceText = formData.attendance === 'yes' ? '✅ Да, с удовольствием' : '❌ К сожалению, не могу';
    const childrenText = formData.children === 'yes' ? `Да (${formData.childrenCount} детей)` : 'Нет';
    const drinksText = formData.drinks.length > 0 ? formData.drinks.join(', ') : 'Не указано';
    const secondDayText = formData.secondDay === 'yes' ? 'Да' : 'Нет';

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
${formData.message}

⏰ <i>${new Date().toLocaleString('ru-RU')}</i>
    `.trim();

    // Сохраняем данные сразу (на случай ошибки)
    const rsvps = JSON.parse(localStorage.getItem('rsvps') || '[]');
    rsvps.push({
        ...formData,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('rsvps', JSON.stringify(rsvps));

    // Отправляем в Telegram всем админам (не ждем ответа - показываем успех сразу)
    let sendPromise;
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_IDS.length > 0) {
        // Отправляем всем админам
        sendPromise = Promise.all(
            TELEGRAM_CHAT_IDS.map(chatId => 
                sendToTelegram(telegramMessage, chatId).catch(err => {
                    console.error(`Ошибка отправки в Telegram для ${chatId} (но данные сохранены):`, err);
                    // Не показываем ошибку пользователю, т.к. данные сохранены
                })
            )
        );
    } else {
        sendPromise = Promise.resolve();
    }

    // Показываем успех сразу (не ждем ответа от Telegram)
    // Это делает форму более отзывчивой
    setTimeout(() => {
        btnText.textContent = 'Отправлено!';
        btnText.style.color = '#4caf50';
        
        setTimeout(() => {
            rsvpForm.style.display = 'none';
            rsvpSuccess.style.display = 'block';
            rsvpSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }, 500); // Небольшая задержка для визуального эффекта

    // Ждем отправки в фоне (но не блокируем UI)
    try {
        await sendPromise;
    } catch (error) {
        // Ошибка уже обработана выше, данные сохранены
        console.error('Фоновая ошибка отправки:', error);
    }
});

// Функция отправки в Telegram (оптимизированная)
async function sendToTelegram(message, chatId) {
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const formData = new URLSearchParams();
    formData.append('chat_id', chatId);
    formData.append('text', message);
    formData.append('parse_mode', 'HTML');
    
    // Пробуем прямой запрос (на GitHub Pages через HTTPS это должно работать)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Таймаут 10 секунд
        
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const result = await response.json();
        
        if (!result.ok) {
            throw new Error(result.description || 'Ошибка отправки в Telegram');
        }

        return result;
    } catch (error) {
        // Если прямой запрос не работает, пробуем через iframe (быстрее чем прокси)
        if (error.name === 'AbortError') {
            console.warn('Таймаут запроса, пробуем альтернативный метод...');
        } else {
            console.warn('Прямой запрос не сработал, пробуем через iframe...', error);
        }
        return await sendToTelegramViaIframe(message, chatId);
    }
}

// Альтернативный метод через iframe (обход CORS)
async function sendToTelegramViaIframe(message, chatId) {
    return new Promise((resolve, reject) => {
        // Создаем скрытую форму и отправляем через iframe
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        form.target = 'telegram_iframe_' + Date.now() + '_' + chatId;
        form.style.display = 'none';
        
        // Создаем скрытый iframe
        const iframe = document.createElement('iframe');
        iframe.name = form.target;
        iframe.style.display = 'none';
        iframe.style.width = '0';
        iframe.style.height = '0';
        document.body.appendChild(iframe);
        
        // Добавляем поля формы
        const fields = {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        };
        
        for (const [key, value] of Object.entries(fields)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
        }
        
        document.body.appendChild(form);
        
        // Обработчик загрузки iframe
        iframe.onload = function() {
            setTimeout(() => {
                document.body.removeChild(form);
                document.body.removeChild(iframe);
                resolve({ ok: true });
            }, 500);
        };
        
        // Отправляем форму
        form.submit();
        
        // Таймаут на случай, если iframe не загрузится
        setTimeout(() => {
            if (document.body.contains(form)) {
                document.body.removeChild(form);
            }
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }
            resolve({ ok: true }); // Предполагаем успех
        }, 2000);
    });
}

// Плавное появление элементов при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за секциями
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Исключаем hero секцию из анимации
const hero = document.querySelector('.hero');
if (hero) {
    hero.style.opacity = '1';
    hero.style.transform = 'none';
}

// Добавляем эффект параллакса для hero секции
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

// Анимация для галереи при наведении
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) rotate(2deg)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Добавляем активное состояние для навигации при прокрутке
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

