<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h2>Create New Trip</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <base-auto-complete
          id="customer"
          v-model="selectedCustomer"
          label="Customer"
          placeholder="Select a customer"
          :options="customerOptions"
          label-key="name"
          value-key="id"
          required
          :error="$v.formData.customerId.$error ? 'Customer is required' : ''"
        />

        <base-input
          id="destination"
          v-model="formData.destination"
          label="Destination"
          placeholder="Paris, France"
          required
          :error="$v.formData.destination.$error ? 'Destination is required' : ''"
          @blur="$v.formData.destination.$touch()"
        />

        <base-input
          id="departureDate"
          v-model="formData.departureDate"
          label="Departure Date"
          type="date"
          required
          :error="$v.formData.departureDate.$error ? 'Departure date is required' : ''"
          @blur="$v.formData.departureDate.$touch()"
        />

        <base-input
          id="returnDate"
          v-model="formData.returnDate"
          label="Return Date"
          type="date"
          required
          :error="returnDateError"
          @blur="$v.formData.returnDate.$touch()"
        />

        <base-input
          id="loanAmount"
          v-model.number="formData.loanAmount"
          label="Loan Amount"
          type="number"
          step="0.01"
          placeholder="1000.00"
          required
          :error="$v.formData.loanAmount.$error ? 'Loan amount must be greater than 0' : ''"
          @blur="$v.formData.loanAmount.$touch()"
        />

        <base-input
          id="interestRate"
          v-model.number="formData.interestRate"
          label="Interest Rate (%)"
          type="number"
          step="0.01"
          placeholder="5.00"
          required
          :error="$v.formData.interestRate.$error ? 'Interest rate must be 0 or greater' : ''"
          @blur="$v.formData.interestRate.$touch()"
        />

        <base-input
          id="notes"
          v-model="formData.notes"
          label="Notes"
          placeholder="Additional notes (optional)"
        />

        <div class="modal-actions">
          <base-button type="button" variant="outline" @click="$emit('close')">
            Cancel
          </base-button>
          <base-button type="submit" :loading="loading">
            Create Trip
          </base-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue, decimal } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'
import BaseInput from './BaseInput.vue'
import BaseAutoComplete from './BaseAutoComplete.vue'
import BaseButton from './BaseButton.vue'

export default {
  name: 'CreateTripModal',
  components: {
    BaseInput,
    BaseAutoComplete,
    BaseButton
  },
  data() {
    return {
      formData: {
        customerId: null,
        destination: '',
        departureDate: '',
        returnDate: '',
        loanAmount: '',
        interestRate: '',
        notes: ''
      },
      selectedCustomer: null,
      loading: false,
      errorMessage: ''
    }
  },
  computed: {
    ...mapState('clients', ['clients']),
    customerOptions() {
      return this.clients
    },
    returnDateError() {
      if (this.$v.formData.returnDate.$error) {
        if (!this.$v.formData.returnDate.required) {
          return 'Return date is required'
        }
        if (this.formData.returnDate && this.formData.departureDate &&
            new Date(this.formData.returnDate) <= new Date(this.formData.departureDate)) {
          return 'Return date must be after departure date'
        }
      }
      return ''
    }
  },
  watch: {
    selectedCustomer(value) {
      this.formData.customerId = value ? value.id : null
      this.$v.formData.customerId.$touch()
    }
  },
  validations: {
    formData: {
      customerId: { required },
      destination: { required },
      departureDate: { required },
      returnDate: { required },
      loanAmount: { required, decimal, minValue: minValue(0.01) },
      interestRate: { required, decimal, minValue: minValue(0) }
    }
  },
  methods: {
    async handleSubmit() {
      this.$v.$touch()
      if (this.$v.$invalid) return

      // Additional validation
      if (new Date(this.formData.returnDate) <= new Date(this.formData.departureDate)) {
        this.errorMessage = 'Return date must be after departure date'
        return
      }

      try {
        this.loading = true
        this.errorMessage = ''
        await this.$store.dispatch('trips/createTrip', this.formData)
        this.$emit('created')
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Failed to create trip'
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
