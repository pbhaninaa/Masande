<template>
  <div :class="['card', { 'card-clickable': clickable }]" @click="handleClick">
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
      </slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    title: String,
    clickable: Boolean
  },
  methods: {
    handleClick() {
      if (this.clickable) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  box-shadow: $shadow-sm;
  overflow: hidden;

  &-clickable {
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      box-shadow: $shadow-md;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.card-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid $border-color;
  background-color: $bg-secondary;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: $text-primary;
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid $border-color;
  background-color: $bg-secondary;
}
</style>
