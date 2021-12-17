<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import SearchInput from './components/SearchInput.vue'
import RightBar from './components/RightBar.vue'
import { RouteName } from '@/enum/route'
</script>

<template>
  <div class="header_wrap">
    <div class="header_inner my-container">
      <div class="logo">
        <h1>
          <router-link :to="{ name: RouteName.HOME_NAME }">
            <img
              src="@/assets/logo.png"
              alt="forum"
              title="forum"
              class="hidden-xs-only"
            />
            <img
              src="@/assets/logo-first.png"
              alt="forum"
              title="forum"
              class="hidden-sm-and-up"
            />
          </router-link>
        </h1>
        <h2>
          <router-link :to="{ name: RouteName.HOME_NAME }">Forum</router-link>
        </h2>
      </div>
      <NavBar />
      <SearchInput />
      <RightBar />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header_wrap {
  height: 45px;
  .header_inner {
    margin: 0 auto;
    height: 45px;
    display: flex;
    justify-content: space-between;
    height: inherit;
    align-items: center;

    .logo {
      height: 30px;
      h1 {
        height: 100%;
        img {
          height: 100%;
        }
      }
      h2 {
        display: none;
      }
    }
  }
}
</style>
