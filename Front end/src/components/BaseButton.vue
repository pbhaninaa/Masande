<template>
  <button
    :class="['btn', `btn-${variant}`, `btn-${size}`, { 'btn-loading': loading }]"
    :disabled="disabled || loading"
    :type="type"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner"></span>
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'success', 'danger', 'outline', 'ghost'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: value => ['sm', 'md', 'lg'].includes(value)
    },
    type: {
      type: String,
      default: 'button'
    },
    disabled: Boolean,
    loading: Boolean
  }
}
</script>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: $border-radius;
  border: 1px solid transparent;
  transition: all 0.2s;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &-primary {
    background-color: $primary;
    color: white;
    &:hover:not(:disabled) {
      background-color: $primary-dark;
    }
  }

  &-secondary {
    background-color: $secondary;
    color: white;
    &:hover:not(:disabled) {
      background-color: darken($secondary, 10%);
    }
  }

  &-success {
    background-color: $success;
    color: white;
    &:hover:not(:disabled) {
      background-color: darken($success, 10%);
    }
  }

  &-danger {
    background-color: $danger;
    color: white;
    &:hover:not(:disabled) {
      background-color: darken($danger, 10%);
    }
  }

  &-outline {
    background-color: transparent;
    border-color: $border-color;
    color: $text-primary;
    &:hover:not(:disabled) {
      background-color: $bg-tertiary;
    }
  }

  &-ghost {
    background-color: transparent;
    color: $text-primary;
    &:hover:not(:disabled) {
      background-color: $bg-tertiary;
    }
  }

  &-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  &-md {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  &-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }

  &-loading {
    position: relative;
    color: transparent;
  }
}

.spinner {
  position: absolute;
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
