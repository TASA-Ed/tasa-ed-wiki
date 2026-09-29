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
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none !important;
  color: inherit;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
  gap: 12px;
  margin-bottom: 8px;
}

/* 悬停微动效与浅阴影 */
.link-card:hover {
  border-color: #cbd5e1;
  background-color: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.link-card:hover .link-card-arrow {
  transform: translateX(3px);
  color: #1e293b;
}

.link-card-content {
  flex: 1;
  min-width: 0;
}

.link-card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-card-desc {
  margin-top: 4px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
