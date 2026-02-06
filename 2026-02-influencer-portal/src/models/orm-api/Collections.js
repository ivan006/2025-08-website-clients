import BasicModel from "./BasicModel";

export default class Collections extends BasicModel {
  static entity = "Collections";
  static entityUrl = "/Collections";

  static get airtableBaseUrl() {
    return import.meta.env.VITE_API_BACKEND_URL;
  }

  static defaultFlags = {
    view: "viwOzCfAZmGMzzBBK",
  };
}
