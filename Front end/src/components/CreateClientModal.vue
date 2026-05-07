<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h2>Create New Client</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <base-input
          id="name"
          v-model="formData.name"
          label="Client Name"
          placeholder="John Doe"
          required
          :error="$v.formData.name.$error ? 'Name is required' : ''"
          @blur="$v.formData.name.$touch()"
        />

        <base-input
          id="phoneNumber"
          v-model="formData.phoneNumber"
          label="Phone Number"
          type="tel"
          placeholder="+1234567890"
          required
          :error="$v.formData.phoneNumber.$error ? 'Phone number is required' : ''"
          @blur="$v.formData.phoneNumber.$touch()"
        />

        <base-input
          id="loanLimit"
          v-model.number="formData.loanLimit"
          label="Loan Limit (Optional)"
          type="number"
          step="0.01"
          placeholder="5000.00"
          :error="$v.formData.loanLimit.$error ? 'Loan limit must be positive' : ''"
        />

        <base-input
          id="maxMonthlyCommitment"
          v-model.number="formData.maxMonthlyCommitment"
          label="Max Monthly Commitment (Optional)"
          type="number"
          step="0.01"
          placeholder="500.00"
          :error="$v.formData.maxMonthlyCommitment.$error ? 'Max monthly commitment must be positive' : ''"
        />

        <div class="modal-actions">
          <base-button type="button" variant="outline" @click="$emit('close')">
            Cancel
          </base-button>
          <base-button type="submit" :loading="loading">
            Create Client
          </base-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue, decimal } from 'vuelidate/lib/validators'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'

const minValueOrEmpty = minValue(0)

export default {
  name: 'CreateClientModal',
  components: {
    BaseInput,
    BaseButton
  },
  data() {
    return {
      formData: {
        name: '',
        phoneNumber: '',
        loanLimit: '',
        maxMonthlyCommitment: ''
      },
      loading: false,
      errorMessage: ''
    }
  },
  validations: {
    formData: {
      name: { required },
      phoneNumber: { required },
      loanLimit: {
        minValue: value => !value || minValueOrEmpty(value)
      },
      maxMonthlyCommitment: {
        minValue: value => !value || minValueOrEmpty(value)
      }
    }
  },
  methods: {
    async handleSubmit() {
      this.$v.$touch()
      if (this.$v.$invalid) return

      try {
        this.loading = true
        this.errorMessage = ''

        const data = {
          name: this.formData.name,
          phoneNumber: this.formData.phoneNumber,
          ...(this.formData.loanLimit && { loanLimit: this.formData.loanLimit }),
          ...(this.formData.maxMonthlyCommitment && { maxMonthlyCommitment: this.formData.maxMonthlyCommitment })
        }

        await this.$store.dispatch('clients/createClient', data)
        this.$emit('created')
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Failed to create client'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-md;
}

.modal {
  background-color: $bg-primary;
  border-radius: $border-radius;
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: $shadow-lg;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 1px solid $border-color;

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    line-height: 1;
    color: $text-secondary;
    cursor: pointer;
    padding: 0;
    width: 2rem;
    height: 2rem;

    &:hover {
      color: $text-primary;
    }
  }
}

form {
  padding: $spacing-lg;
}

.error-banner {
  padding: $spacing-md;
  margin-bottom: $spacing-md;
  background-color: rgba($danger, 0.1);
  border: 1px solid $danger;
  border-radius: $border-radius;
  color: $danger;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-md;
  margin-top: $spacing-lg;
}
</style>
