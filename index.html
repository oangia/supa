<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Supabase Storage File Manager</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <style>
    .thumb {
      width: 36px;
      height: 36px;
      object-fit: cover;
      border-radius: 6px;
      background: #e2e8f0;
      flex-shrink: 0;
    }
    .thumb-video {
      width: 36px;
      height: 36px;
      object-fit: cover;
      border-radius: 6px;
      background: #0f172a;
      flex-shrink: 0;
    }
    #editTextarea {
      width: 100%;
      min-height: 55vh;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 13px;
      line-height: 1.5;
      padding: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      resize: vertical;
      background: white;
      outline: none;
    }
    #editTextarea:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
  </style>
</head>
<body class="bg-slate-100 text-slate-800 h-screen flex flex-col font-sans antialiased overflow-hidden">

  <!-- Toast -->
  <div id="toastContainer" class="fixed top-5 right-5 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full px-4 sm:px-0"></div>

  <!-- Header -->
  <header class="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
    <div class="flex items-center space-x-3">
      <div class="bg-indigo-600 text-white p-2 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
        <i class="fa-solid fa-cloud text-lg"></i>
      </div>
      <div>
        <h1 class="font-bold text-slate-900 text-base leading-tight">Supabase Storage Explorer</h1>
        <p class="text-xs text-slate-500 font-mono mt-0.5" id="headerUrl">Not connected</p>
      </div>
    </div>

    <div class="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
      <button onclick="switchTab('explorer')" id="navExplorerTab" class="px-3 py-1.5 text-xs font-semibold rounded-md bg-white shadow-sm text-slate-800 transition">Explorer</button>
      <button onclick="switchTab('settings')" id="navSettingsTab" class="px-3 py-1.5 text-xs font-semibold rounded-md text-slate-600 hover:text-slate-900 transition">Settings</button>
    </div>
  </header>

  <!-- Main -->
  <main class="flex-1 overflow-hidden flex flex-col p-6 max-w-7xl w-full mx-auto">

    <!-- Explorer View -->
    <div id="viewExplorer" class="flex-1 flex flex-col overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-xs">

      <!-- Toolbar -->
      <div class="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 rounded-t-2xl">
        <div class="flex items-center space-x-2 text-sm">
          <nav id="breadcrumbNav" class="flex items-center space-x-2"></nav>
        </div>

        <div class="flex items-center space-x-3">
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <i class="fa-solid fa-magnifying-glass text-xs"></i>
            </span>
            <input type="text" id="searchInput" oninput="handleSearch()" placeholder="Search files..." 
                   class="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-48 sm:w-64 transition">
          </div>

          <button onclick="openCreateFolderModal()" class="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center space-x-1.5 transition">
            <i class="fa-solid fa-folder-plus text-amber-500"></i>
            <span>New Folder</span>
          </button>

          <button onclick="createBackup()" id="backupBtn" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-emerald-200 flex items-center space-x-1.5 transition">
            <i class="fa-solid fa-box-archive"></i>
            <span>Backup</span>
          </button>

          <div class="relative">
            <button onclick="toggleUploadMenu()" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-200 flex items-center space-x-1.5 transition">
              <i class="fa-solid fa-upload"></i>
              <span>Upload</span>
              <i class="fa-solid fa-chevron-down text-[10px] ml-1"></i>
            </button>
            
            <div id="uploadMenu" class="hidden absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30">
              <label class="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">
                <i class="fa-solid fa-file mr-2.5 text-indigo-500"></i>
                <span>Upload File(s)</span>
                <input type="file" id="localFileUpload" multiple onchange="handleFileUpload(event, false)" class="hidden">
              </label>
              <label class="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">
                <i class="fa-solid fa-folder-open mr-2.5 text-amber-500"></i>
                <span>Upload Folder</span>
                <input type="file" id="localFolderUpload" webkitdirectory directory multiple onchange="handleFileUpload(event, true)" class="hidden">
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="flex-1 overflow-y-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th class="py-3 px-4">Name</th>
              <th class="py-3 px-4">Type</th>
              <th class="py-3 px-4">Size</th>
              <th class="py-3 px-4">Updated</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody id="itemsTableBody" class="divide-y divide-slate-100"></tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 rounded-b-2xl">
        <div id="connectionStatus" class="flex items-center space-x-2">
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse" id="statusDot"></span>
          <span id="statusText">Not connected</span>
        </div>
        <div id="itemCountLabel">0 item(s)</div>
      </div>
    </div>

    <!-- Settings View -->
    <div id="viewSettings" class="hidden flex-1 flex flex-col overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      <div>
        <h2 class="text-lg font-bold text-slate-900 mb-1">Configuration</h2>
        <p class="text-xs text-slate-500">Enter your Supabase and Firebase credentials.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <!-- Supabase Card -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
          <h3 class="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <i class="fa-solid fa-bolt text-emerald-600"></i> Supabase Credentials
          </h3>
          
          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Project URL</label>
            <input type="text" id="settingUrlInput" placeholder="https://xxxxx.supabase.co" 
                   class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Anon Public Key</label>
            <input type="text" id="settingApiKeyInput" placeholder="eyJhbGciOiJIUzI1NiIsIn..." 
                   class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Storage Bucket Name</label>
            <input type="text" id="settingBucketInput" placeholder="files" value="files"
                   class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
          </div>
        </div>

        <!-- Firebase Card -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
          <h3 class="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <i class="fa-solid fa-fire text-amber-500"></i> Firebase Credentials
          </h3>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Firebase API Key (<code class="text-[11px] text-indigo-600">apiKey</code>)</label>
            <input type="text" id="settingFirebaseApiKeyInput" placeholder="AIzaSy..." 
                   class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Project ID (<code class="text-[11px] text-indigo-600">projectId</code>)</label>
            <input type="text" id="settingFirebaseProjectIdInput" placeholder="my-firebase-project" 
                   class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">App ID (<code class="text-[11px] text-indigo-600">appId</code>)</label>
            <input type="text" id="settingFirebaseAppIdInput" placeholder="1:123456789:web:abc123" 
                   class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
          </div>
        </div>
      </div>

      <div>
        <button onclick="saveSettings()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition">
          Save & Connect
        </button>
      </div>
    </div>
  </main>

  <!-- Create Folder Modal -->
  <div id="modalCreateFolder" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
      <h3 class="font-bold text-slate-900 text-base">Create New Folder</h3>
      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1">Folder Name</label>
        <input type="text" id="folderNameInput" placeholder="e.g. documents" 
               class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
      </div>
      <div class="flex justify-end space-x-2 pt-2">
        <button onclick="closeModals()" class="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition">Cancel</button>
        <button onclick="submitCreateFolder()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition">Create Folder</button>
      </div>
    </div>
  </div>

  <!-- Preview / Editor & Sidebar Modal -->
  <div id="modalPreview" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[88vh] flex flex-col border border-slate-200 overflow-hidden">
      
      <!-- Top Bar -->
      <div class="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
        <h3 id="previewTitle" class="font-bold text-slate-900 text-sm truncate"></h3>
        <button onclick="closeModals()" class="text-slate-500 hover:text-slate-800 p-1">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Content Container: Split Screen (Left: Viewer, Right: Sidebar) -->
      <div class="flex-1 flex overflow-hidden">
        
        <!-- Main Preview Area -->
        <div id="previewBody" class="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-100"></div>

        <!-- Right Sidebar for Details & Hashes -->
        <div class="w-80 border-l border-slate-200 bg-white flex flex-col overflow-y-auto p-4 shrink-0 shadow-inner">
          <div class="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
            <i class="fa-solid fa-fingerprint text-indigo-600 text-sm"></i>
            <h4 class="font-bold text-xs text-slate-800 uppercase tracking-wider">File Details & Hashes</h4>
          </div>
          <div id="previewSidebarDetails" class="space-y-4 text-xs text-slate-600">
            <!-- Dynamic Hashes injected here -->
          </div>
        </div>

      </div>

      <!-- Footer Buttons -->
      <div class="px-5 py-3 border-t border-slate-200 bg-white flex justify-end gap-2 flex-wrap">
        <button id="previewSaveBtn" onclick="saveEditedText()" class="hidden px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg">
          <i class="fa-solid fa-floppy-disk mr-1"></i> Save
        </button>
        <button id="previewCancelEditBtn" onclick="cancelEditText()" class="hidden px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg">
          Cancel
        </button>
        <a id="previewDownloadBtn" href="#" download class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg">
          <i class="fa-solid fa-download mr-1"></i> Download
        </a>
        <button onclick="closeModals()" class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg">Close</button>
      </div>

    </div>
  </div>

  <script src="./backup.js"></script>
  <script src="./interface.js"></script>
</body>
</html>
