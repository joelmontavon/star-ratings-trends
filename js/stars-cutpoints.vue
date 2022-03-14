const StarsCutpoints = {
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
  		let obj = {};
  		data.forEach(function (item) {
  			obj[item.year] = obj[item.year] || {};
  			obj[item.year][item.stars] = item.score;
  		});
  		return obj;
    },
    toDataTable(data) {
  		let dataTable = new google.visualization.DataTable();
        dataTable.addColumn('string', 'Year');
    		dataTable.addColumn('number','1-star');
    		dataTable.addColumn({type:'string', role:'tooltip'})
    		dataTable.addColumn('number','2-star');
    		dataTable.addColumn({type:'string', role:'tooltip'})
    		dataTable.addColumn('number','3-star');
    		dataTable.addColumn({type:'string', role:'tooltip'})
    		dataTable.addColumn('number','4-star');
    		dataTable.addColumn({type:'string', role:'tooltip'})
    		dataTable.addColumn('number','5-star');
    		dataTable.addColumn({type:'string', role:'tooltip'})

  		let rows = [];
  		for (var year in data) {
  			rows.push([year,
  				data[year]['2'],this.toPercent(data[year]['2']),
  				data[year]['3']-data[year]['2'],this.toPercent(data[year]['3']),
  				data[year]['4']-data[year]['3'],this.toPercent(data[year]['4']),
  				data[year]['5']-data[year]['4'],this.toPercent(data[year]['5']),
  				1-data[year]['5']+.01,this.toPercent(1)])
  		}

  		dataTable.addRows(rows);

      return dataTable;
    },
    drawChart(dataTable) {
      let options = {
		    title: 'Measure Cutpoints (2018-2022)',
        isStacked: true,
        height: 240,
        legend: {position: 'bottom', maxLines: 3},
        vAxis: {title: 'Rate', format: 'percent', viewWindow: {min: 0.6, max: 1}},
		    colors: ['FF624B','FFAF0E','FDE838','16D511','0995E5'],
        /*animation:{
          duration: 1000,
          startup: true
        }*/
      };
      try {
        let chart = new google.visualization.AreaChart(this.$el);
        chart.draw(dataTable, options);
      } catch {}
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
};
