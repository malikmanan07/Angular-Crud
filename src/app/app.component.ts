import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeModel } from './model/Employee';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
employeeForm : FormGroup = new FormGroup({});
employeeObj : EmployeeModel = new EmployeeModel();
employeeList : EmployeeModel[] = [];

constructor(){
  this.createForm();
 
  const oldData = localStorage.getItem("EmpData");
  if(oldData != null) {
    const parseData = JSON.parse(oldData);
    this.employeeList = parseData;
  }
}


createForm(){
  this.employeeForm = new FormGroup({
  empId : new FormControl(this.employeeObj.empId),
  name : new FormControl(this.employeeObj.name,[Validators.required]),
  city : new FormControl(this.employeeObj.city),
  address : new FormControl(this.employeeObj.address),
  contactNo : new FormControl(this.employeeObj.contactNo),
  emailId : new FormControl(this.employeeObj.emailId),
  pinCode : new FormControl(this.employeeObj.pinCode,[Validators.required,Validators.minLength(6)]),
  state : new FormControl(this.employeeObj.state),


  })
}

onSave(){
  debugger;
  const oldData = localStorage.getItem("EmpData")
  if(oldData != null){
    const parseData = JSON.parse(oldData);
    this.employeeForm.controls['empId'].setValue(parseData.length + 1);
    this.employeeList.unshift(this.employeeForm.value);
  }
  else{
    this.employeeList.unshift(this.employeeForm.value);
  }
  localStorage.setItem("EmpData",JSON.stringify(this.employeeList));

}

onEdit(item : EmployeeModel){
  this.employeeObj = item;
  this.createForm();

}
onUpdate(){
  debugger
  const record = this.employeeList.find(m=>m.empId == this.employeeForm.controls['empId'].value);
  if(record != undefined){
    record.address = this.employeeForm.controls['address'].value;
    record.name = this.employeeForm.controls['name'].value;
    record.contactNo = this.employeeForm.controls['contactNo'].value;
    record.emailId = this.employeeForm.controls['emailId'].value;
    record.state = this.employeeForm.controls['state'].value;
    record.pinCode = this.employeeForm.controls['pinCode'].value;



  }
  localStorage.setItem("EmpData",JSON.stringify(this.employeeList));
  this.employeeObj = new EmployeeModel();
  this.createForm();

}

onDelete(id: number): void {
  debugger;
  // Step 1: Get the array from localStorage
  const storedItems = localStorage.getItem('EmpData');
  if (storedItems) {
    let itemsArray = JSON.parse(storedItems); // Convert the stored string back to an array

    // Step 2: Filter out the object with the specified id
    // itemsArray = itemsArray.filter((item: any) => item.empId !== id);
    const index = itemsArray.findIndex((item: any) => item.empId === id);

    if (index !== -1) {
      this.employeeList.splice(index, 1);
      itemsArray.splice(index, 1); // Removes the object at the specified index
    }


    // Step 3: Save the updated array back to localStorage
    localStorage.setItem('EmpData', JSON.stringify(itemsArray));
    console.log(`Item with id ${id} removed from localStorage.`);
  }
}
}
