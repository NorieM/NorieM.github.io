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
		
const allData = [['London','Site1',5819,5915,5848,5899,5944,5819,5898,5825,5659,5871,5857,5719],
	             ['London','Site2',5882,5932,5871,5944,5844,5806,5826,5771,6028,5894,5770,6004],
	             ['London','Site3',5864,5820,5812,5599,5945,5790,5716,5933,5936,5979,5973,5617],
	             ['London','Site4',5889,5894,5891,5933,5879,6000,5916,5955,6062,5821,5990,5951],
	             ['London','Site5',5907,5862,5938,5917,5811,5844,5847,5837,5828,5714,5863,5904],
	             ['London','Site6',5921,5929,5946,5983,6024,5919,5881,5944,5819,5976,5746,6073],
	             ['London','Site7',5953,5948,5951,5921,5987,5793,5854,6012,6047,5844,5993,5941],
	             ['Milton Keynes','Site8',5760,5915,5929,5910,5941,5841,5957,5726,5848,5896,5933,5937],
	             ['Milton Keynes','Site9',5845,5885,6020,5921,5875,5967,5863,5836,5964,5896,5823,5950],
	             ['Milton Keynes','Site10',5893,5910,5876,5960,5895,5988,5781,5844,5713,5720,6018,5809],
	             ['Milton Keynes','Site11',5739,5781,5962,6001,6114,5899,5881,5796,5974,5960,5903,5946],
	             ['Milton Keynes','Site12',5915,5873,5737,5990,6059,5924,5809,5949,5891,6004,5826,5924],
	             ['Milton Keynes','Site13',5837,5834,5982,5885,5964,6045,5766,5972,5967,5999,5824,5876],
	             ['Milton Keynes','Site14',6142,5962,5976,6010,5983,5838,5973,5996,6058,5903,5687,5903],
	             ['Milton Keynes','Site15',6029,6016,5768,5956,5927,5912,6034,5953,6068,5985,5910,5826],
	             ['Milton Keynes','Site16',5856,6057,5805,5921,5959,6023,5857,6032,5726,5998,5937,5891],
	             ['Tottenham','Site17',5925,5953,5860,6032,5905,5708,5915,5925,5858,5846,5908,5812],
	             ['Tottenham','Site18',6186,5687,5733,6024,5863,5940,6014,5780,5872,5910,5908,5975],
	             ['Tottenham','Site19',5914,5953,5746,5743,5804,5805,5802,6025,6117,5847,6059,5999],
	             ['Tottenham','Site20',5958,5924,6044,6093,5944,5869,5802,5935,6042,5941,5754,5888],
	             ['Tottenham','Site21',5797,5779,6101,5823,5862,5886,5866,5986,5931,5816,5853,5794],
	             ['Tottenham','Site22',5803,6068,5771,5760,5949,5815,5859,5932,5959,5811,6021,5829],
	             ['Tottenham','Site23',5864,5914,6032,5862,5938,5892,5850,5914,5886,6090,5866,5937],
	             ['Tottenham','Site24',5779,5973,6023,5766,5953,6058,5962,5721,5871,5745,5822,5653],
	             ['Tottenham','Site25',6053,5767,5983,5934,5794,5842,5792,5872,5940,6023,5871,5951],
	             ['Tottenham','Site26',5947,5739,5845,5954,5955,5777,5993,5850,5870,5802,5761,5995],
	             ['Paddington','Site27',5934,5977,5906,5971,5882,5878,5804,5783,6047,5986,5779,5890],
	             ['Paddington','Site28',5785,5738,5919,5914,5920,5874,5781,5839,5859,5786,6091,6020],
	             ['Paddington','Site29',5652,5886,5870,5799,5740,5895,5834,5959,5830,5854,5941,5754],
	             ['Paddington','Site30',5796,5922,5892,5859,5870,5950,5907,5869,6038,5938,5934,5863],
	             ['Paddington','Site31',5802,6020,5973,5934,5778,5950,5907,5922,6071,5852,5920,5881],
	             ['Paddington','Site32',5952,5964,5921,5958,5964,5938,6034,5935,5793,5992,6047,5818]  
];


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

