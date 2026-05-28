import apiClient from './client'

export default {
  sendWhatsAppNotification(phoneNumber, message) {
    return apiClient.post('/api/notifications/whatsapp', {
      to: phoneNumber,
      message: message
    })
  },

  sendClientWelcomeMessage(phoneNumber, clientName) {
    const welcomeMessage = `
Hello ${clientName}! 👋

Welcome to Trips Management Platform!

This platform helps you manage your daily lift confirmations, loans, invoices, and payments.

📱 **What you'll use this number for:**
• Daily lift confirmations (morning/afternoon)
• Trip booking notifications
• Invoice and payment reminders
• Loan application updates
• General platform notifications

💡 **How to use the platform:**
1. Check your daily routes
2. Confirm your lifts in the morning and afternoon
3. View your statements and invoices
4. Apply for loans if needed
5. Make payments

If you have any questions, contact our support team.

Thank you for using our service!
    `.trim()
    
    return apiClient.post('/api/notifications/whatsapp', {
      to: phoneNumber,
      message: welcomeMessage
    })
  }
}
