<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <h1>Clients Management</h1>
        <base-button @click="showCreateModal = true">
          + New Client
        </base-button>
      </div>

      <responsive-data-view
        :data="clients"
        :columns="columns"
        :loading="loading"
        empty-message="No clients found"
      >
        <template #cell-loanLimit="{ value }">
          {{ value ? formatCurrency(value) : '-' }}
        </template>

        <template #cell-maxMonthlyCommitment="{ value }">
          {{ value ? formatCurrency(value) : '-' }}
        </template>

        <template #card="{ item }">
          <div class="client-card">
            <div class="client-card-header">
              <h3>{{ item.name }}</h3>
            </div>
            <div class="client-card-body">
              <div class="client-card-row">
                <span class="label">Phone:</span>
                <span class="value">{{ item.phoneNumber }}</span>
              </div>
              <div class="client-card-row">
                <span class="label">Loan Limit:</span>
                <span class="value">{{ item.loanLimit ? formatCurrency(item.loanLimit) : '-' }}</span>
              </div>
              <div class="client-card-row">
                <span class="label">Max Monthly:</span>
                <span class="value">{{ item.maxMonthlyCommitment ? formatCurrency(item.maxMonthlyCommitment) : '-' }}</span>
              </div>
            </div>
          </div>
        </template>
      </responsive-data-view>

      <!-- Create Client Modal -->
      <create-client-modal
        v-if="showCreateModal"
        @close="showCreateModal = false"
        @created="handleClientCreated"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ResponsiveDataView from '../components/ResponsiveDataView.vue'
import BaseButton from '../components/BaseButton.vue'
import CreateClientModal from '../components/CreateClientModal.vue'

export default {
  name: 'Clients',
  components: {
    ResponsiveDataView,
    BaseButton,
    CreateClientModal
  },
  data() {
    return {
      showCreateModal: false,
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'phoneNumber', label: 'Phone Number' },
        { key: 'loanLimit', label: 'Loan Limit' },
        { key: 'maxMonthlyCommitment', label: 'Max Monthly Commitment' }
      ]
    }
  },
  computed: {
    ...mapState('clients', ['clients', 'loading'])
  },
  mounted() {
    this.$store.dispatch('clients/fetchClients')
  },
  methods: {
    handleClientCreated() {
      this.showCreateModal = false
      this.$store.dispatch('clients/fetchClients')
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
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

.client-card {
  &-header {
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
}
</style>
