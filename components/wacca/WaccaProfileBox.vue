<template>
  <div class="profile-box-wrapper">
    <div class="profile-box slanted">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@mixin slanted($dist) {
}

.profile-box {
  position: relative;
  display: inline-block;
  font-weight: 700;
  font-size: 2rem;
  color: white;
  padding: 10px 40px;
  z-index: 0;

  &.slanted {
    @include slanted(30px);
  }
}
.profile-box:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(var(--v-theme-boxcolor), 0.8);
  transform: skew(-20deg);
  z-index: -1;
}

.v-theme--waccaOled .profile-box:after {
  border: 1px solid white;
}
</style>
