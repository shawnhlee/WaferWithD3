const canvasWidth = 600;
const canvasHeight = 600;
const margin = { top: 20, left: 100, bottom: 100, right: 20 };
const graphWidth = canvasWidth - margin.left - margin.right;
const graphHeight = canvasHeight - margin.top - margin.bottom;


const svg = d3.select('.canvas')
	.append('svg')
	.attr('width', canvasWidth)
	.attr('height', canvasHeight);


const graph = svg.append('g')
	.attr('width', graphWidth)
	.attr('height', graphHeight)
	.attr('transform', `translate(${margin.left},${margin.top})`);

const xAxisGroup = svg.append('g')
	.attr('transform', `translate(0,${graphHeight})`);

const yAxisGroup = svg.append('g');

db.collection('dishes').get().then((res) => {
	const data = [];
	res.docs.forEach(dish => {
		data.push(dish.data());
	});

	const y = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.orders)])
		.range([graphHeight, 0]);

	const x = d3.scaleBand()
		.domain(data.map(d => d.name))
		.range([0, graphWidth])
		.paddingInner(0.2)
		.paddingOuter(0.2);


	const rects = graph.selectAll('rect')
		.data(data);
	rects
		.attr('width', x.bandwidth)
		.attr('height', d => graphHeight - y(d.orders))
		.attr('fill', 'darkgrey')
		.attr('x', d => x(d.name))
		.attr('y', d => y(d.orders))

	rects.enter()
		.append('rect')
		.attr('width', x.bandwidth)
		.attr('height', d => graphHeight - y(d.orders))
		.attr('fill', 'darkgrey')
		.attr('x', d => x(d.name))
		.attr('y', d => y(d.orders))


	const xAxis = d3.axisBottom(x);
	const yAxis = d3.axisLeft(y)
		.ticks(3)
		.tickFormat(d => d + ' orders');
	xAxisGroup.call(xAxis);
	yAxisGroup.call(yAxis)
		.attr('font-size', '1em');

	xAxisGroup.selectAll('text')
		.attr('transform', 'rotate(-40)')
		.attr('text-anchor', 'end')
		.attr('fill', 'orange')
		.attr('font-family', 'Arial')
		.attr('font-size', '1.5em');

	console.log(rects)

})
