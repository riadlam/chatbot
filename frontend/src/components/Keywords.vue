<template>
  <div class="w-full h-full flex flex-col">
    <!-- Header with Add Keyword Button -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 sm:gap-12 lg:gap-16 w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4 mb-8">
      <div class="flex-1">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Keywords</h2>
        <p class="text-gray-600 mt-1">Manage automated responses for your bots</p>
      </div>
      <button 
        @click="openAddKeywordDialog"
        class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 flex-shrink-0"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        <span>Add Keyword</span>
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="px-4 sm:px-6 lg:px-8 pb-4 flex flex-col sm:flex-row gap-4 w-full mb-8">
      <div class="relative flex-1">
        <input 
          v-model="keywordSearch" 
          type="text" 
          placeholder="Search keywords or responses..." 
          class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-400"
        >
        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <select 
        v-model="selectedBotFilter" 
        class="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-700"
      >
        <option value="">All Bots</option>
        <option v-for="bot in bots" :key="bot.id" :value="bot.id">
          {{ getBotTypeName(bot.bot_type) }}
        </option>
      </select>
    </div>

    <!-- Keywords Table -->
    <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden relative flex-1 min-h-[400px] w-full">
      <!-- Table Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">
              <span v-if="isLoadingKeywords" class="inline-block w-24 h-4 bg-gray-200 rounded animate-pulse"></span>
              <span v-else>{{ filteredKeywords.length }} {{ filteredKeywords.length === 1 ? 'keyword' : 'keywords' }} found</span>
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="refreshKeywords" class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="isLoadingKeywords" class="overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 300px);">
        <table class="w-full table-fixed">
          <thead class="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Bot</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Keywords</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/6">Response</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Matching</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="i in 5" :key="i" class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-6 py-4 whitespace-nowrap w-1/6">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-200 rounded-lg animate-pulse mr-3"></div>
                  <div class="flex-1">
                    <div class="w-20 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div class="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 w-1/6">
                <div class="flex flex-wrap gap-1">
                  <div class="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  <div class="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  <div class="w-14 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </td>
              <td class="px-6 py-4 w-2/6">
                <div class="w-48 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div class="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap w-1/12">
                <div class="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap w-1/12">
                <div class="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-1/12">
                <div class="flex items-center justify-end space-x-2">
                  <div class="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div class="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No Keywords State -->
      <div v-else-if="!isLoadingKeywords && filteredKeywords.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-1">No keywords found</h3>
        <p class="text-gray-500 mb-4">Get started by adding your first keyword response</p>
        <button 
          @click="openAddKeywordDialog"
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 mx-auto"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <span>Add Keyword</span>
        </button>
      </div>

            <!-- Keywords Table -->
      <div v-else-if="!isLoadingKeywords" class="overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 300px);">
        <table class="w-full table-fixed">
          <thead class="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Bot</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Keywords</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/6">Response</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Matching</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="keywordData in filteredKeywords" :key="`${keywordData.botId}-${keywordData.response}`" class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-6 py-4 whitespace-nowrap w-1/6">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gradient-to-br rounded-lg flex items-center justify-center mr-3" :class="getBotTypeColor(keywordData.botType)">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ getBotTypeName(keywordData.botType) }}</div>
                    <div class="text-xs text-gray-500">{{ keywordData.botDescription || 'No description' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 w-1/6">
                <div class="flex flex-wrap gap-1">
                  <span v-for="(keyword, idx) in keywordData.keywords.slice(0, 3)" :key="idx" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {{ keyword }}
                  </span>
                  <span v-if="keywordData.keywords.length > 3" class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{{ keywordData.keywords.length - 3 }} more
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 w-2/6">
                <div class="text-sm text-gray-900 truncate">{{ keywordData.messageType === 'text' ? keywordData.response : `${keywordData.messageType.charAt(0).toUpperCase() + keywordData.messageType.slice(1)}: ${keywordData.response}` }}</div>
                <div class="text-xs text-gray-500">{{ keywordData.messageType === 'text' ? 'Text' : 'Media' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap w-1/12">
                <span class="px-2 py-1 text-xs rounded-full" :class="keywordData.is_contain ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'">
                  {{ keywordData.is_contain ? 'Contains' : 'Exact' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap w-1/12">
                <span class="px-2 py-1 text-xs rounded-full" :class="keywordData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ keywordData.status === 'active' ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-1/12">
                <div class="flex items-center justify-end space-x-2">
                  <button @click="editKeyword(keywordData)" class="text-blue-600 hover:text-blue-900">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button @click="confirmDeleteKeyword(keywordData)" class="text-red-600 hover:text-red-900">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Keyword Dialog -->
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
                <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">{{ isEditingKeyword ? 'Edit' : 'Add New' }} Keyword</h3>
                <p class="text-gray-500 text-sm">Configure automated responses for your bots</p>
              </div>
            </div>
            <button @click="closeKeywordDialog" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors duration-200">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Dialog Content -->
        <div class="px-8 py-2 flex-1 overflow-y-auto custom-scrollbar">
          <div class="space-y-6">
            <!-- Bot Selection -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 flex items-center">
                <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                Select Bot
              </label>
              <select 
                v-model="newKeyword.botId" 
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                :class="{'border-red-300': !newKeyword.botId}"
              >
                <option value="" disabled>Select a bot</option>
                <option v-for="bot in bots" :key="bot.id" :value="bot.id">
                  {{ getBotTypeName(bot.bot_type) }}
                </option>
              </select>
                          <div v-if="!newKeyword.botId" class="text-red-500 text-xs mt-1">
                Please select a bot
              </div>
            </div>

            <!-- Keyword Tags and Matching Mode -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="block text-sm font-semibold text-gray-700 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                  Keywords
                </label>
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-gray-500">Matching:</span>
                  <select v-model="newKeyword.matchingMode" class="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <option value="contains">Contains any word</option>
                    <option value="exact">Exact phrase</option>
                  </select>
                </div>
              </div>
              
              <div class="flex flex-wrap gap-2 p-3 border-2 border-gray-200 rounded-xl min-h-12" :class="{'border-red-300': keywordTags.length === 0}">
                <span 
                  v-for="(tag, index) in keywordTags" 
                  :key="index"
                  class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {{ tag }}
                  <button 
                    @click="removeKeywordTag(index)" 
                    class="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
                <input
                  v-model="currentKeywordInput"
                  @keydown.enter.prevent="addKeywordTag"
                  @keydown.backspace="handleBackspace"
                  @keydown.space.prevent="addKeywordTag"
                  @keydown.comma.prevent="addKeywordTag"
                  type="text"
                  placeholder="Type and press Enter or Space to add keywords"
                  class="flex-1 min-w-[200px] bg-transparent border-none focus:ring-0 focus:outline-none text-sm placeholder-gray-400"
                />
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ newKeyword.matchingMode === 'exact' ? 
                   'Enter exact phrases to match (e.g., "hello world" will only match "hello world")' : 
                   'Enter words to match (e.g., "hello world" will match messages containing "hello" or "world")' }}
              </div>
              <div v-if="keywordTags.length === 0" class="text-red-500 text-xs">
                Please add at least one keyword
              </div>
            </div>

            <!-- Message Type -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 flex items-center">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                </svg>
                Response Type
              </label>
              <div class="grid grid-cols-2 gap-4">
                <button 
                  v-for="type in messageTypes" 
                  :key="type.value"
                  @click="newKeyword.messageType = type.value"
                  class="p-4 border-2 rounded-xl text-center transition-all duration-200"
                  :class="newKeyword.messageType === type.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'"
                >
                  <div class="flex flex-col items-center">
                    <svg 
                      v-if="type.value === 'text'"
                      class="w-6 h-6 mb-2" 
                      :class="newKeyword.messageType === type.value ? 'text-blue-600' : 'text-gray-500'"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
                    </svg>
                    <svg 
                      v-else-if="type.value === 'image'"
                      class="w-6 h-6 mb-2" 
                      :class="newKeyword.messageType === type.value ? 'text-blue-600' : 'text-gray-500'"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <svg 
                      v-else-if="type.value === 'video'"
                      class="w-6 h-6 mb-2" 
                      :class="newKeyword.messageType === type.value ? 'text-blue-600' : 'text-gray-500'"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    <svg 
                      v-else-if="type.value === 'document'"
                      class="w-6 h-6 mb-2" 
                      :class="newKeyword.messageType === type.value ? 'text-blue-600' : 'text-gray-500'"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span class="text-sm font-medium">{{ type.label }}</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Message Content -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 flex items-center">
                <svg class="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Response {{ newKeyword.messageType !== 'text' ? 'Caption' : 'Message' }}
              </label>
              
              <template v-if="newKeyword.messageType === 'text'">
                <textarea
                  v-model="newKeyword.messageText"
                  rows="3"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter the response message..."
                ></textarea>
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>Automated response that will be sent when this keyword is detected</span>
                  <span>{{ newKeyword.messageText.length }}/500</span>
                </div>
              </template>
              
              <template v-else-if="newKeyword.messageType === 'image'">
                <div class="space-y-4">
                  <!-- Image Upload Section -->
                  <div class="space-y-3">
                    <label class="block text-sm font-semibold text-gray-700 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      Upload Images (Multiple)
                    </label>
                    
                    <!-- Image Upload Area -->
                    <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                      <input
                        ref="imageInput"
                        type="file"
                        multiple
                        accept="image/*"
                        @change="handleImageUpload"
                        class="hidden"
                      >
                      <div @click="$refs.imageInput.click()" class="cursor-pointer">
                        <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                        </svg>
                        <p class="text-sm text-gray-600 mb-2">Click to upload images or drag and drop</p>
                        <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                      </div>
                    </div>
                    
                                         <!-- Uploaded Images Preview -->
                     <div v-if="newKeyword.images.length > 0 || newKeyword.uploadedImages.length > 0" class="space-y-3">
                       <h4 class="text-sm font-medium text-gray-700">
                         Images ({{ newKeyword.images.length + newKeyword.uploadedImages.length }})
                       </h4>
                       <div class="grid grid-cols-2 gap-3">
                         <!-- New uploaded images -->
                         <div 
                           v-for="(image, index) in newKeyword.images" 
                           :key="`new-${index}`"
                           class="relative group"
                         >
                           <img 
                             :src="image.preview" 
                             :alt="`Image ${index + 1}`"
                             class="w-full h-24 object-cover rounded-lg border border-gray-200"
                           >
                           <button
                             @click="removeImage(index)"
                             class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                           >
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                             </svg>
                           </button>
                           <div class="text-xs text-gray-500 mt-1 truncate">{{ image.file.name }}</div>
                         </div>
                         
                         <!-- Existing uploaded images -->
                         <div 
                           v-for="(imageUrl, index) in newKeyword.uploadedImages" 
                           :key="`existing-${index}`"
                           class="relative group"
                         >
                           <img 
                             :src="imageUrl" 
                             :alt="`Existing Image ${index + 1}`"
                             class="w-full h-24 object-cover rounded-lg border border-gray-200"
                           >
                           <button
                             @click="removeExistingImage(index)"
                             class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                           >
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                             </svg>
                           </button>
                           <div class="text-xs text-gray-500 mt-1 truncate">Existing Image {{ index + 1 }}</div>
                         </div>
                       </div>
                     </div>
                  </div>
                  
                  <!-- Additional Text Option -->
                  <div class="flex items-center space-x-2">
                    <input
                      id="includeText"
                      v-model="newKeyword.includeText"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    >
                    <label for="includeText" class="text-sm text-gray-700">Include additional text message</label>
                  </div>
                  
                  <!-- Additional Text for Images -->
                  <div v-if="newKeyword.includeText" class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                      Additional Text Message
                    </label>
                    <textarea
                      v-model="newKeyword.messageText"
                      rows="3"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none placeholder-gray-400"
                      placeholder="Enter additional text to send with the images..."
                    ></textarea>
                    <div class="flex justify-between items-center text-xs text-gray-500">
                      <span>Additional text to send with the images</span>
                      <span>{{ newKeyword.messageText.length }}/500</span>
                    </div>
                  </div>
                </div>
              </template>
              
              <template v-else>
                <div class="space-y-2">
                  <input
                    v-model="newKeyword.mediaUrl"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    :placeholder="`Enter ${newKeyword.messageType} URL...`"
                  >
                  <div class="flex items-center space-x-2">
                    <input
                      id="includeText"
                      v-model="newKeyword.includeText"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    >
                    <label for="includeText" class="text-sm text-gray-700">Include text with media</label>
                  </div>
                  <textarea
                    v-if="newKeyword.includeText"
                    v-model="newKeyword.messageText"
                    rows="2"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter additional text..."
                  ></textarea>
                  
                  <!-- Additional Text for Media -->
                  <div v-if="newKeyword.includeText" class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                      Additional Text Message
                    </label>
                    <textarea
                      v-model="newKeyword.messageText"
                      rows="3"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none placeholder-gray-400"
                      placeholder="Enter additional text to send with the media..."
                    ></textarea>
                    <div class="flex justify-between items-center text-xs text-gray-500">
                      <span>Additional text to send with the media</span>
                      <span>{{ newKeyword.messageText.length }}/500</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Status -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 flex items-center">
                <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                Status
              </label>
              <div class="flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input
                    v-model="newKeyword.status"
                    type="radio"
                    value="active"
                    class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-gray-700">Active</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    v-model="newKeyword.status"
                    type="radio"
                    value="inactive"
                    class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-gray-700">Inactive</span>
                </label>
              </div>
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
        <div class="p-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            @click="closeKeywordDialog"
            class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            @click="saveKeyword"
            :disabled="isSaving"
            class="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
          >
            <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSaving ? 'Saving...' : (isEditingKeyword ? 'Update' : 'Add') }} Keyword
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { keywordsAPI, shopsAPI } from '../services/api.js'

export default {
  name: 'Keywords',
  props: {
    bots: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      keywordSearch: '',
      selectedBotFilter: '',
      showAddKeywordDialog: false,
      isLoadingKeywords: false,
      isEditingKeyword: false,
      newKeyword: {
        botId: '',
        keyword: '',
        messageType: 'text',
        messageText: '',
        mediaUrl: '',
        includeText: false,
        isContain: true,
        matchingMode: 'contains',
        status: 'active',
        duration: 8, // Default duration in seconds
        images: [], // Array to store uploaded images
        uploadedImages: [] // Array to store image URLs after upload
      },
      keywordTags: [],
      currentKeywordInput: '',
      keywords: [], // This will store the list of keywords from the API
      isSaving: false, // Track if a keyword is being saved
      editingKeywordId: null, // Track which keyword is being edited
      messageTypes: [
        { value: 'text', label: 'Text', icon: 'svg' },
        { value: 'image', label: 'Image', icon: 'svg' },
        { value: 'video', label: 'Video', icon: 'svg' },
        { value: 'document', label: 'Document', icon: 'svg' },
      ]
    }
  },
  

  
  computed: {
    filteredKeywords() {
      let filtered = this.keywords;
      
      // Filter by search term
      if (this.keywordSearch) {
        const searchTerm = this.keywordSearch.toLowerCase();
        filtered = filtered.filter(keywordData => 
          keywordData.keywords.some(kw => kw.toLowerCase().includes(searchTerm)) ||
          keywordData.response.toLowerCase().includes(searchTerm)
        );
      }
      
      // Filter by bot
      if (this.selectedBotFilter) {
        filtered = filtered.filter(keywordData => 
          keywordData.botId === this.selectedBotFilter
        );
      }
      
      return filtered;
    }
  },
  methods: {
    openAddKeywordDialog() {
      this.isEditingKeyword = false;
      this.showAddKeywordDialog = true;
    },
    closeKeywordDialog() {
      this.showAddKeywordDialog = false;
      this.resetNewKeywordForm();
    },
    resetNewKeywordForm() {
      this.newKeyword = {
        botId: '',
        keyword: '',
        messageType: 'text',
        messageText: '',
        mediaUrl: '',
        includeText: false,
        isContain: true,
        matchingMode: 'contains',
        status: 'active',
        duration: 8, // Default duration in seconds
        images: [],
        uploadedImages: []
      };
      this.keywordTags = [];
      this.currentKeywordInput = '';
      this.editingKeywordId = null;
      this.isEditingKeyword = false;
    },
    
    // Keyword tag management
    addKeywordTag() {
      const tag = this.currentKeywordInput.trim();
      if (tag && !this.keywordTags.includes(tag)) {
        this.keywordTags.push(tag);
      }
      this.currentKeywordInput = '';
    },
    
    removeKeywordTag(index) {
      this.keywordTags.splice(index, 1);
    },
    
    handleBackspace() {
      if (!this.currentKeywordInput && this.keywordTags.length > 0) {
        this.keywordTags.pop();
      }
    },
    
    // Bot and keyword utilities
    getBotTypeName(type) {
      const types = {
        'customer-support': 'Customer Support',
        'sales': 'Sales',
        'marketing': 'Marketing',
        'other': 'Other'
      };
      return types[type] || type;
    },
    
    getBotTypeColor(type) {
      const colors = {
        'customer-support': 'from-blue-500 to-blue-600',
        'sales': 'from-green-500 to-green-600',
        'marketing': 'from-purple-500 to-purple-600',
        'other': 'from-gray-500 to-gray-600'
      };
      return colors[type] || 'from-indigo-500 to-indigo-600';
    },
    
    // CRUD Operations
    async refreshKeywords() {
      try {
        this.isLoadingKeywords = true;
        
        // Get shop ID first
        const shopsResponse = await shopsAPI.getAll();
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          const shopId = shopsResponse.data[0].id;
          console.log('🔍 [REFRESH] Fetching keywords for shop:', shopId);
          
          const response = await keywordsAPI.getAll(shopId);
          this.keywords = response.data || [];
          
          console.log('🔍 [REFRESH] Keywords fetched:', this.keywords);
          
          // Log each keyword's structure
          this.keywords.forEach((keyword, index) => {
            console.log(`🔍 [REFRESH] Keyword ${index + 1}:`, {
              id: keyword.id,
              botId: keyword.botId,
              keywords: keyword.keywords,
              messageType: keyword.messageType,
              response: keyword.response,
              mediaCaption: keyword.mediaCaption,
              is_contain: keyword.is_contain
            });
          });
        } else {
          this.keywords = [];
          console.log('🔍 [REFRESH] No shops found');
        }
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
        this.keywords = [];
      } finally {
        this.isLoadingKeywords = false;
      }
    },
    
    editKeyword(keywordData) {
      console.log('🔍 [EDIT] Starting edit keyword with data:', keywordData);
      
      this.isEditingKeyword = true;
      this.editingKeywordId = keywordData.id;
      
      // Detect message type from the data
      let messageType = keywordData.messageType || 'text';
      let messageText = keywordData.response || '';
      let mediaUrl = '';
      let mediaCaption = '';
      let includeText = false;
      
      // Check if there's additional text in the data structure
      if (keywordData.additionalText && keywordData.additionalText.trim()) {
        messageText = keywordData.additionalText;
        includeText = true;
        console.log('🔍 [EDIT] Found additional text in data structure:', keywordData.additionalText);
      }
      
      // Check if includeText is explicitly set in the data
      if (keywordData.includeText !== undefined) {
        includeText = keywordData.includeText;
        console.log('🔍 [EDIT] Include text flag from data:', keywordData.includeText);
      }
      
      console.log('🔍 [EDIT] Response data:', keywordData.response);
      console.log('🔍 [EDIT] Message type from data:', keywordData.messageType);
      console.log('🔍 [EDIT] Text message extracted:', messageText);
      
      // If we have a messageType but it's not text, extract media info
      if (messageType !== 'text' && keywordData.response) {
        // Check if response contains URL
        const urlMatch = keywordData.response.match(/(https?:\/\/[^\s]+)/i);
        if (urlMatch) {
          mediaUrl = urlMatch[1];
        }
        
        // Check if response contains caption (after URL)
        const captionMatch = keywordData.response.match(/https?:\/\/[^\s]+[-\s]+(.+)/i);
        if (captionMatch) {
          mediaCaption = captionMatch[1].trim();
        }
        
        // For media types, analyze the response structure
        if (keywordData.response.startsWith(`${messageType.charAt(0).toUpperCase() + messageType.slice(1)}:`)) {
          // Extract additional text if any
          const textMatch = keywordData.response.match(/\nText:\s*(.+)/i);
          if (textMatch) {
            messageText = textMatch[1];
            includeText = true;
          } else {
            messageText = '';
          }
        }
        
        // Additional check: if there's any text content beyond the media URL and caption
        // This handles cases where additional text might be stored differently
        if (!includeText && keywordData.response) {
          // Remove the media URL and caption from the response
          let remainingText = keywordData.response;
          
          // Remove the media type prefix (e.g., "Image: http://...")
          remainingText = remainingText.replace(new RegExp(`^${messageType.charAt(0).toUpperCase() + messageType.slice(1)}:\\s*${mediaUrl}`, 'i'), '');
          
          // Remove caption if present
          if (mediaCaption) {
            remainingText = remainingText.replace(new RegExp(`[-\s]*${mediaCaption.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'), '');
          }
          
          // Remove any remaining "Text:" prefix
          remainingText = remainingText.replace(/^\s*Text:\s*/i, '');
          
          // Clean up whitespace
          remainingText = remainingText.trim();
          
          // If there's remaining text, it's additional text
          if (remainingText && remainingText.length > 0) {
            messageText = remainingText;
            includeText = true;
            console.log('🔍 [EDIT] Found additional text:', remainingText);
          }
        }
        
        // Final check: if the response contains any meaningful text beyond just the media info
        if (!includeText && keywordData.response) {
          // Check if response contains more than just the media URL
          const mediaPattern = new RegExp(`^${messageType.charAt(0).toUpperCase() + messageType.slice(1)}:\\s*${mediaUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
          const isOnlyMedia = mediaPattern.test(keywordData.response.trim());
          
          if (!isOnlyMedia) {
            // There's additional content, extract it
            const parts = keywordData.response.split(/\n/);
            if (parts.length > 1) {
              // Take everything after the first line (which contains media info)
              const additionalContent = parts.slice(1).join('\n').trim();
              if (additionalContent && additionalContent.length > 0) {
                messageText = additionalContent;
                includeText = true;
                console.log('🔍 [EDIT] Found additional text from multi-line response:', additionalContent);
              }
            }
          }
        }
      }
      
      this.newKeyword = {
        botId: keywordData.botId,
        keyword: keywordData.keywords[0] || '',
        messageType: messageType,
        messageText: messageText,
        mediaUrl: mediaUrl,
        mediaCaption: mediaCaption,
        includeText: includeText,
        isContain: keywordData.is_contain !== false, // Use is_contain from API
        matchingMode: keywordData.is_contain ? 'contains' : 'exact',
        status: keywordData.status || 'active',
        images: [],
        uploadedImages: keywordData.images || []
      };
      
      this.keywordTags = [...keywordData.keywords];
      this.showAddKeywordDialog = true;
      
      console.log('✅ [EDIT] Edit keyword data processed:', {
        original: keywordData,
        processed: this.newKeyword,
        tags: this.keywordTags,
        messageType: messageType,
        mediaUrl: mediaUrl,
        mediaCaption: mediaCaption,
        includeText: includeText
      });
    },
    
    confirmDeleteKeyword(keywordData) {
      const keywordText = keywordData.keywords.join(', ');
      if (confirm(`Are you sure you want to delete the keyword group "${keywordText}" and its associated message?`)) {
        this.deleteKeyword(keywordData);
      }
    },
    
    async deleteKeyword(keywordData) {
      try {
        console.log('🗑️ [DELETE] Deleting keyword group:', keywordData);
        
        // Get shop ID first
        const shopsResponse = await shopsAPI.getAll();
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          const shopId = shopsResponse.data[0].id;
          
          console.log('🗑️ [DELETE] Deleting message ID:', keywordData.id, 'from shop:', shopId);
          
          await keywordsAPI.delete(shopId, keywordData.id, keywordData);
          
          // Remove from local state
        this.keywords = this.keywords.filter(k => k.id !== keywordData.id);
          
          console.log('✅ [DELETE] Keyword and message deleted successfully');
        }
      } catch (error) {
        console.error('❌ [DELETE] Failed to delete keyword:', error);
        alert('Failed to delete keyword: ' + (error.response?.data?.message || error.message));
      }
    },
    
    async saveKeyword() {
      // Basic form validation
      if (!this.newKeyword.botId) {
        alert('Please select a bot');
        return;
      }
      
      if (this.keywordTags.length === 0) {
        alert('Please add at least one keyword');
        return;
      }
      
      if (this.newKeyword.messageType === 'text' && !this.newKeyword.messageText.trim()) {
        alert('Please enter a message text');
        return;
      }
      
      // Validate image messages
      if (this.newKeyword.messageType === 'image' && this.newKeyword.images.length === 0 && this.newKeyword.uploadedImages.length === 0) {
        alert('Please upload at least one image');
        return;
      }
      
      // Validate that additional text is provided if includeText is checked
      if (this.newKeyword.includeText && !this.newKeyword.messageText.trim()) {
        alert('Please enter additional text message');
        return;
      }
      
      try {
        // Show loading state
        this.isSaving = true;
        
        // Upload images if message type is image
        let uploadedImageUrls = [];
        if (this.newKeyword.messageType === 'image') {
          try {
            uploadedImageUrls = await this.uploadImages();
          } catch (error) {
            alert('Failed to upload images: ' + error.message);
            return;
          }
        }
        
        const payload = {
          bot_id: this.newKeyword.botId,
          keywords: this.keywordTags,
          message_type: this.newKeyword.messageType,
          message_text: this.newKeyword.messageText || '',
          images: uploadedImageUrls,
          is_contain: this.newKeyword.matchingMode === 'contains',
          status: this.newKeyword.status,
          duration: this.newKeyword.duration
        };
        
        console.log('💾 [SAVE] Saving keyword with payload:', payload);
        console.log('💾 [SAVE] Payload details:', {
          keywords: payload.keywords,
          message_type: payload.message_type,
          message_text: payload.message_text,
          images: payload.images,
          is_contain: payload.is_contain,
          status: payload.status,
          duration: payload.duration
        });
        
        // Get shop ID first
        const shopsResponse = await shopsAPI.getAll();
        if (shopsResponse.success && shopsResponse.data && shopsResponse.data.length > 0) {
          const shopId = shopsResponse.data[0].id;
          
          if (this.isEditingKeyword) {
            await keywordsAPI.update(shopId, this.editingKeywordId, payload);
            alert('Keyword updated successfully');
          } else {
            await keywordsAPI.create(shopId, payload);
            alert('Keyword added successfully');
          }
          
          // Refresh keywords after save
          await this.refreshKeywords();
        this.closeKeywordDialog();
        }
      } catch (error) {
        console.error('Failed to save keyword:', error);
        alert(error.response?.data?.message || 'Failed to save keyword');
      } finally {
        this.isSaving = false;
      }
    },
    
    // Image upload methods
    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      
      files.forEach(file => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select only image files');
          return;
        }
        
        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB`);
          return;
        }
        
        // Create preview URL
        const preview = URL.createObjectURL(file);
        
        // Add to images array
        this.newKeyword.images.push({
          file: file,
          preview: preview,
          name: file.name
        });
      });
      
      // Clear the input
      event.target.value = '';
    },
    
    removeImage(index) {
      // Revoke the preview URL to free memory
      URL.revokeObjectURL(this.newKeyword.images[index].preview);
      
      // Remove from array
      this.newKeyword.images.splice(index, 1);
    },
    
    removeExistingImage(index) {
      // Remove from uploaded images array
      this.newKeyword.uploadedImages.splice(index, 1);
    },
    
    async uploadImages() {
      const uploadedUrls = [];
      
      // Add existing images first
      uploadedUrls.push(...this.newKeyword.uploadedImages);
      
      // Upload new images
      for (const imageData of this.newKeyword.images) {
        try {
          const formData = new FormData();
          formData.append('image', imageData.file);
          
          // Upload to Laravel backend
          const response = await fetch('http://197.140.142.101:8000/api/upload-image', {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });
          
          if (response.ok) {
            const result = await response.json();
            uploadedUrls.push(result.url);
          } else {
            throw new Error(`Failed to upload ${imageData.name}`);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          throw new Error(`Failed to upload ${imageData.name}: ${error.message}`);
        }
      }
      
      return uploadedUrls;
    },
    
    setupKeyboardShortcuts() {
      // Add keyboard event listener for Escape key to close dialog
      document.addEventListener('keydown', this.handleKeyDown);
    },
    
    removeKeyboardShortcuts() {
      // Clean up event listener when component is destroyed
      document.removeEventListener('keydown', this.handleKeyDown);
    },
    
    handleKeyDown(event) {
      // Close dialog on Escape key
      if (event.key === 'Escape' && this.showAddKeywordDialog) {
        this.closeKeywordDialog();
      }
      
      // Save on Ctrl+Enter or Cmd+Enter when in dialog
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && this.showAddKeywordDialog) {
        this.saveKeyword();
      }
    }
  },
  
  created() {
    this.refreshKeywords();
    this.setupKeyboardShortcuts();
  },
  
  beforeDestroy() {
    this.removeKeyboardShortcuts();
  }
}
</script>

<style scoped>
/* Ensure table takes full width */
table {
  table-layout: fixed;
  width: 100%;
}

/* Ensure table container takes full width */
.overflow-x-auto {
  width: 100%;
}

/* Ensure the main container takes full width */
.w-full {
  width: 100% !important;
}

/* Force the table container to take full width */
.bg-white\/80 {
  width: 100% !important;
  max-width: none !important;
}

/* Ensure the table wrapper takes full width */
.overflow-hidden {
  width: 100% !important;
}

/* Ensure loading state takes full width */
.flex-1.min-h-\[400px\] {
  width: 100% !important;
}

/* Ensure table container takes full width */
.min-h-\[400px\] {
  width: 100% !important;
}

/* Force full width for all flex containers */
.flex-1 {
  width: 100% !important;
  max-width: none !important;
}

/* Ensure loading state takes full width */
.flex-1.min-h-\[400px\].flex.items-center.justify-center {
  width: 100% !important;
  max-width: none !important;
  min-width: 100% !important;
}

/* Force loading container to take full width */
.flex-1.min-h-\[400px\].flex.items-center.justify-center.w-full.relative {
  width: 100% !important;
  max-width: none !important;
  min-width: 100% !important;
}

/* Ensure flex items don't shrink */
.flex-shrink-0 {
  flex-shrink: 0 !important;
}

/* Force full width for flex containers */
.flex-1 {
  flex: 1 1 100% !important;
  min-width: 0 !important;
}
</style>
