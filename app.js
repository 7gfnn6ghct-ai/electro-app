// Полное состояние базы данных системы
var state = {
  role: 'director',
  currentPage: 'home',
  
  // Все 18 обслуживаемых МКД г. Рудного
  houses: [
    { id: 1, address: 'ул. Качарская, д. 53', type: 'Холодный чердак', status: 'Норма' },
    { id: 2, address: 'ул. Сандригайло, д. 100', type: 'Теплый чердак', status: 'Норма' },
    { id: 3, address: 'ул. Корчагина, д. 72', type: 'Холодный чердак', status: 'Внимание (ГВС)' },
    { id: 4, address: 'ул. Ленина, д. 14', type: 'Холодный чердак', status: 'Норма' },
    { id: 5, address: 'ул. Парковая, д. 8', type: 'Теплый чердак', status: 'Норма' },
    { id: 6, address: 'ул. 50 лет Октября, д. 33', type: 'Холодный чердак', status: 'Норма' },
    { id: 7, address: 'ул. И. Франко, д. 12', type: 'Холодный чердак', status: 'Заявки' },
    { id: 8, address: 'ул. Строительная, д. 45', type: 'Теплый чердак', status: 'Норма' },
    { id: 9, address: 'ул. Горняков, д. 21', type: 'Холодный чердак', status: 'Норма' },
    { id: 10, address: 'ул. Комсомольская, д. 6', type: 'Холодный чердак', status: 'Норма' },
    { id: 11, address: 'ул. Дзержинского, д. 19', type: 'Теплый чердак', status: 'Норма' },
    { id: 12, address: 'ул. Топоркова, д. 82', type: 'Холодный чердак', status: 'Норма' },
    { id: 13, address: 'ул. Молодежная, д. 15', type: 'Холодный чердак', status: 'Норма' },
    { id: 14, address: 'ул. Мира, д. 4', type: 'Холодный чердак', status: 'Заявки' },
    { id: 15, address: 'ул. Пионерская, д. 27', type: 'Теплый чердак', status: 'Норма' },
    { id: 16, address: 'ул. Ломоносова, д. 9', type: 'Холодный чердак', status: 'Норма' },
    { id: 17, address: 'ул. Володарского, д. 11', type: 'Холодный чердак', status: 'Норма' },
    { id: 18, address: 'ул. Чкалова, д. 50', type: 'Теплый чердак', status: 'Норма' }
  ],

  // Журнал заявок
  tickets: [
    { id: 101, house: 'ул. Качарская, д. 53', apt: 'кв. 12', type: 'Сантехника', desc: 'Течь стояка ГВС в подвале', priority: 'Высокий', status: 'progress', worker: 'Иван В. (Слесарь)' },
    { id: 102, house: 'ул. Сандригайло, д. 100', apt: 'подъезд 2', type: 'Электрика', desc: 'Нет света на 3 этаже', priority: 'Средний', status: 'new', worker: 'Не назначен' },
    { id: 103, house: 'ул. Корчагина, д. 72', apt: 'кв. 45', type: 'Кровля', desc: 'Протечка во время дождя', priority: 'Низкий', status: 'done', worker: 'Петр С. (Кровельщик)' }
  ],

  // Настройки visibility и интеграций
  settings: {
    tenantCanSeeWorkers: true,
    autoTelegramNotify: true,
    emergencyPhone: '3-80-22',
    nightModeDispatch: false
  }
};

// Главная инициализация
document.addEventListener('DOMContentLoaded', function() {
  initEvents();
  render();
});

function initEvents() {
  // Выбор тестовой роли
  var roleSelect = document.getElementById('roleSelect');
  if (roleSelect) {
    roleSelect.addEventListener('change', function(e) {
      state.role = e.target.value;
      render();
    });
  }

  // Навигация по вкладкам
  var navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(function(item) {
    item.addEventListener('click', function() {
      navItems.forEach(function(i) { i.classList.remove('active'); });
      item.classList.add('active');
      state.currentPage = item.dataset.page;
      render();
    });
  });
}

function render() {
  var app = document.getElementById('app');
  if (!app) return;

  // Ограничение видимости для роли Жильца
  if (state.role === 'tenant') {
    app.innerHTML = renderTenantCabinet();
    return;
  }

  // Ограничение видимости для роли Работника
  if (state.role === 'worker') {
    app.innerHTML = renderWorkerCabinet();
    return;
  }

  // Полный интерфейс (Директор / Диспетчер)
  switch (state.currentPage) {
    case 'home':
      app.innerHTML = renderObjectsPage();
      break;
    case 'tickets':
      app.innerHTML = renderTicketsPage();
      break;
    case 'accidents':
      app.innerHTML = renderAccidentsPage();
      break;
    case 'workers':
      app.innerHTML = renderWorkersPage();
      break;
    case 'settings':
      app.innerHTML = renderSettingsPage();
      break;
    default:
      app.innerHTML = renderObjectsPage();
  }
}

// 🏢 Страница объектов (18 МКД)
function renderObjectsPage() {
  var list = state.houses.map(function(h) {
    return '<div class="house-item">' +
             '<strong>' + h.address + '</strong>' +
             '<div style="font-size:11px; color:#64748b; margin-top:4px;">Тип: ' + h.type + '</div>' +
             '<div style="font-size:11px; color:#2563eb; font-weight:bold; margin-top:2px;">Статус: ' + h.status + '</div>' +
           '</div>';
  }).join('');

  return '<div class="card">' +
           '<div class="card-header">' +
             '<span class="card-title">🏢 Обслуживаемый жилой фонд (18 МКД)</span>' +
             '<button class="btn btn-primary" onclick="alert(\'Функция добавления объекта\')">+ Добавить дом</button>' +
           '</div>' +
           '<p style="font-size:13px; color:#64748b;">Полный перечень многоквартирных жилых домов на сервисном обслуживании ТОО «ЭлектроБезопасность».</p>' +
           '<div class="house-grid">' + list + '</div>' +
         '</div>';
}

// 📋 Страница журнала заявок
function renderTicketsPage() {
  var rows = state.tickets.map(function(t) {
    var badgeClass = t.status === 'new' ? 'badge-new' : (t.status === 'progress' ? 'badge-progress' : 'badge-done');
    var statusText = t.status === 'new' ? 'Новая' : (t.status === 'progress' ? 'В работе' : 'Выполнена');

    return '<div style="padding:12px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">' +
             '<div>' +
               '<strong>#' + t.id + ' — ' + t.house + ' (' + t.apt + ')</strong>' +
               '<div style="font-size:13px; margin:4px 0;">' + t.desc + '</div>' +
               '<small style="color:#64748b;">Тип: ' + t.type + ' | Исполнитель: ' + t.worker + '</small>' +
             '</div>' +
             '<div>' +
               '<span class="badge ' + badgeClass + '">' + statusText + '</span>' +
               (state.role === 'director' || state.role === 'dispatcher' ? 
                 ' <button class="btn btn-outline" style="font-size:11px; padding:4px 8px;" onclick="assignWorker(' + t.id + ')">Назначить</button>' : '') +
             '</div>' +
           '</div>';
  }).join('');

  return '<div class="card">' +
           '<div class="card-header">' +
             '<span class="card-title">📋 Журнал диспетчерских заявок</span>' +
             '<button class="btn btn-success" onclick="createNewTicket()">+ Новая заявка</button>' +
           '</div>' +
           '<div>' + rows + '</div>' +
         '</div>';
}

// ⚠️ Страница аварий
function renderAccidentsPage() {
  return '<div class="card">' +
           '<div class="card-header"><span class="card-title">⚠️ Журнал аварийных отключений</span></div>' +
           '<p style="font-size:13px; color:#64748b; margin-bottom:12px;">Активные плановые и аварийные работы по городу.</p>' +
           '<div style="background:#fff3cd; border:1px solid #ffeba2; padding:12px; border-radius:6px; font-size:13px;">' +
             '<strong>ул. Корчагина, д. 72:</strong> Опрессовка системы отопления. Отключение ГВС до 17:00.' +
           '</div>' +
         '</div>';
}

// 👷 Персонал
function renderWorkersPage() {
  return '<div class="card">' +
           '<div class="card-header"><span class="card-title">👷‍♂️ Персонал на смене</span></div>' +
           '<ul style="list-style:none; font-size:13px; line-height:2;">' +
             '<li>🟢 <strong>Иван В.</strong> — Слесарь-сантехник (На объекте: Качарская 53)</li>' +
             '<li>🟢 <strong>Петр С.</strong> — Электрик/Кровельщик (Дежурный)</li>' +
             '<li>⚪ <strong>Сергей А.</strong> — Смена окончена</li>' +
           '</ul>' +
         '</div>';
}

// ⚙️ Настройки системы
function renderSettingsPage() {
  return '<div class="card">' +
           '<div class="card-header"><span class="card-title">⚙️ Настройки параметры и интеграции</span></div>' +
           '<div class="setting-row">' +
             '<span>Показывать жильцам ФИО мастера</span>' +
             '<input type="checkbox" ' + (state.settings.tenantCanSeeWorkers ? 'checked' : '') + ' onchange="state.settings.tenantCanSeeWorkers = this.checked">' +
           '</div>' +
           '<div class="setting-row">' +
             '<span>Уведомления в Telegram-канал</span>' +
             '<input type="checkbox" ' + (state.settings.autoTelegramNotify ? 'checked' : '') + ' onchange="state.settings.autoTelegramNotify = this.checked">' +
           '</div>' +
           '<div class="setting-row">' +
             '<span>Аварийный номер диспетчера</span>' +
             '<input type="text" value="' + state.settings.emergencyPhone + '" style="padding:4px; border:1px solid #ccc; border-radius:4px; width:100px;">' +
           '</div>' +
         '</div>';
}

// 🏠 Кабинет Жильца
function renderTenantCabinet() {
  return '<div class="card" style="border-left:5px solid var(--danger);">' +
           '<h2>🚨 Круглосуточная Аварийная Служба</h2>' +
           '<p style="font-size:13px; color:#64748b; margin:6px 0 12px 0;">ТОО «ЭлектроБезопасность» — г. Рудный</p>' +
           '<a href="tel:' + state.settings.emergencyPhone + '" class="btn btn-danger" style="font-size:16px;">📞 Аварийный вызов: ' + state.settings.emergencyPhone + '</a>' +
         '</div>' +
         '<div class="card">' +
           '<h3>📝 Подать новую заявку (ул. Качарская, 53)</h3>' +
           '<p style="font-size:13px; color:#64748b; margin-bottom:12px;">Опишите вашу проблему, и диспетчер сразу направит мастера.</p>' +
           '<button class="btn btn-primary" onclick="createNewTicket()">+ Написать обращение</button>' +
         '</div>';
}

// 🛠 Кабинет Работника
function renderWorkerCabinet() {
  return '<div class="card">' +
           '<h2>🛠 Мои наряды на сегодня</h2>' +
           '<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:8px; margin-top:12px;">' +
             '<strong>Заявка #101 — ул. Качарская, д. 53 (кв. 12)</strong>' +
             '<p style="font-size:13px; margin:6px 0;">Работы: Течь стояка ГВС в подвале</p>' +
             '<button class="btn btn-success" onclick="alert(\'Заявка #101 отмечена как выполненная!\')">✓ Отметить выполнение</button>' +
           '</div>' +
         '</div>';
}

// Вспомогательные действия
function createNewTicket() {
  var desc = prompt('Введите описание проблемы:');
  if (desc) {
    state.tickets.unshift({
      id: Math.floor(100 + Math.random() * 900),
      house: 'ул. Качарская, д. 53',
      apt: 'кв. 1',
      type: 'Общее',
      desc: desc,
      priority: 'Средний',
      status: 'new',
      worker: 'Не назначен'
    });
    render();
  }
}

function assignWorker(id) {
  var worker = prompt('Введите имя мастера для заявки #' + id + ':', 'Иван В.');
  if (worker) {
    for (var i = 0; i < state.tickets.length; i++) {
      if (state.tickets[i].id === id) {
        state.tickets[i].worker = worker;
        state.tickets[i].status = 'progress';
      }
    }
    render();
  }
}
