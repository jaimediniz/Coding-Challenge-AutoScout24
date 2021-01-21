import { Request, Response } from "express";
import csv from "csv-parser";
import fs from "fs";

import { Listening, Contacts, Merged } from "../functions/reports";

export const isCorrectFormat = async (
  req: Request,
  res: Response,
  next: Function
): Promise<void> => {
  try {
    console.log(req.files);
    const listings = await extractListings((req.files as any).listings);
    const contacts = await extractContacts((req.files as any).contacts);
    const rawData = await mergeFiles(listings, contacts);
    res.locals.rawData = rawData;
    //res.send({ error: false, message: "data!", data: rawData });
    next();
  } catch (err) {
    res.status(400).json({ error: true, message: err.message, data: {} });
    return;
  }
};

const extractListings = async (file: any): Promise<Array<Listening>> => {
  const results: Array<Listening> = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (data: Listening) => results.push(data))
      .on("end", () => {
        //console.log(results);
        resolve(results);
      });
  });
};

const extractContacts = async (file: any): Promise<Array<Contacts>> => {
  const results: any = {};
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (data: Contacts) => {
        if (!results[data.listing_id]) {
          results[data.listing_id] = {};
          results[data.listing_id]["contacted"] = [];
          results[data.listing_id]["byMonth"] = {};
        }
        const dateNumber = Number(data.contact_date);
        const date = new Date(dateNumber);
        results[data.listing_id]["contacted"].push(dateNumber);
        const month = `${("0" + (date.getMonth() + 1)).slice(
          -2
        )}.${date.getFullYear()}`;
        if (!results[data.listing_id]["byMonth"][month]) {
          results[data.listing_id]["byMonth"][month] = [];
        }
        results[data.listing_id]["byMonth"][month].push(dateNumber);
      })
      .on("end", () => {
        resolve(results);
      });
  });
};

const mergeFiles = async (
  listings: Array<Listening>,
  contacts: Array<any>
): Promise<Array<Merged>> => {
  listings.forEach((listing: any) => {
    listing["contacted"] = contacts[listing.id].contacted;
    listing["byMonth"] = contacts[listing.id].byMonth;
  });

  return listings as any;
};
