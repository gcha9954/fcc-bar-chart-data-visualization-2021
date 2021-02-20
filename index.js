// Import stylesheets
import "./style.css";

// Import d3
import * as d3 from "d3";

// Write title to page
const appDiv = document.getElementById("app");
appDiv.innerHTML = `
<h1 id="title">Gross Domestic Product of the United States of America</h1>
`;

// Fetch data from API
fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then(response => response.json())
  .then(data => {
    let dataset = data.data;
    // Draw GDP graph
    const width = 800;
    const height = 500;
    const padding = 70;

    // parseTime function required to scale and plot the dates from the API
    const parseTime = d3.timeParse("%Y-%m-%d");

    // Create xScale and yScale functions
    const xScale = d3
      .scaleTime()
      .domain([
        parseTime(dataset[0][0]),
        parseTime(dataset[dataset.length - 1][0])
      ])
      .range([padding, width - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([height - padding, padding]);

    // Draw SVG
    const svg = d3
      .select("#app")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Draw bars
    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(parseTime(d[0])))
      .attr("y", d => yScale(d[1]))
      .attr("width", 3)
      .attr("height", d => height - yScale(d[1]) - padding)
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("fill", "#187bcd")
      // On mouseover, show tooltip with data
      .on("mouseover", (e, d) => {
        d3.select("#tooltip")
          .style("opacity", 1)
          .html(`${d[0]}<br>\$${d[1]}B`)
          .attr("data-date", d[0]);
      })
      // On mouseout, hide tooltip
      .on("mouseout", (e, d) => {
        d3.select("#tooltip").style("opacity", 0);
      })
      // On mousemove, tooltip follows mouse
      .on("mousemove", (e, d) => {
        d3.select("#tooltip")
          .style("left", `${e.pageX + 50}px`)
          .style("top", `${e.pageY - 100}px`);
      });

    // Draw axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - padding})`)
      .attr("id", "x-axis")
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis);

    // Draw x-axis label
    svg
      .append("text")
      .text("Date")
      .attr("x", width / 2 - 25)
      .attr("y", height - 25);

    // Draw y-axis label
    svg
      .append("text")
      .text("Gross Domestic Product / Billions USD")
      .attr("text-anchor", "end")
      .attr("x", -125)
      .attr("y", 20)
      .attr("transform", "rotate(-90)");

    // Tooltip
    d3.select("#app")
      .append("div")
      .attr("id", "tooltip")
      .attr("style", "position: absolute; opacity: 0;");
  });
