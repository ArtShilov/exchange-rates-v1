const options = {
  title: {
    text: "",
  },

  xAxis: {}
,
  legend: {
    layout: "vertical",
    align: "right",
    verticalAlign: "middle",
  },

  series: [],

  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 1000,
        },
        chartOptions: {
          legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
          },
        },
      },
    ],
  },
  chart: {
    height: 400,
    width: 600
},
};


export default options
