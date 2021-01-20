import { Request, Response } from "express";
import { Listening } from "../functions/reports";

export const isCorrectFormat = async (
  req: Request,
  res: Response,
  next: Function
): Promise<void> => {
  try {
    const rawData = await extractData(req.files);
    res.locals.rawData = rawData;
    res
      .status(200)
      .json({ error: true, message: "File is invalid!", data: rawData });
    //next();
  } catch (err) {
    res
      .status(400)
      .json({ error: true, message: "File is invalid!", data: {} });
  }
};

const extractData = async (file: any): Promise<Array<Listening>> => {
  console.log(file);

  // {...listening, }
  return file;
};
