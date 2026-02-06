import BasicModel from "./BasicModel";

export default class Artist extends BasicModel {
  static entity = "Artist";
  static entityUrl = "/Artist";

  static get airtableBaseUrl() {
    return import.meta.env.VITE_API_BACKEND_URL;
  }

  static defaultFlags = {
    view: "viwqEmrRk14mVdu4z",
  };
}
