//alert(data.choiceVotes);
var ctx = document.getElementById("pollChart").getContext('2d');

var pollData = {
	labels: data.choiceStrings,
	datasets: [{
		label: '# of Votes',
		data: data.choiceVotes,
		backgroundColor: getColors(0.5).slice(0, data.choiceStrings.length),
		hoverBackgroundColor: getColors(0.8).slice(0, data.choiceStrings.length),
		borderColor: getColors(1).slice(0, data.choiceStrings.length),
		borderWidth: 1
	}]
};	

var pollOptions = {
	responsive: false,
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
};

function getColors(opacity) {
	return ['rgba(240,192,168,' + opacity +')',
			'rgba(240,216,168,' + opacity +')',
			'rgba(168,192,144,' + opacity +')',
			'rgba(120,144,144,' + opacity +')',
			'rgba(120,120,120,' + opacity +')',
			] 
}

function getDisplay(){
	if (data.display == 'area') return 'line';
	else return data.display;
}

var pollChart = new Chart(ctx, {
	type: getDisplay(),
	data: pollData,
	options: pollOptions
});
