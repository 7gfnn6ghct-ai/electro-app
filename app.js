// Список 18 домов ТОО "ЭлектроБезопасность" (г. Рудный)
const houses = [
  "Качарская 26", "Качарская 53", "Качарская 47", "Качарская 31", "Качарская 49", "Качарская 41",
  "Корчагина 160", "Корчагина 166", "Корчагина 188", "Корчагина 138",
  "Сандригайло 62", "Сандригайло 65", "Сандригайло 67", "Сандригайло 100", "Сандригайло 98",
  "50 лет Октября 8", "Космонавтов 28", "Качарская 39"
];

// Аварийные и справочные службы г. Рудный
const emergencyContacts = [
  { title: "Диспетчер ТОО «ЭлектроБезопасность»", phone: "3-80-22", note: "Круглосуточно", main: true },
  { title: "Аварийная служба (Дежурный)", phone: "+7 (705) 000-00-00", note: "Приём заявок", main: true },
  { title: "Единая служба спасения", phone: "112", note: "ЧС / Пожарная" },
  { title: "Служба газа (Аварийная)", phone: "104", note: "Газоснабжение" },
  { title: "Тепловые сети / Водоканал", phone: "+7 (71431) 2-11-00", note: "Аварии ХВС/ГВС/Тепло" },
  { title: "Скорая медицинская помощь", phone: "103", note: "Медпомощь" }
];

// Демо-данные заявок
let currentRole = "director";
let requests = [
  { id: 152, date: "13.08.2026 21:12", house: "Качарская 31", apt: "62", phone: "+7 705 123 45 67", name: "Иванов И.И.", desc: "Течь стояка ХВС в подвале", priority: "emergency", status: "new", worker: null },
  { id: 151, date: "13.08.2026 20:45", house: "Сандригайло 100", apt: "подвал", phone: "+7 707 987 65 43", name: "Петров П.П.", desc: "Неисправность освещения", priority: "urgent", status: "assigned", worker: "Алексей (Электрик)" },
  { id: 150, date: "13.08.2026 18:22", house: "Корчагина 188", apt: "подъезд 2", phone: "+7 701 555 44 33", name: "Сидоров С.С.", desc: "Не работает доводчик двери", priority: "normal", status: "in_work", worker: "Сергей (Слесарь)" }
];

const titles = {
  dashboard: "Главная", houses: "Обслуживаемые дома", requests: "Журнал заявок",
  complaints: "Жалобы и обращения", workers: "Работники",
  planned: "Плановые работы", emergency: "Аварийные контакты", notifications: "Уведомления",
  stats: "Статистика и отчёты", test: "Тестовая среда (Песочница)", settings: "Настройки системы"
};

const content = document.getElementById("content");
const pageTitle = document.getElementById("pageTitle");

function setRole(role) {
  currentRole = role;
  document.getElementById("roleSelect").value = role;
  renderNavByRole();
  nav("dashboard");
}

function renderNavByRole() {
  const navContainer = document.getElementById("mainNav");
  let items = [];
  
  if (currentRole === "director") {
    items = [
      { id: "dashboard", icon: "▦", name: "Главная" },
      { id: "houses", icon: "⌂", name: "Дома (18)" },
      { id: "requests", icon: "☷", name: "Заявки" },
      { id: "complaints", icon: "⚠", name: "Жалобы" },
      { id: "workers", icon: "⚒", name: "Работники" },
      { id: "planned", icon: "◷", name: "Плановые работы" },
      { id: "emergency", icon: "📞", name: "Аварийные службы" },
      { id: "stats", icon: "▥", name: "Статистика" }
    ];
  } else if (currentRole === "dispatcher") {
    items = [
      { id: "dashboard", icon: "▦", name: "Главная" },
      { id: "requests", icon: "☷", name: "Приём заявок" },
      { id: "complaints", icon: "⚠", name: "Жалобы" },
      { id: "houses", icon: "⌂", name: "Дома" },
      { id: "emergency", icon: "📞", name: "Аварийные службы" }
    ];
  } else if (currentRole === "worker") {
    items = [
      { id: "dashboard", icon: "📋", name: "Мои задания" },
      { id: "emergency", icon: "📞", name: "Аварийные телефоны" }
    ];
  } else if (currentRole === "tenant") {
    items = [
      { id: "dashboard", icon: "⌂", name: "Мой дом" },
      { id: "requests", icon: "📝", name: "Мои заявки" },
      { id: "complaints", icon: "⚠", name: "Подать жалобу" },
      { id: "emergency", icon: "📞", name: "Телефоны служб" }
    ];
  }

  navContainer.innerHTML = items.map(item => 
    `<button class="nav" data-view="${item.id}" onclick="nav('${item.id}')">${item.icon} <span>${item.name}</span></button>`
  ).join("");
}

function nav(view) {
  document.querySelectorAll(".nav").forEach(x => x.classList.toggle("active", x.dataset.view === view));
  pageTitle.textContent = titles[view] || "Главная";
  render(view);
}

function render(view) {
  if (view === "dashboard") return renderDashboard();
  if (view === "requests") return renderRequests();
  if (view === "houses") return renderHouses();
  if (view === "emergency") return renderEmergency();
  if (view === "complaints") return renderSimple("Жалобы и обращения", "Раздел контроля и обработки жалоб жильцов. Фиксация сроков и ответственных.");
  if (view === "workers") return renderSimple("Работники", "Управление персоналом (13–15 сотрудников), назначение ролей и индивидуальных прав.");
  if (view === "planned") return renderSimple("Плановые работы", "График регулярного обслуживания инженерных сетей 18 домов.");
  if (view === "stats") return renderSimple("Статистика", "Выгрузка отчетов в Excel, среднее время выполнения заявок и аналитика аварий.");
  if (view === "test") return renderTestPage();
  if (view === "settings") return renderSimple("Настройки", "Параметры видимости данных для жильцов и интеграции.");
}

function renderDashboard() {
  if (currentRole === "tenant") {
    content.innerHTML = `
      <div class="card emergency-banner">
        <div>
          <h3>🚨 Диспетчерская ТОО «ЭлектроБезопасность»</h3>
          <p>Круглосуточный приём аварийных заявок по г. Рудный</p>
        </div>
        <a href="tel:38022" class="btn red bold-btn">📞 Позвонить: 3-80-22</a>
      </div>
      <div class="grid section-grid" style="margin-top:16px;">
        <div class="card">
          <div class="card-head"><h3>Мой дом: Качарская 31</h3></div>
          <p class="muted">Ваша привязка к квартире № 62 подтверждена администрацией.</p>
          <div class="rows">
            <div class="row"><div><strong>Объявления</strong><small>Отключение ГВС 15 августа с 09:00 до 17:00</small></div></div>
            <div class="row"><div><strong>Плановые работы</strong><small>Промывка системы отопления запланирована на 20.08</small></div></div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>Быстрые действия</h3></div>
          <button class="btn full-width" onclick="nav('requests')">+ Подать заявку на ремонт</button>
          <button class="btn secondary full-width" style="margin-top:10px;" onclick="nav('complaints')">⚠ Написать жалобу</button>
        </div>
      </div>
    `;
    return;
  }

  if (currentRole === "worker") {
    const myTasks = requests.filter(r => r.status !== 'closed');
    content.innerHTML = `
      <div class="notice">Режим сотрудника: выполняя работы, обновляйте статус и звоните заявителю в один клик.</div>
      <div class="grid">
        ${myTasks.map(t => `
          <div class="card">
            <div class="card-head">
              <h3>Заявка №${t.id} — ${t.house}, кв. ${t.apt}</h3>
              <span class="badge ${getPriorityClass(t.priority)}">${getPriorityLabel(t.priority)}</span>
            </div>
            <p><strong>Описание:</strong> ${t.desc}</p>
            <p><strong>Заявитель:</strong> ${t.name} (<a href="tel:${t.phone}">${t.phone}</a>)</p>
            <div class="toolbar">
              <a href="tel:${t.phone}" class="btn secondary">📞 Позвонить</a>
              <button class="btn" onclick="changeStatus(${t.id}, 'in_work')">В работу</button>
              <button class="btn green" onclick="changeStatus(${t.id}, 'done')">✓ Выполнено</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <div class="grid kpis">
      ${kpi("Новые заявки", requests.filter(r=>r.status==='new').length, "blue")}
      ${kpi("Аварии", requests.filter(r=>r.priority==='emergency').length, "red")}
      ${kpi("В работе", requests.filter(r=>r.status==='in_work').length, "amber")}
      ${kpi("Выполнено", requests.filter(r=>r.status==='done').length, "green")}
      ${kpi("Жалобы", "2", "amber")}
      ${kpi("Домов", "18", "blue")}
    </div>

    <div class="grid section-grid">
      <div class="card">
        <div class="card-head">
          <h3>Текущие заявки</h3>
          <button class="btn secondary" onclick="nav('requests')">Весь журнал</button>
        </div>
        <div class="rows">
          ${requests.map(r => `
            <div class="row">
              <div>
                <strong>№${r.id} · ${r.house}, кв. ${r.apt}</strong>
                <small>${r.desc} · Заявитель: ${r.name}</small>
              </div>
              <span class="badge ${getStatusClass(r.status)}">${getStatusLabel(r.status)}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card">
        <div class="card-head"><h3>🚨 Экстренные телефоны</h3></div>
        <div class="rows">
          ${emergencyContacts.slice(0, 4).map(c => `
            <div class="row">
              <div><strong>${c.title}</strong><small>${c.note}</small></div>
              <a href="tel:${c.phone}" class="badge blue">${c.phone}</a>
            </div>
          `).join("")}
        </div>
        <button class="btn secondary full-width" style="margin-top:12px;" onclick="nav('emergency')">Все контакты службы</button>
      </div>
    </div>
  `;
}

function renderRequests() {
  content.innerHTML = `
    <div class="toolbar-wrap">
      <div class="toolbar">
        <input class="input" placeholder="Поиск по номеру, телефону, адресу, ФИО...">
        <select class="select">
          <option value="">Все 18 домов</option>
          ${houses.map(h => `<option>${h}</option>`).join("")}
        </select>
        <select class="select">
          <option value="">Все приоритеты</option>
          <option value="emergency">🚨 Аварийная</option>
          <option value="urgent">⚠ Срочная</option>
          <option value="normal">Обычная</option>
        </select>
        ${(currentRole==='director'||currentRole==='dispatcher'||currentRole==='tenant') ? 
          `<button class="btn red" onclick="showCreateRequestModal()">+ Создать заявку</button>` : ''}
      </div>
    </div>

    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>№</th>
            <th>Дата</th>
            <th>Адрес / Квартира</th>
            <th>Телефон заявителя</th>
            <th>Описание</th>
            <th>Приоритет</th>
            <th>Исполнитель</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          ${requests.map(r => `
            <tr>
              <td><b>${r.id}</b></td>
              <td>${r.date}</td>
              <td>${r.house}, кв. ${r.apt}</td>
              <td><a href="tel:${r.phone}">${r.phone}</a></td>
              <td>${r.desc}</td>
              <td><span class="badge ${getPriorityClass(r.priority)}">${getPriorityLabel(r.priority)}</span></td>
              <td>${r.worker || '<i class="muted">Не назначен</i>'}</td>
              <td><span class="badge ${getStatusClass(r.status)}">${getStatusLabel(r.status)}</span></td>
              <td>
                ${(currentRole === 'director' && !r.worker) ? 
                  `<button class="btn secondary sm" onclick="assignWorker(${r.id})">Назначить</button>` : '—'}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderEmergency() {
  content.innerHTML = `
    <div class="notice">Список экстренных и справочных служб города Рудного. Все телефоны кликабельны для быстрого вызова с мобильного устройства.</div>
    <div class="grid section-grid">
      <div class="card">
        <div class="card-head"><h3>Диспетчерские ТОО «ЭлектроБезопасность»</h3></div>
        <div class="rows">
          ${emergencyContacts.filter(c=>c.main).map(c => `
            <div class="row">
              <div>
                <strong>${c.title}</strong>
                <small>${c.note}</small>
              </div>
              <a href="tel:${c.phone}" class="btn red">📞 ${c.phone}</a>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card">
        <div class="card-head"><h3>Городские аварийные службы (г. Рудный)</h3></div>
        <div class="rows">
          ${emergencyContacts.filter(c=>!c.main).map(c => `
            <div class="row">
              <div>
                <strong>${c.title}</strong>
                <small>${c.note}</small>
              </div>
              <a href="tel:${c.phone}" class="btn secondary">📞 ${c.phone}</a>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderHouses() {
  content.innerHTML = `
    <div class="notice">Обслуживаемый жилфонд (18 домов). Нажмите на карточку для просмотра инженерных сетей и настроек видимости для жильцов.</div>
    <div class="grid house-grid">
      ${houses.map(h => `
        <div class="card house-card" onclick="alert('Карточка дома ${h}: редактирование конструктивных элементов, инженерных сетей и фото.')">
          <div class="house-title">🏢 ${h}</div>
          <div class="house-meta">Подъездов: — · Квартир: —</div>
          <div class="house-meta">Ответственный мастер: Назначается</div>
        </div>
      `).join("")}
    </div>
  `;
}

function showCreateRequestModal() {
  const houseOptions = houses.map(h => `<option value="${h}">${h}</option>`).join("");
  const modalHtml = `
    <div class="modal-overlay" id="modal">
      <div class="modal-card">
        <h3>Новая заявка (Диспетчер / Заявитель)</h3>
        <p class="muted">Согласно ТЗ, исполнитель при создании заявки не выбирается — его назначает Директор.</p>
        <form onsubmit="saveRequest(event)">
          <div class="form-grid">
            <div class="field">
              <label>Дом</label>
              <select id="reqHouse" class="select">${houseOptions}</select>
            </div>
            <div class="field">
              <label>Квартира / Подъезд</label>
              <input id="reqApt" class="input" placeholder="кв. 12" required>
            </div>
            <div class="field">
              <label>Телефон заявителя (Обязательно)</label>
              <input id="reqPhone" class="input" placeholder="+7 705 000 00 00" required>
            </div>
            <div class="field">
              <label>ФИО заявителя</label>
              <input id="reqName" class="input" placeholder="ФИО" required>
            </div>
            <div class="field">
              <label>Приоритет</label>
              <select id="reqPriority" class="select">
                <option value="normal">Обычная</option>
                <option value="urgent">⚠ Срочная</option>
                <option value="emergency">🚨 Аварийная</option>
              </select>
            </div>
            <div class="field" style="grid-column: span 2;">
              <label>Описание проблемы</label>
              <textarea id="reqDesc" class="input" rows="3" placeholder="Опишите неисправность..." required></textarea>
            </div>
          </div>
          <div class="toolbar" style="margin-top:15px; justify-content: flex-end;">
            <button type="button" class="btn secondary" onclick="closeModal()">Отмена</button>
            <button type="submit" class="btn red">Сохранить заявку</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeModal() {
  const m = document.getElementById("modal");
  if (m) m.remove();
}

function saveRequest(e) {
  e.preventDefault();
  const newReq = {
    id: requests.length + 153,
    date: new Date().toLocaleString('ru-RU'),
    house: document.getElementById("reqHouse").value,
    apt: document.getElementById("reqApt").value,
    phone: document.getElementById("reqPhone").value,
    name: document.getElementById("reqName").value,
    priority: document.getElementById("reqPriority").value,
    desc: document.getElementById("reqDesc").value,
    status: "new",
    worker: null
  };
  requests.unshift(newReq);
  closeModal();
  nav("requests");
}

function assignWorker(reqId) {
  const workerName = prompt("Введите имя или должность исполнителя (например, 'Иван - Слесарь'):");
  if (workerName) {
    const req = requests.find(r => r.id === reqId);
    if (req) {
      req.worker = workerName;
      req.status = "assigned";
      nav("requests");
    }
  }
}

function changeStatus(reqId, newStatus) {
  const req = requests.find(r => r.id === reqId);
  if (req) {
    req.status = newStatus;
    renderDashboard();
  }
}

function getPriorityClass(p) {
  if (p === 'emergency') return 'red';
  if (p === 'urgent') return 'amber';
  return 'blue';
}

function getPriorityLabel(p) {
  if (p === 'emergency') return '🚨 Авария';
  if (p === 'urgent') return '⚠ Срочно';
  return 'Обычная';
}

function getStatusClass(s) {
  if (s === 'new') return 'blue';
  if (s === 'assigned') return 'amber';
  if (s === 'in_work') return 'amber';
  if (s === 'done') return 'green';
  return '';
}

function getStatusLabel(s) {
  if (s === 'new') return 'Новая';
  if (s === 'assigned') return 'Назначена';
  if (s === 'in_work') return 'В работе';
  if (s === 'done') return 'Выполнена';
  return s;
}

function renderSimple(title, text) {
  content.innerHTML = `
    <div class="card">
      <div class="empty">
        <h3>${title}</h3>
        <p>${text}</p>
        <button class="btn" onclick="nav('dashboard')">Вернуться на главную</button>
      </div>
    </div>
  `;
}

function renderTestPage() {
  content.innerHTML = `
    <div class="notice">Тестовая среда (Песочница). Здесь директор может эмулировать любые ситуации без затрагивания реальной базы.</div>
    <div class="card">
      <h3>Тестовый сценарий обкатки</h3>
      <p class="muted">Создание тестового дома, тестовых заявок и проверка уведомлений.</p>
      <button class="btn red" onclick="alert('Песочница очищена и заполнена 10 тестовыми заявками!')">Имитировать аварийную ситуацию</button>
    </div>
  `;
}

// Инициализация
document.getElementById("roleSelect").addEventListener("change", (e) => setRole(e.target.value));
renderNavByRole();
nav("dashboard");
