<template>
  <div class="page">
    <div class="container">
      <h1>Tenant Dashboard</h1>
      <p class="subtitle">Your organization's analytics and insights</p>

      <div v-if="loading" class="loading-state">
        <div class="spinner-large"></div>
        <p>Loading dashboard...</p>
      </div>

      <div v-else-if="stats" class="dashboard">
        <!-- Key Metrics -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">{{ stats.totalUsers }}</div>
            <div class="metric-label">Total Users</div>
          </div>

          <div class="metric-card">
            <div class="metric-value">{{ stats.totalCustomers }}</div>
            <div class="metric-label">Total Customers</div>
          </div>

          <div class="metric-card metric-success">
            <div class="metric-value">{{ stats.activeCustomers }}</div>
            <div class="metric-label">Active Customers</div>
          </div>

          <div class="metric-card">
            <div class="metric-value">{{ stats.totalTrips }}</div>
            <div class="metric-label">Total Trips</div>
          </div>

          <div class="metric-card metric-primary">
            <div class="metric-value">{{ formatCurrency(stats.totalLoanAmount) }}</div>
            <div class="metric-label">Total Loan Amount</div>
          </div>

          <div class="metric-card metric-warning">
            <div class="metric-value">{{ formatCurrency(stats.pendingLoanAmount) }}</div>
            <div class="metric-label">Pending Loans</div>
          </div>
        </div>

        <!-- Trips by Status -->
        <base-card class="status-card">
          <template #header>
            <h2>Trips by Status</h2>
          </template>

          <div class="status-grid">
            <div
              v-for="(count, status) in stats.tripsByStatus"
              :key="status"
              class="status-item"
            >
              <div :class="['status-badge', `status-${status.toLowerCase()}`]">
                {{ status }}
              </div>
              <div class="status-count">{{ count }}</div>
            </div>
          </div>
        </base-card>

        <!-- Quick Actions -->
        <div class="actions-section">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <base-button @click="$router.push('/trips')">
              View All Trips
            </base-button>
            <base-button variant="outline" @click="$router.push('/clients')">
              Manage Clients
            </base-button>
            <base-button variant="secondary" @click="refreshDashboard">
              Refresh Data
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BaseCard from '../components/BaseCard.vue'
import BaseButton from '../components/BaseButton.vue'

export default {
  name: 'TenantDashboard',
  components: {
    BaseCard,
    BaseButton
  },
  computed: {
    ...mapState('dashboard', {
      stats: 'tenantStats',
      loading: 'loading'
    })
  },
  mounted() {
    this.fetchDashboard()
  },
  methods: {
    async fetchDashboard() {
      try {
        await this.$store.dispatch('dashboard/fetchTenantDashboard')
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to load dashboard')
      }
    },
    refreshDashboard() {
      this.fetchDashboard()
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount || 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding: $spacing-xl 0;
}

.subtitle {
  color: $text-secondary;
  margin-top: -$spacing-md;
  margin-bottom: $spacing-xl;
}

.loading-state {
  text-align: center;
  padding: 4rem;
  color: $text-secondary;
}

.spinner-large {
  width: 3rem;
  height: 3rem;
  border: 3px solid $border-color;
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto $spacing-md;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.metric-card {
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  padding: $spacing-lg;
  text-align: center;
  box-shadow: $shadow-sm;

  &.metric-success {
    border-color: $success;
    background-color: rgba($success, 0.05);
  }

  &.metric-primary {
    border-color: $primary;
    background-color: rgba($primary, 0.05);
  }

  &.metric-warning {
    border-color: $warning;
    background-color: rgba($warning, 0.05);
  }
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.metric-label {
  font-size: 0.875rem;
  color: $text-secondary;
  font-weight: 500;
}

.status-card {
  margin-bottom: $spacing-xl;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: $spacing-md;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  &.status-pending {
    background-color: rgba($warning, 0.1);
    color: darken($warning, 10%);
  }

  &.status-approved {
    background-color: rgba($success, 0.1);
    color: darken($success, 10%);
  }

  &.status-rejected {
    background-color: rgba($danger, 0.1);
    color: darken($danger, 10%);
  }

  &.status-completed {
    background-color: rgba($info, 0.1);
    color: darken($info, 10%);
  }

  &.status-cancelled {
    background-color: rgba($secondary, 0.1);
    color: darken($secondary, 10%);
  }
}

.status-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: $text-primary;
}

.actions-section {
  h2 {
    margin-bottom: $spacing-md;
  }
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-md;
}
</style>
