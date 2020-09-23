<template>
  <div>
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="city in cities" :key="city" :label="city">{{ city }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
export default {
  props: ['options', 'editOptions'],
  data() {
    return {
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: true
    }
  },
  watch: {
    checkedCities(newValue) {
      this.$emit('getOptions', this.checkedCities)
    },
    editOptions(newValue) {
      this.checkedCities = newValue
    }
  },
  mounted () {
    this.cities = this.options
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.options : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    }
  }
}
</script>
