<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <div>
          <h1>All Trips & Loans</h1>
          <p class="subtitle">Platform-wide trip and loan management</p>
        </div>
        <div class="header-actions">
          <base-button @click="exportData" variant="outline" size="sm">
            📥 Export
          </base-button>
          <base-button @click="resetFilters" variant="outline" size="sm">
            🔄 Reset Filters
          </base-button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="filters-section">
        <div class="filter-header">
          <h3>{{ showFilters ? '▼' : '▶' }} Advanced Filters</h3>
          <button class="toggle-btn" @click="showFilters = !showFilters">
            {{ showFilters ? 'Hide' : 'Show' }}
          </button>
        </div>

        <div v-if="showFilters" class="filters-grid">
          <!-- Tenant Filter -->
          <div class="filter-group">
            <label>Tenant</label>
            <select v-model="filters.tenantId" class="filter-input">
              <option value="">All Tenants</option>
              <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                {{ tenant.name }}
              </option>
            </select>
          </div>

          <!-- Status Filter -->
          <div class="filter-group">
            <label>Status</label>
            <select v-model="filters.status" class="filter-input">
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <!-- Customer Search -->
          <div class="filter-group">
            <label>Customer Name</label>
            <input
              v-model="filters.customerName"
              type="text"
              class="filter-input"
              placeholder="Search customer..."
            />
          </div>

          <!-- Destination Search -->
          <div class="filter-group">
            <label>Destination</label>
            <input
              v-model="filters.destination"
              type="text"
              class="filter-input"
              placeholder="Search destination..."
            />
          </div>

          <!-- Departure Date Range -->
          <div class="filter-group">
            <label>Departure Date (From)</label>
            <input
              v-model="filters.departureDateFrom"
              type="date"
              class="filter-input"
            />
          </div>

          <div class="filter-group">
            <label>Departure Date (To)</label>
            <input
              v-model="filters.departureDateTo"
              type="date"
              class="filter-input"
            />
          </div>

          <!-- Return Date Range -->
          <div class="filter-group">
            <label>Return Date (From)</label>
            <input
              v-model="filters.returnDateFrom"
              type="date"
              class="filter-input"
            />
          </div>

          <div class="filter-group">
            <label>Return Date (To)</label>
            <input
              v-model="filters.returnDateTo"
              type="date"
              class="filter-input"
            />
          </div>

          <!-- Loan Amount Range -->
          <div class="filter-group">
            <label>Loan Amount (Min)</label>
            <input
              v-model.number="filters.loanAmountMin"
              type="number"
              class="filter-input"
              placeholder="0"
              min="0"
            />
          </div>

          <div class="filter-group">
            <label>Loan Amount (Max)</label>
            <input
              v-model.number="filters.loanAmountMax"
              type="number"
              class="filter-input"
              placeholder="999999"
              min="0"
            />
          </div>

          <!-- Total Amount Range -->
          <div class="filter-group">
            <label>Total Amount (Min)</label>
            <input
              v-model.number="filters.totalAmountMin"
              type="number"
              class="filter-input"
              placeholder="0"
              min="0"
            />
          </div>

          <div class="filter-group">
            <label>Total Amount (Max)</label>
            <input
              v-model.number="filters.totalAmountMax"
              type="number"
              class="filter-input"
              placeholder="999999"
              min="0"
            />
          </div>

          <!-- Apply Filters Button -->
          <div class="filter-actions">
            <base-button @click="applyFilters" variant="primary">
              Apply Filters
            </base-button>
            <base-button @click="resetFilters" variant="outline">
              Reset
            </base-button>
          </div>
        </div>
      </div>

      <!-- Stats Summary -->
      <div v-if="!loading" class="stats-summary">
        <div class="stat-box">
          <div class="stat-value">{{ filteredTrips.length }}</div>
          <div class="stat-label">Trips Found</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">{{ formatCurrency(totalLoanAmount) }}</div>
          <div class="stat-label">Total Loans</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">{{ formatCurrency(totalAmount) }}</div>
          <div class="stat-label">Total Amount</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">{{ averageLoanAmount }}</div>
          <div class="stat-label">Avg Loan</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner-large"></div>
        <p>Loading trips...</p>
      </div>

      <!-- Trips Table -->
      <div v-else class="table-wrapper">
        <table class="trips-table">
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Customer</th>
              <th>Destination</th>
              <th>Departure</th>
              <th>Return</th>
              <th>Loan Amount</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredTrips.length === 0">
              <td colspan="9" class="text-center">
                No trips found with current filters
              </td>
            </tr>
            <tr v-for="trip in paginatedTrips" :key="trip.id" class="trip-row">
              <td class="tenant-cell">
                <span class="tenant-badge">{{ getTenantName(trip.tenantId) }}</span>
              </td>
              <td>{{ trip.customerName }}</td>
              <td>{{ trip.destination }}</td>
              <td>{{ formatDate(trip.departureDate) }}</td>
              <td>{{ formatDate(trip.returnDate) }}</td>
              <td class="loan-cell">
                <span class="loan-badge">{{ formatCurrency(trip.loanAmount) }}</span>
              </td>
              <td class="amount-cell">
                {{ formatCurrency(trip.totalAmount) }}
              </td>
              <td>
                <span :class="['status-badge', `status-${trip.status.toLowerCase()}`]">
                  {{ trip.status }}
                </span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <base-button
                    v-if="trip.status === 'PENDING'"
                    @click="handleApprove(trip.id)"
                    variant="success"
                    size="xs"
                  >
                    ✓
                  </base-button>
                  <base-button
                    v-if="trip.status === 'PENDING'"
                    @click="handleReject(trip.id)"
                    variant="danger"
                    size="xs"
                  >
                    ✗
                  </base-button>
                  <base-button
                    @click="viewDetails(trip)"
                    variant="ghost"
                    size="xs"
                  >
                    →
                  </base-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <base-button
            variant="outline"
            @click="currentPage--"
            :disabled="currentPage === 1"
            size="sm"
          >
            ← Previous
          </base-button>

          <div class="page-info">
            <span v-for="page in paginationRange" :key="page">
              <button
                :class="['page-btn', { active: page === currentPage }]"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
            </span>
          </div>

          <base-button
            variant="outline"
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            size="sm"
          >
            Next →
          </base-button>
        </div>
      </div>

      <!-- Trip Details Modal -->
      <trip-details-modal
        v-if="selectedTrip"
        :trip="selectedTrip"
        :tenant="getSelectedTenant"
        @close="selectedTrip = null"
        @updated="handleTripUpdated"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BaseButton from '../components/BaseButton.vue'
import TripDetailsModal from '../components/TripDetailsModal.vue'

export default {
  name: 'PlatformTrips',
  components: {
    BaseButton,
    TripDetailsModal
  },
  data() {
    return {
      showFilters: true,
      currentPage: 1,
      pageSize: 20,
      selectedTrip: null,
      filters: {
        tenantId: '',
        status: '',
        customerName: '',
        destination: '',
        departureDateFrom: '',
        departureDateTo: '',
        returnDateFrom: '',
        returnDateTo: '',
        loanAmountMin: null,
        loanAmountMax: null,
        totalAmountMin: null,
        totalAmountMax: null
      }
    }
  },
  computed: {
    ...mapState('trips', {
      allTrips: 'trips',
      loading: 'loading'
    }),
    ...mapState('tenants', {
      tenants: 'tenants'
    }),
    filteredTrips() {
      return this.allTrips.filter(trip => {
        // Tenant filter
        if (this.filters.tenantId && trip.tenantId !== this.filters.tenantId) return false

        // Status filter
        if (this.filters.status && trip.status !== this.filters.status) return false

        // Customer name filter (case-insensitive)
        if (this.filters.customerName) {
          if (!trip.customerName.toLowerCase().includes(this.filters.customerName.toLowerCase())) {
            return false
          }
        }

        // Destination filter
        if (this.filters.destination) {
          if (!trip.destination.toLowerCase().includes(this.filters.destination.toLowerCase())) {
            return false
          }
        }

        // Departure date range
        if (this.filters.departureDateFrom) {
          const tripDate = new Date(trip.departureDate)
          const filterDate = new Date(this.filters.departureDateFrom)
          if (tripDate < filterDate) return false
        }
        if (this.filters.departureDateTo) {
          const tripDate = new Date(trip.departureDate)
          const filterDate = new Date(this.filters.departureDateTo)
          if (tripDate > filterDate) return false
        }

        // Return date range
        if (this.filters.returnDateFrom) {
          const tripDate = new Date(trip.returnDate)
          const filterDate = new Date(this.filters.returnDateFrom)
          if (tripDate < filterDate) return false
        }
        if (this.filters.returnDateTo) {
          const tripDate = new Date(trip.returnDate)
          const filterDate = new Date(this.filters.returnDateTo)
          if (tripDate > filterDate) return false
        }

        // Loan amount range
        if (this.filters.loanAmountMin !== null && trip.loanAmount < this.filters.loanAmountMin) return false
        if (this.filters.loanAmountMax !== null && trip.loanAmount > this.filters.loanAmountMax) return false

        // Total amount range
        if (this.filters.totalAmountMin !== null && trip.totalAmount < this.filters.totalAmountMin) return false
        if (this.filters.totalAmountMax !== null && trip.totalAmount > this.filters.totalAmountMax) return false

        return true
      })
    },
    paginatedTrips() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredTrips.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredTrips.length / this.pageSize)
    },
    paginationRange() {
      const range = []
      const maxPages = Math.min(5, this.totalPages)
      let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2))
      let end = Math.min(this.totalPages, start + maxPages - 1)

      if (end - start < maxPages - 1) {
        start = Math.max(1, end - maxPages + 1)
      }

      for (let i = start; i <= end; i++) {
        range.push(i)
      }
      return range
    },
    totalLoanAmount() {
      return this.filteredTrips.reduce((sum, trip) => sum + (trip.loanAmount || 0), 0)
    },
    totalAmount() {
      return this.filteredTrips.reduce((sum, trip) => sum + (trip.totalAmount || 0), 0)
    },
    averageLoanAmount() {
      if (this.filteredTrips.length === 0) return '$0'
      const avg = this.totalLoanAmount / this.filteredTrips.length
      return this.formatCurrency(avg)
    },
    getSelectedTenant() {
      if (!this.selectedTrip) return null
      return this.tenants.find(t => t.id === this.selectedTrip.tenantId)
    }
  },
  async mounted() {
    await this.loadData()
  },
  watch: {
    filters: {
      handler() {
        this.currentPage = 1
      },
      deep: true
    }
  },
  methods: {
    async loadData() {
      try {
        // Fetch all trips and tenants
        await Promise.all([
          this.$store.dispatch('trips/fetchTrips', { page: 0, size: 10000 }),
          this.$store.dispatch('tenants/fetchTenants')
        ])
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to load data')
      }
    },
    applyFilters() {
      this.currentPage = 1
    },
    resetFilters() {
      this.filters = {
        tenantId: '',
        status: '',
        customerName: '',
        destination: '',
        departureDateFrom: '',
        departureDateTo: '',
        returnDateFrom: '',
        returnDateTo: '',
        loanAmountMin: null,
        loanAmountMax: null,
        totalAmountMin: null,
        totalAmountMax: null
      }
      this.currentPage = 1
    },
    getTenantName(tenantId) {
      const tenant = this.tenants.find(t => t.id === tenantId)
      return tenant ? tenant.name : 'Unknown'
    },
    viewDetails(trip) {
      this.selectedTrip = trip
    },
    async handleApprove(id) {
      if (!confirm('Approve this trip?')) return
      try {
        await this.$store.dispatch('trips/approveTrip', { id })
        alert('Trip approved successfully')
        await this.loadData()
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to approve trip')
      }
    },
    async handleReject(id) {
      if (!confirm('Reject this trip?')) return
      try {
        await this.$store.dispatch('trips/rejectTrip', { id })
        alert('Trip rejected successfully')
        await this.loadData()
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to reject trip')
      }
    },
    handleTripUpdated() {
      this.selectedTrip = null
      this.loadData()
    },
    exportData() {
      const data = this.filteredTrips.map(trip => ({
        Tenant: this.getTenantName(trip.tenantId),
        Customer: trip.customerName,
        Destination: trip.destination,
        'Departure Date': this.formatDate(trip.departureDate),
        'Return Date': this.formatDate(trip.returnDate),
        'Loan Amount': trip.loanAmount,
        'Total Amount': trip.totalAmount,
        Status: trip.status
      }))

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `platform-trips-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount || 0)
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
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

  h1 {
    margin: 0;
  }
}

.subtitle {
  color: $text-secondary;
  margin-top: $spacing-xs;
}

.header-actions {
  display: flex;
  gap: $spacing-md;
  flex-wrap: wrap;
}

.filters-section {
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  margin-bottom: $spacing-xl;
  overflow: hidden;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  background-color: $bg-secondary;
  border-bottom: 1px solid $border-color;
  cursor: pointer;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }
}

.toggle-btn {
  background: none;
  border: none;
  color: $primary;
  cursor: pointer;
  font-weight: 600;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-md;
  padding: $spacing-lg;

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;

  label {
    font-weight: 600;
    font-size: 0.875rem;
    color: $text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.filter-input {
  padding: $spacing-sm $spacing-md;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  font-size: 0.875rem;
  font-family: inherit;
  background-color: $bg-primary;
  color: $text-primary;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: $primary;
  }

  &::placeholder {
    color: $text-secondary;
  }
}

.filter-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: $spacing-md;
  margin-top: $spacing-md;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
}

.stat-box {
  background: linear-gradient(135deg, $primary, lighten($primary, 10%));
  border-radius: $border-radius;
  padding: $spacing-lg;
  color: white;
  text-align: center;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: $spacing-xs;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
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

.table-wrapper {
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  overflow: auto;
  margin-bottom: $spacing-xl;
}

.trips-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  thead {
    background-color: $bg-secondary;
    border-bottom: 2px solid $border-color;

    th {
      padding: $spacing-md;
      text-align: left;
      font-weight: 600;
      color: $text-secondary;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid $border-color;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: $bg-secondary;
      }

      &:last-child {
        border-bottom: none;
      }

      td {
        padding: $spacing-md;
        vertical-align: middle;
      }
    }
  }
}

.trip-row {
  &:hover {
    background-color: rgba($primary, 0.05);
  }
}

.text-center {
  text-align: center;
  color: $text-secondary;
}

.tenant-cell {
  font-weight: 600;
}

.tenant-badge {
  background-color: rgba($primary, 0.1);
  color: $primary;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius;
  font-weight: 600;
  font-size: 0.8rem;
}

.loan-cell,
.amount-cell {
  font-weight: 600;
  color: $primary;
}

.loan-badge {
  background-color: rgba($success, 0.1);
  color: $success;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: $spacing-xs $spacing-sm;
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

.actions-cell {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: $spacing-xs;
  justify-content: center;
  align-items: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg;
  background-color: $bg-secondary;
  border-radius: 0 0 $border-radius $border-radius;
  flex-wrap: wrap;
}

.page-info {
  display: flex;
  gap: $spacing-xs;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid $border-color;
  background-color: $bg-primary;
  color: $text-primary;
  border-radius: $border-radius;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    border-color: $primary;
    color: $primary;
  }

  &.active {
    background-color: $primary;
    color: white;
    border-color: $primary;
  }
}
</style>
