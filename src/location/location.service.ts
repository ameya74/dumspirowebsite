import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Injectable()
export class LocationService {
  constructor(private httpService: HttpService) {}

  async validateAddress(address: string): Promise<boolean> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address,
    )}&key=${process.env.GEOCODING_API_KEY}`;

    try {
      const response = await this.httpService
        .get(url)
        .pipe(map((response) => response.data))
        .toPromise();

      return this.isAddressInVileParleEast(response);
    } catch (error) {
      throw new HttpException(
        'Failed to validate address with the geocoding service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private isAddressInVileParleEast(geocodingResponse: any): boolean {
    // Logic to determine if the address is in Vile Parle East, Mumbai
    const results = geocodingResponse.results;
    return results.some((result) => {
      const addressComponents = result.address_components;
      const hasVileParleEast = addressComponents.some(
        (component) => component.long_name === 'Vile Parle East',
      );
      const hasMumbai = addressComponents.some(
        (component) => component.long_name === 'Mumbai',
      );
      return hasVileParleEast && hasMumbai;
    });
  }
}
