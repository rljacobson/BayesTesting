# import dash_katex
import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output
import plotly.graph_objects as go
import numpy as np
import math

from Python.layout import LAYOUT

# external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']
app = dash.Dash(__name__)

app.scripts.config.serve_locally = True
app.css.config.serve_locally = True

server = app.server

app.layout = html.Div(children=[
  html.Div(children=[
    html.Div(children=[
      html.Div(children="Number of People: ", style={"marginRight": "1rem", "display":
        "inline-block"}),
      html.Div(id="people_count", children="2500", style={"display": "inline-block"})
    ], style={"whiteSpace": "nowrap", "marginTop": "5rem"}),
    dcc.Graph(id="people_dots",
              style={
                "display": "inline-block", "marginTop": "-5rem", "marginBottom": "-4rem"
              }
              ),
  ], style={"overflow": "clip",
    "textAlign": "center",
  }),
  html.Div(children=[
    html.Div(children=[
      html.Label('Sensitivity (True Positive Rate): ',
                 style={"textAlign": "center", "display": "inline"}),
      html.Div(id="true_positive_rate_label", style={"display": "inline"}),
    ], style={"textAlign": "center", "whiteSpace": "nowrap"}),
    dcc.Slider(**{
      "id"   : "true_positive_rate",
      "min"  : 0.30,
      "max"  : 1.0,
      "step" : 0.001,
      "value": 0.95
    })
  ], style={"textAlign": "center"}),
  html.Div(children=[
    html.Div(children=[
      html.Label('Specificity (True Negative Rate): ',
                 style={"textAlign": "center", "display": "inline"}),
      html.Div(id="true_negative_rate_label", style={"display": "inline"}),
    ]),
    dcc.Slider(**{
      "id"   : "true_negative_rate",
      "min"  : 0.30,
      "max"  : 1.0,
      "step" : 0.001,
      "value": 0.94
    })
  ], style={"textAlign": "center"}),
  html.Div(children=[
    html.Div(children=[
      html.Label('Infection Rate: ', style={"display": "inline"}),
      html.Div(id="infection_rate_label", style={"display": "inline"}),
    ]),
    dcc.Slider(**{
      "id"   : "infection_rate",
      "min"  : 0.0,
      "max"  : 0.20,
      "step" : 0.0005,
      "value": 0.05
    })
  ]),
  LAYOUT
], style={"maxWidth": "60rem", "marginLeft": "auto", "marginRight": "auto", "textAlign": "center",
          "display": "block"})


def make_people(infection_rate, people_count):
  n = int(math.sqrt(people_count))
  # people_count = n*n
  infected_N = int(people_count*infection_rate)
  infected_x = np.random.choice(range(n), infected_N)
  infected_y = np.random.choice(range(n), infected_N)
  infected_idx = [100*x + y for (x, y) in zip(infected_x,infected_y)]
  x_pos = [x for x in range(n) for y in range(n) if (100*x+y) not in infected_idx]
  y_pos = [y for x in range(n) for y in range(n) if (100*x+y) not in infected_idx]
  traces_negative = go.Scatter(
      x=infected_x,
      y=infected_y,
      # text="Infected",
      mode='markers',
      # opacity=0.8,
      marker=dict(
          color=8,
          colorscale= 'Rainbow',
          size=8
      ),
      name="Infected"
  )
  traces_positive = go.Scatter(
      x=x_pos,
      y=y_pos,
      text="Healthy",
      mode='markers',
      # opacity=0.8,
      marker=dict(
          color=3,
          colorscale='Rainbow',
          size=8
          # line_width=1
      ),
      name="Healthy"
  )
  layout = { 'width' : 600, 'height' : 600,
            'paper_bgcolor': 'rgba(0,0,0,0)',
            'plot_bgcolor': 'rgba(0,0,0,0)',
            'xaxis': {
                'range': [-1, n],
                'showgrid': False,  # thin lines in the background
                'zeroline': False,  # thick line at x=0
                'visible': False,   # numbers below
            },
            'yaxis': {
                'range': [-1, n],
                'showgrid': False,  # thin lines in the background
                'zeroline': False,  # thick line at x=0
                'visible': False,   # numbers below
            },
  }
  people_dots = go.Figure(layout=layout)
  people_dots.add_trace(traces_positive)
  people_dots.add_trace(traces_negative)
  return people_dots

@app.callback(
  [
    Output(component_id="true_negative_rate_label", component_property="children"),
    Output(component_id="true_positive_rate_label", component_property="children"),
    Output(component_id="infection_rate_label", component_property="children")
  ],
  [
    Input("true_negative_rate", "value"),
    Input("true_positive_rate", "value"),
    Input("infection_rate", "value")
  ],
)
def slider_render(*values):
  return ["{:.2f}%".format(value*100.0) for value in values]


@app.callback(
    [
      Output(component_id="people_dots", component_property="figure")
    ],
    [
      Input(component_id="infection_rate", component_property="value"),
      Input(component_id="people_count", component_property="children"),
    ]
)
def people_render(infection_rate, people_count):
  return [make_people(infection_rate, float(people_count))]


# @app.callback(
#     [
#
#     ],
#     [
#       Input("true_positive_rate", "value"),
#       Input("true_negative_rate", "value"),
#       Input("infection_rate", "value"),
#       Input("people_count", "children")
#     ]
# )
def metrics_render(*values):

  true_positive_rate = sensitivity = float(values[0])
  true_negative_rate = specificity = float(values[1])
  infection_rate = float(values[2])
  people_count = float(values[3])
  metrics = {
    "sensitivity"              : sensitivity,
    "specificity"              : specificity,
    "true_positive_count"      : people_count * infection_rate * sensitivity,
    "true_negative_count"      : people_count * (1.0 - infection_rate) * specificity,
    "false_positive_count"     : people_count * (1.0 - infection_rate) * (1.0 - specificity),
    "false_negative_count"     : people_count * infection_rate * (1.0 - sensitivity),
    "positive_count"           : people_count * infection_rate,
    "negative_count"           : people_count * (1.0 - infection_rate),
    "precision_ppv"            : infection_rate * sensitivity /
                                 (infection_rate * sensitivity + (1.0 - infection_rate) * (
                                       1.0 - specificity)),
    "negative_predictive_value": (1.0 - infection_rate) * specificity /
                                 ((1.0 - infection_rate) * specificity + infection_rate * (
                                     1 - sensitivity)),
    "false_negative_rate"      : 1.0 - sensitivity,
    "false_positive_rate"      : 1.0 - specificity
  }

  metrics["false_discovery_rate"]   = 1.0 - metrics["precision_ppv"]
  metrics["false_omission_rate"]    = 1.0 - metrics["negative_predictive_value"]
  metrics["critical_success_index"] = infection_rate * sensitivity /  \
                                  (infection_rate + (1.0-infection_rate) * (1.0 - specificity))
  metrics["prevalence_threshold"] = (math.sqrt(true_positive_rate*(1-true_negative_rate)) +
                                        true_negative_rate - 1) / \
                                    (true_negative_rate + true_negative_rate - 1)
  metrics["threat_score"] = metrics["true_positive_count"] /  \
                            (metrics["true_positive_count"] + metrics["false_negative_count"] +
                             metrics["false_positive_count"])
  metrics["accuracy"] = infection_rate*sensitivity + (1.0-infection_rate) * specificity
  metrics["balanced_accuracy"] = (sensitivity + specificity)/2.0
  metrics["f1_score"] = 2.0*metrics["precision_ppv"]*sensitivity/(metrics["precision_ppv"]+sensitivity)

  # For Matthew's Correlation Coefficient
  true_positive_count = metrics["true_positive_count"]
  false_positive_count = metrics["false_positive_count"]
  true_negative_count = metrics["true_negative_count"]
  false_negative_count = metrics["false_negative_count"]

  metrics["matthews_cc"] = (true_positive_count * true_negative_count -
                            false_positive_count* false_negative_count) /  \
                            math.sqrt((true_positive_count + false_positive_count) *
                                      (true_positive_count+false_negative_count)   *
                                      (true_negative_count+false_positive_count)   *
                                      (true_negative_count+false_negative_count)
                            )
  metrics["fowlkes_mallows_index"] = math.sqrt(metrics["precision_ppv"] * true_positive_rate)
  metrics["informedness"] = sensitivity + specificity - 1.0
  metrics["markedness"] = metrics["precision_ppv"] + metrics["negative_predictive_value"] - 1


  for key, value in metrics.items():
    print("'{key}',".format( key=key, value=value))

metrics_render(0.3, 0.02, 0.23, 2500)
# app.run_server(debug=True)
# app.run_server(debug=True, port=8051)

