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
  background: white;
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
  margin-bottom: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .card-content {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;

    .card-title {
      color: #1890ff;
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
    }

    .card-divider {
      color: #d9d9d9;
      font-size: 14px;
      font-weight: 300;
    }

    .card-description {
      color: #8c8c8c;
      font-size: 14px;
      flex: 1;
      min-width: 200px;
    }
  }
}
</style>
