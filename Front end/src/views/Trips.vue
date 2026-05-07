<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <h1>Trips Management</h1>
        <base-button @click="showCreateModal = true">
          + New Trip
        </base-button>
      </div>

      <responsive-data-view
        :data="trips"
        :columns="columns"
        :loading="loading"
        :clickable="false"
        empty-message="No trips found"
      >
        <template #cell-status="{ value }">
          <span :class="['status-badge', `status-${value.toLowerCase()}`]">
            {{ value }}
          </span>
        </template>

        <template #cell-loanAmount="{ value }">
          {{ formatCurrency(value) }}
        </template>

        <template #cell-totalAmount="{ value }">
          {{ formatCurrency(value) }}
        </template>

        <template #cell-departureDate="{ value }">
          {{ formatDate(value) }}
        </template>

        <template #cell-returnDate="{ value }">
          {{ formatDate(value) }}
        </template>

        <template #cell-actions="{ item }">
          <div class="actions-cell">
            <base-button
              v-if="item.status === 'PENDING'"
              variant="success"
              size="sm"
              @click="handleApprove(item.id)"
            >
              Approve
            </base-button>
            <base-button
              v-if="item.status === 'PENDING'"
              variant="danger"
              size="sm"
              @click="handleReject(item.id)"
            >
              Reject
            </base-button>
          </div>
        </template>

        <template #card="{ item }">
          <div class="trip-card">
            <div class="trip-card-header">
              <h3>{{ item.customerName }}</h3>
              <span :class="['status-badge', `status-${item.status.toLowerCase()}`]">
                {{ item.status }}
              </span>
            </div>
            <div class="trip-card-body">
              <div class="trip-card-row">
                <span class="label">Destination:</span>
                <span class="value">{{ item.destination }}</span>
              </div>
              <div class="trip-card-row">
                <span class="label">Departure:</span>
                <span class="value">{{ formatDate(item.departureDate) }}</span>
              </div>
              <div class="trip-card-row">
                <span class="label">Return:</span>
                <span class="value">{{ formatDate(item.returnDate) }}</span>
              </div>
              <div class="trip-card-row">
                <span class="label">Loan Amount:</span>
                <span class="value">{{ formatCurrency(item.loanAmount) }}</span>
              </div>
              <div class="trip-card-row">
                <span class="label">Total Amount:</span>
                <span class="value">{{ formatCurrency(item.totalAmount) }}</span>
              </div>
            </div>
            <div v-if="item.status === 'PENDING'" class="trip-card-actions">
              <base-button
                variant="success"
                size="sm"
                @click="handleApprove(item.id)"
              >
                Approve
              </base-button>
              <base-button
                variant="danger"
                size="sm"
                @click="handleReject(item.id)"
              >
                Reject
              </base-button>
            </div>
          </div>
        </template>
      </responsive-data-view>

      <div v-if="pagination.totalPages > 1" class="pagination">
        <base-button
          variant="outline"
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page === 0"
        >
          Previous
        </base-button>
        <span class="page-info">
          Page {{ pagination.page + 1 }} of {{ pagination.totalPages }}
        </span>
        <base-button
          variant="outline"
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.totalPages - 1"
        >
          Next
        </base-button>
      </div>

      <!-- Create Trip Modal -->
      <create-trip-modal
        v-if="showCreateModal"
        @close="showCreateModal = false"
        @created="handleTripCreated"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ResponsiveDataView from '../components/ResponsiveDataView.vue'
import BaseButton from '../components/BaseButton.vue'
import CreateTripModal from '../components/CreateTripModal.vue'

export default {
  name: 'Trips',
  components: {
    ResponsiveDataView,
    BaseButton,
    CreateTripModal
  },
  data() {
    return {
      showCreateModal: false,
      columns: [
        { key: 'customerName', label: 'Customer' },
        { key: 'destination', label: 'Destination' },
        { key: 'departureDate', label: 'Departure' },
        { key: 'returnDate', label: 'Return' },
        { key: 'loanAmount', label: 'Loan Amount' },
        { key: 'totalAmount', label: 'Total Amount' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
      ]
    }
  },
  computed: {
    ...mapState('trips', ['trips', 'pagination', 'loading'])
  },
  mounted() {
    this.fetchTrips()
    this.$store.dispatch('clients/fetchClients')
  },
  methods: {
    async fetchTrips() {
      await this.$store.dispatch('trips/fetchTrips', {
        page: this.pagination.page,
        size: this.pagination.size
      })
    },
    async changePage(page) {
      await this.$store.dispatch('trips/fetchTrips', {
        page,
        size: this.pagination.size
      })
    },
    async handleApprove(id) {
      try {
        await this.$store.dispatch('trips/approveTrip', { id })
        alert('Trip approved successfully')
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to approve trip')
      }
    },
    async handleReject(id) {
      try {
        await this.$store.dispatch('trips/rejectTrip', { id })
        alert('Trip rejected successfully')
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to reject trip')
      }
    },
    handleTripCreated() {
      this.showCreateModal = false
      this.fetchTrips()
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
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
  align-items: center;
  margin-bottom: $spacing-xl;

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    gap: $spacing-md;
    align-items: flex-start;
  }

  h1 {
    margin: 0;
  }
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

.actions-cell {
  display: flex;
  gap: $spacing-sm;
}

.trip-card {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-md;

    h3 {
      margin: 0;
      font-size: 1.125rem;
    }
  }

  &-body {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  &-row {
    display: flex;
    justify-content: space-between;
    padding: $spacing-sm 0;
    border-bottom: 1px solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 600;
      color: $text-secondary;
      font-size: 0.875rem;
    }

    .value {
      color: $text-primary;
      font-size: 0.875rem;
      text-align: right;
    }
  }

  &-actions {
    display: flex;
    gap: $spacing-sm;
    margin-top: $spacing-md;
    padding-top: $spacing-md;
    border-top: 1px solid $border-color;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-md;
  margin-top: $spacing-xl;

  .page-info {
    font-size: 0.875rem;
    color: $text-secondary;
  }
}
</style>
