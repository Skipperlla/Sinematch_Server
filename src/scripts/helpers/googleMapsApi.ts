import { googleMapsAPI } from 'src/api';

const distanceMatrix = async (
  origins: string,
  destinations: string,
): Promise<string> => {
  const { data } = await googleMapsAPI.get('/distancematrix/json', {
    params: {
      origins: origins,
      destinations: destinations,
    },
  });

  const value = Math.floor(data?.rows[0]?.elements[0]?.distance?.value / 1000);
  const status = data?.rows[0]?.elements[0]?.status;
  return status === 'OK' ? `${value} km` : null;
};

type Props = {
  plus_code?: string;
  locality?: string;
  administrative_area_level_1?: string;
  administrative_area_level_2?: string;
  administrative_area_level_3?: string;
  country?: string;
  postal_code?: string;
};
const geocode = async (latitude: number, longitude: number): Promise<Props> => {
  try {
    const coords = `${latitude}, ${longitude}`;
    const { data } = await googleMapsAPI.get('/geocode/json', {
      params: {
        latlng: coords,
      },
    });

    if (data?.status === 'OK') {
      const result: Props = {};

      if (data?.results[0]) {
        if (data?.results[0]?.address_components) {
          data?.results[0]?.address_components?.map((address) => {
            if (address?.types[0]) {
              result[address?.types[0]] = address?.long_name;
            }
          });
        }
      }

      return result;
    }
  } catch (e) {
    // console.log(e);
  }
};

function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): string {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d === 0 ? '1 km' : `${Math.floor(d)} km`;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default { distanceMatrix, geocode, haversine };
