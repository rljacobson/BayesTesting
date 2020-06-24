
/*---------------------UI Constants---------------------*/

// Constants
const currencyFormat = d3.format("$,.2f");
const ANIMATION_INTERVAL = 1000;
let nmetrics;
let spmetrics;
let people;
let continueAnimation = false;
let peopleChanged = false;
const ANIMATIONINTERVAL = window.setInterval(animationIntervalHandler, ANIMATION_INTERVAL);

// These are the default values and can be set by a URL parameter.
const DEFAULT_VALUES = {
  'pool_size': 15,
  'cost_per_test': 100,
  'people_count': 10000,
  'infection_rate': 0.05,
  'sensitivity': 0.85,
  'specificity': 1.0,
  'select_stats': 'naive'
}


/*---------------------Graphics Constants---------------------*/

const width  = 50;
const height = 50;
const n = 50; // Only for graphics!
// const people_count = n*n;

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


function attachRadioHandlers(){
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

  d3.selectAll("input[name='tabset']")
    .on("change", function() {
      DEFAULT_VALUES.select_stats = this.value;
      // One of the very few times `updateMetrics()` can be called without first calling `compute*()`.
      updateMetrics();
    });
}

function makeGraphic(){
  const root = pack(people);
  const leaf = svg.selectAll("g")
                  .data(root.leaves())
                  .join("circle")
                  .attr("transform", d => `translate(${x(d.x + 1)},${y(d.y + 1)})`)
                  .attr("r", d => d.data.size)
                  // .attr("fill-opacity", 0.8)
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


function animationIntervalHandler(){
  if(continueAnimation){
    continueAnimation = false;
    if(peopleChanged){
      updatePeople();
      updateColors();
      peopleChanged = false;
    }
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

function tabUpdate(val){
  DEFAULT_VALUES.select_stats = val;
}

function sliderUpdate(val, valueLabel) {
  if(valueLabel === '#infection_rate') {
    peopleChanged = true;
  }


  DEFAULT_VALUES.sensitivity = Number(document.querySelector('#true_positive_rate_slider').value);
  DEFAULT_VALUES.specificity = Number(document.querySelector('#true_negative_rate_slider').value);
  DEFAULT_VALUES.infection_rate = Number(document.querySelector('#infection_rate_slider').value);
  DEFAULT_VALUES.people_count = Number(document.querySelector('#people_count_slider').value);
  DEFAULT_VALUES.pool_size = Number(document.querySelector('#pool_size_slider').value);

  computeNaiveMetrics();
  computeSamplePoolingMetrics();
  updateMetrics();
  continueAnimation = true;
}

function updateMetrics(){

  let percentages = [
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
    'precision'
  ];
  let integers = [
    'true_positive_count',
    'true_negative_count',
    'false_positive_count',
    'false_negative_count',
    'positive_count',
    'negative_count',
    'people_count',
    'pool_size',
    'tests_used',
  ];
  let currency = [
    'total_cost',
    'cost_per_test_label'
  ]

  let metrics;

  // Update the expected values.
  let metrics_set = [nmetrics,  spmetrics];

  for (i = 0; i<2; i++) {
    metrics = metrics_set[i];
    console.log(metrics);
    for (const property in metrics) {
      let value = metrics[property];
      let dom_obj = document.querySelector(`#${metrics.prefix}${property}`);
      if (dom_obj) {
        if (percentages.includes(property)) {
          dom_obj.innerHTML = `${(value * 100).toFixed(2)}%`;
        } else if (integers.includes(property)) {
          dom_obj.innerHTML = `${Math.round(value)}`;
        } else if (currency.includes(property)) {
          dom_obj.innerHTML = currencyFormat(value);
        } else {
          dom_obj.innerHTML = value.toFixed(4);
        }
      } else {
        console.log(`The selector #${metrics.prefix}${property} is ${document.querySelector('#' + metrics.prefix + property)}.`);
      }
    }
  }

  // Now update the stats based on tab selected.

  if (DEFAULT_VALUES.select_stats === "naive"){
    metrics = nmetrics;
  } else{
    metrics = spmetrics;
  }

  // Update stats - without prefix
  for (const property in metrics) {
    let value = metrics[property];
    let dom_obj = document.querySelector(`#${property}`);
    if (dom_obj) {
      if (percentages.includes(property)) {
        dom_obj.innerHTML = `${(value * 100).toFixed(2)}%`;
      } else if (integers.includes(property)) {
        dom_obj.innerHTML = `${Math.round(value)}`;
      } else if (currency.includes(property)) {
        dom_obj.innerHTML = currencyFormat(value);
      } else {
        dom_obj.innerHTML = value.toFixed(4);
      }
    } else {
      // pass
    }
  }

  /*
  // Sample Pooling metrics
  for (const property in spmetrics){
    let value = spmetrics[property];
    let dom_obj = document.querySelector(`#pooling_${property}`);
    if(dom_obj){
      if(percentages.includes(property)){
        dom_obj.innerHTML = `${(value * 100).toFixed(2)}%`;
      } else if (integers.includes(property)) {
        dom_obj.innerHTML = `${Math.round(value)}`;
      } else if (currency.includes(property)){
        dom_obj.innerHTML = currencyFormat(value);
      } else{
        dom_obj.innerHTML = value.toFixed(4);
      }
    } else{
      console.log(`The selector #pooling_${property} is ${document.querySelector('#pooling_'+property)}.`);
    }
  }

  // costs for naive testing
  let dom_obj = document.querySelector(`#total_cost`);
  dom_obj.innerHTML = '$' + d3.format(",")(metrics.total_cost);
  // costs for sample pooling
  dom_obj = document.querySelector(`#pooling_total_cost`);
  dom_obj.innerHTML = '$' + d3.format(",")(Math.round(spmetrics.total_cost));
  // cost per test labels
  dom_obj = document.querySelector(`#pooling_total_cost_label`);
  dom_obj.innerHTML = '$' + d3.format(",")(Math.round(DEFAULT_VALUES.cost_per_test));

 */
}

function computeMetrics(sensitivity, specificity, tests_used) {
  let true_positive_rate = sensitivity;
  let true_negative_rate = specificity;
  let infection_rate = DEFAULT_VALUES.infection_rate;
  let people_count = DEFAULT_VALUES.people_count;
  let pool_size = DEFAULT_VALUES.pool_size;
  let cost_per_test = DEFAULT_VALUES.cost_per_test;

  let updated_values = {
    "pool_size"                : pool_size,
    "infection_rate"           : infection_rate,
    "people_count"             : people_count,
    "tests_used"               : tests_used,
    "total_cost"               : tests_used*cost_per_test,
    "sensitivity"              : sensitivity,
    "specificity"              : specificity,
    "true_positive_rate"       : true_positive_rate,
    "true_negative_rate"       : true_negative_rate,
    "true_positive_count"      : people_count * infection_rate * sensitivity,
    "true_negative_count"      : people_count * (1.0 - infection_rate) * specificity,
    "false_positive_count"     : people_count * (1.0 - infection_rate) * (1.0 - specificity),
    "false_negative_count"     : people_count * infection_rate * (1.0 - sensitivity),
    "positive_count"           : people_count * infection_rate,
    "negative_count"           : people_count * (1.0 - infection_rate),
    "precision"                : infection_rate * sensitivity /
                                 (infection_rate * sensitivity +
                                  (1.0 - infection_rate) * (1.0 - specificity)),
    "negative_predictive_value": (1.0 - infection_rate) * specificity /
                                 ((1.0 - infection_rate) * specificity +
                                  infection_rate * (1 - sensitivity)),
    "false_negative_rate" : 1.0 - sensitivity,
    "false_positive_rate" : 1.0 - specificity,
    "cost_per_test_out": cost_per_test
  };
  // if(typeof metrics !== 'undefined'){
  //   metrics = Object.assign(metrics, updated_values);
  // } else{
  //   metrics = updated_values;
  // }

  updated_values["false_discovery_rate"]   = 1.0 - updated_values["precision"];
  updated_values["false_omission_rate"]    = 1.0 - updated_values["negative_predictive_value"];
  updated_values["critical_success_index"] = infection_rate * sensitivity /
                                             (infection_rate + (1.0 - infection_rate) * (1.0 - specificity));
  updated_values["prevalence_threshold"] = (Math.sqrt(true_positive_rate * (1 - true_negative_rate)) +
                                            true_negative_rate - 1) /
                                           (true_negative_rate + true_negative_rate - 1);
  updated_values["threat_score"] = updated_values["true_positive_count"] /
                                   (updated_values["true_positive_count"] + updated_values["false_negative_count"] +
                                    updated_values["false_positive_count"]);
  updated_values["accuracy"] = infection_rate*sensitivity + (1.0-infection_rate) * specificity;
  updated_values["balanced_accuracy"] = (sensitivity + specificity)/2.0;
  updated_values["f1_score"] = 2.0*updated_values["precision"]*sensitivity/(updated_values["precision"]+sensitivity);

  // For Matthew's Correlation Coefficient
  let true_positive_count  = updated_values["true_positive_count"];
  let false_positive_count = updated_values["false_positive_count"];
  let true_negative_count  = updated_values["true_negative_count"];
  let false_negative_count = updated_values["false_negative_count"];

  updated_values["matthews_cc"] = (true_positive_count * true_negative_count -
                                   false_positive_count* false_negative_count) /
                                  Math.sqrt((true_positive_count + false_positive_count) *
                                            (true_positive_count+false_negative_count)   *
                                            (true_negative_count+false_positive_count)   *
                                            (true_negative_count+false_negative_count)
                                  );
  updated_values["fowlkes_mallows_index"] = Math.sqrt(updated_values["precision"] * true_positive_rate);
  updated_values["informedness"] = sensitivity + specificity - 1.0;
  updated_values["markedness"] = updated_values["precision"] + updated_values["negative_predictive_value"] - 1;

  return updated_values;
}

function computeNaiveMetrics(){
  nmetrics = computeMetrics(DEFAULT_VALUES.sensitivity, DEFAULT_VALUES.specificity, DEFAULT_VALUES.people_count);
  nmetrics['prefix'] = 'naive_';
}

function computeSamplePoolingMetrics() {
  let sensitivity, specificity;
  sensitivity = DEFAULT_VALUES.sensitivity;
  specificity = DEFAULT_VALUES.specificity;
  let infection_rate = DEFAULT_VALUES.infection_rate;
  let people_count = DEFAULT_VALUES.people_count;
  let pool_size = DEFAULT_VALUES.pool_size;
  let false_positive_rate = 1-specificity;
  let false_negative_rate = 1-sensitivity;

  /*
    We assume pooling doesn't affect sensitivity and specificity. Though this is unlikely for most testing
     contexts, it is approximately correct with qPCR diagnostic methods.

  */

  /**
    Ultimately want P(pos | infected) and P(neg | not infected)

    P(pos | infected) = sensitivity^2

      start --X-->pool not infected
      │ 100% (assumed)
      ↓
      pool infected ----> pool negative
      │ sensitivity
      ↓
      pool positive--X--> not infected
      │ 100% (assumed)
      ↓
      infected
      │ sensitivity
      ↓
      positive
   */
  let positive_given_infected = sensitivity**2;

   /**
    P(neg | not infected) = ((1 - infection_rate)**(pool_size-1))* spec**2
      + (1-(1 - infection_rate)**(pool_size-1)) * false_negative_rate
      + (1-(1 - infection_rate)**(pool_size-1)) * sensitivity * specificity

   ((1 - infection_rate)**(pool_size-1))* spec        100%, as pool tested negative
    start ----> pool not infected ----> pool negative ----> not infected ----> neg
      │ (1-(1 - infection_rate)**(pool_size-1))
      ↓         false_neg_rate      100%
    pool infected ----> pool negative ----> negative
      │ sensitivity
      ↓
    pool positive
      │ 100% assumed
      ↓
    not infected
      │ specificity
      ↓
    negative
   */
  let negative_given_not_infected =((1 - infection_rate)**(pool_size-1)) * specificity
                                   + (1-(1 - infection_rate)**(pool_size-1)) *
                                      false_negative_rate
                                   + (1-(1 - infection_rate)**(pool_size-1)) *
                                   sensitivity * specificity;



        // P(no infected in pool) = P(not infected)^pool_size
  let pool_not_infected = (1 - infection_rate)**pool_size;
  let pool_infected     = 1 - pool_not_infected;
  /*
  // P(infected | pool_infected) = P(infected and pool infected)/P(pool infected)
  // = P(infected)/P(pool_infected)
  infected_given_pool_infected = infection_rate / pool_infected;

  //needed?
  not_infected_given_pool_infected = 1 - infected_given_pool_infected;


  // P(pool positive | not infected), where the condition is, only the given single person is not infected.
  // Two cases: at least one of the other people is infected, or none of the others are infected.
  // P(pool positive | not infected) = P(pool positive | pool not infected) * P(pool not infected | not infected)
  // + P(pool positive | pool infected) * P(pool infected | not infected)
  // = false_positive_rate * (1 - infection_rate)**(pool_size-1) + sensitivity* [1 - (1 - infection_rate)**(pool_size-1)]
  pool_positive_given_not_infected = false_positive_rate*(1 - infection_rate)**(pool_size-1) +
                                     sensitivity* (1 - (1 - infection_rate)**(pool_size-1));
  // P(pool positive | infected) = P(pool positive | pool infected) = sensitivity

  // P(pool negative | not infected), where condition is, only given single person is not infected.
  pool_negative_given_not_infected = 1 - pool_positive_given_not_infected

  // P( infected | pool tests positive) = P( pool tests positive | infected)*P(infected) / P(pool tests positive)
  //  = Sensitivity * infection_rate /
  //  [ P( pool positive | infected)*P(infected) + P(pool positive | not infected)*P(not infected)]
  infected_given_pool_positive = sensitivity*infection_rate /
                                 (sensitivity*infection_rate + pool_positive_given_not_infected*(1-infection_rate));
  // P( infected | pool tests positive)
  not_infected_given_pool_positive = 1 - infected_given_pool_positive;
  // P( positive | pool positive) = P(infected | pool positive)*specificity +
  //     P(not infected | pool positive)*false_positive_rate
  positive_given_pool_positive = infected_given_pool_positive*specificity +
                                 not_infected_given_pool_positive*false_positive_rate;
  negative_given_pool_positive = infected_given_pool_positive*false_negative_rate +
                                 not_infected_given_pool_positive*specificity;

  // P(pool positive) = P(pool positive | pool infected) * P(pool infected)
  //    + P(pool positive | pool not infected) * P(pool not infected)

 */

  let pool_positive =  sensitivity*pool_infected + false_positive_rate * pool_not_infected;

  // pool_negative = 1-pool_positive;
  // P( infected | pool tests negative) = P(infected AND pool negative)/P(pool negative)
  //   = false_negative_rate/[ P(pool negative | pool infected) * P(pool infected)
  //      + P(pool negative | pool not infected) * P(pool not infected)]
  //// infected_given_pool_negative = false_negative_rate/(false_negative_rate*pool_infected
  ////    + specificity*pool_not_infected);
  // P(negative | pool negative) = 1 by def of sample pooling
  // negative_given_pool_negative = 1;

  let pooling_tests_used = people_count*(pool_positive + 1.0/pool_size);

  spmetrics = computeMetrics(positive_given_infected, negative_given_not_infected, pooling_tests_used);
  spmetrics['prefix'] = 'pooling_';
  /*
  let pooling_true_positive_rate   = positive_given_infected;
  let pooling_true_negative_rate   = negative_given_not_infected;
  let pooling_false_positive_rate  = 1 - pooling_true_negative_rate;
  let pooling_false_negative_rate  = 1 - pooling_true_positive_rate;
  let pooling_false_positive_count = people_count*(1 - infection_rate)*pooling_false_positive_rate;
  let pooling_false_negative_count = people_count * infection_rate * pooling_false_negative_rate;
  let pooling_true_positive_count  =   pooling_true_positive_rate*people_count * infection_rate ;
  let pooling_true_negative_count  =  pooling_true_negative_rate*people_count*(1 - infection_rate);


  spmetrics = {

    'pool_not_infected' :pool_not_infected,
    'pool_infected': pool_infected,
    'pool_positive_given_not_infected' : pool_positive_given_not_infected,
    'infected_given_pool_positive' : infected_given_pool_positive,
    'not_infected_given_pool_positive': not_infected_given_pool_positive,
    'positive_given_pool_positive' : positive_given_pool_positive,
    'negative_given_pool_positive' : negative_given_pool_positive,
    'pool_positive' : pool_positive,
    'pool_negative': pool_negative,
    'negative_given_pool_negative' : 1,
    'not_infected_given_pool_infected': not_infected_given_pool_infected,
    'infected_given_pool_infected': infected_given_pool_infected,
    'pool_negative_given_not_infected': pool_negative_given_not_infected,


    ////
    "sensitivity"          : pooling_true_positive_rate,
    "specificity"          : pooling_true_negative_rate,
    "positive_count"       : metrics.positive_count,
    "negative_count"       : metrics.negative_count,
    "true_positive_rate"   : pooling_true_positive_rate, // alias
    "true_negative_rate"   : pooling_true_negative_rate, // alias
    "true_positive_count"  : pooling_true_positive_count,
    "true_negative_count"  : pooling_true_negative_count,
    "false_positive_count" : pooling_false_positive_count,
    "false_negative_count" : pooling_false_negative_count,
    "precision"            : pooling_true_positive_count /
                              metrics.positive_count,
    "negative_predictive_value": (1.0 - infection_rate) * pooling_true_positive_rate /
                                  ((1.0 - infection_rate) * pooling_true_positive_rate +
                                  infection_rate * pooling_false_negative_rate),
    "false_negative_rate" : pooling_false_negative_rate,
    "false_positive_rate" : pooling_false_positive_rate,
    "tests_used" : pooling_tests_used,
    "total_cost" : Math.round(pooling_tests_used*DEFAULT_VALUES.cost_per_test),
    "cost_per_test_out": DEFAULT_VALUES.cost_per_test
  };
  */

}

function updatePeople(){
  const people_count = n*n;

  let positive_count = Math.round(DEFAULT_VALUES.infection_rate*people_count);

  let infected = getRandomSample(people, positive_count);
  people.forEach((d)   => {
    d.color = 0;
  });
  infected.forEach((d) => {
    d.color = 1;
  });
}

function processURLParams(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const entries = urlParams.entries();
  // const keys = urlParams.keys();
  // const values = urlParams.values();

  // for (const key of keys) console.log(key);
  // for (const value of values) console.log(value);

  // console.log(queryString);

  for(const entry of entries) {
    console.log(`${entry[0]}: ${entry[1]}`);
    if (DEFAULT_VALUES.hasOwnProperty(entry[0])){
      if (Number(entry[1])){
        DEFAULT_VALUES[entry[0]] = Number(entry[1]);
      }
    }
  }

  // Set the default parameter values.
  document.querySelector('#true_positive_rate_slider').value = DEFAULT_VALUES.sensitivity;
  document.querySelector('#true_negative_rate_slider').value = DEFAULT_VALUES.specificity;
  document.querySelector('#infection_rate_slider').value = DEFAULT_VALUES.infection_rate;
  document.querySelector('#people_count_slider').value = DEFAULT_VALUES.people_count;
  document.querySelector('#pool_size_slider').value = DEFAULT_VALUES.pool_size;
}


function init() {
  people = []; // Global

  processURLParams();
  computeNaiveMetrics();
  computeSamplePoolingMetrics();

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
  updateMetrics();
  makeGraphic();
  attachRadioHandlers();
}

init();
