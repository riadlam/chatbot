<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-7xl mx-auto">
      
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="mb-6">
          <div class="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Free Trial
            </span>
          </h1>
          <p class="text-lg text-gray-600 max-w-md mx-auto">
            Let's get your WhatsApp automation setup in just a few steps
          </p>
        </div>
      </div>

             <!-- Setup Form -->
       <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-12 xl:p-16">
         <form @submit.prevent="handleSubmit" class="space-y-6 lg:space-y-8">
           
                      <!-- Form Fields Grid -->
           <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
             <!-- Shop Name -->
             <div>
               <label for="shopName" class="block text-sm font-semibold text-gray-700 mb-2">
                 Shop/Business Name
               </label>
               <div class="relative">
                 <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                   </svg>
                 </div>
                 <input
                   id="shopName"
                   v-model="form.shopName"
                   type="text"
                   required
                   placeholder="Enter your shop or business name"
                   class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                   :class="{ 'border-red-500 focus:ring-red-500': errors.shopName }"
                 >
               </div>
               <p v-if="errors.shopName" class="mt-1 text-sm text-red-600">{{ errors.shopName }}</p>
             </div>

             <!-- Phone Number -->
             <div>
               <label for="phoneNumber" class="block text-sm font-semibold text-gray-700 mb-2">
                 WhatsApp Phone Number
               </label>
               <div class="relative">
                 <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                   </svg>
                 </div>
                 <input
                   id="phoneNumber"
                   v-model="form.phoneNumber"
                   type="tel"
                   required
                   placeholder="+1234567890"
                   class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                   :class="{ 'border-red-500 focus:ring-red-500': errors.phoneNumber }"
                 >
               </div>
               <p class="mt-1 text-sm text-gray-500">This will be your main WhatsApp number for automation</p>
               <p v-if="errors.phoneNumber" class="mt-1 text-sm text-red-600">{{ errors.phoneNumber }}</p>
             </div>

             <!-- Business Type -->
             <div>
               <label for="businessType" class="block text-sm font-semibold text-gray-700 mb-2">
                 Business Type
               </label>
               <select
                 id="businessType"
                 v-model="form.businessType"
                 required
                 class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
               >
                 <option value="">Select your business type</option>
                 <option value="ecommerce">E-commerce</option>
                 <option value="restaurant">Restaurant & Food</option>
                 <option value="retail">Retail Store</option>
                 <option value="service">Service Business</option>
                 <option value="consulting">Consulting</option>
                 <option value="healthcare">Healthcare</option>
                 <option value="education">Education</option>
                 <option value="real-estate">Real Estate</option>
                 <option value="other">Other</option>
               </select>
             </div>
           </div>

          <!-- Free Trial Info -->
          <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-semibold text-green-800">Free Trial Activated</h3>
                <p class="text-sm text-green-700 mt-1">
                  Your 14-day free trial starts today. No credit card required.
                </p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            <svg v-if="isSubmitting" class="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>{{ isSubmitting ? 'Setting up your account...' : 'Start My Free Trial' }}</span>
          </button>
        </form>
      </div>

      <!-- Success Animation Modal -->
      <div v-if="showSuccess" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
          <div class="mb-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Setup Complete!</h3>
            <p class="text-gray-600">Your free trial is now active. Redirecting to dashboard...</p>
          </div>
          <div class="flex justify-center">
            <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { shopsAPI } from '../services/api.js'

export default {
  name: 'Setup',
  data() {
    return {
      form: {
        shopName: '',
        phoneNumber: '',
        businessType: ''
      },
      errors: {},
      isSubmitting: false,
      showSuccess: false
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      if (!this.form.shopName.trim()) {
        this.errors.shopName = 'Shop name is required'
      }
      
      if (!this.form.phoneNumber.trim()) {
        this.errors.phoneNumber = 'Phone number is required'
      } else if (!this.isValidPhoneNumber(this.form.phoneNumber)) {
        this.errors.phoneNumber = 'Please enter a valid phone number'
      }
      
      if (!this.form.businessType) {
        this.errors.businessType = 'Business type is required'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    isValidPhoneNumber(phone) {
      // Basic phone validation - can be enhanced
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
      return phoneRegex.test(phone)
    },
    
    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // Get current user info
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user) {
          throw new Error('User not authenticated')
        }
        
        // Prepare shop data
        const shopData = {
          name: this.form.shopName,
          phone_number: this.form.phoneNumber,
          business_type: this.form.businessType,
          user_id: user.id,
          free_trial_started: new Date().toISOString().split('T')[0], // Current date
          active_plan: 'free_trial',
          status: 'active'
        }
        
        // Create shop
        const response = await shopsAPI.create(shopData)
        
        if (response.success) {
          // Show success animation
          this.showSuccess = true
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            this.$router.push('/dashboard')
          }, 2000)
        } else {
          throw new Error(response.message || 'Failed to create shop')
        }
        
      } catch (error) {
        console.error('Setup error:', error)
        alert('Setup failed: ' + (error.response?.data?.message || error.message || 'Unknown error'))
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.bg-white {
  animation: fadeIn 0.6s ease-out;
}
</style> 