<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Trip Details</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <div v-if="trip" class="trip-details">
          <!-- Basic Info -->
          <div class="detail-section">
            <h3>Basic Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Customer</label>
                <p>{{ trip.customerName }}</p>
              </div>
              <div class="detail-item">
                <label>Tenant</label>
                <p v-if="tenant">{{ tenant.name }}</p>
                <p v-else>Unknown</p>
              </div>
              <div class="detail-item">
                <label>Status</label>
                <p>
                  <span :class="['status-badge', `status-${trip.status.toLowerCase()}`]">
                    {{ trip.status }}
                  </span>
                </p>
              </div>
              <div class="detail-item">
                <label>Destination</label>
                <p>{{ trip.destination }}</p>
              </div>
            </div>
          </div>

          <!-- Dates -->
          <div class="detail-section">
            <h3>Travel Dates</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Departure Date</label>
                <p>{{ formatDate(trip.departureDate) }}</p>
              </div>
              <div class="detail-item">
                <label>Return Date</label>
                <p>{{ formatDate(trip.returnDate) }}</p>
              </div>
              <div class="detail-item">
                <label>Days</label>
                <p>{{ calculateDays(trip.departureDate, trip.returnDate) }}</p>
              </div>
            </div>
          </div>

          <!-- Financial Info -->
          <div class="detail-section">
            <h3>Financial Information</h3>
            <div class="detail-grid">
              <div class="detail-item highlight">
                <label>Loan Amount</label>
                <p class="amount">{{ formatCurrency(trip.loanAmount) }}</p>
              </div>
              <div class="detail-item highlight">
                <label>Total Amount</label>
                <p class="amount">{{ formatCurrency(trip.totalAmount) }}</p>
              </div>
              <div class="detail-item">
                <label>Additional Charges</label>
                <p class="amount">{{ formatCurrency(trip.totalAmount - trip.loanAmount) }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div v-if="trip.status === 'PENDING'" class="action-section">
            <div class="action-buttons">
              <base-button @click="handleApprove" variant="success">
                ✓ Approve Trip
              </base-button>
              <base-button @click="handleReject" variant="danger">
                ✗ Reject Trip
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from './BaseButton.vue'

export default {
  name: 'TripDetailsModal',
  components: {
    BaseButton
  },
  props: {
    trip: {
      type: Object,
      required: true
    },
    tenant: {
      type: Object,
      default: null
    }
  },
  methods: {
    handleApprove() {
      if (!confirm('Are you sure you want to approve this trip?')) return
      this.$emit('approve', this.trip.id)
    },
    handleReject() {
      if (!confirm('Are you sure you want to reject this trip?')) return
      this.$emit('reject', this.trip.id)
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
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    calculateDays(startDate, endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      return `${days} day${days !== 1 ? 's' : ''}`
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: $spacing-lg;
}

.modal-content {
  background-color: $bg-primary;
  border-radius: $border-radius;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: $shadow-lg;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 1px solid $border-color;
  background-color: $bg-secondary;

  h2 {
    margin: 0;
    font-size: 1.25rem;
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: $text-secondary;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba($danger, 0.1);
    color: $danger;
  }
}

.modal-body {
  padding: $spacing-lg;
}

.trip-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.detail-section {
  h3 {
    margin: 0 0 $spacing-md 0;
    font-size: 1rem;
    font-weight: 600;
    color: $text-primary;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid $border-color;
    padding-bottom: $spacing-sm;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-md;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  padding: $spacing-md;
  background-color: $bg-secondary;
  border-radius: $border-radius;
  border: 1px solid $border-color;

  &.highlight {
    border-color: $primary;
    background-color: rgba($primary, 0.05);
  }

  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: $text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  p {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: $text-primary;

    &.amount {
      font-size: 1.25rem;
      font-weight: 700;
      color: $primary;
    }
  }

  .status-badge {
    display: inline-block;
    padding: $spacing-xs $spacing-sm;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    width: fit-content;

    &.status-pending {
      background-color: rgba($warning, 0.2);
      color: darken($warning, 10%);
    }

    &.status-approved {
      background-color: rgba($success, 0.2);
      color: darken($success, 10%);
    }

    &.status-rejected {
      background-color: rgba($danger, 0.2);
      color: darken($danger, 10%);
    }

    &.status-completed {
      background-color: rgba($info, 0.2);
      color: darken($info, 10%);
    }

    &.status-cancelled {
      background-color: rgba($secondary, 0.2);
      color: darken($secondary, 10%);
    }
  }
}

.action-section {
  border-top: 1px solid $border-color;
  padding-top: $spacing-lg;
  margin-top: $spacing-lg;
}

.action-buttons {
  display: flex;
  gap: $spacing-md;
  flex-wrap: wrap;

  button {
    flex: 1;
    min-width: 150px;
  }
}
</style>
