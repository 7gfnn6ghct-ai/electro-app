// База данных обслуживаемого фонда ТОО "ЭлектроБезопасность" (г. Рудный)
var state = {
  role: 'director',
  activeTab: 'houses',
  
  // Реестр 18 МКД
  houses: [
    { address: 'ул. Качарская, д. 26', status: 'Норма' },
    { address: 'ул. Качарская, д. 31', status: 'Норма' },
    { address: 'ул. Качарская, д. 39', status: 'Норма' },
    { address: 'ул. Качарская, д. 41', status: 'Норма' },
    { address: 'ул. Качарская, д. 47', status: 'Норма' },
    { address: 'ул. Качарская, д. 49', status: 'Норма' },
    { address: 'ул. Качарская, д. 53', status: 'Норма' },
    
    { address: 'ул. Корчагина, д. 138', status: 'Норма' },
    { address: 'ул. Корчагина, д. 160', status: 'Норма' },
    { address: 'ул. Корчагина, д. 162', status: 'Норма' },
    { address: 'ул. Корчагина, д. 166', status: 'Норма' },
    { address: 'ул. Корчагина, д. 188', status: 'Плановые работы' },

    { address: 'ул. Сандригайло, д. 62', status: 'Норма' },
    { address: 'ул. Сандригайло, д. 65', status: 'Норма' },
    { address: 'ул. Сандригайло, д. 67', status: 'Норма' },
    { address: 'ул. Сандригайло, д. 98', status: 'Норма' },
    { address: 'ул. Сандригайло, д. 100', status: 'Норма' },

    { address: 'ул. Космонавтов, д. 28', status: 'Норма' },
    { address: 'ул. 50 лет Октября, д. 8', status: 'Норма' }
  ],

  // База заявок
  tickets: [
    { id: 301, house: 'ул. Качарская, д. 53', apt: 'кв. 12', phone: '8 (777) 123-45-67', type: 'Сантехника', desc: 'Проверка розлива ГВС в подвале', status: 'progress', worker: 'Иван В.' },
    { id: 302, house: 'ул. Сандригайло, д. 100', apt: 'подъезд 2', phone: '8 (705) 987-65-43', type: 'Электрика', desc: 'Замена фазного автомата', status: 'new', worker: 'Не назначен' }
  ],

  // Объявления для дома
  announcements: [
    { date: '14.08.2026', title: 'Гидравлические испытания', text: 'Завтра с 09:00 до 17:00 будут проводиться плановые работы на магистрали. Возможны временные перебои.' }
  ],

  emergencyPhone: '3-80-22'
};

document.addEventListener('DOMContentLoaded', function() {
  initApp();
  render();
});

function initApp() {
  var roleSelect = document.getElementById('roleSelector');
  if (roleSelect) {
    roleSelect.addEventListener('change', function(e) {
      state.role = e.target.value;
      render();
    });
  }

  var toggleBtn = document.getElementById('sidebarToggle');
  var sidebar = document.getElementById('sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
  }

  var navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      navBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.activeTab = btn.dataset.page;
      if (sidebar) sidebar.classList.remove('open');
      render();
    });
  });
}

function render() {
  var viewport = document.getElementById('contentApp');
  var sidebar = document.getElementById('sidebar');
  var toggleBtn = document.getElementById('sidebarToggle');

  if (!viewport) return;

  // 1. ИЗОЛЯЦИЯ КАБИНЕТА ЖИЛЬЦА
  if (state.role === 'tenant') {
    if (sidebar) sidebar.classList.add('hidden');
    if (toggleBtn) toggleBtn.style.display = 'none';
    viewport.innerHTML = renderTenantCabinet();
    initTenantFormEvents();
    return;
  } 

  // Для служебных ролей показываем меню
  if (sidebar) sidebar.classList.remove('hidden');
  if (toggleBtn) toggleBtn.style.display = 'block';

  // 2. КАБИНЕТ РАБОТНИКА
  if (state.role === 'worker') {
    viewport.innerHTML = renderWorkerCabinet();
    return;
  }

  // 3. КАБИНЕТ ДИРЕКТОРА / ДИСПЕТЧЕРА
  switch(state.activeTab) {
    case 'houses':
      viewport.innerHTML = renderHousesTab();
      break;
    case 'tickets':
      viewport.innerHTML = renderTicketsTab();
      break;
    case 'accidents':
      viewport.innerHTML = renderAccidentsTab();
      break;
    case 'workers':
      viewport.innerHTML = renderWorkersTab();
      break;
    case 'settings':
      viewport.innerHTML = renderSettingsTab();
      break;
    default:
      viewport.innerHTML = renderHousesTab();
  }
}

// ------------------------------------------
// ИНТЕРФЕЙС ЖИЛЬЦА
// ------------------------------------------
function renderTenantCabinet() {
  var houseAddress = 'ул. Качарская, д. 53';

  var newsHtml = state.announcements.map(function(a) {
    return '<div style="background:#fff3cd; border-left:4px solid var(--warning); padding:12px; border-radius:6px; margin-bottom:10px;">' +
             '<strong>📢 ' + a.title + ' (' + a.date + ')</strong>' +
             '<p style="font-size:13px; margin-top:4px; color:#451a03;">' + a.text + '</p>' +
           '</div>';
  }).join('');

  return '' +
    '<!-- Контакты и статусы -->' +
    '<div class="card" style="border-left: 5px solid var(--danger);">' +
      '<div class="card-header" style="border:none; padding:0; margin-bottom:8px;">' +
        '<span class="card-title">🏠 Ваш дом: ' + houseAddress + '</span>' +
        '<span class="badge badge-done">Обслуживается</span>' +
      '</div>' +
      '<p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">Сервисная компания: ТОО «ЭлектроБезопасность»</p>' +
      '<div style="background:#fef2f2; border:1px solid #fecaca; padding:12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">' +
        '<div>' +
          '<strong style="color:var(--danger); display:block;">Аварийная диспетчерская служба:</strong>' +
          '<span style="font-size:13px; color:#7f1d1d;">Круглосуточный вызов бригады</span>' +
        '</div>' +
        '<a href="tel:' + state.emergencyPhone + '" class="btn btn-danger">📞 Позвонить: ' + state.emergencyPhone + '</a>' +
      '</div>' +
    '</div>' +

    '<!-- Объявления -->' +
    '<div class="card">' +
      '<div class="card-header"><span class="card-title">📌 Объявления для вашего дома</span></div>' +
      (newsHtml || '<p style="font-size:13px; color:var(--text-muted);">Объявлений нет.</p>') +
    '</div>' +

    '<!-- Форма заявки -->' +
    '<div class="card">' +
      '<div class="card-header"><span class="card-title">📝 Подать заявку на ремонт</span></div>' +
      '<form id="tenantTicketForm">' +
        '<div class="form-group">' +
          '<label>Адрес дома:</label>' +
          '<input type="text" id="formAddress" class="form-control" value="' + houseAddress + '" readonly style="background:#f1f5f9;">' +
        '</div>' +
        '<div style="display:flex; gap:12px; flex-wrap:wrap;">' +
          '<div class="form-group" style="flex:1; min-width:120px;">' +
            '<label>Квартира / Подъезд *</label>' +
            '<input type="text" id="formApt" class="form-control" placeholder="кв. 12" required>' +
          '</div>' +
          '<div class="form-group" style="flex:1; min-width:180px;">' +
            '<label>Телефон для связи *</label>' +
            '<input type="tel" id="formPhone" class="form-control" placeholder="8-777-000-00-00" required>' +
          '</div>' +
        '</div>' +
        '<div class="form-group">' +
          '<label>Категория неисправности:</label>' +
          '<select id="formType" class="form-control">' +
            '<option value="Электрика">⚡ Электрика (щитовая, свет, розетки)</option>' +
            '<option value="Сантехника">🚰 Сантехника (отопление, ГВС/ХВС)</option>' +
            '<option value="Другое">🛠 Общие работы</option>' +
          '</select>' +
        '</div>' +
        '<div class="form-group">' +
          '<label>Суть проблемы *</label>' +
          '<textarea id="formDesc" class="form-control" rows="3" placeholder="Опишите, что у вас произошло..." required></textarea>' +
        '</div>' +
        '<button type="submit" class="btn btn-primary" style="width:100%; padding:12px;">Отправить заявку диспетчеру</button>' +
      '</form>' +
    '</div>';
}

function initTenantFormEvents() {
  var form = document.getElementById('tenantTicketForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var newTicket = {
        id: Math.floor(300 + Math.random() * 700),
        house: document.getElementById('formAddress').value,
        apt: document.getElementById('formApt').value,
        phone: document.getElementById('formPhone').value,
        type: document.getElementById('formType').value,
        desc: document.getElementById('formDesc').value,
        status: 'new',
        worker: 'Не назначен'
      };

      state.tickets.unshift(newTicket);
      alert('Ваша заявка #' + newTicket.id + ' принята диспетчером! Ожидайте звонка.');
      form.reset();
    });
  }
}

// ------------------------------------------
// АДМИНИСТРАТИВНЫЕ ВТАКДКИ (Персонал)
// ------------------------------------------
function renderHousesTab() {
  var cardsHtml = state.houses.map(function(h) {
    return '<div class="house-card">' +
             '<strong>' + h.address + '</strong>' +
             '<div style="font-size:12px; color:var(--primary); font-weight:bold; margin-top:4px;">' + h.status + '</div>' +
           '</div>';
  }).join('');

  return '<div class="card">' +
           '<div class="card-header"><span class="card-title">🏢 Обслуживаемый жилой фонд (18 МКД)</span></div>' +
           '<div class="grid-houses">' + cardsHtml + '</div>' +
         '</div>';
}

function renderTicketsTab() {
  var listHtml = state.tickets.map(function(t) {
    var statusBadge = t.status === 'new' ? '<span class="badge badge-new">Новая</span>' : 
                     (t.status === 'progress' ? '<span class="badge badge-progress">В работе</span>' : '<span class="badge badge-done">Выполнено</span>');
    
    return '<div style="padding:12px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">' +
             '<div>' +
               '<strong>#' + t.id + ' — ' + t.house + ' (' + t.apt + ')</strong>' +
               '<div style="font-size:13px; margin:4px 0;">' + t.desc + '</div>' +
               '<small style="color:var(--text-muted);">Тел: ' + t.phone + ' | Категория: ' + t.type + ' | Мастер: ' + t.worker + '</small>' +
             '</div>' +
             '<div>' +
               statusBadge +
               ' <button class="btn" style="border:1px solid var(--border); font-size:12px; padding:4px 8px; margin-left:6px;" onclick="assignWorker(' + t.id + ')">Назначить</button>' +
             '</div>' +
           '</div>';
  }).join('');

  return '<div class="card">' +
           '<div class="card-header"><span class="card-title">📋 Журнал заявок диспетчера</span></div>' +
           '<div>' + listHtml + '</div>' +
         '</div>';
}

function renderAccidentsTab() {
  return '<div class="card">' +
           '<div class="card-header"><span class="card-title">⚠️ Журнал аварий и плановых работ</span></div>' +
           '<div style="background:#fff3cd; border-left:4px solid var(--warning); padding:12px; border-radius:6px; font-size:13px;">' +
             '<strong>ул. Корчагина, 188:</strong> Проведение ревизии распределительного щита.' +
           '</div>' +
         '</div>';
}

function renderWorkersTab() {
  return '<div class="card">' +
           '<div class="card-header"><span class="card-title">👷‍♂️ Персонал на смене</span></div>' +
           '<ul style="list-style:none; font-size:14px; line-height:2;">' +
             '<li>🟢 <strong>Иван В.</strong> — Слесарь-сантехник</li>' +
             '<li>🟢 <strong>Олег Ч.</strong> — Инженер-электрик</li>' +
           '</ul>' +
         '</div>';
}

function renderSettingsTab() {
  return '<div class="card">' +
           '<div class="card-header"><span class="card-title">⚙️ Системные настройки</span></div>' +
           '<p style="font-size:14px;">Диспетчерский телефон: <strong>' + state.emergencyPhone + '</strong></p>' +
         '</div>';
}

function renderWorkerCabinet() {
  return '<div class="card">' +
           '<h2>🛠 Мои наряды на смену</h2>' +
           '<div style="background:#f8fafc; padding:12px; border:1px solid var(--border); border-radius:8px; margin-top:12px;">' +
             '<strong>Заявка #301 — ул. Качарская, д. 53 (кв. 12)</strong>' +
             '<p style="font-size:13px; margin:6px 0;">Задание: Проверка розлива ГВС в подвале</p>' +
             '<button class="btn btn-success" onclick="alert(\'Статус заявки #301 изменен на Выполнено\')">✓ Отметить выполнение</button>' +
           '</div>' +
         '</div>';
}

function assignWorker(id) {
  var w = prompt('Введите имя мастера для заявки #' + id, 'Иван В.');
  if (w) {
    for(var i = 0; i < state.tickets.length; i++) {
      if(state.tickets[i].id === id) {
        state.tickets[i].worker = w;
        state.tickets[i].status = 'progress';
      }
    }
    render();
  }
}
