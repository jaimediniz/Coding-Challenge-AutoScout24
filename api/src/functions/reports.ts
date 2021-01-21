import { Request, Response } from "express";

export interface Listening {
  id: number;
  make: string;
  price: number;
  mileage: number;
  seller_type: string;
}

export interface Contacts {
  listing_id: number;
  contact_date: Date;
}

export interface Merged {
  id: number;
  make: string;
  price: number;
  mileage: number;
  seller_type: string;
  contacted: Array<Date>;
  byMonth: any;
}

export const generateReports = async (
  req: Request,
  res: Response
): Promise<void> => {
  const rawData = res.locals.rawData;
  let data;
  try {
    data = await reports(rawData);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message, data: {} });
  }

  res.status(200).json({
    error: false,
    message: "Reports!",
    data,
  });
};

const reports = async (listings: Array<Merged>): Promise<any> => {
  let result: any = {};
  let elements: any = {};
  let makeDistribution: any = {};

  let mostContacted = 0;
  let position = 0;

  let top = 5;
  let months: any = {};
  for (const month of Object.keys(listings[0].byMonth)) {
    let empty: any = {};
    empty[month] = [];
    months[month] = Array(top).fill({ byMonth: empty });
  }

  listings
    // Sort by most contacted
    .sort(function (a: Merged, b: Merged) {
      return b.contacted.length - a.contacted.length;
    })
    .forEach((listening) => {
      if (position <= listings.length * 0.3) {
        mostContacted += listening.price / (listings.length * 0.3);
      }

      result[listening.seller_type] =
        result[listening.seller_type] ?? +listening.price;

      elements[listening.seller_type] = elements[listening.seller_type] ?? +1;

      makeDistribution[listening.make] =
        makeDistribution[listening.make] ?? +(1 / listings.length);

      for (const month in months) {
        months[month][top] = listening;
        months[month].sort(function (a: Merged, b: Merged) {
          return b.byMonth[month]?.length - a.byMonth[month]?.length;
        });
      }

      position++;
    });

  for (const month of Object.keys(listings[0].byMonth)) {
    months[month]?.pop();
  }

  let avgListening: any = {};
  for (const key of Object.keys(result)) {
    avgListening[key] = result[key] / elements[key];
  }

  return {
    avgListening,
    makeDistribution,
    mostContacted,
    months,
  };
};
