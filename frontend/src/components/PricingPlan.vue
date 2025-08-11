<template>
  <div class="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header Section -->
    <div class="max-w-7xl mx-auto text-center mb-12">
      <div class="mb-6">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Choose Your Perfect
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Plan
          </span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Start with our free trial and scale as you grow. All plans include our core WhatsApp automation features.
        </p>
      </div>

      <!-- Billing Toggle -->
      <div class="flex items-center justify-center space-x-4 mb-6">
        <span class="text-gray-600 font-medium">Monthly</span>
        <button 
          @click="isYearly = !isYearly"
          :class="[
            'relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            isYearly ? 'bg-blue-600' : 'bg-gray-200'
          ]"
        >
          <span 
            :class="[
              'inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200',
              isYearly ? 'translate-x-9' : 'translate-x-1'
            ]"
          />
        </button>
        <span class="text-gray-600 font-medium">Yearly</span>
        <span class="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
          Save 20%
        </span>
      </div>
    </div>

    <!-- Pricing Cards -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      
      <!-- Starter Plan -->
      <div class="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <div class="p-6 sm:p-8">
          <!-- Plan Header -->
          <div class="text-center mb-6">
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Starter</h3>
            <p class="text-gray-600 mb-4">Perfect for small businesses getting started</p>
            
            <!-- Price -->
            <div class="mb-6">
              <div class="flex items-baseline justify-center">
                <span class="text-3xl sm:text-4xl font-bold text-gray-900">$</span>
                <span class="text-5xl sm:text-6xl font-bold text-gray-900 mx-1">
                  {{ isYearly ? '19' : '29' }}
                </span>
                <span class="text-gray-600">/month</span>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                {{ isYearly ? 'Billed annually ($228/year)' : 'Billed monthly' }}
              </p>
            </div>
          </div>

          <!-- Features -->
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700 text-sm sm:text-base">1 WhatsApp Number</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700 text-sm sm:text-base">3 Active Bots</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700 text-sm sm:text-base">50 Keywords per Bot</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700 text-sm sm:text-base">1,000 Messages/month</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700 text-sm sm:text-base">Basic Analytics</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700 text-sm sm:text-base">Email Support</span>
            </li>
          </ul>

          <!-- CTA Button -->
          <button @click="startFreeTrial" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Start Free Trial
          </button>
        </div>
      </div>

      <!-- Professional Plan -->
      <div class="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl border border-blue-500 transform transition-all duration-300 hover:scale-105">
        <!-- Popular Badge -->
        <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <span class="bg-white text-blue-600 text-sm font-bold px-6 py-2 rounded-full shadow-lg">
            Most Popular
          </span>
        </div>

        <div class="p-6 sm:p-8 pt-8">
          <!-- Plan Header -->
          <div class="text-center mb-6">
            <h3 class="text-xl sm:text-2xl font-bold text-white mb-2">Professional</h3>
            <p class="text-blue-100 mb-4">Ideal for growing businesses</p>
            
            <!-- Price -->
            <div class="mb-6">
              <div class="flex items-baseline justify-center">
                <span class="text-3xl sm:text-4xl font-bold text-white">$</span>
                <span class="text-5xl sm:text-6xl font-bold text-white mx-1">
                  {{ isYearly ? '49' : '79' }}
                </span>
                <span class="text-blue-100">/month</span>
              </div>
              <p class="text-sm text-blue-200 mt-2">
                {{ isYearly ? 'Billed annually ($588/year)' : 'Billed monthly' }}
              </p>
            </div>
          </div>

          <!-- Features -->
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-white text-sm sm:text-base">3 WhatsApp Numbers</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-white text-sm sm:text-base">10 Active Bots</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-white text-sm sm:text-base">200 Keywords per Bot</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-white text-sm sm:text-base">10,000 Messages/month</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-white text-sm sm:text-base">Advanced Analytics</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-white text-sm sm:text-base">Priority Support</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-white text-sm sm:text-base">API Access</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-white text-sm sm:text-base">Custom Integrations</span>
            </li>
          </ul>

          <!-- CTA Button -->
          <button @click="startFreeTrial" class="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600">
            Start Free Trial
          </button>
        </div>
      </div>

      <!-- Enterprise Plan -->
      <div class="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <div class="p-6 sm:p-8">
          <!-- Plan Header -->
          <div class="text-center mb-6">
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
            <p class="text-gray-600 mb-4">For large organizations with custom needs</p>
            
            <!-- Price -->
            <div class="mb-6">
              <div class="flex items-baseline justify-center">
                <span class="text-3xl sm:text-4xl font-bold text-gray-900">$</span>
                <span class="text-5xl sm:text-6xl font-bold text-gray-900 mx-1">
                  {{ isYearly ? '199' : '299' }}
                </span>
                <span class="text-gray-600">/month</span>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                {{ isYearly ? 'Billed annually ($2,388/year)' : 'Billed monthly' }}
              </p>
            </div>
          </div>

          <!-- Features -->
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700 text-sm sm:text-base">Unlimited WhatsApp Numbers</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700 text-sm sm:text-base">Unlimited Active Bots</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700 text-sm sm:text-base">Unlimited Keywords</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700 text-sm sm:text-base">Unlimited Messages</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700 text-sm sm:text-base">Advanced Analytics & Reports</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700 text-sm sm:text-base">24/7 Dedicated Support</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700 text-sm sm:text-base">Custom Development</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700 text-sm sm:text-base">SLA Guarantee</span>
            </li>
          </ul>

          <!-- CTA Button -->
          <button class="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold py-3 px-6 rounded-xl hover:from-gray-900 hover:to-black transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            Contact Sales
          </button>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="max-w-4xl mx-auto mt-16">
      <div class="text-center mb-10">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <p class="text-gray-600">Everything you need to know about our pricing and plans</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Can I change plans anytime?</h3>
          <p class="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Is there a free trial?</h3>
          <p class="text-gray-600 text-sm">Yes! All plans come with a 14-day free trial. No credit card required to start.</p>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
          <p class="text-gray-600 text-sm">We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Can I cancel anytime?</h3>
          <p class="text-gray-600 text-sm">Absolutely! You can cancel your subscription at any time with no cancellation fees.</p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="max-w-4xl mx-auto mt-12 text-center">
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white">
        <h2 class="text-2xl sm:text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p class="text-lg sm:text-xl text-blue-100 mb-6">Join thousands of businesses automating their WhatsApp communication</p>
        <button @click="startFreeTrial" class="bg-white text-blue-600 font-semibold py-3 px-6 sm:px-8 rounded-xl hover:bg-gray-50 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600">
          Start Your Free Trial
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PricingPlan',
  data() {
    return {
      isYearly: false
    }
  },
  methods: {
    startFreeTrial() {
      // Check if user is authenticated
      const token = localStorage.getItem('auth_token')
      if (token) {
        // User is logged in, go to setup
        this.$router.push('/setup')
      } else {
        // User is not logged in, go to auth
        this.$router.push('/auth')
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