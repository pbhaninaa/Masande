<template>
  <div class="autocomplete" v-click-outside="close">
    <base-input
      :id="id"
      :label="label"
      :placeholder="placeholder"
      :required="required"
      :error="error"
      :value="searchQuery"
      @input="handleInput"
      @focus="open"
    />
    <div v-if="isOpen && filteredOptions.length > 0" class="dropdown">
      <div
        v-for="option in filteredOptions"
        :key="option[valueKey]"
        class="dropdown-item"
        @click="selectOption(option)"
      >
        {{ option[labelKey] }}
      </div>
    </div>
    <div v-if="isOpen && filteredOptions.length === 0 && searchQuery" class="dropdown">
      <div class="dropdown-item-empty">No options found</div>
    </div>
  </div>
</template>

<script>
import BaseInput from './BaseInput.vue'

export default {
  name: 'BaseAutoComplete',
  components: {
    BaseInput
  },
  props: {
    id: String,
    label: String,
    placeholder: String,
    required: Boolean,
    error: String,
    value: [Object, null],
    options: {
      type: Array,
      default: () => []
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    valueKey: {
      type: String,
      default: 'value'
    }
  },
  data() {
    return {
      isOpen: false,
      searchQuery: this.value ? this.value[this.labelKey] : ''
    }
  },
  computed: {
    filteredOptions() {
      if (!this.searchQuery) return this.options
      const query = this.searchQuery.toLowerCase()
      return this.options.filter(option =>
        option[this.labelKey].toLowerCase().includes(query)
      )
    }
  },
  watch: {
    value(newValue) {
      this.searchQuery = newValue ? newValue[this.labelKey] : ''
    }
  },
  methods: {
    handleInput(value) {
      this.searchQuery = value
      this.isOpen = true
      if (!value) {
        this.$emit('input', null)
      }
    },
    selectOption(option) {
      this.searchQuery = option[this.labelKey]
      this.$emit('input', option)
      this.close()
    },
    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    }
  },
  directives: {
    'click-outside': {
      bind(el, binding) {
        el.clickOutsideEvent = event => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value()
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unbind(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.autocomplete {
  position: relative;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 15rem;
  overflow-y: auto;
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  box-shadow: $shadow-lg;
  z-index: 10;
  margin-top: $spacing-xs;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.15s;
  font-size: 0.875rem;

  &:hover {
    background-color: $bg-secondary;
  }
}

.dropdown-item-empty {
  padding: 0.75rem 1rem;
  color: $text-secondary;
  font-size: 0.875rem;
}
</style>
