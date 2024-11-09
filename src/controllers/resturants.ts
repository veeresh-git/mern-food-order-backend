import { Request, Response } from "express";
import Resturant from "../models/resturant";

export const searchRestuant = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;
    const searchQuery = (req.query.searchQuery as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const page = parseInt(req.query.page as string) || 1;

    const query: any = {};
    query["city"] = new RegExp(city, "i");
    const resturantCounts = await Resturant.countDocuments(query);

    if (resturantCounts !== 0) {
      if (selectedCuisines) {
        const CousinesArrya = selectedCuisines
          .split(",")
          .map((cousin) => new RegExp(cousin, "i"));
        query["cuisines"] = {
          $all: CousinesArrya,
        };
      }
      if (searchQuery) {
        const searchQueryReg = new RegExp(searchQuery, "i");
        query["$or"] = [
          { resturantName: searchQueryReg },
          { cuisines: { $in: [searchQueryReg] } },
        ];
      }
      const pageSize = 10;
      const skip = (page - 1) * pageSize;
      const resturents = await Resturant.find(query)
        .sort({
          [sortOption]: 1,
        })
        .skip(skip)
        .limit(pageSize)
        .lean();
      const totalCount = await Resturant.countDocuments(query);
      const response = {
        data: resturents,
        pagination: {
          page,
          total: totalCount,
          pages: Math.ceil(totalCount / pageSize),
        },
      };
      res.status(200).json(response);
    } else {
      res.status(404).json({
        data: [],
        pagination: {
          page: 1,
          total: 0,
          pages: 1,
        },
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error getting resturants!",
    });
  }
};
