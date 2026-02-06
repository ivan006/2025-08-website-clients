import BasicModel from './BasicModel'

export default class Collections extends BasicModel {

  static entity = 'Collections';
  static entityUrl = '/Collections';

  static get airtableBaseUrl() {
    return 'https://api.airtable.com/v0/appWL8gDT9ZaqV8jY'
  }
  
  static defaultFlags = {
    view: "viwOzCfAZmGMzzBBK",
  }
  

}
