<template>
  <div class="responsive-data-view">
    <!-- Desktop Table View -->
    <div class="desktop-view">
      <base-table
        :data="data"
        :columns="columns"
        :loading="loading"
        :clickable="clickable"
        :empty-message="emptyMessage"
        @row-click="$emit('row-click', $event)"
      >
        <template v-for="column in columns" :slot="`cell-${column.key}`" slot-scope="{ item, value }">
          <slot :name="`cell-${column.key}`" :item="item" :value="value">
            {{ value }}
          </slot>
        </template>
      </base-table>
    </div>

    <!-- Mobile Card View -->
    <div class="mobile-view">
      <div v-if="loading" class="loading-state">
        <div class="spinner-large"></div>
      </div>
      <div v-else-if="!data || data.length === 0" class="empty-state">
        <p>{{ emptyMessage }}</p>
      </div>
      <div v-else class="cards-container">
        <base-card
          v-for="item in data"
          :key="getKey(item)"
          :clickable="clickable"
          @click="handleCardClick(item)"
        >
          <slot name="card" :item="item">
            <div class="card-row" v-for="column in columns" :key="column.key">
              <span class="card-label">{{ column.label }}:</span>
              <span class="card-value">
                <slot :name="`cell-${column.key}`" :item="item" :value="getValue(item, column.key)">
                  {{ getValue(item, column.key) }}
                </slot>
              </span>
            </div>
          </slot>
        </base-card>
      </div>
    </div>
  </div>
</template>

<script>
import BaseTable from './BaseTable.vue'
import BaseCard from './BaseCard.vue'

export default {
  name: 'ResponsiveDataView',
  components: {
    BaseTable,
    BaseCard
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      required: true
    },
    keyField: {
      type: String,
      default: 'id'
    },
    loading: Boolean,
    clickable: Boolean,
    emptyMessage: {
      type: String,
      default: 'No data available'
    }
  },
  methods: {
    getKey(item) {
      return item[this.keyField]
    },
    getValue(item, key) {
      return key.split('.').reduce((obj, k) => obj?.[k], item) ?? '-'
    },
    handleCardClick(item) {
      if (this.clickable) {
        this.$emit('row-click', item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.desktop-view {
  display: block;

  @media (max-width: $breakpoint-md) {
    display: none;
  }
}

.mobile-view {
  display: none;

  @media (max-width: $breakpoint-md) {
    display: block;
  }
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid $border-color;

  &:last-child {
    border-bottom: none;
  }
}

.card-label {
  font-weight: 600;
  color: $text-secondary;
  font-size: 0.875rem;
}

.card-value {
  color: $text-primary;
  font-size: 0.875rem;
  text-align: right;
}

.loading-state,
.empty-state {
  padding: 3rem;
  text-align: center;
  color: $text-secondary;
}

.spinner-large {
  width: 3rem;
  height: 3rem;
  border: 3px solid $border-color;
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
