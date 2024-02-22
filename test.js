// Chart.js Script (by Pierre)
Chart.defaults.plugins.legend.display = false;

const fontColor = '#ffffff';

const ctx = document.getElementById('chart');

const itemsData = Array.from(document.querySelectorAll('.values')).map(p => JSON.parse(p.textContent));
const labels = Object.keys(itemsData[0].Data).sort(); // Assuming all items have the same dates, get them sorted

const datasets = itemsData.map(item => ({
        label: item.Metadata.Name,
        borderColor: item.Metadata.Color,
        pointBackgroundColor: item.Metadata.Color,
        //data: labels.map(label => item.Data[label].value),
        data: labels.map(label => ({
            x: label,
            y: item.Data[label].value,
            change: item.Data[label].change
        })),
        fill: false,
}));

// change background color
const plugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const {ctx} = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = options.color || '#99ffff';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };

const config = {
    type: 'line',
    //data,
    data: {
        labels: labels,
        datasets: datasets
    },
    options: {
        plugins : {
        		customCanvasBackgroundColor: {
                color: '#404c45',
              },
            tooltip: {
                enabled: true, // Enable tooltips
                position: 'nearest',
                backgroundColor: '#fff', // Tooltip background color
                titleColor: '#000', // Title text color
                titleFont: {
                    size: 14, // Title font size
                    weight: 'bold', // Title font weight
                },
                bodyColor: '#000', // Body text color
                bodyFont: {
                    size: 12, // Body font size
                },
                borderColor: '#666', // Tooltip border color
                borderWidth: 1, // Tooltip border width
                cornerRadius: 4, // Tooltip corner radius
                displayColors: true, // Display color boxes in the tooltip
                boxWidth: 10, // Color box width
                boxHeight: 10, // Color box height
                usePointStyle: true, // Use point style for the color boxes (circle, rect, etc.)
                // Custom function for tooltip labels
                callbacks: {
                    // Adjust the label callback to display the value and change
                    /* v1
                    label: function(context) {
                        const dataset = context.dataset;
                        const dataPoint = dataset.data[context.dataIndex];
                        const value = dataPoint.y;
                        const change = dataPoint.change;
                        return `${dataset.label}: ${value} (Change: ${change >= 0 ? '+' : ''}${(change * 100).toFixed(2)}%)`;
                    }
                    */
                    title: function(tooltipItems) {
                        // Customize the title
                        return tooltipItems[0].label;
                    },
                    label: function(context) {
                        // Customize the label
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        const dataset = context.dataset;
                        const dataPoint = dataset.data[context.dataIndex];
                        const change = dataPoint.change;
                        return `${label}: ${value} | Change : ${change >= 0 ? '+' : ''}${(change * 100).toFixed(2)}%)`;
                    }
                },
                // Adjust font color of tooltips
                bodyFontColor: '#ffffff' // Change font color of tooltips
            }
        },
        // legend: {display: false, // Disable the default legend },
        interaction:{
            //intersect: false,
            mode: 'index'
        },
        scales: {
            x: {
                ticks: {
                    color: fontColor // Changes the tick labels' color on the x-axis
                },
                grid: {
                    // color: 'rgba(255,255,255,0.1)' // Changes the x-axis grid line color
                },
                title: {
                    display: false,
                    text: 'Your X Axis Title',
                    color: fontColor // Change the axis title text color if needed
                }
            },
            y: {
                ticks: {
                    color: fontColor // Changes the tick labels' color on the x-axis
                },
                grid: {
                    color: 'rgba(255,255,255,0.1)' // Changes the x-axis grid line color
                },
                title: {
                    display: false,
                    text: 'Your X Axis Title',
                    color: fontColor // Change the axis title text color if needed
                },
                beginAtZero: false
            }
        },
        transitions: {
            show: {
              animations: {
                x: {from: 0},
                y: {from: 0}
              }
            },
            hide: {
              animations: {
                x: {to: 0},
                y: {to: 0}
              }
            }
        }
    },
    plugins: [plugin],
    legend: {
        display: false, // Disable the default legend
    }
};


const myChart = new Chart(ctx, config);

const legendContainer = document.getElementById('legend-wrapper');
// note to later self : do this also for datasetsShort, and wrap each legend set in a different div, and toggle their visibility on click function
datasets.forEach((dataset, index) => {
    // Create the legend item container
    const legendItem = document.createElement('div');
    legendItem.classList.add('legend-item'); // Use your .legend-item class

    // Create the color indicator
    const colorIndicator = document.createElement('div');
    colorIndicator.classList.add('legend-color'); // Use your .legend-color class
    colorIndicator.style.backgroundColor = dataset.borderColor;

    // Create the text block for the dataset name
    const textBlock = document.createElement('span');
    textBlock.textContent = dataset.label;

    // Append the color indicator and text block to the legend item
    legendItem.appendChild(colorIndicator);
    legendItem.appendChild(textBlock);

    legendItem.style.cursor = 'pointer';
    legendItem.onclick = function() {
        // Toggle dataset visibility on click
        const chartDataset = myChart.data.datasets[index];
        chartDataset.hidden = !chartDataset.hidden;
        legendItem.classList.toggle('is-disabled');

        myChart.update();
    };

    // Append the legend item to the legend container
    legendContainer.appendChild(legendItem);
});