const params = {
  maxTime: {
    description: "Total time range to calculate distribution for",
    readOnly: true,
    initial: 100,
    units: "seconds",
    updates: { displayMax: "max" },
    serialize: false
  },
  bucketSize: {
    description: "",
    label: "bucket size on the histogram",
    initial: 0.1, // 0.5s
    min: 0.05,
    max: 1,
    step: 0.01,
    serialize: true
  },
  volume: {
    description: "Total number of users",
    label: "Number of Users",
    initial: 1000000,
    min: 10000,
    max: 1000000000,
    step: 1,
    serialize: true
  },
  baseSpeed: {
    description: "Exponential of 'Location' of lognormal speed distribution",
    label: "Base Speed",
    initial: 4.5,
    min: 0.05,
    max: 20,
    step: 0.01,
    serialize: true,
    units: "seconds"
  },
  sigma: {
    description: "'Scale' of lognormal speed distribution",
    label: "Variability (σ)",
    initial: 0.6,
    min: 0.05,
    max: 3,
    step: 0.01,
    serialize: true
  },
  maxErrorRate: {
    description: "Maximum error rate at a fastest point of 0 seconds",
    label: "Max error rate",
    initial: 100,
    min: 0,
    max: 100,
    step: 0.01,
    units: "%",
    serialize: true
  },
  errorRateDecay: {
    description: "Speed (power) of exponential error rate decay",
    label: "Error Rate Decay",
    initial: 3,
    min: 0,
    max: 5,
    step: 0.01,
    serialize: true
  },
  conversionDecay: {
    description: "Speed (power) of exponential conversion decay",
    label: "Conversion Decay",
    initial: 0.85,
    min: 0,
    max: 5,
    step: 0.01,
    serialize: true
  },
  averageValue: {
    label: "Average Value of a Converted User",
    initial: 10,
    min: 0.01,
    max: 1000,
    step: 0.01,
    displayOnly: true,
    serialize: true
  },
  maxConversionRate: {
    description:
      "Theoretical maximum conversion at a fastest point of 0 seconds",
    label: "Max Conversion",
    initial: 50,
    min: 0,
    max: 100,
    step: 0.01,
    units: "%",
    updates: {
      conversionPovertyLine: "max"
    },
    serialize: true
  },
  conversionPovertyLine: {
    description: "Lowest conversion rate of the infinitely slow experiences",
    label: "Conversion Poverty Line",
    initial: 1.2,
    min: 0,
    step: 0.01,
    units: "%",
    serialize: true
  },
  displayMax: {
    description: "Maxumim value of speed to display on the chart",
    label: "Display Max",
    initial: 9.99,
    min: 2,
    step: 1,
    units: "seconds",
    displayOnly: true,
    serialize: true
  },
  bounceRateShift: {
    description: "Minimum bounce rate at theoretical 0",
    label: "Min bounce rate",
    initial: 20,
    min: 0,
    max: 100,
    step: 0.5,
    units: "%",
    serialize: true
  },
  bounceRateScale: {
    description: "How high is the bounce rate on the site",
    label: "Bounce rate scale",
    initial: 50,
    min: 0,
    max: 100,
    step: 0.5,
    units: "%",
    serialize: true
  },
  bounceTimeCompression: {
    description: "How fast does bounce rate affect the users",
    label: "Bounce time compression",
    initial: 4,
    min: 0,
    step: 0.05,
    serialize: true
  }
};

/**
 * Sets parameters value
 *
 * @params Object params Full list of parameters to be updated
 * @param string name Name of the parameter
 * @param {*} value Amount to set the prop to
 * @param string prop Name of the prop to update. Defaults to "value"
 */
export const updateParam = (params, name, value, prop = "value") => {
  const parsedValue = parseFloat(value);

  // make sure the value is valid
  let finalValue =
    parsedValue || parsedValue === 0 ? parsedValue : params[name].initial;

  params[name][prop] = finalValue;

  if (params[name].max < params[name].min) {
    params[name].max = params[name].min;
  }

  if (params[name].value < params[name].min) {
    params[name].value = params[name].min;
  }

  if (params[name].value > params[name].max) {
    params[name].value = params[name].max;
  }

  // if we are updating a parameter value,
  // check if it in turn needs to update other parameters' configurations
  if (prop === "value" && params[name].updates) {
    Object.keys(params[name].updates).forEach(updateName =>
      updateParam(
        params,
        updateName,
        finalValue,
        params[name].updates[updateName]
      )
    );
  }

  return params;
};

export const getInitialParams = override =>
  Object.keys(params).reduce(
    (params, name) => updateParam(params, name, override[name]),
    params
  );
