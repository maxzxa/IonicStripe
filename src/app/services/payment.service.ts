import { Injectable } from '@angular/core';
import { Stripe, StripeBankAccountParams } from "@ionic-native/stripe";
import { CardI } from "../models/card.interface";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(public stripe: Stripe) {
    this.stripe.setPublishableKey('pk_test_51GvW90Cf7Zx11rAzopLz1xU21BreA8l1P4HuKaxyr4luVVdffP7F3GuoVASDwycRhXyC0JFjgvOKB09KAUOc91vP00fNc2rBje');
  }

  async payWithStripe(Card: CardI) {
    let StripeCard = {
      number: Card.cardNumber,
      expMonth: Card.expiryMonth,
      expYear: Card.expiryYear,
      cvc: Card.cvv
    }
  }

  async payWithStripeCard(Card: CardI, Currency: String, Amount: number) {
    let card = {
      number: Card.cardNumber,
      expMonth: Card.expiryMonth,
      expYear: Card.expiryYear,
      cvc: Card.cvv
    }

    const cardToken = await this.stripe.createCardToken(card)

    //Se haría llamada al servidor
    
  }
}