<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Просмотр анкет - Свадьба Алины и Никиты</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px;
            min-height: 100vh;
            position: relative;
        }
        
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(212, 165, 116, 0.1) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
        }
        
        h1 {
            background: linear-gradient(135deg, #d4a574 0%, #b8945f 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 40px;
            text-align: center;
            font-size: 3em;
            font-weight: 700;
            text-shadow: 0 2px 10px rgba(212, 165, 116, 0.3);
            letter-spacing: 2px;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #d4a574 0%, #b8945f 100%);
            color: white;
            padding: 15px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(212, 165, 116, 0.25);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            cursor: pointer;
        }
        
        .stat-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(212, 165, 116, 0.35);
        }
        
        .stat-card:hover::before {
            opacity: 1;
        }
        
        .stat-card.active-filter {
            border: 3px solid #fff;
            box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.5);
        }
        
        .stat-card h3 {
            font-size: 1.8em;
            margin-bottom: 8px;
            font-weight: 700;
            text-shadow: 0 2px 8px rgba(0,0,0,0.2);
            position: relative;
            z-index: 1;
        }
        
        .stat-card p {
            font-size: 0.85em;
            opacity: 0.95;
            font-weight: 500;
            position: relative;
            z-index: 1;
            letter-spacing: 0.3px;
        }
        
        .controls {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            position: relative;
            overflow: hidden;
        }
        
        .btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255,255,255,0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        
        .btn:hover::before {
            width: 300px;
            height: 300px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #d4a574 0%, #b8945f 100%);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(212, 165, 116, 0.4);
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
            color: white;
        }
        
        .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
        }
        
        .btn-danger {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
        }
        
        .btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
        }
        
        .btn span {
            position: relative;
            z-index: 1;
        }
        
        .rsvp-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
        }
        
        .category-tab {
            padding: 10px 20px;
            border: 2px solid #d4a574;
            border-radius: 8px;
            background: white;
            color: #d4a574;
            cursor: pointer;
            font-size: 1em;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .category-tab:hover {
            background: rgba(212, 165, 116, 0.1);
        }
        
        .category-tab.active {
            background: linear-gradient(135deg, #d4a574 0%, #b8945f 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(212, 165, 116, 0.3);
        }
        
        .btn-warning {
            background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
            color: white;
        }
        
        .btn-warning:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
        }
        
        .btn-success {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
        }
        
        .btn-success:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .rsvp-card {
            animation: fadeIn 0.5s ease;
        }
        
        .stat-card {
            animation: fadeIn 0.5s ease;
        }
        
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }
        .stat-card:nth-child(5) { animation-delay: 0.5s; }
        
        .stats-category {
            margin-bottom: 40px;
        }
        
        .category-title {
            font-size: 1.4em;
            color: #d4a574;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #d4a574;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        
        .stats-category {
            margin-bottom: 30px;
        }
        
        .search-box {
            flex: 1;
            min-width: 200px;
            padding: 12px 20px;
            border: 2px solid #d4a574;
            border-radius: 10px;
            font-size: 1em;
            transition: all 0.3s ease;
            background: white;
        }
        
        .search-box:focus {
            outline: none;
            border-color: #b8945f;
            box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.2);
        }
        
        .rsvp-list {
            display: grid;
            gap: 20px;
        }
        
        .rsvp-card {
            border: 2px solid #e0e0e0;
            border-radius: 15px;
            padding: 25px;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            position: relative;
            overflow: hidden;
        }
        
        .rsvp-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.1), transparent);
            transition: left 0.5s ease;
        }
        
        .rsvp-card:hover {
            border-color: #d4a574;
            box-shadow: 0 8px 25px rgba(212, 165, 116, 0.3);
            transform: translateY(-3px);
        }
        
        .rsvp-card:hover::before {
            left: 100%;
        }
        
        .rsvp-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e0e0e0;
        }
        
        .rsvp-name {
            font-size: 1.8em;
            background: linear-gradient(135deg, #d4a574 0%, #b8945f 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        
        .rsvp-date {
            color: #888;
            font-size: 0.9em;
            margin-top: 5px;
        }
        
        .rsvp-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
        }
        
        .info-label {
            font-weight: bold;
            color: #666;
            font-size: 0.9em;
            margin-bottom: 5px;
        }
        
        .info-value {
            color: #333;
        }
        
        .companions-section {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
        }
        
        .companion-item {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 10px;
            border-left: 4px solid #d4a574;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }
        
        .companion-item:hover {
            box-shadow: 0 4px 12px rgba(212, 165, 116, 0.2);
            transform: translateX(5px);
        }
        
        .badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
        }
        
        .badge-yes {
            background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
            color: #155724;
        }
        
        .badge-no {
            background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
            color: #721c24;
        }
        
        .badge:hover {
            transform: scale(1.05);
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        
        .empty {
            text-align: center;
            padding: 40px;
            color: #666;
            font-size: 1.2em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Анкеты гостей</h1>
        
        <!-- Категория: Общая статистика -->
        <div class="stats-category">
            <h2 class="category-title">📊 Общая статистика</h2>
            <div class="stats" id="stats">
                <div class="stat-card" onclick="filterByCategory('all')">
                    <h3 id="totalCount">0</h3>
                    <p>Всего анкет</p>
                </div>
                <div class="stat-card" onclick="filterByCategory('yes')">
                    <h3 id="yesCount">0</h3>
                    <p>Придут (чел.)</p>
                </div>
                <div class="stat-card" onclick="filterByCategory('no')">
                    <h3 id="noCount">0</h3>
                    <p>Не смогут</p>
                </div>
                <div class="stat-card">
                    <h3 id="totalPersons">0</h3>
                    <p>Всего персон</p>
                </div>
            </div>
        </div>
        
        <!-- Категория: Горячее -->
        <div class="stats-category">
            <h2 class="category-title">🍽️ Горячее</h2>
            <div class="stats" id="mainCourseStats">
                <div class="stat-card" data-filter="mainCourse:Рыба" onclick="filterByStatCard('mainCourse', 'Рыба')">
                    <h3 id="fishCount">0</h3>
                    <p>Рыба</p>
                </div>
                <div class="stat-card" data-filter="mainCourse:Мясо" onclick="filterByStatCard('mainCourse', 'Мясо')">
                    <h3 id="meatCount">0</h3>
                    <p>Мясо</p>
                </div>
            </div>
        </div>
        
        <!-- Категория: Второй день -->
        <div class="stats-category">
            <h2 class="category-title">📅 Второй день</h2>
            <div class="stats" id="secondDayStats">
                <div class="stat-card" data-filter="secondDay:yes" onclick="filterByStatCard('secondDay', 'yes')">
                    <h3 id="secondDayYes">0</h3>
                    <p>Остаются</p>
                </div>
                <div class="stat-card" data-filter="secondDay:no" onclick="filterByStatCard('secondDay', 'no')">
                    <h3 id="secondDayNo">0</h3>
                    <p>Не остаются</p>
                </div>
            </div>
        </div>
        
        <!-- Категория: Напитки -->
        <div class="stats-category">
            <h2 class="category-title">🍷 Напитки</h2>
            <div class="stats" id="drinksStats">
                <div class="stat-card" style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);" data-filter="drink:Шампанское" onclick="filterByStatCard('drink', 'Шампанское')">
                    <h3 id="champagneCount">0</h3>
                    <p>Шампанское</p>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #FFE4B5 0%, #F5DEB3 100%); color: #333;" data-filter="drink:Вино сухое белое" onclick="filterByStatCard('drink', 'Вино сухое белое')">
                    <h3 id="whiteWineCount">0</h3>
                    <p>Вино белое</p>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%);" data-filter="drink:Вино красное полусладкое" onclick="filterByStatCard('drink', 'Вино красное полусладкое')">
                    <h3 id="redWineCount">0</h3>
                    <p>Вино красное</p>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%); color: #333;" data-filter="drink:Водка" onclick="filterByStatCard('drink', 'Водка')">
                    <h3 id="vodkaCount">0</h3>
                    <p>Водка</p>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%);" data-filter="drink:Коньяк" onclick="filterByStatCard('drink', 'Коньяк')">
                    <h3 id="cognacCount">0</h3>
                    <p>Коньяк</p>
                </div>
            </div>
        </div>
        
        <div class="controls">
            <button class="btn btn-primary" onclick="loadRSVPs()"><span>🔄 Обновить</span></button>
            <button class="btn btn-secondary" onclick="exportToXLSX()"><span>📥 Экспорт в XLSX</span></button>
            <input type="text" class="search-box" id="searchInput" placeholder="🔍 Поиск по имени или телефону..." onkeyup="filterRSVPs()">
            <button class="btn btn-secondary" id="resetFilterBtn" onclick="resetFilters()" style="display: none;"><span>🔄 Сброс фильтра</span></button>
        </div>
        
        <div class="category-tabs" style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="category-tab active" onclick="filterByCategory('all')" data-category="all">
                <span>Все</span>
            </button>
            <button class="category-tab" onclick="filterByCategory('yes')" data-category="yes">
                <span>✅ Придут</span>
            </button>
            <button class="category-tab" onclick="filterByCategory('no')" data-category="no">
                <span>❌ Не придут</span>
            </button>
        </div>
        
        <div id="error" class="error" style="display: none;"></div>
        <div id="loading" class="loading">Загрузка анкет...</div>
        <div id="rsvpList" class="rsvp-list"></div>
    </div>
    
    <script>
        let allRSVPs = [];
        let currentCategory = 'all';
        let activeFilters = {
            mainCourse: null,
            secondDay: null,
            drink: null
        };
        
        async function loadRSVPs() {
            const loadingEl = document.getElementById('loading');
            const errorEl = document.getElementById('error');
            const listEl = document.getElementById('rsvpList');
            
            loadingEl.style.display = 'block';
            errorEl.style.display = 'none';
            listEl.innerHTML = '';
            
            try {
                const response = await fetch('get_rsvps.php');
                if (!response.ok) {
                    throw new Error('Ошибка загрузки данных');
                }
                
                allRSVPs = await response.json();
                updateStats(allRSVPs);
                filterByCategory(currentCategory);
            } catch (error) {
                errorEl.textContent = 'Ошибка: ' + error.message;
                errorEl.style.display = 'block';
            } finally {
                loadingEl.style.display = 'none';
            }
        }
        
        function updateStats(rsvps) {
            const total = rsvps.length;
            // Считаем количество человек, которые придут (не количество анкет)
            const yes = rsvps.reduce((sum, r) => {
                if (r.attendance === 'yes') {
                    return sum + (parseInt(r.companionsCount) || 1);
                }
                return sum;
            }, 0);
            const no = rsvps.filter(r => r.attendance === 'no').length;
            const totalPersons = rsvps.reduce((sum, r) => {
                if (r.attendance === 'yes') {
                    return sum + (parseInt(r.companionsCount) || 1);
                }
                return sum;
            }, 0);
            
            // Статистика по горячему и второму дню (считаем для каждого человека отдельно)
            const attendingRSVPs = rsvps.filter(r => r.attendance === 'yes');
            let fishCount = 0;
            let meatCount = 0;
            let secondDayYes = 0;
            let secondDayNo = 0;
            
            // Статистика по напиткам (считаем для всех персон, включая спутников)
            let champagneCount = 0;
            let whiteWineCount = 0;
            let redWineCount = 0;
            let vodkaCount = 0;
            let cognacCount = 0;
            
            attendingRSVPs.forEach(rsvp => {
                const companionsCount = parseInt(rsvp.companionsCount) || 1;
                const companionsSame = rsvp.companionsSame === true || rsvp.companionsSame === 'true';
                
                // Считаем горячее для основного гостя
                if (rsvp.mainCourse === 'Рыба') {
                    fishCount++;
                } else if (rsvp.mainCourse === 'Мясо') {
                    meatCount++;
                }
                
                // Считаем второй день для основного гостя
                if (rsvp.secondDay === 'yes') {
                    secondDayYes++;
                } else if (rsvp.secondDay === 'no') {
                    secondDayNo++;
                }
                
                // Считаем напитки основного гостя (всегда +1 для него)
                if (rsvp.drinks && Array.isArray(rsvp.drinks)) {
                    rsvp.drinks.forEach(drink => {
                        if (drink === 'Шампанское') champagneCount++;
                        if (drink === 'Вино сухое белое') whiteWineCount++;
                        if (drink === 'Вино красное полусладкое') redWineCount++;
                        if (drink === 'Водка') vodkaCount++;
                        if (drink === 'Коньяк') cognacCount++;
                    });
                }
                
                // Обрабатываем спутников
                if (companionsCount > 1 && rsvp.companions && Array.isArray(rsvp.companions)) {
                    if (companionsSame) {
                        // Если спутники предпочитают аналогичный выбор, умножаем выбор основного гостя на количество спутников
                        const companionsNumber = companionsCount - 1; // количество спутников (без основного гостя)
                        
                        // Горячее для спутников
                        if (rsvp.mainCourse === 'Рыба') {
                            fishCount += companionsNumber;
                        } else if (rsvp.mainCourse === 'Мясо') {
                            meatCount += companionsNumber;
                        }
                        
                        // Второй день для спутников
                        if (rsvp.secondDay === 'yes') {
                            secondDayYes += companionsNumber;
                        } else if (rsvp.secondDay === 'no') {
                            secondDayNo += companionsNumber;
                        }
                        
                        // Напитки для спутников
                        if (rsvp.drinks && Array.isArray(rsvp.drinks)) {
                            rsvp.drinks.forEach(drink => {
                                if (drink === 'Шампанское') champagneCount += companionsNumber;
                                if (drink === 'Вино сухое белое') whiteWineCount += companionsNumber;
                                if (drink === 'Вино красное полусладкое') redWineCount += companionsNumber;
                                if (drink === 'Водка') vodkaCount += companionsNumber;
                                if (drink === 'Коньяк') cognacCount += companionsNumber;
                            });
                        }
                    } else {
                        // Если спутники имеют индивидуальный выбор, считаем каждого отдельно
                        rsvp.companions.forEach(companion => {
                            // Горячее для спутника
                            if (companion.mainCourse === 'Рыба') {
                                fishCount++;
                            } else if (companion.mainCourse === 'Мясо') {
                                meatCount++;
                            }
                            
                            // Второй день для спутника
                            if (companion.secondDay === 'yes') {
                                secondDayYes++;
                            } else if (companion.secondDay === 'no') {
                                secondDayNo++;
                            }
                            
                            // Напитки для спутника
                            if (companion.drinks && Array.isArray(companion.drinks)) {
                                companion.drinks.forEach(drink => {
                                    if (drink === 'Шампанское') champagneCount++;
                                    if (drink === 'Вино сухое белое') whiteWineCount++;
                                    if (drink === 'Вино красное полусладкое') redWineCount++;
                                    if (drink === 'Водка') vodkaCount++;
                                    if (drink === 'Коньяк') cognacCount++;
                                });
                            }
                        });
                    }
                }
            });
            
            document.getElementById('totalCount').textContent = total;
            document.getElementById('yesCount').textContent = yes;
            document.getElementById('noCount').textContent = no;
            document.getElementById('totalPersons').textContent = totalPersons;
            document.getElementById('fishCount').textContent = fishCount;
            document.getElementById('meatCount').textContent = meatCount;
            document.getElementById('secondDayYes').textContent = secondDayYes;
            document.getElementById('secondDayNo').textContent = secondDayNo;
            document.getElementById('champagneCount').textContent = champagneCount;
            document.getElementById('whiteWineCount').textContent = whiteWineCount;
            document.getElementById('redWineCount').textContent = redWineCount;
            document.getElementById('vodkaCount').textContent = vodkaCount;
            document.getElementById('cognacCount').textContent = cognacCount;
        }
        
        function displayRSVPs(rsvps) {
            const listEl = document.getElementById('rsvpList');
            
            if (rsvps.length === 0) {
                listEl.innerHTML = '<div class="empty">Анкет пока нет</div>';
                return;
            }
            
            listEl.innerHTML = rsvps.map(rsvp => {
                const date = new Date(rsvp.timestamp);
                const dateStr = date.toLocaleString('ru-RU');
                const attendanceBadge = rsvp.attendance === 'yes' 
                    ? '<span class="badge badge-yes">Придет</span>' 
                    : '<span class="badge badge-no">Не придет</span>';
                
                let companionsHtml = '';
                const companionsCount = parseInt(rsvp.companionsCount) || 1;
                const companionsSame = rsvp.companionsSame === true || rsvp.companionsSame === 'true';
                
                if (companionsCount > 1 && rsvp.companions && Array.isArray(rsvp.companions) && rsvp.companions.length > 0) {
                    companionsHtml = '<div class="companions-section"><strong>Спутники:</strong>';
                    
                    if (companionsSame) {
                        // Если спутники предпочитают аналогичный выбор, показываем их имена и выбор основного гостя
                        rsvp.companions.forEach(comp => {
                            companionsHtml += `
                                <div class="companion-item">
                                    <strong>${comp.name || 'Не указано'}</strong><br>
                                    Напитки: ${rsvp.drinks && Array.isArray(rsvp.drinks) ? rsvp.drinks.join(', ') : 'Не указано'}<br>
                                    Горячее: ${rsvp.mainCourse || 'Не указано'}<br>
                                    Второй день: ${rsvp.secondDay === 'yes' ? 'Да' : 'Нет'}
                                </div>
                            `;
                        });
                    } else {
                        // Если спутники имеют индивидуальный выбор
                        rsvp.companions.forEach(comp => {
                            companionsHtml += `
                                <div class="companion-item">
                                    <strong>${comp.name || 'Не указано'}</strong><br>
                                    Напитки: ${comp.drinks && Array.isArray(comp.drinks) ? comp.drinks.join(', ') : 'Не указано'}<br>
                                    Горячее: ${comp.mainCourse || 'Не указано'}<br>
                                    Второй день: ${comp.secondDay === 'yes' ? 'Да' : 'Нет'}
                                </div>
                            `;
                        });
                    }
                    companionsHtml += '</div>';
                }
                
                return `
                    <div class="rsvp-card">
                        <div class="rsvp-header">
                            <div>
                                <div class="rsvp-name">${rsvp.name || 'Не указано'}</div>
                                <div class="rsvp-date">${dateStr}</div>
                            </div>
                            ${attendanceBadge}
                        </div>
                        <div class="rsvp-info">
                            <div class="info-item">
                                <span class="info-label">Телефон</span>
                                <span class="info-value">${rsvp.phone || 'Не указано'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Количество персон</span>
                                <span class="info-value">${rsvp.companionsCount || 1}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Напитки</span>
                                <span class="info-value">${rsvp.drinks.join(', ') || 'Не указано'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Горячее</span>
                                <span class="info-value">${rsvp.mainCourse || 'Не указано'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Второй день</span>
                                <span class="info-value">${rsvp.secondDay === 'yes' ? 'Да' : 'Нет'}</span>
                            </div>
                            ${rsvp.message && rsvp.message !== 'Нет пожеланий' ? `
                            <div class="info-item">
                                <span class="info-label">Пожелания</span>
                                <span class="info-value">${rsvp.message}</span>
                            </div>
                            ` : ''}
                        </div>
                        ${companionsHtml}
                        <div class="rsvp-actions">
                            ${rsvp.attendance === 'yes' ? 
                                `<button class="btn btn-warning" onclick="markAsNotComing('${rsvp.id}', '${rsvp.name || 'Анкета'}')"><span>❌ Не придет</span></button>` 
                                : `<button class="btn btn-success" onclick="markAsComing('${rsvp.id}', '${rsvp.name || 'Анкета'}')"><span>✅ Придет</span></button>`}
                            <button class="btn btn-danger" onclick="deleteRSVP('${rsvp.id}', '${rsvp.name || 'Анкета'}')"><span>🗑️ Удалить</span></button>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        async function markAsNotComing(id, name) {
            if (!confirm(`Изменить статус анкеты "${name}" на "Не придет"?`)) {
                return;
            }
            
            try {
                const response = await fetch('update_attendance.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id, attendance: 'no' })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Статус анкеты изменен на "Не придет"');
                    loadRSVPs(); // Перезагружаем список
                } else {
                    alert('Ошибка: ' + (result.error || 'Неизвестная ошибка'));
                }
            } catch (error) {
                alert('Ошибка при изменении статуса: ' + error.message);
            }
        }
        
        async function markAsComing(id, name) {
            if (!confirm(`Изменить статус анкеты "${name}" на "Придет"?`)) {
                return;
            }
            
            try {
                const response = await fetch('update_attendance.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id, attendance: 'yes' })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Статус анкеты изменен на "Придет"');
                    loadRSVPs(); // Перезагружаем список
                } else {
                    alert('Ошибка: ' + (result.error || 'Неизвестная ошибка'));
                }
            } catch (error) {
                alert('Ошибка при изменении статуса: ' + error.message);
            }
        }
        
        async function deleteRSVP(id, name) {
            if (!confirm(`Вы уверены, что хотите удалить анкету "${name}"?`)) {
                return;
            }
            
            try {
                const response = await fetch('delete_rsvp.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Анкета успешно удалена');
                    loadRSVPs(); // Перезагружаем список
                } else {
                    alert('Ошибка: ' + (result.error || 'Неизвестная ошибка'));
                }
            } catch (error) {
                alert('Ошибка при удалении: ' + error.message);
            }
        }
        
        function filterByCategory(category) {
            currentCategory = category;
            
            // Обновляем активную вкладку
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.category === category) {
                    tab.classList.add('active');
                }
            });
            
            applyAllFilters();
        }
        
        function filterRSVPs() {
            applyAllFilters();
        }
        
        function applyAllFilters() {
            // Фильтруем по категории
            let filtered = allRSVPs;
            if (currentCategory === 'yes') {
                filtered = allRSVPs.filter(r => r.attendance === 'yes');
            } else if (currentCategory === 'no') {
                filtered = allRSVPs.filter(r => r.attendance === 'no');
            }
            
            // Применяем дополнительные фильтры (с учетом спутников)
            if (activeFilters.mainCourse) {
                filtered = filtered.filter(r => {
                    // Проверяем основного гостя
                    if (r.mainCourse === activeFilters.mainCourse) {
                        return true;
                    }
                    
                    // Проверяем спутников
                    const companionsCount = parseInt(r.companionsCount) || 1;
                    const companionsSame = r.companionsSame === true || r.companionsSame === 'true';
                    
                    if (companionsCount > 1 && r.companions && Array.isArray(r.companions)) {
                        if (companionsSame) {
                            // Если спутники предпочитают аналогичный выбор, проверяем выбор основного гостя
                            return r.mainCourse === activeFilters.mainCourse;
                        } else {
                            // Если спутники имеют индивидуальный выбор, проверяем каждого
                            return r.companions.some(comp => comp.mainCourse === activeFilters.mainCourse);
                        }
                    }
                    
                    return false;
                });
            }
            
            if (activeFilters.secondDay !== null) {
                filtered = filtered.filter(r => {
                    // Проверяем основного гостя
                    if (r.secondDay === activeFilters.secondDay) {
                        return true;
                    }
                    
                    // Проверяем спутников
                    const companionsCount = parseInt(r.companionsCount) || 1;
                    const companionsSame = r.companionsSame === true || r.companionsSame === 'true';
                    
                    if (companionsCount > 1 && r.companions && Array.isArray(r.companions)) {
                        if (companionsSame) {
                            // Если спутники предпочитают аналогичный выбор, проверяем выбор основного гостя
                            return r.secondDay === activeFilters.secondDay;
                        } else {
                            // Если спутники имеют индивидуальный выбор, проверяем каждого
                            return r.companions.some(comp => comp.secondDay === activeFilters.secondDay);
                        }
                    }
                    
                    return false;
                });
            }
            
            if (activeFilters.drink) {
                filtered = filtered.filter(r => {
                    // Проверяем напитки основного гостя
                    if (r.drinks && Array.isArray(r.drinks) && r.drinks.includes(activeFilters.drink)) {
                        return true;
                    }
                    
                    // Проверяем спутников
                    const companionsCount = parseInt(r.companionsCount) || 1;
                    const companionsSame = r.companionsSame === true || r.companionsSame === 'true';
                    
                    if (companionsCount > 1 && r.companions && Array.isArray(r.companions)) {
                        if (companionsSame) {
                            // Если спутники предпочитают аналогичный выбор, проверяем напитки основного гостя
                            return r.drinks && Array.isArray(r.drinks) && r.drinks.includes(activeFilters.drink);
                        } else {
                            // Если спутники имеют индивидуальный выбор, проверяем каждого
                            return r.companions.some(comp => {
                                return comp.drinks && Array.isArray(comp.drinks) && comp.drinks.includes(activeFilters.drink);
                            });
                        }
                    }
                    
                    return false;
                });
            }
            
            // Применяем поиск, если есть
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            if (searchTerm) {
                filtered = filtered.filter(rsvp => {
                    const name = (rsvp.name || '').toLowerCase();
                    const phone = (rsvp.phone || '').toLowerCase();
                    
                    // Также ищем по именам спутников
                    let companionNames = '';
                    if (rsvp.companions && Array.isArray(rsvp.companions)) {
                        companionNames = rsvp.companions.map(c => (c.name || '').toLowerCase()).join(' ');
                    }
                    
                    return name.includes(searchTerm) || phone.includes(searchTerm) || companionNames.includes(searchTerm);
                });
            }
            
            displayRSVPs(filtered);
            updateResetButton();
        }
        
        function filterByStatCard(type, value) {
            // Убираем предыдущий фильтр этого типа
            if (activeFilters[type] === value) {
                activeFilters[type] = null;
            } else {
                activeFilters[type] = value;
            }
            
            // Обновляем визуальное состояние карточек
            document.querySelectorAll('.stat-card').forEach(card => {
                card.classList.remove('active-filter');
            });
            
            // Применяем фильтры
            applyAllFilters();
            
            // Обновляем активные карточки
            if (activeFilters.mainCourse) {
                const card = document.querySelector(`[data-filter="mainCourse:${activeFilters.mainCourse}"]`);
                if (card) card.classList.add('active-filter');
            }
            if (activeFilters.secondDay !== null) {
                const card = document.querySelector(`[data-filter="secondDay:${activeFilters.secondDay}"]`);
                if (card) card.classList.add('active-filter');
            }
            if (activeFilters.drink) {
                const card = document.querySelector(`[data-filter="drink:${activeFilters.drink}"]`);
                if (card) card.classList.add('active-filter');
            }
        }
        
        function resetFilters() {
            currentCategory = 'all';
            activeFilters = {
                mainCourse: null,
                secondDay: null,
                drink: null
            };
            
            // Обновляем вкладки
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.category === 'all') {
                    tab.classList.add('active');
                }
            });
            
            // Убираем активные карточки
            document.querySelectorAll('.stat-card').forEach(card => {
                card.classList.remove('active-filter');
            });
            
            // Очищаем поиск
            document.getElementById('searchInput').value = '';
            
            // Показываем все
            applyAllFilters();
        }
        
        function updateResetButton() {
            const resetBtn = document.getElementById('resetFilterBtn');
            const hasFilters = currentCategory !== 'all' || 
                             activeFilters.mainCourse || 
                             activeFilters.secondDay !== null || 
                             activeFilters.drink ||
                             document.getElementById('searchInput').value.length > 0;
            
            if (hasFilters) {
                resetBtn.style.display = 'inline-block';
            } else {
                resetBtn.style.display = 'none';
            }
        }
        
        function exportToXLSX() {
            if (allRSVPs.length === 0) {
                alert('Нет данных для экспорта');
                return;
            }
            
            // Подготавливаем данные для экспорта - каждая персона отдельной строкой
            const data = [];
            
            allRSVPs.forEach(rsvp => {
                const companionsCount = parseInt(rsvp.companionsCount) || 1;
                const companionsSame = rsvp.companionsSame === true || rsvp.companionsSame === 'true';
                
                // Строка для основного гостя
                data.push({
                    'Имя': rsvp.name || '',
                    'Телефон': rsvp.phone || '',
                    'Присутствие': rsvp.attendance === 'yes' ? 'Придет' : 'Не придет',
                    'Напитки': (rsvp.drinks || []).join(', '),
                    'Горячее': rsvp.mainCourse || '',
                    'Второй день': rsvp.secondDay === 'yes' ? 'Да' : 'Нет',
                    'Пожелания': rsvp.message || '',
                    'Дата': new Date(rsvp.timestamp).toLocaleString('ru-RU')
                });
                
                // Строки для спутников (если есть)
                if (rsvp.attendance === 'yes' && companionsCount > 1 && rsvp.companions && Array.isArray(rsvp.companions)) {
                    rsvp.companions.forEach(comp => {
                        if (companionsSame) {
                            // Если спутники предпочитают аналогичный выбор
                            data.push({
                                'Имя': comp.name || 'Не указано',
                                'Телефон': rsvp.phone || '', // Номер телефона основного гостя
                                'Присутствие': 'Придет',
                                'Напитки': (rsvp.drinks || []).join(', '), // Напитки основного гостя
                                'Горячее': rsvp.mainCourse || '', // Горячее основного гостя
                                'Второй день': rsvp.secondDay === 'yes' ? 'Да' : 'Нет', // Второй день основного гостя
                                'Пожелания': '',
                                'Дата': new Date(rsvp.timestamp).toLocaleString('ru-RU')
                            });
                        } else {
                            // Если спутники имеют индивидуальный выбор
                            data.push({
                                'Имя': comp.name || 'Не указано',
                                'Телефон': rsvp.phone || '', // Номер телефона основного гостя
                                'Присутствие': 'Придет',
                                'Напитки': (comp.drinks && Array.isArray(comp.drinks)) ? comp.drinks.join(', ') : 'Не указано',
                                'Горячее': comp.mainCourse || 'Не указано',
                                'Второй день': comp.secondDay === 'yes' ? 'Да' : 'Нет',
                                'Пожелания': '',
                                'Дата': new Date(rsvp.timestamp).toLocaleString('ru-RU')
                            });
                        }
                    });
                }
            });
            
            // Создаем рабочую книгу
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data);
            
            // Настраиваем ширину колонок
            const colWidths = [
                { wch: 25 }, // Имя
                { wch: 18 }, // Телефон
                { wch: 12 }, // Присутствие
                { wch: 30 }, // Напитки
                { wch: 12 }, // Горячее
                { wch: 12 }, // Второй день
                { wch: 30 }, // Пожелания
                { wch: 20 }  // Дата
            ];
            ws['!cols'] = colWidths;
            
            // Добавляем лист в книгу
            XLSX.utils.book_append_sheet(wb, ws, 'Анкеты гостей');
            
            // Экспортируем файл
            const fileName = `rsvps_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);
        }
        
        // Загружаем данные при загрузке страницы
        loadRSVPs();
        
        // Обновляем кнопку сброса при изменении поиска
        document.getElementById('searchInput').addEventListener('input', function() {
            updateResetButton();
        });
    </script>
</body>
</html>

