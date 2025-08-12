<template>
  <div class="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
    <!-- Top Navigation Bar -->
    <nav class="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 fixed top-0 left-0 right-0 z-50 w-full">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">WhatsApp Bot</h1>
              <p class="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="relative p-2 text-gray-400 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            <!-- User Profile -->
            <div class="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span class="text-white text-sm font-bold">{{ userInitials }}</span>
              </div>
              <div class="hidden md:block">
                <p class="text-sm font-semibold text-gray-900">{{ userName }}</p>
                <p class="text-xs text-gray-500">{{ userEmail }}</p>
              </div>
                          <button 
              @click="logout" 
              :disabled="isLoggingOut"
              class="p-1 text-gray-400 hover:text-red-600 transition-all duration-300 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{ 'animate-pulse': isLoggingOut }"
            >
              <svg 
                v-if="!isLoggingOut"
                class="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <svg 
                v-else
                class="w-4 h-4 animate-spin" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex flex-1 pt-16">
      <!-- Sidebar -->
      <div class="w-64 bg-white/80 backdrop-blur-md shadow-xl border-r border-white/20 h-full flex-shrink-0">
        <div class="p-6">
          <!-- Welcome Section -->
          <div class="mb-8">
            <h2 class="text-lg font-bold text-gray-900 mb-1">Welcome back!</h2>
            <p class="text-sm text-gray-600">Here's what's happening today</p>
          </div>

          <!-- Navigation Menu -->
          <nav class="space-y-2">
            <a 
              v-for="item in navigationItems" 
              :key="item.name"
              @click="navigateToPage(item.name)"
              :class="[
                'flex items-center px-4 py-3 text-sm font-medium rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105',
                activePage === item.name 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700'
              ]"
            >
              <!-- Dashboard Icon -->
              <svg v-if="item.name === 'dashboard'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"/>
              </svg>
              
              <!-- Bot Icon -->
              <svg v-else-if="item.name === 'bots'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              
              <!-- Keyword Icon -->
              <svg v-else-if="item.name === 'keywords'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              
              <!-- Pricing Icon -->
              <svg v-else-if="item.name === 'pricing'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              
              <!-- Settings Icon -->
              <svg v-else-if="item.name === 'settings'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              
              {{ item.label }}
            </a>
          </nav>

          <!-- Quick Stats -->
          <div class="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-xs">
                <span class="text-gray-600">Today's Messages</span>
                <span class="font-semibold text-blue-600">247</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-gray-600">Active Bots</span>
                <span class="font-semibold text-green-600">3</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-gray-600">Response Rate</span>
                <span class="font-semibold text-purple-600">98%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 h-full overflow-y-auto min-w-0" :class="activePage === 'bots' || activePage === 'keywords' || activePage === 'settings' ? 'p-0' : 'p-8'">
        <!-- Page Header -->
       
        

        <!-- Dashboard Content -->
        <div v-if="activePage === 'dashboard'" class="space-y-8 p-8">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="group bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 mb-1">Total Messages</p>
                  <p class="text-3xl font-bold text-gray-900">1,234</p>
                  <p class="text-xs text-green-600 mt-1">+12% from last week</p>
                </div>
                <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="group bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 mb-1">Active Bots</p>
                  <p class="text-3xl font-bold text-gray-900">3</p>
                  <p class="text-xs text-blue-600 mt-1">All running smoothly</p>
                </div>
                <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="group bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 mb-1">Keywords</p>
                  <p class="text-3xl font-bold text-gray-900">45</p>
                  <p class="text-xs text-yellow-600 mt-1">+5 new this month</p>
                </div>
                <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="group bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 mb-1">Users</p>
                  <p class="text-3xl font-bold text-gray-900">156</p>
                  <p class="text-xs text-purple-600 mt-1">+23 this week</p>
                </div>
                <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts and Activity Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Activity Chart -->
            <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Message Activity</h3>
                <div class="flex space-x-2">
                  <button class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg font-medium">Today</button>
                  <button class="px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-lg">Week</button>
                  <button class="px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-lg">Month</button>
                </div>
              </div>
              <div class="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                <div class="flex items-end justify-between h-full space-x-2">
                  <div class="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg" style="height: 60%"></div>
                  <div class="flex-1 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg" style="height: 80%"></div>
                  <div class="flex-1 bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg" style="height: 45%"></div>
                  <div class="flex-1 bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-lg" style="height: 70%"></div>
                  <div class="flex-1 bg-gradient-to-t from-pink-500 to-pink-300 rounded-t-lg" style="height: 90%"></div>
                  <div class="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-lg" style="height: 55%"></div>
                  <div class="flex-1 bg-gradient-to-t from-red-500 to-red-300 rounded-t-lg" style="height: 75%"></div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
              <div class="space-y-4">
                <div class="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">New message from +1234567890</p>
                    <p class="text-xs text-gray-500">"Hello, I need help with my order"</p>
                  </div>
                  <span class="text-xs text-gray-400">2m ago</span>
                </div>
                
                <div class="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">Bot "Customer Support" responded</p>
                    <p class="text-xs text-gray-500">Keyword "help" triggered auto-response</p>
                  </div>
                  <span class="text-xs text-gray-400">5m ago</span>
                </div>
                
                <div class="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">New keyword "pricing" added</p>
                    <p class="text-xs text-gray-500">To bot "Sales" with 3 responses</p>
                  </div>
                  <span class="text-xs text-gray-400">10m ago</span>
                </div>
                
                <div class="flex items-center space-x-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                  <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">Bot "Support" went offline</p>
                    <p class="text-xs text-gray-500">Connection lost, attempting reconnect...</p>
                  </div>
                  <span class="text-xs text-gray-400">15m ago</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button @click="showAddBotDialog = true" class="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105">
                <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </div>
                <div class="text-left">
                  <p class="font-medium text-gray-900">Add New Bot</p>
                  <p class="text-xs text-gray-600">Create a new WhatsApp bot</p>
                </div>
              </button>
              
              <button class="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105">
                <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <p class="font-medium text-gray-900">Add Keywords</p>
                  <p class="text-xs text-gray-600">Configure auto-responses</p>
                </div>
              </button>
              
              <button class="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105">
                <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <p class="font-medium text-gray-900">View Analytics</p>
                  <p class="text-xs text-gray-600">Check performance reports</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Bots Page Content -->
        <div v-else-if="activePage === 'bots'" class="space-y-6 p-8">
          <!-- Header with Add Bot Button -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full pb-4">
            <div>
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">My Bots</h2>
              <p class="text-gray-600 mt-1">Manage your WhatsApp bot instances</p>
            </div>
            <div class="flex items-center space-x-3">
              <button @click="loadBots" :disabled="isLoadingBots" class="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                <svg :class="`w-4 h-4 sm:w-5 sm:h-5 inline mr-2 ${isLoadingBots ? 'animate-spin' : ''}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {{ isLoadingBots ? 'Loading...' : 'Refresh' }}
              </button>
            <button @click="showAddBotDialog = true" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Add New Bot
            </button>
                </div>
              </div>

          <!-- Loading State -->
          <div v-if="isLoadingBots" class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-gray-600">Loading your bots...</p>
                </div>
              </div>

          <!-- Empty State -->
          <div v-else-if="bots.length === 0" class="text-center py-12">
            <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
                </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No bots yet</h3>
            <p class="text-gray-600 mb-6">Create your first WhatsApp bot to get started</p>
            <button @click="showAddBotDialog = true" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
              Create Your First Bot
                    </button>
            </div>

          <!-- Bot Cards Grid -->
          <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <!-- Real Bot Cards -->
            <div 
              v-for="bot in bots" 
              :key="bot.id"
              class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
            >
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                <div class="flex items-center space-x-3">
                  <div :class="`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${getBotTypeColor(bot.bot_type)} rounded-xl flex items-center justify-center shadow-lg`">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getBotTypeIcon(bot.bot_type)"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900">{{ getBotTypeName(bot.bot_type) }}</h3>
                    <p class="text-xs sm:text-sm text-gray-500">Bot ID: {{ bot.id }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="`inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-xs font-medium ${bot.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`">
                    <span :class="`w-2 h-2 rounded-full mr-1.5 ${bot.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`"></span>
                    {{ bot.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>

              <!-- Bot Description -->
              <div v-if="bot.description" class="mb-4">
                <p class="text-sm text-gray-600">{{ bot.description }}</p>
              </div>

              <!-- Bot Stats -->
              <div class="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                <div class="text-center p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <p class="text-lg sm:text-2xl font-bold text-blue-600">{{ getMessageCount(bot) }}</p>
                  <p class="text-xs text-gray-600">Messages</p>
                </div>
                <div class="text-center p-2 sm:p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <p class="text-lg sm:text-2xl font-bold text-green-600">{{ getKeywordCount(bot) }}</p>
                  <p class="text-xs text-gray-600">Keywords</p>
                </div>
                <div class="text-center p-2 sm:p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <p class="text-lg sm:text-2xl font-bold text-purple-600">{{ bot.status === 'active' ? '100%' : '0%' }}</p>
                  <p class="text-xs text-gray-600">Status</p>
                </div>
              </div>

              <!-- Bot Actions -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div class="flex flex-wrap gap-2">
                  <button 
                    @click="toggleBotStatus(bot)"
                    :class="`px-2 sm:px-3 py-1 sm:py-1.5 text-xs rounded-lg transition-colors duration-200 ${bot.status === 'active' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`"
                  >
                    {{ bot.status === 'active' ? 'Stop' : 'Start' }}
                  </button>
                                      <button @click="openEditBotDialog(bot)" class="px-2 sm:px-3 py-1 sm:py-1.5 text-xs bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200">
                      Edit
                  </button>
                  <button @click="openQrCodeDialog(bot)" class="px-2 sm:px-3 py-1 sm:py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200">
                    QR Code
                  </button>
                </div>
                <button @click="toggleBotMenu(bot.id)" class="text-gray-400 hover:text-gray-600 transition-colors duration-200 self-end sm:self-auto relative">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                  
                  <!-- Bot Menu Dropdown -->
                  <div v-if="activeBotMenu === bot.id" class="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                    <button @click="deleteBot(bot.id)" class="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      Delete Bot
                    </button>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Bot Management Section -->
          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Bot Management</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              <button class="flex items-center p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div class="text-left">
                  <p class="font-medium text-gray-900 text-sm sm:text-base">Start All Bots</p>
                  <p class="text-xs text-gray-600">Activate all bot instances</p>
                </div>
              </button>
              
              <button class="flex items-center p-3 sm:p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 hover:from-red-100 hover:to-red-200 transition-all duration-300 transform hover:scale-105">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
                <div class="text-left">
                  <p class="font-medium text-gray-900 text-sm sm:text-base">Stop All Bots</p>
                  <p class="text-xs text-gray-600">Deactivate all bot instances</p>
                </div>
              </button>
              
              <button class="flex items-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 sm:col-span-2 lg:col-span-1 xl:col-span-1">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                <div class="text-left">
                  <p class="font-medium text-gray-900 text-sm sm:text-base">Restart All</p>
                  <p class="text-xs text-gray-600">Restart all bot instances</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Keywords Page -->
        <div v-else-if="activePage === 'keywords'" class="w-full h-full">
          <Keywords
            :bots="bots"
          />
        </div>

        <!-- Settings Page Content -->
        <div v-else-if="activePage === 'settings'" class="space-y-6 p-0">
          <!-- Header -->
          <div class="mb-8 p-8 pb-4">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h2>
            <p class="text-gray-600 mt-1">Manage your account and bot configurations</p>
          </div>

          <!-- Settings Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 px-8">
            <!-- Account Settings -->
            <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
              <div class="flex items-center mb-6">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Account Settings</h3>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
                  <input 
                    v-model="userProfile.shop_name" 
                    type="text" 
                    placeholder="Enter shop name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    v-model="userProfile.email" 
                    type="email" 
                    placeholder="Enter email address"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    v-model="userProfile.phone" 
                    type="tel" 
                    placeholder="Enter phone number"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>

                <button 
                  @click="updateUserProfile"
                  :disabled="isUpdatingProfile"
                  class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg v-if="isUpdatingProfile" class="w-4 h-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <span>{{ isUpdatingProfile ? 'Updating...' : 'Update Profile' }}</span>
                </button>
              </div>
            </div>

            <!-- Security Settings -->
            <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
              <div class="flex items-center mb-6">
                <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Security</h3>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input type="password" placeholder="Enter current password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input type="password" placeholder="Enter new password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input type="password" placeholder="Confirm new password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <button class="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
                  Change Password
                </button>
              </div>
            </div>



            <!-- Current Plan -->
            <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
              <div class="flex items-center mb-6">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Current Plan</h3>
              </div>
              
              <div class="space-y-4">
                <!-- Plan Name -->
                <div class="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <h4 class="text-lg font-bold text-purple-900 mb-1">Pro Plan</h4>
                  <p class="text-sm text-purple-600">$29/month</p>
                </div>
                
                <!-- Quota Usage -->
                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span class="text-gray-700">Messages Used</span>
                      <span class="text-gray-900 font-medium">8,450 / 10,000</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style="width: 84.5%"></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">1,550 messages remaining</p>
                  </div>
                  
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span class="text-gray-700">Active Bots</span>
                      <span class="text-gray-900 font-medium">3 / 5</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style="width: 60%"></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">2 bots remaining</p>
                  </div>
                  
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span class="text-gray-700">Keywords</span>
                      <span class="text-gray-900 font-medium">45 / 100</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-gradient-to-r from-yellow-500 to-orange-600 h-2 rounded-full" style="width: 45%"></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">55 keywords remaining</p>
                  </div>
                </div>
                
                <!-- Plan Features -->
                <div class="space-y-2">
                  <div class="flex items-center text-sm">
                    <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span class="text-gray-700">Priority Support</span>
                  </div>
                  <div class="flex items-center text-sm">
                    <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span class="text-gray-700">Advanced Analytics</span>
                  </div>
                  <div class="flex items-center text-sm">
                    <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span class="text-gray-700">Custom Integrations</span>
                  </div>
                </div>
                
                <button class="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-red-200 p-6 mx-8 mr-0">
            <div class="flex items-center mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-red-900">Danger Zone</h3>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p class="text-sm font-medium text-red-900">Delete All Bots</p>
                  <p class="text-xs text-red-600">Permanently delete all your bot instances and data</p>
                </div>
                <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm">
                  Delete All
                </button>
              </div>
              <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p class="text-sm font-medium text-red-900">Delete Account</p>
                  <p class="text-xs text-red-600">Permanently delete your account and all associated data</p>
                </div>
                <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Pages Content -->
        <div v-else class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ getCurrentPageTitle() }}</h2>
            <p class="text-gray-600 text-lg mb-6">{{ getCurrentPageDescription() }}</p>
            <p class="text-gray-500">This feature is coming soon! 🚀</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Keyword Dialog -->
    <div v-if="showAddKeywordDialog" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-white/20">
        <!-- Dialog Header -->
        <div class="relative p-8 pb-6 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div> 
              <div>
                <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Add New Keyword</h3>
                <p class="text-gray-500 text-sm">Configure automated responses for your bots</p>
              </div>
            </div>
            <button @click="showAddKeywordDialog = false" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 group">
              <svg class="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Dialog Content -->
        <div class="px-8 pb-8 space-y-6 overflow-y-auto flex-1">
          <!-- Bot Selection -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Select Bot
            </label>
            <div class="relative">
              <select v-model="newKeyword.botId" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <option value="">Choose a bot...</option>
                <option v-for="bot in bots" :key="bot.id" :value="bot.id">
                  {{ getBotTypeName(bot.bot_type) }} - {{ bot.description || 'No description' }}
                </option>
              </select>
            </div>
          </div>

          <!-- Keyword Tags -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              Keywords
            </label>
            <div class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus-within:ring-4 focus-within:ring-purple-100 focus-within:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm min-h-[60px] flex flex-wrap items-center gap-2">
              <!-- Existing Tags -->
              <div 
                v-for="(tag, index) in keywordTags" 
                :key="index"
                class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-lg text-sm font-medium"
              >
                <span>{{ tag }}</span>
                <button 
                  @click="removeKeywordTag(index)" 
                  class="ml-2 text-purple-600 hover:text-purple-800 transition-colors duration-200"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              
              <!-- Input Field -->
              <input 
                v-model="currentKeywordInput" 
                @keydown.enter.prevent="addKeywordTag"
                @keydown.tab.prevent="addKeywordTag"
                @keydown.backspace="handleBackspace"
                type="text" 
                placeholder="Type keyword and press Tab or Enter..."
                class="flex-1 min-w-[200px] bg-transparent border-none outline-none placeholder-gray-400 text-sm"
              >
            </div>
            <div class="text-xs text-gray-500">
              Press Tab or Enter to add keywords. Press Backspace to remove the last tag.
            </div>
          </div>

          <!-- Message Type -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              Message Type
            </label>
            <select 
              v-model="newKeyword.messageType" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            >
              <option value="text">Text Message</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="document">Document</option>
            </select>
            <div class="text-xs text-gray-500">
              Choose the type of response message to send
            </div>
          </div>

          <!-- Text Message -->
          <div v-if="newKeyword.messageType === 'text'" class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Text Message
            </label>
            <textarea 
              v-model="newKeyword.messageText" 
              rows="4" 
              placeholder="Enter the automated response message..."
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none placeholder-gray-400"
            ></textarea>
            <div class="flex justify-between items-center text-xs text-gray-500">
              <span>Automated response that will be sent when this keyword is detected</span>
              <span>{{ newKeyword.messageText.length }}/500</span>
            </div>
          </div>

          <!-- Media Message -->
          <div v-if="newKeyword.messageType !== 'text'" class="space-y-4">
            <!-- Media URL -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Media URL
              </label>
              <input 
                v-model="newKeyword.mediaUrl" 
                type="url" 
                placeholder="https://example.com/media.jpg"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-400"
              >
              <div class="text-xs text-gray-500">
                Enter the URL of the {{ newKeyword.messageType }} file
              </div>
            </div>

            <!-- Media Caption -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 flex items-center">
                <svg class="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
                Caption (Optional)
              </label>
              <textarea 
                v-model="newKeyword.mediaCaption" 
                rows="2" 
                placeholder="Add a caption to your media..."
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none placeholder-gray-400"
              ></textarea>
              <div class="text-xs text-gray-500">
                Optional caption to accompany the media
              </div>
            </div>
          </div>

          <!-- Combined Text + Media -->
          <div v-if="newKeyword.messageType !== 'text'" class="space-y-2">
            <label class="relative cursor-pointer">
              <input type="checkbox" v-model="newKeyword.includeText" class="sr-only">
              <div class="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-blue-300" :class="newKeyword.includeText ? 'border-blue-500 bg-blue-50' : ''">
                <div class="w-5 h-5 border-2 border-gray-300 rounded-lg flex items-center justify-center" :class="newKeyword.includeText ? 'border-blue-500 bg-blue-500' : ''">
                  <svg v-if="newKeyword.includeText" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium text-gray-900">Include Text Message</div>
                  <div class="text-sm text-gray-500">Send both media and text response</div>
                </div>
              </div>
            </label>
          </div>

          <!-- Additional Text for Media -->
          <div v-if="newKeyword.messageType !== 'text' && newKeyword.includeText" class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Additional Text Message
            </label>
            <textarea 
              v-model="newKeyword.messageText" 
              rows="3" 
              placeholder="Enter additional text to send with the media..."
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none placeholder-gray-400"
            ></textarea>
            <div class="flex justify-between items-center text-xs text-gray-500">
              <span>Additional text to send with the media</span>
              <span>{{ newKeyword.messageText.length }}/500</span>
            </div>
          </div>

          <!-- Status -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Status
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="relative cursor-pointer">
                <input type="radio" v-model="newKeyword.status" value="active" class="sr-only">
                <div class="p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-blue-300" :class="newKeyword.status === 'active' ? 'border-blue-500 bg-blue-50' : ''">
                  <div class="flex items-center space-x-3">
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" :class="newKeyword.status === 'active' ? 'border-blue-500' : ''">
                      <div v-if="newKeyword.status === 'active'" class="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Active</div>
                      <div class="text-sm text-gray-500">Keyword will respond automatically</div>
                    </div>
                  </div>
                </div>
              </label>
              <label class="relative cursor-pointer">
                <input type="radio" v-model="newKeyword.status" value="inactive" class="sr-only">
                <div class="p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300" :class="newKeyword.status === 'inactive' ? 'border-gray-500 bg-gray-50' : ''">
                  <div class="flex items-center space-x-3">
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" :class="newKeyword.status === 'inactive' ? 'border-gray-500' : ''">
                      <div v-if="newKeyword.status === 'inactive'" class="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Inactive</div>
                      <div class="text-sm text-gray-500">Keyword is disabled</div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Duration -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Response Duration
            </label>
            <div class="relative">
              <select v-model="newKeyword.duration" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <option value="8">8 seconds</option>
                <option value="9">9 seconds</option>
                <option value="10">10 seconds</option>
                <option value="11">11 seconds</option>
                <option value="12">12 seconds</option>
                <option value="13">13 seconds</option>
                <option value="14">14 seconds</option>
                <option value="15">15 seconds</option>
              </select>
            </div>
            <div class="text-xs text-gray-500">
              How long to wait before sending the automated response
            </div>
          </div>
        </div>

        <!-- Dialog Footer -->
        <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex-shrink-0">
          <div class="flex items-center justify-between">
            <button 
              @click="showAddKeywordDialog = false" 
              class="px-6 py-3 text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button 
              @click="addNewKeyword" 
              :disabled="isLoadingKeywords"
              class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isLoadingKeywords" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span>{{ isLoadingKeywords ? 'Adding...' : 'Add Keyword' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Keyword Dialog -->
    <div v-if="showEditKeywordDialog" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-white/20">
        <!-- Dialog Header -->
        <div class="relative p-8 pb-6 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Edit Keywords</h3>
                <p class="text-gray-500 text-sm">Update keywords and response message</p>
              </div>
            </div>
            <button @click="showEditKeywordDialog = false" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 group">
              <svg class="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Dialog Content -->
        <div class="px-8 pb-8 space-y-6 overflow-y-auto flex-1">
          <!-- Bot Info (Read-only) -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Bot
            </label>
            <div class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600">
              {{ getBotTypeName(bots.find(b => b.id === editKeywordData.botId)?.bot_type) }} - {{ bots.find(b => b.id === editKeywordData.botId)?.description || 'No description' }}
            </div>
          </div>

          <!-- Keyword Tags -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              Keywords
            </label>
            <div class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus-within:ring-4 focus-within:ring-purple-100 focus-within:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm min-h-[60px] flex flex-wrap items-center gap-2">
              <!-- Existing Tags -->
              <div 
                v-for="(tag, index) in editKeywordData.keywords" 
                :key="index"
                class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-lg text-sm font-medium"
              >
                <span>{{ tag }}</span>
                <button 
                  @click="removeEditKeywordTag(index)" 
                  class="ml-2 text-purple-600 hover:text-purple-800 transition-colors duration-200"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              
              <!-- Input Field -->
              <input 
                v-model="currentEditKeywordInput" 
                @keydown.enter.prevent="addEditKeywordTag"
                @keydown.tab.prevent="addEditKeywordTag"
                @keydown.backspace="handleEditBackspace"
                type="text" 
                placeholder="Type keyword and press Tab or Enter..."
                class="flex-1 min-w-[200px] bg-transparent border-none outline-none placeholder-gray-400 text-sm"
              >
            </div>
            <div class="text-xs text-gray-500">
              Press Tab or Enter to add keywords. Press Backspace to remove the last tag.
            </div>
          </div>

          <!-- Message Type -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              Message Type
            </label>
            <select 
              v-model="editKeywordData.messageType" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            >
              <option value="text">Text Message</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="document">Document</option>
            </select>
            <div class="text-xs text-gray-500">
              Choose the type of response message to send
            </div>
          </div>

          <!-- Text Message -->
          <div v-if="editKeywordData.messageType === 'text'" class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Text Message
            </label>
            <textarea 
              v-model="editKeywordData.messageText" 
              rows="4" 
              placeholder="Enter the automated response message..."
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none placeholder-gray-400"
            ></textarea>
            <div class="flex justify-between items-center text-xs text-gray-500">
              <span>Automated response that will be sent when this keyword is detected</span>
              <span>{{ editKeywordData.messageText.length }}/500</span>
            </div>
          </div>

          <!-- Media Message -->
          <div v-if="editKeywordData.messageType !== 'text'" class="space-y-4">
            <!-- Media URL -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Media URL
              </label>
              <input 
                v-model="editKeywordData.mediaUrl" 
                type="url" 
                placeholder="https://example.com/media.jpg"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-400"
              >
              <div class="text-xs text-gray-500">
                Enter the URL of the {{ editKeywordData.messageType }} file
              </div>
            </div>

            <!-- Media Caption -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 flex items-center">
                <svg class="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
                Caption (Optional)
              </label>
              <textarea 
                v-model="editKeywordData.mediaCaption" 
                rows="2" 
                placeholder="Add a caption to your media..."
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none placeholder-gray-400"
              ></textarea>
              <div class="text-xs text-gray-500">
                Optional caption to accompany the media
              </div>
            </div>
          </div>

          <!-- Combined Text + Media -->
          <div v-if="editKeywordData.messageType !== 'text'" class="space-y-2">
            <label class="relative cursor-pointer">
              <input type="checkbox" v-model="editKeywordData.includeText" class="sr-only">
              <div class="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-blue-300" :class="editKeywordData.includeText ? 'border-blue-500 bg-blue-50' : ''">
                <div class="w-5 h-5 border-2 border-gray-300 rounded-lg flex items-center justify-center" :class="editKeywordData.includeText ? 'border-blue-500 bg-blue-500' : ''">
                  <svg v-if="editKeywordData.includeText" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium text-gray-900">Include Text Message</div>
                  <div class="text-sm text-gray-500">Send both media and text response</div>
                </div>
              </div>
            </label>
          </div>

          <!-- Additional Text for Media -->
          <div v-if="editKeywordData.messageType !== 'text' && editKeywordData.includeText" class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Additional Text Message
            </label>
            <textarea 
              v-model="editKeywordData.messageText" 
              rows="3" 
              placeholder="Enter additional text to send with the media..."
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none placeholder-gray-400"
            ></textarea>
            <div class="flex justify-between items-center text-xs text-gray-500">
              <span>Additional text to send with the media</span>
              <span>{{ editKeywordData.messageText.length }}/500</span>
            </div>
          </div>

          <!-- Duration -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Response Duration
            </label>
            <div class="relative">
              <select v-model="editKeywordData.duration" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <option value="8">8 seconds</option>
                <option value="9">9 seconds</option>
                <option value="10">10 seconds</option>
                <option value="11">11 seconds</option>
                <option value="12">12 seconds</option>
                <option value="13">13 seconds</option>
                <option value="14">14 seconds</option>
                <option value="15">15 seconds</option>
              </select>
            </div>
            <div class="text-xs text-gray-500">
              How long to wait before sending the automated response
            </div>
          </div>
        </div>

        <!-- Dialog Footer -->
        <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex-shrink-0">
          <div class="flex items-center justify-between">
            <button 
              @click="showEditKeywordDialog = false" 
              class="px-6 py-3 text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button 
              @click="updateKeyword" 
              :disabled="isEditingKeyword"
              class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isEditingKeyword" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>{{ isEditingKeyword ? 'Updating...' : 'Update Keywords' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Bot Dialog -->
    <div v-if="showAddBotDialog" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-white/20">
        <!-- Dialog Header -->
        <div class="relative p-8 pb-6 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-600 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Add New Bot</h3>
                <p class="text-gray-500 text-sm">Create a new WhatsApp bot instance</p>
              </div>
            </div>
            <button @click="showAddBotDialog = false" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 group">
              <svg class="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Dialog Content -->
        <div class="px-8 pb-8 space-y-6 overflow-y-auto flex-1">
          <!-- Bot Name -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              Bot Name
            </label>
            <input 
              v-model="newBot.name" 
              type="text" 
              placeholder="Enter bot name (e.g., Customer Support, Sales Bot)"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-400"
            >
          </div>

          <!-- Phone Number -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              WhatsApp Phone Number
            </label>
            <input 
              v-model="newBot.phoneNumber" 
              type="tel" 
              placeholder="+1 (555) 123-4567"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-400"
            >
          </div>

          <!-- Bot Type -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              Bot Type
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="relative cursor-pointer">
                <input type="radio" v-model="newBot.type" value="customer-support" class="sr-only">
                <div class="p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-blue-300" :class="newBot.type === 'customer-support' ? 'border-blue-500 bg-blue-50' : ''">
                  <div class="flex items-center space-x-3">
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" :class="newBot.type === 'customer-support' ? 'border-blue-500' : ''">
                      <div v-if="newBot.type === 'customer-support'" class="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Customer Support</div>
                      <div class="text-sm text-gray-500">Help and assistance</div>
                    </div>
                  </div>
                </div>
              </label>
              <label class="relative cursor-pointer">
                <input type="radio" v-model="newBot.type" value="sales" class="sr-only">
                <div class="p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-green-300" :class="newBot.type === 'sales' ? 'border-green-500 bg-green-50' : ''">
                  <div class="flex items-center space-x-3">
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" :class="newBot.type === 'sales' ? 'border-green-500' : ''">
                      <div v-if="newBot.type === 'sales'" class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Sales</div>
                      <div class="text-sm text-gray-500">Lead generation</div>
                    </div>
                  </div>
                </div>
              </label>
              <label class="relative cursor-pointer">
                <input type="radio" v-model="newBot.type" value="marketing" class="sr-only">
                <div class="p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-purple-300" :class="newBot.type === 'marketing' ? 'border-purple-500 bg-purple-50' : ''">
                  <div class="flex items-center space-x-3">
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" :class="newBot.type === 'marketing' ? 'border-purple-500' : ''">
                      <div v-if="newBot.type === 'marketing'" class="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Marketing</div>
                      <div class="text-sm text-gray-500">Promotions & campaigns</div>
                    </div>
                  </div>
                </div>
              </label>
              <label class="relative cursor-pointer">
                <input type="radio" v-model="newBot.type" value="general" class="sr-only">
                <div class="p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300" :class="newBot.type === 'general' ? 'border-gray-500 bg-gray-50' : ''">
                  <div class="flex items-center space-x-3">
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" :class="newBot.type === 'general' ? 'border-gray-500' : ''">
                      <div v-if="newBot.type === 'general'" class="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">General</div>
                      <div class="text-sm text-gray-500">Multi-purpose</div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Description
            </label>
            <textarea 
              v-model="newBot.description" 
              rows="3" 
              placeholder="Describe what this bot will do..."
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none placeholder-gray-400"
            ></textarea>
          </div>

          <!-- Status -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Status
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="relative cursor-pointer">
                <input type="radio" v-model="newBot.status" value="active" class="sr-only">
                <div class="p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-green-300" :class="newBot.status === 'active' ? 'border-green-500 bg-green-50' : ''">
                  <div class="flex items-center space-x-3">
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" :class="newBot.status === 'active' ? 'border-green-500' : ''">
                      <div v-if="newBot.status === 'active'" class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Active</div>
                      <div class="text-sm text-gray-500">Bot will respond</div>
                    </div>
                  </div>
                </div>
              </label>
              <label class="relative cursor-pointer">
                <input type="radio" v-model="newBot.status" value="inactive" class="sr-only">
                <div class="p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300" :class="newBot.status === 'inactive' ? 'border-gray-500 bg-gray-50' : ''">
                  <div class="flex items-center space-x-3">
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" :class="newBot.status === 'inactive' ? 'border-gray-500' : ''">
                      <div v-if="newBot.status === 'inactive'" class="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Inactive</div>
                      <div class="text-sm text-gray-500">Bot is disabled</div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Dialog Footer -->
        <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex-shrink-0">
          <div class="flex items-center justify-between">
            <button 
              @click="showAddBotDialog = false" 
              class="px-6 py-3 text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button 
              @click="addNewBot" 
              :disabled="isCreatingBot"
              class="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isCreatingBot" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span>{{ isCreatingBot ? 'Creating...' : 'Add Bot' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Bot Dialog -->
    <div v-if="showEditBotDialog" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-white/20">
        <!-- Dialog Header -->
        <div class="relative p-8 pb-6 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Edit Bot</h3>
                <p class="text-gray-500 text-sm">Update your WhatsApp bot settings</p>
              </div>
            </div>
            <button @click="showEditBotDialog = false" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 group">
              <svg class="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Dialog Content -->
        <div class="px-8 pb-8 space-y-6 overflow-y-auto flex-1">
          <!-- Bot Name (Read-only) -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              Bot Name
            </label>
            <input 
              v-model="editBot.name" 
              type="text" 
              disabled
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
            >
            <p class="text-xs text-gray-500">Bot name is based on type and cannot be changed</p>
          </div>

          <!-- Bot Type -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              Bot Type
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="relative cursor-pointer">
                <input type="radio" v-model="editBot.type" value="customer-support" class="sr-only">
                <div class="p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-blue-300" :class="editBot.type === 'customer-support' ? 'border-blue-500 bg-blue-50' : ''">
                  <div class="flex items-center space-x-3">
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" :class="editBot.type === 'customer-support' ? 'border-blue-500' : ''">
                      <div v-if="editBot.type === 'customer-support'" class="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Customer Support</div>
                      <div class="text-sm text-gray-500">Help and assistance</div>
                    </div>
                  </div>
                </div>
              </label>
              <label class="relative cursor-pointer">
                <input type="radio" v-model="editBot.type" value="sales" class="sr-only">
                <div class="p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-green-300" :class="editBot.type === 'sales' ? 'border-green-500 bg-green-50' : ''">
                  <div class="flex items-center space-x-3">
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" :class="editBot.type === 'sales' ? 'border-green-500' : ''">
                      <div v-if="editBot.type === 'sales'" class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Sales</div>
                      <div class="text-sm text-gray-500">Lead generation</div>
                    </div>
                  </div>
                </div>
              </label>
              <label class="relative cursor-pointer">
                <input type="radio" v-model="editBot.type" value="marketing" class="sr-only">
                <div class="p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-purple-300" :class="editBot.type === 'marketing' ? 'border-purple-500 bg-purple-50' : ''">
                  <div class="flex items-center space-x-3">
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" :class="editBot.type === 'marketing' ? 'border-purple-500' : ''">
                      <div v-if="editBot.type === 'marketing'" class="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Marketing</div>
                      <div class="text-sm text-gray-500">Promotions & campaigns</div>
                    </div>
                  </div>
                </div>
              </label>
              <label class="relative cursor-pointer">
                <input type="radio" v-model="editBot.type" value="general" class="sr-only">
                <div class="p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300" :class="editBot.type === 'general' ? 'border-gray-500 bg-gray-50' : ''">
                  <div class="flex items-center space-x-3">
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" :class="editBot.type === 'general' ? 'border-gray-500' : ''">
                      <div v-if="editBot.type === 'general'" class="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">General</div>
                      <div class="text-sm text-gray-500">Multi-purpose</div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Description
            </label>
            <textarea 
              v-model="editBot.description" 
              rows="3" 
              placeholder="Describe what this bot will do..."
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none placeholder-gray-400"
            ></textarea>
          </div>

          <!-- Status -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-700 flex items-center">
              <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Status
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="relative cursor-pointer">
                <input type="radio" v-model="editBot.status" value="active" class="sr-only">
                <div class="p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-green-300" :class="editBot.status === 'active' ? 'border-green-500 bg-green-50' : ''">
                  <div class="flex items-center space-x-3">
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" :class="editBot.status === 'active' ? 'border-green-500' : ''">
                      <div v-if="editBot.status === 'active'" class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Active</div>
                      <div class="text-sm text-gray-500">Bot will respond</div>
                    </div>
                  </div>
                </div>
              </label>
              <label class="relative cursor-pointer">
                <input type="radio" v-model="editBot.status" value="inactive" class="sr-only">
                <div class="p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300" :class="editBot.status === 'inactive' ? 'border-gray-500 bg-gray-50' : ''">
                  <div class="flex items-center space-x-3">
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" :class="editBot.status === 'inactive' ? 'border-gray-500' : ''">
                      <div v-if="editBot.status === 'inactive'" class="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Inactive</div>
                      <div class="text-sm text-gray-500">Bot is disabled</div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Dialog Footer -->
        <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex-shrink-0">
          <div class="flex items-center justify-between">
            <button 
              @click="showEditBotDialog = false" 
              class="px-6 py-3 text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button 
              @click="updateBot" 
              :disabled="isEditingBot"
              class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isEditingBot" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>{{ isEditingBot ? 'Updating...' : 'Update Bot' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- QR Code Dialog -->
    <div v-if="showQrCodeDialog" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-white/20">
        <!-- Dialog Header -->
        <div class="relative p-8 pb-6 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-600 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">QR Code</h3>
                <p class="text-gray-500 text-sm">{{ selectedBotForQr ? getBotTypeName(selectedBotForQr.bot_type) : 'Bot' }} WhatsApp Connection</p>
              </div>
            </div>
            <button @click="closeQrDialog" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 group">
              <svg class="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Dialog Content -->
        <div class="px-8 pb-8 space-y-6 overflow-y-auto flex-1">
          <!-- Bot Info -->
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">{{ selectedBotForQr ? getBotTypeName(selectedBotForQr.bot_type) : 'Bot' }}</h4>
                <p class="text-sm text-gray-600">{{ selectedBotForQr ? (selectedBotForQr.description || 'No description') : '' }}</p>
              </div>
            </div>
          </div>

          <!-- QR Code Display -->
          <div class="text-center space-y-4">
            <div v-if="selectedBotForQr?.status?.qr_code_available" class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div class="w-48 h-48 mx-auto bg-gray-50 rounded-xl flex items-center justify-center relative">
                <!-- Real QR Code -->
                <img v-if="selectedBotForQr?.status?.qr_code_path && selectedBotForQr.status.qr_code_path.split('/').length > 2" 
                     :src="`https://chatbot.soexplast.com/api/qr-code/${selectedBotForQr.status.qr_code_path.split('/')[2]}/qr.png`" 
                     alt="QR Code" 
                     class="w-44 h-44 object-contain"
                     @error="handleQrCodeError"
                     @load="handleQrCodeLoad">
                
                <!-- Fallback QR Code Pattern -->
                <div v-else class="grid grid-cols-25 gap-0.5 w-44 h-44">
                  <div v-for="i in 625" :key="i" 
                       :class="getRandomQRCell() ? 'bg-black' : 'bg-white'"
                       class="w-1 h-1 rounded-sm"></div>
                </div>
                
                <!-- WhatsApp Logo in Center -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Bot Status Display -->
            <div v-if="selectedBotForQr?.status" class="mt-4">
              <div class="flex items-center justify-center space-x-2 mb-3">
                <div :class="getStatusColor(selectedBotForQr.status.session_status)" 
                     class="w-3 h-3 rounded-full"></div>
                <span class="text-sm font-medium text-gray-700">
                  {{ getStatusText(selectedBotForQr.status.session_status) }}
                </span>
              </div>
              
              <!-- Connected Status with Phone Number -->
              <div v-if="selectedBotForQr.status.is_connected" class="text-center">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                  <div class="flex items-center justify-center space-x-2 mb-2">
                    <div class="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="text-sm font-semibold text-green-700">Successfully Connected!</span>
                  </div>
                  <div class="text-sm text-green-600">
                    Phone: {{ selectedBotForQr.status.phone_number || 'Unknown' }}
                  </div>
                  <div class="text-xs text-green-500 mt-1">
                    Dialog will close automatically in a few seconds...
                  </div>
                </div>
              </div>
              
              <!-- QR Code Available Status -->
              <div v-if="selectedBotForQr.status.qr_code_available && !selectedBotForQr.status.is_connected" 
                   class="text-sm text-blue-600 mb-2 text-center">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div class="flex items-center justify-center space-x-2 mb-1">
                    <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span class="text-sm font-medium">QR Code Ready</span>
                  </div>
                  <div class="text-xs text-blue-600">Scan with your phone to connect</div>
                </div>
              </div>
              
              <!-- Generating QR Code Status -->
              <div v-if="!selectedBotForQr.status.qr_code_available && selectedBotForQr.status.session_status === 'connecting'" 
                   class="text-sm text-blue-600 mb-2 text-center">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div class="flex items-center justify-center space-x-2 mb-1">
                    <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span class="text-sm font-medium">Generating QR Code...</span>
                  </div>
                  <div class="text-xs text-blue-600">This may take a few seconds</div>
                </div>
              </div>
            </div>
            
            <!-- Loading state when QR code is being generated -->
            <div v-if="!selectedBotForQr?.status?.qr_code_available && selectedBotForQr?.status?.session_status === 'connecting'" class="bg-white rounded-2xl p-6 border-2 border-dashed border-blue-300">
              <div class="w-48 h-48 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                <!-- Loading Animation -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                
                <!-- Center Logo -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <p class="text-sm text-blue-600 mt-3 font-medium">Generating QR Code...</p>
              <p class="text-xs text-gray-500 mt-1">This may take a few seconds</p>
            </div>
            
            <!-- Error state -->
            <div v-if="selectedBotForQr?.status?.session_status === 'error'" class="bg-white rounded-2xl p-6 border-2 border-dashed border-red-300">
              <div class="w-48 h-48 mx-auto bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                <!-- Error Icon -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div class="text-center mt-4">
                <p class="text-sm font-medium text-red-600 mb-2">Connection Error</p>
                <p class="text-xs text-gray-600 mb-4">{{ selectedBotForQr.status.error_message || 'An error occurred while generating the QR code' }}</p>
                <button @click="retryQrCodeGeneration(selectedBotForQr)" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
                  Try Again
                </button>
              </div>
            </div>
            
            <!-- Placeholder when no session exists -->
            <div v-if="!selectedBotForQr?.status?.has_session && selectedBotForQr?.status?.session_status !== 'error'" class="bg-white rounded-2xl p-6 border-2 border-dashed border-gray-300">
              <div class="w-48 h-48 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden">
                <!-- Placeholder Pattern -->
                <div class="absolute inset-2 bg-white rounded-lg"></div>
                <div class="absolute top-4 left-4 w-2 h-2 bg-black rounded-sm"></div>
                <div class="absolute top-4 right-4 w-2 h-2 bg-black rounded-sm"></div>
                <div class="absolute bottom-4 left-4 w-2 h-2 bg-black rounded-sm"></div>
                
                <!-- Center Logo Placeholder -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <p class="text-sm text-gray-500 mt-3">Initializing bot connection...</p>
            </div>
          </div>

          <!-- Instructions -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              How to Connect
            </h4>
            
            <div class="space-y-3">
              <div class="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Bot Auto-Starts</p>
                  <p class="text-xs text-gray-600 mt-1">The bot automatically starts when you open this dialog. QR code generation begins immediately.</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Scan QR Code</p>
                  <p class="text-xs text-gray-600 mt-1">Open WhatsApp on your phone, go to Settings > Linked Devices > Link a Device</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Point Camera</p>
                  <p class="text-xs text-gray-600 mt-1">Point your phone's camera at the QR code displayed on your screen</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div class="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Confirm Connection</p>
                  <p class="text-xs text-gray-600 mt-1">Tap "Link Device" on your phone to complete the connection</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Information -->
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h5 class="text-sm font-semibold text-gray-900">Connection Status</h5>
                <p class="text-xs text-gray-600">The bot starts automatically and generates a QR code for you to scan with WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Dialog Footer -->
        <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <!-- Connecting Status -->
              <div v-if="selectedBotForQr?.status?.session_status === 'connecting' && !selectedBotForQr?.status?.qr_code_available" 
                   class="flex items-center space-x-2 text-blue-600">
                <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span class="text-sm font-medium">Generating QR Code...</span>
              </div>
              
              <!-- QR Ready Status -->
              <div v-else-if="selectedBotForQr?.status?.qr_code_available && !selectedBotForQr?.status?.is_connected" 
                   class="flex items-center space-x-2 text-blue-600">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span class="text-sm font-medium">QR Code Ready - Scan to Connect</span>
              </div>
              
              <!-- Connected Status -->
              <div v-else-if="selectedBotForQr?.status?.is_connected" class="flex items-center space-x-2 text-green-600">
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-sm font-medium">Connected Successfully!</span>
              </div>
              
              <!-- Error Status -->
              <div v-else-if="selectedBotForQr?.status?.session_status === 'error'" class="flex items-center space-x-2 text-red-600">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-sm font-medium">Connection Error</span>
              </div>
            </div>
            
            <!-- Close Button -->
            <button 
              @click="closeQrDialog" 
              :class="selectedBotForQr?.status?.is_connected ? 
                'px-6 py-3 text-green-600 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-all duration-200 font-medium' :
                'px-6 py-3 text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium'"
            >
              {{ selectedBotForQr?.status?.is_connected ? 'Close' : 'Close' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI, botAPI, shopsAPI } from '../services/api.js'
import Keywords from './Keywords.vue'

export default {
  components: {
    Keywords
  },

  name: 'Dashboard',
  data() {
    return {
      activePage: 'dashboard',
      userName: '',
      userEmail: '',
      showAddKeywordDialog: false,
      isLoadingKeywords: false,
      keywordSearch: '',
      selectedBotFilter: '',
      showEditKeywordDialog: false,
      isEditingKeyword: false,
              editKeywordData: {
          botId: null,
          messageId: null,
          keywords: [],
          response: '',
          originalKeywords: [],
          messageType: 'text',
          messageText: '',
          mediaUrl: '',
          mediaCaption: '',
          includeText: false,
          isContain: true, // Default to true for backward compatibility
          matchingMode: 'exact', // 'exact' or 'contains'
          duration: 8 // Default duration in seconds
        },
      currentEditKeywordInput: '',
      showAddBotDialog: false,
      showEditBotDialog: false,
      showQrCodeDialog: false,
      selectedBotForQr: null,
      currentPollingFunction: null,
      isCreatingBot: false,
      isEditingBot: false,
      bots: [],
      isLoadingBots: false,
      // Settings data
      userProfile: {
        name: '',
        email: '',
        phone: '',
        shop_name: ''
      },
      isUpdatingProfile: false,
      isLoggingOut: false,
      isCheckingAuth: true,
      newKeyword: {
        botId: '',
        keyword: '',
        messageType: 'text',
        messageText: '',
        mediaUrl: '',
        mediaCaption: '',
        includeText: false,
        isContain: true, // For backward compatibility
        matchingMode: 'exact', // 'exact' or 'contains'
        status: 'active',
        duration: 8 // Default duration in seconds
      },
      newBot: {
        name: '',
        phoneNumber: '',
        description: '',
        type: 'customer-support',
        status: 'active'
      },
      editBot: {
        id: null,
        name: '',
        phoneNumber: '',
        description: '',
        type: 'customer-support',
        status: 'active'
      },
      keywordTags: [],
      currentKeywordInput: '',
      activeBotMenu: null,
      navigationItems: [
        {
          name: 'dashboard',
          label: 'Dashboard',
          icon: 'DashboardIcon'
        },
        {
          name: 'bots',
          label: 'My Bots',
          icon: 'BotIcon'
        },
        {
          name: 'keywords',
          label: 'Keywords',
          icon: 'KeywordIcon'
        },
        {
          name: 'pricing',
          label: 'Pricing',
          icon: 'PricingIcon'
        },
        {
          name: 'settings',
          label: 'Settings',
          icon: 'SettingsIcon'
        }
      ]
    }
  },
  computed: {
    userInitials() {
      if (!this.userName) return 'U'
      return this.userName.split(' ').map(n => n[0]).join('').toUpperCase()
    },
    isAuthenticated() {
      return !!localStorage.getItem('auth_token')
    },
    
    filteredKeywords() {
      let keywords = []
      
      // Extract keywords from all bots
      this.bots.forEach(bot => {
        if (bot.keywords && Array.isArray(bot.keywords)) {
          // Group keywords by message_id
          const keywordsByMessage = {}
          
          bot.keywords.forEach(keyword => {
            const messageId = keyword.message_id || 'default';
            if (!keywordsByMessage[messageId]) {
              keywordsByMessage[messageId] = []
            }
            keywordsByMessage[messageId].push(keyword)
          })
          
          // Create a row for each message
          Object.keys(keywordsByMessage).forEach(messageId => {
            const messageKeywords = keywordsByMessage[messageId]
            
            // Get message data from the first keyword (they all have the same message)
            const firstKeyword = messageKeywords[0]
            const message = firstKeyword.message_data || {}
            
            console.log('🔍 [DATA] Processing message data:', {
              firstKeyword,
              message,
              messageType: typeof message,
              hasMessageData: !!firstKeyword.message_data,
              messageStructure: message,
              messageTypeFromAPI: message.type,
              messageContent: message.message
            });
            
            // Get the actual message content
            let responseText = 'No response configured'
            let messageType = 'text'
            let mediaUrl = ''
            let mediaCaption = ''
            let includeText = false
            let additionalText = ''
            
            // Helper function to detect message type from response text
            const detectMessageTypeFromResponse = (text) => {
              if (text.toLowerCase().startsWith('image:')) return 'image'
              if (text.toLowerCase().startsWith('video:')) return 'video'
              if (text.toLowerCase().startsWith('audio:')) return 'audio'
              if (text.toLowerCase().startsWith('document:')) return 'document'
              if (text.toLowerCase().startsWith('media:')) return 'media'
              return 'text'
            }
            
            // Check if message is a string (direct text response)
            if (typeof message === 'string') {
              responseText = message
              messageType = detectMessageTypeFromResponse(message)
            } 
            // Handle object message structure from API
            else if (typeof message === 'object' && message !== null) {
              // Handle the new API structure where message is a simple text field
              if (message.message) {
                if (typeof message.message === 'string') {
                  responseText = message.message
                  // Detect message type from response text if not explicitly set
                  messageType = message.type || detectMessageTypeFromResponse(message.message)
                } else if (typeof message.message === 'object') {
                  // Handle legacy object structure
                  if (message.message.text) {
                    responseText = message.message.text
                    messageType = message.type || detectMessageTypeFromResponse(message.message.text)
                  } else if (message.message.content) {
                    responseText = message.message.content
                    messageType = message.type || detectMessageTypeFromResponse(message.message.content)
                  } else if (message.message.url) {
                    mediaUrl = message.message.url
                    messageType = message.type || 'image' // Default to image if URL is present
                    responseText = `Image: ${message.message.url}`
                    if (message.message.caption) {
                      mediaCaption = message.message.caption
                      responseText += ` - ${message.message.caption}`
                    }
                    if (message.message.text) {
                      additionalText = message.message.text
                      includeText = true
                      responseText += `\nText: ${message.message.text}`
                    }
                  }
                }
              } else {
                // Fallback to API type
                messageType = message.type || 'text'
              }
              
              // Extract URL from response text if we have a media type but no URL yet
              if (['image', 'video', 'audio', 'document'].includes(messageType) && !mediaUrl && responseText.includes('http')) {
                const urlMatch = responseText.match(/(https?:\/\/[^\s]+)/i)
                if (urlMatch) {
                  mediaUrl = urlMatch[1]
                }
              }
            }
            
            // Get all keywords for this message
            const messageKeywordList = messageKeywords.map(keyword => keyword.keyword)
            const earliestDate = messageKeywords.length > 0 ? 
              messageKeywords.reduce((earliest, current) => 
                new Date(current.created_at) < new Date(earliest.created_at) ? current : earliest
              ).created_at : new Date().toISOString()
            
            // Get isContain from the first keyword (they all have the same message and setting)
            const isContain = firstKeyword.is_contain !== undefined ? firstKeyword.is_contain : true
            const matchingMode = firstKeyword.matching_mode || 'exact'
            
            const keywordData = {
              botId: bot.id,
              botType: bot.bot_type,
              botDescription: bot.description,
              messageId: messageId,
              keywords: messageKeywordList,
              response: responseText,
              messageType: messageType,
              createdAt: earliestDate,
              isContain: isContain,
              matchingMode: matchingMode,
              // Additional details for editing
              mediaUrl: mediaUrl,
              mediaCaption: mediaCaption,
              includeText: includeText,
              additionalText: additionalText,
              // Store the full message data for editing
              fullMessageData: message
            };
            
            console.log('🔍 [DATA] Processed keyword data:', {
              messageId,
              messageType,
              mediaUrl,
              mediaCaption,
              includeText,
              additionalText,
              fullMessageData: message,
              originalMessageType: message.type,
              messageStructure: typeof message,
              responseText,
              detectedType: detectMessageTypeFromResponse(responseText)
            });
            
            keywords.push(keywordData)
          })
        }
      })
      
      // Filter by bot
      if (this.selectedBotFilter) {
        keywords = keywords.filter(k => k.botId === parseInt(this.selectedBotFilter))
      }
      
      // Filter by search term
      if (this.keywordSearch) {
        const searchTerm = this.keywordSearch.toLowerCase()
        keywords = keywords.filter(k => 
          k.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) || 
          k.response.toLowerCase().includes(searchTerm)
        )
      }
      
      return keywords
    }
  },
  methods: {
    getCurrentPageTitle() {
      const item = this.navigationItems.find(item => item.name === this.activePage)
      return item ? item.label : 'Dashboard'
    },
    getCurrentPageDescription() {
      const descriptions = {
        dashboard: 'Overview of your WhatsApp bot activity and performance',
        bots: 'Manage your WhatsApp bot instances and configurations',

        settings: 'Account settings and bot configurations'
      }
      return descriptions[this.activePage] || 'Page description'
    },
    async logout() {
      try {
        // Add logout animation class
        this.isLoggingOut = true
        
        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 500))
        
        await authAPI.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Clear local storage
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        
        // Navigate to auth page with smooth transition
        this.$router.push('/auth')
      }
    },
    navigateToPage(pageName) {
      // Handle special pages that need to navigate away
      if (pageName === 'pricing') {
        this.$router.push('/pricing')
        return
      }
      
      // Set the active page for internal navigation
      this.activePage = pageName
      
      // Optionally update the URL without reloading the page
      const newUrl = `${window.location.pathname}?page=${pageName}`
      window.history.pushState({ page: pageName }, '', newUrl)
    },
    async addNewKeyword() {
      // Validate form
      if (!this.newKeyword.botId || this.keywordTags.length === 0) {
        alert('Please select a bot and add at least one keyword')
        return
      }

      // Validate message content based on type
      if (this.newKeyword.messageType === 'text' && !this.newKeyword.messageText.trim()) {
        alert('Please enter a text message')
        return
      }

      if (this.newKeyword.messageType !== 'text' && !this.newKeyword.mediaUrl.trim()) {
        alert('Please enter a media URL')
        return
      }

      // If media type with includeText is selected, validate text
      if (this.newKeyword.messageType !== 'text' && this.newKeyword.includeText && !this.newKeyword.messageText.trim()) {
        alert('Please enter additional text message when including text with media')
        return
      }

      this.isLoadingKeywords = true

      try {
        // Get shop ID first
        const shopsResponse = await shopsAPI.getAll()
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          const shopId = shopsResponse.data[0].id
          
          // Prepare data for API
          const requestData = {
            keywords: this.keywordTags,
            message_type: this.newKeyword.messageType,
            message_text: this.newKeyword.messageText || null,
            media_url: this.newKeyword.mediaUrl || null,
            media_caption: this.newKeyword.mediaCaption || null,
            is_contain: this.newKeyword.isContain,
            matching_mode: this.newKeyword.matchingMode,
            duration: this.newKeyword.duration
          }
          
          console.log('📤 [ADD_KEYWORD] Sending request data:', requestData);
          console.log('📤 [ADD_KEYWORD] Duration value:', this.newKeyword.duration);
          
          // Add keywords to the selected bot
          const response = await botAPI.addKeyword(shopId, this.newKeyword.botId, requestData)
          
          if (response.success) {
            // Refresh bots to get updated data
            await this.loadBots()
            
            // Close dialog and reset form
            this.showAddKeywordDialog = false
            this.resetNewKeywordForm()
            
            // Show success message
            alert('Keywords and response added successfully!')
          } else {
            alert('Failed to add keywords: ' + (response.message || 'Unknown error'))
          }
        }
      } catch (error) {
        console.error('Error adding keywords:', error)
        alert('Error adding keywords: ' + (error.response?.data?.message || error.message || 'Unknown error'))
      } finally {
        this.isLoadingKeywords = false
      }
    },
    resetNewKeywordForm() {
      this.newKeyword = {
        botId: '',
        keyword: '',
        messageType: 'text',
        messageText: '',
        mediaUrl: '',
        mediaCaption: '',
        includeText: false,
        isContain: true,
        matchingMode: 'exact',
        status: 'active',
        duration: 8
      }
      this.keywordTags = []
      this.currentKeywordInput = ''
    },
    addKeywordTag() {
      const keyword = this.currentKeywordInput.trim()
      if (keyword && !this.keywordTags.includes(keyword)) {
        this.keywordTags.push(keyword)
        this.currentKeywordInput = ''
      }
    },
    removeKeywordTag(index) {
      this.keywordTags.splice(index, 1)
    },
    handleBackspace(event) {
      if (this.currentKeywordInput === '' && this.keywordTags.length > 0) {
        event.preventDefault()
        this.keywordTags.pop()
      }
    },
    async addNewBot() {
      // Validate form
      if (!this.newBot.name || !this.newBot.phoneNumber || !this.newBot.type) {
        alert('Please fill in all required fields')
        return
      }

      this.isCreatingBot = true;

      try {
        // First, get or create a shop for the user
        let shopId = await this.getOrCreateShop();
        
        // Prepare bot data for API
        const botData = {
          bot_type: this.newBot.type,
          description: this.newBot.description || '',
          status: this.newBot.status
        };

        // Create the bot via API
        const response = await botAPI.create(shopId, botData);
        
        if (response.success) {
          // Close dialog and reset form
          this.showAddBotDialog = false;
          this.resetNewBotForm();
          
          // Show success message
          alert('Bot created successfully!');
          
          // Refresh the bots list
          await this.loadBots();
        } else {
          alert('Failed to create bot: ' + (response.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error creating bot:', error);
        alert('Error creating bot: ' + (error.response?.data?.message || error.message || 'Unknown error'));
      } finally {
        this.isCreatingBot = false;
      }
    },
    resetNewBotForm() {
      this.newBot = {
        name: '',
        phoneNumber: '',
        description: '',
        type: 'customer-support',
        status: 'active'
      }
    },
    toggleBotMenu(botId) {
      if (this.activeBotMenu === botId) {
        this.activeBotMenu = null
      } else {
        this.activeBotMenu = botId
      }
    },
    async openQrCodeDialog(bot) {
      this.selectedBotForQr = bot
      
      // Show dialog immediately first
      this.showQrCodeDialog = true;
      
      // Get the authenticated user's shops
      try {
        const shopsResponse = await shopsAPI.getAll();
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          // Find the shop that owns this bot - try multiple approaches
          let shop = null;
          let shopId = null;
          
          // First try: look for shop with bots relationship
          shop = shopsResponse.data.find(shop => 
            shop.bots && shop.bots.some(shopBot => shopBot.id === bot.id)
          );
          
          // Second try: if no bots relationship, use first shop (fallback)
          if (!shop) {
            console.log('No bots relationship found, using first shop as fallback');
            shop = shopsResponse.data[0];
          }
          
          if (shop) {
            shopId = shop.id;
            console.log(`Opening QR dialog for bot ${bot.id} in shop ${shopId} (${shop.name})`);
            
            // Create session immediately when dialog is opened
            console.log('Creating session immediately...');
            const startResponse = await botAPI.startBot(shopId, bot.id);
            
            if (startResponse.success) {
              console.log('Session created successfully:', startResponse);
              
              // Update the bot status in the local array
              const botIndex = this.bots.findIndex(b => b.id === bot.id);
              if (botIndex !== -1) {
                this.bots[botIndex].status = 'active';
              }
              
              // Update the selected bot status
              this.selectedBotForQr.status = {
                bot_status: 'active',
                has_session: true,
                session_status: 'connecting',
                is_connected: false,
                qr_code_available: false
              };
              
              // Start polling for QR code updates
              this.startQrCodePolling(shopId, bot.id);
              
            } else {
              console.error('Failed to create session:', startResponse.message);
              // Don't show alert, just log the error
              console.log('Session creation failed, but dialog is still open');
            }
          } else {
            console.error('No shop found for bot');
          }
        }
      } catch (error) {
        console.error('Error in QR code dialog setup:', error);
        // Don't show alert, just log the error - dialog is already open
        console.log('Error occurred, but dialog is still open');
      }
    },
    async deleteBot(botId) {
      if (confirm('Are you sure you want to delete this bot? This action cannot be undone.')) {
        try {
          // Get shop ID first
          const shopsResponse = await shopsAPI.getAll();
          if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
            const shopId = shopsResponse.data[0].id;
            
            // Delete bot
            const response = await botAPI.delete(shopId, botId);
            
            if (response.success) {
              // Remove bot from local array
              this.bots = this.bots.filter(bot => bot.id !== botId);
              
              // Close menu
              this.activeBotMenu = null;
              
              alert('Bot deleted successfully!');
            } else {
              alert('Failed to delete bot');
            }
          }
        } catch (error) {
          console.error('Error deleting bot:', error);
          alert('Error deleting bot: ' + (error.response?.data?.message || error.message || 'Unknown error'));
        }
      }
    },
    handleClickOutside(event) {
      // Close bot menu if clicking outside
      if (this.activeBotMenu && !event.target.closest('.relative')) {
        this.activeBotMenu = null
      }
    },
    
    async getOrCreateShop() {
      try {
        // Try to get existing shops for the authenticated user
        const shopsResponse = await shopsAPI.getAll();
        
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          // Return the first shop's ID (now filtered by user)
          return shopsResponse.data[0].id;
        } else {
          // Create a new shop for the authenticated user
          const shopData = {
            name: this.newBot.name + ' Shop',
            phone_number: this.newBot.phoneNumber,
            email: this.userEmail || 'shop@example.com',
            description: 'Shop for ' + this.newBot.name
          };
          
          const createResponse = await shopsAPI.create(shopData);
          
          if (createResponse.success) {
            return createResponse.data.id;
          } else {
            throw new Error('Failed to create shop');
          }
        }
      } catch (error) {
        console.error('Error getting/creating shop:', error);
        throw new Error('Failed to get or create shop');
      }
    },
    
    async loadBots() {
      this.isLoadingBots = true;
      try {
        // Get shops first
        const shopsResponse = await shopsAPI.getAll();
        
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          const shopId = shopsResponse.data[0].id;
          
          // Get bots for the first shop
          const botsResponse = await botAPI.getAll(shopId);
          
          if (botsResponse.success) {
            this.bots = botsResponse.data;
          } else {
            this.bots = [];
          }
        } else {
          this.bots = [];
        }
      } catch (error) {
        console.error('Error loading bots:', error);
        this.bots = [];
      } finally {
        this.isLoadingBots = false;
      }
    },
    
    async loadUserProfile() {
      try {
        console.log('Loading user profile...')
        
        // Get user info from auth
        const userResponse = await authAPI.getUser()
        console.log('User response:', userResponse)
        
        if (userResponse.success) {
          this.userProfile.name = userResponse.data.name || ''
          console.log('Set user name:', this.userProfile.name)
        }
        
        // Get shop info - use the first shop for profile display
        const shopsResponse = await shopsAPI.getAll()
        console.log('Shops response:', shopsResponse)
        
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          const shop = shopsResponse.data[0]
          console.log(`Loading profile for shop ${shop.id} (${shop.name})`)
          console.log('Shop data:', shop)
          
          this.userProfile.shop_name = shop.name || ''
          this.userProfile.email = shop.email || ''
          this.userProfile.phone = shop.phone_number || ''
          console.log('Set shop data:', { 
            shop_name: this.userProfile.shop_name, 
            email: this.userProfile.email,
            phone: this.userProfile.phone 
          })
        }
        
        console.log('Final userProfile:', this.userProfile)
      } catch (error) {
        console.error('Error loading user profile:', error)
      }
    },
    
    async updateUserProfile() {
      this.isUpdatingProfile = true
      try {
        // Update shop information - use the first shop for profile updates
        const shopsResponse = await shopsAPI.getAll()
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          const shopId = shopsResponse.data[0].id
          console.log(`Updating profile for shop ${shopId} (${shopsResponse.data[0].name})`)
          await shopsAPI.update(shopId, {
            name: this.userProfile.shop_name,
            email: this.userProfile.email,
            phone_number: this.userProfile.phone
          })
          
          alert('Profile updated successfully!')
        }
      } catch (error) {
        console.error('Error updating profile:', error)
        alert('Error updating profile: ' + (error.response?.data?.message || error.message || 'Unknown error'))
      } finally {
        this.isUpdatingProfile = false
      }
    },
    
    getBotTypeIcon(botType) {
      const icons = {
        'customer-support': 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
        'sales': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        'marketing': 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z',
        'general': 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
      };
      return icons[botType] || icons['general'];
    },
    
    getBotTypeColor(botType) {
      const colors = {
        'customer-support': 'from-blue-400 to-blue-600',
        'sales': 'from-green-400 to-green-600',
        'marketing': 'from-purple-400 to-purple-600',
        'general': 'from-gray-400 to-gray-600'
      };
      return colors[botType] || colors['general'];
    },
    
    getBotTypeName(botType) {
      const names = {
        'customer-support': 'Customer Support',
        'sales': 'Sales',
        'marketing': 'Marketing',
        'general': 'General'
      };
      return names[botType] || 'General';
    },
    
    getKeywordCount(bot) {
      return bot.keywords ? bot.keywords.length : 0;
    },
    
    getMessageCount(bot) {
      return bot.messages ? bot.messages.length : 0;
    },
    
    async toggleBotStatus(bot) {
      try {
        // Get the authenticated user's shops
        const shopsResponse = await shopsAPI.getAll();
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          // Find the shop that owns this bot
          const shop = shopsResponse.data.find(shop => 
            shop.bots && shop.bots.some(shopBot => shopBot.id === bot.id)
          );
          
          if (!shop) {
            alert('Error: Could not find the shop for this bot');
            return;
          }
          
          const shopId = shop.id;
          console.log(`Toggling bot ${bot.id} for shop ${shopId} (${shop.name})`);
          
          // Toggle bot status
          const response = await botAPI.toggleStatus(shopId, bot.id);
          
          if (response.success) {
            // Update the bot in the local array
            const botIndex = this.bots.findIndex(b => b.id === bot.id);
            if (botIndex !== -1) {
              this.bots[botIndex].status = this.bots[botIndex].status === 'active' ? 'inactive' : 'active';
            }
            
            alert(`Bot ${bot.status === 'active' ? 'stopped' : 'started'} successfully!`);
          } else {
            alert('Failed to toggle bot status');
          }
        }
      } catch (error) {
        console.error('Error toggling bot status:', error);
        alert('Error toggling bot status: ' + (error.response?.data?.message || error.message || 'Unknown error'));
      }
    },
    
    async startBot(bot) {
      if (!bot) return;
      
      try {
        // Get the authenticated user's shops
        const shopsResponse = await shopsAPI.getAll();
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          // Find the shop that owns this bot
          const shop = shopsResponse.data.find(shop => 
            shop.bots && shop.bots.some(shopBot => shopBot.id === bot.id)
          );
          
          if (!shop) {
            alert('Error: Could not find the shop for this bot');
            return;
          }
          
          const shopId = shop.id;
          console.log(`Starting bot ${bot.id} for shop ${shopId} (${shop.name})`);
          
          // Start the bot using the new API endpoint
          const response = await botAPI.startBot(shopId, bot.id);
          
          if (response.success) {
            // Update the bot in the local array
            const botIndex = this.bots.findIndex(b => b.id === bot.id);
            if (botIndex !== -1) {
              this.bots[botIndex].status = 'active';
            }
            
            // Update the selected bot status
            if (this.selectedBotForQr && this.selectedBotForQr.id === bot.id) {
              this.selectedBotForQr.status = {
                bot_status: 'active',
                has_session: true,
                session_status: 'connecting',
                is_connected: false,
                qr_code_available: false
              };
            }
            
            // Start polling for QR code updates
            this.startQrCodePolling(shopId, bot.id);
            
            alert('Bot started successfully! QR code will be generated shortly.');
          } else {
            alert('Failed to start bot: ' + (response.message || 'Unknown error'));
          }
        }
      } catch (error) {
        console.error('Error starting bot:', error);
        alert('Error starting bot: ' + (error.response?.data?.message || error.message || 'Unknown error'));
      }
    },
    
    openEditBotDialog(bot) {
      // Populate edit form with bot data
      this.editBot = {
        id: bot.id,
        name: this.getBotTypeName(bot.bot_type), // Use bot type name as display name
        phoneNumber: '', // Not stored in bot, will be empty
        description: bot.description || '',
        type: bot.bot_type,
        status: bot.status
      };
      this.showEditBotDialog = true;
    },
    
    async updateBot() {
      // Validate form
      if (!this.editBot.description || !this.editBot.type) {
        alert('Please fill in all required fields');
        return;
      }

      this.isEditingBot = true;

      try {
        // Get the authenticated user's shops
        const shopsResponse = await shopsAPI.getAll();
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          // Find the shop that owns this bot
          const shop = shopsResponse.data.find(shop => 
            shop.bots && shop.bots.some(shopBot => shopBot.id === this.editBot.id)
          );
          
          if (!shop) {
            alert('Error: Could not find the shop for this bot');
            return;
          }
          
          const shopId = shop.id;
          console.log(`Updating bot ${this.editBot.id} for shop ${shopId} (${shop.name})`);
          
          // Prepare bot data for API
          const botData = {
            bot_type: this.editBot.type,
            description: this.editBot.description,
            status: this.editBot.status
          };

          // Update the bot via API
          const response = await botAPI.update(shopId, this.editBot.id, botData);
          
          if (response.success) {
            // Update the bot in the local array
            const botIndex = this.bots.findIndex(b => b.id === this.editBot.id);
            if (botIndex !== -1) {
              this.bots[botIndex].bot_type = this.editBot.type;
              this.bots[botIndex].description = this.editBot.description;
              this.bots[botIndex].status = this.editBot.status;
            }
            
            // Close dialog and reset form
            this.showEditBotDialog = false;
            this.resetEditBotForm();
            
            // Show success message
            alert('Bot updated successfully!');
          } else {
            alert('Failed to update bot: ' + (response.message || 'Unknown error'));
          }
        }
      } catch (error) {
        console.error('Error updating bot:', error);
        alert('Error updating bot: ' + (error.response?.data?.message || error.message || 'Unknown error'));
      } finally {
        this.isEditingBot = false;
      }
    },
    
    resetEditBotForm() {
      this.editBot = {
        id: null,
        name: '',
        phoneNumber: '',
        description: '',
        type: 'customer-support',
        status: 'active'
      };
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    
    editKeyword(keywordData) {
      console.log('🔧 [EDIT] Original keyword data:', keywordData);
      console.log('🔧 [EDIT] Message type from keywordData:', keywordData.messageType);
      console.log('🔧 [EDIT] Response from keywordData:', keywordData.response);
      console.log('🔧 [EDIT] Media URL from keywordData:', keywordData.mediaUrl);
      
      // Use the enhanced data structure that now includes all the details
      let mediaUrl = keywordData.mediaUrl || '';
      let mediaCaption = keywordData.mediaCaption || '';
      let messageText = keywordData.additionalText || keywordData.response || '';
      let includeText = keywordData.includeText || false;
      
      // For text messages, use the response as the message text
      if (keywordData.messageType === 'text') {
        messageText = keywordData.response || '';
        includeText = false;
      }
      
      // Ensure messageType is properly set
      let messageType = keywordData.messageType || 'text';
      
      // If we have a mediaUrl but messageType is text, it might be an image/video
      if (mediaUrl && messageType === 'text') {
        // Try to determine type from URL or fullMessageData
        if (keywordData.fullMessageData && keywordData.fullMessageData.type) {
          messageType = keywordData.fullMessageData.type;
        } else if (mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          messageType = 'image';
        } else if (mediaUrl.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i)) {
          messageType = 'video';
        } else if (mediaUrl.match(/\.(mp3|wav|ogg|m4a)$/i)) {
          messageType = 'audio';
        } else if (mediaUrl.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i)) {
          messageType = 'document';
        }
      }
      
      // Populate edit form with current data
      this.editKeywordData.botId = keywordData.botId;
      this.editKeywordData.messageId = keywordData.messageId;
      this.editKeywordData.keywords = [...keywordData.keywords]; // Copy keywords array
      this.editKeywordData.response = keywordData.response;
      this.editKeywordData.originalKeywords = [...keywordData.keywords]; // Keep original for comparison
      this.editKeywordData.messageType = messageType;
      this.editKeywordData.messageText = messageText;
      this.editKeywordData.mediaUrl = mediaUrl;
      this.editKeywordData.mediaCaption = mediaCaption;
      this.editKeywordData.includeText = includeText;
      this.editKeywordData.isContain = keywordData.isContain !== undefined ? keywordData.isContain : true; // Default to true for backward compatibility
      this.editKeywordData.matchingMode = keywordData.matchingMode || 'exact'; // Default to exact for backward compatibility
      this.editKeywordData.duration = keywordData.duration || 8; // Default to 8 seconds if not provided
      
      console.log('🔧 [EDIT] Populated edit form:', {
        keywordData,
        editKeywordData: this.editKeywordData,
        messageType: this.editKeywordData.messageType,
        mediaUrl: this.editKeywordData.mediaUrl,
        mediaCaption: this.editKeywordData.mediaCaption,
        includeText: this.editKeywordData.includeText,
        messageText: this.editKeywordData.messageText
      });
      
      this.showEditKeywordDialog = true
      
      // Force Vue to update the reactivity
      this.$forceUpdate();
      
      // Ensure the DOM is updated before checking the select value
      this.$nextTick(() => {
        console.log('🔧 [EDIT] After DOM update - messageType:', this.editKeywordData.messageType);
        console.log('🔧 [EDIT] Select element value:', document.querySelector('select[v-model="editKeywordData.messageType"]')?.value);
      });
    },
    
    getMessageTypeName(messageType) {
      const types = {
        'text': 'Text Message',
        'image': 'Image',
        'video': 'Video',
        'audio': 'Audio',
        'document': 'Document',
        'media': 'Media'
      }
      return types[messageType] || 'Text Message'
    },
    
    getMessageTypeColor(messageType) {
      const colors = {
        'text': 'bg-green-100 text-green-800',
        'image': 'bg-blue-100 text-blue-800',
        'video': 'bg-purple-100 text-purple-800',
        'audio': 'bg-orange-100 text-orange-800',
        'document': 'bg-red-100 text-red-800'
      }
      return colors[messageType] || 'bg-gray-100 text-gray-800'
    },
    
    getMessageTypeDotColor(messageType) {
      const colors = {
        'text': 'bg-green-400',
        'image': 'bg-blue-400',
        'video': 'bg-purple-400',
        'audio': 'bg-orange-400',
        'document': 'bg-red-400'
      }
      return colors[messageType] || 'bg-gray-400'
    },
    
    addEditKeywordTag() {
      const keyword = this.currentEditKeywordInput.trim()
      if (keyword && !this.editKeywordData.keywords.includes(keyword)) {
        this.editKeywordData.keywords.push(keyword)
        this.currentEditKeywordInput = ''
      }
    },
    
    removeEditKeywordTag(index) {
      this.editKeywordData.keywords.splice(index, 1)
    },
    
    handleEditBackspace() {
      if (this.currentEditKeywordInput === '' && this.editKeywordData.keywords.length > 0) {
        this.editKeywordData.keywords.pop()
      }
    },
    
    async updateKeyword() {
      // Validate form based on message type
      if (!this.editKeywordData.botId || this.editKeywordData.keywords.length === 0) {
        alert('Please select a bot and add at least one keyword')
        return
      }

      if (this.editKeywordData.messageType === 'text' && !this.editKeywordData.messageText.trim()) {
        alert('Please enter a text message')
        return
      }

      if (this.editKeywordData.messageType !== 'text' && !this.editKeywordData.mediaUrl.trim()) {
        alert('Please enter a media URL')
        return
      }

      // If media type with includeText is selected, validate text
      if (this.editKeywordData.messageType !== 'text' && this.editKeywordData.includeText && !this.editKeywordData.messageText.trim()) {
        alert('Please enter additional text message when including text with media')
        return
      }
      
      this.isEditingKeyword = true
      
      try {
        // Get shop ID first
        const shopsResponse = await shopsAPI.getAll()
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          const shopId = shopsResponse.data[0].id
          
          // Prepare keyword update data in the correct format
          const keywordUpdateData = {
            keywords: this.editKeywordData.keywords,
            message_type: this.editKeywordData.messageType,
            message_text: this.editKeywordData.messageText || null,
            images: this.editKeywordData.messageType === 'image' ? [this.editKeywordData.mediaUrl] : null,
            is_contain: this.editKeywordData.isContain,
            status: 'active',
            duration: this.editKeywordData.duration
          }
          
          console.log('📤 [UPDATE_KEYWORD] Sending update data:', keywordUpdateData);
          console.log('📤 [UPDATE_KEYWORD] Duration value:', this.editKeywordData.duration);
          
          // Update the keyword and message using the new endpoint
          await botAPI.updateKeyword(shopId, this.editKeywordData.botId, this.editKeywordData.messageId, keywordUpdateData)
          
          // Refresh bots to update the table
          await this.loadBots()
          
          // Close dialog and reset form
          this.showEditKeywordDialog = false
          this.editKeywordData = {
            botId: null,
            messageId: null,
            keywords: [],
            response: '',
            originalKeywords: [],
            messageType: 'text',
            messageText: '',
            mediaUrl: '',
            mediaCaption: '',
            includeText: false,
            isContain: true, // Reset to default
            matchingMode: 'exact', // Reset to default
            duration: 8 // Reset to default
          }
          
          alert('Keywords updated successfully!')
        }
      } catch (error) {
        console.error('Error updating keywords:', error)
        alert('Error updating keywords: ' + (error.response?.data?.message || error.message || 'Unknown error'))
      } finally {
        this.isEditingKeyword = false
      }
    },
    
    async deleteKeyword(keywordData) {
      const keywordCount = keywordData.keywords.length
      const keywordList = keywordData.keywords.join(', ')
      
      if (!confirm(`Are you sure you want to delete ${keywordCount} keyword(s): "${keywordList}"?\n\nThis will remove all keywords that trigger the response: "${keywordData.response}"`)) {
        return
      }
      
      try {
        // Get shop ID first
        const shopsResponse = await shopsAPI.getAll()
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          const shopId = shopsResponse.data[0].id
          
          // Remove all keywords in this group
          for (const keyword of keywordData.keywords) {
            const response = await botAPI.removeKeyword(shopId, keywordData.botId, {
              keyword: keyword
            })
            
            if (!response.success) {
              alert(`Failed to delete keyword "${keyword}": ${response.message || 'Unknown error'}`)
              return
            }
          }
          
          // Refresh bots to update the table
          await this.loadBots()
          alert(`${keywordCount} keyword(s) deleted successfully!`)
        }
      } catch (error) {
        console.error('Error deleting keywords:', error)
        alert('Error deleting keywords: ' + (error.response?.data?.message || error.message || 'Unknown error'))
      }
    },

    // Helper method for QR code generation
    getRandomQRCell() {
      return Math.random() > 0.5
    },

    // Helper method for status colors
    getStatusColor(status) {
      const colors = {
        'connected': 'bg-green-500',
        'connecting': 'bg-blue-500',
        'disconnected': 'bg-gray-500',
        'error': 'bg-red-500',
        'no_session': 'bg-gray-400'
      }
      return colors[status] || 'bg-gray-400'
    },

    // Helper method for status text
    getStatusText(status) {
      const texts = {
        'connected': 'Connected',
        'connecting': 'Connecting...',
        'disconnected': 'Disconnected',
        'error': 'Error',
        'no_session': 'No Session'
      }
      return texts[status] || 'Unknown'
    },

    // QR Code polling method with enhanced error handling
    async startQrCodePolling(shopId, botId) {
      let attempts = 0;
      const maxAttempts = 30; // 60 seconds total (30 attempts * 2 seconds)
      let isPolling = true;
      let consecutiveErrors = 0;
      const maxConsecutiveErrors = 3;
      
      // Store the polling function reference so we can stop it
      this.currentPollingFunction = null;
      
      console.log(`Starting QR code polling for bot ${botId}, max attempts: ${maxAttempts}`);
      
      const poll = async () => {
        if (!isPolling || attempts >= maxAttempts) {
          if (attempts >= maxAttempts) {
            console.log(`QR code polling timeout after ${maxAttempts} attempts`);
            // Update status to show timeout
            if (this.selectedBotForQr && this.selectedBotForQr.id === botId) {
              this.selectedBotForQr.status = {
                ...this.selectedBotForQr.status,
                session_status: 'error',
                error_message: 'QR code generation timeout - please try again'
              };
            }
          }
          return;
        }
        
        try {
          const statusResponse = await botAPI.getBotStatus(shopId, botId);
          consecutiveErrors = 0; // Reset error counter on success
          
          if (statusResponse.success) {
            const status = statusResponse.data;
            console.log(`Poll attempt ${attempts + 1}: Status - ${status.session_status}, QR Available: ${status.qr_code_available}`);
            
            // Update the selected bot status
            if (this.selectedBotForQr && this.selectedBotForQr.id === botId) {
              console.log('🔍 [QR_POLL] Updating bot status:', status);
              console.log('🔍 [QR_POLL] QR code path:', status.qr_code_path);
              this.selectedBotForQr.status = status;
            }
            
            // If QR code is available, continue polling to detect connection
            if (status.qr_code_available && !status.is_connected) {
              console.log('QR code available, waiting for phone connection...');
              // Continue polling to detect when phone connects
            }
            
            // If bot is connected, show success and auto-close after delay
            if (status.is_connected) {
              console.log('Bot connected successfully!', status);
              
              // Update the selected bot status
              if (this.selectedBotForQr && this.selectedBotForQr.id === botId) {
                this.selectedBotForQr.status = status;
              }
              
              // Show success message and auto-close dialog after 3 seconds
              setTimeout(() => {
                if (this.selectedBotForQr && this.selectedBotForQr.id === botId) {
                  this.showQrCodeDialog = false;
                  this.selectedBotForQr = null;
                  this.stopQrCodePolling();
                  
                  // Show success notification
                  this.$nextTick(() => {
                    // You can add a toast notification here if you have one
                    console.log('QR dialog closed automatically after successful connection');
                  });
                }
              }, 3000);
              
              isPolling = false;
              return;
            }
            
            // If there's an error, stop polling
            if (status.session_status === 'error') {
              console.log(`Bot encountered an error: ${status.error_message}`);
              isPolling = false;
              return;
            }
          }
        } catch (error) {
          consecutiveErrors++;
          console.error(`Error polling QR code status (attempt ${attempts + 1}, consecutive errors: ${consecutiveErrors}):`, error);
          
          // Stop polling if too many consecutive errors
          if (consecutiveErrors >= maxConsecutiveErrors) {
            console.log(`Too many consecutive errors (${consecutiveErrors}), stopping polling`);
            isPolling = false;
            
            if (this.selectedBotForQr && this.selectedBotForQr.id === botId) {
              this.selectedBotForQr.status = {
                ...this.selectedBotForQr.status,
                session_status: 'error',
                error_message: 'Connection error - please check your network and try again'
              };
            }
            return;
          }
        }
        
        attempts++;
        // Poll every 2 seconds to reduce server load
        if (isPolling) {
          this.currentPollingFunction = setTimeout(poll, 2000);
        }
      };
      
      poll();
    },

    // Stop QR code polling
    stopQrCodePolling() {
      if (this.currentPollingFunction) {
        clearTimeout(this.currentPollingFunction);
        this.currentPollingFunction = null;
        console.log('QR code polling stopped');
      }
    },

    // Close QR dialog with cleanup
    closeQrDialog() {
      this.showQrCodeDialog = false;
      this.selectedBotForQr = null;
      this.stopQrCodePolling();
      console.log('QR dialog closed manually');
    },

    // Retry QR code generation
    async retryQrCodeGeneration(bot) {
      console.log(`Retrying QR code generation for bot ${bot.id}`);
      
      // Stop current polling
      this.stopQrCodePolling();
      
      // Reset bot status
      this.selectedBotForQr.status = {
        bot_status: 'active',
        has_session: true,
        session_status: 'connecting',
        is_connected: false,
        qr_code_available: false,
        error_message: null
      };
      
      try {
        const shopsResponse = await shopsAPI.getAll();
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          const shopId = shopsResponse.data[0].id;
          
          // Restart the bot
          const startResponse = await botAPI.startBot(shopId, bot.id);
          if (startResponse.success) {
            console.log('Bot restarted successfully, starting polling...');
            this.startQrCodePolling(shopId, bot.id);
          } else {
            console.error('Failed to restart bot:', startResponse.message);
            this.selectedBotForQr.status.session_status = 'error';
            this.selectedBotForQr.status.error_message = startResponse.message || 'Failed to restart bot';
          }
        }
      } catch (error) {
        console.error('Error retrying QR code generation:', error);
        this.selectedBotForQr.status.session_status = 'error';
        this.selectedBotForQr.status.error_message = 'Retry failed - please try again';
      }
    },
    
    // QR Code image handlers
    handleQrCodeError(event) {
      console.error('❌ QR Code image failed to load:', event.target.src);
      // You could show a fallback or error message here
    },
    
    handleQrCodeLoad(event) {
      console.log('✅ QR Code image loaded successfully:', event.target.src);
    },
    
    /**
     * Handle browser back/forward navigation
     */
    handlePopState(event) {
      const urlParams = new URLSearchParams(window.location.search)
      const pageParam = urlParams.get('page')
      if (pageParam && this.navigationItems.some(item => item.name === pageParam)) {
        this.activePage = pageParam
      } else if (!pageParam) {
        // Default to dashboard if no page parameter
        this.activePage = 'dashboard'
      }
    }
  },
  watch: {
    activePage(newPage) {
      if (newPage === 'settings') {
        this.loadUserProfile()
      }
    },
    showQrCodeDialog(newValue) {
      if (!newValue) {
        // Stop polling when dialog is closed
        this.stopQrCodePolling()
        // Clean up selected bot
        this.selectedBotForQr = null
      }
    }
  },
  mounted() {
    // Check authentication first
    const authToken = localStorage.getItem('auth_token')
    if (!authToken) {
      console.log('No auth token found, redirecting to auth page')
      this.$router.push('/auth')
      return
    }
    
    // Authentication check passed
    this.isCheckingAuth = false
    
    // Get user info from localStorage
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      this.userName = userData.name || 'User'
      this.userEmail = userData.email || 'user@example.com'
    }
    
    // Add click outside handler for bot menus
    document.addEventListener('click', this.handleClickOutside)
    
    // Load bots when component is mounted
    this.loadBots()
    this.loadUserProfile()
    
    // Check for page parameter in URL on initial load
    const urlParams = new URLSearchParams(window.location.search)
    const pageParam = urlParams.get('page')
    if (pageParam && this.navigationItems.some(item => item.name === pageParam)) {
      this.activePage = pageParam
    }
    
    // Listen for browser back/forward navigation
    window.addEventListener('popstate', this.handlePopState)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
    window.removeEventListener('popstate', this.handlePopState)
  }
}
</script>

<style scoped>
/* Custom scrollbar for sidebar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth animations */
* {
  transition: all 0.2s ease-in-out;
}
</style> 