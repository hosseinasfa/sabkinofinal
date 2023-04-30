export function setServiceList(state, list) {
  var filterList = [];
  list.forEach(element => {
    filterList.push({
      label: element.title,
      value: element.id,
    })
  });
  state.serviceList = filterList;
}
export function setProvinceList(state, list) {
  var filterList = [];
  list.forEach(element => {
    filterList.push({
      label: element.title,
      value: element._id,
    })
  });
  state.provinceList = filterList;
}
export function setCityList(state, list) {
  var filterList = [];
  list.forEach(element => {
    filterList.push({
      label: element.title,
      value: element._id,
    })
  });
  state.cityList = filterList;
}
export function setTable(state, object) {
  state.table = object;
}
export function setTableProps(state, params) {
  state.table[params.key]=params.value;
}
export function setTableFormOptions(state, params) {
  var filterList = [];
  params.list.forEach(element => {
    filterList.push({
      label: element.title,
      value: element._id,
    })
  });
  state.table.form.find((x) => x.field == params.field).options = filterList;
  if (params.setEmpty == true) {
    state.table.form.find((x) => x.field == params.field).model = '';
  }

}
export function setTableFormModelEmpty(state) {
  state.table.form.forEach(element => {
    if(element.isFile){
        element.model = null;
        element.filename = '';
        element.src = '';
    }else{
        element.model = ''
    }
    
  });
}
export function setTableFormEachModel(state, params) {
  var each = state.table.form.find((x) => x.field == params.field);
  each.model = params.model;
  if (each.isFile == true) {
    if(each.model){
        var formData = new FormData();
        formData.set('file', each.model);
        this._vm.$axios.post('/upload/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          this.commit('publicData/setTableFormEachFile', {
            field: params.field,
            file: response.data.data.file,
          });
    
        })
    }
    
  }
}

export function setTableFormEachFile(state, params) {
  var each = state.table.form.find((x) => x.field == params.field);
  each.src = params.file.url;
  each.filename = params.file.filename;
}


export function setTableFormFileEachModel(state, params) {
  state.table.form.find((x) => x.field == params.field).model = params.model;
  state.table.form.find((x) => x.field == params.field).src = params.src;
  state.table.form.find((x) => x.field == params.field).filename = params.filename;
}

export function setTableData(state, list) {
  state.table.data = list
}
export function pushTableData(state, data) {
    state.table.data.push(data)
  }
export function setTableDataEach(state, params) {
  for (const [key, value] of Object.entries(params.data)) {
    state.table.data.find((x) => x._id == params.itemId)[key]=value;
  }
}
export function setTableLoading(state, loading) {
  state.table.loading = loading;
}
export function setProfileInfo(state, object) {
  state.profileInfo = object
}
export function setProfileInfoWithKey(state, object) {
  state.profileInfo[object.key] = object.value
}
export function someMutation4( /* state */ ) {}
