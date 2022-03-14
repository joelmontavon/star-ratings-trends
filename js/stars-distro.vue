const StarsDistro = {
  data() {
    return {
  		highPerforming: false
  	}
  },
  template: '<div><el-switch v-model="highPerforming" size="large" active-text="High Performing" inactive-text="Stars"></el-switch><div ref="chart"></div></div>',
  props: {
	  'myData': String
  },
  watch: {
    myData(newVal, oldVal) {
      this.updateChart();
    },
	  highPerforming(newVal, oldVal) {
      this.updateChart();
    }
  },
  methods: {
    toPercent(n) {
      return String(Math.round(n	* 100)) + '%';
    },
    aggregateData(data) {
      let self = this;
  		if (this.highPerforming) {
  			let obj = {},
  			   tot = {};
  			data.forEach(function (item) {
  				obj[item.year] = obj[item.year] || {};
  				obj[item.year]['high performing'] = obj[item.year]['high performing'] || {};
  				tot[item.year] = tot[item.year] || 0;
  				if (item.stars >= 4) {
  					obj[item.year]['high performing']['count'] = (obj[item.year]['high performing']['count'] || 0) + 1;
  				}
  				tot[item.year] += 1;
  			});
  			for (let year in obj) {
  				for (stars in obj[year]) {
  					obj[year][stars]['percent'] = obj[year][stars]['count']/tot[year];
  				}
  			}
  			return obj;
  		} else {
  			let obj = {},
  			   tot = {};
  			data.forEach(function (item) {
  				obj[item.year] = obj[item.year] || {};
  				obj[item.year][item.stars] = obj[item.year][item.stars] || {};
  				tot[item.year] = tot[item.year] || 0;
  				obj[item.year][item.stars]['count'] = (obj[item.year][item.stars]['count'] || 0) + 1;
  				tot[item.year] += 1;
  			});
  			for (var year in obj) {
  				for (stars in obj[year]) {
            obj[year][stars]['percent'] = self.toPercent(obj[year][stars]['count']/tot[year]);
  				}
  			}
  			return obj;
  		}
    },
    toDataTable(data) {
      let self = this,
  		  dataTable = new google.visualization.DataTable(),
        rows = [];
  		if (this.highPerforming) {
  			dataTable.addColumn('string', 'Year');
  			dataTable.addColumn('number','4+ stars');
  			dataTable.addColumn({type:'string', role:'tooltip'})
  			dataTable.addColumn('number','1-3 stars');
  			dataTable.addColumn({type:'string', role:'tooltip'})
  			for (let year in data) {
  				rows.push([
            year,
            data[year]['high performing']['count'],
            self.toPercent(data[year]['high performing']['percent']),
            data[year]['high performing']['count']/data[year]['high performing']['percent']-data[year]['high performing']['count'],
            self.toPercent(1 - data[year]['high performing']['percent'])
          ]);
        }
  		} else {
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

  			for (let year in data) {
  				rows.push([year,
  					data[year]['1']['count'],
            data[year]['1']['percent'],
            data[year]['2']['count'],
            data[year]['2']['percent'],
            data[year]['3']['count'],
            data[year]['3']['percent'],
            data[year]['4']['count'],
            data[year]['4']['percent'],
            data[year]['5']['count'],
            data[year]['5']['percent']])
  			}
  		}

  		dataTable.addRows(rows);
      return dataTable;
    },
    drawChart(dataTable) {
      let options = {
		    title: 'Plans by Stars (2018-2022)',
        isStacked: true,
        //height: 500,
        legend: {position: 'bottom', maxLines: 3},
        vAxis: {title: 'Plans'},
		    colors: ['FF624B','FFAF0E','FDE838','16D511','0995E5'],
        /*animation:{
          duration: 1000,
          easing: 'out',
          startup: true
        }*/
      };

      let chart = new google.visualization.AreaChart(this.$refs.chart);
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
};
