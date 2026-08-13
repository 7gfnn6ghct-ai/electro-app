var state = {
  role: 'director',
  tickets: [
    { id: 101, address: 'ул. Качарская, д. 53', issue: 'Течь стояка ГВС в подвале', status: 'В работе', worker: 'Иван В.' },
    { id: 102, address: 'ул. Сандригайло, д. 100', issue: 'Нет света во 2 подъезде', status: 'Новая', worker: 'Не назначен' }
  ]
};

document.addEventListener('DOMContentLoaded', function() {
  var roleSelect = document.getElementById('roleSelect');
  var sidebar = document.getElementById('sidebar');
  var menuBtn = document.getElementById('menuToggleBtn');
  var closeBtn = document.getElementById('closeSidebarBtn');

  if (roleSelect) {
    roleSelect.addEventListener('change', function(e) {
      state.role = e.target.value;
      renderPage();
    });
  }

  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', function() {
      sidebar.classList.add('open');
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', function() {
      sidebar.classList.remove('open');
    });
  }

  var navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      navBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      if (sidebar) sidebar.classList.remove('open');
      renderPage();
    });
  });

  renderPage();
});

function renderPage() {
  var container = document.getElementById('pageContainer');
  if (!container) return;

  if (state.role === 'tenant') {
    container.innerHTML = 
      '<div class="card" style="border-left: 5px solid #ef4444;">' +
        '<h2 class="card-title">📞 Экстренная связь</h2>' +
        '<p style="margin-bottom: 12px;">Круглосуточный диспетчер ТОО "ЭлектроБезопасность"</p>' +
        '<a href="tel:38022" class="btn btn-danger" style="font-size: 18px; text-decoration: none; display: inline-block;">' +
          'Позвонить: 3-80-22' +
        '</a>' +
      '</div>' +
      '<div class="card">' +
        '<h3 class="card-title">📝 Подать заявку на ремонт</h3>' +
        '<p style="font-size: 14px; color: #64748b; margin-bottom: 15px;">Объект: ул. Качарская, 53</p>' +
        '<button class="btn btn-primary" onclick="alert(\'Заявка отправлена диспетчеру!\')">+ Создать обращение</button>' +
      '</div>';
    return;
  }

  if (state.role === 'worker') {
    container.innerHTML = 
      '<div class="card">' +
        '<h2 class="card-title">🛠 Мои задания на сегодня</h2>' +
        '<div style="margin-top: 15px;">' +
          '<div style="padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">' +
            '<strong>Заявка #101 — ул. Качарская, 53</strong>' +
            '<p style="font-size: 14px; margin: 5px 0;">Проблема: Течь стояка ГВС в подвале</p>' +
            '<button class="btn btn-success" onclick="alert(\'Статус изменен на Выполнено!\')">✓ Отметить как выполнено</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    return;
  }

  var ticketsHtml = state.tickets.map(function(t) {
    return '<div style="padding: 10px; border-bottom: 1px solid #e2e8f0;">' +
             '<strong>#' + t.id + ' — ' + t.address + '</strong>' +
             '<p style="font-size: 13px; margin: 4px 0;">' + t.issue + '</p>' +
             '<span style="font-size: 12px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px;">' +
               t.status + ' (' + t.worker + ')' +
             '</span>' +
           '</div>';
  }).join('');

  container.innerHTML = 
    '<div class="card">' +
      '<h2 class="card-title">' + 
        (state.role === 'director' ? '👑 Панель Управления Директора' : '🎧 Рабочее место Диспетчера') + 
      '</h2>' +
      '<p style="color: #64748b; font-size: 14px;">Обслуживаемые объекты: 18 многоквартирных домов</p>' +
    '</div>' +
    '<div class="grid">' +
      '<div class="card">' +
        '<h3 class="card-title">📋 Активные заявки (' + state.tickets.length + ')</h3>' +
        ticketsHtml +
      '</div>' +
      '<div class="card">' +
        '<h3 class="card-title">🏢 Объекты в обслуживании</h3>' +
        '<ul style="list-style: none; font-size: 14px; line-height: 1.8;">' +
          '<li>📍 ул. Качарская, 53</li>' +
          '<li>📍 ул. Сандригайло, 100</li>' +
          '<li>📍 ул. Корчагина, 72</li>' +
          '<li><em>...и еще 15 домов</em></li>' +
        '</ul>' +
      '</div>' +
    '</div>';
}
