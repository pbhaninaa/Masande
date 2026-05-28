<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <div class="header-content">
          <router-link to="/tenants" class="back-link">
            ← Back to Tenants
          </router-link>
          <h1 v-if="!loading && tenant">{{ tenant.name }}</h1>
        </div>
        <div class="header-actions">
          <base-button
            v-if="!loading && tenant && tenant.isActive"
            @click="showEditModal = true"
            variant="primary"
          >
            Edit Tenant
          </base-button>
          <base-button
            v-if="!loading && tenant && tenant.isActive"
            @click="handleDeactivate"
            variant="danger"
          >
            Deactivate
          </base-button>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner-large"></div>
        <p>Loading tenant details...</p>
      </div>

      <div v-else-if="tenant" class="tenant-details">
        <!-- Status Badge -->
        <div class="status-section">
          <span :class="['status-badge', tenant.isActive ? 'status-active' : 'status-inactive']">
            {{ tenant.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>

        <!-- Basic Information -->
        <base-card class="info-card">
          <template #header>
            <h2>Basic Information</h2>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <label>Tenant Name</label>
              <p>{{ tenant.name }}</p>
            </div>
            <div class="info-item">
              <label>Tenant Code</label>
              <p>{{ tenant.code }}</p>
            </div>
            <div class="info-item">
              <label>Contact Email</label>
              <p>{{ tenant.contactEmail || '-' }}</p>
            </div>
            <div class="info-item">
              <label>Contact Phone</label>
              <p>{{ tenant.contactPhone || '-' }}</p>
            </div>
          </div>
        </base-card>

        <!-- Statistics -->
        <base-card class="stats-card">
          <template #header>
            <h2>Tenant Statistics</h2>
          </template>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ stats.totalUsers || 0 }}</div>
              <div class="stat-label">Total Users</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.totalCustomers || 0 }}</div>
              <div class="stat-label">Total Customers</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.totalRoutes || 0 }}</div>
              <div class="stat-label">Total Routes</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.totalTrips || 0 }}</div>
              <div class="stat-label">Total Trips</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.completedTrips || 0 }}</div>
              <div class="stat-label">Completed Trips</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ formatCurrency(stats.totalLoanAmount || 0) }}</div>
              <div class="stat-label">Total Loan Amount</div>
            </div>
          </div>
        </base-card>

        <!-- Additional Details -->
        <base-card class="details-card">
          <template #header>
            <h2>Additional Details</h2>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <label>Created Date</label>
              <p>{{ formatDate(tenant.createdDate) }}</p>
            </div>
            <div class="info-item">
              <label>Last Updated</label>
              <p>{{ formatDate(tenant.lastUpdatedDate) }}</p>
            </div>
            <div class="info-item">
              <label>Tenant ID</label>
              <p class="mono">{{ tenant.id }}</p>
            </div>
          </div>
        </base-card>

        <!-- Quick Actions -->
        <div class="actions-section">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <base-button
              @click="$router.push('/tenants')"
              variant="outline"
            >
              View All Tenants
            </base-button>
            <base-button
              @click="$router.push('/trips')"
              variant="outline"
            >
              View All Trips
            </base-button>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <base-button @click="$router.push('/tenants')">
          Back to Tenants
        </base-button>
      </div>

      <!-- Edit Modal -->
      <edit-tenant-modal
        v-if="showEditModal && tenant"
        :tenant="tenant"
        @close="showEditModal = false"
        @updated="handleTenantUpdated"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BaseCard from '../components/BaseCard.vue'
import BaseButton from '../components/BaseButton.vue'
import EditTenantModal from '../components/EditTenantModal.vue'

export default {
  name: 'TenantDetail',
  components: {
    BaseCard,
    BaseButton,
    EditTenantModal
  },
  data() {
    return {
      loading: true,
      error: null,
      showEditModal: false,
      stats: {
        totalUsers: 0,
        totalCustomers: 0,
        totalRoutes: 0,
        totalTrips: 0,
        completedTrips: 0,
        totalLoanAmount: 0
      }
    }
  },
  computed: {
    ...mapState('tenants', {
      tenant: 'currentTenant'
    }),
    tenantId() {
      return this.$route.params.id
    }
  },
  async mounted() {
    await this.loadTenantDetails()
  },
  methods: {
    async loadTenantDetails() {
      try {
        this.loading = true
        this.error = null
        await this.$store.dispatch('tenants/fetchTenantById', this.tenantId)
        // Load tenant-specific statistics
        await this.loadTenantStats()
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to load tenant details'
      } finally {
        this.loading = false
      }
    },
    async loadTenantStats() {
      try {
        // This would ideally call a specific API endpoint for tenant stats
        // For now, we're setting placeholder values that could be populated from the tenant object or a dedicated stats endpoint
        if (this.tenant) {
          this.stats = {
            totalUsers: this.tenant.totalUsers || 0,
            totalCustomers: this.tenant.totalCustomers || 0,
            totalRoutes: this.tenant.totalRoutes || 0,
            totalTrips: this.tenant.totalTrips || 0,
            completedTrips: this.tenant.completedTrips || 0,
            totalLoanAmount: this.tenant.totalLoanAmount || 0
          }
        }
      } catch (error) {
        console.error('Failed to load tenant statistics', error)
      }
    },
    async handleDeactivate() {
      if (!confirm('Are you sure you want to deactivate this tenant? This action cannot be undone.')) {
        return
      }

      try {
        await this.$store.dispatch('tenants/deleteTenant', this.tenantId)
        alert('Tenant deactivated successfully')
        this.$router.push('/tenants')
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to deactivate tenant')
      }
    },
    handleTenantUpdated() {
      this.showEditModal = false
      this.loadTenantDetails()
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-xl;
  gap: $spacing-lg;

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  flex: 1;
}

.back-link {
  color: $primary;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  margin-bottom: $spacing-sm;

  &:hover {
    text-decoration: underline;
  }
}

.header-actions {
  display: flex;
  gap: $spacing-md;
  flex-wrap: wrap;

  @media (max-width: $breakpoint-sm) {
    width: 100%;
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}

.status-section {
  margin-bottom: $spacing-xl;
}

.status-badge {
  display: inline-block;
  padding: $spacing-xs $spacing-md;
  border-radius: $border-radius;
  font-size: 0.875rem;
  font-weight: 600;

  &.status-active {
    background-color: rgba($success, 0.1);
    color: $success;
    border: 1px solid $success;
  }

  &.status-inactive {
    background-color: rgba($danger, 0.1);
    color: $danger;
    border: 1px solid $danger;
  }
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

.error-state {
  background-color: rgba($danger, 0.1);
  border: 1px solid $danger;
  border-radius: $border-radius;
  padding: $spacing-xl;
  text-align: center;
  color: $danger;

  p {
    margin-bottom: $spacing-lg;
  }
}

.info-card,
.stats-card,
.details-card {
  margin-bottom: $spacing-xl;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-lg;
}

.info-item {
  display: flex;
  flex-direction: column;

  label {
    font-weight: 600;
    color: $text-secondary;
    font-size: 0.875rem;
    margin-bottom: $spacing-xs;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  p {
    color: $text-primary;
    margin: 0;
    word-break: break-word;
  }

  p.mono {
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    background-color: $bg-secondary;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: $spacing-lg;
}

.stat-item {
  background-color: $bg-secondary;
  border-radius: $border-radius;
  padding: $spacing-lg;
  text-align: center;
  border: 1px solid $border-color;

  &:hover {
    border-color: $primary;
  }
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: $primary;
  margin-bottom: $spacing-xs;
}

.stat-label {
  font-size: 0.875rem;
  color: $text-secondary;
  font-weight: 500;
}

.actions-section {
  margin-top: $spacing-xl;
  padding-top: $spacing-xl;
  border-top: 1px solid $border-color;

  h2 {
    margin-bottom: $spacing-lg;
  }
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-md;
}
</style>
