import { CardI } from './../models/card.interface';
import { Component } from '@angular/core';
import { Stripe } from '@ionic-native/stripe/ngx';
import { CardIO } from '@ionic-native/card-io/ngx';
import { CardService } from "../services/card.service";

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

  constructor(public cardIO: CardIO,
    public CardService: CardService) {
    }


  async getCard() {
    this.card = await this.CardService.getCard();
  }
}

