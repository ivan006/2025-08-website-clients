import BasicModel from './BasicModel'

export default class Ery_Items extends BasicModel {

  static entity = 'Ery_Items';
  static entityUrl = '/Artist';

  static get airtableBaseUrl() {
    return 'https://api.airtable.com/v0/appWL8gDT9ZaqV8jY'
  }

  static get proxyBaseUrl() {
    return 'https://capetownlists.co.za/bound-cache.php?action=get&url='
  }

  static defaultFlags = {
    view: "viwqEmrRk14mVdu4z",
  }
  
  // static entityUrl = '/Artwork?view=viwRVEM6ePmPsrZE4';


}
