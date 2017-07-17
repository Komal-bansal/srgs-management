import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppreciationService } from '../../../providers/appreciation.service';
import { CommonService } from '../../../providers/common.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

declare let $: any;
@Component({
  selector: 'add-appreciation',
  templateUrl: './add.html',
  styleUrls: ['./../appreciation.component.css']
})

export class AddAppreciation {
  public title: string = "New Appreciation";
  public appreciation: FormGroup;
  public submitProgress: boolean = false;
  public stan: any;
  standards: any = [];
  public standardId: any;
  students: any = [];
  subjects: any = [];
  constructor(private appreciationService: AppreciationService,
    private commonService: CommonService,
    public router: Router,
  ) {
    this.getStandards();
    // this.getStudents(a);
  }

  ngOnInit() {
    this.initForm();
  }

  public initForm() {
    this.appreciation = new FormGroup({
      description: new FormControl('', [Validators.required, Validators.maxLength(2500)]),
      studentId: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      standardId: new FormControl('', [Validators.required]),


    });
  }
  submitAppreciation() {
    // this.submitProgress = true;
    this.appreciationService.postAppreciation(this.appreciation.value).subscribe((res) => {
      // this.submitProgress = false;
      this.initForm();
      $('#appreciationModal').modal('show');
    }, (err) => {
      this.router.navigate(['/error']);

    });
  }
  public getStandards() {
    // this.nl.showLoader();
    this.appreciationService.getStandards().subscribe((res) => {
      if (res.status === 204) {
        this.standards = null;
        return;
      }
      this.standards = res;
      console.log(this.standards.standardId);
    }, (err) => {
      this.router.navigate(['/error']);
    });
  }


  selectStandards(stan: any) {
    this.standardId = stan;
    this.getStudents();
  }

  public getStudents() {
    // this.nl.showLoader();
    this.appreciationService.getStudents(this.standardId).subscribe((res) => {
      this.students = res;
    }, (err) => {
      this.router.navigate(['/error']);
    });

  }

}