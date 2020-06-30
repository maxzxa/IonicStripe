import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  transactions: any[]
  constructor(public Http: HttpClient,
    public LoadingController: LoadingController,
    public nativeHttp: HTTP,
    public Platform: Platform) {
      this.loadInfo();
      //Don't check SSL Certificate
      this.nativeHttp.setServerTrustMode('nocheck');
      this.nativeHttp.setHeader('*', 'Access-Control-Allow-Origin', '*');
      this.nativeHttp.setHeader('*', 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      this.nativeHttp.setHeader('*', 'Accept', 'application/json');
      this.nativeHttp.setHeader('*', 'content-type', 'application/json');
      //Important to set the data serializer or the request gets rejected
      this.nativeHttp.setDataSerializer('json');
  }

  async doRefresh(event){
    await this.loadInfo();
    event.target.complete();
  }

  async loadInfo() {
    const loading = await this.LoadingController.create({
      message: 'Cargando informacion'
    });
    try {
      loading.present();
      

      if (this.Platform.is('android') || this.Platform.is('ios'))
      {
        const res = await this.nativeHttp.get('http://www.lainsoftware.com/Api/Stripe/GetCharges', {}, {})
        const response = JSON.parse(res.data)
        this.transactions = response.data;
        this.transactions.forEach(async transaction => {
          await this.getCustomerNative(transaction, transaction.customer)
        })
      }
      else 
      {
        await this.Http.get("http://www.lainsoftware.com/Api/Stripe/GetCharges")
        .subscribe(res => {
          this.transactions = res["data"];
          this.transactions.forEach(async transaction => {
            await this.getCustomer(transaction, transaction.customer)
          })
        }, error => {
          throw error;
        });
      }
    } catch (error) {
      
    } finally {
      loading.dismiss();
    }
  }

  async getCustomerNative(transaction, CustomerId) {
    const res = await this.nativeHttp.get("http://www.lainsoftware.com/Api/Stripe/GetCustomer?id=" + CustomerId, {}, {})
    const response = JSON.parse(res.data)
    console.log(response)
    transaction.customerObject = response
    return transaction;
  }

  async getCustomer (transaction, CustomerId) {
    this.Http.get("http://www.lainsoftware.com/Api/Stripe/GetCustomer?id=" + CustomerId)
    .subscribe(res => {
      transaction.customerObject = res
      return transaction;
     }, error => {
      console.log(error);
    });
  }
}
