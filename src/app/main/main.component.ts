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

  constructor(private service: ReportService, private route: AppRoutingModule) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.service.startApi().subscribe(
      (data: any) => {
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
      }
    );
  }
  isProgress: boolean = false;
  isLoading: boolean = false;
  public user = {
    address: 'BOUDH',
    vehicleNumber: '',
    grossWeight: '',
    tareWeight: '',
    grossWeightDate: '',
    tareWeightDate: '',
    checked: false
  }

  formSubmit(reportForm: NgForm) {
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

        let byteArray = data.byteData;
        let fileName = data.fileName;

        const linkSource = `data:application/pdf;base64,${byteArray}`;
        const downloadLink = document.createElement("a");
        const pdfFileName = fileName;
        downloadLink.href = linkSource;
        downloadLink.download = pdfFileName;
        downloadLink.click();


        this.isProgress = false;
        Swal.fire({
          icon: 'success',
          title: 'Success &#128540;',
          text: 'File has been Downloaded',
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
