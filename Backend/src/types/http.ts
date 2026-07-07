import { Request } from "express";

export type IdRequest = Request<{
    id: string;
}>;