var years = ["1896", "1900", "1904", "1906", "1908", "1912", "1920", "1924",
	"1928", "1932", "1936", "1948", "1952", "1956", "1960", "1964", "1968",
	"1972", "1976", "1980", "1984", "1988", "1992", "1996", "2000", "2004",
	"2008", "2012", "2016"
];
var slider = document.getElementById('slider');
var xScale;
var yScale;
var rScale;

setupSlider();

function setupSlider() {
	var slider = document.getElementById('slider');

	noUiSlider.create(slider, {
		start: [0],
		step: 1,
		tooltips: {
			to: (idx) => {
				return years[Math.round(idx)];
			}
		},
		range: {
			'min': [0],
			'max': [years.length - 1]
		}
	});
	slider.noUiSlider.on('slide', function() {
		// TODO: load static graph after user slide the slider.
		clearInterval(timer);
		//change to stop
		if (playFlag == 1) {
			var e = document.getElementById("button-img");
			e.src = "play.png";
			playFlag = 0;
		}
		// change global var
		currYearIndex = Math.trunc(slider.noUiSlider.get());
		currFrame = 0;
		drawWithIndex();
	});

	slider.noUiSlider.on('set', function() {
		// TODO: load static graph after slider is set to new values.
	});
}

// setupScatterplot();

function setupScatterplot() {
	const margin = {
		top: 40,
		right: 60,
		bottom: 60,
		left: 60
	};

	G = d3.select("#scatterplot").select("svg").append("g");
	pathA = G.append("path");
	pathB = G.append("path");
	pathC = G.append("path");
	pathD = G.append("path");
	pathE = G.append("path");
	debug = G.append("g");

	const width = d3.select("#scatterplot").node().getBoundingClientRect().width - margin.left - margin.right;
	const height = d3.select("#scatterplot").node().getBoundingClientRect().height - margin.top - margin.bottom;

	G.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	xScale = d3.scaleLinear()
		.domain([0, maxX])
		.range([0, width]);

	yScale = d3.scaleLinear()
		.domain([0, maxY])
		.range([height, 0]);

	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);

	rScale = d3.scaleLinear()
		.domain([minR, maxR])
		.range([15, 40]);

	var tooltip = d3.select("#scatterplot")
		.append('div')
		.attr('class', 'tooltip');

	tooltip.append('div')
		.attr('class', 'country');
	tooltip.append('div')
		.attr('class', 'noc');
	tooltip.append('div')
		.attr('class', 'male');
	tooltip.append('div')
		.attr('class', 'female');
	tooltip.append('div')
		.attr('class', 'total');
	tooltip.append('div')
		.attr('class', 'ratio');
	tooltip.append('div')
		.attr('class', 'medal');

	G.append("g")
		.attr("class", "xaxis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	G.append("g")
		.attr("class", "yaxis")
		.call(yAxis);

	G.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left + 4)
		.attr("x", 0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("Number of Medals");

	G.append("text")
		.attr("transform",
			"translate(" + (width / 2) + " ," +
			(height + margin.top) + ")")
		.style("text-anchor", "middle")
		.text("Number of Participants");

	var legendSize = 14;
	var gap = 6;
	var continents = ["Asia","Africa","Europe","America","Oceania"]
	var colors = ["#f3c132", "#000000","#1287c4","#dd0e2b","#19a24d"];

	for(var i = 0;i<continents.length;i++){
		G.append("rect")
			.attr("x",width*.8)
			.attr("y",20+i*(legendSize+gap))
			.attr("width",legendSize)
			.attr("height",legendSize)
			.attr("fill", colors[i]);
		G.append("text")
			.attr("x",width*.8+legendSize+gap)
			.attr("y",20+(i+.6)*(legendSize+gap))
			.text(continents[i])
			.style("font-size",legendSize+"px")
			.style("text-anchor", "start");
	}
}

//flag: 0:stop; 1:play
var playFlag = 0;

function play() {
	var e = document.getElementById("button-img");
	//change to play
	if (playFlag == 0) {
		e.src = "pause.png";
		playFlag = 1;
		myBubbleSet(1);
	}
	//change to stop
	else if (playFlag == 1) {
		e.src = "play.png";
		playFlag = 0;
		clearInterval(timer);
	}
}
