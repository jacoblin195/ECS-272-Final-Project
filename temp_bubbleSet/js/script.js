var years = ["1896", "1900", "1904", "1906", "1908", "1912", "1920", "1924",
	"1928", "1932", "1936", "1948", "1952", "1956", "1960", "1964", "1968",
	"1972", "1976", "1980", "1984", "1988", "1992", "1996", "2000", "2004",
	"2008", "2012", "2016"
];

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
		// change global var
        currYearIndex = Math.trunc(slider.noUiSlider.get());
		currFrame = 0;
        drawWithIndex();
	});

	slider.noUiSlider.on('set', function() {
		// TODO: load static graph after slider is set to new values.
	});
}

setupScatterplot();

function setupScatterplot(){
    var svg = d3.select("#scatterplot").select("svg").append("g");

    const margin = {
        top: 40,
        right: 60,
        bottom: 60,
        left: 60
    };
    const width = d3.select("#scatterplot").node().getBoundingClientRect().width - margin.left - margin.right;
    const height = d3.select("#scatterplot").node().getBoundingClientRect().height - margin.top - margin.bottom;

    svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // TODO: [0,100] for test only
    const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "yaxis")
        .call(yAxis);
}
