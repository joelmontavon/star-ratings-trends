const RatesAvg = {
  template: '<div></div>',
  props: ['myData'],
  watch: {
    myData(newVal, oldVal) {
      this.updateChart();
    }
  },
  methods: {
  	toPercent(n) {
  		return String(Math.round(n * 100)) + '%';
  	},
    aggregateData(data) {
  	  let self = this,
        result = agg(data, 'score', [ss.mean], ['year']);
  	  result.shift();
      result.forEach(function (item) {
  		  item.push(self.toPercent(item[1]));
  		    return item;
  	  });
  	  return result;
    },
    toDataTable(data) {
      let dataTable = new google.visualization.DataTable();
      dataTable.addColumn('string', 'year');
      dataTable.addColumn('number', 'Average Rate');
	    dataTable.addColumn({type:'string', role:'tooltip'});
      dataTable.addRows(data);
      return dataTable;
    },
    drawChart(data) {
      let options = {
        title: 'Average Measure Rates (2018-2022)',
		    height: 240,
        vAxis: {title: 'Rate', format: 'percent', minValue: 0.7, maxValue: 1},
        hAxis: {title: 'Year'},
		    legend: {position: 'none'},
		    colors: ['0995E5'],
        /*animation:{
          duration: 1000,
          easing: 'out',
          startup: true
        }*/
      };
      let chart = new google.visualization.LineChart(this.$el);
      chart.draw(data, options);
    },
    updateChart() {
      try {
        let data = this.aggregateData(this.myData),
          dataTable = this.toDataTable(data);
        this.drawChart(dataTable);
      } catch {}
    }
  },
  mounted() {
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(this.updateChart);
  }
}
