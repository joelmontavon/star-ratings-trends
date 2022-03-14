const RatesDistro = {
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
	    let self = this;
      return _.tail(_.map(agg(data, 'score', [ss.max, min, firstQuartile, median, thirdQuartile], ['year']), function (item) {
        return [item[0], item[4], 'Mean: ' + self.toPercent(item[4]), item[1], item[2], item[3], item[4], item[5]];
      }));
    },
    toDataTable(data) {
      let dataTable = new google.visualization.DataTable();
      dataTable.addColumn('string', 'x');
      dataTable.addColumn('number', 'Average Rate');
	    dataTable.addColumn({type:'string', role:'tooltip'})
      dataTable.addColumn({id:'max', type:'number', role:'interval'});
      dataTable.addColumn({id:'min', type:'number', role:'interval'});
      dataTable.addColumn({id:'firstQuartile', type:'number', role:'interval'});
      dataTable.addColumn({id:'median', type:'number', role:'interval'});
      dataTable.addColumn({id:'thirdQuartile', type:'number', role:'interval'});
      dataTable.addRows(data);
      return dataTable;
    },
    drawChart(dataTable) {
        let options = {
          title: 'Measure Rates (2018-2022)',
          height: 240,
          legend: {position: 'none'},
          hAxis: {
            gridlines: {color: '#fff'}
          },
          vAxis: {
			      title: 'Rate',
            format: 'percent'
          },
          lineWidth: 0,
          series: [{'color': '16D511'}],
          intervals: {
            barWidth: 1,
            boxWidth: 1,
            lineWidth: 2,
            style: 'boxes'
          },
          interval: {
            max: {
              style: 'bars',
              fillOpacity: 1,
              color: '#777'
            },
            min: {
              style: 'bars',
              fillOpacity: 1,
              color: '#777'
            }
          },
          animation:{
            duration: 1000,
            //easing: 'out',
            startup: true
          }
        };
        let chart = new google.visualization.LineChart(this.$el);
        chart.draw(dataTable, options);
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
