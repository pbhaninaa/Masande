<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h2>Edit Tenant</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <base-input
          id="name"
          v-model="formData.name"
          label="Tenant Name"
          placeholder="ABC Travel Agency"
          :error="$v.formData.name.$error ? 'Tenant name is required' : ''"
          @blur="$v.formData.name.$touch()"
        />

        <base-input
          id="contactEmail"
          v-model="formData.contactEmail"
          label="Contact Email"
          type="email"
          placeholder="contact@abc.com"
          :error="$v.formData.contactEmail.$error ? 'Valid email is required' : ''"
          @blur="$v.formData.contactEmail.$touch()"
        />

        <base-input
          id="contactPhone"
          v-model="formData.contactPhone"
          label="Contact Phone"
          type="tel"
          placeholder="+1234567890"
        />

        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="formData.isActive"
              type="checkbox"
              class="checkbox"
            />
            <span>Active</span>
          </label>
        </div>

        <div class="modal-actions">
          <base-button type="button" variant="outline" @click="$emit('close')">
            Cancel
          </base-button>
          <base-button type="submit" :loading="loading">
            Update Tenant
          </base-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { email } from 'vuelidate/lib/validators'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'

export default {
  name: 'EditTenantModal',
  components: {
    BaseInput,
    BaseButton
  },
  props: {
    tenant: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {
        name: this.tenant.name,
        contactEmail: this.tenant.contactEmail || '',
        contactPhone: this.tenant.contactPhone || '',
        isActive: this.tenant.isActive
      },
      loading: false,
      errorMessage: ''
    }
  },
  validations: {
    formData: {
      name: {},
      contactEmail: { email }
    }
  },
  methods: {
    async handleSubmit() {
      this.$v.$touch()
      if (this.$v.$invalid) return

      try {
        this.loading = true
        this.errorMessage = ''
        await this.$store.dispatch('tenants/updateTenant', {
          id: this.tenant.id,
          data: this.formData
        })
        this.$emit('updated')
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Failed to update tenant'
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

.form-group {
  margin-bottom: $spacing-md;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: $text-primary;

  .checkbox {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
  }
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
