import React from 'react'

import { Box } from '@chakra-ui/react'
import { graphql, useStaticQuery } from 'gatsby'

import pinImage from '../images/pin.svg'

const sizeMultiplier = 4

const Map: React.FC = () => {
  const { data } = useStaticQuery(graphql`
    query mapQuery {
      data: ubicacionYaml {
        coordinates
      }
    }
  `)

  if (typeof window === 'undefined') {
    return null
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MapContainer, Marker, Popup, TileLayer } = require('react-leaflet')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Icon, Point } = require('leaflet')

    const Pin = new Icon({
      iconUrl: pinImage,
      iconRetinaUrl: pinImage,
      iconSize: new Point(24 * sizeMultiplier, 24 * sizeMultiplier),
      iconAnchor: new Point(12 * sizeMultiplier, 22 * sizeMultiplier),
      popupAnchor: new Point(0, -17 * sizeMultiplier),
      className: 'leaflet-div-icon',
    })

    const position = data.coordinates

    return (
      <Box boxShadow="md" m="0 2rem 3rem 2rem">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '400px', width: '100%', zIndex: 1 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={Pin}>
            <Popup>Guardalo.com</Popup>
          </Marker>
        </MapContainer>
      </Box>
    )
  }
}

export default Map
