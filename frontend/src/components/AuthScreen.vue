<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
    
    <!-- Main Container - Full Screen -->
    <div class="w-full h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
      
      <!-- Left Side - Hero Section (Full height on mobile, half on desktop) -->
      <div class="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden flex-shrink-0">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-10 left-10 w-16 h-16 bg-white rounded-full"></div>
          <div class="absolute top-32 right-16 w-10 h-10 bg-white rounded-full"></div>
          <div class="absolute bottom-20 left-20 w-12 h-12 bg-white rounded-full"></div>
          <div class="absolute bottom-32 right-10 w-6 h-6 bg-white rounded-full"></div>
        </div>
        
        <!-- Content -->
        <div class="relative z-10 flex flex-col justify-center px-6 sm:px-10 py-8 sm:py-12 text-white h-full">
          <!-- Logo -->
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
            <h1 class="text-xl font-bold">WhatsApp Bot</h1>
          </div>
          
          <!-- Hero Content -->
          <h2 class="text-2xl sm:text-3xl font-bold leading-tight mb-4">
            Transform Your Business with 
            <span class="text-blue-200">Smart</span> 
            WhatsApp Automation
          </h2>
          
          <p class="text-sm sm:text-base text-blue-100 leading-relaxed mb-6">
            Create automated responses, manage conversations, and scale your customer support 
            with our powerful WhatsApp bot platform.
          </p>
          
          <!-- Features -->
          <div class="space-y-3">
            <div class="flex items-center">
              <div class="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center mr-3">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <span class="text-sm text-blue-100">Keyword-Based Auto Responses</span>
            </div>
            
            <div class="flex items-center">
              <div class="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center mr-3">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <span class="text-sm text-blue-100">Message Analytics & Insights</span>
            </div>
            
            <div class="flex items-center">
              <div class="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center mr-3">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <span class="text-sm text-blue-100">Multi-Bot Management</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Auth Form (Scrollable on mobile) -->
      <div class="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center overflow-y-auto">
        <!-- Mobile Logo (hidden on desktop) -->
        <div class="lg:hidden flex items-center justify-center mb-6">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </div>
          <h1 class="text-lg font-bold text-gray-900">WhatsApp Bot</h1>
    </div>

        <!-- Auth Toggle -->
        <div class="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button 
            @click="isLogin = true" 
            :class="[
              'flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all duration-200',
              isLogin 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Sign In
          </button>
          <button 
            @click="isLogin = false" 
            :class="[
              'flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all duration-200',
              !isLogin 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Sign Up
          </button>
        </div>

        <!-- Login Form -->
        <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-1">Welcome back</h2>
            <p class="text-sm text-gray-600">Sign in to your account to continue</p>
          </div>
          
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
            <input 
              type="email" 
              id="email"
              v-model="loginForm.email"
              required
              placeholder="Enter your email"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
            />
          </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div class="relative">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password"
                v-model="loginForm.password"
                required
                placeholder="Enter your password"
                  class="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                  class="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                  <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input type="checkbox" v-model="loginForm.remember" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
              <span class="ml-2 text-sm text-gray-700">Remember me</span>
            </label>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>

          <div class="relative my-5">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button type="button" class="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 text-sm">
            <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <!-- Signup Form -->
        <form v-else @submit.prevent="handleSignup" class="space-y-5">
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-1">Create your account</h2>
            <p class="text-sm text-gray-600">Start your journey with WhatsApp Bot</p>
          </div>
          
          <div class="space-y-4">
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
            <input 
              type="text" 
              id="fullName"
              v-model="signupForm.fullName"
              required
              placeholder="Enter your full name"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
            />
          </div>

            <div>
              <label for="signupEmail" class="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
            <input 
              type="email" 
              id="signupEmail"
              v-model="signupForm.email"
              required
              placeholder="Enter your email"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
            />
          </div>

            <div>
              <label for="signupPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div class="relative">
              <input 
                :type="showSignupPassword ? 'text' : 'password'" 
                id="signupPassword"
                v-model="signupForm.password"
                required
                placeholder="Create a password"
                  class="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
              />
              <button 
                type="button"
                @click="showSignupPassword = !showSignupPassword"
                  class="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                  <svg v-if="showSignupPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
          </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <div class="relative">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword"
                v-model="signupForm.confirmPassword"
                required
                placeholder="Confirm your password"
                  class="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
              />
              <button 
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                  <svg v-if="showConfirmPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
              </div>
            </div>
          </div>

          <div>
            <label class="flex items-start">
              <input type="checkbox" v-model="signupForm.agreeTerms" required class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"/>
              <span class="ml-2 text-sm text-gray-700">
                I agree to the 
                <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a> 
                and 
                <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>

          <div class="relative my-5">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button type="button" class="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 text-sm">
            <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </form>
        
        <!-- Pricing Link -->
        <div class="text-center mt-8">
          <p class="text-sm text-gray-600">
            Want to see our pricing plans? 
            <router-link to="/pricing-plan" class="text-blue-600 hover:text-blue-700 font-medium">
              View Pricing
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { authAPI } from '../services/api.js'

export default {
  name: 'AuthScreen',
  data() {
    return {
      isLogin: true,
      loading: false,
      showPassword: false,
      showSignupPassword: false,
      showConfirmPassword: false,
      loginForm: {
        email: '',
        password: '',
        remember: false
      },
      signupForm: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      }
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      try {
        const response = await authAPI.login({
          email: this.loginForm.email,
          password: this.loginForm.password
        })
        
        if (response.success) {
          // Store token and user info
          localStorage.setItem('auth_token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          
          // Navigate to dashboard
          this.$router.push('/dashboard')
        } else {
          alert('Login failed: ' + response.message)
        }
        
      } catch (error) {
        console.error('Login error:', error)
        if (error.response?.data?.message) {
          alert('Login failed: ' + error.response.data.message)
        } else {
          alert('Login failed. Please check your credentials.')
        }
      } finally {
        this.loading = false
      }
    },
    async handleSignup() {
      if (this.signupForm.password !== this.signupForm.confirmPassword) {
        alert('Passwords do not match!')
        return
      }
      
      this.loading = true
      try {
        const response = await authAPI.register({
          fullName: this.signupForm.fullName,
          email: this.signupForm.email,
          password: this.signupForm.password,
          confirmPassword: this.signupForm.confirmPassword
        })
        
        if (response.success) {
          // Store token and user info
          localStorage.setItem('auth_token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          
          alert('Account created successfully! Welcome to WhatsApp Bot!')
          // Navigate to dashboard
          this.$router.push('/dashboard')
        } else {
          alert('Registration failed: ' + response.message)
        }
        
      } catch (error) {
        console.error('Signup error:', error)
        if (error.response?.data?.message) {
          alert('Registration failed: ' + error.response.data.message)
        } else if (error.response?.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat()
          alert('Registration failed: ' + errors.join(', '))
        } else {
          alert('Registration failed. Please try again.')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style> 