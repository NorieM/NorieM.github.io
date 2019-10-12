// month labels
const months =[...Array(12).keys()].map(mth => new Date(2019,mth, 1).toLocaleString('en-UK', {month:'long'})) ;

let myChart;
let rows; // array for data from CSV file
let data;

// get data
let xhttp = new XMLHttpRequest();

xhttp.open("GET", "https://testbucket-norie.s3.eu-west-2.amazonaws.com/Data.csv", true);

xhttp.onload = function() {
if (this.readyState == 4 && this.status == 200) {			
  data =  this.responseText;   
  Upload()
}
};

xhttp.send();


function createTable(tableData) {
  var table = document.createElement('table');
  table.setAttribute('class', 'blueTable');
  table.setAttribute('id', 'siteTable');
  var tableHeader = document.createElement('thead');
	
  var tableHeaderRow = document.createElement('tr');
  	
  months.unshift('Site');
  	
  months.forEach(month=>{
  	var cell = document.createElement('th')
	cell.appendChild(document.createTextNode(month));	  
	tableHeaderRow.appendChild(cell);  
	  
  });
	
  months.shift();
	
  tableHeader.append(tableHeaderRow);
	
  var tableBody = document.createElement('tbody');

  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');

    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });
	
  table.appendChild(tableHeader);
  table.appendChild(tableBody);
	
  if(document.getElementById('tableDiv').childNodes[0])
  {
  	document.getElementById('tableDiv').childNodes[0].remove();
  };
  document.getElementById('tableDiv').appendChild(table);
}

// generate a random RGB colour
function getRandomColor() {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function Upload() {
	
	//loadDoc();	
	
    rows =  data.split("\n").map(row => row.split(','));	
	
	let header = rows[0];
	
	let metricSelect = document.getElementById('metricSelect');
			
	metricSelect.options.length =0;
	
	for(let idx=4; idx < header.length; idx++){
		let el = document.createElement('option');
		el.textContent = header[idx];
		el.value = header[idx];
		metricSelect.appendChild(el);			
	};	
	
	let regions = Array.from(new Set(rows.map(row =>row[0])));
		
	regions.shift();
		
	let regionSelect = document.getElementById('regionSelect');

	regionSelect.options.length = 0;
		
	for(let idx=0; idx < regions.length; idx++){
		let el = document.createElement('option');
		el.textContent = regions[idx];
		el.value = regions[idx];
		regionSelect.appendChild(el);			
		};																	
	
	changeRegion(regions[0]);
	
	document.getElementById('regionTitle').innerText = regions[0];
			
}

function handleChartClick(evt)
{
	const activeElement = myChart.getElementAtEvent(evt)
	if (activeElement.length){
		const siteIndex = activeElement[0]._datasetIndex;	
		let siteTable = document.getElementById('siteTable');
		
		for(let idx=1;idx< siteTable.rows.length;idx++){
			siteIndex === idx-1? siteTable.rows[idx].setAttribute('class', 'selectedRow'): siteTable.rows[idx].removeAttribute('class');
		};
		
	}
	
}

function changeArea(area){
	
	area 
	const areaData = rows.filter(site=>site[1]===area);
	
	const sites = Array.from(new Set(areaData.map(site =>site[2])));
	
	let allData = [];
	
	for (idx=0;idx<sites.length;idx++)
		{
			let data = rows.filter(site=>site[1]===area && site[2] === sites[idx]);
			
			let siteData = [sites[idx]];			
			
			// siteData.push(data[month][document.getElementById('metricSelect').selectedIndex+4]);
			
			for(month=0;month<data.length; month++){			
				//siteData.push(data[month][4]);
				siteData.push(data[month][document.getElementById('metricSelect').selectedIndex+4]);
			}
			allData.push(siteData);
			
		}	
		
	const htmlTable = createTable(allData);
		
	const areaList = allData.map(site => {
		return {
			data:site.slice(1),
			label:site[0],
			backgroundColor:getRandomColor(),
			fill: true}		
	});
	
	// reset chart area
	document.getElementById('chart').innerHTML = '';
	
	document.getElementById('chart').innerHTML = '<canvas id="myChart" width="1200" height="300"></canvas>';
	
	const ctx = document.getElementById('myChart');
	
	myChart = new Chart(ctx, {
	  type: 'bar',
	  data: {
		options:{
			scales: {
	            xAxes: [{
	                ticks: {
	                    autoSkip: false,
	                    maxRotation: 0,
	                    minRotation: 0
	                }
	            }]
				}
		},
	    labels: months,
	    datasets: areaList
	  },
	  options:{
	  	onClick: handleChartClick
	  }
	});

	const region = document.getElementById('regionSelect').value;

	document.getElementById('areaTitle').innerText = area;
}

function changeMetric(metric){
	document.getElementById('metric').innerText = `Monthly breakdown - ${metric} Average`;
	changeArea(document.getElementById('areaSelect').value);
}
function changeRegion(region){
					
	const areas = Array.from(new Set(rows.filter(row=> row[0]===region).map(row=>row[1])));
	
	let areaSelect = document.getElementById('areaSelect');

	areaSelect.options.length = 0;
		
	for(let idx=0; idx < areas.length; idx++)
	{
		let el = document.createElement('option');
		el.textContent = areas[idx];
		el.value = areas[idx];
		areaSelect.appendChild(el);
	}
	
	
	document.getElementById('regionTitle').innerText = region;

	changeArea(areas[0]);
}

