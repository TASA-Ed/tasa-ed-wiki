<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    required: true
  },
  target: {
    type: String,
    default: '_blank'
  }
})

// 当 target="_blank" 时自动加上安全属性，防范钓鱼与性能问题
const relAttr = computed(() => {
  return props.target === '_blank' ? 'noopener noreferrer' : undefined
})
</script>

<template>
  <a
    :href="link"
    :target="target"
    :rel="relAttr"
    class="link-card"
  >
    <div class="link-card-content">
      <div class="link-card-title">{{ title }}</div>
      <div v-if="description" class="link-card-desc">{{ description }}</div>
    </div>
  </a>
</template>

<style scoped>
.link-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  text-decoration: none !important;
  color: inherit;
  transition:
    background-color var(--vp-t-color, 0.2s ease),
    border-color var(--vp-t-color, 0.2s ease),
    box-shadow var(--vp-t-transform, 0.2s ease),
    transform var(--vp-t-transform, 0.2s ease);
  box-sizing: border-box;
  gap: 12px;
  margin-bottom: 8px;
  box-shadow: 0 1px 2px 1px var(--vp-c-shadow);
}

.link-card:hover {
  border-color: var(--vp-c-border-hard);
  background-color: var(--vp-c-bg-elv);
  background-image: linear-gradient(var(--vp-c-control-hover), var(--vp-c-control-hover));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--vp-c-shadow);
}

.link-card:focus-visible {
  outline: 2px solid var(--vp-c-accent);
  outline-offset: 2px;
}

.link-card:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px var(--vp-c-shadow);
}

@media (prefers-reduced-motion: reduce) {
  .link-card {
    transition: none;
  }

  .link-card:hover,
  .link-card:active {
    transform: none;
  }
}

.link-card:hover .link-card-arrow {
  transform: translateX(3px);
  color: var(--vp-c-text);
}

.link-card-content {
  flex: 1;
  min-width: 0;
}

.link-card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-card-desc {
  margin-top: 4px;
  font-size: 13px;
  color: var(--vp-c-text-mute);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
