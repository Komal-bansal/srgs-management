import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CircularService } from '../../../providers/circular.service';
import { CommonService } from '../../../providers/common.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

declare let $: any;

@Component({
  selector: 'add-circular',
  // selector: 'add',
  templateUrl: './add.html'
})
export class AddCircular implements OnInit, AfterViewInit {

  public circular: FormGroup;
  public title: string = 'Add Circular';
  public newCircular: any;
  public standards: any;
  public emptyStandards = false;
  public circularType: any;
  public file: any;
  public loader: boolean = false;
  public submitProgress: boolean = false;
  constructor(private circserv: CircularService,
    private commonService: CommonService,
    private _location: Location,
    public router: Router, ) { }

  ngOnInit() {
    this.circular = this.initForm();
  }

  onDueDate(e: any) {
    if (new Date(e.target.value) < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
      alert("Please choose an upcoming date from the calendar.");
      this.circular.controls['date'].patchValue(this.commonService.getTomorrow());
    }
  }

  ngAfterViewInit() {
    this.getCircularInfo();
    this.getStandards();
  }

  public initForm() {
    return new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      date: new FormControl(this.commonService.getTomorrow(), [Validators.required]),
      circularTypeId: new FormControl('', [Validators.required]),
      file: new FormControl('')
      // standardIds: new FormControl([], [Validators.required])
    });
  }

  // public getStandards() {
  //   this.loader = true;
  //   this.standards = this.commonService.getData("standards");
  //   if (typeof (this.standards) === 'undefined') {
  //     this._getStandards();
  //   }
  //   this.loader = false;
  // }

  public getStandards() {

    this.loader = true;
    this.circserv.getStandards().subscribe((res) => {
      if (res.status === 204) {
        this.standards = null;
        this.loader = false;
        return;
      }
      this.standards = res;
      this.commonService.storeData("standards", res);
      this.loader = false;
    }, (err) => {
      this.loader = false;
      this.router.navigate(['/error']);
    });
  }

  // public getCircularInfo() {
  //   this.loader = true;
  //   let circularInfo = this.commonService.getData("circularInfo");
  //   if (typeof (circularInfo) == "undefined") {
  //     this._getCircularInfo();
  //     this.loader = false;
  //   } else {
  //     this.buildCircularData(circularInfo);
  //     this.loader = false;
  //   }
  // }

  public getCircularInfo() {
    this.loader = true;
    this.commonService.getCircularInfo().subscribe((res) => {
      this.buildCircularData(res);
      console.log("cir",res);
      this.commonService.storeData("circularInfo", res);
      this.loader = false;
    }, (err) => {
      this.loader = false;
      this.router.navigate(['/error']);
    });
  }

  public buildCircularData(circular: any) {
    this.circularType = circular;
    // console.log("cir",this.circularType);
  }

  public onCircularType(event: any) {
    if (event == "1") {
      this.circular.removeControl("standardIds");
      this.standard = [];
      this.emptyStandards = true;
    } else if (event == "2") {
      this.circular.addControl("standardIds", new FormControl('', [Validators.required]));
      this.emptyStandards = false;
    }
    // this.circular.controls['standardIds'].reset();
  }

  public circularSubmit() {
    this.submitProgress = true;

    let formData = new FormData();
    console.log('circular', this.circular.value);
    console.log('file', this.file);
    formData.append('title', this.circular.value['title']);
    formData.append('description', this.circular.value['description']);
    formData.append('circularTypeId', this.circular.value['circularTypeId']);
    if (!this.emptyStandards) {
      formData.append('standardIds', this.circular.value['standardIds']);
    }
    formData.append('date', this.circular.value['date']);
    formData.append('file', this.file);
    this.onSubmit(formData);
    this.submitProgress = false;
  }
  stdIds: any = [];
  standard: any;

  selectStandards(e: any) {
    this.stdIds = [];
    e.forEach((element: any) => {
      this.stdIds.push(element.id);
    });

    this.circular.controls['standardIds'].patchValue(this.stdIds);
  }

  public onSubmit(formData: any) {
    this.loader = true;
    this.circserv.PostCircular(formData).subscribe((data) => {
      console.log("submit", this.circular.value);
      this.submitProgress = false;
      this.circular = this.initForm();
      this.loader= false;
      $('#circularModal').modal('show');
    }, (err) => {
      this.loader = false;
      this.router.navigate(['/error']);
    });
  }

    getFile(event: any) {
    var blob = event.srcElement.files[0];
    console.log(blob.type);
    if(blob.type=="image/png" || blob.type=="image/jpeg" || blob.type=="image/jpg"){
      this.file = event.srcElement.files[0];
    }
    else{
       $('#errorModal').modal('show');
      this.circular.controls.file.reset();
    }
  }
}