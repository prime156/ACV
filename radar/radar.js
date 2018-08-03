//

var convert = function(raw, i) {
   var result = {
      labels: [],
      datasets: [{
         label: i,
         data: [],
         backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
         ],
         borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
         ],
         borderWidth: 1
      }]
   };

   for (let key in raw) {
      if (key === 'HEAD' || key === 'CORE' || key === 'ARMS' || key === 'LEGS') continue;
      result.labels.push(key);
      result.datasets[0].data.push(raw[key]);
   }

   return result;
};

for (let i = 0, n = data.length; i < n; i++) {
   appendGraph(data[i], i);
}

function appendGraph(data, i) {
   var container = document.querySelector('#graph-container');
   var div = document.createElement('div');
   var canvas = document.createElement('canvas');

   div.className = 'graph';
   canvas.height = '360';

   div.appendChild(canvas);
   container.appendChild(div);

   var d = convert(data, i);

   var ctx = canvas.getContext('2d');

   var myChart = new Chart(ctx, {
      type: 'radar',
      data: d,
      options: {
         title: {
            display: true,
            text: d.datasets[0].label
         },
         legend: {
            display: false
         },
         animation: false,
         scale: {
            ticks: {
               startAtZero: true,
               min: 0,
               max: 100
            }
         }
      }
   });
}
