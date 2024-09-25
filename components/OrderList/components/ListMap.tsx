import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  LoadScriptNext,
  MarkerF,
  DirectionsRenderer,
} from '@react-google-maps/api';

interface ListMapProps {
  address: string;
  onDistanceAndDuration: (distance: string, duration: string) => void;
}

interface Position {
  lat: number;
  lng: number;
}

interface GeocodeResponse {
  status: string;
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
}

const ListMap = ({ address, onDistanceAndDuration }: ListMapProps) => {
  const [position, setPosition] = useState<Position | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  // Fetch geolocation based on the address
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address,
          )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&sensor=false`,
        );

        const data = (await response.json()) as GeocodeResponse;

        if (data.status === 'OK') {
          const location = data.results[0].geometry.location;
          setPosition({ lat: location.lat, lng: location.lng });
        } else {
          console.error('Error from Google Maps API:', data.status);
        }
      } catch (error) {
        console.error('Error in fetching coordinates:', error);
      }
    };

    fetchCoordinates().catch((error) =>
      console.error('Error in fetchCoordinates:', error),
    );
  }, [address]);

  useEffect(() => {
    if (position) {
      const directionsService = new google.maps.DirectionsService();
      directionsService
        .route(
          {
            origin: address,
            destination: '123 Main St, Blackburn VIC 3130', // Change this to a dynamic destination if needed
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              setDirections(result);
              const distance = result.routes[0].legs[0].distance?.text || '';
              const duration = result.routes[0].legs[0].duration?.text || '';
              onDistanceAndDuration(distance, duration);
            } else {
              console.error('Error fetching directions:', status);
            }
          },
        )
        .catch((error) => {
          console.error('Error in directionsService.route:', error);
        });
    }
  }, [position, address, onDistanceAndDuration]);

  if (!position) {
    return <p>Loading map...</p>;
  }

  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
    >
      <GoogleMap
        onLoad={() => setMapLoaded(true)}
        mapContainerStyle={{ height: '15rem', width: '100%' }}
        center={position}
        zoom={13}
      >
        {mapLoaded && <MarkerF position={position} />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default ListMap;
