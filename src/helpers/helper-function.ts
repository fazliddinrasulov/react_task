export enum DatingNamesEnum {
    all = "all",
    last14Days = "last14Days",
    last30Days = "last30Days",
    last60Days = "last60Days",
    last3Months = "last3Months",
    last6Months = "last6Months",
    last1Year = "last1Year",
  }
  
  export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  export function parseDateStringIntoUTCDate(input: string /* 2010-01-02 */) {
    const parts = input.split("-");
  
    const year = Number(parts[0]);
    const monthZero = Number(parts[1]) - 1; // Note: months are 0-based
    const day = Number(parts[2]);
  
    return new Date(Date.UTC(year, monthZero, day));
  }
  
  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  
  const datingNameWithPeriodMilliseconds = {
    [DatingNamesEnum.all]: null, //
    [DatingNamesEnum.last14Days]: dayInMilliseconds * 14,
    [DatingNamesEnum.last30Days]: dayInMilliseconds * 30,
    [DatingNamesEnum.last60Days]: dayInMilliseconds * 60,
    [DatingNamesEnum.last3Months]: dayInMilliseconds * 31 * 3,
    [DatingNamesEnum.last6Months]: dayInMilliseconds * 31 * 6,
    [DatingNamesEnum.last1Year]: dayInMilliseconds * 366,
  };
  
  export const getPeriodMilliseconds = (name: DatingNamesEnum) => {
    return datingNameWithPeriodMilliseconds[name];
  };
  
  export const waitMs = async (ms: number) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  };
  