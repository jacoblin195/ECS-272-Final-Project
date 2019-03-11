var years = ["1896", "1900", "1904", "1906", "1908", "1912", "1920", "1924",
	"1928", "1932", "1936", "1948", "1952", "1956", "1960", "1964", "1968",
	"1972", "1976", "1980", "1984", "1988", "1992", "1996", "2000", "2004",
	"2008", "2012", "2016"
]

currentYearIndex = 0;

loadScatterplot(years[currentYearIndex])
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
		var index = Math.trunc(slider.noUiSlider.get());
		console.log(index);
		loadScatterplot(years[index]);
	});
}

function loadScatterplot(year) {
	d3.select("#scatterplot").select("svg").remove();
	$.getJSON("./Yearly_Data/" + year + ".json", function(yearData) {
		const margin = {
			top: 40,
			right: 60,
			bottom: 60,
			left: 60
		};
		const width = d3.select("#scatterplot").node().getBoundingClientRect().width - margin.left - margin.right;
		const height = d3.select("#scatterplot").node().getBoundingClientRect().height - margin.top - margin.bottom;

		var x_max = d3.max(yearData, function(d) {
			return d["participants"];
		});
		var x_min = d3.min(yearData, function(d) {
			return d["participants"];
		});

		var y_max = d3.max(yearData, function(d) {
			return d.medal;
		});
		var y_min = d3.min(yearData, function(d) {
			return d.medal;
		});

		var x_extra = (x_max - x_min) * .1;
		var y_extra = (y_max - y_min) * .1;

		const xScale = d3.scaleLinear()
			.domain([x_max + x_extra, x_min - x_extra])
			.range([0, width]);

		const yScale = d3.scaleLinear()
			.domain([y_min - y_extra, y_max + y_extra])
			.range([height, 0]);

		const xAxis = d3.axisBottom(xScale);
		const yAxis = d3.axisLeft(yScale);

		const svg = d3.select("#scatterplot").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var tooltip = d3.select("#scatterplot")
			.append('div')
			.attr('class', 'tooltip');

		tooltip.append('div')
			.attr('class', 'country');
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

		svg.append("g")
			.attr("class", "xaxis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "yaxis")
			.call(yAxis);

		const rScale = d3.scaleLinear()
			.domain([0, 1])
			.range([3.5, 15]);

		const colorScale = d3.scaleLinear()
			.domain([0, 1])
			.range([0, 1]);

		svg.selectAll(".dot")
			.data(yearData)
			.enter()
			.append("circle")
			.attr("class", "dot")
			.attr("r", function(d) {
				return rScale(d["male"] / d["participants"]);
			})
			.attr("cx", d => xScale(d["participants"]))
			.attr("cy", d => yScale(d["medal"]))
			.attr("fill", d => d3.interpolateRdBu(colorScale(d["male"] / d["participants"])))
			.on('mouseover', (d) => {
				tooltip.select('.country').html(d.country);
				tooltip.select('.male').html("M: " + d.male);
				tooltip.select('.female').html("F: " + d.female);
				tooltip.select(".total").html("Total: " + d.participants);
				tooltip.select('.ratio').html("M ratio: " + d.male / d.participants);
				tooltip.select('.medal').html("Medals: " + d.medal);
				tooltip.style('display', 'block');
				tooltip.style('opacity', 1);
			})
			.on('mousemove', function(d) {
				var x = xScale(d["participants"]);
				var y = yScale(d["medal"]);

				tooltip.style('top', (y + 15 + margin.top) + 'px')
					.style('left', (x + 15 + margin.left) + 'px');
			})
			.on('mouseout', function() {
				tooltip.style('display', 'none');
				tooltip.style('opacity', 0);
			})
	});
}
