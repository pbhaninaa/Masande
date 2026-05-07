<template>
  <div class="auth-page">
    <div class="auth-container">
      <base-card>
        <template #header>
          <h2 class="auth-title">Login to Trips Management</h2>
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

          <base-button
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            style="width: 100%; margin-top: 1rem"
          >
            Login
          </base-button>

          <p class="auth-link">
            Don't have an account?
            <router-link to="/register">Register</router-link>
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
  name: 'Login',
  components: {
    BaseCard,
    BaseInput,
    BaseButton
  },
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      loading: false,
      errorMessage: ''
    }
  },
  validations: {
    formData: {
      email: { required, email },
      password: { required, minLength: minLength(6) }
    }
  },
  methods: {
    async handleSubmit() {
      this.$v.$touch()
      if (this.$v.$invalid) return

      try {
        this.loading = true
        this.errorMessage = ''
        await this.$store.dispatch('auth/login', this.formData)

        // Redirect based on user role
        const user = this.$store.getters['auth/user']
        if (user && user.roles) {
          // Roles are already strings from backend
          if (user.roles.includes('PLATFORM_ADMIN')) {
            this.$router.push('/dashboard')
          } else if (user.roles.includes('TENANT_ADMIN') || user.roles.includes('TENANT_MANAGER')) {
            this.$router.push('/tenant-dashboard')
          } else {
            this.$router.push('/trips')
          }
        } else {
          this.$router.push('/trips')
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
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
