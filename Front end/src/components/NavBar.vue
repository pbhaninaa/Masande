<template>
  <nav class="navbar">
    <div class="container navbar-content">
      <div class="navbar-brand">
        <router-link :to="defaultRoute">Trips Management</router-link>
      </div>
      <div class="navbar-menu">
        <!-- Platform Admin Menu -->
        <template v-if="isPlatformAdmin">
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          <router-link to="/tenants" class="nav-link">Tenants</router-link>
          <router-link to="/trips" class="nav-link">Trips</router-link>
          <router-link to="/clients" class="nav-link">Clients</router-link>
        </template>

        <!-- Tenant Admin/Manager Menu -->
        <template v-else-if="isTenantAdmin">
          <router-link to="/tenant-dashboard" class="nav-link">Dashboard</router-link>
          <router-link to="/trips" class="nav-link">Trips</router-link>
          <router-link to="/clients" class="nav-link">Clients</router-link>
        </template>

        <!-- Default Menu (Agents, Clients) -->
        <template v-else>
          <router-link to="/trips" class="nav-link">Trips</router-link>
          <router-link to="/clients" class="nav-link">Clients</router-link>
        </template>

        <base-button variant="ghost" size="sm" @click="logout">Logout</base-button>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import BaseButton from './BaseButton.vue'

export default {
  name: 'NavBar',
  components: {
    BaseButton
  },
  computed: {
    ...mapGetters('auth', ['isPlatformAdmin', 'isTenantAdmin', 'user']),
    defaultRoute() {
      if (this.isPlatformAdmin) {
        return '/dashboard'
      } else if (this.isTenantAdmin) {
        return '/tenant-dashboard'
      } else {
        return '/trips'
      }
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  background-color: $bg-primary;
  border-bottom: 1px solid $border-color;
  box-shadow: $shadow-sm;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: $spacing-md;
  padding-bottom: $spacing-md;
}

.navbar-brand {
  a {
    font-size: 1.5rem;
    font-weight: 700;
    color: $primary;
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }
  }
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: $spacing-lg;

  @media (max-width: $breakpoint-sm) {
    gap: $spacing-sm;
  }
}

.nav-link {
  font-weight: 500;
  color: $text-primary;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: $border-radius-sm;
  transition: all 0.2s;

  &:hover {
    color: $primary;
    background-color: rgba($primary, 0.1);
    text-decoration: none;
  }

  &.router-link-active {
    color: $primary;
    font-weight: 600;
  }
}
</style>
