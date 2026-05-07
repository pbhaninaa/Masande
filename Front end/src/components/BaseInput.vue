<template>
  <div class="input-group">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="['input', { 'input-error': error }]"
      @input="$emit('input', $event.target.value)"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
    <span v-else-if="helperText" class="helper-text">{{ helperText }}</span>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    id: String,
    label: String,
    type: {
      type: String,
      default: 'text'
    },
    value: [String, Number],
    placeholder: String,
    disabled: Boolean,
    required: Boolean,
    error: String,
    helperText: String
  }
}
</script>

<style lang="scss" scoped>
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: $spacing-md;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: $spacing-xs;

  .required {
    color: $danger;
  }
}

.input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  background-color: $bg-primary;
  color: $text-primary;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba($primary, 0.1);
  }

  &:disabled {
    background-color: $bg-tertiary;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &-error {
    border-color: $danger;
    &:focus {
      border-color: $danger;
      box-shadow: 0 0 0 3px rgba($danger, 0.1);
    }
  }
}

.error-message {
  margin-top: $spacing-xs;
  font-size: 0.875rem;
  color: $danger;
}

.helper-text {
  margin-top: $spacing-xs;
  font-size: 0.875rem;
  color: $text-secondary;
}
</style>
