import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-api-integration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-integration.component.html',
  styleUrl: './api-integration.component.css'
})
export class ApiIntegrationComponent {

 productsList:any[] = [];

 constructor(private http: HttpClient){

 }

 getAllProducts(){
  debugger;
   this.http.get("https://jsonplaceholder.typicode.com/posts").subscribe((res:any)=>{
     this.productsList = res;
     console.log(this.productsList);
   })
 }

}
