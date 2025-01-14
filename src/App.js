import React, { Component } from "react";
import qs from "query-string";

import ConfigPanel from "./ConfigPanel";
import Field from "./Field";
import { Chart } from "./Chart";

import logo from "./logo.svg";

import { getInitialParams, updateParam } from "./params";
import distribution from "./distribution";

const panels = [
  {
    label: "Speed Distribution",
    params: ["baseSpeed", "sigma"]
  },
  {
    label: "Error Rate",
    params: ["maxErrorRate", "errorRateDecay"]
  },
  {
    label: "Bounce Rate",
    params: ["bounceRateShift", "bounceTimeCompression", "bounceRateScale"]
  },
  {
    label: "Conversion Rate",
    params: ["conversionDecay", "maxConversionRate", "conversionPovertyLine"]
  },
  {
    label: "Chart Parameters",
    params: ["volume", "averageValue", "displayMax", "bucketSize"]
  }
];

class App extends Component {
  constructor(props) {
    super(props);

    const params = getInitialParams(qs.parse(window.location.search));

    this.state = {
      params,
      ...distribution(params),
      adjusted: !!window.location.search
    };
  }

  reset = () => {
    window.history.pushState({}, null, "/");

    const params = getInitialParams({});

    this.setState({
      params,
      ...distribution(params),
      adjusted: false
    });
  };

  /**
   * Returns current values of the parameter
   *
   * @param string name
   * @return Object
   */
  get(name) {
    const param = { ...this.state.params[name] };

    return param;
  }

  updateURL(params) {
    const url =
      "/?" +
      Object.keys(params)
        .reduce((acc, name) => {
          if (params[name].serialize) {
            acc.push(name);
          }

          return acc;
        }, [])
        .map(name => name + "=" + params[name].value)
        .join("&");

    window.history.pushState(params, null, url);
  }

  /**
   * Sets current value of the parameter
   *
   * @param string name
   * @param {*} value
   */
  set(name, value) {
    const currentParams = { ...this.state.params };

    const params = updateParam(currentParams, name, value);

    const newState = params[name].displayOnly
      ? { params, adjusted: true }
      : {
          params,
          ...distribution(params),
          adjusted: true
        };

    this.setState(newState);

    this.updateURL(params);
  }

  render() {
    const {
      x,
      totalPopulation,
      erroredDistribution,
      bouncedDistribution,
      convertedDistribution,
      nonConvertedDistribution,
      annotations,
      errorRateDistribution,
      bounceRateDistribution,
      effectiveBounceRateDistribution,
      conversionRateDistribution,
      effectiveConversionRateDistribution,
      totalConverted,
      averageConversionRate,
      averageNonBouncedConversionRate,
      params,
      adjusted
    } = this.state;

    const chartProps = {
      x,
      totalPopulation,
      erroredDistribution,
      bouncedDistribution,
      convertedDistribution,
      nonConvertedDistribution,
      bounceRateDistribution,
      errorRateDistribution,
      effectiveBounceRateDistribution,
      conversionRateDistribution,
      effectiveConversionRateDistribution,
      displayMax: params.displayMax.value,
      annotations
    };

    return (
      <div>
        <header>
          <h1>
            <img src={logo} className="app-logo" alt="logo" /> UX Speed
            Calculator
          </h1>
        </header>
        <section>
          <Chart {...chartProps} />
        </section>

        <section className="output">
          <div>
            Average Conversion Rate
            <p>
              <b title="% of total users">
                {parseInt(averageConversionRate * 10000) / 100}%
              </b>{" "}
              <span title="% of users who didn't bounce">
                ({parseInt(averageNonBouncedConversionRate * 10000) / 100}%)
              </span>
            </p>
          </div>
          <div>
            Converted Users
            <p>
              <b>{totalConverted}</b>
            </p>
          </div>
          <div>
            Total Value
            <p>
              <b>
                {parseInt(
                  totalConverted * params.averageValue.value
                ).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0
                })}
              </b>
            </p>
          </div>

          <div>{adjusted && <button onClick={this.reset}>Reset</button>}</div>
        </section>

        <section className="configuration">
          {panels.map(panel => (
            <ConfigPanel key={panel.label} label={panel.label}>
              {panel.params.map(paramName => (
                <Field
                  key={paramName}
                  onChange={e => this.set(paramName, e.target.value)}
                  {...params[paramName]}
                />
              ))}
            </ConfigPanel>
          ))}
        </section>

        <footer>
          <span>
            2019-2020 &copy;{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.sergeychernyshev.com"
            >
              Sergey Chernyshev
            </a>
          </span>
          <span>
            Logo{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://commons.wikimedia.org/wiki/File:Antu_accessories-calculator.svg"
            >
              image
            </a>{" "}
            by Fabián Alexis
          </span>
        </footer>
      </div>
    );
  }
}

export default App;
