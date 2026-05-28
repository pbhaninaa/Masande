<template>
  <div class="confirmations-page">
    <div class="page-header">
      <h1>Daily Lift Confirmations</h1>
      <div class="date-selector">
        <base-input
          v-model="selectedDate"
          type="date"
          @input="fetchConfirmations"
        />
      </div>
    </div>

    <div v-if="loading" class="loading">Loading confirmations...</div>

    <div v-else-if="confirmations.length === 0" class="empty-state">
      <p>No lift confirmations for this date.</p>
    </div>

    <div v-else class="confirmations-table">
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Route</th>
            <th>Morning</th>
            <th>Afternoon</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="confirmation in confirmations" :key="confirmation.id">
            <td>{{ confirmation.client?.name || 'N/A' }}</td>
            <td>{{ confirmation.route?.routeName || 'N/A' }}</td>
            <td>
              <span
                class="badge"
                :class="confirmation.morningRequested ? 'badge-success' : 'badge-default'"
              >
                {{ confirmation.morningRequested ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>
              <span
                class="badge"
                :class="confirmation.afternoonRequested ? 'badge-success' : 'badge-default'"
              >
                {{ confirmation.afternoonRequested ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>R{{ confirmation.amountCharged || '0.00' }}</td>
            <td>
              <span
                class="badge"
                :class="getStatusBadgeClass(confirmation.status)"
              >
                {{ formatStatus(confirmation.status) }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <base-button
                  v-if="confirmation.status === 'CONFIRMED'"
                  variant="outline"
                  size="small"
                  @click="markAsCompleted(confirmation.id)"
                >
                  Complete
                </base-button>
                <base-button
                  v-if="confirmation.status === 'CONFIRMED'"
                  variant="danger"
                  size="small"
                  @click="markAsNoShow(confirmation.id)"
                >
                  No Show
                </base-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && confirmations.length > 0" class="summary">
      <div class="summary-card">
        <h3>Summary</h3>
        <div class="summary-row">
          <span>Total Confirmations:</span>
          <span>{{ confirmations.length }}</span>
        </div>
        <div class="summary-row">
          <span>Morning Lifts:</span>
          <span>{{ morningCount }}</span>
        </div>
        <div class="summary-row">
          <span>Afternoon Lifts:</span>
          <span>{{ afternoonCount }}</span>
        </div>
        <div class="summary-row">
          <span>Total Amount:</span>
          <span class="amount">R{{ totalAmount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import apiClient from '@/services/api'

export default {
  name: 'DailyConfirmations',
  components: {
    BaseInput,
    BaseButton
  },
  data() {
    return {
      confirmations: [],
      selectedDate: new Date().toISOString().split('T')[0],
      loading: false
    }
  },
  computed: {
    morningCount() {
      return this.confirmations.filter(c => c.morningRequested).length
    },
    afternoonCount() {
      return this.confirmations.filter(c => c.afternoonRequested).length
    },
    totalAmount() {
      return this.confirmations
        .reduce((sum, c) => sum + (parseFloat(c.amountCharged) || 0), 0)
        .toFixed(2)
    }
  },
  mounted() {
    this.fetchConfirmations()
  },
  methods: {
    async fetchConfirmations() {
      this.loading = true
      try {
        const response = await apiClient.get(`/api/lift-confirmations/date/${this.selectedDate}`)
        this.confirmations = response.data
      } catch (error) {
        console.error('Failed to fetch confirmations:', error)
      } finally {
        this.loading = false
      }
    },
    async markAsCompleted(confirmationId) {
      try {
        await apiClient.patch(`/api/lift-confirmations/${confirmationId}/complete`)
        await this.fetchConfirmations()
      } catch (error) {
        console.error('Failed to mark as completed:', error)
      }
    },
    async markAsNoShow(confirmationId) {
      if (confirm('Mark this lift as no-show?')) {
        try {
          await apiClient.patch(`/api/lift-confirmations/${confirmationId}/no-show`)
          await this.fetchConfirmations()
        } catch (error) {
          console.error('Failed to mark as no-show:', error)
        }
      }
    },
    formatStatus(status) {
      return status ? status.replace(/_/g, ' ') : 'UNKNOWN'
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case 'COMPLETED':
          return 'badge-success'
        case 'CONFIRMED':
          return 'badge-info'
        case 'CANCELLED':
          return 'badge-warning'
        case 'NO_SHOW':
          return 'badge-danger'
        default:
          return 'badge-default'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.confirmations-page {
  padding: $spacing-lg;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-xl;

  h1 {
    margin: 0;
    font-size: 2rem;
    color: $text-primary;
  }
}

.date-selector {
  width: 200px;
}

.loading,
.empty-state {
  text-align: center;
  padding: $spacing-xl;
  color: $text-secondary;
}

.confirmations-table {
  background-color: $bg-primary;
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: $shadow-sm;

  table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: $spacing-md;
      text-align: left;
      border-bottom: 1px solid $border-color;
    }

    th {
      background-color: $bg-secondary;
      font-weight: 600;
      color: $text-primary;
    }

    tbody tr:hover {
      background-color: $bg-secondary;
    }
  }
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: $border-radius;
  font-size: 0.75rem;
  font-weight: 600;

  &.badge-success {
    background-color: rgba($success, 0.1);
    color: $success;
  }

  &.badge-info {
    background-color: rgba($primary, 0.1);
    color: $primary;
  }

  &.badge-warning {
    background-color: rgba(#f59e0b, 0.1);
    color: #f59e0b;
  }

  &.badge-danger {
    background-color: rgba($danger, 0.1);
    color: $danger;
  }

  &.badge-default {
    background-color: $bg-tertiary;
    color: $text-secondary;
  }
}

.action-buttons {
  display: flex;
  gap: $spacing-sm;
}

.summary {
  margin-top: $spacing-xl;
}

.summary-card {
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  padding: $spacing-lg;
  max-width: 400px;

  h3 {
    margin: 0 0 $spacing-md 0;
    font-size: 1.25rem;
    color: $text-primary;
  }
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid $border-color;

  &:last-child {
    border-bottom: none;
    padding-top: $spacing-md;
    font-weight: 600;
  }

  .amount {
    color: $primary;
    font-size: 1.125rem;
  }
}
</style>
