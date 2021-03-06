import { Injectable } from '@angular/core';

@Injectable()
export class InteractionService {
  /*
  featureTypes: {
    first_layer_name?: object[],
    second_layer_name?: object[],
    ...
    nth_layer_name?: object[]
  }
  */
  featureTypes = {};

  constructor() { }

  handleLayerInteraction(
    name?: string,
    viewOnly?: boolean,
    features?: object[]
  ): void {
    // NOTE: Use switch case if layer names cannot
    // be the same as listed featureTypes

    if (name && !viewOnly) {
      this.clearAllInfoPanes(name);
      this.featureTypes[name] = features;
    } else {
      this.clearAllInfoPanes();
    }
  }

  clearAllInfoPanes(excludeLayer?: string): void {
    for (const type in this.featureTypes) {
      if (type && type !== excludeLayer) {
        delete this.featureTypes[type];
      }
    }
  }
}
