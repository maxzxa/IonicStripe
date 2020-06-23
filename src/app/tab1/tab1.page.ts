import { CardI } from './../models/card.interface';
import { Component } from '@angular/core';
import { Stripe } from '@ionic-native/stripe/ngx';
import { CardIO } from '@ionic-native/card-io/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
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

  constructor(public stripe: Stripe,
    public cardIO: CardIO) {
      this.stripe.setPublishableKey('pk_test_51GvW90Cf7Zx11rAzopLz1xU21BreA8l1P4HuKaxyr4luVVdffP7F3GuoVASDwycRhXyC0JFjgvOKB09KAUOc91vP00fNc2rBje');
    }


   async getCard() {
     const res: boolean = await this.cardIO.canScan();
     if (res) {
       let options = {
         requireExpiry: true,
         requireCVV: false,
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
     }
  }
}

