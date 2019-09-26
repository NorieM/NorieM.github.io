// month labels
const months =[...Array(12).keys()].map(mth => new Date(2019,mth, 1).toLocaleString('en-UK', {month:'long'})) ;

let myChart;

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

	row.setAttribute('class', 'selectedRow');
    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });
	
  table.appendChild(tableHeader);
  table.appendChild(tableBody);
  document.body.appendChild(table);
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

let rows; // array for data from CSV file

function Upload() {
	
    let fileUpload = document.getElementById("fileUpload");
	
    let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
	
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            let reader = new FileReader();
			
            reader.onload = function (e) {            
            rows = e.target.result.split("\n").map(row => row.split(','));
				
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
							
            reader.readAsText(fileUpload.files[0]);
			
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
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
	
	const areaData = rows.filter(site=>site[1]===area);
	
	const sites = Array.from(new Set(areaData.map(site =>site[2])));
	
	let allData = [];
	
	for (idx=0;idx<sites.length;idx++)
		{
			let data = rows.filter(site=>site[1]===area && site[2] === sites[idx]);
			
			let siteData = [sites[idx]];			
			
			for(month=0;month<data.length; month++){			
				siteData.push(data[month][4]);
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
	
	document.getElementById('chart').innerHTML = '<canvas id="myChart" width="1200" height="600"></canvas>';
	
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
	
	changeArea(areas[0]);
}

