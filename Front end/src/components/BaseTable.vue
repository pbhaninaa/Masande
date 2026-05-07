<template>
  <div class="table-wrapper">
    <div v-if="loading" class="loading-state">
      <div class="spinner-large"></div>
    </div>
    <div v-else-if="!data || data.length === 0" class="empty-state">
      <p>{{ emptyMessage }}</p>
    </div>
    <table v-else class="table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" :class="column.headerClass">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in data"
          :key="getKey(item)"
          :class="{ 'row-clickable': clickable }"
          @click="handleRowClick(item)"
        >
          <td v-for="column in columns" :key="column.key" :class="column.cellClass">
            <slot :name="`cell-${column.key}`" :item="item" :value="getValue(item, column.key)">
              {{ getValue(item, column.key) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'BaseTable',
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
    handleRowClick(item) {
      if (this.clickable) {
        this.$emit('row-click', item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  background-color: $bg-primary;
  border-radius: $border-radius;
  box-shadow: $shadow;
}

.table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: $bg-secondary;

    th {
      padding: 0.75rem 1rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: $text-secondary;
      border-bottom: 1px solid $border-color;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid $border-color;
      transition: background-color 0.15s;

      &:hover {
        background-color: $bg-secondary;
      }

      &.row-clickable {
        cursor: pointer;
      }
    }

    td {
      padding: 1rem;
      font-size: 0.875rem;
      color: $text-primary;
    }
  }
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
