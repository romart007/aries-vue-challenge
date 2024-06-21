const OptionType = {
  Call: "Call",
  Put: "Put",
};

const LongShortType = {
  Long: "long",
  Short: "short",
};

// Returns a reasonable price range to display in the chart
export const getReasonablePriceRange = (options) => {
  const maxStrikePrice = Math.max(...options.map(option => option.strikePrice));
  return {
    min: 0,
    max: Math.ceil(maxStrikePrice * 1.5),
  };
};

// Returns profit/loss value for a given price and option
export const calculateProfitLoss = (option, price) => {
  const { type, longShort, strikePrice, ask, bid } = option;

  if (price === -Infinity || price === Infinity) {
    const isCall = type === OptionType.Call;
    const isLong = longShort === LongShortType.Long;
    if (price === -Infinity) {
      return {
        value: isCall ? 0 : (isLong ? 1 : -1),
        offset: isCall ? (isLong ? -ask : bid) : (isLong ? strikePrice - ask : bid - strikePrice),
      };
    } else {
      return {
        value: !isCall ? 0 : (isLong ? 1 : -1),
        offset: isCall ? (isLong ? -strikePrice - ask : bid + strikePrice) : (isLong ? -ask : bid),
      };
    }
  }

  const intrinsicValue = type === OptionType.Call
    ? Math.max(0, price - strikePrice)
    : Math.max(0, strikePrice - price);

  const profitLoss = longShort === LongShortType.Long
    ? intrinsicValue - ask
    : bid - intrinsicValue;

  return { value: 0, offset: profitLoss };
};

// Compare profit/loss with a certain value
const compareProfitLoss = (profitLoss, value) => {
  if (profitLoss.value !== 0) return profitLoss.value;
  return profitLoss.offset - value;
};

// Calculate max profit, loss, and break-even points from options
export const calculateMaxProfitLossEvenPoints = (options) => {
  const breakpoints = Array.from(new Set([0, ...options.map(option => option.strikePrice), Infinity])).sort((a, b) => a - b);

  const profitLossAtBreakpoints = breakpoints.map(breakpoint => 
    options.reduce((sum, option) => {
      const { value, offset } = calculateProfitLoss(option, breakpoint);
      sum.value += value;
      sum.offset += offset;
      return sum;
    }, { value: 0, offset: 0 })
  );

  let maxProfit = -Infinity;
  let maxLoss = Infinity;
  const breakEvenPoints = [];

  for (let i = 1; i < breakpoints.length; i++) {
    const prev = profitLossAtBreakpoints[i - 1];
    const curr = profitLossAtBreakpoints[i];

    if (compareProfitLoss(prev, 0) < 0 && compareProfitLoss(curr, 0) > 0 || compareProfitLoss(prev, 0) > 0 && compareProfitLoss(curr, 0) < 0) {
      const breakEvenPoint = prev.value !== 0
        ? -prev.offset / prev.value
        : curr.value !== 0
          ? -curr.offset / curr.value
          : breakpoints[i - 1] + Math.abs(prev.offset);

      breakEvenPoints.push(breakEvenPoint.toFixed(2));
    }

    if (prev.value === 0) {
      maxProfit = Math.max(maxProfit, prev.offset);
      maxLoss = Math.min(maxLoss, prev.offset);
    } else {
      if (prev.value > 0) maxProfit = Infinity;
      if (prev.value < 0) maxLoss = -Infinity;
    }
  }

  return {
    maxProfit: maxProfit.toFixed(2),
    maxLoss: (-maxLoss).toFixed(2),
    breakEvenPoints,
  };
};
