import { z } from "zod";

export const reorderImagesSchema = z.object({

    imageIds: z.array(
        z.string()
    ).min(1)

});