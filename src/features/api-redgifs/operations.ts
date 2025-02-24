import { RedGIFsPostPayload } from "./api-type";

export const postToRedGIFs = async (data: RedGIFsPostPayload) => {
  console.log(data);
  return {
    url: "https://www.google.com",
  };
};
