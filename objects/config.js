export class Config {
  static default() {
    return {
      _id: "config",
      offline: false,
      notifyOnAutoSync: false,
      organicMapsAvailable: false,
    };
  }
}
