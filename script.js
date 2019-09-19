// month labels
const months =[...Array(12).keys()].map(mth => new Date(2019,mth, 1).toLocaleString('en-UK', {month:'long'})) ;

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
							
            reader.readAsText(fileUpload.files[0]);
			
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
}
		
function changeArea(area){
	
	if (!area){
		area = document.getElementById('areaSelect').value;
	}
	const areaData = rows.filter(site=>site[1]===area);
	
	const sites = Array.from(new Set(areaData.map(site =>site[2])));
	
	let allData = [];
	
	for (idx=0;idx<sites.length;idx++)
		{
			let data = rows.filter(site=>site[1]===area && site[2] === sites[idx]);
			
			let siteData = [sites[idx]];			
			
			for(month=0;month<data.length; month++){			
				siteData.push(data[month][document.getElementById('metricSelect').selectedIndex+4]);
			}
			allData.push(siteData);
			
		}	
		
	const areaList = allData.map(site => {
		return {
			data:site.slice(1),
			label:site[0],
			backgroundColor:getRandomColor(),
			fill: true}		
	});
	
	document.getElementById('chart').innerHTML = '';
	
	document.getElementById('chart').innerHTML = '<canvas id="myChart" width="1200" height="600"></canvas>';
	
	const ctx = document.getElementById('myChart');
	
	let myChart = new Chart(ctx, {
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

function changeMetric(metric){
	document.getElementById('metricTitle').innerText =`Monthly Breakdown - ${metric} Average`;
	changeArea();
}

