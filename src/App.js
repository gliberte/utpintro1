import React, { Component } from 'react';
import styled from 'styled-components'
import ReactMapboxGl, { Layer, Source, GeoJSONLayer, ZoomControl } from 'react-mapbox-gl'
import MisRiosData from './data.geojson'
import axios from 'axios'

const urlBase = "http://gisnovomap.com/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&srsName=EPSG:4326&typeNames=8_7_escuelas&outputFormat=application/json"


const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoiZ2xpYmVydGUiLCJhIjoiY2l5OTFjMGVtMDA3aDMycW91eDZ2bnBkMyJ9.0ribIg_tlpagcxJmFyFM9A'
})

const Container = styled.div`
  position:relative;
`

const ImportGeo = styled.button`
  position:absolute;
  top:20px;
  left:20px;
  z-index:1;
  height:30px;
  background:#3F51B5;
  color:white;
  &:hover{
    background:#fff;
    color:#004D40;
    cursor:pointer;
  }
`

class App extends Component {
  state = {
    manzanas:null
  }
  onStyleLoad = (map) => {
    this.map = map
    console.log(this.map)
  }
  onClickMap = (map, evt) => {
    console.log(evt.lngLat)
  }
  getDatos = async(evt)=>{
      const result = await axios.get(urlBase)
      console.log(result.data)
      const manzanas = result.data
      this.setState({
        manzanas
      })
  }
  render() {
    const geojsonOptions = {
      type: 'geojson',
      data: MisRiosData
    }
    return (
      <Container>
        <ImportGeo onClick={this.getDatos}>Agregar Datos de Manzanas</ImportGeo>
        <Map
          style="mapbox://styles/gliberte/cjj69dxbs18lb2snnh2qainzi"
          center={[-79.504571, 9.034881]}
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}
          onStyleLoad={this.onStyleLoad}
          onClick={this.onClickMap}
        >
          <ZoomControl />
          <GeoJSONLayer data={MisRiosData}
            linePaint={{
              "line-color": "#42A5F5",
              "line-width": 4
            }}
            symbolLayout={
              {
                "text-field": "{nombre}",
                "symbol-placement": "line",
                "text-offset": [0, -1]
              }
            }
          />
          {this.state.manzanas && <GeoJSONLayer data={this.state.manzanas}
            fillPaint={{
              "fill-color": "#42A5F5",
              "fill-outline-color":"#5D4037"
            }}
            symbolLayout={
              {
                "text-field": "{num_man}"
              }
            }
          />}
          
        </Map>
      </Container>

    );
  }
}

export default App;
