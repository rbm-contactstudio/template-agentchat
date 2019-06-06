<template>
  <div>
    <div class="cs-content">
      <div class="form-group" v-for="(dt, idx) in contact.data">
        <div class="input-group">
          <div class="input-group-addon minwidth">{{ idx }}</div>
          <input type="text" class="form-control" :value="dt">
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .cs-content{
    padding: 10px;
  }
  .minwidth{
    min-width: 150px;
    text-align: right;
  }
</style>

<script>

  export default {
    props: {
      contact: {
        required: true,
        type: Object
      }
    }
  }
</script>