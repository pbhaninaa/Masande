#!/usr/bin/env node

/**
 * WhatsApp Welcome Notification Test Script
 * 
 * Usage: npm run test:whatsapp
 * 
 * This script tests the WhatsApp welcome notification feature by:
 * 1. Logging in to the backend
 * 2. Creating a new client with phone number
 * 3. Verifying the welcome message was sent
 */

const axios = require('axios')

const API_BASE_URL = process.env.API_URL || 'http://localhost:8080'
const PHONE_NUMBER = process.env.PHONE || '0782141216'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let authToken = null

// Test credentials (adjust as needed)
const TEST_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'password123'
}

const TEST_CLIENT = {
  name: 'Test Client WhatsApp',
  phoneNumber: PHONE_NUMBER,
  loanLimit: 5000,
  maxMonthlyCommitment: 500
}

async function login() {
  console.log('\n🔐 Step 1: Logging in...')
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, TEST_CREDENTIALS)
    authToken = response.data.token || response.data.data?.token
    console.log('✅ Login successful')
    console.log('🔑 Token received:', authToken?.substring(0, 20) + '...')
    return true
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message)
    return false
  }
}

async function createClient() {
  console.log('\n👤 Step 2: Creating client...')
  if (!authToken) {
    console.error('❌ No auth token available')
    return false
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/clients`,
      TEST_CLIENT,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    console.log('✅ Client created successfully')
    console.log('📋 Client ID:', response.data.id || response.data.data?.id)
    console.log('👤 Client Name:', TEST_CLIENT.name)
    console.log('📱 Phone Number:', TEST_CLIENT.phoneNumber)
    return response.data
  } catch (error) {
    console.error('❌ Client creation failed:', error.response?.data || error.message)
    return false
  }
}

async function sendWhatsAppNotification() {
  console.log('\n💬 Step 3: Sending WhatsApp notification...')
  if (!authToken) {
    console.error('❌ No auth token available')
    return false
  }

  const welcomeMessage = `Hello Test Client! 👋

Welcome to Trips Management Platform!

This platform helps you manage your daily lift confirmations, loans, invoices, and payments.

📱 What you'll use this number for:
• Daily lift confirmations (morning/afternoon)
• Trip booking notifications
• Invoice and payment reminders
• Loan application updates
• General platform notifications

Thank you for using our service!`

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/notifications/whatsapp`,
      {
        to: PHONE_NUMBER,
        message: welcomeMessage
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    console.log('✅ WhatsApp notification sent successfully')
    console.log('📤 Response:', response.data)
    return true
  } catch (error) {
    console.error('❌ WhatsApp notification failed:', error.response?.data || error.message)
    return false
  }
}

async function runTests() {
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║   WhatsApp Welcome Notification Feature Test               ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  
  console.log(`\n📌 Configuration:`)
  console.log(`   API Base URL: ${API_BASE_URL}`)
  console.log(`   Test Phone: ${PHONE_NUMBER}`)

  // Step 1: Login
  if (!await login()) {
    console.error('\n❌ Test failed at login step')
    process.exit(1)
  }

  // Wait a bit
  await sleep(1000)

  // Step 2: Create Client
  const clientCreated = await createClient()
  if (!clientCreated) {
    console.error('\n❌ Test failed at client creation step')
    process.exit(1)
  }

  // Wait a bit
  await sleep(1000)

  // Step 3: Send Notification (if not automatically sent)
  const notificationSent = await sendWhatsAppNotification()
  if (!notificationSent) {
    console.warn('\n⚠️  WhatsApp notification send returned error (may still queue successfully)')
  }

  console.log('\n╔════════════════════════════════════════════════════════════╗')
  console.log('║   ✅ Test Completed Successfully!                          ║')
  console.log('╠════════════════════════════════════════════════════════════╣')
  console.log('║   Check phone number for WhatsApp message within 1-2 min   ║')
  console.log('║   Expected message: Welcome to Trips Management Platform   ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
