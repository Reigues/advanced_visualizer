/* const ctx = document.getElementById('chart_top');
const myChart = new Chart(ctx, {
  type: 'scatter',
  data: {
    datasets: [{
      data: [{x: 10, y: 20}, {x: 15, y: 0}, {x: 20, y: 10},{x:0,y:0}],
      showLine: true,
      borderColor: 'rgb(75, 192, 192)'
    }]
  },
  options: {
      animation: false,
      parsing: false,
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      scales: {
        x: {
            type: 'linear',
            min: -10,
            max: 10
        },
        y: {
            type: 'linear',
            min: -10,
            max: 10
        }
    },
    plugins:{
      decimation:{
        enabled: true,
        algorithm: 'min-max',
      }
    }
  }
});

function getInitCoords(z){
  var u = weierstrassP(z,0,1/27);
  var v = weierstrassPPrime(z,0,1/27);
  return [div(mul(6,u),add(mul(3,v),1)),div(sub(1,mul(3,v)),add(1,mul(3,v)))]
}

getData_button.onclick = function () {
  var [point, direction] = getData()
  var v = exp(complex(0,direction))
  var z = complex(point.x, point.y)
  var [x, y] = getInitCoords(z).map(a => 
    div(a,mul(beta(1/3,1/3),v))
  );
  console.log([x,y])
  var coords = ode(((t,v)=> [pow(v[1], 2), pow(v[0], 2)]),[x, y],[0,100],0.01)

  console.log(coords)

  myChart.data.datasets[0].data=coords.map(
    point=>({
      x: (point[1].re!=0||point[1].im!=0) ? (div(point[2],point[1]).re) : (null),
      y: (point[1].re!=0||point[1].im!=0) ? (div(point[2],point[1]).im) : (null)}));


  console.log(myChart.data.datasets[0].data)
  myChart.update()
}

 */




var trace1 = {
  x: [1, 2, 3, 4],
  y: [5, 10, 2, 8],
  mode: "lines"
};

var data = [trace1];

var layout = {
  xaxis: {
    range: [-2.4, 2.4]
  },
  yaxis: {
    range: [-1.1, 1.1]
  },
  margin:{
    l:0, 
    r:0, 
    t:0, 
    b:0},
  shapes: [
    {
        type: 'circle',
        xref: 'x',
        yref: 'y',
        x0: -1,
        y0: -1,
        x1: 1,
        y1: 1,
        line: {
            color: 'black',
            dash: 'dot'
        }
    }],
    showlegend: false,
    hovermode: 'closest'
};

var config = {
  responsive: true,
  displaylogo: false
}

Plotly.newPlot('right_top', data, layout);
Plotly.newPlot('right_bottom', data, layout);

function getInitCoords(z){
  var u = weierstrassP(z,0,1/27);
  var v = weierstrassPPrime(z,0,1/27);
  return [div(mul(6,u),add(mul(3,v),1)),div(sub(1,mul(3,v)),add(1,mul(3,v)))] /* 6u/(3v+1),(1-3V)/(1+3V) */
}

getData_button.onclick = function () {
  var [point, direction] = getData()
  var v = mul(exp(complex(0,direction)),complex(-1/2,sqrt(3)/2)) //complex(-1/2,-sqrt(3)/2)
  var z = complex(point.x, point.y)
  z = add(1/3,mul(z,complex(1/2,sqrt(3)/2)))
  var [x, y] = getInitCoords(mul(beta(1/3,1/3),z)).map(a => 
    mul(a,beta(1/3,1/3),v)
  );
  y=mul(y,complex(-1/2,-sqrt(3)/2))
  /* x=div(add(1,exp(complex(0,2*pi/3))),pow(sub(1,pow(complex(0,1),3)),1/3))
  y=mul(x,complex(0,1)) */
  console.log([x,y])
  console.log("point : ")
  console.log({x:div(y,x).re,y:div(y,x).im})
  console.log({x:div(x,y).re,y:-div(x,y).im})
  var coords = ode(((t,v)=> [pow(v[1], 2), pow(v[0], 2)]),[x, y],[0,100],0.001)

  data = [{
    x: coords.map(point=>((point[1].re!=0||point[1].im!=0)&&(abs(div(point[2],point[1]))<1)) ? (div(point[2],point[1]).re) : (null)),
    y: coords.map(point=>((point[1].re!=0||point[1].im!=0)&&(abs(div(point[2],point[1]))<1)) ? (div(point[2],point[1]).im) : (null)),
    mode: "lines",
    line: {
      color: 'green',
      width: 1.5
    }
  },{
    x: coords.map(point=>((point[1].re!=0||point[1].im!=0)&&(abs(div(point[2],point[1]))>=1)) ? (div(point[2],point[1]).re) : (null)),
    y: coords.map(point=>((point[1].re!=0||point[1].im!=0)&&(abs(div(point[2],point[1]))>=1)) ? (div(point[2],point[1]).im) : (null)),
    mode: "lines",
    line: {
      color: 'red',
      width: 1.5
    }
  },{x:[div(y,x).re],y:[div(y,x).im], type:"scatter",marker:{color:'blue'}}]
  data_2 = [{
    x:coords.map(point=>((point[2].re!=0||point[2].im!=0)&&(abs(div(point[2],point[1]))<1)) ? (div(point[1],point[2]).re) : (null)),
    y:coords.map(point=>((point[2].re!=0||point[2].im!=0)&&(abs(div(point[2],point[1]))<1)) ? (-div(point[1],point[2]).im) : (null)),
    mode: "lines",
    line: {
      color: 'green',
      width: 1.5
    }
  },{
    x:coords.map(point=>((point[2].re!=0||point[2].im!=0)&&(abs(div(point[2],point[1]))>=1)) ? (div(point[1],point[2]).re) : (null)),
    y:coords.map(point=>((point[2].re!=0||point[2].im!=0)&&(abs(div(point[2],point[1]))>=1)) ? (-div(point[1],point[2]).im) : (null)),
    mode: "lines",
    line: {
      color: 'red',
      width: 1.5
    }
  },{x:div(x,y).re,y:-div(x,y).im}]
  console.log(data)
  Plotly.react('right_top', data, layout);
  Plotly.react('right_bottom', data_2, layout);

}
