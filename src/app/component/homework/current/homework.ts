import { Component, OnInit } from '@angular/core';
import { HomeworkService } from '../../../providers/homework.service';
import { Router } from '@angular/router';

@Component({
  selector: 'current-homework',
  templateUrl: './homework.html',
  styleUrls: ['./../homework.component.css']
})

export class CurrentHomework implements OnInit {
  public selectedHomework: any;
  public fileUrl: string;
  public title: string = "Homework";
  public icon: string = "book";
  public currentPage = 1;
  public homeworks: any = [];
  loader: boolean = false;
  public EmptyHomeworks: boolean = false;
  monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];


  constructor(private homeworkService: HomeworkService,
    public router: Router) { }

  ngOnInit(): void {
    this.fileUrl = localStorage.getItem("fileUrl") + "/";
    this.getHomeworks();
  }

  public getHomeworks() {
    // this.nl.showLoader();
    this.loader = true;
    this.homeworkService.getHomework(this.currentPage).subscribe((data) => {
      this.onSuccess(data);
    }, (err) => {
      this.loader = false;
      this.router.navigate(['/error']);
    });
  }

  public noMore: boolean = false;
  public onSuccess(res: any) {
    // this.nl.hideLoader();
    this.loader = false;
    if (res.status === 204) {
      this.EmptyHomeworks = true;
    } else {
      this.EmptyHomeworks = false;
      this.homeworks = res;
      if (this.homeworks.length < 10) this.noMore = true;
      else this.noMore = false;
      this.homeworks.forEach((data: any) => {
        data.dueMonth = this.monthNames[(new Date(data.dueDate)).getMonth()];
        data.dueDate = ("0" + (new Date(data.dueDate).getDate())).slice(-2);
      });
    }
  }

  public onError(err: any) {
    this.loader = false;
    this.router.navigate(['/error']);
  }

  public previousHomework() {
    delete this.homeworks;
    this.currentPage -= 1;
    this.getHomeworks();
  }

  public nextHomework() {
    delete this.homeworks;
    this.currentPage += 1;
    this.getHomeworks();
  }

  public seletToExpand(a: any) {
    this.selectedHomework = a;
  }

}
