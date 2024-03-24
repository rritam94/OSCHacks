import React from "react";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function GoogleMap(){
  const defaultProps = {
    center: {
      lat: 29,
      lng: -82
    },
    zoom: 11
  };

  return (

    <div class = "mamp">
        <div style={{height: '30vh', width: '95%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyA9Ii6BVbrVyZB0Pv0ri0QW4pXFGrE7kM0" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
            >

                <AnyReactComponent
                    lat={29.622150}
                    lng={-82.378210}
                    text="Paul Meyer, O.D"
                />

                <AnyReactComponent
                    lat={29.619110}
                    lng={-82.382950}
                    text="Brian Atkins, OD"
                />

                <AnyReactComponent
                    lat={29.625420}
                    lng={-82.383080}
                    text="Tiffany K. Monahan, OD"
                />
            </GoogleMapReact>
        </div>
    </div>
  );
}