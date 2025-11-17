import BasicModel from './BasicModel'

export default class Secondary_Page_Items extends BasicModel {

  static entity = 'Secondary_Page_Items';
  static entityUrl = '/Art';

  static get airtableBaseUrl() {
    return 'https://api.airtable.com/v0/appWL8gDT9ZaqV8jY'
  }
  
  static defaultFlags = {
    view: "viwqEmrRk14mVdu4z",
  }
  
  // static entityUrl = '/Artwork?view=viwRVEM6ePmPsrZE4';


}
