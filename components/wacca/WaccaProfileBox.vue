<template>
  <div class="profile-box-wrapper">
    <div class="profile-box slanted">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@mixin slanted($dist) {
  clip-path: polygon($dist 0, 100% 0, calc(100% - $dist) 100%, 0 100%);
  padding-left: $dist;
  padding-right: $dist;
}

.profile-box {
  display: inline-block;
  background: rgba(var(--v-theme-boxcolor), 0.8);
  font-weight: 700;
  font-size: 2rem;
  color: white;
  padding: 10px 40px;

  &.slanted {
    @include slanted(30px);
  }
}
</style>
