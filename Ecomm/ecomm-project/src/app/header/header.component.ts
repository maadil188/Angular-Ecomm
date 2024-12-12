import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuType: String = 'default';
  SellerName: string = '';
  searchResult: product[] = [];
  userName: string="";
  cartItems = 0;

  constructor(private route: Router, private product: ProductService) {}

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          let sellerStore = localStorage.getItem('seller');
          let sellerData = sellerStore && JSON.parse(sellerStore)[0];
          this.SellerName = sellerData.name;
          this.menuType = 'seller';
        } else if(localStorage.getItem('user')){
          let userStore = localStorage.getItem('user');
          let userdata = userStore && JSON.parse(userStore);
          this.userName = userdata.name;
          this.menuType = 'user';
          this.product.getCartList(userdata.id);
        } else {
          this.menuType = 'default';
        }
      }
    });

    let cartData = localStorage.getItem('localCart');
    if(cartData){
      this.cartItems = JSON.parse(cartData).length
    }

    this.product.cartData.subscribe((items)=>{
      this.cartItems = items.length
    })
  }

  logout() {
    localStorage.removeItem('seller');
    this.route.navigate(['/']);
  }

  userLogout(){
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth']);
    this.product.cartData.emit([]);
  }

  searchProduct(event: KeyboardEvent) {
    const element = event.target as HTMLInputElement;
    const query = element.value.toLowerCase();
    
    if (query) {
      this.product.searchProducts(query).subscribe((result) => {
        this.searchResult = result.filter(product => 
          product.name.toLowerCase().includes(query) || product.color.toLowerCase().includes(query)
        ).slice(0, 5); // Filter and limit to 5 results
      });
    } else {
      this.searchResult = []; // Clear results if query is empty
    }
  }

  hideSearch() {
    this.searchResult = [];
  }
  redirectToDetails(id:number){
    this.route.navigate(['/details/'+id]);
  }
  submitSearch(val: string) {
    this.route.navigate([`search/${val}`]);
  }
}
