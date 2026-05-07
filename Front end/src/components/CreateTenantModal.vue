<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h2>Create New Tenant</h2>
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
          required
          :error="$v.formData.name.$error ? 'Tenant name is required' : ''"
          @blur="$v.formData.name.$touch()"
        />

        <base-input
          id="code"
          v-model="formData.code"
          label="Tenant Code"
          placeholder="ABC001"
          required
          helper-text="Unique identifier for the tenant"
          :error="$v.formData.code.$error ? 'Tenant code is required' : ''"
          @blur="$v.formData.code.$touch()"
        />

        <base-input
          id="contactEmail"
          v-model="formData.contactEmail"
          label="Contact Email"
          type="email"
          placeholder="contact@abc.com"
          required
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

        <div class="section-divider">
          <h3>Tenant Admin Account</h3>
        </div>

        <base-input
          id="adminEmail"
          v-model="formData.adminEmail"
          label="Admin Email"
          type="email"
          placeholder="admin@abc.com"
          required
          :error="$v.formData.adminEmail.$error ? 'Admin email is required' : ''"
          @blur="$v.formData.adminEmail.$touch()"
        />

        <base-input
          id="adminName"
          v-model="formData.adminName"
          label="Admin Full Name"
          placeholder="John Doe"
          required
          :error="$v.formData.adminName.$error ? 'Admin name is required' : ''"
          @blur="$v.formData.adminName.$touch()"
        />

        <base-input
          id="adminPhone"
          v-model="formData.adminPhone"
          label="Admin Phone"
          type="tel"
          placeholder="+1234567890"
        />

        <base-input
          id="adminPassword"
          v-model="formData.adminPassword"
          label="Admin Password"
          type="password"
          placeholder="Enter a secure password"
          required
          :error="$v.formData.adminPassword.$error ? 'Password must be at least 6 characters' : ''"
          @blur="$v.formData.adminPassword.$touch()"
        />

        <div class="modal-actions">
          <base-button type="button" variant="outline" @click="$emit('close')">
            Cancel
          </base-button>
          <base-button type="submit" :loading="loading">
            Create Tenant
          </base-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'

export default {
  name: 'CreateTenantModal',
  components: {
    BaseInput,
    BaseButton
  },
  data() {
    return {
      formData: {
        name: '',
        code: '',
        contactEmail: '',
        contactPhone: '',
        adminEmail: '',
        adminName: '',
        adminPhone: '',
        adminPassword: ''
      },
      loading: false,
      errorMessage: ''
    }
  },
  validations: {
    formData: {
      name: { required },
      code: { required },
      contactEmail: { required, email },
      adminEmail: { required, email },
      adminName: { required },
      adminPassword: { required, minLength: minLength(6) }
    }
  },
  methods: {
    async handleSubmit() {
      this.$v.$touch()
      if (this.$v.$invalid) return

      try {
        this.loading = true
        this.errorMessage = ''
        await this.$store.dispatch('tenants/createTenant', this.formData)
        this.$emit('created')
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Failed to create tenant'
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
  max-width: 36rem;
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

.section-divider {
  margin: $spacing-lg 0 $spacing-md;
  padding-top: $spacing-lg;
  border-top: 1px solid $border-color;

  h3 {
    margin: 0 0 $spacing-md;
    font-size: 1.125rem;
    color: $text-primary;
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
