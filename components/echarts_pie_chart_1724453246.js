// To add this component to the user's app, you must follow all three of these steps:
// 1. In the html file, include `<echarts-pie-chart></echarts-pie-chart>` in the place where the chart needs to be inserted. Keep blank lines before and after this code. Do not remove the other components!
// 2. In the html file's <head> section, import the JS file for this component `./components/echarts-pie-chart.js`. You are strictly required to **NOT** remove anything else. Keep blank lines before and after this code. Do not remove the other component imports!
// 3. You are given the correct SQL statement -- replace the `PLACEHOLDER_SQL_STATEMENT` variable in this file with the actual SQL statement.

Vue.component('echarts-pie-chart-1724453246', {
    template: `
        <div style="display: flex; justify-content: center;">
            <div id="pie-chart" style="width: 100vw; height: 50vh;"></div>
        </div>
    `, 
    data() {
        return {
            // 1. First, rename the data variables as per the user's query request, and insert them in the user's app.
            tableItems: [],
            tableHeaders: [],
            SQL_statement: 'PLACEHOLDER_SQL_STATEMENT',
        }
    },

    mounted() {
        // 2. Then you are required to simply add this line of code, assigning values to your data variables. Do not declare a new method for this.
        this.fetch_data_from_database(this.SQL_statement)
            .then(([tableHeaders, tableItems]) => {
                this.tableHeaders = tableHeaders;
                this.tableItems = tableItems;
                this.prepare_data_for_pie_chart(tableHeaders, tableItems)
                    .then(chartData => {
                        this.render_pie_chart(chartData);
                    });
            });
    },

    methods: {
        // start fetch_data_from_database() method
        fetch_data_from_database(SQL_statement) {
            return axios.post('https://nl2sql-prod.azurewebsites.net/execute_sql', {query: SQL_statement})
                .then(response => {
                        const tableItems = response.data.result;
                        if (tableItems.length > 0){
                            const tableHeaders = Object.keys(tableItems[0])
                            this.tableItems = tableItems;
                            this.tableHeaders = tableHeaders;
                            return [tableHeaders, tableItems]}})
            },
        
        // end fetch_data_from_database() method
        
        // start prepare_data_for_pie_chart() method
        prepare_data_for_pie_chart(tableHeaders, tableItems) {
            return new Promise((resolve, reject) => {
                let seriesData = [];
                let xAxisCandidate = null;
                let yAxisCandidate = null;

                for (let header of tableHeaders) {
                    let hasNonEmptyStringValues = tableItems.some(item => typeof item[header] === "string" && item[header] !== "" && !item[header].startsWith('{') && !item[header].startsWith('(') && !item[header].startsWith('['));
                    if (hasNonEmptyStringValues) {
                        xAxisCandidate = header;
                        console.log('X-axis candidate:', xAxisCandidate);
                        break;
                    }
                }

                if (!xAxisCandidate) {
                    console.log('Unable to find suitable X-axis data. Returning empty chart data.');
                    resolve({ seriesData: [], xAxisCandidate: null, yAxisCandidate: null });
                }

                for (let header of tableHeaders) {
                    if (header !== xAxisCandidate && yAxisCandidate === null) {
                        let hasNumericOrParsableValues = tableItems.some(item => {
                            let value = item[header];
                            return typeof value === "number" || (typeof value === "string" && !isNaN(parseFloat(value)) && !value.startsWith('0x'));
                        });
                        if (hasNumericOrParsableValues) {
                            yAxisCandidate = header;
                            console.log('Y Axis Candidate: ', yAxisCandidate);
                            break;
                        }
                    }
                }

                if (!yAxisCandidate) {
                    console.log('Unable to find suitable Y-axis data. Returning empty chart data.');
                    resolve({ seriesData: [], xAxisCandidate: null, yAxisCandidate: null });
                }

                for (let header of tableHeaders) {
                    if (header !== xAxisCandidate && header === yAxisCandidate) {
                        let series = { name: header, type: 'pie', data: [] };

                        for (let item of tableItems) {
                            let yValue = item[header];
                            if (typeof yValue === "number") {
                                series.data.push({ value: yValue, name: item[xAxisCandidate] });
                                console.log(`Adding numeric value ${yValue} to series data.`);
                            } else if (typeof yValue === "string" && !isNaN(parseFloat(yValue)) && !yValue.startsWith('0x')) {
                                let parsedValue = parseFloat(yValue);
                                series.data.push({ value: parsedValue, name: item[xAxisCandidate] });
                                console.log(`Adding parsed value ${parsedValue} to series data.`);
                            } else {
                                console.log(`Skipping value ${yValue} for series data.`);
                            }
                        }

                        seriesData.push(series);
                    }
                }

                resolve({ seriesData, xAxisCandidate, yAxisCandidate });
            });
        },
        // end prepare_data_for_pie_chart() method

        // start render_pie_chart() method
        render_pie_chart(chartData) {

            let pieChart = echarts.init(document.getElementById('pie-chart'), 'dark');

            let option = {
                
                tooltip: { trigger: 'item' },

                legend: { orient: 'vertical', left: '1%', top: '20%', itemGap: 10, textStyle: { color: '#fff'} },

                series: chartData.seriesData
            };

            pieChart.setOption(option);
        },
        //end render_pie_chart() method
    },    
});