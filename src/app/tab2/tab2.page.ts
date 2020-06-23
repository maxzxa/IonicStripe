import { Component } from '@angular/core';
import { Stripe, StripeBankAccountParams } from '@ionic-native/stripe/ngx'; 
import { CardIO } from '@ionic-native/card-io/ngx';
import { CardI } from '../models/card.interface';
import { BankAccountI } from '../models/bankAccount.interface';
import { PaymentService } from "../services/payment.service";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  currencies: [
    {
      value: 1, name: 'MXN'
    },
    {
      value: 2, name: 'USD'
    },
    {
      value: 3, name: 'CAD'
    }
  ]


  payment = {
    currency: 'MXN',
    amount: 0.00
  }

  card: CardI = {
    cardNumber: '',
    cardType: 'N/R',
    cardholderName: '',
    redactedCardNumber: '',
    cvv: '',
    expiryMonth: 0,
    expiryYear: 0,
    postalCode: ''
  }

  account: StripeBankAccountParams = {
    routing_number: '',
    account_number: '',
    account_holder_name: '', // optional
    account_holder_type: '', // optional
    currency: '',
    country: ''
  }

  constructor(public cardIO: CardIO,
    public stripe: Stripe) {
    this.stripe.setPublishableKey('pk_test_51GxJ6FK2YJ453PG8YNwOaHAOL93pEyiIoaARbVJ4GmTm374Io695FuG3rlrB95lpkt7SvVbN8KaN9LXAeOsz5U4d00zTWjpUIS');
  }

  cardNumberChange(event) { 
    this.card.cardType = "N/R"

    const number = event.target.value;

    let hasOnlyNumbers = /^\d+$/.test(number);

    if (!hasOnlyNumbers) {
      event.target.value = number.substring(0, number.length - 1)
      return
    }

    if (number.length > 1) {
      const first = number.charAt(0)
      const second = number.charAt(1)
      if (first == "3") {
        this.card.cardType = "American Express"
        return
      }
      if (first == "4") {
        this.card.cardType = "Visa"
        return
      }
      if (first == "5" && (second == "1" || second == "2" || second == "3" || second == "4" || second == "5" )) {
        this.card.cardType = "Master Card"
        return
      }
    }
  }

  async postPayment() { 

  }
  
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
    }
  }

  
}
