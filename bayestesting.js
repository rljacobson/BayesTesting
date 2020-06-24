
/*---------------------UI Constants---------------------*/

// Constants
const ANIMATION_INTERVAL = 1000;
const POOL_SIZE = 30;
let metrics;
let spmetrics;
let people;
const n = 50;
const people_count = n*n;
let continueAnimation = false;
let peopleChanged = false;
const ANIMATIONINTERVAL = window.setInterval(animationIntervalHandler, ANIMATION_INTERVAL);


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
    // computeMetrics();
    if(peopleChanged){
      updatePeople();
      updateColors();
      peopleChanged = false;
    }
    // simulate();
    // updateMetrics();
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
  continueAnimation = true;
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
    'precision'
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
    'tests_used'
  ]

  // Naive metrics
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

  // Sample Pooling metrics
  for (const property in spmetrics){
    let value = spmetrics[property];
    let dom_obj = document.querySelector(`#pooling_${property}`);
    if(dom_obj){
      if(percentages.includes(property)){
        dom_obj.innerHTML = `${(value * 100).toFixed(2)}%`;
      } else if (integers.includes(property)){
        dom_obj.innerHTML = `${Math.round(value)}`;
      } else{
        dom_obj.innerHTML = value.toFixed(4);
      }
    } else{
      console.log(`The selector #pooling_${property} is ${document.querySelector('#pooling_'+property)}.`);
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
  let people_count = Number(document.querySelector('#people_count_slider').value);

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

  computeSamplePoolingMetrics();
}

// Called by computeMetrics();
function computeSamplePoolingMetrics() {
  let pool_size           = POOL_SIZE;
  let sensitivity         = metrics.sensitivity;
  let specificity         = metrics.specificity;
  let infection_rate      = metrics.infection_rate;
  let false_positive_rate = metrics.false_positive_rate;
  let false_negative_rate = metrics.false_negative_rate;

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

   /*
    P(neg | not infected) = ((1 - infection_rate)**(pool_size-1))* spec**2
      + (1-(1 - infection_rate)**(pool_size-1)) * false_negative_rate
      + (1-(1 - infection_rate)**(pool_size-1)) * sensitivity * specificity

   ((1 - infection_rate)**(pool_size-1))* spec        100% (assumed)      spec
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
  let negative_given_not_infected =((1 - infection_rate)**(pool_size-1))* specificity**2
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

  let pooling_tests_used = metrics.people_count*(pool_positive + 1.0/pool_size);
  let pooling_true_positive_rate   = positive_given_infected;
  let pooling_true_negative_rate   = negative_given_not_infected;
  let pooling_false_positive_rate  = 1 - pooling_true_positive_rate;
  let pooling_false_negative_rate  = 1 - pooling_true_negative_rate;
  let pooling_true_positive_count =   pooling_true_positive_rate*metrics.positive_count;
  let pooling_true_negative_count  =  pooling_true_negative_rate*metrics.negative_count;


  spmetrics = {
    /*
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

     */
    ////
    "sensitivity"           : pooling_true_positive_rate,
    "specificity"           : pooling_true_negative_rate,
    "positive_count"        : metrics.positive_count,
    "negative_count"        : metrics.negative_count,
    "true_positive_rate" : pooling_true_positive_rate, // alias
    "true_negative_rate" : pooling_true_negative_rate, // alias
    "true_positive_count"   : pooling_true_positive_count,
    "true_negative_count"   : pooling_true_negative_count,
    "false_positive_count"  : metrics.negative_count - pooling_true_negative_count,
    "false_negative_count"  : metrics.positive_count - pooling_true_positive_count,
    "precision"             : pooling_true_positive_count /
                              metrics.positive_count,
    "negative_predictive_value": (1.0 - infection_rate) * pooling_true_positive_rate /
                                 ((1.0 - infection_rate) * pooling_true_positive_rate +
                                  infection_rate * pooling_false_negative_rate),
    "false_negative_rate" : pooling_false_negative_rate,
    "false_positive_rate" : pooling_false_positive_rate,
    "tests_used" : pooling_tests_used,
  };


}

function updatePeople(){
  let positive_count = Math.round(metrics.infection_rate*people_count);

  let infected = getRandomSample(people, positive_count);
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
  // simulate();
  computeMetrics();
  updateMetrics();
  makeGraphic();
  radioDisplay();
}

init();
