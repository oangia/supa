class DailyTaskTracker {
  constructor(tasks = {}, title = 'Tasks Tracker', options = {}) {
    this.id = options.id || Math.random().toString(36).substring(2, 9);
    this.title = title;
    this.tasks = tasks;
    this.storageKey = 'daily_tasks_status';

    this.objectiveColors = {
      healthy: { border: '#10b981', bg: '#059669' },
      useful: { border: '#0ea5e9', bg: '#0284c7' },
      fun: { border: '#f59e0b', bg: '#d97706' },
      default: { border: '#94a3b8', bg: '#64748b' }
    };

    // Automatically inject self-contained CSS styles into the page
    this._injectStyles();

    // Initialize popup element
    this.popup = document.createElement('div');
    this.popup.id = this.id;

    // Run layout, button creation, and toggle binding
    this._createMenuLayout();
    
    const floatBtnConfig = options.floatBtn || { icon: '📋' };
    this._addFloatButton(floatBtnConfig.icon);
    this._bindToggle();

    // Render UI and bind tasks functionality
    this.createUI();
    this.loadState();
    this.attachEvents();
  }

  _injectStyles() {
    if (document.getElementById('task-tracker-styles')) return;
    const style = document.createElement('style');
    style.id = 'task-tracker-styles';
    style.textContent = `
      #floating-widgets-container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 12px;
        z-index: 999999;
        font-family: Roboto, Arial, sans-serif;
        box-sizing: border-box;
      }
      #floating-widgets-container *, #floating-widgets-container *::before, #floating-widgets-container *::after {
        box-sizing: border-box;
      }
      .widget-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      .widget-float-btn {
        width: 56px;
        height: 56px;
        background-color: #059669;
        color: #ffffff;
        border-radius: 50%;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s ease, background-color 0.2s ease;
        font-size: 22px;
      }
      .widget-float-btn:hover {
        background-color: #047857;
        transform: scale(1.05);
      }
      .widget-popup {
        position: fixed;
        left: 16px;
        right: 16px;
        bottom: 96px;
        width: auto;
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        border: 1px solid #e2e8f0;
        display: none;
        flex-direction: column;
        z-index: 999999;
        overflow: hidden;
      }
      @media (min-width: 640px) {
        .widget-popup {
          position: absolute;
          left: auto;
          right: 0;
          bottom: 72px;
          width: 320px;
        }
      }
      .widget-popup.flex {
        display: flex;
      }
      .widget-header {
        background: #0f172a;
        color: #ffffff;
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        font-weight: bold;
      }
      .widget-header-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .widget-close-btn {
        background: transparent;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        font-size: 18px;
        padding: 0 4px;
      }
      .widget-close-btn:hover {
        color: #ffffff;
      }
      .widget-body {
        padding: 16px;
        max-height: 400px;
        overflow-y: auto;
      }
      .widget-section-title {
        font-size: 10px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #94a3b8;
        margin-bottom: 6px;
        padding-left: 4px;
      }
      .widget-list {
        list-style: none;
        padding: 0;
        margin: 0 0 16px 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .widget-item {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 8px;
        border-radius: 10px;
        transition: background 0.15s ease;
        cursor: pointer;
      }
      .widget-item:hover {
        background-color: #f8fafc;
      }
      .widget-item.disabled {
        opacity: 0.5;
        background-color: #f8fafc;
        cursor: not-allowed;
      }
      .widget-label {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        width: 100%;
        cursor: pointer;
      }
      .widget-item.disabled .widget-label {
        cursor: not-allowed;
      }
      .widget-checkbox-input {
        display: none;
      }
      .widget-checkbox-box {
        margin-top: 2px;
        width: 16px;
        height: 16px;
        border-radius: 4px;
        border: 2px solid #cbd5e1;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
        flex-shrink: 0;
      }
      .widget-checkbox-input:checked + .widget-checkbox-box {
        background-color: var(--chk-bg, #059669);
        border-color: transparent;
      }
      .widget-checkbox-box svg {
        display: none;
        width: 10px;
        height: 10px;
        stroke: #ffffff;
        stroke-width: 3;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .widget-checkbox-input:checked + .widget-checkbox-box svg {
        display: block;
      }
      .widget-content-box {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        min-width: 0;
      }
      .widget-task-title {
        font-size: 12px;
        font-weight: 500;
        color: #334155;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
        user-select: none;
      }
      .widget-item.disabled .widget-task-title {
        color: #94a3b8;
        text-decoration: line-through;
      }
      .widget-badge {
        font-size: 9px;
        padding: 1px 6px;
        border-radius: 4px;
        font-weight: 600;
      }
      .badge-default { color: #334155; background: #f1f5f9; border: 1px solid #cbd5e1; }
      .widget-task-desc {
        font-size: 10px;
        color: #94a3b8;
        margin-top: 2px;
      }
    `;
    document.head.appendChild(style);
  }

  _createMenuLayout() {
    let container = document.getElementById('floating-widgets-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'floating-widgets-container';
      document.body.appendChild(container);
    }
    this.widgetContainer = container;

    this.wrapper = document.createElement('div');
    this.wrapper.className = 'widget-wrapper';
    this.widgetContainer.appendChild(this.wrapper);
  }

  _addFloatButton(icon) {
    this.floatBtn = document.createElement('button');
    this.floatBtn.type = 'button';
    this.floatBtn.className = 'widget-float-btn';
    this.floatBtn.innerHTML = icon;
    this.wrapper.appendChild(this.floatBtn);
  }

  _bindToggle() {
    this.floatBtn.addEventListener('click', () => {
      if (this.popup.classList.contains('flex')) {
        this.popup.classList.remove('flex');
      } else {
        this.popup.classList.add('flex');
      }
    });
  
    this.popup.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('.widget-close-btn');
      if (!closeBtn) return;
      this.popup.classList.remove('flex');
    });
  }

  createUI() {
    this.popup.className = 'widget-popup';

    const header = document.createElement('div');
    header.className = 'widget-header';
    header.innerHTML = `
      <span class="widget-header-title">
        <span>✨</span>
        <span>${this.title}</span>
      </span>
      <button class="widget-close-btn">&times;</button>
    `;

    const container = document.createElement('div');
    container.className = 'widget-body';

    let taskIndex = 0;
    Object.entries(this.tasks).forEach(([section, taskList]) => {
      const sectionDiv = document.createElement('div');

      const sectionTitle = document.createElement('div');
      sectionTitle.className = 'widget-section-title';
      sectionTitle.textContent = section;

      const ul = document.createElement('ul');
      ul.className = 'widget-list';

      taskList.forEach((taskItem) => {
        const isObj = typeof taskItem === 'object' && taskItem !== null;
        const taskName = isObj ? taskItem.name : taskItem;
        const taskType = isObj ? (taskItem.type || 'daily') : 'daily';
        const taskDesc = isObj && taskItem.desc ? taskItem.desc : '';
        const isDisabled = isObj && !!taskItem.disabled;

        const objectiveKey = isObj && taskItem.objective ? taskItem.objective : 'default';
        const colors = this.objectiveColors[objectiveKey] || this.objectiveColors.default;

        const id = `task-${this.id}-${taskIndex++}`;
        const li = document.createElement('li');
        li.className = `widget-item ${isDisabled ? 'disabled' : ''}`;
        
        li.innerHTML = `
          <label for="${id}" class="widget-label">
            <input type="checkbox" id="${id}" data-task="${taskName}" data-type="${taskType}" ${isDisabled ? 'disabled' : ''} class="widget-checkbox-input">
            
            <div class="widget-checkbox-box" style="--chk-bg: ${colors.bg}; border-color: ${colors.border};">
              <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <div class="widget-content-box">
              <span class="widget-task-title">
                <span>${taskName}</span>
                ${taskType === 'weekly' ? '<span class="widget-badge badge-default">Weekly</span>' : ''}
                ${isDisabled ? '<span class="widget-badge badge-default">Disabled</span>' : ''}
              </span>
              ${taskDesc ? `<span class="widget-task-desc">${taskDesc}</span>` : ''}
            </div>
          </label>
        `;
        ul.appendChild(li);
      });

      sectionDiv.appendChild(sectionTitle);
      sectionDiv.appendChild(ul);
      container.appendChild(sectionDiv);
    });

    this.popup.appendChild(header);
    this.popup.appendChild(container);
    this.wrapper.appendChild(this.popup);
  }

  attachEvents() {
    const checkboxes = this.popup.querySelectorAll('input[type="checkbox"]:not([disabled])');
    checkboxes.forEach((chk) => {
      chk.addEventListener('change', () => this.saveState());
    });
  }

  getTodayDateString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  getWeekKey() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return `${d.getFullYear()}-W${weekNo}`;
  }

  saveState() {
    const checkboxes = this.popup.querySelectorAll('input[type="checkbox"]:not([disabled])');
    let existingData = {};
    const storedValue = localStorage.getItem(this.storageKey);
    if (storedValue) {
      try { existingData = JSON.parse(storedValue); } catch (e) {}
    }

    const dailyTasks = existingData.dailyTasks || {};
    const weeklyTasks = existingData.weeklyTasks || {};
    const currentDailyDate = this.getTodayDateString();
    const currentWeekKey = this.getWeekKey();

    const activeDaily = existingData.dailyDate === currentDailyDate ? dailyTasks : {};
    const activeWeekly = existingData.weekKey === currentWeekKey ? weeklyTasks : {};

    checkboxes.forEach((chk) => {
      const taskName = chk.dataset.task;
      const taskType = chk.dataset.type;
      if (taskType === 'weekly') {
        activeWeekly[taskName] = chk.checked;
      } else {
        activeDaily[taskName] = chk.checked;
      }
    });

    const data = {
      dailyDate: currentDailyDate,
      weekKey: currentWeekKey,
      dailyTasks: activeDaily,
      weeklyTasks: activeWeekly
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  loadState() {
    const storedValue = localStorage.getItem(this.storageKey);
    if (!storedValue) return;
    try {
      const data = JSON.parse(storedValue);
      const today = this.getTodayDateString();
      const currentWeek = this.getWeekKey();

      const checkboxes = this.popup.querySelectorAll('input[type="checkbox"]:not([disabled])');
      checkboxes.forEach((chk) => {
        const taskName = chk.dataset.task;
        const taskType = chk.dataset.type;

        if (taskType === 'weekly') {
          if (data.weekKey === currentWeek && data.weeklyTasks && data.weeklyTasks[taskName]) {
            chk.checked = true;
          }
        } else {
          if (data.dailyDate === today && data.dailyTasks && data.dailyTasks[taskName]) {
            chk.checked = true;
          }
        }
      });
    } catch (e) {
      console.error('Failed to parse task state:', e);
    }
  }
}

// Instantiation:
new DailyTaskTracker({
  Foundation: [
    { name: 'Exercises', type: 'daily', objective: 'healthy' },
    { name: 'Learn songs', type: 'daily', objective: 'useful' }
  ],
  Music: [
    { name: 'Reading', type: 'daily', desc: "Try to understand how girls, social, the world work", objective: 'useful' },
    { name: 'Practice singing', type: 'daily', objective: 'useful'},
    { name: 'Write/sing songs', type: 'daily', desc: "Enjoy life", objective: 'useful'},
    { name: 'Social', objective: 'fun'}
  ]
});
