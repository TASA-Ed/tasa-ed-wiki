<template>
  <div class="info-card" @click="handleClick">
    <div class="card-content">
      <span class="card-title">{{ title }}</span>
      <span class="card-divider">|</span>
      <span class="card-description">{{ description }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  link: string
  target?: '_blank' | '_self'
}

const props = withDefaults(defineProps<Props>(), {
  target: '_self'
})

const handleClick = () => {
  if (props.target === '_blank') {
    window.open(props.link, '_blank')
  } else {
    window.location.href = props.link
  }
}
</script>

<style scoped lang="scss">
.info-card {
  // 使用 CSS 变量以便在深色模式下切换
  --card-bg: white;
  --card-border: #e8e8e8;
  --card-shadow: rgba(0, 0, 0, 0.1);
  --card-shadow-hover: rgba(0, 0, 0, 0.15);
  --title-color: #1890ff;
  --divider-color: #d9d9d9;
  --description-color: #8c8c8c;

  background: var(--card-bg);
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px var(--card-shadow);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--card-border);
  margin-bottom: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--card-shadow-hover);
  }

  .card-content {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;

    .card-title {
      color: var(--title-color);
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
    }

    .card-divider {
      color: var(--divider-color);
      font-size: 14px;
      font-weight: 300;
    }

    .card-description {
      color: var(--description-color);
      font-size: 14px;
      flex: 1;
      min-width: 200px;
    }
  }

  // 深色模式适配
  [data-theme="dark"] & {
    --card-bg: #1f1f1f;
    --card-border: #303030;
    --card-shadow: rgba(0, 0, 0, 0.3);
    --card-shadow-hover: rgba(0, 0, 0, 0.5);
    --title-color: #40a9ff;
    --divider-color: #434343;
    --description-color: #a6a6a6;
  }
}
</style>
