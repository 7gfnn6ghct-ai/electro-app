// Состояние приложения
const state = {
  role: 'director', // director, dispatcher, worker, tenant
  currentPage: 'home',
  tickets: [
    { id: 101, address: 'ул. Качарская, д. 53', issue: 'Течь стояка ГВС в подвале', status: 'В работе', priority: 'Высокий', worker: 'Иван В.' },
    { id: 102, address: 'ул. Сандригайло, д. 100', issue: 'Нет света во 2 подъезде', status: 'Новая', priority: 'Средний', worker: 'Не назначен' }
  ]
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  initEvents();
  renderPage();
});

function initEvents() {
  // Переключение ролей
  const roleSelect = document.getElementById('roleSelect');
  roleSelect.addEventListener('change', (e) => {
    state.role = e.target.value;
    renderPage();
  });

  // Мобильное меню
  const sidebar = document.getElementById('sidebar');
  document.getElementById('menuToggleBtn').addEventListener('click', () => {
    sidebar.classList.add('open');
  });
  document.getElementById('closeSidebarBtn').addEventListener('click', () => {
    sidebar.classList.remove('open');
  });

  // Навигация
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      const targetBtn = e.currentTarget;
      targetBtn.classList.add('active');
      state.currentPage = targetBtn.dataset.page;
      sidebar.classList.remove('open');
      renderPage();
    });
  });
}

// Отрисовка страниц
function renderPage() {
  const container = document.getElementById('pageContainer');
  
  // Кабинет ЖИЛЬЦА
  if (state.role === 'tenant') {
    container.innerHTML = `
      <div class="card" style="border-left: 5px solid var(--danger);">
        <h2 class="card-title"><i class="fas fa-phone-alt"></i> Экстренная связь</h2>
        <p style="margin-bottom: 12px;">Круглосуточный диспетчер ТОО "ЭлектроБезопасность"</p>
        <a href="tel:38022" class="btn btn-danger" style="font-size: 18px; text-decoration: none;">
          <i class="fas fa-phone"></i> Позвонить: 3-80-22
        </a>
      </div>

      <div class="card">
        <h3 class="card-title"><i class="fas fa-edit"></i> Подать заявку на ремонт</h3>
        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 15px;">Ваш дом: ул. Качарская, 53</p>
        <button class="btn btn-primary" onclick="alert('Заявка отправлена диспетчеру!')">
          <i class="fas fa-plus"></i> Создать обращение
        </button>
      </div>
    `;
    return;
  }

  // Кабинет РАБОТНИКА
  if (state.role === 'worker') {
    container.innerHTML = `
      <div class="card">
        <h2 class="card-title"><i class="fas fa-tools"></i> Мои задания на сегодня</h2>
        <div style="margin-top: 15px;">
          <div style="padding: 12px; background: var(--bg); border-radius: 8px; margin-bottom: 10px;">
            <strong>Заявка #101 — ул. Качарская, 53</strong>
            <p style="font-size: 14px; margin: 5px 0;">Проблема: Течь стояка ГВС в подвале</p>
            <button class="btn btn-success" onclick="alert('Статус изменен на Выполнено!')"><i class="fas fa-check"></i> Отметить как выполнено</button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Кабинет ДИРЕКТОРА и ДИСПЕТЧЕРА
  container.innerHTML = `
    <div class="card">
      <h2 class="card-title">
        ${state.role === 'director' ? '👑 Панель Управления Директора' : '🎧 Рабочее место Диспетчера'}
      </h2>
      <p style="color: var(--text-muted); font-size: 14px;">Обслуживаемые объекты: 18 многоквартирных домов г. Рудный</p>
    </div>

    <div class="grid">
      <div class="card">
        <h3 class="card-title"><i class="fas fa-clipboard-list"></i> Активные заявки (${state.tickets.length})</h3>
        ${state.tickets.map(t => `
          <div style="padding: 10px; border-bottom: 1px solid var(--border);">
            <strong>#${t.id} — ${t.address}</strong>
            <p style="font-size: 13px;">${t.issue}</p>
            <span style="font-size: 12px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px;">
              ${t.status} (${t.worker})
            </span>
          </div>
        `).join('')}
      </div>

      <div class="card">
        <h3 class="card-title"><i class="fas fa-city"></i> Объекты в обслуживании</h3>
        <ul style="list-style: none; font-size: 14px; line-height: 1.8;">
          <li>📍 ул. Качарская, 53</li>
          <li>📍 ул. Сандригайло, 100</li>
          <li>📍 ул. Корчагина, 72</li>
          <li><em>...и еще 15 домов</em></li>
        </ul>
      </div>
    </div>
  `;
}
