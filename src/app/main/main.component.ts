import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/service/report.service'
import Swal from 'sweetalert2';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, NgForm } from '@angular/forms';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private service: ReportService,private route:AppRoutingModule) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.service.startApi().subscribe(
      (data:any)=>{
        this.isLoading = false;
      },
      (error:any)=>{
        this.isLoading = false;
      }
    );
  }
  isProgress:boolean = false;
  isLoading:boolean = false;
  public user = {
    address: 'boudh',
    vehicleNumber: '',
    grossWeight: '',
    tareWeight: '',
    grossWeightDate:'',
    tareWeightDate: '',
    checked:false
  }

  formSubmit(reportForm : NgForm) {
    if (this.user.tareWeight >= this.user.grossWeight) {
      Swal.fire({
        position: 'top-end',
        showConfirmButton: false,
        timer: 7000,
        title: 'Error &#10060;',
        text: 'Tare Weight can not be more than or same as Gross Weight'
      })
      return;
    }
    this.isProgress = true;

    this.service.generatePdf(this.user).subscribe(
      (data: any) => {
        // let blob:any = new Blob([data], { type: 'text/json; charset=utf-8' });
        // const url = window.URL.createObjectURL(blob);
        // window.open(url);
        // window.location.href = data.url;
        
        // console.log(data);
        // alert('Success');

        let blob: any = new Blob([data], { type: 'application/pdf' });

        var today = new Date();
        let count = 0;
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var ss = String(today.getSeconds);
        var yyyy = String(today.getFullYear());
        let date = dd + '-' + mm + '-' + yyyy;

        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "Weight Slip_" + date+ ".pdf";
        link.click();
        this.isProgress = false;
        Swal.fire({
          icon: 'success',
          title: 'Success &#128540;',
          text:'File has been Downloaded',
          timer: 6000
        }).then(() => {
          // this.service.refresh();
          reportForm.controls['vehicleNumber'].reset();
          reportForm.controls['grossWeight'].reset();
          reportForm.controls['grossWeightDate'].reset();
          reportForm.controls['tareWeight'].reset();
          reportForm.controls['tareWeightDate'].reset();
          reportForm.controls['checked'].reset();
        })
      },
      (error) => {
        this.isProgress = false;
        // console.log(error);
        // alert('Something Went Wrong !!');
        Swal.fire({
          icon: 'error',
          title: 'Oops... &#10071;',
          text: 'Something went wrong!',
          showConfirmButton: false,
          timer: 4000
        }).then(() => {
          // this.service.refresh();
          // reportForm.reset();
          reportForm.controls['vehicleNumber'].reset();
          reportForm.controls['grossWeight'].reset();
          reportForm.controls['grossWeightDate'].reset();
          reportForm.controls['tareWeight'].reset();
          reportForm.controls['tareWeightDate'].reset();
          reportForm.controls['checked'].reset();
        })
      }
    )
  }
}
