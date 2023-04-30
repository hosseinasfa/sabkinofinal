export default function () {
  return {
    provinceList: [],
    cityList: [],
    serviceList: [],
    selectedProvinceId: '',
    selectedCityId: '',
    profileInfo:{
      doctors:[]
    },
    table: {
      loading: true,
      title: '',
      filter: '',
      mode: '',
      url: ``,
      columns: [],
      data: [],
      itemId: '',
      form: []
    },
  }
}
