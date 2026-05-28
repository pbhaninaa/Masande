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
        <!-- Overview Cards Row -->
        <div class="overview-cards">
          <!-- Users Card -->
          <div class="overview-card">
            <div class="card-header">
              <h3>Users</h3>
              <span class="card-icon">👥</span>
            </div>
            <div class="card-body">
              <div class="card-value">{{ stats.totalUsers }}</div>
              <div class="card-subtext">Total users</div>
            </div>
          </div>

          <!-- Customers Card -->
          <div class="overview-card">
            <div class="card-header">
              <h3>Customers</h3>
              <span class="card-icon">🏪</span>
            </div>
            <div class="card-body">
              <div class="card-value">{{ stats.totalCustomers }}</div>
              <div class="card-subtext">{{ stats.activeCustomers }} active</div>
            </div>
          </div>

          <!-- Trips Card -->
          <div class="overview-card">
            <div class="card-header">
              <h3>Trips</h3>
              <span class="card-icon">🚗</span>
            </div>
            <div class="card-body">
              <div class="card-value">{{ stats.totalTrips }}</div>
              <div class="card-subtext">Total trips</div>
            </div>
          </div>

          <!-- Loans Card -->
          <div class="overview-card">
            <div class="card-header">
              <h3>Loans</h3>
              <span class="card-icon">💰</span>
            </div>
            <div class="card-body">
              <div class="card-value">{{ formatCurrency(stats.totalLoanAmount) }}</div>
              <div class="card-subtext">{{ formatCurrency(stats.pendingLoanAmount) }} pending</div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="charts-row">
          <!-- Performance Pie Chart -->
          <base-card class="chart-card">
            <template #header>
              <h3>Performance</h3>
            </template>
            <div class="chart-placeholder">
              <p>Performance Distribution</p>
              <p style="font-size: 0.875rem; margin-top: 0.5rem; color: #999;">Add pie chart here</p>
            </div>
          </base-card>

          <!-- Insights Pie Chart -->
          <base-card class="chart-card">
            <template #header>
              <h3>Insights</h3>
            </template>
            <div class="chart-placeholder">
              <p>Insights Distribution</p>
              <p style="font-size: 0.875rem; margin-top: 0.5rem; color: #999;">Add pie chart here</p>
            </div>
          </base-card>
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

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

.overview-card {
  background: linear-gradient(135deg, $bg-primary 0%, $bg-secondary 100%);
  border: 1px solid $border-color;
  border-radius: $border-radius;
  padding: $spacing-lg;
  box-shadow: $shadow-sm;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;
    border-color: $primary;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: $text-primary;
  }
}

.card-icon {
  font-size: 1.5rem;
  opacity: 0.8;
}

.card-body {
  text-align: left;
}

.card-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: $primary;
  line-height: 1;
  margin-bottom: $spacing-sm;
}

.card-subtext {
  font-size: 0.875rem;
  color: $text-secondary;
  font-weight: 500;
}

.charts-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: $spacing-lg;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  box-shadow: $shadow-sm;
  overflow: hidden;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: $text-primary;
  }
}

.chart-placeholder {
  background-color: $bg-secondary;
  border: 2px dashed $border-color;
  border-radius: $border-radius;
  padding: $spacing-xl;
  text-align: center;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $text-secondary;

  p {
    margin: 0;
    font-weight: 500;
  }
}
</style>
