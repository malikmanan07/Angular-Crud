import { Component,NgModule  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeModel } from './model/Employee';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, delay } from 'rxjs';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ApiIntegrationComponent } from './components/api-integration/api-integration.component';
// import {Pipe } from '@angular/core';  



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule,CommonModule,FormsModule,ApiIntegrationComponent  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  name: string = 'name';
  employeeForm: FormGroup = new FormGroup({});
  employeeObj: EmployeeModel = new EmployeeModel();
  employeeList: EmployeeModel[] = [];
  private countSubject = new BehaviorSubject<number>(0); // Initialize BehaviorSubject with a default value
  count$ = this.countSubject.asObservable(); // Create an observable from the BehaviorSubject

  constructor() {
    this.createForm();
    const oldData = localStorage.getItem("EmpData");
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
    }  
  }
  incrementCount() {
    delay(1000);
    let currentValue = this.countSubject.value;
    this.countSubject.next(currentValue + 1); // Increment the count
  }
  startIncrementing() {
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        this.incrementCount();
      }, i * 300); // Delay of 1000ms (1 second) between increments
    }
  }
  
  
  createForm() {
    this.employeeForm = new FormGroup({
      empId: new FormControl(this.employeeObj.empId),
      name: new FormControl(this.employeeObj.name, [Validators.required]),
      city: new FormControl(this.employeeObj.city, [Validators.required, Validators.minLength(3)]), // Added validation
      address: new FormControl(this.employeeObj.address, [Validators.required]),
      contactNo: new FormControl(this.employeeObj.contactNo, [
        Validators.required,
        Validators.pattern(/^[0-9]{11}$/) // Ensuring a 10-digit phone number
      ]),
      emailId: new FormControl(this.employeeObj.emailId, [
        Validators.required,
        Validators.email // Validating email format
      ]),
      pinCode: new FormControl(this.employeeObj.pinCode, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)
      ]),
      state: new FormControl(this.employeeObj.state, [Validators.required]),
    });
  }
  
  onSave() {
    debugger;
    if (this.employeeForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.employeeForm.markAllAsTouched();
      return;
    }

   
    const oldData = localStorage.getItem("EmpData");
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeForm.controls['empId'].setValue(parseData.length + 1);
      this.employeeList.unshift(this.employeeForm.value);
    } else {
      this.employeeForm.controls['empId'].setValue(1); // Set empId if no data is present
      this.employeeList.unshift(this.employeeForm.value);
    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
    this.resetForm(); // Reset the form after saving
  }

  resetForm() {
    this.employeeForm.reset(); // Reset the form to its initial state
  }

  onEdit(item: EmployeeModel) {
    this.employeeObj = item;
    this.createForm();
  }

  onUpdate() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const record = this.employeeList.find(m => m.empId == this.employeeForm.controls['empId'].value);
    if (record != undefined) {
      record.address = this.employeeForm.controls['address'].value;
      record.name = this.employeeForm.controls['name'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
      record.emailId = this.employeeForm.controls['emailId'].value;
      record.state = this.employeeForm.controls['state'].value;
      record.pinCode = this.employeeForm.controls['pinCode'].value;
      record.city = this.employeeForm.controls['city'].value;

    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
    this.resetForm();
  }

  onDelete(id: number): void {
    debugger;
    const storedItems = localStorage.getItem('EmpData');
    if (storedItems) {
      let itemsArray = JSON.parse(storedItems);

      const index = itemsArray.findIndex((item: any) => item.empId === id);

      if (index !== -1) {
        this.employeeList.splice(index, 1);
        itemsArray.splice(index, 1);
      }

      localStorage.setItem('EmpData', JSON.stringify(itemsArray));
      console.log(`Item with id ${id} removed from localStorage.`);
    }
  }
}
