// Данные приложения
var currentRole = 'director';

var tickets = [
  { id: 101, address: 'ул. Качарская, д. 53', issue: 'Течь стояка ГВС в подвале', status: 'В работе', worker: 'Иван В.' },
  { id: 102, address: 'ул. Сандригайло, д. 100', issue: 'Нет света во 2 подъезде', status: 'Новая', worker: 'Не назначен' },
  { id: 103, address: 'ул. Корчагина, д. 72', issue: 'Шум в щитовой', status: 'В работе', worker: 'Петр С.' }
];

// Функция отрисовки интерфейса
function render() {
  var app = document.getElementById('app');
  if (!app) return;

  // 1. КАБИНЕТ ЖИЛЬЦА
  if (currentRole === 'tenant') {
    app.innerHTML = 
      '<div class="card" style="border-left: 5px solid #dc2626;">' +
        '<h2>🚨 Аварийная служба</h2>' +
        '<p style="color: #64748b; margin-bottom: 10px;">Диспетчер ТОО "ЭлектроБезопасность" (24/7)</p>' +
        '<a href="tel:38022" class="btn btn-danger">📞 Позвонить: 3-80-22</a>' +
      '</div>' +
      '<div class="card">' +
        '<h3>📝 Подача заявки</h3>' +
        '<p style="font-size: 14px; color: #64748b; margin-bottom: 10px;">Ваш дом: ул. Качарская, 53</p>' +
        '<button class="btn btn-primary" onclick="alert(\'Заявка успешно передана диспетчеру!\')">+ Создать заявку на ремонт</button>' +
      '</div>';
    return;
  }

  // 2. КАБИНЕТ РАБОТНИКА
  if (currentRole === 'worker') {
    app.innerHTML = 
      '<div class="card">' +
        '<h2>🛠 Мои наряды на сегодня</h2>' +
        '<div class="ticket-item" style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-top: 10px;">' +
          '<strong>Заявка #101 — ул. Качарская, 53</strong>' +
          '<p style="font-size: 14px; margin: 6px 0;">Проблема: Течь стояка ГВС в подвале</p>' +
          '<button class="btn btn-success" onclick="alert(\'Статус заявки изменен на: ВЫПОЛНЕНО\')">✓ Отметить как выполнено</button>' +
        '</div>' +
      '</div>';
    return;
  }

  // 3. КАБИНЕТ ДИРЕКТОРА И ДИСПЕТЧЕРА
  var listHtml = '';
  for (var i = 0; i < tickets.length; i++) {
    var t = tickets[i];
    listHtml += 
      '<div class="ticket-item">' +
        '<strong>#' + t.id + ' — ' + t.address + '</strong>' +
        '<p style="font-size: 13px; color: #475569; margin: 2px 0;">' + t.issue + '</p>' +
        '<span class="badge">' + t.status + ' | Мастер: ' + t.worker + '</span>' +
      '</div>';
  }

  app.innerHTML = 
    '<div class="card">' +
      '<h2>' + (currentRole === 'director' ? '👑 Панель Директора' : '🎧 Диспетчерский пульт') + '</h2>' +
      '<p style="font-size: 13px; color: #64748b;">Обслуживание 18 МКД г. Рудный</p>' +
    '</div>' +
    '<div class="card">' +
      '<h3>📋 Журнал заявок (' + tickets.length + ')</h3>' +
      listHtml +
    '</div>' +
    '<div class="card">' +
      '<h3>🏢 Дома в обслуживании</h3>' +
      '<p style="font-size: 14px; line-height: 1.6;">📍 ул. Качарская, 53<br>📍 ул. Сандригайло, 100<br>📍 ул. Корчагина, 72<br><em>...и ещё 15 объектов</em></p>' +
    '</div>';
}

// Слушатель выбора роли
document.addEventListener('DOMContentLoaded', function() {
  var select = document.getElementById('roleSelect');
  if (select) {
    select.addEventListener('change', function(e) {
      currentRole = e.target.value;
      render();
    });
  }
  render();
});
