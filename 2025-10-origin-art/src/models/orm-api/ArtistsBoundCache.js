import BasicModel from './BasicModel'

export default class ArtistsBoundCache extends BasicModel {

  static entity = 'ArtistsBoundCache';
  static entityUrl = '/Artist';

  static get airtableBaseUrl() {
    return 'https://api.airtable.com/v0/appWL8gDT9ZaqV8jY'
  }

  static get proxyBaseUrl() {
    return 'https://the-gas-pad.letsnetworkhub.com/cacher/data-cache/bound-cache.php?action=get&url='
  }

  static defaultFlags = {
    view: "viwqEmrRk14mVdu4z",
  }
  
  // static entityUrl = '/Artwork?view=viwRVEM6ePmPsrZE4';


}
