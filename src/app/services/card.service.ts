import { Injectable } from '@angular/core';
import { CardI } from '../models/card.interface';
import { CardIO } from '@ionic-native/card-io/ngx';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  card: CardI = {
    cardNumber: '',
    cardType: '',
    cardholderName: '',
    redactedCardNumber: '',
    cvv: '',
    expiryMonth: 0,
    expiryYear: 0,
    postalCode: ''
  }

  constructor(public cardIO: CardIO) { }

  async getCard() {
    const res: boolean = await this.cardIO.canScan();
    if (res) {
      let options = {
        requireExpiry: true,
        requireCVV: true,
        requireCardholderName: true,
        requirePostalCode: false
      };
      const result = await this.cardIO.scan(options);
      this.card.cardNumber = result.cardNumber;
      this.card.cardType = result.cardType
      this.card.cardholderName = result.cardholderName
      this.card.cvv = result.cvv
      this.card.expiryMonth = result.expiryMonth
      this.card.expiryYear = result.expiryYear
      this.card.postalCode = result.postalCode
      this.card.redactedCardNumber = result.redactedCardNumber
      return this.card;
    }
  }
}
