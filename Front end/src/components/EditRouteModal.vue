<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h2>Edit Route</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <base-input
          id="routeName"
          v-model="formData.routeName"
          label="Route Name"
          required
          :error="$v.formData.routeName.$error ? 'Route name is required' : ''"
          @blur="$v.formData.routeName.$touch()"
        />

        <base-input
          id="pickupLocation"
          v-model="formData.pickupLocation"
          label="Pickup Location"
          required
          :error="$v.formData.pickupLocation.$error ? 'Pickup location is required' : ''"
          @blur="$v.formData.pickupLocation.$touch()"
        />

        <base-input
          id="dropoffLocation"
          v-model="formData.dropoffLocation"
          label="Drop-off Location"
          required
          :error="$v.formData.dropoffLocation.$error ? 'Drop-off location is required' : ''"
          @blur="$v.formData.dropoffLocation.$touch()"
        />

        <base-input
          id="pricePerLift"
          v-model.number="formData.pricePerLift"
          label="Price per Lift (R)"
          type="number"
          step="0.01"
          required
          :error="$v.formData.pricePerLift.$error ? 'Price must be greater than 0' : ''"
          @blur="$v.formData.pricePerLift.$touch()"
        />

        <base-input
          id="morningPickupTime"
          v-model="formData.morningPickupTime"
          label="Morning Pickup Time"
          type="time"
          required
          :error="$v.formData.morningPickupTime.$error ? 'Morning pickup time is required' : ''"
          @blur="$v.formData.morningPickupTime.$touch()"
        />

        <base-input
          id="afternoonPickupTime"
          v-model="formData.afternoonPickupTime"
          label="Afternoon Pickup Time"
          type="time"
          required
          :error="$v.formData.afternoonPickupTime.$error ? 'Afternoon pickup time is required' : ''"
          @blur="$v.formData.afternoonPickupTime.$touch()"
        />

        <div class="form-group">
          <label>Active Days</label>
          <div class="checkbox-group">
            <label v-for="day in daysOfWeek" :key="day.value" class="checkbox-label">
              <input
                v-model="selectedDays"
                type="checkbox"
                :value="day.value"
              />
              {{ day.label }}
            </label>
          </div>
        </div>

        <div class="modal-actions">
          <base-button type="button" variant="outline" @click="$emit('close')">
            Cancel
          </base-button>
          <base-button type="submit" :loading="loading">
            Update Route
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
import apiClient from '@/services/api'

export default {
  name: 'EditRouteModal',
  components: {
    BaseInput,
    BaseButton
  },
  props: {
    route: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {
        routeName: this.route.routeName,
        pickupLocation: this.route.pickupLocation,
        dropoffLocation: this.route.dropoffLocation,
        pricePerLift: this.route.pricePerLift,
        morningPickupTime: this.route.morningPickupTime,
        afternoonPickupTime: this.route.afternoonPickupTime,
        active: this.route.active
      },
      selectedDays: this.route.activeDays ? this.route.activeDays.split(',') : [],
      daysOfWeek: [
        { value: 'MON', label: 'Monday' },
        { value: 'TUE', label: 'Tuesday' },
        { value: 'WED', label: 'Wednesday' },
        { value: 'THU', label: 'Thursday' },
        { value: 'FRI', label: 'Friday' },
        { value: 'SAT', label: 'Saturday' },
        { value: 'SUN', label: 'Sunday' }
      ],
      loading: false,
      errorMessage: ''
    }
  },
  validations: {
    formData: {
      routeName: { required },
      pickupLocation: { required },
      dropoffLocation: { required },
      pricePerLift: { required, decimal, minValue: minValue(0.01) },
      morningPickupTime: { required },
      afternoonPickupTime: { required }
    }
  },
  methods: {
    async handleSubmit() {
      this.$v.$touch()
      if (this.$v.$invalid) return

      if (this.selectedDays.length === 0) {
        this.errorMessage = 'Please select at least one active day'
        return
      }

      try {
        this.loading = true
        this.errorMessage = ''

        const payload = {
          ...this.formData,
          activeDays: this.selectedDays.join(',')
        }

        await apiClient.put(`/api/routes/${this.route.id}`, payload)
        this.$emit('updated')
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Failed to update route'
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

.form-group {
  margin-bottom: $spacing-lg;

  label {
    display: block;
    margin-bottom: $spacing-sm;
    font-weight: 500;
    color: $text-primary;
  }
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;

  input[type="checkbox"] {
    cursor: pointer;
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-md;
  margin-top: $spacing-lg;
}
</style>
