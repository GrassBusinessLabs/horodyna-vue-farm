<template>
   <home-layout>
      <h1 class="centered-text">MAP</h1>
      <app-map-example />
   </home-layout>
</template>
<script setup>
import AppMapExample from '@/components/AppMapExample.vue'
import HomeLayout from '@/layouts/HomeLayout.vue'
</script>
<style>
.centered-text {
   text-align: center;
}
</style>
