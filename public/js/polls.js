//alert(data.choiceVotes);
var ctx = document.getElementById("pollChart").getContext('2d');

var pollData, pollOptions;

if (data.display === 'pie') {
	
}
else if (data.display === 'area') {
	
}
else {
	pollData = {
		labels: data.choiceStrings,
		datasets: [{
			label: '# of Votes',
			data: data.choiceVotes,
			backgroundColor: [
				'rgba(255, 99, 132, 0.5)',
				'rgba(54, 162, 235, 0.5)'
			],
			hoverBackgroundColor: [
				'rgba(255, 99, 132, 0.8)',
				'rgba(54, 162, 235, 0.8)'
			],
			borderColor: [
				'rgba(255,99,132,1)',
				'rgba(54, 162, 235, 1)'
			],
			borderWidth: 1
		}]
	};
	pollOptions = {	
		scales: {
			yAxes: [{		
				ticks: {
					beginAtZero:true
				},
				gridLines: {
	                display: false
		        },
	            pointLabels: {
	                fontFamily: "'Roboto'"
	            }
			}],
			xAxes: [{
				gridLines: {
	                display: false
		        },
	            pointLabels: {
	                fontFamily: "'Roboto'"
	            }
			}]
		}	
	}
	var pollChart = new Chart(ctx, {
	type: data.display,
	data: pollData,
	options: pollOptions
})
}