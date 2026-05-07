<template>
  <div class="auth-page">
    <div class="auth-container">
      <base-card>
        <template #header>
          <h2 class="auth-title">Register for Trips Management</h2>
        </template>

        <form @submit.prevent="handleSubmit">
          <div v-if="errorMessage" class="error-banner">
            {{ errorMessage }}
          </div>

          <base-input
            id="email"
            v-model="formData.email"
            label="Email"
            type="email"
            placeholder="email@example.com"
            required
            :error="$v.formData.email.$error ? 'Valid email is required' : ''"
            @blur="$v.formData.email.$touch()"
          />

          <base-input
            id="password"
            v-model="formData.password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
            :error="$v.formData.password.$error ? 'Password must be at least 6 characters' : ''"
            @blur="$v.formData.password.$touch()"
          />

          <base-input
            id="firstName"
            v-model="formData.firstName"
            label="First Name"
            placeholder="John"
            required
            :error="$v.formData.firstName.$error ? 'First name is required' : ''"
            @blur="$v.formData.firstName.$touch()"
          />

          <base-input
            id="lastName"
            v-model="formData.lastName"
            label="Last Name"
            placeholder="Doe"
            required
            :error="$v.formData.lastName.$error ? 'Last name is required' : ''"
            @blur="$v.formData.lastName.$touch()"
          />

          <base-input
            id="phoneNumber"
            v-model="formData.phoneNumber"
            label="Phone Number"
            type="tel"
            placeholder="+1234567890"
          />

          <base-button
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            style="width: 100%; margin-top: 1rem"
          >
            Register
          </base-button>

          <p class="auth-link">
            Already have an account?
            <router-link to="/login">Login</router-link>
          </p>
        </form>
      </base-card>
    </div>
  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import BaseCard from '../components/BaseCard.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'

export default {
  name: 'Register',
  components: {
    BaseCard,
    BaseInput,
    BaseButton
  },
  data() {
    return {
      formData: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
      },
      loading: false,
      errorMessage: ''
    }
  },
  validations: {
    formData: {
      email: { required, email },
      password: { required, minLength: minLength(6) },
      firstName: { required },
      lastName: { required }
    }
  },
  methods: {
    async handleSubmit() {
      this.$v.$touch()
      if (this.$v.$invalid) return

      try {
        this.loading = true
        this.errorMessage = ''
        await this.$store.dispatch('auth/register', this.formData)
        this.$router.push('/trips')
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $bg-secondary;
  padding: $spacing-md;
}

.auth-container {
  width: 100%;
  max-width: 28rem;
}

.auth-title {
  margin: 0;
  text-align: center;
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

.auth-link {
  margin-top: $spacing-md;
  text-align: center;
  font-size: 0.875rem;
  color: $text-secondary;

  a {
    color: $primary;
    font-weight: 500;
  }
}
</style>
