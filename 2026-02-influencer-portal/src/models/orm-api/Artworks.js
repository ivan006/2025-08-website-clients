import BasicModel from "./BasicModel";

export default class Artworks extends BasicModel {
  static entity = "Artworks";
  static entityUrl = "/Art";

  static get airtableBaseUrl() {
    return import.meta.env.VITE_API_BACKEND_URL;
  }

  static defaultFlags = {
    view: "viwn7wDGK6yk5ZHOl",
  };
}
