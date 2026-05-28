<template>
  <div class="routes-page">
    <div class="page-header">
      <h1>Lift Routes</h1>
      <base-button @click="showCreateModal = true">
        Add New Route
      </base-button>
    </div>

    <div v-if="loading" class="loading">Loading routes...</div>

    <div v-else-if="routes.length === 0" class="empty-state">
      <p>No routes yet. Create your first lift route!</p>
    </div>

    <div v-else class="routes-grid">
      <div
        v-for="route in routes"
        :key="route.id"
        class="route-card"
        :class="{ inactive: !route.active }"
      >
        <div class="route-header">
          <h3>{{ route.routeName }}</h3>
          <span v-if="!route.active" class="inactive-badge">Inactive</span>
        </div>

        <div class="route-details">
          <div class="detail-row">
            <span class="label">From:</span>
            <span class="value">{{ route.pickupLocation }}</span>
          </div>
          <div class="detail-row">
            <span class="label">To:</span>
            <span class="value">{{ route.dropoffLocation }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Price per lift:</span>
            <span class="value">R{{ route.pricePerLift }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Morning pickup:</span>
            <span class="value">{{ route.morningPickupTime }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Afternoon pickup:</span>
            <span class="value">{{ route.afternoonPickupTime }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Active days:</span>
            <span class="value">{{ formatActiveDays(route.activeDays) }}</span>
          </div>
        </div>

        <div class="route-actions">
          <base-button variant="outline" size="small" @click="editRoute(route)">
            Edit
          </base-button>
          <base-button
            variant="outline"
            size="small"
            @click="toggleRouteStatus(route)"
          >
            {{ route.active ? 'Deactivate' : 'Activate' }}
          </base-button>
          <base-button
            variant="danger"
            size="small"
            @click="confirmDelete(route)"
          >
            Delete
          </base-button>
        </div>
      </div>
    </div>

    <create-route-modal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleRouteCreated"
    />

    <edit-route-modal
      v-if="showEditModal"
      :route="selectedRoute"
      @close="showEditModal = false"
      @updated="handleRouteUpdated"
    />
  </div>
</template>

<script>
import BaseButton from '../components/BaseButton.vue'
import CreateRouteModal from '../components/CreateRouteModal.vue'
import EditRouteModal from '../components/EditRouteModal.vue'
import apiClient from '@/services/api'

export default {
  name: 'Routes',
  components: {
    BaseButton,
    CreateRouteModal,
    EditRouteModal
  },
  data() {
    return {
      routes: [],
      loading: false,
      showCreateModal: false,
      showEditModal: false,
      selectedRoute: null
    }
  },
  mounted() {
    this.fetchRoutes()
  },
  methods: {
    async fetchRoutes() {
      this.loading = true
      try {
        const response = await apiClient.get('/api/routes')
        this.routes = response.data
      } catch (error) {
        console.error('Failed to fetch routes:', error)
      } finally {
        this.loading = false
      }
    },
    editRoute(route) {
      this.selectedRoute = route
      this.showEditModal = true
    },
    async toggleRouteStatus(route) {
      try {
        await apiClient.patch(`/api/routes/${route.id}/toggle-status`)
        await this.fetchRoutes()
      } catch (error) {
        console.error('Failed to toggle route status:', error)
      }
    },
    async confirmDelete(route) {
      if (confirm(`Are you sure you want to delete route "${route.routeName}"?`)) {
        try {
          await apiClient.delete(`/api/routes/${route.id}`)
          await this.fetchRoutes()
        } catch (error) {
          console.error('Failed to delete route:', error)
        }
      }
    },
    handleRouteCreated() {
      this.showCreateModal = false
      this.fetchRoutes()
    },
    handleRouteUpdated() {
      this.showEditModal = false
      this.fetchRoutes()
    },
    formatActiveDays(days) {
      return days.replace(/,/g, ', ')
    }
  }
}
</script>

<style lang="scss" scoped>
.routes-page {
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

.loading,
.empty-state {
  text-align: center;
  padding: $spacing-xl;
  color: $text-secondary;
}

.routes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
}

.route-card {
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  padding: $spacing-lg;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: $shadow-md;
  }

  &.inactive {
    opacity: 0.6;
  }
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $border-color;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    color: $text-primary;
  }

  .inactive-badge {
    background-color: rgba($danger, 0.1);
    color: $danger;
    padding: 0.25rem 0.5rem;
    border-radius: $border-radius;
    font-size: 0.75rem;
    font-weight: 600;
  }
}

.route-details {
  margin-bottom: $spacing-md;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;

  .label {
    color: $text-secondary;
    font-size: 0.875rem;
  }

  .value {
    color: $text-primary;
    font-weight: 500;
  }
}

.route-actions {
  display: flex;
  gap: $spacing-sm;
  padding-top: $spacing-md;
  border-top: 1px solid $border-color;
}
</style>
