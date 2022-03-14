var App = {
  data() {
    return {
      data: {
        unfiltered: [],
        filtered: [],
		    cutpoints: ''
      },
      measure: {
        value: 'medication_adherence_for_diabetes_medications',
        options: [
          {
            value: "medication_adherence_for_diabetes_medications",
            label: 'PDC-DR',
          },
          {
            value: "medication_adherence_for_hypertension_ras_antagonists_",
            label: 'PDC-RASA',
          },
          {
            value: "medication_adherence_for_cholesterol_statins_",
            label: 'PDC-STA',
          }
        ]
      },
      lob: {
        value: 'all',
        options: [
          {
            value: 'all',
            label: 'All',
          },
          {
            value: 'mapd',
            label: 'MAPD',
          },
          {
            value: 'pdp',
            label: 'PDP',
          }
        ]
      }
    }
  },
  methods: {
    changed() {
      this.calc();
    },
    calc() {
      var self = this;
      data = self.data.unfiltered.filter(function(item) {
        return (item['contract_type'] == self.lob.value.toUpperCase() || self.lob.value == 'all')
          && item['measure'] == self.measure.value;
      }).filter(function (item) {
  		  return item.contract_id != 'CUTPOINTS' && item.score != null;
  	  });
      self.data.filtered = data;
      data = self.data.unfiltered.filter(function(item) {
        return (item['contract_type'] == self.lob.value.toUpperCase() || self.lob.value == 'all')
          && item['measure'] == self.measure.value;
      }).filter(function (item) {
		  return item.contract_id == 'CUTPOINTS' && item.score != null;
	  });
      self.data.cutpoints = data;
    }
  },
  mounted() {
    var self = this;
    Papa.parse('data/stars_data.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: function (result) {
        self.data.unfiltered = result.data;
        self.calc();
      }
    })
  }
}

var app = Vue.createApp(App);
app.use(ElementPlus);
app.component('rates-distro', RatesDistro);
app.component('rates-avg', RatesAvg);
app.component('stars-cutpoints', StarsCutpoints);
app.component('stars-distro', StarsDistro);
app.mount('#app')
