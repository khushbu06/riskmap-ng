import { Injectable } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

import { environment as env } from '../../environments/environment';
import { HttpService } from './http.service';
import { SensorService } from './sensor.service';
import { InteractionService } from './interaction.service';

@Injectable()
export class LayerService {
  map: mapboxgl.Map;

  constructor(
    private httpService: HttpService,
    private sensorService: SensorService,
    public interactionService: InteractionService
  ) { }

  initializeLayers(
    map: mapboxgl.Map,
    region: {
      name: string,
      code: string,
      bounds: {
        sw: number[],
        ne: number[]
      }
    }
  ): void {
    this.map = map;

    for (const layer of env.supportedLayers) {

      switch (layer.metadata.name) {
        case 'sensors':
          this.httpService
          .getGeometryData(layer.metadata, region.code)
          .then(geojson => {
            this.sensorService.updateProperties(geojson)
            .then(updatedSensors => {
              geojson.features = updatedSensors;
              layer.settings.source.data = geojson;

              // Add layer
              this.map.addLayer(layer.settings, layer.metadata['placeBelow']);
            })
            .catch(error => console.log(error));
          });
          break;

        default:
          this.httpService
          .getGeometryData(layer.metadata, region.code)
          .then(geojson => {
            // Overwrite data object
            layer.settings.source.data = geojson;
            // Add layer
            this.map.addLayer(layer.settings, layer.metadata['placeBelow']);
          });
      }
    }
  }

  handleMapInteraction(
    event?: {
      type: string,
      lngLat: {
        lng: number,
        lat: number
      },
      point: {
        x: number,
        y: number
      },
      originalEvent: object,
      target: object
    }
  ) {
    if (event) {
      if (this.clearSelectionLayers(event.point)) {
        // CASE 1: Clicked over a previously selected feature
        // Deselect feature & exit function
        this.interactionService.handleLayerInteraction();

      } else {
        // Iterate over all layers
        for (const layer of env.supportedLayers) {
          const name = layer.metadata.name;
          const uniqueKey = layer.metadata.uniqueKey;
          let features = [];
          if (this.map.getLayer(name)) {
            features = this.map.queryRenderedFeatures(event.point, {layers: [name]});
          }

          if (features.length === 1) {
            // CASE 2: Clicked on a single feature
            this.addSelectionLayer(name, uniqueKey, features);

            this.interactionService.handleLayerInteraction(name, features);
            break;

          } else if (features.length > 1) {
            // CASE 3: Clicked with multiple features overlapping
            // TODO: use clustering to show all features
            // Ref https://www.mapbox.com/mapbox-gl-js/example/cluster/

            this.interactionService.handleLayerInteraction(name, features);
            break;

          } else {
            // CASE 4: No feature found in layer being iterated over
            this.interactionService.handleLayerInteraction();
          }
        }
      }
    } else {
      // CASE: Clicked on Menu button,
      // non-map interaction event

      this.interactionService.handleLayerInteraction();
    }
  }

  clearSelectionLayers(
    point?: {
      x: number,
      y: number
    }
  ): boolean {
    // do
    return false;
  }

  addSelectionLayer(layerName?: string, uniqueKey?: string, features?: any): void {
    for (const layer of env.supportedLayers) {
      if (layerName === layer.metadata.name) {
        const selProperty = this.map.getPaintProperty(layerName, layer.metadata.selected.type);
        selProperty.splice(2, 1, features[0].properties[uniqueKey]);
        this.map.setPaintProperty(layerName, layer.metadata.selected.type, selProperty);
      }
    }
  }
}
