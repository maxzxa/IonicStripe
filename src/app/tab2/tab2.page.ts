import { Component } from '@angular/core';
import { PaymentService } from "../services/payment.service";
import { Stripe, loadStripe, StripeElements, StripeElement, StripeCardElement } from '@stripe/stripe-js';
import { LoadingController, Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { HttpClient, } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';


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
    public http: HttpClient,
    public nativeHttp: HTTP,
    public Platform: Platform) {
    //Don't check SSL Certificate
    this.nativeHttp.setServerTrustMode('nocheck');
    this.nativeHttp.setHeader('*', 'Access-Control-Allow-Origin', '*');
    this.nativeHttp.setHeader('*', 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    this.nativeHttp.setHeader('*', 'Accept', 'application/json');
    this.nativeHttp.setHeader('*', 'content-type', 'application/json');
    //Important to set the data serializer or the request gets rejected
    this.nativeHttp.setDataSerializer('json');
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
      this.payment.name = ''
      this.payment.email = ''
      this.payment.stripeToken = ''
      this.payment.amount = 0.00
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

          let postData = {
                  "name": this.payment.name,
                  "email": this.payment.email,
                  "stripeToken": this.payment.stripeToken,
                  "amount": this.payment.amount,
                  "currency": this.payment.currency,
          }
      

        if (this.Platform.is('android') || this.Platform.is('ios'))
        {
          const res = await this.nativeHttp.post("http://www.lainsoftware.com/Api/Stripe/Charge", postData, {});
        }
        else
        {
          this.http.post("http://www.lainsoftware.com/Api/Stripe/Charge", postData)
            .subscribe(data => {
              console.log(data)
            }, error => {
              throw error
            });
        }
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
