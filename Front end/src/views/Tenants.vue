<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <h1>Tenants Management</h1>
        <base-button @click="showCreateModal = true">
          + Create Tenant
        </base-button>
      </div>

      <responsive-data-view
        :data="tenants"
        :columns="columns"
        :loading="loading"
        empty-message="No tenants found"
      >
        <template #cell-isActive="{ value }">
          <span :class="['status-badge', value ? 'status-active' : 'status-inactive']">
            {{ value ? 'Active' : 'Inactive' }}
          </span>
        </template>

        <template #cell-actions="{ item }">
          <div class="actions-cell">
            <base-button variant="outline" size="sm" @click="handleView(item)">
              View
            </base-button>
            <base-button
              variant="ghost"
              size="sm"
              @click="handleEdit(item)"
            >
              Edit
            </base-button>
            <base-button
              v-if="item.isActive"
              variant="danger"
              size="sm"
              @click="handleDeactivate(item.id)"
            >
              Deactivate
            </base-button>
          </div>
        </template>

        <template #card="{ item }">
          <div class="tenant-card">
            <div class="tenant-card-header">
              <h3>{{ item.name }}</h3>
              <span :class="['status-badge', item.isActive ? 'status-active' : 'status-inactive']">
                {{ item.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="tenant-card-body">
              <div class="tenant-card-row">
                <span class="label">Code:</span>
                <span class="value">{{ item.code }}</span>
              </div>
              <div class="tenant-card-row">
                <span class="label">Contact Email:</span>
                <span class="value">{{ item.contactEmail || '-' }}</span>
              </div>
              <div class="tenant-card-row">
                <span class="label">Contact Phone:</span>
                <span class="value">{{ item.contactPhone || '-' }}</span>
              </div>
            </div>
            <div class="tenant-card-actions">
              <base-button variant="outline" size="sm" @click="handleView(item)">
                View
              </base-button>
              <base-button variant="ghost" size="sm" @click="handleEdit(item)">
                Edit
              </base-button>
              <base-button
                v-if="item.isActive"
                variant="danger"
                size="sm"
                @click="handleDeactivate(item.id)"
              >
                Deactivate
              </base-button>
            </div>
          </div>
        </template>
      </responsive-data-view>

      <!-- Create Tenant Modal -->
      <create-tenant-modal
        v-if="showCreateModal"
        @close="showCreateModal = false"
        @created="handleTenantCreated"
      />

      <!-- Edit Tenant Modal -->
      <edit-tenant-modal
        v-if="showEditModal"
        :tenant="selectedTenant"
        @close="showEditModal = false"
        @updated="handleTenantUpdated"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ResponsiveDataView from '../components/ResponsiveDataView.vue'
import BaseButton from '../components/BaseButton.vue'
import CreateTenantModal from '../components/CreateTenantModal.vue'
import EditTenantModal from '../components/EditTenantModal.vue'

export default {
  name: 'Tenants',
  components: {
    ResponsiveDataView,
    BaseButton,
    CreateTenantModal,
    EditTenantModal
  },
  data() {
    return {
      showCreateModal: false,
      showEditModal: false,
      selectedTenant: null,
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'contactEmail', label: 'Email' },
        { key: 'contactPhone', label: 'Phone' },
        { key: 'isActive', label: 'Status' },
        { key: 'actions', label: 'Actions' }
      ]
    }
  },
  computed: {
    ...mapState('tenants', ['tenants', 'loading'])
  },
  mounted() {
    this.fetchTenants()
  },
  methods: {
    async fetchTenants() {
      try {
        await this.$store.dispatch('tenants/fetchTenants')
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to fetch tenants')
      }
    },
    handleView(tenant) {
      this.$router.push(`/tenants/${tenant.id}`)
    },
    handleEdit(tenant) {
      this.selectedTenant = tenant
      this.showEditModal = true
    },
    async handleDeactivate(id) {
      if (!confirm('Are you sure you want to deactivate this tenant?')) return

      try {
        await this.$store.dispatch('tenants/deleteTenant', id)
        alert('Tenant deactivated successfully')
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to deactivate tenant')
      }
    },
    handleTenantCreated() {
      this.showCreateModal = false
      this.fetchTenants()
    },
    handleTenantUpdated() {
      this.showEditModal = false
      this.selectedTenant = null
      this.fetchTenants()
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

  &.status-active {
    background-color: rgba($success, 0.1);
    color: darken($success, 10%);
  }

  &.status-inactive {
    background-color: rgba($secondary, 0.1);
    color: darken($secondary, 10%);
  }
}

.actions-cell {
  display: flex;
  gap: $spacing-sm;
}

.tenant-card {
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
</style>
