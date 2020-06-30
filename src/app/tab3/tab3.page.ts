import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  transactions: any[]
  constructor(public Http: HttpClient,
    public LoadingController: LoadingController) {
      this.loadInfo();
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
      await this.Http.get("http://www.lainsoftware.com/Api/Stripe/GetCharges")
        .subscribe(res => {
          this.transactions = res["data"];
          this.transactions.forEach(async transaction => {
             await this.getCustomer(transaction, transaction.customer)
          })
      }, error => {
        throw error;
      });
    } catch (error) {
      
    } finally {
      loading.dismiss();
    }
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
