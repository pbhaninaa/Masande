<template>
  <div class="loan-configuration">
    <div class="page-header">
      <h1>Loan Configuration</h1>
      <p class="subtitle">Configure loan terms and limits for your clients</p>
    </div>

    <base-card>
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading configuration...</p>
      </div>

      <form v-else @submit.prevent="saveConfiguration" class="configuration-form">
        <div class="form-grid">
          <base-input
            v-model.number="form.interestPercentage"
            type="number"
            step="0.01"
            label="Interest Percentage (% per annum)"
            placeholder="e.g., 15.5"
            :error="errors.interestPercentage"
            required
          />

          <base-input
            v-model.number="form.maxLoanTermMonths"
            type="number"
            label="Maximum Loan Term (months)"
            placeholder="e.g., 12"
            :error="errors.maxLoanTermMonths"
            required
          />

          <base-input
            v-model.number="form.clientLoanLimit"
            type="number"
            step="0.01"
            label="Client Loan Limit"
            placeholder="e.g., 5000"
            :error="errors.clientLoanLimit"
            required
          />

          <base-input
            v-model.number="form.minimumLoanAmount"
            type="number"
            step="0.01"
            label="Minimum Loan Amount"
            placeholder="e.g., 500"
            :error="errors.minimumLoanAmount"
          />
        </div>

        <div class="form-section">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="form.loanEnabled"
            />
            <span>Enable loan feature for clients</span>
          </label>
        </div>

        <div class="calculation-preview" v-if="showPreview">
          <h3>Calculation Preview</h3>
          <div class="preview-grid">
            <div class="preview-item">
              <span class="label">Loan Amount:</span>
              <span class="value">R{{ previewAmount.toFixed(2) }}</span>
            </div>
            <div class="preview-item">
              <span class="label">Term:</span>
              <span class="value">{{ previewMonths }} months</span>
            </div>
            <div class="preview-item">
              <span class="label">Interest Rate:</span>
              <span class="value">{{ form.interestPercentage }}% p.a.</span>
            </div>
            <div class="preview-item">
              <span class="label">Monthly Installment:</span>
              <span class="value highlight">R{{ calculateInstallment.toFixed(2) }}</span>
            </div>
            <div class="preview-item">
              <span class="label">Total Repayment:</span>
              <span class="value">R{{ (calculateInstallment * previewMonths).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <base-button type="submit" variant="primary" :loading="saving">
            Save Configuration
          </base-button>
          <base-button type="button" variant="secondary" @click="loadConfiguration">
            Reset
          </base-button>
        </div>
      </form>
    </base-card>

    <base-card class="info-card">
      <h3>About Loan Configuration</h3>
      <ul class="info-list">
        <li>
          <strong>Interest Percentage:</strong> Annual interest rate charged on loans
        </li>
        <li>
          <strong>Maximum Loan Term:</strong> Maximum number of months clients can request for repayment
        </li>
        <li>
          <strong>Client Loan Limit:</strong> Maximum amount a single client can borrow
        </li>
        <li>
          <strong>Minimum Loan Amount:</strong> Minimum amount required to request a loan
        </li>
        <li>
          <strong>Monthly Invoicing:</strong> Loan repayments are added to monthly invoices alongside trip charges
        </li>
      </ul>
    </base-card>
  </div>
</template>

<script>
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import api from '@/services/api'

export default {
  name: 'LoanConfiguration',
  components: {
    BaseCard,
    BaseInput,
    BaseButton
  },
  data() {
    return {
      loading: true,
      saving: false,
      form: {
        interestPercentage: 15,
        maxLoanTermMonths: 12,
        clientLoanLimit: 5000,
        minimumLoanAmount: 500,
        loanEnabled: true
      },
      errors: {},
      previewAmount: 1000,
      previewMonths: 6
    }
  },
  computed: {
    showPreview() {
      return this.form.interestPercentage && this.form.maxLoanTermMonths
    },
    calculateInstallment() {
      const amount = this.previewAmount
      const months = Math.min(this.previewMonths, this.form.maxLoanTermMonths || 12)
      const annualRate = this.form.interestPercentage / 100
      const monthlyRate = annualRate / 12

      const totalAmount = amount * (1 + (monthlyRate * months))
      return totalAmount / months
    }
  },
  mounted() {
    this.loadConfiguration()
  },
  methods: {
    async loadConfiguration() {
      this.loading = true
      this.errors = {}

      try {
        const response = await api.get('/api/loan-configuration')
        if (response.data) {
          this.form = {
            interestPercentage: response.data.interestPercentage || 15,
            maxLoanTermMonths: response.data.maxLoanTermMonths || 12,
            clientLoanLimit: response.data.clientLoanLimit || 5000,
            minimumLoanAmount: response.data.minimumLoanAmount || 500,
            loanEnabled: response.data.loanEnabled !== false
          }
        }
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          console.error('Error loading configuration:', error)
          this.$emit('error', 'Failed to load loan configuration')
        }
      } finally {
        this.loading = false
      }
    },

    validateForm() {
      this.errors = {}

      if (!this.form.interestPercentage || this.form.interestPercentage <= 0) {
        this.errors.interestPercentage = 'Interest percentage must be greater than 0'
      }

      if (!this.form.maxLoanTermMonths || this.form.maxLoanTermMonths <= 0) {
        this.errors.maxLoanTermMonths = 'Maximum loan term must be greater than 0'
      }

      if (!this.form.clientLoanLimit || this.form.clientLoanLimit <= 0) {
        this.errors.clientLoanLimit = 'Client loan limit must be greater than 0'
      }

      if (this.form.minimumLoanAmount && this.form.clientLoanLimit &&
          this.form.minimumLoanAmount > this.form.clientLoanLimit) {
        this.errors.minimumLoanAmount = 'Minimum amount cannot exceed loan limit'
      }

      return Object.keys(this.errors).length === 0
    },

    async saveConfiguration() {
      if (!this.validateForm()) {
        return
      }

      this.saving = true

      try {
        await api.post('/api/loan-configuration', this.form)
        this.$emit('success', 'Loan configuration saved successfully')
        await this.loadConfiguration()
      } catch (error) {
        console.error('Error saving configuration:', error)
        this.$emit('error', 'Failed to save loan configuration')
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.loan-configuration {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-xl;
}

.page-header {
  margin-bottom: $spacing-xl;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  .subtitle {
    color: $text-secondary;
    font-size: 1rem;
  }
}

.loading-state {
  text-align: center;
  padding: $spacing-xl;

  .spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto $spacing-md;
    border: 3px solid $border-color;
    border-top-color: $primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  p {
    color: $text-secondary;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.configuration-form {
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $spacing-lg;
    margin-bottom: $spacing-lg;
  }

  .form-section {
    margin-bottom: $spacing-lg;
    padding: $spacing-lg;
    background: $bg-secondary;
    border-radius: $border-radius;

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      cursor: pointer;
      font-weight: 500;

      input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: $primary;
      }
    }
  }
}

.calculation-preview {
  padding: $spacing-lg;
  background: linear-gradient(135deg, rgba($primary, 0.05) 0%, rgba($secondary, 0.05) 100%);
  border: 1px solid rgba($primary, 0.2);
  border-radius: $border-radius-lg;
  margin-bottom: $spacing-lg;

  h3 {
    font-size: 1.125rem;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }

  .preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-md;
  }

  .preview-item {
    display: flex;
    justify-content: space-between;
    padding: $spacing-sm;
    background: $bg-primary;
    border-radius: $border-radius-sm;

    .label {
      color: $text-secondary;
      font-size: 0.875rem;
    }

    .value {
      font-weight: 600;
      color: $text-primary;

      &.highlight {
        color: $primary;
        font-size: 1.125rem;
      }
    }
  }
}

.form-actions {
  display: flex;
  gap: $spacing-md;
  padding-top: $spacing-lg;
  border-top: 1px solid $border-color;
}

.info-card {
  margin-top: $spacing-xl;
  background: $bg-tertiary;

  h3 {
    font-size: 1.125rem;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }

  .info-list {
    list-style: none;
    padding: 0;

    li {
      padding: $spacing-sm 0;
      color: $text-secondary;
      line-height: 1.6;

      strong {
        color: $text-primary;
      }

      &:not(:last-child) {
        border-bottom: 1px solid $border-color;
      }
    }
  }
}

@media (max-width: $breakpoint-md) {
  .loan-configuration {
    padding: $spacing-md;
  }

  .form-grid {
    grid-template-columns: 1fr !important;
  }

  .preview-grid {
    grid-template-columns: 1fr !important;
  }

  .form-actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}
</style>
