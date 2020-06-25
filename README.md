# Comparison Between Naïve Testing and Sample Pooling for Whole Populations

[![GitHub forks](https://img.shields.io/github/forks/rljacobson/BayesTesting.svg?style=social&label=Fork&maxAge=2592000)](https://github.com/rljacobson/BayesTesting/network/)
[![GitHub stars](https://img.shields.io/github/stars/rljacobson/BayesTesting.svg?style=social&label=Star&maxAge=2592000)](https://github.com/rljacobson/BayesTesting/stargazers/)
[![GitHub watchers](https://img.shields.io/github/watchers/rljacobson/BayesTesting.svg?style=social&label=Watch&maxAge=2592000)](https://github.com/rljacobson/BayesTesting/watchers/)
[![GitHub followers](https://img.shields.io/github/followers/rljacobson.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/rljacobson?tab=followers)


This demo compares individual testing with sample pooling for COVID-19. See it live here:

https://www.robertjacobson.dev/BayesTesting/BayesTesting.html

It is possible to set default values with parameters in the URL:

https://www.robertjacobson.dev/BayesTesting/BayesTesting.html?specificity=0.99&infection_rate=0.01&people_count=1500&pool_size=25

The variables available to set from the URL are as follows:

```javascript
DEFAULT_VALUES = {
    'pool_size'      : 15,
    'cost_per_test'  : 100,
    'people_count'   : 10000,  // Number of people
    'infection_rate' : 0.05,
    'sensitivity'    : 0.85,
    'specificity'    : 1.0,
    'select_stats'   : 'naive' // What the bottom panel shows. (`naive` is individual.)
}
```
