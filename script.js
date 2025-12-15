// Установите дату свадьбы здесь (год, месяц-1, день, час, минута)
// Примечание: месяц в JavaScript начинается с 0 (0 = январь, 8 = сентябрь)
const weddingDate = new Date(2026, 8, 10, 15, 0); // 10 сентября 2026, 15:00

// Countdown Timer
function updateCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
        return;
    }
    
    const now = new Date().getTime();
    const distance = weddingDate.getTime() - now;

    if (distance < 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Запускаем таймер после полной загрузки страницы
(function() {
    function initTimer() {
        // Проверяем, что элементы существуют
        const daysEl = document.getElementById('days');
        if (!daysEl) {
            // Элементы еще не загружены, пробуем еще раз через 100мс
            setTimeout(initTimer, 100);
            return;
        }
        
        // Элементы найдены, запускаем таймер
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // Запускаем сразу, если DOM готов
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTimer);
    } else {
        // DOM уже загружен
        initTimer();
    }
    
    // Дополнительная проверка после полной загрузки
    window.addEventListener('load', function() {
        updateCountdown();
        if (!window.countdownInterval) {
            window.countdownInterval = setInterval(updateCountdown, 1000);
        }
    });
})();

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

// Логика постепенного появления вопросов в анкете

// Функция для показа/скрытия шагов формы
function showStep(step) {
    document.querySelectorAll(`.form-step[data-step="${step}"]`).forEach(el => {
        el.style.display = 'block';
    });
}

function hideStep(step) {
    document.querySelectorAll(`.form-step[data-step="${step}"]`).forEach(el => {
        el.style.display = 'none';
    });
}

// Обработка первого вопроса: "Хотите ли вы разделить это событие с нами?"
const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
attendanceRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'yes') {
            // Показываем шаги 2, 3, 4, 5, 6
            showStep(2);
            showStep(3);
            showStep(4);
            showStep(5);
            showStep(6);
            // Скрываем поле количества персон до выбора "Один" или "Нет, с компанией"
            document.getElementById('companionsCountGroup').style.display = 'none';
            document.getElementById('companionsNamesGroup').style.display = 'none';
            document.getElementById('companionsSameGroup').style.display = 'none';
            document.getElementById('companionsQuestions').style.display = 'none';
            // Убираем required у скрытых полей
            const companionsCountInput = document.getElementById('companionsCount');
            if (companionsCountInput) {
                companionsCountInput.required = false;
                companionsCountInput.removeAttribute('required');
                companionsCountInput.setCustomValidity(''); // Отключаем валидацию
            }
            // Делаем поля обязательными
            document.getElementById('name').required = true;
            document.getElementById('phone').required = true;
        } else {
            // Если "К сожалению, не могу" - показываем только имя и телефон
            showStep(2);
            hideStep(3);
            hideStep(4);
            hideStep(5);
            hideStep(6);
            document.getElementById('companionsCountGroup').style.display = 'none';
            document.getElementById('companionsNamesGroup').style.display = 'none';
            document.getElementById('companionsSameGroup').style.display = 'none';
            document.getElementById('companionsQuestions').style.display = 'none';
            // Убираем required у скрытых полей
            const companionsCountInput = document.getElementById('companionsCount');
            if (companionsCountInput) {
                companionsCountInput.required = false;
                companionsCountInput.removeAttribute('required');
                companionsCountInput.setCustomValidity(''); // Отключаем валидацию
            }
            // Делаем поля обязательными
            document.getElementById('name').required = true;
            document.getElementById('phone').required = true;
        }
    });
});

// Обработка вопроса "Прибудете один или нет?"
const aloneRadios = document.querySelectorAll('input[name="alone"]');
aloneRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'yes') {
            // Если один - скрываем вопросы о спутниках
            document.getElementById('companionsCountGroup').style.display = 'none';
            document.getElementById('companionsNamesGroup').style.display = 'none';
            document.getElementById('companionsSameGroup').style.display = 'none';
            document.getElementById('companionsQuestions').style.display = 'none';
            const companionsCountInput = document.getElementById('companionsCount');
            if (companionsCountInput) {
                companionsCountInput.required = false;
                companionsCountInput.removeAttribute('required');
                companionsCountInput.setCustomValidity(''); // Отключаем валидацию
                companionsCountInput.value = '1';
            }
            // Убеждаемся, что шаги 4, 5, 6 (напитки, горячее, второй день) показаны
            showStep(4);
            showStep(5);
            showStep(6);
        } else {
            // Если с компанией - показываем поле для количества персон
            const companionsCountGroup = document.getElementById('companionsCountGroup');
            const companionsCountInput = document.getElementById('companionsCount');
            companionsCountGroup.style.display = 'block';
            // Устанавливаем required только если поле видимо
            if (companionsCountInput) {
                companionsCountInput.required = true;
                companionsCountInput.setAttribute('required', 'required');
                companionsCountInput.setCustomValidity(''); // Сбрасываем кастомную валидацию
                companionsCountInput.value = '2';
            }
            // Обновляем поля имен спутников
            updateCompanionsNames();
            // Устанавливаем чекбокс "Мой спутник/спутники предпочитают аналогичный выбор" как активный по умолчанию
            const companionsSameCheckbox = document.getElementById('companionsSame');
            if (companionsSameCheckbox) {
                companionsSameCheckbox.checked = true;
            }
            // Скрываем вопросы спутников, так как чекбокс активен
            document.getElementById('companionsQuestions').style.display = 'none';
            // Показываем шаг 7 (чекбокс для спутников) после того, как будут заполнены вопросы
            const attendance = document.querySelector('input[name="attendance"]:checked');
            if (attendance && attendance.value === 'yes') {
                checkCompanionsCheckboxVisibility();
            }
        }
    });
});

// Обработка изменения количества персон
const companionsCountInput = document.getElementById('companionsCount');
if (companionsCountInput) {
    companionsCountInput.addEventListener('change', function() {
        const count = parseInt(this.value) || 0;
        const companionsNumber = count - 1; // Количество спутников (без основного гостя)
        
        // Обновляем текст чекбокса в зависимости от количества спутников
        const companionsSameText = document.getElementById('companionsSameText');
        if (companionsSameText) {
            if (companionsNumber === 1) {
                companionsSameText.textContent = 'Мой спутник предпочитает аналогичный выбор';
            } else {
                companionsSameText.textContent = 'Мои спутники предпочитают аналогичный выбор';
            }
        }
        
        if (count > 1) {
            // Обновляем поля имен спутников
            updateCompanionsNames();
            // Устанавливаем чекбокс "Мой спутник/спутники предпочитают аналогичный выбор" как активный по умолчанию
            const companionsSameCheckbox = document.getElementById('companionsSame');
            if (companionsSameCheckbox && !companionsSameCheckbox.checked) {
                companionsSameCheckbox.checked = true;
            }
            // Показываем чекбокс "Мой спутник/спутники предпочитают аналогичный выбор"
            // Только если уже заполнены вопросы о напитках, горячем и втором дне
            const drinks = document.querySelectorAll('input[name="drinks"]:checked').length > 0;
            const mainCourse = document.querySelector('input[name="mainCourse"]:checked');
            const secondDay = document.querySelector('input[name="secondDay"]:checked');
            
            if (drinks || mainCourse || secondDay) {
                checkCompanionsCheckboxVisibility();
            }
            updateCompanionsQuestions();
        } else {
            hideStep(7);
            document.getElementById('companionsNamesGroup').style.display = 'none';
            document.getElementById('companionsQuestions').style.display = 'none';
        }
    });
}

// Обработка чекбокса "Мой спутник/спутники предпочитают аналогичный выбор"
const companionsSameCheckbox = document.getElementById('companionsSame');
if (companionsSameCheckbox) {
    companionsSameCheckbox.addEventListener('change', function() {
        updateCompanionsQuestions();
    });
}

// Функция для проверки, можно ли показать чекбокс для спутников
function checkCompanionsCheckboxVisibility() {
    const alone = document.querySelector('input[name="alone"]:checked');
    const companionsCount = parseInt(document.getElementById('companionsCount')?.value) || 0;
    const mainCourse = document.querySelector('input[name="mainCourse"]:checked');
    const secondDay = document.querySelector('input[name="secondDay"]:checked');
    
    if (alone && alone.value === 'no' && companionsCount > 1 && mainCourse && secondDay) {
        showStep(7);
        // Убеждаемся, что чекбокс активен по умолчанию
        const companionsSameCheckbox = document.getElementById('companionsSame');
        if (companionsSameCheckbox && !companionsSameCheckbox.checked) {
            companionsSameCheckbox.checked = true;
        }
        // Обновляем вопросы спутников в зависимости от состояния чекбокса
        updateCompanionsQuestions();
    }
}

// Обработчики для полей горячего и второго дня
document.querySelectorAll('input[name="mainCourse"]').forEach(radio => {
    radio.addEventListener('change', checkCompanionsCheckboxVisibility);
});

document.querySelectorAll('input[name="secondDay"]').forEach(radio => {
    radio.addEventListener('change', checkCompanionsCheckboxVisibility);
});

// Функция для преобразования числа в порядковое числительное (именительный падеж)
function getOrdinalNumber(num) {
    const ordinals = {
        1: 'Первый',
        2: 'Второй',
        3: 'Третий',
        4: 'Четвертый',
        5: 'Пятый',
        6: 'Шестой',
        7: 'Седьмой',
        8: 'Восьмой',
        9: 'Девятый',
        10: 'Десятый'
    };
    return ordinals[num] || `${num}-й`;
}

// Функция для преобразования числа в порядковое числительное (родительный падеж)
function getOrdinalNumberGenitive(num) {
    const ordinalsGenitive = {
        1: 'первого',
        2: 'второго',
        3: 'третьего',
        4: 'четвертого',
        5: 'пятого',
        6: 'шестого',
        7: 'седьмого',
        8: 'восьмого',
        9: 'девятого',
        10: 'десятого'
    };
    return ordinalsGenitive[num] || `${num}-го`;
}

// Функция для обновления заголовка блока вопросов спутника
function updateCompanionBlockTitle(companionNumber) {
    const companionNameInput = document.getElementById(`companion_${companionNumber}_name`);
    const companionBlock = document.querySelector(`[data-companion-number="${companionNumber}"]`);
    
    if (companionBlock) {
        const titleElement = companionBlock.querySelector('h3');
        if (titleElement) {
            const companionName = companionNameInput?.value.trim() || '';
            if (companionName) {
                titleElement.textContent = companionName;
            } else {
                const ordinal = getOrdinalNumber(companionNumber);
                titleElement.textContent = `${ordinal} спутник`;
            }
        }
    }
}

// Функция для обновления полей имен спутников
function updateCompanionsNames() {
    const companionsCount = parseInt(document.getElementById('companionsCount').value) || 0;
    const companionsNamesGroup = document.getElementById('companionsNamesGroup');
    
    if (companionsCount > 1) {
        // Показываем поля для имен спутников
        companionsNamesGroup.style.display = 'block';
        companionsNamesGroup.innerHTML = '';
        
        for (let i = 1; i < companionsCount; i++) {
            const ordinalGenitive = getOrdinalNumberGenitive(i);
            const nameGroup = document.createElement('div');
            nameGroup.className = 'form-group';
            nameGroup.innerHTML = `
                <label for="companion_${i}_name">Имя и фамилия ${ordinalGenitive} спутника *</label>
                <input type="text" id="companion_${i}_name" name="companion_${i}_name" placeholder="Иван Иванов" required pattern="[А-Яа-яЁёA-Za-z]+\\s+[А-Яа-яЁёA-Za-z]+" title="Пожалуйста, введите имя и фамилию (минимум два слова)">
                <span class="error-message" id="companion_${i}_nameError"></span>
            `;
            companionsNamesGroup.appendChild(nameGroup);
            
            // Добавляем обработчик для обновления заголовка при вводе имени
            setTimeout(() => {
                const nameInput = document.getElementById(`companion_${i}_name`);
                if (nameInput) {
                    nameInput.addEventListener('input', function() {
                        updateCompanionBlockTitle(i);
                    });
                    nameInput.addEventListener('blur', function() {
                        updateCompanionBlockTitle(i);
                    });
                }
            }, 0);
        }
    } else {
        companionsNamesGroup.style.display = 'none';
        companionsNamesGroup.innerHTML = '';
    }
}

// Функция для обновления вопросов спутников
function updateCompanionsQuestions() {
    const companionsCount = parseInt(document.getElementById('companionsCount').value) || 0;
    const companionsSame = document.getElementById('companionsSame').checked;
    const companionsQuestions = document.getElementById('companionsQuestions');
    
    if (companionsCount > 1 && !companionsSame) {
        // Показываем вопросы для каждого спутника
        companionsQuestions.style.display = 'block';
        companionsQuestions.innerHTML = '';
        
        const companionsNumber = companionsCount - 1; // Количество спутников (без основного гостя)
        const companionWord = companionsNumber === 1 ? 'спутник' : 'спутники';
        
        for (let i = 1; i < companionsCount; i++) {
            const ordinal = getOrdinalNumber(i);
            const companionNameInput = document.getElementById(`companion_${i}_name`);
            const companionName = companionNameInput?.value.trim() || '';
            const displayName = companionName || `${ordinal} спутник`;
            
            const companionBlock = document.createElement('div');
            companionBlock.className = 'companion-block';
            companionBlock.setAttribute('data-companion-number', i);
            companionBlock.style.marginTop = '30px';
            companionBlock.style.padding = '20px';
            companionBlock.style.border = '2px solid var(--primary-color)';
            companionBlock.style.borderRadius = '8px';
            companionBlock.innerHTML = `
                <h3 style="margin-bottom: 20px; color: var(--primary-color);">${displayName}</h3>
                
                <div class="form-group">
                    <label>Какие напитки предпочитает? (можно выбрать несколько)</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="companion_${i}_drinks" value="Шампанское">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-text">Шампанское</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="companion_${i}_drinks" value="Вино сухое белое">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-text">Вино сухое белое</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="companion_${i}_drinks" value="Вино красное полусладкое">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-text">Вино красное полусладкое</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="companion_${i}_drinks" value="Водка">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-text">Водка</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="companion_${i}_drinks" value="Коньяк">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-text">Коньяк</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Какое горячее предпочитает? *</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="companion_${i}_mainCourse" value="Рыба" required>
                            <span class="radio-custom"></span>
                            <span class="radio-text">Рыба</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="companion_${i}_mainCourse" value="Мясо" required>
                            <span class="radio-custom"></span>
                            <span class="radio-text">Мясо</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Планирует ли остаться на второй день? *</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="companion_${i}_secondDay" value="yes" required>
                            <span class="radio-custom"></span>
                            <span class="radio-text">Да</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="companion_${i}_secondDay" value="no" required>
                            <span class="radio-custom"></span>
                            <span class="radio-text">Нет</span>
                        </label>
                    </div>
                </div>
            `;
            companionsQuestions.appendChild(companionBlock);
        }
        
        // Обновляем стили выбранных элементов для новых элементов
        updateSelectedStyles();
    } else {
        companionsQuestions.style.display = 'none';
    }
}

// Добавляем класс для выделения выбранных элементов
function updateSelectedStyles() {
    // Радио-кнопки
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        const label = radio.closest('.radio-label');
        if (radio.checked) {
            label.classList.add('selected');
        } else {
            label.classList.remove('selected');
        }
    });
    
    // Чекбоксы
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        const label = checkbox.closest('.checkbox-label');
        if (checkbox.checked) {
            label.classList.add('selected');
        } else {
            label.classList.remove('selected');
        }
    });
}

// Обновляем стили при изменении
document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', updateSelectedStyles);
});

// Инициализация при загрузке
updateSelectedStyles();

// Обработчик для предотвращения валидации скрытых полей
document.addEventListener('invalid', function(e) {
    const input = e.target;
    if (input.id === 'companionsCount') {
        const companionsCountGroup = document.getElementById('companionsCountGroup');
        if (!companionsCountGroup || companionsCountGroup.style.display === 'none' || input.offsetParent === null) {
            e.preventDefault();
            input.setCustomValidity('');
            input.required = false;
            input.removeAttribute('required');
        }
    }
}, true);

// Также обрабатываем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const companionsCountInput = document.getElementById('companionsCount');
    const companionsCountGroup = document.getElementById('companionsCountGroup');
    if (companionsCountInput && companionsCountGroup) {
        if (companionsCountGroup.style.display === 'none') {
            companionsCountInput.required = false;
            companionsCountInput.removeAttribute('required');
            companionsCountInput.setCustomValidity('');
        }
    }
});

// RSVP Form Handler - инициализация после загрузки DOM
let rsvpForm, rsvpSuccess, btnSubmit, btnText, btnLoader;

function initRSVPForm() {
    rsvpForm = document.getElementById('rsvpForm');
    rsvpSuccess = document.getElementById('rsvpSuccess');
    btnSubmit = document.querySelector('.btn-submit');
    btnText = document.querySelector('.btn-text');
    btnLoader = document.querySelector('.btn-loader');

    // Проверка, что все элементы найдены
    if (!rsvpForm) {
        console.error('Форма rsvpForm не найдена!');
        return;
    }
    if (!btnSubmit) {
        console.error('Кнопка btn-submit не найдена!');
        return;
    }
    
    setupFormHandlers();
}

// Инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRSVPForm);
} else {
    initRSVPForm();
}

// Настройки Telegram бота (глобальные переменные)
const TELEGRAM_BOT_TOKEN = '8548278322:AAEqnfAgxru4XpzWMYx8dz5J1oWojalbAOM'; // Токен вашего бота

// Chat ID всех админов (анкеты будут приходить всем)
const TELEGRAM_CHAT_IDS = [
    '647597624',  // Первый админ
    '475843256',  // Второй админ
    '506432416'   // Третий админ
];

function setupFormHandlers() {

// Валидация формы
function validateForm() {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    
    let isValid = true;
    
    // Валидация имени (минимум 2 слова)
    const nameValue = nameInput.value.trim();
    const nameWords = nameValue.split(/\s+/).filter(word => word.length > 0);
    
    if (nameWords.length < 2) {
        nameError.textContent = 'Пожалуйста, введите имя и фамилию (минимум два слова)';
        nameError.style.display = 'block';
        nameInput.style.borderColor = '#e74c3c';
        isValid = false;
    } else {
        nameError.textContent = '';
        nameError.style.display = 'none';
        nameInput.style.borderColor = '';
    }
    
    // Валидация телефона (российский или белорусский формат)
    const phoneValue = phoneInput.value.replace(/\s|-|\(|\)/g, '');
    // Российский: +7 или 8, затем 10 цифр (начинается с 4, 8 или 9)
    // Белорусский: +375, затем 9 цифр
    const phonePattern = /^(\+?7|8)?[489][0-9]{9}$|^\+?375[0-9]{9}$/;
    
    if (!phonePattern.test(phoneValue)) {
        phoneError.textContent = 'Введите корректный номер телефона (например: +7 900 123-45-67 или +375 29 123-45-67)';
        phoneError.style.display = 'block';
        phoneInput.style.borderColor = '#e74c3c';
        isValid = false;
    } else {
        phoneError.textContent = '';
        phoneError.style.display = 'none';
        phoneInput.style.borderColor = '';
    }
    
    // Валидация для случая "Да, с удовольствием"
    const attendance = document.querySelector('input[name="attendance"]:checked')?.value;
    if (attendance === 'yes') {
        // Проверяем обязательные поля
        const mainCourse = document.querySelector('input[name="mainCourse"]:checked');
        const secondDay = document.querySelector('input[name="secondDay"]:checked');
        const aloneInput = document.querySelector('input[name="alone"]:checked');
        const alone = aloneInput?.value;
        
        if (!mainCourse) {
            alert('Пожалуйста, выберите горячее блюдо');
            isValid = false;
        }
        
        if (!secondDay) {
            alert('Пожалуйста, укажите, планируете ли вы остаться на второй день');
            isValid = false;
        }
        
        if (!alone) {
            alert('Пожалуйста, укажите, прибудете ли вы один или с компанией');
            isValid = false;
            return isValid; // Прерываем валидацию, если не выбран вариант
        }
        
        // Если с компанией, проверяем количество персон
        if (alone === 'no') {
            const companionsCountGroup = document.getElementById('companionsCountGroup');
            const companionsCount = parseInt(document.getElementById('companionsCount')?.value) || 0;
            
            // Проверяем только если поле видимо
            if (companionsCountGroup && companionsCountGroup.style.display !== 'none') {
                if (companionsCount < 2) {
                    alert('Пожалуйста, укажите количество персон (минимум 2)');
                    isValid = false;
                }
                
                // Если чекбокс не отмечен, проверяем ответы спутников
                const companionsSame = document.getElementById('companionsSame')?.checked || false;
                if (!companionsSame) {
                    // Проверяем только если блок вопросов спутников видим
                    const companionsQuestions = document.getElementById('companionsQuestions');
                    if (companionsQuestions && companionsQuestions.style.display !== 'none') {
                        for (let i = 1; i < companionsCount; i++) {
                            const companionName = document.getElementById(`companion_${i}_name`);
                            const companionNameValue = companionName?.value.trim() || '';
                            const companionNameWords = companionNameValue.split(/\s+/).filter(word => word.length > 0);
                            
                            if (companionNameWords.length < 2) {
                                alert(`Пожалуйста, введите имя и фамилию для спутника ${i}`);
                                isValid = false;
                            }
                            
                            const companionMainCourse = document.querySelector(`input[name="companion_${i}_mainCourse"]:checked`);
                            const companionSecondDay = document.querySelector(`input[name="companion_${i}_secondDay"]:checked`);
                            
                            if (!companionMainCourse) {
                                alert(`Пожалуйста, выберите горячее блюдо для спутника ${i}`);
                                isValid = false;
                            }
                            
                            if (!companionSecondDay) {
                                alert(`Пожалуйста, укажите, планирует ли спутник ${i} остаться на второй день`);
                                isValid = false;
                            }
                        }
                    }
                }
            }
        }
        // Если "Один" - не проверяем поля спутников
    }
    
    return isValid;
}

// Валидация при вводе
document.getElementById('name').addEventListener('blur', function() {
    const nameValue = this.value.trim();
    const nameWords = nameValue.split(/\s+/).filter(word => word.length > 0);
    const nameError = document.getElementById('nameError');
    
    if (nameWords.length < 2 && nameValue.length > 0) {
        nameError.textContent = 'Пожалуйста, введите имя и фамилию (минимум два слова)';
        nameError.style.display = 'block';
        this.style.borderColor = '#e74c3c';
    } else {
        nameError.style.display = 'none';
        this.style.borderColor = '';
    }
});

// Маска для телефона
const phoneInput = document.getElementById('phone');

// Сохраняем позицию курсора и количество цифр до изменения
let cursorPosition = 0;
let digitsBefore = 0;
let digitsFromEnd = 0; // Количество цифр от конца до курсора

phoneInput.addEventListener('keydown', function(e) {
    // Сохраняем позицию курсора и количество цифр перед изменением
    cursorPosition = this.selectionStart;
    let currentValue = this.value;
    digitsBefore = currentValue.replace(/\D/g, '').length;
    
    // Подсчитываем количество цифр от конца до курсора
    digitsFromEnd = 0;
    for (let i = currentValue.length - 1; i >= cursorPosition; i--) {
        if (/\d/.test(currentValue[i])) {
            digitsFromEnd++;
        }
    }
    
    // Обработка Backspace и Delete
    if (e.key === 'Backspace' || e.key === 'Delete') {
        let currentValue = this.value;
        let selectionStart = this.selectionStart;
        let selectionEnd = this.selectionEnd;
        
        // Если выделен текст, удаляем его
        if (selectionStart !== selectionEnd) {
            return; // Позволяем стандартное удаление
        }
        
        // Если курсор на форматирующем символе, перемещаем его на предыдущую цифру
        if (e.key === 'Backspace' && selectionStart > 0) {
            let charBefore = currentValue[selectionStart - 1];
            if (/\D/.test(charBefore)) {
                // Если перед курсором форматирующий символ, перемещаем курсор назад
                e.preventDefault();
                this.setSelectionRange(selectionStart - 1, selectionStart - 1);
                // Удаляем цифру перед форматирующим символом
                let digits = currentValue.replace(/\D/g, '');
                let digitPos = 0;
                for (let i = 0; i < selectionStart - 1; i++) {
                    if (/\d/.test(currentValue[i])) {
                        digitPos++;
                    }
                }
                if (digitPos > 0) {
                    digits = digits.slice(0, digitPos - 1) + digits.slice(digitPos);
                    // Триггерим событие input для переформатирования
                    this.value = digits;
                    this.dispatchEvent(new Event('input'));
                }
                return;
            }
        }
        
        // Если курсор на форматирующем символе при Delete, перемещаем его вперед
        if (e.key === 'Delete' && selectionStart < currentValue.length) {
            let charAfter = currentValue[selectionStart];
            if (/\D/.test(charAfter)) {
                // Если после курсора форматирующий символ, перемещаем курсор вперед
                e.preventDefault();
                this.setSelectionRange(selectionStart + 1, selectionStart + 1);
                // Удаляем цифру после форматирующего символа
                let digits = currentValue.replace(/\D/g, '');
                let digitPos = 0;
                for (let i = 0; i < selectionStart; i++) {
                    if (/\d/.test(currentValue[i])) {
                        digitPos++;
                    }
                }
                if (digitPos < digits.length) {
                    digits = digits.slice(0, digitPos) + digits.slice(digitPos + 1);
                    // Триггерим событие input для переформатирования
                    this.value = digits;
                    this.dispatchEvent(new Event('input'));
                }
                return;
            }
        }
    }
});

phoneInput.addEventListener('input', function(e) {
    let originalValue = this.value;
    let value = originalValue.replace(/\D/g, ''); // Убираем все нецифровые символы
    
    // Сохраняем текущую позицию курсора
    let currentCursorPos = this.selectionStart;
    
    if (value.length === 0) {
        this.value = '';
        return;
    }
    
    let formattedValue = '';
    let isBelarus = false;
    
    // Приоритет 1: Если пользователь явно ввел +375 в исходном значении
    if (originalValue.includes('+375')) {
        isBelarus = true;
        if (value.startsWith('375')) {
            value = value.slice(3);
        }
        formattedValue = '+375';
    }
    // Приоритет 2: Если начинается с 375 (белорусский код) - проверяем минимум 3 цифры
    else if (value.length >= 3 && value.startsWith('375')) {
        isBelarus = true;
        value = value.slice(3);
        formattedValue = '+375';
    }
    // Приоритет 3: Если начинается с 37 и длина меньше 3 - возможно начало 375, не форматируем
    else if (value.length < 3 && value.startsWith('37')) {
        // Ждем следующую цифру, не форматируем пока
        this.value = value;
        this.setSelectionRange(value.length, value.length);
        return;
    }
    // Приоритет 4: Если начинается с 3 и длина 1 - возможно начало 375, не форматируем
    else if (value.length === 1 && value.startsWith('3')) {
        // Ждем следующую цифру, не форматируем пока
        this.value = value;
        this.setSelectionRange(value.length, value.length);
        return;
    }
    // Приоритет 5: Если пользователь явно ввел +7
    else if (originalValue.includes('+7')) {
        formattedValue = '+7';
        if (value.startsWith('7')) {
            value = value.slice(1);
        }
    }
    // Приоритет 6: Если начинается с 8 (российский)
    else if (value.startsWith('8')) {
        formattedValue = '8';
        value = value.slice(1);
    }
    // Приоритет 7: Если начинается с 7 (российский)
    else if (value.startsWith('7')) {
        formattedValue = '+7';
        value = value.slice(1);
    }
    // Приоритет 8: Если 10 цифр - российский
    else if (value.length === 10) {
        formattedValue = '+7';
    }
    // По умолчанию - если начинается с 3, но не 375, то это может быть российский код оператора
    // Но только если уже достаточно цифр для определения
    else if (value.length >= 4 && value[0] === '3' && !value.startsWith('375')) {
        // Российский номер, начинающийся с 3 (например, 3XX)
        formattedValue = '+7';
    }
    // Если меньше 4 цифр и начинается с 3, но не 375 - ждем
    else if (value.length < 4 && value[0] === '3') {
        this.value = value;
        this.setSelectionRange(value.length, value.length);
        return;
    }
    // По умолчанию - российский
    else {
        formattedValue = '+7';
    }
    
    // Ограничиваем количество цифр
    if (isBelarus) {
        // Белорусский номер: 9 цифр после кода страны
        if (value.length > 9) {
            value = value.slice(0, 9);
        }
        
        // Форматируем белорусский номер: +375 (XX) XXX-XX-XX
        if (value.length > 0) {
            formattedValue += ' (' + value.slice(0, 2);
            if (value.length > 2) {
                formattedValue += ') ' + value.slice(2, 5);
                if (value.length > 5) {
                    formattedValue += '-' + value.slice(5, 7);
                    if (value.length > 7) {
                        formattedValue += '-' + value.slice(7, 9);
                    }
                }
            } else {
                formattedValue += ')';
            }
        }
    } else {
        // Российский номер: 10 цифр после кода страны
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        // Форматируем российский номер: +7 (XXX) XXX-XX-XX или 8 (XXX) XXX-XX-XX
        if (value.length > 0) {
            formattedValue += ' (' + value.slice(0, 3);
            if (value.length > 3) {
                formattedValue += ') ' + value.slice(3, 6);
                if (value.length > 6) {
                    formattedValue += '-' + value.slice(6, 8);
                    if (value.length > 8) {
                        formattedValue += '-' + value.slice(8, 10);
                    }
                }
            } else {
                formattedValue += ')';
            }
        }
    }
    
    // Устанавливаем новое значение
    this.value = formattedValue;
    
    // Вычисляем новую позицию курсора
    let digitsAfter = value.length;
    let digitsDiff = digitsAfter - digitsBefore;
    
    // Функция для установки курсора
    const setCursor = () => {
        const currentValue = this.value;
        const endPos = currentValue.length;
        
        // Если добавляли цифры (ввод), курсор в самом конце
        if (digitsDiff > 0) {
            this.setSelectionRange(endPos, endPos);
            return;
        }
        
        // Если удаляли цифры, вычисляем правильную позицию
        if (digitsDiff < 0) {
            // Используем позицию относительно конца строки
            // При удалении Backspace удаляется цифра перед курсором,
            // поэтому количество цифр от конца увеличивается на 1
            let targetDigitsFromEnd = digitsFromEnd + 1;
            
            // Но не больше, чем общее количество оставшихся цифр
            if (targetDigitsFromEnd > digitsAfter) {
                targetDigitsFromEnd = digitsAfter;
            }
            
            let newCursorPos = 0;
            
            // Если все цифры удалены, ставим курсор в начало
            if (digitsAfter === 0) {
                newCursorPos = 0;
            } else {
                // Находим позицию, отсчитывая targetDigitsFromEnd цифр от конца
                let digitCountFromEnd = 0;
                
                for (let i = currentValue.length - 1; i >= 0; i--) {
                    if (/\d/.test(currentValue[i])) {
                        digitCountFromEnd++;
                        // Если достигли нужного количества цифр от конца, ставим курсор после этой цифры
                        if (digitCountFromEnd === targetDigitsFromEnd) {
                            newCursorPos = i + 1;
                            break;
                        }
                    }
                }
                
                // Если не нашли позицию (все цифры в конце), ставим в конец
                if (newCursorPos === 0) {
                    newCursorPos = currentValue.length;
                }
            }
            
            this.setSelectionRange(newCursorPos, newCursorPos);
        } else {
            // Если количество цифр не изменилось, но значение изменилось (например, при вставке)
            // Ставим курсор в конец
            this.setSelectionRange(endPos, endPos);
        }
    };
    
    // Используем requestAnimationFrame для установки курсора после обновления DOM
    requestAnimationFrame(() => {
        requestAnimationFrame(setCursor);
    });
});

// Переменная для хранения существующей анкеты
let existingRSVP = null;
let isEditingMode = false;

document.getElementById('phone').addEventListener('blur', async function() {
    const phoneValue = this.value.replace(/\s|-|\(|\)/g, '');
    // Российский: +7 или 8, затем 10 цифр (начинается с 4, 8 или 9)
    // Белорусский: +375, затем 9 цифр
    const phonePattern = /^(\+?7|8)?[489][0-9]{9}$|^\+?375[0-9]{9}$/;
    const phoneError = document.getElementById('phoneError');
    
    if (!phonePattern.test(phoneValue) && this.value.length > 0) {
        phoneError.textContent = 'Введите корректный номер телефона (например: +7 900 123-45-67 или +375 29 123-45-67)';
        phoneError.style.display = 'block';
        this.style.borderColor = '#e74c3c';
        existingRSVP = null;
        isEditingMode = false;
        return;
    }
    
    phoneError.style.display = 'none';
    this.style.borderColor = '';
    
    // Проверяем, есть ли уже анкета с таким телефоном
    if (phonePattern.test(phoneValue) && phoneValue.length >= 10) {
        try {
            const response = await fetch('check_phone.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: this.value })
            });
            
            const result = await response.json();
            
            if (result.exists && result.rsvp) {
                existingRSVP = result.rsvp;
                isEditingMode = true;
                
                // Показываем уведомление о существующей анкете
                const notification = document.createElement('div');
                notification.id = 'existingRSVPNotification';
                notification.style.cssText = 'background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 15px; margin: 15px 0; display: flex; align-items: center; justify-content: space-between;';
                notification.innerHTML = `
                    <div>
                        <strong>Найдена существующая анкета для этого номера!</strong><br>
                        <span style="font-size: 0.9em;">Имя: ${result.rsvp.name || 'Не указано'}, Дата: ${new Date(result.rsvp.timestamp).toLocaleString('ru-RU')}</span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button id="loadExistingRSVP" style="padding: 8px 16px; background: #d4a574; color: white; border: none; border-radius: 5px; cursor: pointer;">Загрузить и изменить</button>
                        <button id="dismissNotification" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Создать новую</button>
                    </div>
                `;
                
                // Удаляем старое уведомление, если есть
                const oldNotification = document.getElementById('existingRSVPNotification');
                if (oldNotification) {
                    oldNotification.remove();
                }
                
                // Вставляем уведомление перед формой
                const form = document.getElementById('rsvpForm');
                form.parentNode.insertBefore(notification, form);
                
                // Обработчик загрузки существующей анкеты
                document.getElementById('loadExistingRSVP').addEventListener('click', function() {
                    loadExistingRSVP(result.rsvp);
                    notification.remove();
                });
                
                // Обработчик создания новой анкеты
                document.getElementById('dismissNotification').addEventListener('click', function() {
                    existingRSVP = null;
                    isEditingMode = false;
                    notification.remove();
                });
            } else {
                existingRSVP = null;
                isEditingMode = false;
                const notification = document.getElementById('existingRSVPNotification');
                if (notification) {
                    notification.remove();
                }
            }
        } catch (error) {
            console.error('Ошибка проверки телефона:', error);
        }
    }
});

// Функция для загрузки существующей анкеты в форму
function loadExistingRSVP(rsvp) {
    // Заполняем основные поля
    document.getElementById('name').value = rsvp.name || '';
    document.getElementById('phone').value = rsvp.phone || '';
    document.getElementById('message').value = rsvp.message || '';
    
    // Устанавливаем attendance
    if (rsvp.attendance) {
        const attendanceRadio = document.querySelector(`input[name="attendance"][value="${rsvp.attendance}"]`);
        if (attendanceRadio) {
            attendanceRadio.checked = true;
            attendanceRadio.dispatchEvent(new Event('change'));
        }
    }
    
    // Если attendance === 'yes', показываем остальные поля
    if (rsvp.attendance === 'yes') {
        // Устанавливаем alone
        if (rsvp.alone) {
            const aloneRadio = document.querySelector(`input[name="alone"][value="${rsvp.alone}"]`);
            if (aloneRadio) {
                aloneRadio.checked = true;
                aloneRadio.dispatchEvent(new Event('change'));
            }
        }
        
        // Устанавливаем количество персон
        if (rsvp.companionsCount && rsvp.alone === 'no') {
            document.getElementById('companionsCount').value = rsvp.companionsCount;
            document.getElementById('companionsCount').dispatchEvent(new Event('change'));
        }
        
        // Устанавливаем напитки
        if (rsvp.drinks && Array.isArray(rsvp.drinks)) {
            rsvp.drinks.forEach(drink => {
                const drinkCheckbox = document.querySelector(`input[name="drinks"][value="${drink}"]`);
                if (drinkCheckbox) {
                    drinkCheckbox.checked = true;
                }
            });
        }
        
        // Устанавливаем горячее
        if (rsvp.mainCourse) {
            const mainCourseRadio = document.querySelector(`input[name="mainCourse"][value="${rsvp.mainCourse}"]`);
            if (mainCourseRadio) {
                mainCourseRadio.checked = true;
            }
        }
        
        // Устанавливаем второй день
        if (rsvp.secondDay) {
            const secondDayRadio = document.querySelector(`input[name="secondDay"][value="${rsvp.secondDay}"]`);
            if (secondDayRadio) {
                secondDayRadio.checked = true;
            }
        }
        
        // Устанавливаем чекбокс для спутников
        if (rsvp.companionsSame !== undefined) {
            document.getElementById('companionsSame').checked = rsvp.companionsSame;
            document.getElementById('companionsSame').dispatchEvent(new Event('change'));
        }
        
        // Загружаем данные спутников, если они есть
        if (rsvp.companions && Array.isArray(rsvp.companions) && rsvp.companions.length > 0 && !rsvp.companionsSame) {
            // Обновляем имена спутников
            rsvp.companions.forEach(companion => {
                const companionNameInput = document.getElementById(`companion_${companion.number}_name`);
                if (companionNameInput) {
                    companionNameInput.value = companion.name || '';
                }
                
                // Устанавливаем напитки спутника
                if (companion.drinks && Array.isArray(companion.drinks)) {
                    companion.drinks.forEach(drink => {
                        const drinkCheckbox = document.querySelector(`input[name="companion_${companion.number}_drinks"][value="${drink}"]`);
                        if (drinkCheckbox) {
                            drinkCheckbox.checked = true;
                        }
                    });
                }
                
                // Устанавливаем горячее спутника
                if (companion.mainCourse) {
                    const mainCourseRadio = document.querySelector(`input[name="companion_${companion.number}_mainCourse"][value="${companion.mainCourse}"]`);
                    if (mainCourseRadio) {
                        mainCourseRadio.checked = true;
                    }
                }
                
                // Устанавливаем второй день спутника
                if (companion.secondDay) {
                    const secondDayRadio = document.querySelector(`input[name="companion_${companion.number}_secondDay"][value="${companion.secondDay}"]`);
                    if (secondDayRadio) {
                        secondDayRadio.checked = true;
                    }
                }
            });
        }
    }
    
    // Прокручиваем к началу формы
    document.getElementById('rsvpForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

    // Проверяем, что форма найдена перед добавлением обработчиков
    if (!rsvpForm) {
        console.error('ОШИБКА: rsvpForm не найдена в setupFormHandlers!');
        return;
    }
    
    // Обработчик для удаления required у скрытых полей перед валидацией браузера
    rsvpForm.addEventListener('submit', function(e) {
        // Убираем required у скрытых полей ДО preventDefault, чтобы браузер не пытался их валидировать
        const companionsCountGroup = document.getElementById('companionsCountGroup');
        const companionsCountInput = document.getElementById('companionsCount');
        if (companionsCountInput) {
            const isHidden = !companionsCountGroup || 
                            companionsCountGroup.style.display === 'none' ||
                            companionsCountInput.offsetParent === null;
            if (isHidden) {
                companionsCountInput.removeAttribute('required');
                companionsCountInput.required = false;
                companionsCountInput.setCustomValidity(''); // Отключаем валидацию
            }
        }
        // НЕ вызываем preventDefault здесь, чтобы основной обработчик мог сработать
    }, true); // Используем capture phase для раннего перехвата

    // Также добавляем обработчик клика на кнопку для диагностики
    btnSubmit.addEventListener('click', function(e) {
        
        // СНАЧАЛА убираем required и min у скрытых полей
        const companionsCountGroup = document.getElementById('companionsCountGroup');
        const companionsCountInput = document.getElementById('companionsCount');
        if (companionsCountInput) {
            const isHidden = !companionsCountGroup || 
                            companionsCountGroup.style.display === 'none' ||
                            companionsCountInput.offsetParent === null;
            if (isHidden) {
                companionsCountInput.removeAttribute('required');
                companionsCountInput.required = false;
                companionsCountInput.removeAttribute('min'); // Убираем min, чтобы браузер не проверял значение
                companionsCountInput.setCustomValidity(''); // Полностью отключаем валидацию
            }
        }
        
        // Убираем required и min у всех скрытых полей
        const allInputs = rsvpForm.querySelectorAll('[required], input[type="number"]');
        allInputs.forEach(input => {
            if (input.offsetParent === null) {
                input.removeAttribute('required');
                input.required = false;
                if (input.hasAttribute('min')) {
                    input.removeAttribute('min');
                }
                input.setCustomValidity(''); // Полностью отключаем валидацию
            }
        });
        
        // Проверяем валидность формы
        // Если форма не валидна, показываем ошибки
        if (!rsvpForm.checkValidity()) {
            const invalidFields = rsvpForm.querySelectorAll(':invalid');
            // Показываем первую ошибку пользователю
            if (invalidFields.length > 0) {
                invalidFields[0].focus();
                invalidFields[0].reportValidity();
            }
        } else {
            // Принудительно вызываем событие submit
            rsvpForm.requestSubmit();
        }
    });
    
    // Основной обработчик submit
rsvpForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Функция для проверки, видно ли элемент
    function isElementVisible(element) {
        if (!element) return false;
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0' &&
               element.offsetParent !== null;
    }
    
    // Специальная проверка для companionsCount - делаем это ПЕРВЫМ делом
    const companionsCountGroup = document.getElementById('companionsCountGroup');
    const companionsCountInput = document.getElementById('companionsCount');
    if (companionsCountInput) {
        // Проверяем видимость группы или самого поля
        const isHidden = !companionsCountGroup || 
                        companionsCountGroup.style.display === 'none' ||
                        !isElementVisible(companionsCountGroup) ||
                        companionsCountInput.offsetParent === null;
        if (isHidden) {
            companionsCountInput.removeAttribute('required');
            companionsCountInput.required = false;
            companionsCountInput.setCustomValidity(''); // Отключаем валидацию
        }
    }
    
    // Убираем required у всех скрытых полей перед валидацией
    const allRequiredInputs = rsvpForm.querySelectorAll('[required]');
    allRequiredInputs.forEach(input => {
        // Пропускаем companionsCount, так как уже обработали
        if (input.id === 'companionsCount') return;
        
        // Проверяем видимость через offsetParent (самый надежный способ)
        if (input.offsetParent === null) {
            input.removeAttribute('required');
            input.required = false;
        } else {
            // Проверяем родительские элементы
            let parent = input.parentElement;
            while (parent && parent !== rsvpForm) {
                if (!isElementVisible(parent)) {
                    input.removeAttribute('required');
                    input.required = false;
                    break;
                }
                parent = parent.parentElement;
            }
        }
    });
    
    // Убираем required у скрытых полей имен спутников
    const companionsNamesGroup = document.getElementById('companionsNamesGroup');
    if (companionsNamesGroup) {
        const isHidden = companionsNamesGroup.style.display === 'none' || 
                        companionsNamesGroup.offsetParent === null ||
                        window.getComputedStyle(companionsNamesGroup).display === 'none';
        if (isHidden) {
            const companionNameInputs = document.querySelectorAll('[id^="companion_"][id$="_name"]');
            companionNameInputs.forEach(input => {
                input.removeAttribute('required');
                input.required = false;
            });
        }
    }
    
    // Убираем required у скрытых полей вопросов спутников
    const companionsQuestions = document.getElementById('companionsQuestions');
    if (companionsQuestions) {
        const isHidden = companionsQuestions.style.display === 'none' || 
                        companionsQuestions.offsetParent === null ||
                        window.getComputedStyle(companionsQuestions).display === 'none';
        if (isHidden) {
            const companionInputs = document.querySelectorAll('[name^="companion_"]');
            companionInputs.forEach(input => {
                input.removeAttribute('required');
                input.required = false;
            });
        }
    }
    
    // Валидация перед отправкой
    const validationResult = validateForm();
    if (!validationResult) {
        return;
    }
    
    // Собираем данные формы
    const attendance = document.querySelector('input[name="attendance"]:checked')?.value;
    const alone = document.querySelector('input[name="alone"]:checked')?.value;
    const companionsCountField = document.getElementById('companionsCount');
    const companionsCount = companionsCountField && companionsCountField.offsetParent !== null 
        ? parseInt(companionsCountField.value) || 1 
        : 1;
    const companionsSame = document.getElementById('companionsSame')?.checked || false;
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        attendance: attendance,
        alone: alone,
        companionsCount: companionsCount,
        companionsSame: companionsSame,
        drinks: Array.from(document.querySelectorAll('input[name="drinks"]:checked')).map(cb => cb.value),
        mainCourse: document.querySelector('input[name="mainCourse"]:checked')?.value,
        secondDay: document.querySelector('input[name="secondDay"]:checked')?.value,
        message: document.getElementById('message').value || 'Нет пожеланий'
    };
    
    // Собираем данные о спутниках, если они есть
    if (attendance === 'yes' && alone === 'no' && companionsCount > 1) {
        formData.companions = [];
        for (let i = 1; i < companionsCount; i++) {
            const companionData = {
                number: i,
                name: document.getElementById(`companion_${i}_name`)?.value || '',
                drinks: Array.from(document.querySelectorAll(`input[name="companion_${i}_drinks"]:checked`)).map(cb => cb.value),
                mainCourse: document.querySelector(`input[name="companion_${i}_mainCourse"]:checked`)?.value,
                secondDay: document.querySelector(`input[name="companion_${i}_secondDay"]:checked`)?.value
            };
            formData.companions.push(companionData);
        }
    }

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
    const aloneText = formData.alone === 'yes' ? 'Один' : `С компанией (${formData.companionsCount} персон)`;
    const drinksText = formData.drinks.length > 0 ? formData.drinks.join(', ') : 'Не указано';
    const secondDayText = formData.secondDay === 'yes' ? 'Да' : 'Нет';

    const isUpdate = isEditingMode && existingRSVP && existingRSVP.id;
    let telegramMessage = `
${isUpdate ? '🔄 <b>Анкета гостя обновлена!</b>' : '🎉 <b>Новая анкета гостя!</b>'}

👤 <b>Имя:</b> ${formData.name}
📱 <b>Телефон:</b> ${formData.phone}

🎊 <b>Присутствие:</b> ${attendanceText}
👥 <b>Количество персон:</b> ${aloneText}
🍷 <b>Напитки:</b> ${drinksText}
🍽️ <b>Горячее:</b> ${formData.mainCourse}
📅 <b>Второй день:</b> ${secondDayText}
    `;
    
    // Добавляем информацию о спутниках, если они есть
    if (formData.companions && formData.companions.length > 0) {
        if (formData.companionsSame) {
            telegramMessage += `\n\n👥 <b>Спутники:</b> Аналогичный выбор`;
        } else {
            const companionsWord = formData.companions.length === 1 ? 'Спутник' : 'Спутники';
            telegramMessage += `\n\n👥 <b>${companionsWord}:</b>`;
            formData.companions.forEach((companion, index) => {
                const ordinal = getOrdinalNumber(companion.number);
                const companionDrinks = companion.drinks.length > 0 ? companion.drinks.join(', ') : 'Не указано';
                telegramMessage += `\n\n<b>${ordinal} спутник:</b> ${companion.name || 'Не указано'}`;
                telegramMessage += `\n🍷 Напитки: ${companionDrinks}`;
                telegramMessage += `\n🍽️ Горячее: ${companion.mainCourse}`;
                telegramMessage += `\n📅 Второй день: ${companion.secondDay === 'yes' ? 'Да' : 'Нет'}`;
            });
        }
    }
    
    telegramMessage += `\n\n💬 <b>Пожелания:</b>\n${formData.message}\n\n⏰ <i>${new Date().toLocaleString('ru-RU')}</i>`;
    telegramMessage = telegramMessage.trim();

    // Сохраняем данные в localStorage (для быстрого доступа)
    const rsvps = JSON.parse(localStorage.getItem('rsvps') || '[]');
    const rsvpData = {
        ...formData,
        timestamp: new Date().toISOString()
    };
    
    // Если редактируем существующую анкету, обновляем её, иначе добавляем новую
    if (isEditingMode && existingRSVP && existingRSVP.id) {
        rsvpData.id = existingRSVP.id;
        rsvpData.timestamp = existingRSVP.timestamp; // Сохраняем оригинальную дату
        rsvpData.updated_at = new Date().toISOString();
        
        // Обновляем в localStorage
        const index = rsvps.findIndex(r => r.id === existingRSVP.id);
        if (index !== -1) {
            rsvps[index] = rsvpData;
        } else {
            rsvps.push(rsvpData);
        }
        
        // Обновляем на сервере
        fetch('update_rsvp.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rsvpData)
        }).then(response => response.json())
          .then(data => {
          })
          .catch(error => {
              console.error('Ошибка обновления на сервере:', error);
          });
    } else {
        // Добавляем новую анкету
        rsvps.push(rsvpData);
        
        // Сохраняем на сервер (в JSON файл через PHP)
        fetch('save_rsvp.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rsvpData)
        }).then(response => response.json())
          .then(data => {
              // Обновляем ID в localStorage
              if (data.id) {
                  const index = rsvps.findIndex(r => !r.id);
                  if (index !== -1) {
                      rsvps[index].id = data.id;
                  }
              }
          })
          .catch(error => {
              console.error('Ошибка сохранения на сервер:', error);
          });
    }
    
    localStorage.setItem('rsvps', JSON.stringify(rsvps));
    
    // Сбрасываем флаги редактирования
    existingRSVP = null;
    isEditingMode = false;

    // Отправляем в Telegram всем админам (не ждем ответа - показываем успех сразу)
    let sendPromise;
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_IDS.length > 0) {
        // Отправляем всем админам
        sendPromise = Promise.all(
            TELEGRAM_CHAT_IDS.map(chatId => {
                return sendToTelegram(telegramMessage, chatId)
                    .then(result => {
                        return result;
                    })
                    .catch(err => {
                        console.error(`Ошибка отправки в Telegram для ${chatId}:`, err);
                        // Не показываем ошибку пользователю, т.к. данные сохранены
                        return null;
                    });
            })
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
} // Конец функции setupFormHandlers

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

// Функция для добавления события в календарь (iOS и Android - стандартные календари)
function addToCalendar(event) {
    event.preventDefault();
    
    // Данные события
    const eventTitle = 'Свадьба Алины и Никиты';
    const eventLocation = 'Усадьба Марьино';
    const eventDescription = 'Свадьба Алины и Никиты\nУсадьба Марьино';
    
    // Дата: 10 сентября 2026, 15:00
    // Формат для календарей: YYYYMMDDTHHMMSS
    const startDate = '20260910T150000';
    const endDate = '20260910T220000';
    
    // Определяем устройство
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);
    
    // Получаем URL файла event.ics на сервере
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
    const icsUrl = baseUrl + '/event.ics';
    
    if (isIOS) {
        // Для iOS используем webcal:// протокол - откроется в стандартном календаре без скачивания
        const webcalUrl = icsUrl.replace(/^https?:\/\//, 'webcal://');
        window.location.href = webcalUrl;
    } else if (isAndroid) {
        // Для Android открываем файл - система предложит выбрать приложение (календарь)
        window.location.href = icsUrl;
    } else {
        // Для других устройств открываем файл
        window.location.href = icsUrl;
    }
}

// Функция для построения маршрута от текущего местоположения
function buildRoute(event) {
    event.preventDefault();
    
    // Координаты Усадьбы Марьино (примерные, можно уточнить)
    // Если знаете точные координаты, замените на них
    const destinationLat = 59.7714;  // Широта Усадьбы Марьино
    const destinationLon = 30.1756;  // Долгота Усадьбы Марьино
    
    // Яндекс.Карты сами определят местоположение пользователя
    // Символ ~ в начале означает "от текущего местоположения"
    // Формат: rtext=~lat,lon (от текущего местоположения до места назначения)
    const routeUrl = 'https://yandex.ru/maps/?rtext=~' + 
        destinationLat + ',' + destinationLon + 
        '&rtt=auto'; // auto - автомобильный маршрут, можно изменить на mt (общественный транспорт) или pd (пешком)
    
    window.open(routeUrl, '_blank');
}

// Обработка видео/изображения для hero секции
(function() {
    const heroVideo = document.querySelector('.hero-video');
    const heroImage = document.querySelector('.hero-image');
    
    if (!heroVideo || !heroImage) return;
    
    // Определяем мобильное устройство
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    
    // Если мобильное устройство или маленький экран, показываем изображение
    if (isMobile || isSmallScreen) {
        heroVideo.style.display = 'none';
        heroImage.style.display = 'block';
    } else {
        // На десктопе проверяем загрузку видео
        heroVideo.addEventListener('error', function() {
            // При ошибке загрузки видео показываем изображение
            heroVideo.style.display = 'none';
            heroImage.style.display = 'block';
        });
        
        // Проверяем, загрузилось ли видео
        heroVideo.addEventListener('loadeddata', function() {
            // Видео загрузилось успешно
            heroImage.style.display = 'none';
        });
        
        // Если видео не загрузилось за 5 секунд, показываем изображение
        setTimeout(function() {
            if (heroVideo.readyState < 2) { // HAVE_CURRENT_DATA
                heroVideo.style.display = 'none';
                heroImage.style.display = 'block';
            }
        }, 5000);
    }
})();

// Добавляем активное состояние для навигации при прокрутке
window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero');
    const nav = document.querySelector('.nav');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Скрываем навигацию, если находимся в hero секции
    if (heroSection && nav) {
        const heroHeight = heroSection.offsetHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop < heroHeight - 100) {
            // В hero секции - скрываем навигацию
            nav.style.opacity = '0';
            nav.style.pointerEvents = 'none';
        } else {
            // Вне hero секции - показываем навигацию
            nav.style.opacity = '1';
            nav.style.pointerEvents = 'auto';
        }
    }
    
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

// Проверяем при загрузке страницы
window.addEventListener('load', function() {
    const heroSection = document.querySelector('.hero');
    const nav = document.querySelector('.nav');
    
    if (heroSection && nav && window.pageYOffset < heroSection.offsetHeight) {
        nav.style.opacity = '0';
        nav.style.pointerEvents = 'none';
    }
});

// Анимация загрузки с двумя кольцами
(function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');
    
    if (!loadingScreen || !mainContent) return;
    
    // Блокируем прокрутку во время загрузки
    document.body.style.overflow = 'hidden';
    
    // Через 2.2 секунды начинаем раскрытие
    setTimeout(function() {
        loadingScreen.classList.add('expanding');
    }, 2200);
    
    // Через 3 секунды скрываем загрузочный экран и показываем контент
    setTimeout(function() {
        loadingScreen.classList.add('hidden');
        mainContent.classList.add('visible');
        document.body.classList.add('loaded');
        document.body.style.overflow = '';
        
        // Удаляем загрузочный экран из DOM через 1 секунду
        setTimeout(function() {
            loadingScreen.style.display = 'none';
        }, 1000);
    }, 3000);
})();

