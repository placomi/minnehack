export enum ScrapedSource {
  TWITTER = "twitter",
  INTERNAL = "internal",
}

import { z } from "zod";

export const Snippet = z.object({
  id: z.string(),
  geohash: z.string(),
  timestamp: z.string(),          //
  summary: z.string(),            //
  text: z.string(),               //
  created_by: z.string(),         //
  scraped: z.enum(ScrapedSource), //
  upvotes: z.number(),
  downvotes: z.number(),
  verified: z.boolean(),          //
  verified_by: z.string().optional(),
  verified_at: z.string().optional(),
  lat: z.number(),                //
  long: z.number(),               //
  link: z.string().optional(),    //
  radius: z.number(),
  tags: z.string().array()        //
});

export type SnippetT = z.infer<typeof Snippet>;
