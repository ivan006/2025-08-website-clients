import BasicModel from "./BasicModel";

export default class Policies extends BasicModel {
  static entity = "/Policies";
  static entityUrl = "/Policies";

  static get airtableBaseUrl() {
    return import.meta.env.VITE_API_BACKEND_URL;
  }

  static defaultFlags = {
    // view: "viwqEmrRk14mVdu4z",
  };
}
