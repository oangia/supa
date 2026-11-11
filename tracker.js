class Widget {
  constructor(options = {}) {
    this.id = options.id || Math.random().toString(36).substring(2, 9);
    this.popup = document.createElement('div');
    this.popup.id = this.id;
    this._createMenuLayout();
    this._addFloatButton(options.floatBtn.icon, options.floatBtn.bg);
    this._bindToggle();
  }

  _createMenuLayout() {
    let container = document.getElementById('floating-widgets-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'floating-widgets-container';
      container.className = 'fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50 font-sans';
      document.body.appendChild(container);
    }
    this.widgetContainer = container;

    this.wrapper = document.createElement('div');
    this.wrapper.className = 'relative flex flex-col items-end';
    this.widgetContainer.appendChild(this.wrapper);
  }

  _addFloatButton(icon, bgClasses = 'bg-rose-600 hover:bg-rose-700') {
    this.floatBtn = document.createElement('button');
    this.floatBtn.type = 'button';
    this.floatBtn.className = `w-14 h-14 ${bgClasses} text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer transition-all duration-200 hover:scale-105`;
    this.floatBtn.innerHTML = `<i class="${icon} text-2xl"></i>`;
    this.wrapper.appendChild(this.floatBtn);
  }

  _bindToggle() {
    this.floatBtn.addEventListener('click', () => {
      if (this.popup.classList.contains('hidden')) {
        this.popup.classList.remove('hidden');
        this.popup.classList.add('flex');
      } else {
        this.popup.classList.remove('flex');
        this.popup.classList.add('hidden');
      }
    });
  
    this.popup.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('.widget-close-btn');
      if (!closeBtn) return;
      this.popup.classList.remove('flex');
      this.popup.classList.add('hidden');
    });
  }
}

class DailyTaskTracker extends Widget {
  constructor(
    tasks = {
      Basic: [
        { name: 'Exercises', objective: 'healthy' }, 
        { name: 'Reading', type: 'weekly', desc: 'Read at least 1 chapter of a book', objective: 'useful' }, 
        { name: 'Learn an expression', objective: 'useful' }, 
        { name: 'Diet', disabled: true, desc: 'Focus on this later', objective: 'healthy' }
      ],
      Music: [
        { name: 'Learn songs', objective: 'fun' }, 
        { name: 'Practice singing', objective: 'fun' }
      ]
    },
    title = 'Tasks Tracker',
    options = {}
  ) {
    super({
      ...options,
      floatBtn: {
        icon: 'fa-solid fa-list-check',
        bg: 'bg-emerald-600 hover:bg-emerald-700'
      }
    });
    this.title = title;
    this.tasks = tasks;
    this.cookieName = 'daily_tasks_status';

    // Objective styles: Explicit border color when unchecked, filled background when checked
    this.objectiveColors = {
      healthy: {
        border: 'border-emerald-500',
        bg: 'bg-emerald-600',
        badge: 'text-emerald-700 bg-emerald-50 border border-emerald-200'
      },
      useful: {
        border: 'border-sky-500',
        bg: 'bg-sky-600',
        badge: 'text-sky-700 bg-sky-50 border border-sky-200'
      },
      fun: {
        border: 'border-amber-400',
        bg: 'bg-amber-500',
        badge: 'text-amber-700 bg-amber-50 border border-amber-200'
      },
      default: {
        border: 'border-slate-300',
        bg: 'bg-slate-600',
        badge: 'text-slate-700 bg-slate-50 border border-slate-200'
      }
    };

    this.createUI();
    this.loadState();
    this.attachEvents();
  }
  
  createUI() {
    this.popup.className =
      'fixed inset-x-4 bottom-24 sm:absolute sm:inset-x-auto sm:bottom-20 sm:right-0 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 hidden flex-col z-50 overflow-hidden font-sans';

    const header = document.createElement('div');
    header.className =
      'bg-slate-900 text-white px-4 py-3 flex justify-between items-center text-xs font-bold';
    header.innerHTML = `
      <span class="flex items-center gap-2">
        <i class="fa-solid fa-list-check text-emerald-400"></i>
        <span>${this.title}</span>
      </span>
      <span class="widget-close-btn cursor-pointer text-slate-400 hover:text-white text-base">&times;</span>
    `;

    const container = document.createElement('div');
    container.className =
      'p-4 space-y-4';

    let taskIndex = 0;
    Object.entries(this.tasks).forEach(([section, taskList]) => {
      const sectionDiv = document.createElement('div');

      const sectionTitle = document.createElement('h4');
      sectionTitle.className = 'text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1';
      sectionTitle.textContent = section;

      const ul = document.createElement('ul');
      ul.className = 'space-y-1';

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
        
        li.className = `flex items-start justify-between p-2 rounded-xl transition ${
          isDisabled
            ? 'opacity-50 bg-slate-50/50 cursor-not-allowed'
            : 'hover:bg-slate-50 cursor-pointer'
        }`;
        
        li.innerHTML = `
          <div class="flex items-start gap-3 w-full">
            <label for="${id}" class="relative flex items-start gap-3 w-full ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}">
              <input type="checkbox" id="${id}" data-task="${taskName}" data-type="${taskType}" ${
                isDisabled ? 'disabled' : ''
              } class="sr-only peer">
              
              <!-- Custom colored checkbox box (colored border when unchecked, colored fill when checked) -->
              <div class="mt-0.5 w-4 h-4 rounded border-2 ${colors.border} bg-white peer-checked:${colors.bg} peer-checked:border-transparent flex items-center justify-center transition flex-shrink-0 ${isDisabled ? 'opacity-50' : ''}">
                <svg class="w-2.5 h-2.5 text-white hidden peer-checked:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>

              <div class="flex flex-col flex-grow min-w-0">
                <span class="text-xs font-medium select-none flex items-center flex-wrap gap-1 ${
                  isDisabled ? 'text-slate-400 line-through' : 'text-slate-700'
                }">
                  <span class="break-words">${taskName}</span>
                  ${taskType === 'weekly' ? `<span class="text-[9px] px-1.5 py-0.5 rounded no-underline font-semibold ${colors.badge}">Weekly</span>` : ''}
                  ${isDisabled ? '<span class="text-[9px] text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded no-underline font-normal">Disabled</span>' : ''}
                </span>
                ${taskDesc ? `<span class="text-[10px] text-slate-400 mt-0.5 break-words">${taskDesc}</span>` : ''}
              </div>
            </label>
          </div>
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
    const cookieValue = Cookie.get(this.cookieName);
    if (cookieValue) {
      try {
        existingData = JSON.parse(cookieValue);
      } catch (e) {}
    }

    const dailyTasks = existingData.dailyTasks || {};
    const weeklyTasks = existingData.weeklyTasks || {};

    const currentDailyDate = this.getTodayDateString();
    const currentWeekKey = this.getWeekKey();

    const savedDailyDate = existingData.dailyDate;
    const savedWeekKey = existingData.weekKey;

    const activeDaily = savedDailyDate === currentDailyDate ? dailyTasks : {};
    const activeWeekly = savedWeekKey === currentWeekKey ? weeklyTasks : {};

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

    Cookie.set(this.cookieName, JSON.stringify(data), 365);
  }

  loadState() {
    const cookieValue = Cookie.get(this.cookieName);
    if (!cookieValue) return;

    try {
      const data = JSON.parse(cookieValue);
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
      console.error('Failed to parse task cookie state:', e);
    }
  }
}

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
