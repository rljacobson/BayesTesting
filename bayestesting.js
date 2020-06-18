
/*---------------------UI Constants---------------------*/

// Constants
const SIMULATION_INTERVAL = 1000;
const POOL_SIZE = 30;
let metrics;
let people;
const n = 50;
const people_count = n*n;
let continueSimulation = false;
let peopleChanged = false;
const SIMULATIONINTERVAL = window.setInterval(simulationIntervalHandler, SIMULATION_INTERVAL);


/*---------------------Graphics Constants---------------------*/

const width  = 50;
const height = 50;

const svg = d3.select("#people_dots")
              .append("svg")
              .attr("viewBox", [0, 0, width + 1, height + 1])
              .attr("id", "graphicSVG");

const x = d3.scaleLinear()
      .domain([0, n])
      .range([0, width]);

const y = d3.scaleLinear()
      .domain([0, n])
      .range([0, height]);

const color = d3.scaleOrdinal()
                .domain([0, 1])
                .range(d3.schemeCategory10);

const pack = data => d3.pack().size([width, height])(
    d3.hierarchy({ children: data }).sum(d => {
      // This effects padding:
      return d.color + 1;
    })
  );


function radioDisplay(){
  d3.selectAll("input[name='displayAsRadio']")
    .on("change", function() {
      // mutable displayAs = this.value;
      if (this.value === "Grid") {
        d3.selectAll("#graphicSVG")
          .selectAll("circle")
          .transition()
          .duration(2000)
          .ease(d3.easeCubicInOut)
          .attr(
            "transform",
            d => `translate(${x(d.data.x + 1)},${y(d.data.y + 1)})`
          );
      } else {
        d3.selectAll("#graphicSVG")
          .selectAll("circle")
          .transition()
          .duration(2000)
          .ease(d3.easeCubicInOut)
          .attr("transform", d => `translate(${x(d.x + 1)},${y(d.y + 1)})`);
      }
    });

  document.querySelector(`#Cluster`).checked = true;
}

function makeGraphic(){
  const root = pack(people);
  const leaf = svg.selectAll("g")
                  .data(root.leaves())
                  .join("circle")
                  .attr("transform", d => `translate(${x(d.x + 1)},${y(d.y + 1)})`)
                  .attr("r", d => d.data.size)
                  .attr("fill-opacity", 0.8)
                  .attr("fill", d => color(d.data.color));


  // return svg.node();
}

function updateColors(){
  // Update graphic
  d3.selectAll("#graphicSVG")
    .selectAll("circle")
    .transition()
    .duration(2000)
    .ease(d3.easeCubicInOut)
    .attr("fill", d => color(d.data.color));
}

/*---------------------End Graphics---------------------*/

function simulationIntervalHandler(){
  if(continueSimulation){
    continueSimulation = false;
    computeMetrics();
    if(peopleChanged){
      updatePeople();
      updateColors();
      peopleChanged = false;
    }
    simulate();
    updateMetrics();
  }
}

function getRandomSample(array, count) {
  let indices = [];
  let result = new Array(count);
  for (let i = 0; i < count; i++) {
    let j = Math.floor(Math.random() *
                       (
                           array.length - i
                       ) +
                       i);
    result[i] = array[indices[j] === undefined ? j : indices[j]];
    indices[j] = indices[i] === undefined ? i : indices[i];
  }
  return result;
}

function sliderUpdate(val, valueLabel) {
  if(valueLabel === '#infection_rate') {
    document.querySelector(valueLabel).value = (val * 100.0).toFixed(2) + '%';
    peopleChanged = true;
  }
  computeMetrics();
  updateMetrics();
  continueSimulation = true;
}

function updateMetrics(){

  percentages = [
    'sensitivity',
    'true_positive_rate',
    'true_negative_rate',
    'specificity',
    'precision',
    'infection_rate',
    'effective_simulated_sensitivity',
    'effective_simulated_specificity',
    'negative_predictive_value',
    'false_negative_rate',
    'false_positive_rate',
    'false_discovery_rate',
    'false_omission_rate',
    'critical_success_index',
    'prevalence_threshold',
    // 'threat_score',
    'accuracy',
    'balanced_accuracy',
    'f1_score',
    // 'matthews_cc',
    // 'fowlkes_mallows_index',
    'informedness',
    'markedness',
  ];
  integers = [
    'true_positive_count',
    'true_negative_count',
    'false_positive_count',
    'false_negative_count',
    'positive_count',
    'negative_count',
    'people_count',
    'pool_size',
    'simulated_false_positive',
    'simulated_false_negative',
    'simulated_true_positive',
    'simulated_true_negative',
    'simulated_tests_used',
  ]


  for (const property in metrics){
    let value = metrics[property];
    let dom_obj = document.querySelector(`#${property}`);
    if(dom_obj){
      if(percentages.includes(property)){
        dom_obj.innerHTML = `${(value * 100).toFixed(2)}%`;
      } else if (integers.includes(property)){
        dom_obj.innerHTML = `${Math.round(value)}`;
      } else{
        dom_obj.innerHTML = value.toFixed(4);
      }
    } else{
      console.log(`The selector #${property} is ${document.querySelector('#'+property)}.`);
    }
  }
}

function computeMetrics() {
  let sensitivity, specificity;
  sensitivity = Number(document.querySelector('#true_positive_rate_slider').value);
  let true_positive_rate = sensitivity;
  specificity = Number(document.querySelector('#true_negative_rate_slider').value);
  let true_negative_rate = specificity;
  let infection_rate = Number(document.querySelector('#infection_rate_slider').value);
  let people_count = Number(document.querySelector('#people_count').innerHTML);

  updated_values = {
    "pool_size"                : POOL_SIZE,
    "infection_rate"           : infection_rate,
    "people_count"             : people_count,
    "sensitivity"              : sensitivity,
    "specificity"              : specificity,
    "true_positive_rate"       : true_positive_rate,
    "true_negative_rate"       : true_negative_rate,
    "true_positive_count"      : people_count * infection_rate * sensitivity,
    "true_negative_count"      : people_count * (1.0 - infection_rate) * specificity,
    "false_positive_count"     : people_count * (1.0 - infection_rate) * (1.0 - specificity),
    "false_negative_count"     : people_count * infection_rate * (1.0 - sensitivity),
    "positive_count"           : Math.round(people_count * infection_rate),
    "negative_count"           : Math.round(people_count *
                                            (1.0 - infection_rate)),
    "precision"                : infection_rate * sensitivity /
                                  (infection_rate * sensitivity +
                                  (1.0 - infection_rate) * (1.0 - specificity)),
    "negative_predictive_value": (1.0 - infection_rate) * specificity /
                                 ((1.0 - infection_rate) * specificity +
                                  infection_rate * (1 - sensitivity)),
    "false_negative_rate" : 1.0 - sensitivity,
    "false_positive_rate" : 1.0 - specificity
  };
  if(typeof metrics !== 'undefined'){
    metrics = Object.assign(metrics, updated_values);
  } else{
    metrics = updated_values;
  }

  metrics["false_discovery_rate"]   = 1.0 - metrics["precision"];
  metrics["false_omission_rate"]    = 1.0 - metrics["negative_predictive_value"];
  metrics["critical_success_index"] = infection_rate * sensitivity /
                                      (infection_rate + (1.0 - infection_rate) * (1.0 - specificity));
  metrics["prevalence_threshold"] = (Math.sqrt(true_positive_rate * (1 - true_negative_rate)) +
                                     true_negative_rate - 1) /
                                     (true_negative_rate + true_negative_rate - 1);
  metrics["threat_score"] = metrics["true_positive_count"] /
                             (metrics["true_positive_count"] + metrics["false_negative_count"] +
                             metrics["false_positive_count"]);
  metrics["accuracy"] = infection_rate*sensitivity + (1.0-infection_rate) * specificity;
  metrics["balanced_accuracy"] = (sensitivity + specificity)/2.0;
  metrics["f1_score"] = 2.0*metrics["precision"]*sensitivity/(metrics["precision"]+sensitivity);

  // For Matthew's Correlation Coefficient
  let true_positive_count  = metrics["true_positive_count"];
  let false_positive_count = metrics["false_positive_count"];
  let true_negative_count  = metrics["true_negative_count"];
  let false_negative_count = metrics["false_negative_count"];

  metrics["matthews_cc"] = (true_positive_count * true_negative_count -
                            false_positive_count* false_negative_count) /
                           Math.sqrt((true_positive_count + false_positive_count) *
                                     (true_positive_count+false_negative_count)   *
                                     (true_negative_count+false_positive_count)   *
                                     (true_negative_count+false_negative_count)
                           );
  metrics["fowlkes_mallows_index"] = Math.sqrt(metrics["precision"] * true_positive_rate);
  metrics["informedness"] = sensitivity + specificity - 1.0;
  metrics["markedness"] = metrics["precision"] + metrics["negative_predictive_value"] - 1;

  // metrics['effective_simulated_sensitivity'] =
  //         (
  //             metrics.simulated_true_positive / metrics.positive_count
  //         ) * 100;
  //
  // metrics['effective_simulated_specificity'] =
  //         (
  //             metrics.simulated_true_negative / metrics.negative_count
  //         ) * 100;

  // return metrics;
}

function simulate() {
  let pool_size       = POOL_SIZE;
  let start           = 0;
  let true_negatives  = 0;
  let true_positives  = 0;
  let false_negatives = 0;
  let false_positives = 0;
  let tests           = 0;

  while (start < people.length) {
    let pool = people.slice(start, start + pool_size);

    tests++; // One test for the pool.

    if (pool.every(d => (d.color === 0))) {
      // All members of the pool are negative
      // Negative
      if (Math.random() < metrics.true_negative_rate) {
        // Tested negative
        pool.forEach(d => {
          d.test_result = 0;
        });
        true_negatives += pool.length;
      } else {
        // Tested positive, so retest
        tests += pool.length;
        pool.forEach(d => {
          if (Math.random() < metrics.true_negative_rate) {
            // True negative
            d.test_result = false;
            true_negatives++;
          } else {
            // A false positive.
            d.test_result = true;
            false_positives++;
          }
        });
      }
    } else {
      // At least one positive in pool
      if (Math.random() < metrics.true_positive_rate) {
        // Pool correctly tests positive.
        // Tested positive, so retest
        tests += pool.length;
        pool.forEach(d => {
          // Four cases
          if ((d.color === 0) && (Math.random() < metrics.true_negative_rate)) {
            // True negative
            d.test_result = false;
            true_negatives++;
          } else if( (d.color === 0)  && (Math.random() >= metrics.true_negative_rate)){
            // A false positive.
            d.test_result = true;
            false_positives++;
          } else if ((d.color === 1) && (Math.random() < metrics.true_positive_rate)) {
            // A true positive.
            d.test_result = true;
            true_positives++;
          } else if ((d.color===1) && (Math.random() >= metrics.true_positive_rate)){
            // A false negative
            d.test_result = false;
            false_negatives++;
          }
        });

      } else {
        // Pool incorrectly tests negative
        pool.forEach(d => {
          if (d.color === 1) {
            false_negatives++;
          } else {
            true_negatives++;
          }
        });
      }
    }

    start += pool_size;
  }

  metrics['simulated_false_negative'] = false_negatives;
  metrics['simulated_false_positive'] = false_positives;
  metrics['simulated_true_negative']  = true_negatives;
  metrics['simulated_true_positive']  = true_positives;
  metrics['simulated_tests_used']     = tests;
  metrics['effective_simulated_sensitivity'] = (
              metrics['simulated_true_positive'] / metrics['positive_count']
          );
   metrics['effective_simulated_specificity'] = metrics['simulated_true_negative'] / metrics['negative_count'];
}

function updatePeople(){
  let infected = getRandomSample(people, metrics.positive_count);
  people.forEach((d)   => {
    d.color = 0;
  });
  infected.forEach((d) => {
    d.color = 1;
  });
}

function init() {
  // Globals.
  people = [];
  computeMetrics();

  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      people.push({
                    x:           x,
                    y:           y,
                    size:        d3.randomUniform(0.2, 0.3)(),
                    color:       0,
                    test_result: false // Only necessary if using this info form animation.
                  });
    }
  }

  updatePeople();
  simulate();
  computeMetrics();
  updateMetrics();
  makeGraphic();
  radioDisplay();
}

init();