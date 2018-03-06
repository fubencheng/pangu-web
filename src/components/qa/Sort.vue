<template>
  <ul class="sort">
    <li v-bind:class="{ active: activeIndex == index }" class="sort-label" v-for="(sort,index) in sortList" v-bind:key="index" @click="onSelect(sort, index)">
      {{sort.categoryName}}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    'sortData': Array,
    'defaultIndex': Number
  },
  data() {
    return {
      sortList: this.sortData,
      activeIndex: this.defaultIndex ? this.defaultIndex : 0
    }
  },
  methods: {
    onSelect(row, index) {
      this.activeIndex = index;
      this.$emit('onSelect', row, index);
    }
  }
}
</script>

<style lang="scss" scoped>
.sort {
  .sort-label {
    font-size: 14px;
    display: inline-block;
    cursor: pointer;
    margin-right: 10px;
    border: 1px solid #e7e7e7;
    background-color: #f0f0f0;
    padding: 6px 20px;
    &:last-child {
       margin-right: 0;
    }
    &:hover {
       border: 1px solid #999;
    }
  }
}
</style>
