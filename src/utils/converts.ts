export const formatCompactNumber = (number: number, setting: any) => {
  try {
    const res = Intl.NumberFormat("en", setting).format(number);
    return res;
  } catch (error) {
    return "0.00";
  }
};

export const convertToBRL = (number: number | string) => {
  try {
    const res = formatCompactNumber(Number(number), {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 2
    });
    return res;
  } catch (error) {
    return "0.00";
  }
};
