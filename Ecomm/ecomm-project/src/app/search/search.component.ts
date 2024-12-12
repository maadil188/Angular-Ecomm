import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchResult: product[] | undefined;

  constructor(private activeRoute: ActivatedRoute, private product: ProductService) {}

  ngOnInit(): void {
    const query = this.activeRoute.snapshot.paramMap.get('query');
    console.warn(query);
    if (query) {
      this.product.searchProducts(query).subscribe((result) => {
        this.searchResult = result.filter(item =>
          item.name.toLowerCase().includes(query!.toLowerCase()) ||
          item.color.toLowerCase().includes(query!.toLowerCase())
        );
      });
    }
  }
}
