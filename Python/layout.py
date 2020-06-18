import dash_html_components as html

import dash_katex

# html.Tr(
#   children=[
#     html.Td(
#       children=[
#         \1
#       ]
#     ),
#     html.Td(className="answer-equals", children=["$$=$$"]),
#     html.Td(className="answer-value",
#       children=[
#         html.Dl(
#           children=[
#
#           ]
#         )
#       ]
#     )
#   ]
# ),

LAYOUT = \
  html.Table(className="wikitable", children=[
    html.Caption(children=[
      "Table from Wikipedia: Terminology and derivations from a ",
      html.A(href="https://en.wikipedia.org/wiki/Confusion_matrix", title="Confusion matrix",
             children="Confusion matrix")
    ]),
    html.Tbody(children=[

      # ------------------------

      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=["condition positive " + "(P)"]
                        ),
                        html.Dd(children=[
                          "the number of real positive cases in the data"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals", children=[
              "$$=$$"]),
            html.Td(id="positive_count", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=["condition negative " + "(N)"]
                        ),
                        html.Dd(children=[
                          "the number of real negative cases in the data"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="negative_count", className="answer-value")
          ]
      ),
      html.Tr(className="row-line"),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=["true positive " + "(TP)"]
                        ),
                        html.Dd(children=[
                          "eqv. with hit"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="true_positive_count", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=["true negative " + "(TN)"]
                        ),
                        html.Dd(children=[
                          "eqv. with correct rejection"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="true_negative_count", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=["false positive " + "(FP)"]
                        ),
                        html.Dd(children=[
                          " eqv. with ",
                          html.A(href="https://en.wikipedia.org/wiki/False_alarm", title="",
                                 children="false alarm"),
                          html.A(href="https://en.wikipedia.org/wiki/Type_I_error", title="",
                                 children=" Type I error ")
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="false_positive_count", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=["false negative " + "(FN)"]
                        ),
                        html.Dd(children=[
                          "eqv. with miss ",
                          html.A(href="https://en.wikipedia.org/wiki/Type_II_error",
                                 title="", children=" Type II error ")
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="false_negative_count", className="answer-value")
          ]
      ),
      html.Tr(className="row-line"),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=[
                              html.A(href="https://en.wikipedia.org/wiki/Sensitivity_(test)",
                                     title="Sensitivity (test)", children="sensitivity, "),
                              html.A(
                                href="https://en.wikipedia.org/wiki/Precision_and_recall#Recall",
                                title="Precision and recall", children=" recall, "),
                              html.A(href="https://en.wikipedia.org/wiki/Hit_rate",
                                     title="Hit rate",
                                     children=" hit rate "),
                              "or ",
                              html.A(href="https://en.wikipedia.org/wiki/Sensitivity_(test)",
                                     title="Sensitivity (test)", children="true positive rate"),
                              " (TPR)"
                            ]
                        ),
                        html.Dd(children=[
                          "$$\\mathrm {TPR} ={\\frac {\\mathrm {TP} }{\\mathrm {P} "
                                         "}}={\\frac {\\mathrm {TP} }{\\mathrm {TP} +\\mathrm {"
                                         "FN} }}=1-\\mathrm {FNR} $$"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="sensitivity", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=[
                              html.A(href="https://en.wikipedia.org/wiki/Specificity_(tests)",
                                     title="Specificity (tests)", children="specificity, "),
                              html.A(href="https://en.wikipedia.org/wiki/Specificity_(tests)",
                                     title="Specificity (tests)", children="selectivity,"),
                              " or ",
                              html.A(href="https://en.wikipedia.org/wiki/Specificity_(tests)",
                                     title="Specificity (tests)", children="true negative rate"),
                              " (TNR)"
                            ]
                        ),
                        html.Dd(children=[
                          "$$\\mathrm {TNR} ={\\frac {\\mathrm {TN} }{\\mathrm {N} "
                                         "}}={\\frac {\\mathrm {TN} }{\\mathrm {TN} +\\mathrm {"
                                         "FP} }}=1-\\mathrm {FPR} $$"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="specificity", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=[
                              html.A(
                                  href="https://en.wikipedia.org/wiki/Information_retrieval"
                                       "#Precision",
                                  title="Information retrieval", children="precision"),
                              " or ",
                              html.A(href="https://en.wikipedia.org/wiki/Positive_predictive_value",
                                     title="Positive predictive value",
                                     children="positive predictive value"),
                              " (PPV)"
                            ]
                        ),
                        html.Dd(children=[
                          "$$\\mathrm {PPV} ={\\frac {\\mathrm {TP} }{\\mathrm {TP} "
                                         "+\\mathrm {FP} }}=1-\\mathrm {FDR} $$"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="precision_ppv", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            id="negative predictive value",
                            children=[
                              html.A(href="https://en.wikipedia.org/wiki/Negative_predictive_value",
                                     title="Negative predictive value",
                                     children="negative predictive value"),
                              " (NPV) "
                            ]
                        ),
                        html.Dd(children=[
                          "$$\\mathrm {NPV} ={\\frac {\\mathrm {TN} }{\\mathrm {TN} "
                                         "+\\mathrm {FN} }}=1-\\mathrm {FOR} $$"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="negative_predictive_value", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=[
                              "miss rate or ",
                              html.A(
                                  href="https://en.wikipedia.org/wiki/Type_I_and_type_II_errors"
                                       "#False_positive_and_false_negative_rates",
                                  title="Type I and type II errors",
                                  children="false negative rate"),
                              " (FNR) ",
                            ]
                        ),
                        html.Dd(children=[
                          "$$\\mathrm {FNR} ={\\frac {\\mathrm {FN} }{\\mathrm {P} "
                                         "}}={\\frac {\\mathrm {FN} }{\\mathrm {FN} +\\mathrm {"
                                         "TP} }}=1-\\mathrm {TPR} $$"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="false_negative_rate", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            id="fall",
                            children=[
                              html.A(href="https://en.wikipedia.org/wiki/False_positive_rate",
                                     title="False positive rate", children="fall-out"),
                              " or ",
                              html.A(href="https://en.wikipedia.org/wiki/False_positive_rate",
                                     title="False positive rate", children="false positive rate"),
                              " (FPR) ",
                            ]
                        ),
                        html.Dd(children=[
                          "$$\\mathrm {FPR} ={\\frac {\\mathrm {FP} }{\\mathrm {N} "
                                         "}}={\\frac {\\mathrm {FP} }{\\mathrm {FP} +\\mathrm {"
                                         "TN} }}=1-\\mathrm {TNR} $$"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="false_positive_rate", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=[
                              html.A(href="https://en.wikipedia.org/wiki/False_discovery_rate",
                                     title="False discovery rate",
                                     children="false discovery rate "),
                              "(FDR)"
                            ]
                        ),
                        html.Dd(children=[
                          "$$\\mathrm {FDR} ={\\frac {\\mathrm {FP} }{\\mathrm {FP} "
                                         "+\\mathrm {TP} }}=1-\\mathrm {PPV} $$"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="false_discovery_rate", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=[
                              html.A(
                                  href="https://en.wikipedia.org/wiki/Positive_and_negative_predictive_values",
                                  title="Positive and negative predictive values",
                                  children="false omission rate"),
                              " (FOR) ",
                            ]
                        ),
                        html.Dd(children=[
                          "$$\\mathrm {FOR} ={\\frac {\\mathrm {FN} }{\\mathrm {FN} "
                                         "+\\mathrm {TN} }}=1-\\mathrm {NPV} $$"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="false_omission_rate", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=["Prevalence Threshold " + "(PT)"]
                        ),
                        html.Dd(children=[
                          "$$PT={\\frac {{\\sqrt {TPR(-TNR+1)}}+TNR-1}{(TPR+TNR-1)}}$$"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="prevalence_threshold", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=["Threat score " + "(TS)"]
                        ),
                        html.Dd(children=[
                          "$$\\mathrm {TS} ={\\frac {\\mathrm {TP} }{\\mathrm {TP} "
                                         "+\\mathrm {FN} +\\mathrm {FP} }}$$"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="threat_score", className="answer-value")
          ]
      ),
      html.Tr(className="row-line"),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=[
                              html.A(href="https://en.wikipedia.org/wiki/Accuracy",
                                     title="Accuracy",
                                     children="accuracy"),
                              "(ACC)"
                            ]
                        ),
                        html.Dd(children=[
                          "$$\\mathrm {ACC} ={\\frac {\\mathrm {TP} +\\mathrm {TN} "
                                         "}{\\mathrm {P} +\\mathrm {N} }}={\\frac {\\mathrm {TP} "
                                         "+\\mathrm {TN} }{\\mathrm {TP} +\\mathrm {TN} +\\mathrm "
                                         "{FP} +\\mathrm {FN} }}$$"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="accuracy", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(
                            children=["balanced accuracy " + "(BA)"]
                        ),
                        html.Dd(children=[
                          "$$\\mathrm {BA} ={\\frac {TPR+TNR}{2}}$$"
                        ])
                      ]
                  )
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="balanced_accuracy", className="answer-value")
          ]
      ),

      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(children=[
                          html.A(href="https://en.wikipedia.org/wiki/F1_score", title="F1 score",
                                 children="F1 score")
                        ]),
                        html.Dd(children=[
                          "is the ", html.A(
                              href="https://en.wikipedia.org/wiki/Harmonic_mean"
                                   "#Harmonic_mean_of_two_numbers",
                              title="Harmonic mean", children="harmonic mean"), " of ",
                          html.A(
                            href="https://en.wikipedia.org/wiki/Information_retrieval#Precision",
                            title="Information retrieval", children="precision"), " and ",
                          html.A(href="https://en.wikipedia.org/wiki/Sensitivity_(test)",
                                 title="Sensitivity (test)", children="sensitivity")
                        ]),
                        html.Dd(children=[
                          "$$\\mathrm {F} _{1}=2\\cdot {\\frac {\\mathrm {PPV} "
                                         "\\cdot \\mathrm "
                                         "{TPR} }{\\mathrm {PPV} +\\mathrm {TPR} }}={\\frac {"
                                         "2\\mathrm {TP} }{2\\mathrm {TP} "
                                         "+\\mathrm {FP} +\\mathrm {FN} }}$$"
                        ])
                      ])
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="f1_score", className="answer-value")
          ]
      ),
      # -------------------

      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(children=[
                          html.A(
                              href="https://en.wikipedia.org/wiki/Matthews_correlation_coefficient",
                              title="Matthews correlation coefficient",
                              children="Matthews correlation coefficient"),
                          " (MCC)"

                        ]),
                        html.Dd(children=[
                          "$$\\mathrm {MCC} ={\\frac {\\mathrm {TP} "
                                         "\\times \\mathrm {TN} -\\mathrm {FP} "
                                         "\\times \\mathrm {FN} }{\\sqrt {(\\mathrm {TP} "
                                         "+\\mathrm {"
                                         "FP} )(\\mathrm {TP} +\\mathrm {FN} )("
                                         "\\mathrm {TN} +\\mathrm {FP} )(\\mathrm {TN} +\\mathrm "
                                         "{FN} "
                                         ")}}}$$"
                        ]),

                      ]
                  ),
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="matthews_cc", className="answer-value")
          ]
      ), html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(children=[
                          html.A(
                              href="https://en.wikipedia.org/wiki/Fowlkes%E2%80%93Mallows_index",
                              title="Fowlkes–Mallows index",
                              children="Fowlkes–Mallows index"),
                          " (FM)"

                        ]),
                        html.Dd(children=[
                          "$$\\mathrm {FM} ={\\sqrt {{\\frac {TP}{"
                                         "TP+FP}}\\cdot {\\frac {TP}{TP+FN}}}}={"
                                         "\\sqrt {PPV\\cdot TPR}}$$"
                        ]),

                      ]
                  ),
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="fowlkes_mallows_index", className="answer-value")
          ]
      ), html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(
                      children=[
                        html.Dt(children=[
                          html.A(href="https://en.wikipedia.org/wiki/Informedness",
                                 title="Informedness", children="informedness "),
                          " or bookmaker informedness (BM)"

                        ]),
                        html.Dd(children=[
                          "$$\\mathrm {BM} =\\mathrm {TPR} +\\mathrm {TNR} -1$$"
                        ]),

                      ]
                  ),
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="informedness", className="answer-value")
          ]
      ),
      html.Tr(
          children=[
            html.Td(
                children=[
                  html.Dl(children=[
                    html.Dt(children=[
                      html.A(href="https://en.wikipedia.org/wiki/Markedness", title="Markedness",
                             children="markedness"),
                      "(MK) or deltaP"
                    ]),
                    html.Dd(children=[
                      "$$\\mathrm {MK} =\\mathrm {PPV} +\\mathrm {NPV} -1$$"
                    ])
                  ])
                ]
            ),
            html.Td(className="answer-equals",
                    children=["$$=$$"]),
            html.Td(id="markedness", className="answer-value")
          ]
      )
      # -----------------------
    ]),
  ])
