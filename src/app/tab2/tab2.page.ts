import { Component } from '@angular/core';
import { PaymentService } from "../services/payment.service";
import { Stripe, loadStripe, StripeElements, StripeElement, StripeCardElement } from '@stripe/stripe-js';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { HttpClient, } from '@angular/common/http';


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

  stripe: Stripe
  elements: StripeElements
  card: StripeCardElement


  payment = {
    name: '',
    email: '',
    stripeToken: '',
    currency: 'MXN',
    amount: 0.00
  }

  constructor(public LoadingController: LoadingController,
    public AlertController: AlertController,
    public http: HttpClient) {
    this.getStripe();
  }

  async getStripe() {
    this.stripe = await loadStripe('pk_test_51GzR5gAWTVCAHbZ1UioBlpVWzhEJQTXbfHOLxB44526U1t8Mg2uDjNGZ9m6IZ1uLIWdCvmq1UdP5WpnTShWfmVsG00sola1wdz');
    this.elements = this.stripe.elements();
    this.card = this.elements.create('card');
    this.card.mount('#card-element');
  }

  async onSubmit() {
    const loading = await this.LoadingController.create({
      message: 'Cargando informacion'
    });
    try {
      await loading.present();
      if(this.payment.name == "")
        throw "Favor de indicar el nombre"
      if(this.payment.email == "")
        throw "Favor de indicar el correo"

      const res = await this.stripe.createToken(this.card);
      if (res.error) 
          throw res.error
      else 
          this.stripeTokenHandler(res.token);
      
      const errorAlert = await this.presentAlert("Exito","Pago Stripe", "Se ha generado con exito el pago de stripe");
      errorAlert.present();
    } catch (error) 
    {
      const errorAlert = await this.presentAlert("Error","Pago Stripe", error);
      errorAlert.present();
    } finally
    {
      loading.dismiss();
    }

  }

  async stripeTokenHandler(token) {
    try {
          this.payment.stripeToken = token.id;
          console.log(this.payment)


          var headers = new Headers();
          headers.append("Accept", 'application/json');
          headers.append('Content-Type', 'application/json' );
      
          let postData = {
                  "name": this.payment.name,
                  "email": this.payment.email,
                  "stripeToken": this.payment.stripeToken,
                  "amount": this.payment.amount,
                  "currency": this.payment.currency,
          }

          this.http.post("http://www.lainsoftware.com/Api/Stripe/Charge", postData)
          .subscribe(data => {
            console.log(data)
           }, error => {
            throw error
          });
      } catch (error) {
          throw error
      }
    }

    async presentAlert(Header: string, SubHeader: string, Message: string) {
      const alert = await this.AlertController.create({
        header: Header,
        subHeader: SubHeader,
        message: Message,
        buttons: ['OK']
      });
  
      return alert;
    }
}
