export const addTest = async (req: any, res: any, next: any): Promise<void> => {
  req.files = {};
  (req.files as any).listings = "./../listings.csv";
  (req.files as any).contacts = "./../contacts.csv";
  next();
};
