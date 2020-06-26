# Comparison Between Individual Testing and Sample Pooling for Whole Populations

[![GitHub forks](https://img.shields.io/github/forks/rljacobson/BayesTesting.svg?style=social&label=Fork&maxAge=2592000)](https://github.com/rljacobson/BayesTesting/network/)
[![GitHub stars](https://img.shields.io/github/stars/rljacobson/BayesTesting.svg?style=social&label=Star&maxAge=2592000)](https://github.com/rljacobson/BayesTesting/stargazers/)
[![GitHub watchers](https://img.shields.io/github/watchers/rljacobson/BayesTesting.svg?style=social&label=Watch&maxAge=2592000)](https://github.com/rljacobson/BayesTesting/watchers/)
[![GitHub followers](https://img.shields.io/github/followers/rljacobson.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/rljacobson?tab=followers)

## The Demo

This interactive demonstration compares individual sample testing to sample pooling for whole population testing. The idea is that nonscientists, e.g. policy makers, can sit and play with the sliders and get a feel for which variables have the most influence on outcomes of interest, comparing individual testing to sample pooling, a method in which samples from multiple people are mixed and tested using a single test.

## Usage

This demo compares individual testing with sample pooling for COVID-19. See it live here:

> https://www.robertjacobson.dev/BayesTesting/BayesTesting.html

It is possible to set default values with parameters in the URL:

> https://www.robertjacobson.dev/BayesTesting/BayesTesting.html?specificity=0.99&infection_rate=0.01&people_count=1500&pool_size=25

The variables available to set from the URL are as follows:

```javascript
const DEFAULT_VALUES = {
    'pool_size'      : 15,
    'cost_per_test'  : 100,
    'people_count'   : 10000,
    'infection_rate' : 0.05,
    'sensitivity'    : 0.85,
    'specificity'    : 1.0,
    'select_stats'   : 'naive',
    'stats_panel'    : 'closed'
}
```

## The Sample Pooling Testing Scheme

The sample pooling scheme pools samples from n individuals and uses a single test to test the pool. If the result is negative, the samples are assumed to be negative. If the result is positive, the individual (unpooled) samples are retested individually. (It is assumed a portion of the original individual samples are retained.) The model uses the counter-factual but simplifying assumption that the sensitivity and specificity for a pool is identical as for individual samples. It would be easy to include a feature that attenuates the sensitivity as an infected sample is increasingly diluted with larger pool sizes. Users can also account for dilution by lowering sensitivity.

## Technical Notes

It includes a feature I have not seen elsewhere in the literature: it computes the optimal pool size using a closed-form formula (if we include the Lambert-W function as "closed form"). Using the optimal pool size, we easily compute the minimum number of tests possible for the modeled testing scheme.

I had to write my own Lambert-W implementation,  because the only Javascript version I could find online
  cannot handle input less than $$e$$. The function uses the well-known Halley's method, which
  is just Newton's method but with one more term of the Taylor series. I use an initial guess
  of $$w=1$$ regardless of the value of the input. This and similar simple algorithms are easily found online. Far more sophisticated algorithms are described in the literature, but most applications are better served by one of the simple algorithms. My point is, if you are looking for a Javascript Lambert-W function, just copy&paste it from this repo.

## MIT License

MIT License
 Copyright (c) 2020 Robert Jacobson

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
