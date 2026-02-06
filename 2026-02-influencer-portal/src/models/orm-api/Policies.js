import BasicModel from './BasicModel'

export default class Policies extends BasicModel {

  static entity = '/Policies';
  static entityUrl = '/Policies';

  static get airtableBaseUrl() {
    return 'https://api.airtable.com/v0/appWL8gDT9ZaqV8jY'
  }
  
  static defaultFlags = {
    // view: "viwqEmrRk14mVdu4z",
  }
  

}
